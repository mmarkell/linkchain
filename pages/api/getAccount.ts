import { User } from '.prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../db';

type ReturnType = {
  user?: User;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ReturnType>,
) {
  const query = req.query;
  const address = query.address;
  if (typeof address !== 'string') {
    return res.status(403).send({
      user: undefined,
    });
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      address: address,
    },
    include: {
      profileNFT: true,
      links: true,
    },
  });

  return res.status(200).send({
    user: existingUser,
  });
}
