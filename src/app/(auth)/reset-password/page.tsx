"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Suspense } from "react";

import { authClient } from "@/lib/auth-client";
import { Mail } from "lucide-react";
import {
  resetPasswordSchema,
  newPasswordSchema,
  type ResetPasswordInput,
  type NewPasswordInput,
} from "@/lib/validations/auth";
import { DemoEmailCard } from "@/components/demo-inbox";

const isDemo = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const requestForm = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { email: "" },
  });

  const newPasswordForm = useForm<NewPasswordInput>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  async function onRequestSubmit(values: ResetPasswordInput) {
    setLoading(true);
    const { error } = await authClient.requestPasswordReset({
      email: values.email,
      redirectTo: "/reset-password",
    });
    setLoading(false);
    if (error) toast.error(error.message);
    else setEmailSent(true);
  }

  async function onNewPasswordSubmit(values: NewPasswordInput) {
    if (!token) return;
    setLoading(true);
    const { error } = await authClient.resetPassword({
      token,
      newPassword: values.password,
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Password updated! You can now sign in.");
      router.push("/login");
    }
  }

  // ── Set new password (token present) ──────────────────────────
  if (token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-200 p-8 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Set new password
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Choose a strong password for your account.
            </p>
          </div>
          <form
            onSubmit={newPasswordForm.handleSubmit(onNewPasswordSubmit)}
            className="space-y-4"
          >
            <Field
              label="New password"
              error={newPasswordForm.formState.errors.password?.message}
            >
              <input
                type="password"
                placeholder="••••••••"
                className={inputClass(
                  !!newPasswordForm.formState.errors.password,
                )}
                {...newPasswordForm.register("password")}
              />
            </Field>
            <Field
              label="Confirm new password"
              error={newPasswordForm.formState.errors.confirmPassword?.message}
            >
              <input
                type="password"
                placeholder="••••••••"
                className={inputClass(
                  !!newPasswordForm.formState.errors.confirmPassword,
                )}
                {...newPasswordForm.register("confirmPassword")}
              />
            </Field>
            <SubmitButton loading={loading}>Update password</SubmitButton>
          </form>
        </div>
      </div>
    );
  }

  // ── Email sent confirmation ────────────────────────────────────
  if (emailSent) {
    const email = requestForm.getValues("email");
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center space-y-4">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
            <Mail className="w-6 h-6 text-blue-600" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">Check your email</h1>
          <p className="text-sm text-gray-500">
            If an account exists for{" "}
            <strong className="text-gray-700">{email}</strong>, you will
            receive a reset link shortly.
          </p>
          {isDemo && (
            <DemoEmailCard email={email} type="password-reset" />
          )}
          <button
            onClick={() => router.push("/login")}
            className="w-full py-2.5 px-4 border border-gray-300 text-sm font-medium rounded-lg hover:bg-gray-50 transition"
          >
            Back to login
          </button>
        </div>
      </div>
    );
  }

  // ── Request reset ──────────────────────────────────────────────
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-200 p-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Forgot password?</h1>
          <p className="text-sm text-gray-500 mt-1">
            Enter your email and we&apos;ll send you a reset link.
          </p>
        </div>
        <form
          onSubmit={requestForm.handleSubmit(onRequestSubmit)}
          className="space-y-4"
        >
          <Field
            label="Email"
            error={requestForm.formState.errors.email?.message}
          >
            <input
              type="email"
              placeholder="you@example.com"
              className={inputClass(!!requestForm.formState.errors.email)}
              {...requestForm.register("email")}
            />
          </Field>
          <SubmitButton loading={loading}>Send reset link</SubmitButton>
        </form>
        <Link
          href="/login"
          className="block text-center text-sm text-gray-500 hover:text-gray-900"
        >
          ← Back to login
        </Link>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}

// ── Shared UI helpers ─────────────────────────────────────────────

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

function SubmitButton({
  loading,
  children,
}: {
  loading: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="w-full py-2.5 px-4 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
    >
      {loading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </button>
  );
}

function inputClass(hasError: boolean) {
  return `w-full px-3 py-2.5 text-sm border rounded-lg outline-none transition
    ${
      hasError
        ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
        : "border-gray-300 focus:border-gray-900 focus:ring-2 focus:ring-gray-100"
    }`;
}
