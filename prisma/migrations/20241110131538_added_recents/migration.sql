-- DropForeignKey
ALTER TABLE "Uploads" DROP CONSTRAINT "Uploads_userEmail_fkey";

-- CreateTable
CREATE TABLE "Recents" (
    "id" TEXT NOT NULL,
    "uploadId" TEXT NOT NULL,
    "uploadType" TEXT NOT NULL,
    "accessedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userEmail" TEXT NOT NULL,

    CONSTRAINT "Recents_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Uploads" ADD CONSTRAINT "Uploads_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "User"("email") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recents" ADD CONSTRAINT "Recents_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "User"("email") ON DELETE CASCADE ON UPDATE CASCADE;
