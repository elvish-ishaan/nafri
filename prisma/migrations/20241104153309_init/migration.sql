-- CreateEnum
CREATE TYPE "Roles" AS ENUM ('USER', 'DEV');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "Roles" NOT NULL DEFAULT 'USER';
