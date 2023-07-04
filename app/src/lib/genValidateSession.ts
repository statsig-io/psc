import type { NextApiRequest, NextApiResponse } from "next";

export default async function genValidateSession(
  req: NextApiRequest,
  res: NextApiResponse | null = null
): Promise<string> {
  return 'vijaye';
  // throw new Error("Unauthorized access");
}
