// prisma/seed.ts
import { PrismaClient, Roles } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Seed Users
  const user1 = await prisma.user.upsert({
    where: { email: 'user1@example.com' },
    update: {},
    create: {
      email: 'user1@example.com',
      name: 'User One',
      role: Roles.USER,
    },
  });

  const devUser = await prisma.user.upsert({
    where: { email: 'dev@example.com' },
    update: {},
    create: {
      email: 'dev@example.com',
      name: 'Developer User',
      role: Roles.DEV,
    },
  });

  // Seed Uploads
  await prisma.uploads.createMany({
    data: [
      {
        fileKey: 'user1-file1.jpg',
        uploadDate: new Date().toISOString(),
        fileType: 'jpg',
        userEmail: user1.email,
        starred: false
      },
      {
        fileKey: 'user1-file2.jpg',
        uploadDate: new Date().toISOString(),
        fileType: 'jpg',
        userEmail: user1.email,
        starred: false
      },
      {
        fileKey: 'dev-file1.jpg',
        uploadDate: new Date().toISOString(),
        fileType: 'jpg',
        userEmail: devUser.email,
        starred: true
      },
    ],
  });
  console.log('seed has been added to db')
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
