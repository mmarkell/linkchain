import { NFTType } from '.prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getImageForToken } from './getImageForToken';

type EtherscanAPIResponseItem = {
  contractAddress: string;
  tokenID: string;
  tokenName: string;
};

type EtherscanAPIResponse = {
  result: EtherscanAPIResponseItem[];
};

type GetTokensByOwnerResponse = (Omit<
  EtherscanAPIResponseItem,
  'contractAddress'
> & {
  type: NFTType;
  address: string;
})[];

export type ReturnItem = Omit<EtherscanAPIResponseItem, 'contractAddress'> & {
  imageUrl: string;
  type: NFTType;
  address: string;
};

type ReturnType = {
  result: ReturnItem[];
};

const getERC721byOwner = async (
  address: string,
): Promise<GetTokensByOwnerResponse> => {
  const API_KEY = process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY;
  const erc721 = (await // ERC 721 ownership
  (
    await fetch(
      'https://api.etherscan.io/api?' +
        new URLSearchParams({
          module: 'account',
          action: 'tokennfttx',
          address,
          page: '1',
          offset: '100',
          sort: 'asc',
          apiKey: API_KEY,
        }),
      {
        method: 'GET',
      },
    )
  ).json()) as EtherscanAPIResponse;
  if (!erc721?.result || !erc721?.result?.map) {
    return [];
  }
  return erc721?.result?.map((r) => ({
    tokenName: r.tokenName,
    tokenID: r.tokenID,
    address: r.contractAddress,
    type: 'ERC721',
  }));
};

export const getERC20byOwner = async (
  address: string,
): Promise<GetTokensByOwnerResponse> => {
  const API_KEY = process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY;
  const erc20 = (await // ERC 20 ownership
  (
    await fetch(
      'https://api.etherscan.io/api?' +
        new URLSearchParams({
          module: 'account',
          action: 'tokentx',
          address,
          page: '1',
          offset: '100',
          sort: 'asc',
          apiKey: API_KEY,
        }),
      {
        method: 'GET',
      },
    )
  ).json()) as EtherscanAPIResponse;

  if (!erc20?.result || !erc20?.result?.map) {
    return [];
  }

  return erc20?.result.map((r) => ({
    tokenName: r.tokenName,
    tokenID: r.tokenID,
    address: r.contractAddress,
    type: 'ERC20',
  }));
};

export const getTokensByAddress = async (
  address: string,
): Promise<ReturnType> => {
  const erc721 = await getERC721byOwner(address);
  const erc20 = await getERC20byOwner(address);
  const data = [...erc721, ...erc20];

  // let etherscanImages = [];

  const etherscanImages: ReturnItem[] = [];
  for (let i = 0; i < data?.length; i++) {
    const datum = data[i];
    if (!datum) break;
    try {
      const image = await getImageForToken(datum.address, datum.tokenID);
      if (!image || !image.imageUrl) break;
      etherscanImages.push({
        tokenID: datum.tokenID,
        address: datum.address,
        tokenName: datum.tokenName,
        imageUrl: image.imageUrl,
        type: datum.type,
      });
    } catch (e) {
      console.log(e);
    }
  }

  console.log(etherscanImages);

  /**
   * Remove duplicates and undefined values from the array
   */
  const final: ReturnItem[] = [];
  const seen = {};
  for (const key in etherscanImages) {
    const item = etherscanImages[key];
    if (!item.imageUrl) continue;
    if (seen[item.imageUrl]) {
      continue;
    } else {
      seen[item.imageUrl] = true;
      final.push(item);
    }
  }
  return { result: final };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ReturnType>,
) {
  const query = req.query;
  const address = query.address;
  if (typeof address === 'string') {
    const result = await getTokensByAddress(address);
    res.setHeader(
      'Cache-Control',
      'public, s-maxage=10, stale-while-revalidate=59',
    );
    res.setHeader('X-Cache', 'HIT');

    res.status(200).json(result);
  } else {
    res.status(200).send({ result: [] });
  }
}
