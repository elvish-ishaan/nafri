/*
  Warnings:

  - Added the required column `fileType` to the `Uploads` table without a default value. This is not possible if the table is not empty.
  - Made the column `fileKey` on table `Uploads` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Uploads" ADD COLUMN     "fileType" TEXT NOT NULL,
ALTER COLUMN "fileKey" SET NOT NULL;
