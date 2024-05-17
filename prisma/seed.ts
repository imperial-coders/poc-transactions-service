import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

const transactionData: Prisma.TransactionCreateInput[] = [
  {
    amountInCents: 10000,
    transactionDate: new Date(),
    merchant: 'Walmart',
    summary: 'Stuff for the party',
  },
  {
    amountInCents: 10000,
    transactionDate: new Date(),
    merchant: 'Target',
    summary: 'House supplies',
  },
  {
    amountInCents: 10000,
    transactionDate: new Date(),
    merchant: "Kohl's",
    summary: 'Clothes for the little one',
  },
];

async function main() {
  console.log(`Start seeding ...`);
  for (const t of transactionData) {
    const transaction = await prisma.transaction.create({
      data: t,
    });
    console.log(`Created user with id: ${transaction.id}`);
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
