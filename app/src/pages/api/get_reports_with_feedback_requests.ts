import type { NextApiRequest, NextApiResponse } from "next";
import OrgUtils from "@/lib/OrgUtils";
import genValidateSession from "@/lib/genValidateSession";
import ReviewUtils from "@/lib/ReviewUtils";

export default async function get_reports_with_feedback_requests(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const alias = await genValidateSession(req, res);
  const reports = await OrgUtils.genReports(alias);
  const employees = await OrgUtils.genAllEmployees();
  const requests = await ReviewUtils.genFeedbackRequests(
    reports.map(r => r.alias)
  );

  const reportsAndRequests: Array<Record<string, any>> = [];
  for (const report of reports) {
    reportsAndRequests.push({
      alias: report.alias,
      employeeName: report.employeeName,
      requests: requests.filter(
          r => r.reviewee === report.alias
        ).map(r => r.reviewer),
    });
  }

  console.log(reportsAndRequests);
  res.status(200).json({
    success: true,
    data: {
      reportsAndRequests,
      reports,
      employees,
    },
  });
}
