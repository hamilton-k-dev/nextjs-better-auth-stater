import Link from "next/link";

export const metadata = {
  title: "Documentation — auth.starter",
  description: "How to use, configure, and customize the Next.js Better Auth Starter.",
};

export default function DocPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans">
      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="text-sm font-semibold tracking-tight text-white">
            ⚡ auth<span className="text-zinc-400">.starter</span>
          </Link>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/hamilton-k-dev/nextjs-better-auth-stater"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-zinc-400 hover:text-white transition-colors"
            >
              GitHub
            </a>
            <Link
              href="/register"
              className="text-sm px-4 py-1.5 bg-white text-black rounded-full font-medium hover:bg-zinc-200 transition-colors"
            >
              Get started
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 pt-24 pb-24 flex gap-12">
        {/* Sidebar */}
        <aside className="hidden lg:block w-52 shrink-0">
          <div className="sticky top-24 space-y-0.5 text-sm">
            <p className="text-xs text-zinc-600 uppercase tracking-widest mb-3 px-3">
              On this page
            </p>
            {sidebarLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="block px-3 py-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 min-w-0 space-y-20">
          {/* Introduction */}
          <section id="introduction">
            <Badge>Overview</Badge>
            <H1>Next.js Better Auth Starter</H1>
            <P>
              A production-ready authentication template built with Next.js 16, better-auth,
              Prisma, and Neon. It ships with email/password, magic links, Google and GitHub
              OAuth, role-based access control, and transactional emails — all wired up and
              ready to customize.
            </P>
            <P>
              This page explains how the template is structured, how each feature works,
              and how to adapt it to your own project.
            </P>
            <StackTable />
          </section>

          {/* Getting Started */}
          <section id="getting-started">
            <Badge>Setup</Badge>
            <H2>Getting Started</H2>

            <H3>1. Clone and install</H3>
            <Code>{`git clone https://github.com/hamilton-k-dev/nextjs-better-auth-stater
cd nextjs-better-auth-stater
npm install`}</Code>

            <H3>2. Environment variables</H3>
            <P>Copy the example file and fill in your values:</P>
            <Code>{`cp .env.example .env`}</Code>
            <div className="overflow-x-auto mt-4">
              <table className="w-full text-sm border border-white/5 rounded-xl overflow-hidden">
                <thead>
                  <tr className="border-b border-white/5 bg-white/[0.02]">
                    <Th>Variable</Th>
                    <Th>Required</Th>
                    <Th>Description</Th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {envVars.map((v) => (
                    <tr key={v.name}>
                      <Td><InlineCode>{v.name}</InlineCode></Td>
                      <Td>
                        <span className={v.required === "Yes" ? "text-green-400" : v.required === "Demo only" ? "text-amber-400" : "text-zinc-500"}>
                          {v.required}
                        </span>
                      </Td>
                      <Td className="text-zinc-400">{v.desc}</Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <H3>3. Database setup</H3>
            <Code>{`npx prisma migrate dev --name init
npx prisma generate`}</Code>

            <H3>4. Run locally</H3>
            <Code>{`npm run dev`}</Code>
            <P>Visit <InlineCode>http://localhost:3000</InlineCode>.</P>
          </section>

          {/* Project structure */}
          <section id="structure">
            <Badge>Architecture</Badge>
            <H2>Project Structure</H2>
            <Code>{`src/
├── app/
│   ├── page.tsx                      # Landing page
│   ├── doc/page.tsx                  # This documentation page
│   ├── (auth)/
│   │   ├── login/page.tsx            # Sign in — password, magic link, OAuth
│   │   ├── register/page.tsx         # Create account
│   │   └── reset-password/page.tsx   # Forgot & reset password
│   ├── (protected)/
│   │   └── dashboard/
│   │       ├── page.tsx              # User dashboard
│   │       └── admin/page.tsx        # Admin panel (ADMIN role only)
│   └── api/
│       ├── auth/[...all]/route.ts    # better-auth handler
│       ├── admin/users/route.ts      # Role management API
│       └── demo/inbox/route.ts       # Demo mode email link API
├── components/
│   └── demo-inbox.tsx                # Demo mode email card
├── lib/
│   ├── auth.ts                       # better-auth server config
│   ├── auth-client.ts                # better-auth browser client
│   ├── db.ts                         # Prisma singleton (Neon adapter)
│   └── validations/auth.ts           # Zod schemas
└── proxy.ts                          # Route protection (Next.js 16)`}</Code>
          </section>

          {/* Authentication */}
          <section id="authentication">
            <Badge>Auth</Badge>
            <H2>Authentication</H2>
            <P>
              All auth logic lives in <InlineCode>src/lib/auth.ts</InlineCode> (server config)
              and <InlineCode>src/lib/auth-client.ts</InlineCode> (browser client).
              The better-auth API is mounted at <InlineCode>/api/auth/[...all]</InlineCode>.
            </P>

            <H3>Email & Password</H3>
            <P>
              Enabled by default with required email verification. After sign-up, the user
              receives a verification email before they can sign in. Password reset sends a
              time-limited link to the user's email.
            </P>
            <Code>{`// auth.ts
emailAndPassword: {
  enabled: true,
  requireEmailVerification: true,
}`}</Code>

            <H3>Magic Links</H3>
            <P>
              Powered by the <InlineCode>magicLink</InlineCode> plugin. The user enters their
              email and receives a one-click sign-in link valid for 15 minutes.
            </P>
            <Code>{`// auth.ts
plugins: [
  magicLink({
    sendMagicLink: async ({ email, url }) => { ... }
  })
]`}</Code>

            <H3>OAuth — Google & GitHub</H3>
            <P>
              Configure both providers in <InlineCode>auth.ts</InlineCode> via environment
              variables. Redirect URIs to register in each provider's console:
            </P>
            <Code>{`# Google — console.cloud.google.com
http://localhost:3000/api/auth/callback/google
https://yourdomain.com/api/auth/callback/google

# GitHub — github.com/settings/developers
http://localhost:3000/api/auth/callback/github
https://yourdomain.com/api/auth/callback/github`}</Code>
            <P>
              To add more OAuth providers, install the provider plugin from better-auth and
              add it to the <InlineCode>socialProviders</InlineCode> block in{" "}
              <InlineCode>auth.ts</InlineCode>.
            </P>

            <H3>Email delivery</H3>
            <P>
              Emails are sent via Resend. The three transactional emails —{" "}
              <em>email verification</em>, <em>password reset</em>, and <em>magic link</em>{" "}
              — are all defined as inline HTML in <InlineCode>auth.ts</InlineCode>. Customize
              the HTML to match your brand.
            </P>
          </section>

          {/* Route protection */}
          <section id="route-protection">
            <Badge>Security</Badge>
            <H2>Route Protection</H2>
            <P>
              Next.js 16 replaces <InlineCode>middleware.ts</InlineCode> with{" "}
              <InlineCode>proxy.ts</InlineCode>. This file runs on every request and controls
              who can access what.
            </P>
            <Code>{`// src/proxy.ts

// Accessible without a session
const PUBLIC_ROUTES = ["/", "/login", "/register", "/reset-password", "/verify-email", "/doc", "/api/demo"];

// Redirect authenticated users away (back to /dashboard)
const AUTH_ROUTES = ["/login", "/register"];

// Require ADMIN role — non-admins redirected to /dashboard
const ADMIN_ROUTES = ["/dashboard/admin"];`}</Code>

            <div className="overflow-x-auto mt-6">
              <table className="w-full text-sm border border-white/5 rounded-xl overflow-hidden">
                <thead>
                  <tr className="border-b border-white/5 bg-white/[0.02]">
                    <Th>Scenario</Th>
                    <Th>Result</Th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr>
                    <Td>Unauthenticated user visits a protected route</Td>
                    <Td className="text-zinc-400">Redirect to <InlineCode>/login?callbackUrl=…</InlineCode></Td>
                  </tr>
                  <tr>
                    <Td>Authenticated user visits <InlineCode>/login</InlineCode> or <InlineCode>/register</InlineCode></Td>
                    <Td className="text-zinc-400">Redirect to <InlineCode>/dashboard</InlineCode></Td>
                  </tr>
                  <tr>
                    <Td>Authenticated USER visits <InlineCode>/dashboard/admin</InlineCode></Td>
                    <Td className="text-zinc-400">Redirect to <InlineCode>/dashboard</InlineCode></Td>
                  </tr>
                  <tr>
                    <Td>Authenticated ADMIN visits <InlineCode>/dashboard/admin</InlineCode></Td>
                    <Td className="text-zinc-400">Allowed</Td>
                  </tr>
                </tbody>
              </table>
            </div>

            <H3>Adding a protected route</H3>
            <P>
              Any route not listed in <InlineCode>PUBLIC_ROUTES</InlineCode> is automatically
              protected — no extra config needed. Just create the page.
            </P>

            <H3>Adding a public route</H3>
            <P>
              Add the path to <InlineCode>PUBLIC_ROUTES</InlineCode> in{" "}
              <InlineCode>src/proxy.ts</InlineCode>:
            </P>
            <Code>{`const PUBLIC_ROUTES = [
  ...,
  "/pricing",   // add your public route here
];`}</Code>

            <H3>Adding an admin-only section</H3>
            <Code>{`const ADMIN_ROUTES = [
  "/dashboard/admin",
  "/dashboard/reports",  // add your admin route here
];`}</Code>
          </section>

          {/* RBAC */}
          <section id="rbac">
            <Badge>Access Control</Badge>
            <H2>Role-Based Access Control</H2>
            <P>
              Users have a <InlineCode>role</InlineCode> field with two values:{" "}
              <InlineCode>USER</InlineCode> (default) and <InlineCode>ADMIN</InlineCode>.
              The role is stored in the database and exposed on the session object.
            </P>

            <H3>Protecting a server page</H3>
            <Code>{`import { requireAuth } from "@/actions/auth";

export default async function Page() {
  const session = await requireAuth(); // redirects to /login if not authenticated
  return <div>Hello {session.user.name}</div>;
}`}</Code>

            <H3>Protecting an admin-only page</H3>
            <Code>{`import { requireAdmin } from "@/actions/auth";

export default async function AdminPage() {
  const session = await requireAdmin(); // redirects to /dashboard if not ADMIN
  return <div>Admin only</div>;
}`}</Code>

            <H3>Reading the role on the client</H3>
            <Code>{`"use client";
import { useSession } from "@/lib/auth-client";

export function RoleBadge() {
  const { data: session } = useSession();
  return <span>{session?.user.role}</span>;
}`}</Code>

            <H3>Promoting a user to admin</H3>
            <P>
              Use the built-in admin panel at <InlineCode>/dashboard/admin</InlineCode> to
              promote or revoke admin access. Alternatively, use Prisma Studio:
            </P>
            <Code>{`npx prisma studio`}</Code>

            <H3>Adding a new role</H3>
            <P>Update the Prisma schema enum, run a migration, and add the new role checks wherever needed:</P>
            <Code>{`// prisma/schema.prisma
enum Role {
  USER
  ADMIN
  MODERATOR  // add your role here
}

// then run:
// npx prisma migrate dev --name add-moderator-role`}</Code>
          </section>

          {/* Demo mode */}
          <section id="demo-mode">
            <Badge>Demo</Badge>
            <H2>Demo Mode</H2>
            <P>
              Demo mode disables Resend and surfaces email links directly in the UI as an
              amber card — no inbox needed. Designed for public demos or staging environments
              where visitors shouldn't need a real email address.
            </P>

            <H3>Enable it</H3>
            <P>
              Set both variables — one is read server-side, the other is baked into the
              client bundle at build time:
            </P>
            <Code>{`DEMO_MODE="true"
NEXT_PUBLIC_DEMO_MODE="true"`}</Code>
            <P>
              <InlineCode>RESEND_API_KEY</InlineCode> and{" "}
              <InlineCode>EMAIL_FROM</InlineCode> are not required in demo mode.
            </P>

            <H3>How it works</H3>
            <Code>{`User triggers email action (sign up, magic link, reset)
  → Server saves the generated URL to demo_inbox table
  → Page renders DemoEmailCard (src/components/demo-inbox.tsx)
  → Card polls GET /api/demo/inbox?email=…&type=…
  → User clicks the action button → token handled by better-auth`}</Code>

            <H3>Required migration</H3>
            <P>The <InlineCode>demo_inbox</InlineCode> table must exist before demo mode works:</P>
            <Code>{`npx prisma migrate dev --name add-demo-inbox   # local
npx prisma migrate deploy                       # production`}</Code>
          </section>

          {/* Customization */}
          <section id="customization">
            <Badge>Customize</Badge>
            <H2>Customization</H2>

            <H3>Customize email templates</H3>
            <P>
              All three email templates (verification, password reset, magic link) are inline
              HTML strings in <InlineCode>src/lib/auth.ts</InlineCode>. Replace them with
              your own HTML or use a React email renderer:
            </P>
            <Code>{`sendVerificationEmail: async ({ user, url }) => {
  await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to: user.email,
    subject: "Verify your email",
    html: \`<p>Click <a href="\${url}">here</a> to verify.</p>\`,
    // or: react: <VerificationEmail url={url} />
  });
}`}</Code>

            <H3>Extend the user model</H3>
            <P>Add fields to the Prisma schema and expose them via better-auth's <InlineCode>additionalFields</InlineCode>:</P>
            <Code>{`// prisma/schema.prisma
model User {
  ...
  bio String?  // add your field
}

// src/lib/auth.ts
user: {
  additionalFields: {
    bio: { type: "string", required: false },
  },
}`}</Code>
            <P>Then run <InlineCode>npx prisma migrate dev --name add-user-bio</InlineCode>.</P>

            <H3>Add an OAuth provider</H3>
            <Code>{`// src/lib/auth.ts
socialProviders: {
  google: { ... },
  github: { ... },
  discord: {                            // example: Discord
    clientId: process.env.DISCORD_CLIENT_ID!,
    clientSecret: process.env.DISCORD_CLIENT_SECRET!,
  },
}`}</Code>
            <P>Add the matching env vars and register the redirect URI in the provider's developer console.</P>

            <H3>Change the post-login redirect</H3>
            <P>Update <InlineCode>callbackURL</InlineCode> in the auth pages and the proxy redirect target:</P>
            <Code>{`// src/app/(auth)/register/page.tsx
await signUp.email({ ..., callbackURL: "/onboarding" });

// src/proxy.ts — for AUTH_ROUTES redirect
return NextResponse.redirect(new URL("/onboarding", request.url));`}</Code>
          </section>

          {/* Deployment */}
          <section id="deployment">
            <Badge>Deploy</Badge>
            <H2>Deployment</H2>

            <H3>Vercel (recommended)</H3>
            <P>Push your repo to GitHub, import it in Vercel, and set these environment variables before deploying:</P>
            <div className="overflow-x-auto mt-4">
              <table className="w-full text-sm border border-white/5 rounded-xl overflow-hidden">
                <thead>
                  <tr className="border-b border-white/5 bg-white/[0.02]">
                    <Th>Variable</Th>
                    <Th>Value</Th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {deployVars.map((v) => (
                    <tr key={v.name}>
                      <Td><InlineCode>{v.name}</InlineCode></Td>
                      <Td className="text-zinc-400">{v.value}</Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Callout>
              <InlineCode>NEXT_PUBLIC_*</InlineCode> variables are baked into the client bundle
              at build time. After changing them in Vercel settings, you must trigger a new
              deployment for the change to take effect.
            </Callout>

            <H3>Update OAuth redirect URIs</H3>
            <Code>{`# Google Console
https://yourdomain.com/api/auth/callback/google

# GitHub OAuth App
https://yourdomain.com/api/auth/callback/github`}</Code>

            <H3>Run database migrations on production</H3>
            <Code>{`npx prisma migrate deploy`}</Code>

            <H3>Key scripts</H3>
            <Code>{`npm run dev          # Start development server
npm run build        # Production build
npm run typecheck    # TypeScript check (no emit)
npm run migrate      # Run prisma migrate deploy
npm run studio       # Open Prisma Studio
npm run seed         # Seed the database with demo users`}</Code>
          </section>
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-6 text-center">
        <p className="text-xs text-zinc-600">
          Built with Next.js, better-auth, Prisma &amp; Neon ·{" "}
          <a
            href="https://github.com/hamilton-k-dev/nextjs-better-auth-stater"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-zinc-400 transition-colors"
          >
            GitHub
          </a>
        </p>
      </footer>
    </div>
  );
}

// ── UI helpers ─────────────────────────────────────────────────────

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block text-xs font-medium text-indigo-400 uppercase tracking-widest mb-3">
      {children}
    </span>
  );
}

function H1({ children }: { children: React.ReactNode }) {
  return <h1 className="text-4xl font-bold text-white mb-4">{children}</h1>;
}

function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="text-2xl font-bold text-white mb-4">{children}</h2>;
}

function H3({ children }: { children: React.ReactNode }) {
  return <h3 className="text-base font-semibold text-white mt-8 mb-3">{children}</h3>;
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="text-zinc-400 leading-relaxed mb-4">{children}</p>;
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <pre className="bg-white/[0.04] border border-white/5 rounded-xl px-5 py-4 text-sm text-zinc-300 overflow-x-auto font-mono leading-relaxed my-4">
      <code>{children}</code>
    </pre>
  );
}

function InlineCode({ children }: { children: React.ReactNode }) {
  return (
    <code className="bg-white/[0.06] text-zinc-300 text-xs px-1.5 py-0.5 rounded font-mono">
      {children}
    </code>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">
      {children}
    </th>
  );
}

function Td({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <td className={`px-4 py-3 text-sm text-white ${className ?? ""}`}>{children}</td>
  );
}

function Callout({ children }: { children: React.ReactNode }) {
  return (
    <div className="border border-amber-500/20 bg-amber-500/5 rounded-xl px-5 py-4 text-sm text-amber-200/80 leading-relaxed my-4">
      ⚠ {children}
    </div>
  );
}

function StackTable() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
      {stack.map((s) => (
        <div key={s.name} className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
          <p className="text-sm font-medium text-white">{s.name}</p>
          <p className="text-xs text-zinc-500 mt-0.5">{s.role}</p>
        </div>
      ))}
    </div>
  );
}

