/*
  Warnings:

  - A unique constraint covering the columns `[hash]` on the table `Uploads` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `hash` to the `Uploads` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Uploads" ADD COLUMN     "hash" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Uploads_hash_key" ON "Uploads"("hash");
