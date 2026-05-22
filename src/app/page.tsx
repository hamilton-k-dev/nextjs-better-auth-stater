import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white font-sans overflow-x-hidden">
      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <span className="text-sm font-semibold tracking-tight text-white">
            ⚡ auth<span className="text-zinc-400">.starter</span>
          </span>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm text-zinc-400 hover:text-white transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="text-sm px-4 py-1.5 bg-white text-black rounded-full font-medium hover:bg-zinc-200 transition-colors"
            >
              Get started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-40 pb-24 px-6 text-center relative">
        {/* Glow */}
        <div className="absolute top-32 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs text-zinc-400 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            Next.js 16 · better-auth · Prisma · Neon
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight leading-[1.1] text-white">
            Auth that just
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">
              works.
            </span>
          </h1>

          <p className="text-lg text-zinc-400 max-w-xl mx-auto leading-relaxed">
            Production-ready authentication starter with email & password,
            OAuth, magic links, and role-based access — all wired up and ready
            to ship.
          </p>

          <div className="flex items-center justify-center gap-3 pt-2">
            <Link
              href="/register"
              className="px-6 py-2.5 bg-white text-black text-sm font-semibold rounded-full hover:bg-zinc-100 transition-colors"
            >
              Create account
            </Link>
            <Link
              href="/login"
              className="px-6 py-2.5 border border-white/10 text-sm text-white rounded-full hover:bg-white/5 transition-colors"
            >
              Sign in →
            </Link>
          </div>
        </div>
      </section>

      {/* Feature grid */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="group rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] p-6 transition-colors"
            >
              <div className="text-2xl mb-3">{f.icon}</div>
              <h3 className="text-sm font-semibold text-white mb-1.5">
                {f.title}
              </h3>
              <p className="text-sm text-zinc-500 leading-relaxed">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Stack section */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-8">
          <p className="text-xs text-zinc-500 uppercase tracking-widest mb-6">
            Built with
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {stack.map((s) => (
              <div key={s.name} className="space-y-1">
                <p className="text-sm font-medium text-white">{s.name}</p>
                <p className="text-xs text-zinc-500">{s.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-6 pb-24 text-center">
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] py-16 px-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/5 to-transparent pointer-events-none" />
          <div className="relative space-y-4">
            <h2 className="text-3xl font-bold text-white">Ready to build?</h2>
            <p className="text-zinc-400 text-sm">
              Everything you need to ship auth in minutes.
            </p>
            <Link
              href="/register"
              className="inline-block mt-2 px-8 py-3 bg-white text-black text-sm font-semibold rounded-full hover:bg-zinc-100 transition-colors"
            >
              Get started for free
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-6 text-center">
        <p className="text-xs text-zinc-600">
          Built with Next.js, better-auth, Prisma & Neon
        </p>
      </footer>
    </main>
  );
}

const features = [
  {
    icon: "🔐",
    title: "Email & Password",
    description:
      "Secure sign-up and sign-in with email verification and password reset flow.",
  },
  {
    icon: "✨",
    title: "Magic Links",
    description:
      "Passwordless auth via one-click email links. No password, no friction.",
  },
  {
    icon: "🌐",
    title: "OAuth Providers",
    description:
      "Google and GitHub OAuth out of the box. Add more providers in minutes.",
  },
  {
    icon: "🛡️",
    title: "Role-Based Access",
    description:
      "USER and ADMIN roles baked in. Protect routes and UI with a single check.",
  },
  {
    icon: "🗄️",
    title: "Neon + Prisma",
    description:
      "Serverless PostgreSQL on Neon with Prisma ORM. Type-safe queries, zero ops.",
  },
  {
    icon: "🚀",
    title: "Production Ready",
    description:
      "Session management, cookie caching, trusted origins, and CSRF protection included.",
  },
];

const stack = [
  { name: "Next.js 16", role: "Framework" },
  { name: "better-auth", role: "Authentication" },
  { name: "Prisma 7", role: "ORM" },
  { name: "Neon", role: "Database" },
  { name: "Zod", role: "Validation" },
  { name: "React Hook Form", role: "Forms" },
  { name: "Resend", role: "Emails" },
  { name: "Tailwind CSS", role: "Styling" },
];
