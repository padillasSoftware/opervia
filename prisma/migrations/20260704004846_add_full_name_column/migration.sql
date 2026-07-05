-- AlterTable
ALTER TABLE "employees" ADD COLUMN     "fullName" TEXT NOT NULL DEFAULT '',
ALTER COLUMN "position" DROP NOT NULL;
