import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../db';

type ReturnType = {
  success: boolean;
};

export const verifyOwnership = async (address: string, imageUrl: string) => {
  // TODO: verify ownership
  return true;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ReturnType>,
) {
  const body = JSON.parse(req.body) as { address: string; imageUrl: string };
  const { address, imageUrl } = body;
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

  const aliasOwnsToken = await verifyOwnership(address, imageUrl);
  if (!aliasOwnsToken) {
    return res.status(400).send({
      success: false,
    });
  }

  const user = await prisma.user.update({
    where: {
      address: address,
    },
    data: {
      ...existingUser,
      profileImageUrl: imageUrl,
    },
  });

  res.status(200).send({
    success: Boolean(user),
  });
}
