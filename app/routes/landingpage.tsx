import type { Route } from "./+types/landingpage";
import { Form } from "react-router";

type ActionData =
  | { success: true; message: string }
  | { success?: false; error: string };

export const meta = ({}: Route.MetaArgs) => {
  return [
        {title: "Kampus Konnect - Find Campus Vendors Close to You"},
        {name: "description", content: "Join Kampus Konnect to easily find and connect with campus vendors close to you. Sign up for our waitlist today!",},
        {name: "keywords", content: "Kampus Konnect, campus vendors, WhatsApp, student marketplace, vendor marketplace, Nigeria, waitlist, connect, sell, grow"}
    ];
};

export async function action({ request} : Route.ActionArgs) {
    // TODO: Implement rate limiting to prevent abuse
    const formData = await request.formData();
    const userEmail = formData.get("email");
    if (typeof userEmail !== "string" || userEmail.length === 0) {
      return { error: "Email is required.", success: false };
    }

    // Send email to Brevo API
    try {
        // TODO: Check that env vars are defined 
        if (!process.env.BREVO_API_KEY || !process.env.BREVO_LIST_ID) {
            return { error: "Missing environment variables.", success: false };
        }

        const response = await fetch("https://api.brevo.com/v3/contacts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "api-key": `${process.env.BREVO_API_KEY}`
            },
            body: JSON.stringify({
                email: userEmail,
                listIds: [Number(process.env.BREVO_LIST_ID)],
                updateEnabled: false
            })
        });

        if (!response.ok) {
            console.error("Brevo API response:", await response.text());
            return { error: "Failed to join the waitlist. Please try again later.", success: false };
        }
    } catch (err) {
        console.error("Error contacting Brevo API:", err);
        return { error: "Failed to join the waitlist. Please try again later.", success: false };
    }

    return { message: "Successfully joined the waitlist!", success: true };
}

export default function LandingPage( { actionData }: Route.ComponentProps) {
  return (
    <div className="min-h-dvh bg-[#0B0C10] flex flex-col">
        <header className="px-4 flex justify-start items-center md:justify-center border-b border-[#ffffff1a]">
            <img src="/logo/logo.svg" alt="Kampus Konnect Logo" className="h-16 w-16 mr-1" />
            <h1 className="hidden md:block font-[700] text-[#48FF6B] text-2xl font-[Oswald]">KampusKonnect</h1>
        </header>

        <main className="flex flex-col items-center max-w-[720px] mx-auto px-6 pt-12 pb-16 md:py-20 flex-grow">
            <h2 className="font-[800] mb-8 lg:mb-10 text-[40px] leading-[1.3] text-white text-center">
                Find campus vendors you can reach on WhatsApp —{" "}
                <span className="text-[#48FF6B]">fast.</span>
            </h2>
            <p className="text-[#ffffffb3] mb-10 text-center">
                We’re building Nigeria’s first student + vendor marketplace. <br />
                Join the waitlist and be the first to connect, sell, and grow when we launch.
            </p>

            {/* The form */}
            <Form method="post" className="w-full">
                {actionData?.success ? (
                    <p className="text-green-400 mb-2 text-center text-xs">{actionData.message}</p>
                ) : actionData?.error ? (
                    <p className="text-red-400 mb-2 text-center text-xs">{actionData.error}</p>
                ) : null}
                <div className="flex flex-col lg:flex-row items-center w-full gap-2 lg:gap-0">
                    <input 
                        type="email" 
                        name="email"
                        placeholder="Enter your email" 
                        className="w-full flex-2 p-4 rounded-md md:rounded-s-md border border-[#ffffff1a] bg-transparent text-white placeholder:text-[#ffffff80]" 
                        required
                    />
                    <button type="submit" className="flex-1 w-full lg:px-6 py-3 lg:py-4 bg-[#48FF6B] text-black font-[600] rounded-md md:rounded-e-md hover:bg-[#3eda5c] transition-colors">Join Waitlist</button>
                </div>
            </Form>

            <p className="text-[#ffffff80] mt-2 text-xs">
                We respect your privacy. You can unsubscribe at any time
            </p>
        </main>

        <footer className="w-full text-center text-sm border-t border-[#ffffff1a] mt-auto py-4 text-[#ffffff80]">
            © 2025 Kampus Konnect · All Rights Reserved
        </footer>
    </div>
  );
}