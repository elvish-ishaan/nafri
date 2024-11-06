// deleteData.js

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function deleteAllData() {
  try {
    // Delete data from dependent tables first to avoid foreign key constraint issues
    await prisma.uploads.deleteMany({});
    await prisma.user.deleteMany({});

    console.log("All data deleted successfully.");
  } catch (error) {
    console.error("Error deleting data:", error);
  } finally {
    await prisma.$disconnect();
  }
}

deleteAllData();
