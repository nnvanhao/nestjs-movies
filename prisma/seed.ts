import { PrismaClient } from '@prisma/client';
import { userData } from './seeds/users';
import { userRoleData } from './seeds/userRoles';
import { userRoleAssignmentData } from './seeds/userRoleAssignment';
const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding ...`);

  // Seeding user
  for (const u of userData) {
    await prisma.user.upsert({
      where: {
        id: u.id,
      },
      update: {},
      create: u,
    });
  }

  // Seeding user role
  for (const ur of userRoleData) {
    await prisma.userRole.upsert({
      where: {
        id: ur.id,
      },
      update: {},
      create: ur,
    });
  }

  // Seeding user role assignment
  for (const urs of userRoleAssignmentData) {
    await prisma.userRoleAssignment.upsert({
      where: {
        userId_roleId: {
          userId: urs.userId,
          roleId: urs.roleId,
        },
      },
      update: {},
      create: urs,
    });
  }

  console.log(`Seeding finished.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
