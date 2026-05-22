import { prisma } from "./lib/db";

async function main() {
  // CREATE
  const newUser = await prisma.user.create({
    data: { name: "Alice", email: `alice-${Date.now()}@example.com` },
  });
  console.log("Created user:", newUser);

  // READ
  const foundUser = await prisma.user.findUnique({ where: { id: newUser.id } });
  console.log("Found user:", foundUser);

  // UPDATE
  const updatedUser = await prisma.user.update({
    where: { id: newUser.id },
    data: { name: "Alice Smith" },
  });
  console.log("Updated user:", updatedUser);

  // DELETE
  await prisma.user.delete({ where: { id: newUser.id } });
  console.log("Deleted user.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
