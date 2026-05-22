# Demo Mode

Demo mode lets you run the app without a Resend account. Instead of sending emails, every verification link, magic link, and password-reset link is saved to the database and surfaced directly in the UI as an amber "Demo Mode" card. This is ideal for public demos or staging environments where visitors shouldn't need a real email address.

---

## How it works

When `DEMO_MODE=true`, the three email-sending callbacks in `src/lib/auth.ts` skip Resend entirely and write the generated link to a `demo_inbox` database table (keyed on `email + type` so there is always at most one pending link per action per user).

After the user triggers an action (sign up, magic link, password reset), the client-side `DemoEmailCard` component (`src/components/demo-inbox.tsx`) polls `GET /api/demo/inbox?email=&type=` and renders a button that opens the link directly — no inbox required.

```
User submits form
  → better-auth generates token URL
  → auth.ts saves URL to demo_inbox table   (server)
  → page shows DemoEmailCard               (client)
  → DemoEmailCard polls /api/demo/inbox    (client → server)
  → user clicks action button              (client)
  → token URL handled by better-auth       (server)
```

---

## Enabling demo mode

Set both variables — one is read server-side, the other client-side:

```env
DEMO_MODE="true"
NEXT_PUBLIC_DEMO_MODE="true"
```

`RESEND_API_KEY` and `EMAIL_FROM` are **not required** when demo mode is on.

---

## Database migration

The `demo_inbox` table must exist before demo mode can be used. Run the migration once:

```bash
# local
npx prisma migrate dev --name add-demo-inbox

# production (Vercel / Neon)
npx prisma migrate deploy
```

---

## Affected files

| File | Change |
| ---- | ------ |
| `prisma/schema.prisma` | `DemoInbox` model added |
| `src/lib/auth.ts` | `DEMO` flag + `saveDemoEmail` helper; each email handler returns early in demo mode |
| `src/app/api/demo/inbox/route.ts` | `GET` endpoint — returns latest demo link for `email + type` |
| `src/components/demo-inbox.tsx` | Amber card with polling logic and action button |
| `src/app/(auth)/register/page.tsx` | Renders `DemoEmailCard` after sign-up |
| `src/app/(auth)/login/page.tsx` | Renders `DemoEmailCard` after magic link request |
| `src/app/(auth)/reset-password/page.tsx` | Renders `DemoEmailCard` after reset request |
| `src/proxy.ts` | `/api/demo` added to `PUBLIC_ROUTES` |

---

## Disabling demo mode

Set both variables back to `"false"` (or remove them). Resend will be used for all email delivery. The `demo_inbox` table remains in the database but is never written to.
