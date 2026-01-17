import type { Route } from "./+types/waitlist_success";
import { Form, redirect } from "react-router";
import { ThemeToggle } from "~/components/ThemeToggle";

type ActionData =
  | { success: true; message: string }
  | { success?: false; error: string };

export const meta = ({}: Route.MetaArgs) => {
  return [
        {title: "Campex - Find Campus Vendors Close to You"},
        {name: "description", content: "Join Campex to easily find and connect with campus vendors close to you. Sign up for our waitlist today!",},
        {name: "keywords", content: "Campex, campus vendors, WhatsApp, student marketplace, vendor marketplace, Nigeria, waitlist, connect, sell, grow"}
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
            const responseJson = await response.json();

            // If the user is already on the list, treat it as a success and inform them
            if (responseJson.code === "duplicate_parameter") {
                return { message: "You are already on the waitlist! Sit back and we'll be in touch", success: true };
            }

            console.error("Brevo API response:", await response.text());
            return { error: "Failed to join the waitlist. Please try again later.", success: false };
        }
    } catch (err) {
        console.error("Error contacting Brevo API:", err);
        return { error: "Failed to join the waitlist. Please try again later.", success: false };
    }

    return redirect("/join-waitlist/success");
}

export default function LandingPage( { actionData }: Route.ComponentProps) {
  return (
    <div className="min-h-dvh bg-background flex flex-col">
        <header className="px-4 flex justify-start items-center md:justify-center border-b border-border">
            <img src="/logo/logo.svg" alt="Campex Logo" className="h-16 w-16 mr-1" />
            <h1 className="hidden md:block font-[700] text-primary text-2xl font-[Oswald]">KampusKonnect</h1>
        </header>

        <main className="flex flex-col items-center max-w-[720px] mx-auto px-6 pt-12 pb-16 md:py-20 flex-grow">
            <h2 className="font-[800] mb-8 lg:mb-10 text-[40px] leading-[1.3] text-foreground text-center">
                Find campus vendors you can reach on WhatsApp —{" "}
                <span className="text-primary">fast.</span>
            </h2>
            <p className="text-foreground/80 mb-10 text-center">
                We’re building Nigeria’s first student + vendor marketplace. <br />
                Join the waitlist and be the first to connect, sell, and grow when we launch.
            </p>

            {/* The form */}
            <Form method="post" className="w-full">
                {actionData?.success ? (
                    <p className="text-primary mb-2 text-center text-xs">{actionData.message}</p>
                ) : actionData?.error ? (
                    <p className="text-red-400 mb-2 text-center text-xs">{actionData.error}</p>
                ) : null}
                <div className="flex flex-col lg:flex-row items-center w-full gap-2 lg:gap-0">
                    <input 
                        type="email" 
                        name="email"
                        placeholder="Enter your email" 
                        className="w-full flex-2 p-4 rounded-md md:rounded-s-md border border-border bg-transparent text-foreground placeholder:text-foreground/60" 
                        required
                    />
                    <button type="submit" className="flex-1 w-full lg:px-6 py-3 lg:py-4 bg-primary text-primary-foreground font-[600] rounded-md md:rounded-e-md hover:bg-primary/90 transition-colors">Join Waitlist</button>
                </div>
            </Form>

            <p className="text-foreground/80 mt-2 text-xs">
                We respect your privacy. You can unsubscribe at any time
            </p>
        </main>

        <footer className="w-full text-center text-sm border-t border-border mt-auto py-4 text-foreground/80 flex gap-2 justify-center items-center">
            © 2025 Campex · All Rights Reserved
            <ThemeToggle />
        </footer>
    </div>
  );
}