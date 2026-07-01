import "dotenv/config";
import { PrismaClient } from "../prisma/generated/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { roles } from "./roles.seed";
import { users } from "./user.seed";

import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  for (const roleData of roles) {
    await prisma.role.upsert({
      where: { name: roleData.name },
      update: {},
      create: roleData,
    });
  }

  const center = await prisma.center.upsert({
    where: { email: "demo@maelmar.com" },
    update: {},
    create: {
      name: "Maelmar Demo Center",
      email: "demo@maelmar.com",
      phone: "6861234567",
      address: "Mexicali, Baja California",
    },
  });

  const passwordHash = await bcrypt.hash("Password123!", 10);

  for (const userData of users) {
    const role = await prisma.role.findUniqueOrThrow({
      where: { name: userData.role },
    });

    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {
        roleId: role.id,
        centerId: center.id,
      },
      create: {
        email: userData.email,
        passwordHash,
        centerId: center.id,
        roleId: role.id,
      },
    });

    
      await prisma.employee.upsert({
        where: { userId: user.id },
        update: {
          centerId: center.id,
          firstName: userData.firstName,
          lastName: userData.lastName,
          position: userData.position,
        },
        create: {
          userId: user.id,
          centerId: center.id,
          firstName: userData.firstName,
          lastName: userData.lastName,
          position: userData.position,
          hireDate: new Date(),
        },
      });
    
  }

  console.log("Seed executed successfully");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
