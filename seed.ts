import { prisma as db } from './db';

async function main() {
  const alice = await db.user.create({
    data: {
      email: 'alice@prisma.io',
      alias: 'abcdefg',
      addresses: [
        '0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB/7804',
        '0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB/5522',
        '0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB/7523',
      ],
    },
  });

  const bob = await db.user.create({
    data: {
      email: 'bob@prisma.io',
      alias: '1234567',
      addresses: [
        '0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB/123',
        '0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB/234',
        '0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB/456',
      ],
    },
  });
  console.log({ alice, bob });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
