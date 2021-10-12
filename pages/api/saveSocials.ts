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

  const user = await prisma.user.update({
    where: {
      address: address,
    },
    data: {
      socialUrls: [twitterHandle],
    },
  });

  res.status(200).send({
    success: Boolean(user),
  });
}
