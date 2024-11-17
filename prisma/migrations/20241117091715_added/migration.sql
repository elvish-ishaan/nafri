-- AlterTable
ALTER TABLE "Uploads" ADD COLUMN     "deleteDate" TIMESTAMP(3),
ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false;
