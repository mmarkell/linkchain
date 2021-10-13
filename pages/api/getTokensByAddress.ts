import type { NextApiRequest, NextApiResponse } from 'next';
import { getImageForToken } from './getImageForToken';

type EtherscanResponseItem = {
  from: string;
  contractAddress: string;
  to: string;
  tokenID: string;
  tokenName: string;
};

type EtherscanResponse = { result: EtherscanResponseItem[] };
export type TokenTransaction = {
  imageUrl: string;
  tokenName: string;
};

type OpenseaItem = {
  token_id: string;
  image_url: string;
  background_color: string;
  name: string;
  external_link: string;
};

type OpenseaResponse = {
  assets: OpenseaItem[];
};

type ReturnType = {
  result: TokenTransaction[];
};

const getERC721byOwner = async (address: string) => {
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
  ).json()) as EtherscanResponse;
  if (!erc721.result || !erc721.result.map) {
    return {
      result: [],
    };
  }
  return {
    result: erc721.result?.map((r) => ({
      ...r,
      tokenName: `${r.tokenName} #${r.tokenID}`, // add the ID to the end of the token name
    })),
  };
};

export const getERC20byOwner = async (address: string) => {
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
  ).json()) as EtherscanResponse;
  if (!erc20?.result || !erc20.result?.map) {
    return {
      result: [],
    };
  }
  return {
    result: erc20.result?.map((r) => ({
      ...r,
      tokenName: `${r.tokenName} #${r.tokenID}`, // add the ID to the end of the token name
    })),
  };
};

export const getTokensByAddress = async (
  address: string,
): Promise<ReturnType> => {
  const erc721 = await getERC721byOwner(address);
  const erc20 = await getERC20byOwner(address);
  const data = [...erc721.result, ...erc20.result];

  const etherscanImages = await Promise.all(
    data.map(async (res) => {
      const { imageUrl } = await getImageForToken(
        res.contractAddress,
        res.tokenID,
      );
      return {
        tokenName: res.tokenName,
        imageUrl,
      };
    }),
  );
  /**
   * Remove duplicates and undefined values from the array
   */
  const final: TokenTransaction[] = [];
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
