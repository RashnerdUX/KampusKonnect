// Embed a Google Form here
import { useState } from "react"
import type { Route } from "./+types/store.verification"
import { requireAuth } from "~/utils/requireAuth.server"
import { data, Form, redirect, useNavigation } from "react-router"
import CustomFormInput from "~/components/auth/CustomFormInput"
import { Resend } from 'resend'
import ButtonSpinner from "~/components/ButtonSpinner"

export const meta = () => {
    return [
        { title: "Store Verification for Vendors - Campex"},
    ]
}

export const loader = async ({request}:Route.LoaderArgs) => {

    // Get user details
    const { user, supabase, headers } = await requireAuth(request);

    const [profile, store, categories ] = await Promise.all(
        [
             supabase
            .from("user_profiles")
            .select(`
                *, 
                universities(name)
            `)
            .eq("id", user.id)
            .maybeSingle(),

            supabase
            .from('stores')
            .select(`
            id,
            business_name,
            description,
            logo_url,
            header_url,
            verified_badge,
            category:store_categories(id, name)
            `)
            .eq('user_id', user.id)
            .single(),

            supabase
            .from('store_categories')
            .select('id, name')
            .order('name'),
        ]
    )

    if (profile.error || store.error || categories.error) {
        throw new Response("Failed to retrieve profile information", {status: 500})
    }

    return data(
        {
            profile: profile.data,
            store: store.data,
            categories: categories.data,
        },
        {headers}
    );
}

export const action = async ({request}: Route.ActionArgs) => {
    // Get form
    const formData = await request.formData()

    // 1. Extract data from your React Form
  const submission = {
    storeName: formData.get("storeName"),
    ownerName: formData.get("ownerName"),
    category: formData.get("storeCategory"),
    whatsapp: formData.get("whatsappNumber"),
    email: formData.get("emailAddress"),
    university: formData.get("universityAffliation"),
  };

    // Get the files
    const idCard = formData.get("ID-card") as File;
    const transactionProofs = formData.getAll("transaction-proof") as File[];

    if (transactionProofs.length > 5){
        return { error: "Please limit your proof of transactions to 5 files. Thank You"};
    };

    const { user, supabase } = await requireAuth(request);

    // Keep the paths for retrieval
    let allPaths = []

    // Prepare the ID Card upload
    const idCardPath = `${user.id}/vendor/IDCard-${Date.now()}`;
    allPaths.push(idCardPath)
    const idCardPromise = supabase.storage
        .from("verification-documents")
        .upload(idCardPath, idCard);

    // Multiple transactions
    const transactionPromises = transactionProofs.map((file, index) => {
        // Unique path for each file in the array
        const path = `${user.id}/vendor/transactions/proof-${index}-${Date.now()}`;

        // Store the path
        allPaths.push(path)

        return supabase.storage
            .from("verification-documents")
            .upload(path, file);
    });

    // Execute all uploads at once
    const results = await Promise.all([idCardPromise, ...transactionPromises]);

    // Catch errors
    const errors = results.filter(res => res.error);
    if (errors.length > 0) {
        console.error("Upload errors:", errors);
        // Handle error state here
    }

    // Get the signedUrls with 1 week validity
    const SEVEN_DAYS_IN_SECONDS = 60 * 60 * 24 * 7;
    const { data: signedData, error: signedError } = await supabase.storage
        .from("verification-documents")
        .createSignedUrls(allPaths, SEVEN_DAYS_IN_SECONDS);

    if (signedError) {
        throw new Error("Failed to generate signed URLs");
    }

    console.log("Signed urls", signedData)

    // Extract the URLs
    const idCardSignedUrl = signedData[0].signedUrl;
    const transactionSignedUrls = signedData.slice(1).map(item => item.signedUrl);

    // Join them all
    const transactionLinksString = transactionSignedUrls.join(", ");


  const resendApiKey = process.env.RESEND_API_KEY;

  if(!resendApiKey) {
    console.error("");
  };

  const resend = new Resend(resendApiKey);

  try {
    // Send email to Admins and alert them
    const {data:emailData, error:emailError} = await resend.emails.send({
      from: 'Campex Verification <info@shopwithcampex.com>',
      to: ['tomiwasamuel007@gmail.com', 'miracleoguche22@gmail.com', 'akhigbek6@gmail.com'],
      subject: `New Verification Request: ${submission.storeName}`,
      html: `
        <h1>New Vendor Verification</h1>
        <p><strong>Store:</strong> ${submission.storeName}</p>
        <p><strong>Owner:</strong> ${submission.ownerName}</p>
        <p><strong>Email:</strong> ${submission.email}</p>
        <p><strong>WhatsApp:</strong> ${submission.whatsapp}</p>
        <p><strong>University:</strong> ${submission.university}</p>
        <p><strong>ID Card:</strong> <a href="${idCardSignedUrl}">View ID</a></p>
        <p><strong>Transaction Proofs:</strong> ${transactionSignedUrls.map((url, i) => `<a href="${url}">Proof ${i+1}</a>`).join(' | ')}</p>
      `,
    });

    if (emailError){
        console.log("Failed to send verification to the admins via email", emailError)
        return { error: "Failed to submit. Please try again later"}
    }

    console.log("Email successfully sent", emailData)

    // 3.Send to Google Forms
    const googleFormUrl = "https://docs.google.com/forms/d/e/1FAIpQLSe1aJLcd4wdLz6_sQ3VLswVKwmQOY8lez5hSYNalFiZyK9-HA/formResponse";


    // For now, this won't work.
    const googleParams = new URLSearchParams();
    googleParams.append("entry.12345678", submission.storeName as string);
    googleParams.append("entry.87654321", submission.ownerName as string);
    googleParams.append("entry.11223344", submission.email as string);
    googleParams.append("entry.55667788", submission.whatsapp as string);
    googleParams.append("entry.99001122", submission.university as string);
    googleParams.append("entry.73878494", transactionLinksString);

    // We use "no-cors" because Google doesn't send back a CORS header
    const response = await fetch(googleFormUrl, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: googleParams,
    });

    if(response.status !== 200){
        console.error("Failed to submit to Google Forms")
        // TODO: For now, it should fail silently
        // return { error: "Failed to submit. Please try again later"}
    }

    return redirect("/vendor");

  } catch (error) {
    console.error("Submission error:", error);
    return { error: "Failed to process verification. Please try again." };
  }
};

