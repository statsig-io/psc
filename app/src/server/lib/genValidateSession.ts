import type { NextApiRequest, NextApiResponse } from "next";
import { getAuthOptions } from '../../pages/api/auth/[...nextauth]'
import { getServerSession } from "next-auth/next"

export default async function genValidateSession(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<string> {
  if (req.method !== 'POST') {
    throw new Error("Invalid request method");
  }

  const authOptions = getAuthOptions(req, res);
  const session = await getServerSession(req, res, authOptions)
  const email = session?.user?.email;
  if (
    email &&
    (email.endsWith("@statsig.com") || email.endsWith("@statsig.io"))
  ) {
    const alias = session.user?.email?.split('@')[0];
    if (alias) {
      return alias;
    }
  }

  throw new Error("Unauthorized access");
}
