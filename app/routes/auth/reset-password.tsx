import React from 'react'
import type { Route } from './+types/reset-password';
import { createSupabaseServerClient } from '~/utils/supabase.server';
import { Form, Link, data } from 'react-router';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';

export const meta = () => {
  return [
    { title: "Reset Password - Campex" },
    { name: "description", content: "Reset your Campex account password" }
  ];
};

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const email = formData.get('email') as string;

  if (!email) {
    return data({ error: 'Email is required', success: false, email: '' }, { status: 400 });
  }

  const { supabase, headers } = createSupabaseServerClient(request);

  // Send password reset email
  const { error } = await supabase.auth.resetPasswordForEmail(email);

  if (error) {
    console.error('Error sending reset email:', error);
    return data({ error: error.message, success: false, email: '' }, { headers });
  }

  return data({ success: true, email, error: '' }, { headers });
}

export default function ResetPassword({ actionData }: Route.ComponentProps) {
  const success = actionData?.success;
  const email = actionData?.email;

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4 lg:p-8 bg-gradient-to-br from-primary/5 via-background to-primary/10">
      <main className="w-full max-w-md">
        <div className="bg-card rounded-xl shadow-lg p-8">
          {/* Logo */}
          <div className="flex flex-col items-center justify-center mb-6">
            <img src="/logo/logo.svg" alt="Campex Logo" className="h-16 w-16 mb-4" />
            
            {success ? (
              <>
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h1 className="text-2xl font-bold text-center text-foreground">Check Your Email</h1>
                <p className="text-center text-muted-foreground mt-2">
                  We've sent a password reset link to <span className="font-medium text-foreground">{email}</span>
                </p>
              </>
            ) : (
              <>
                <h1 className="text-2xl font-bold text-center text-foreground">Reset Your Password</h1>
                <p className="text-center text-muted-foreground mt-2">
                  Enter your email address and we'll send you a link to reset your password.
                </p>
              </>
            )}
          </div>

          {success ? (
            <div className="space-y-4">
              <p className="text-sm text-center text-muted-foreground">
                Didn't receive the email? Check your spam folder or try again.
              </p>
              <Form method="post">
                <input type="hidden" name="email" value={email} />
                <button
                  type="submit"
                  className="w-full py-3 px-4 border border-border rounded-lg text-foreground font-medium hover:bg-muted transition-colors"
                >
                  Resend Email
                </button>
              </Form>
              <Link
                to="/login"
                className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Back to Login
              </Link>
            </div>
          ) : (
            <Form method="post" className="space-y-4">
              {actionData?.error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-red-600 dark:text-red-400 text-sm text-center">{actionData.error}</p>
                </div>
              )}

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Send Reset Link
              </button>

              <Link
                to="/login"
                className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft size={16} />
                Back to Login
              </Link>
            </Form>
          )}
        </div>
      </main>
    </div>
  );
}
