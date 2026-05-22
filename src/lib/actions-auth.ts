"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function getSession() {
  return await auth.api.getSession({ headers: await headers() });
}

export async function requireAuth() {
  const session = await getSession();
  if (!session) redirect("/login");
  return session;
}

export async function requireAdmin() {
  const session = await getSession();
  if (!session) redirect("/login");
  if ((session.user as { role?: string }).role !== "ADMIN") redirect("/dashboard");
  return session;
}

export async function signOutAction() {
  await auth.api.signOut({ headers: await headers() });
  redirect("/login");
}

export async function updateUserAction(values: { name?: string; image?: string }) {
  const session = await getSession();
  if (!session) return { error: "Not authenticated" };

  try {
    await auth.api.updateUser({
      body: { name: values.name, image: values.image },
      headers: await headers(),
    });
    return { success: true };
  } catch (error) {
    if (error instanceof Error) return { error: error.message };
    return { error: "Something went wrong" };
  }
}
