"use client";

import { Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

import { signIn, authClient } from "@/lib/auth-client";
import { FaGoogle, FaGithub } from "react-icons/fa";
import {
  loginSchema,
  magicLinkSchema,
  type LoginInput,
  type MagicLinkInput,
} from "@/lib/validations/auth";

type Mode = "password" | "magic-link";

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";
  const [mode, setMode] = useState<Mode>("password");
  const [loading, setLoading] = useState(false);
  const [magicSent, setMagicSent] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);

  const passwordForm = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const magicForm = useForm<MagicLinkInput>({
    resolver: zodResolver(magicLinkSchema),
    defaultValues: { email: "" },
  });

  async function onPasswordSubmit(values: LoginInput) {
    setLoading(true);
    const { error } = await signIn.email({
      email: values.email,
      password: values.password,
      callbackURL: callbackUrl,
    });
    setLoading(false);
    if (error) toast.error(error.message);
    else router.push(callbackUrl);
  }

  async function onMagicLinkSubmit(values: MagicLinkInput) {
    setLoading(true);
    const { error } = await authClient.signIn.magicLink({
      email: values.email,
      callbackURL: callbackUrl,
    });
    setLoading(false);
    if (error) toast.error(error.message);
    else setMagicSent(true);
  }

  async function handleOAuth(provider: "google" | "github") {
    setOauthLoading(provider);
    const { error } = await signIn.social({
      provider,
      callbackURL: callbackUrl,
    });
    if (error) {
      toast.error(error.message);
      setOauthLoading(null);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-200 p-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
          <p className="text-sm text-gray-500 mt-1">Sign in to your account</p>
        </div>

        {/* OAuth */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleOAuth("google")}
            disabled={!!oauthLoading}
            className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
          >
            {oauthLoading === "google" ? <Spinner /> : <FaGoogle className="h-4 w-4" />}
            Google
          </button>
          <button
            type="button"
            onClick={() => handleOAuth("github")}
            disabled={!!oauthLoading}
            className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
          >
            {oauthLoading === "github" ? <Spinner /> : <FaGithub className="h-4 w-4" />}
            GitHub
          </button>
        </div>

        <Divider>or continue with</Divider>

        {/* Mode toggle */}
        <div className="flex rounded-lg border border-gray-200 p-1 gap-1">
          <button
            type="button"
            onClick={() => setMode("password")}
            className={`flex-1 py-1.5 text-sm font-medium rounded-md transition ${
              mode === "password"
                ? "bg-gray-900 text-white"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Password
          </button>
          <button
            type="button"
            onClick={() => setMode("magic-link")}
            className={`flex-1 py-1.5 text-sm font-medium rounded-md transition ${
              mode === "magic-link"
                ? "bg-gray-900 text-white"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Magic Link
          </button>
        </div>

        {/* Password form */}
        {mode === "password" && (
          <form
            onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
            className="space-y-4"
          >
            <Field
              label="Email"
              error={passwordForm.formState.errors.email?.message}
            >
              <input
                type="email"
                placeholder="you@example.com"
                className={inputClass(!!passwordForm.formState.errors.email)}
                {...passwordForm.register("email")}
              />
            </Field>
            <Field
              label="Password"
              error={passwordForm.formState.errors.password?.message}
              labelRight={
                <Link
                  href="/reset-password"
                  className="text-xs text-gray-500 hover:text-gray-900"
                >
                  Forgot password?
                </Link>
              }
            >
              <input
                type="password"
                placeholder="••••••••"
                className={inputClass(!!passwordForm.formState.errors.password)}
                {...passwordForm.register("password")}
              />
            </Field>
            <SubmitButton loading={loading}>Sign in</SubmitButton>
          </form>
        )}

        {/* Magic link form */}
        {mode === "magic-link" && (
          <>
            {magicSent ? (
              <div className="rounded-xl bg-gray-50 border border-gray-200 p-4 text-center space-y-1">
                <p className="font-medium text-sm text-gray-900">
                  Check your inbox!
                </p>
                <p className="text-xs text-gray-500">
                  We sent a magic link to{" "}
                  <strong>{magicForm.getValues("email")}</strong>
                </p>
              </div>
            ) : (
              <form
                onSubmit={magicForm.handleSubmit(onMagicLinkSubmit)}
                className="space-y-4"
              >
                <Field
                  label="Email"
                  error={magicForm.formState.errors.email?.message}
                >
                  <input
                    type="email"
                    placeholder="you@example.com"
                    className={inputClass(!!magicForm.formState.errors.email)}
                    {...magicForm.register("email")}
                  />
                </Field>
                <SubmitButton loading={loading}>Send magic link</SubmitButton>
              </form>
            )}
          </>
        )}

        <p className="text-center text-sm text-gray-500">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-medium text-gray-900 hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

// ── Shared UI helpers ─────────────────────────────────────────────

function Field({
  label,
  error,
  labelRight,
  children,
}: {
  label: string;
  error?: string;
  labelRight?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        {labelRight}
      </div>
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
      {loading && <Spinner />}
      {children}
    </button>
  );
}

function Divider({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex items-center">
      <div className="flex-1 border-t border-gray-200" />
      <span className="px-3 text-xs text-gray-400 uppercase tracking-wider">
        {children}
      </span>
      <div className="flex-1 border-t border-gray-200" />
    </div>
  );
}

function Spinner() {
  return (
    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
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
