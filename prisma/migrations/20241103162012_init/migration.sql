/*
  Warnings:

  - You are about to drop the column `content` on the `Uploads` table. All the data in the column will be lost.
  - You are about to drop the column `published` on the `Uploads` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Uploads` table. All the data in the column will be lost.
  - Added the required column `uploadDate` to the `Uploads` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Uploads" DROP COLUMN "content",
DROP COLUMN "published",
DROP COLUMN "title",
ADD COLUMN     "fileKey" TEXT,
ADD COLUMN     "uploadDate" TEXT NOT NULL;
