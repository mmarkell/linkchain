import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../db';

type ReturnType = {
  isUsernameValid: boolean;
};

export const getIsUsernameValid = async (
  username: string,
): Promise<{
  isUsernameValid: boolean;
}> => {
  const user = await prisma.user.findUnique({
    where: {
      alias: username,
    },
    rejectOnNotFound: false,
  });

  return {
    isUsernameValid: !Boolean(user),
  };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ReturnType>,
) {
  const query = req.query;
  const username = query.username;
  if (typeof username === 'string') {
    const result = await getIsUsernameValid(username);
    res.status(200).json(result);
  } else {
    res.status(400).json({
      isUsernameValid: false,
    });
  }
}
