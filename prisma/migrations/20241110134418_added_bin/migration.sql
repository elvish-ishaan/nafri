-- CreateTable
CREATE TABLE "BinFiles" (
    "id" TEXT NOT NULL,
    "triggeredAt" TEXT NOT NULL,
    "uploadedFileId" TEXT NOT NULL,
    "userEmail" TEXT NOT NULL,

    CONSTRAINT "BinFiles_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BinFiles" ADD CONSTRAINT "BinFiles_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "User"("email") ON DELETE CASCADE ON UPDATE CASCADE;
