import type { NextApiRequest, NextApiResponse } from "next";
import OrgUtils from "@/lib/OrgUtils";
import genValidateSession from "@/lib/genValidateSession";

export default async function get_reports(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const alias = await genValidateSession(req, res);
  const reports = await OrgUtils.genReports(alias);
  res.status(200).json({
    success: true,
    data: reports
  });
}
