-- CreateTable
CREATE TABLE "ApiKeys" (
    "id" TEXT NOT NULL,
    "genDate" TIMESTAMP(3) NOT NULL,
    "key" TEXT NOT NULL,
    "userEmail" TEXT NOT NULL,

    CONSTRAINT "ApiKeys_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ApiKeys" ADD CONSTRAINT "ApiKeys_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "User"("email") ON DELETE RESTRICT ON UPDATE CASCADE;
