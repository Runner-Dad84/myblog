const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');

async function main() {
  console.log('Seeding database...');

  //clear db
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();

  // 1️⃣ Create a user
  const hashedPassword = await bcrypt.hash('password123', 10);
  const admin = await prisma.user.create({
    data: {
      username: 'Andrew',
      password: hashedPassword,
      admin: true,
    },
  });

  // 2️⃣ Create posts for that user
   const postOne = await prisma.post.create({
    data: {
      title: "Seeded Post",
      content: "This post was created by the seed script",
      isPublic: true,
      isPublished: true,
      userId: admin.id,
    },
  });
 //3️⃣  Create comment for the post
  await prisma.comment.create({
    data: {
      content: "First comment",
      userId: admin.id,
      postId: postOne.id,
    },
  });

  console.log('✅ Seeding finished!');
}

main()
  .catch(e => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });