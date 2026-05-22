import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { magicLink } from "better-auth/plugins";
import { prisma } from "./db";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const DEMO = process.env.DEMO_MODE === "true";

async function saveDemoEmail(email: string, type: string, subject: string, url: string) {
  try {
    await prisma.demoInbox.upsert({
      where: { email_type: { email, type } },
      update: { url, subject },
      create: { email, type, subject, url },
    });
  } catch (e) {
    console.error("[demo] saveDemoEmail failed — did you run prisma migrate?", e);
  }
}

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",

  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "USER",
        input: false,
      },
    },
  },

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      if (DEMO) {
        await saveDemoEmail(user.email, "password-reset", "Reset your password", url);
        return;
      }
      await resend.emails.send({
        from: process.env.EMAIL_FROM!,
        to: user.email,
        subject: "Reset your password",
        html: `
          <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px">
            <h2 style="font-size:20px;font-weight:600;color:#111">Reset your password</h2>
            <p style="color:#555;font-size:14px">Click the button below to reset your password. This link expires in 1 hour.</p>
            <a href="${url}" style="display:inline-block;margin-top:16px;padding:12px 24px;background:#111;color:#fff;border-radius:8px;text-decoration:none;font-size:14px;font-weight:500">
              Reset Password
            </a>
            <p style="margin-top:24px;color:#999;font-size:12px">If you didn't request this, you can safely ignore this email.</p>
          </div>
        `,
      });
    },
  },

  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      if (DEMO) {
        await saveDemoEmail(user.email, "verification", "Verify your email address", url);
        return;
      }
      await resend.emails.send({
        from: process.env.EMAIL_FROM!,
        to: user.email,
        subject: "Verify your email address",
        html: `
          <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px">
            <h2 style="font-size:20px;font-weight:600;color:#111">Verify your email</h2>
            <p style="color:#555;font-size:14px">Thanks for signing up! Click below to verify your email address.</p>
            <a href="${url}" style="display:inline-block;margin-top:16px;padding:12px 24px;background:#111;color:#fff;border-radius:8px;text-decoration:none;font-size:14px;font-weight:500">
              Verify Email
            </a>
            <p style="margin-top:24px;color:#999;font-size:12px">If you didn't create an account, you can safely ignore this email.</p>
          </div>
        `,
      });
    },
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },

  plugins: [
    magicLink({
      sendMagicLink: async ({ email, url }) => {
        if (DEMO) {
          await saveDemoEmail(email, "magic-link", "Your magic link", url);
          return;
        }
        await resend.emails.send({
          from: process.env.EMAIL_FROM!,
          to: email,
          subject: "Your magic link",
          html: `
            <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px">
              <h2 style="font-size:20px;font-weight:600;color:#111">Sign in to your account</h2>
              <p style="color:#555;font-size:14px">Click the button below to sign in. This link expires in 15 minutes.</p>
              <a href="${url}" style="display:inline-block;margin-top:16px;padding:12px 24px;background:#111;color:#fff;border-radius:8px;text-decoration:none;font-size:14px;font-weight:500">
                Sign In
              </a>
              <p style="margin-top:24px;color:#999;font-size:12px">If you didn't request this, you can safely ignore this email.</p>
            </div>
          `,
        });
      },
    }),
  ],

  session: {
    additionalFields: {
      role: {
        type: "string",
      },
    },
    expiresIn: 60 * 60 * 24 * 2,
    updateAge: 60 * 60 * 24,
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },

  trustedOrigins: [process.env.BETTER_AUTH_URL ?? "http://localhost:3000"],
});

export type AuthUser = typeof auth.$Infer.Session.user;
export type AuthSession = typeof auth.$Infer.Session;
