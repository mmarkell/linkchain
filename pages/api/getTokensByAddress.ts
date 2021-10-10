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
type TokenTransaction = {
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
  return erc721;
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
  return erc20;
};

export const getOpenSeaTokens = async (address: string) => {
  const response = (await (
    await fetch(
      'https://api.opensea.io/api/v1/assets?' +
        new URLSearchParams({
          order_direction: 'desc',
          offset: '0',
          limit: '20',
          owner: address,
        }),
      {
        method: 'GET',
      },
    )
  ).json()) as OpenseaResponse;

  return response.assets.map((asset) => ({
    tokenName: asset.name,
    imageUrl: asset.image_url,
  }));
};

export const getTokensByAddress = async (address: string) => {
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
  const openseaTokens = await getOpenSeaTokens(address);
  return { result: [...etherscanImages, ...openseaTokens] };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ReturnType>,
) {
  const query = req.query;
  const address = query.address;
  if (typeof address === 'string') {
    const result = await getTokensByAddress(address);
    res.status(200).json(result);
  } else {
    res.status(200).send({ result: [] });
  }
}