const StoreVerificationPage = ({loaderData, actionData}: Route.ComponentProps) => {

    const { profile, store, categories } = loaderData;
    const { error } = actionData ?? {};
    const navigation = useNavigation()
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

    if (navigation.state === "submitting" && !isSubmitting){
        setIsSubmitting(true)
    } else if (navigation.state === "idle" && isSubmitting){
        setIsSubmitting(false)
    }


    // Create full name for user
    const fullName = profile?.first_name 
  ? `${profile.first_name} ${profile.surname}` 
  : "Your name";

  return (
    <main>
        <div className="flex flex-col gap-2 lg:gap-4">

            {/* The Hero Section */}
            <div className="flex flex-col gap-2 items-center justify-center rounded-2xl py-8 p-4 lg:px-20 bg-card h-auto">
                <h1 className="text-2xl lg:text-4xl font-bold text-foreground">
                    Vendor Verification
                </h1>
                <p className="text-sm lg:text-lg font-medium text-foreground/80 text-wrap text-center">
                    At Campex, our goal is to empower student commerce through a reliable and transparent marketplace. Building mutual trust is central to this mission; therefore, we ask that you complete a brief authenticity verification to help protect both buyers and sellers on the platform. 
                    Thanks as you comply.
                </p>
            </div>

            {/* The form */}
            <Form method="post" encType="multipart/form-data">
                <div className="flex flex-col gap-4 bg-card border border-border shadow-xs px-4 py-6 lg:px-20 lg:py-12 rounded-lg">

                    {/* Heading */}
                    <h1 className="mb-2 text-2xl lg:text-4xl font-bold"> Verification Form </h1>

                    {/* If there's an error */}
                    { error && <p className="text-xs text-red-600">{error}</p>}

                    {/* Business Name */}
                    <CustomFormInput 
                        type="text"
                        label="Store Name"
                        name="storeName"
                        defaultValue={store.business_name}
                        required
                    />

                    {/* Name of Business Owner */}
                    <CustomFormInput 
                        type="text"
                        label="Your Name"
                        name="ownerName"
                        defaultValue={fullName}
                        required
                    />

                    {/* Store Category */}
                    <CustomFormInput 
                        type="select"
                        label="Store Category"
                        name="storeCategory"
                        defaultValue={store.category.id}
                        options={categories.map((category) => ({
                            label: category.name, 
                            value: category.id 
                        }))}
                        required
                    />

                    {/* Whatsapp */}
                    <CustomFormInput 
                        type="tel"
                        label="WhatsApp Number"
                        name="whatsappNumber"
                        defaultValue={profile?.whatsapp_number ?? "Enter your WhatsApp number"}
                        required
                    />

                    {/* Email */}
                    <CustomFormInput 
                        type="email"
                        label="Email Address"
                        name="emailAddress"
                        defaultValue={profile?.email ?? "Enter your email address"}
                        required
                    />

                    {/* University Affliation */}
                    <CustomFormInput 
                        type="text"
                        label="University Affliation"
                        name="universityAffliation"
                        defaultValue={profile?.universities?.name ?? "Enter your university"}
                        required
                    />

                    {/* Upload Student ID Card */}
                    <label htmlFor="ID-card" className="block text-sm font-medium text-heading">
                        Upload your ID card
                    </label>
                    <input 
                        type="file" 
                        name="ID-card" 
                        id="ID-card" 
                        required
                        className="block w-full text-sm text-heading border border-border rounded-base cursor-pointer bg-foreground/10 focus:outline-none shadow-xs
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-l-base file:border-0
                            file:text-sm file:font-semibold
                            file:bg-foreground/20 file:text-heading
                            hover:file:bg-foreground/30" 
                    />

                    {/* Upload proof of transactions */}
                    <label htmlFor="transaction-proof" className="block text-sm font-medium text-heading">
                        Proof of Transactions (Max. of 5)
                    </label>
                    <input 
                        type="file" 
                        name="transaction-proof" 
                        id="transaction-proof"
                        required 
                        multiple
                        className="block w-full text-sm text-heading border border-border rounded-base cursor-pointer bg-foreground/10 focus:outline-none shadow-xs
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-l-base file:border-0
                            file:text-sm file:font-semibold
                            file:bg-foreground/20 file:text-heading
                            hover:file:bg-foreground/30" 
                    />

                    <div className="flex justify-end">
                        <button 
                            type="submit"
                            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg flex gap-2"
                            disabled={isSubmitting}
                        >
                            {isSubmitting && <ButtonSpinner />}
                            {isSubmitting ? "Submitting..." : "Submit for Verification" }
                        </button>
                    </div>
                </div>
            </Form>

        </div>
    </main>
  )
}

export default StoreVerificationPage;