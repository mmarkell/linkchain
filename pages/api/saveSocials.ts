import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../db';

type ReturnType = {
  success: boolean;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ReturnType>,
) {
  const body = JSON.parse(req.body) as {
    twitterHandle: string;
    address: string;
  };
  const { twitterHandle, address } = body;
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

  const link = await prisma.link.create({
    data: {
      User: {
        connect: {
          id: existingUser.id,
        },
      },
      type: 'TWITTER',
      url: twitterHandle,
    },
  });

  res.status(200).send({
    success: Boolean(link),
  });
}
