"use client";

import { useSession, signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  LogOut,
  Check,
  AlertTriangle,
  Fingerprint,
  Shield,
  Clock,
} from "lucide-react";

export default function DashboardPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  async function handleSignOut() {
    setSigningOut(true);
    await signOut({
      fetchOptions: {
        onSuccess: () => router.push("/login"),
      },
    });
  }

  if (isPending || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex items-center gap-2 text-gray-500">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-gray-400 border-t-transparent" />
          Loading...
        </div>
      </div>
    );
  }
  const user = session.user;
  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : user.email[0].toUpperCase();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <span className="text-sm font-semibold tracking-tight text-black">
            ⚡ auth<span className="text-zinc-500">.starter</span>
          </span>
          <div className="flex items-center gap-2">
            {(user as { role?: string }).role === "ADMIN" && (
              <button
                onClick={() => router.push("/dashboard/admin")}
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-purple-700 hover:text-purple-900 hover:bg-purple-50 rounded-lg transition"
              >
                <Shield className="h-4 w-4" />
                Admin
              </button>
            )}
            <button
              onClick={handleSignOut}
              disabled={signingOut}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition disabled:opacity-50"
            >
              {signingOut ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : (
                <LogOut className="h-4 w-4" />
              )}
              Sign out
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            Welcome back, {user.name ?? user.email}
          </p>
        </div>

        {/* Profile card */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
            Account
          </h2>
          <div className="flex items-start gap-4">
            {/* Avatar */}
            {user.image ? (
              <img
                src={user.image}
                alt={user.name ?? "Avatar"}
                className="h-16 w-16 rounded-full object-cover border border-gray-200"
              />
            ) : (
              <div className="h-16 w-16 rounded-full bg-gray-900 flex items-center justify-center text-white text-xl font-semibold shrink-0">
                {initials}
              </div>
            )}

            {/* Info */}
            <div className="flex-1 space-y-3">
              <InfoRow label="Name" value={user.name ?? "—"} />
              <InfoRow label="Email" value={user.email} />
              <InfoRow
                label="Role"
                value={
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      (user as { role?: string }).role === "ADMIN"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {(user as { role?: string }).role ?? "USER"}
                  </span>
                }
              />
              <InfoRow
                label="Email verified"
                value={
                  user.emailVerified ? (
                    <span className="inline-flex items-center gap-1 text-green-600 text-sm">
                      <Check className="h-4 w-4" /> Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-amber-600 text-sm">
                      <AlertTriangle className="h-4 w-4" /> Not verified
                    </span>
                  )
                }
              />
              <InfoRow
                label="Member since"
                value={new Date(user.createdAt).toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              />
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            label="Account ID"
            value={user.id.slice(0, 8) + "…"}
            icon={<Fingerprint className="h-5 w-5" />}
          />
          <StatCard
            label="Auth provider"
            value="Email / OAuth"
            icon={<Shield className="h-5 w-5" />}
          />
          <StatCard
            label="Last updated"
            value={new Date(user.updatedAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
            icon={<Clock className="h-5 w-5" />}
          />
        </div>
      </main>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-500 w-28 shrink-0">{label}</span>
      <span className="text-sm text-gray-900">{value}</span>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 flex items-center gap-4">
      <div className="h-10 w-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600 shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-sm font-semibold text-gray-900 mt-0.5">{value}</p>
      </div>
    </div>
  );
}

