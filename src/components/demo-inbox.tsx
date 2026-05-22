"use client";

import { useEffect, useState } from "react";

export type DemoEmailType = "verification" | "magic-link" | "password-reset";

const actionLabel: Record<DemoEmailType, string> = {
  verification: "Verify Email",
  "magic-link": "Sign In",
  "password-reset": "Reset Password",
};

export function DemoEmailCard({
  email,
  type,
}: {
  email: string;
  type: DemoEmailType;
}) {
  const [url, setUrl] = useState<string | null>(null);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    let attempts = 0;

    async function poll() {
      try {
        const res = await fetch(
          `/api/demo/inbox?email=${encodeURIComponent(email)}&type=${encodeURIComponent(type)}`,
        );
        if (res.ok) {
          const data = await res.json();
          if (data?.url) {
            setUrl(data.url);
            setFetching(false);
            return;
          }
        }
      } catch {}

      attempts++;
      if (attempts < 6) {
        setTimeout(poll, 800);
      } else {
        setFetching(false);
      }
    }

    setTimeout(poll, 400);
  }, [email, type]);

  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 space-y-3">
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
          Demo Mode
        </span>
        <p className="text-sm font-medium text-gray-800">No real email sent</p>
      </div>

      {fetching ? (
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span className="h-3 w-3 animate-spin rounded-full border-2 border-amber-400 border-t-transparent" />
          Generating link…
        </div>
      ) : url ? (
        <div className="space-y-2">
          <p className="text-xs text-gray-500">
            In a real app, this link would be emailed to{" "}
            <strong className="text-gray-700">{email}</strong>.
          </p>
          <a
            href={url}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition"
          >
            {actionLabel[type]} →
          </a>
        </div>
      ) : (
        <p className="text-xs text-red-500">
          Could not load demo link — try again.
        </p>
      )}
    </div>
  );
}
