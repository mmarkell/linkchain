import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../db';

type ReturnType = {
  success: boolean;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ReturnType>,
) {
  const body = JSON.parse(req.body);
  const { username, address } = body;
  const existingUser = await prisma.user.findUnique({
    where: {
      address: address,
    },
  });

  if (existingUser) {
    return res.status(403).send({
      success: false,
    });
  }

  const user = await prisma.user.create({
    data: {
      alias: username,
      address,
    },
  });

  res.status(200).send({
    success: Boolean(user),
  });
}
