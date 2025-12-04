import React, { useState } from 'react'
import type { Route } from './+types/update-password';
import { createSupabaseServerClient } from '~/utils/supabase.server';
import { Form, Link, data, redirect } from 'react-router';
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';
import type { EmailOtpType, MobileOtpType } from '@supabase/supabase-js';

export const meta = () => {
  return [
    { title: "Update Password - Campex" },
    { name: "description", content: "Set a new password for your Campex account" }
  ];
};

export async function loader({ request, params }: Route.LoaderArgs) {
  const { supabase, headers } = createSupabaseServerClient(request);
  const url = new URL(request.url);
  const token = url.searchParams.get('token_hash');
  const type = url.searchParams.get('type') as EmailOtpType | null;

  // If no token in params, redirect to request reset page
  if (!type || !token) {
    return redirect('/auth/reset-password', { headers });
  }

  const validTypes: EmailOtpType[] = ['recovery', 'email_change'];
  if (!validTypes.includes(type as EmailOtpType)) {
    return data({ hasSession: false }, { headers });
  }

  // Verify the password reset token
  const { data: verifyData, error: verifyError } = await supabase.auth.verifyOtp({
    type: type as EmailOtpType,
    token_hash: token,
  });

  if (verifyError || !verifyData.session) {
    console.error('Error verifying password reset token:', verifyError);
    return data({ hasSession: false }, { headers });
  }

  return data({ hasSession: true }, { headers });
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  // Validate passwords
  if (!password || !confirmPassword) {
    return data({ error: 'Both password fields are required', success: false }, { status: 400 });
  }

  if (password !== confirmPassword) {
    return data({ error: 'Passwords do not match', success: false }, { status: 400 });
  }

  if (password.length < 8) {
    return data({ error: 'Password must be at least 8 characters long', success: false }, { status: 400 });
  }

  const { supabase, headers } = createSupabaseServerClient(request);

  // Update the user's password
  const { error } = await supabase.auth.updateUser({
    password: password
  });

  if (error) {
    console.error('Error updating password:', error);
    return data({ error: error.message, success: false }, { headers });
  }

  // Password updated successfully
  return data({ success: true, error: '' }, { headers });
}

export default function UpdatePassword({ loaderData, actionData }: Route.ComponentProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const hasSession = loaderData?.hasSession;
  const success = actionData?.success;

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
                <h1 className="text-2xl font-bold text-center text-foreground">Password Updated!</h1>
                <p className="text-center text-muted-foreground mt-2">
                  Your password has been successfully updated. You can now log in with your new password.
                </p>
              </>
            ) : !hasSession ? (
              <>
                <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mb-4">
                  <AlertCircle className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
                </div>
                <h1 className="text-2xl font-bold text-center text-foreground">Invalid or Expired Link</h1>
                <p className="text-center text-muted-foreground mt-2">
                  This password reset link is invalid or has expired. Please request a new one.
                </p>
              </>
            ) : (
              <>
                <h1 className="text-2xl font-bold text-center text-foreground">Set New Password</h1>
                <p className="text-center text-muted-foreground mt-2">
                  Enter your new password below.
                </p>
              </>
            )}
          </div>

          {success ? (
            <Link
              to="/login"
              className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Go to Login
            </Link>
          ) : !hasSession ? (
            <Link
              to="/auth/reset-password"
              className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Request New Reset Link
            </Link>
          ) : (
            <Form method="post" className="space-y-4">
              {actionData?.error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-red-600 dark:text-red-400 text-sm text-center">{actionData.error}</p>
                </div>
              )}

              {/* New Password */}
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="New password"
                  required
                  minLength={8}
                  className="w-full pl-10 pr-12 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {/* Confirm Password */}
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  placeholder="Confirm new password"
                  required
                  minLength={8}
                  className="w-full pl-10 pr-12 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Update Password
              </button>
            </Form>
          )}
        </div>
      </main>
    </div>
  );
}