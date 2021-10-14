import { NextApiRequest, NextApiResponse } from 'next';

const fetch = require('@vercel/fetch-retry')(require('node-fetch'));

export type ReturnType = {
  imageUrl: string;
};

type Asset = {
  image_url: string;
};

type OpenseaResponse = {
  assets: Asset[];
};

export async function getImageForToken(address: string, tokenId: string) {
  return Promise.race([coreGetImage(address, tokenId), awaitTimeout(500)]);
}

const awaitTimeout = (delay) =>
  new Promise<void>((resolve, reject) => setTimeout(() => reject(), delay));

export async function coreGetImage(address: string, tokenId: string) {
  const options = { method: 'GET' };
  const queryString = tokenId
    ? `https://api.opensea.io/api/v1/assets?order_direction=desc&offset=0&limit=20&asset_contract_address=${address}&token_ids=${tokenId}`
    : `https://api.opensea.io/api/v1/assets?order_direction=desc&offset=0&limit=20&asset_contract_address=${address}`;

  const data = (await (
    await fetch(queryString, options)
  ).json()) as OpenseaResponse;

  const imageUrl = data.assets?.[0]?.image_url;
  return {
    imageUrl,
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ReturnType>,
) {
  const query = req.query;
  const address = query.address;
  const tokenId = query.tokenId;
  if (typeof address === 'string' && typeof tokenId === 'string') {
    const result = await getImageForToken(address, tokenId);
    if (result) {
      res.setHeader(
        'Cache-Control',
        'public, s-maxage=10, stale-while-revalidate=59',
      );
      res.status(200).json(result);
    } else {
      res.status(400);
    }
  } else {
    res.status(500);
  }
}
