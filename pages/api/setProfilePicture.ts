import { Nft } from '.prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../db';
import { getTokensByAddress } from './getTokensByAddress';

type ReturnType = {
  success: boolean;
};

export type SetProfilePictureCommand = {
  userAddress: string;
  nftArgs: Omit<Nft, 'id'>;
};

export const verifyOwnership = async (
  userAddress: string,
  nftAddress: string,
) => {
  const tokens = await getTokensByAddress(userAddress);
  return tokens.result?.some((token) => token.address === nftAddress);
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ReturnType>,
) {
  const body = JSON.parse(req.body) as SetProfilePictureCommand;

  const { userAddress, nftArgs } = body;

  const existingUser = await prisma.user.findUnique({
    where: {
      address: userAddress,
    },
  });

  if (!existingUser) {
    return res.status(400).send({
      success: false,
    });
  }

  const aliasOwnsToken = await verifyOwnership(userAddress, nftArgs.address);
  if (!aliasOwnsToken) {
    return res.status(400).send({
      success: false,
    });
  }

  const nft = await prisma.nft.create({
    data: {
      address: nftArgs.address,
      imageUrl: nftArgs.imageUrl,
      type: nftArgs.type,
      user: {
        connect: {
          id: existingUser.id,
        },
      },
    },
  });

  await prisma.user.update({
    where: {
      address: userAddress,
    },
    data: {
      nftId: nft.id,
    },
  });

  res.status(200).send({
    success: Boolean(nft),
  });
}
