/*
  Warnings:

  - You are about to drop the column `authorId` on the `Uploads` table. All the data in the column will be lost.
  - Added the required column `userEmail` to the `Uploads` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Uploads" DROP CONSTRAINT "Uploads_authorId_fkey";

-- AlterTable
ALTER TABLE "Uploads" DROP COLUMN "authorId",
ADD COLUMN     "userEmail" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Uploads" ADD CONSTRAINT "Uploads_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "User"("email") ON DELETE RESTRICT ON UPDATE CASCADE;
