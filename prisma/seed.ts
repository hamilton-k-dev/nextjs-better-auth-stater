import { Role } from "../src/generated/prisma";
import { prisma } from "../src/lib/db";

const users: {
  name: string;
  email: string;
  role: Role;
  emailVerified: boolean;
  image: string | null;
}[] = [
  { name: "Alice Martin",    email: "alice.martin@example.com",    role: "ADMIN", emailVerified: true,  image: "https://i.pravatar.cc/150?u=alice" },
  { name: "Bob Chen",        email: "bob.chen@example.com",        role: "ADMIN", emailVerified: true,  image: "https://i.pravatar.cc/150?u=bob" },
  { name: "Carol Davis",     email: "carol.davis@example.com",     role: "USER",  emailVerified: true,  image: "https://i.pravatar.cc/150?u=carol" },
  { name: "Daniel Kim",      email: "daniel.kim@example.com",      role: "USER",  emailVerified: true,  image: "https://i.pravatar.cc/150?u=daniel" },
  { name: "Eva Rossi",       email: "eva.rossi@example.com",       role: "USER",  emailVerified: true,  image: "https://i.pravatar.cc/150?u=eva" },
  { name: "Frank Müller",    email: "frank.muller@example.com",    role: "USER",  emailVerified: false, image: null },
  { name: "Grace Lee",       email: "grace.lee@example.com",       role: "USER",  emailVerified: true,  image: "https://i.pravatar.cc/150?u=grace" },
  { name: "Henry Dubois",    email: "henry.dubois@example.com",    role: "USER",  emailVerified: false, image: null },
  { name: "Isabelle Nkosi",  email: "isabelle.nkosi@example.com",  role: "USER",  emailVerified: true,  image: "https://i.pravatar.cc/150?u=isabelle" },
  { name: "James Patel",     email: "james.patel@example.com",     role: "USER",  emailVerified: true,  image: "https://i.pravatar.cc/150?u=james" },
  { name: "Kenji Tanaka",    email: "kenji.tanaka@example.com",    role: "USER",  emailVerified: true,  image: "https://i.pravatar.cc/150?u=kenji" },
  { name: "Layla Hassan",    email: "layla.hassan@example.com",    role: "USER",  emailVerified: false, image: null },
  { name: "Marco Ferrari",   email: "marco.ferrari@example.com",   role: "USER",  emailVerified: true,  image: "https://i.pravatar.cc/150?u=marco" },
  { name: "Nina Johansson",  email: "nina.johansson@example.com",  role: "USER",  emailVerified: true,  image: "https://i.pravatar.cc/150?u=nina" },
  { name: "Omar Diallo",     email: "omar.diallo@example.com",     role: "USER",  emailVerified: false, image: null },
  { name: "Priya Sharma",    email: "priya.sharma@example.com",    role: "USER",  emailVerified: true,  image: "https://i.pravatar.cc/150?u=priya" },
  { name: "Quinn Okafor",    email: "quinn.okafor@example.com",    role: "USER",  emailVerified: true,  image: "https://i.pravatar.cc/150?u=quinn" },
  { name: "Rachel Torres",   email: "rachel.torres@example.com",   role: "USER",  emailVerified: true,  image: "https://i.pravatar.cc/150?u=rachel" },
  { name: "Samuel Bergman",  email: "samuel.bergman@example.com",  role: "USER",  emailVerified: false, image: null },
  { name: "Tina Nguyen",     email: "tina.nguyen@example.com",     role: "USER",  emailVerified: true,  image: "https://i.pravatar.cc/150?u=tina" },
];

async function main() {
  console.log("Seeding 20 users…");

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: user,
    });
  }

  const counts = await prisma.user.groupBy({
    by: ["role"],
    _count: { role: true },
  });

  console.log("Done.");
  counts.forEach(({ role, _count }) =>
    console.log(`  ${role}: ${_count.role}`),
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect?.());
