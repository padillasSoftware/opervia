import "dotenv/config";
import { PrismaClient } from "../prisma/generated/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { roles } from './roles.seed';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
    const rolesCount = await prisma.role.count();
    if (rolesCount <= 0) {
        
        await prisma.role.createMany({
            data: roles
        })
    }
  
  console.log('Seed executed successfully')
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });