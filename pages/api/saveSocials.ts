import { Link, LinkType, Prisma } from '.prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../db';

type ReturnType = {
  success: boolean;
};

type SocialAccount = { title: string; link: string; id: string };
type SocialAccounts = SocialAccount[];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ReturnType>,
) {
  const body = JSON.parse(req.body) as {
    socialAccounts: SocialAccounts;
    address: string;
  };
  const { socialAccounts, address } = body;
  const existingUser = await prisma.user.findUnique({
    where: {
      address: address,
    },
  });

  if (!existingUser) {
    return res.status(400).send({
      success: false,
    });
  }

  const result = await prisma.link.createMany({
    data: socialAccounts.map((elem: SocialAccount) => {
      return {
        type: 'OTHER' as LinkType,
        url: elem.link,
        title: elem.title,
        userId: existingUser.id, // need User?
      };
    }),
    skipDuplicates: true,
  });

  await prisma.user.update({
    where: {
      address,
    },
    data: {},
  });

  res.status(200).send({
    success: Boolean(result.count > 0),
  });
}
