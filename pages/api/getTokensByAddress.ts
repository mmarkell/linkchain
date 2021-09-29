import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  const API_KEY = process.env.Etherscan_API_KEY;
  const response = (
    await fetch('', {
      method: 'POST',
    })
  ).json();
  
  res.status(200).json({ name: 'John Doe' });
}
