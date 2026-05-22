"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

import { signUp, signIn } from "@/lib/auth-client";
import { FaGoogle, FaGithub } from "react-icons/fa";
import { Check } from "lucide-react";
import { registerSchema, type RegisterInput } from "@/lib/validations/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  async function onSubmit(values: RegisterInput) {
    setLoading(true);
    const { error } = await signUp.email({
      name: values.name,
      email: values.email,
      password: values.password,
      callbackURL: "/dashboard",
    });
    setLoading(false);
    if (error) toast.error(error.message);
    else setVerificationSent(true);
  }

  async function handleOAuth(provider: "google" | "github") {
    setOauthLoading(provider);
    const { error } = await signIn.social({
      provider,
      callbackURL: "/dashboard",
    });
    if (error) {
      toast.error(error.message);
      setOauthLoading(null);
    }
  }

  if (verificationSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center space-y-4">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <Check className="w-6 h-6 text-green-600" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">Check your email</h1>
          <p className="text-sm text-gray-500">
            We sent a verification link to{" "}
            <strong className="text-gray-700">{form.getValues("email")}</strong>
            . Click it to activate your account.
          </p>
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-200 p-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Create an account
          </h1>
          <p className="text-sm text-gray-500 mt-1">Sign up to get started</p>
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

        <Divider>or with email</Divider>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Field label="Name" error={form.formState.errors.name?.message}>
            <input
              placeholder="John Doe"
              className={inputClass(!!form.formState.errors.name)}
              {...form.register("name")}
            />
          </Field>
          <Field label="Email" error={form.formState.errors.email?.message}>
            <input
              type="email"
              placeholder="you@example.com"
              className={inputClass(!!form.formState.errors.email)}
              {...form.register("email")}
            />
          </Field>
          <Field
            label="Password"
            error={form.formState.errors.password?.message}
          >
            <input
              type="password"
              placeholder="••••••••"
              className={inputClass(!!form.formState.errors.password)}
              {...form.register("password")}
            />
          </Field>
          <Field
            label="Confirm password"
            error={form.formState.errors.confirmPassword?.message}
          >
            <input
              type="password"
              placeholder="••••••••"
              className={inputClass(!!form.formState.errors.confirmPassword)}
              {...form.register("confirmPassword")}
            />
          </Field>
          <SubmitButton loading={loading}>Create account</SubmitButton>
        </form>

        <p className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-gray-900 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

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
