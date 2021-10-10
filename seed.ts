import { prisma as db } from './db';

async function main() {
  await db.user.create({
    data: {
      alias: 'abcdefg',
      socialUrls: ['https://twitter.com/QuantumNFT'],
      address: '0x1c10eD2ffe6b4228005EbAe5Aa1a9c790D275A52',
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