// ── Data ────────────────────────────────────────────────────────────

const sidebarLinks = [
  { href: "#introduction", label: "Introduction" },
  { href: "#getting-started", label: "Getting Started" },
  { href: "#structure", label: "Project Structure" },
  { href: "#authentication", label: "Authentication" },
  { href: "#route-protection", label: "Route Protection" },
  { href: "#rbac", label: "Role-Based Access" },
  { href: "#demo-mode", label: "Demo Mode" },
  { href: "#customization", label: "Customization" },
  { href: "#deployment", label: "Deployment" },
];

const stack = [
  { name: "Next.js 16", role: "Framework" },
  { name: "better-auth", role: "Authentication" },
  { name: "Prisma 7", role: "ORM" },
  { name: "Neon", role: "Database" },
  { name: "Resend", role: "Emails" },
  { name: "Zod", role: "Validation" },
  { name: "Tailwind CSS", role: "Styling" },
  { name: "React Hook Form", role: "Forms" },
];

const envVars = [
  { name: "NEXT_PUBLIC_APP_URL", required: "Yes", desc: "Your app's public URL (baked into client bundle)" },
  { name: "BETTER_AUTH_URL", required: "Yes", desc: "Same as above — used server-side by better-auth" },
  { name: "BETTER_AUTH_SECRET", required: "Yes", desc: "Random 32-byte secret: openssl rand -base64 32" },
  { name: "DATABASE_URL", required: "Yes", desc: "Neon pooled connection string" },
  { name: "DIRECT_URL", required: "Yes", desc: "Neon direct URL — used by prisma migrate" },
  { name: "RESEND_API_KEY", required: "No*", desc: "Resend API key. Not needed in demo mode." },
  { name: "EMAIL_FROM", required: "No*", desc: "Sender address. Not needed in demo mode." },
  { name: "GOOGLE_CLIENT_ID", required: "No*", desc: "Google OAuth client ID" },
  { name: "GOOGLE_CLIENT_SECRET", required: "No*", desc: "Google OAuth client secret" },
  { name: "GITHUB_CLIENT_ID", required: "No*", desc: "GitHub OAuth app client ID" },
  { name: "GITHUB_CLIENT_SECRET", required: "No*", desc: "GitHub OAuth app client secret" },
  { name: "DEMO_MODE", required: "Demo only", desc: 'Set to "true" to skip email sending server-side' },
  { name: "NEXT_PUBLIC_DEMO_MODE", required: "Demo only", desc: 'Set to "true" to show email links in the UI' },
];

const deployVars = [
  { name: "NEXT_PUBLIC_APP_URL", value: "https://yourdomain.com" },
  { name: "BETTER_AUTH_URL", value: "https://yourdomain.com" },
  { name: "BETTER_AUTH_SECRET", value: "generate with openssl rand -base64 32" },
  { name: "DATABASE_URL", value: "Neon pooled URL" },
  { name: "DIRECT_URL", value: "Neon direct URL" },
  { name: "RESEND_API_KEY", value: "from resend.com (not needed in demo mode)" },
  { name: "EMAIL_FROM", value: "no-reply@yourdomain.com" },
  { name: "GOOGLE_CLIENT_ID / SECRET", value: "from Google Console" },
  { name: "GITHUB_CLIENT_ID / SECRET", value: "from GitHub OAuth App" },
];
