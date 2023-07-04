import type { NextApiRequest, NextApiResponse } from "next";
import OrgUtils from "@/lib/OrgUtils";
import genValidateSession from "@/lib/genValidateSession";

export default async function get_all_employees(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  await genValidateSession(req, res);
  const employees = await OrgUtils.genAllEmployees();
  res.status(200).json({
    success: true,
    data: employees,
  });
}
