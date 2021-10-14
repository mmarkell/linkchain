import { prisma as db } from './db';

async function main() {
  const user = await db.user.create({
    data: {
      id: 1,
      alias: 'michael',
      address: '0x1c10eD2ffe6b4228005EbAe5Aa1a9c790D275A52',
    },
  });

  const nft = await db.nft.create({
    data: {
      imageUrl:
        'https://images.unsplash.com/photo-1561948955-570b270e7c36?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8ZnVubnklMjBjYXR8ZW58MHx8MHx8&ixlib=rb-1.2.1&w=1000&q=80',
      address: '0xd539a3a5edb713e6587e559a9d007ffff92bd9ab',
      type: 'ERC20',
      User: {
        connect: {
          id: user.id,
        },
      },
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
