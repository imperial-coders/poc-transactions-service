import { PrismaClient, Prisma } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

const createTransaction = ({ userId }: { userId: string }) => ({
  amountInCents: faker.number.int({ min: 1, max: 10_000 }),
  transactionDate: faker.date.past({ years: 1 }),
  merchant: faker.company.name(),
  summary: faker.commerce.product(),
  userId,
});
('');

async function main() {
  console.log(`Start seeding ...`);
  const first = Array.from(Array(100).keys());
  await prisma.transaction.createMany({
    data: first.map((t) =>
      createTransaction({ userId: 'clwb7mw8300003z6kadi875xg' }),
    ),
  });

  const second = Array.from(Array(150).keys());
  await prisma.transaction.createMany({
    data: second.map((t) =>
      createTransaction({ userId: 'clwb7nckm00033z6kbm4nd22r' }),
    ),
  });

  const third = Array.from(Array(100).keys());
  await prisma.transaction.createMany({
    data: third.map((t) =>
      createTransaction({ userId: 'clwb7nfxq00063z6k0acectsj' }),
    ),
  });
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
