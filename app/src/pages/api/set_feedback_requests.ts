import type { NextApiRequest, NextApiResponse } from "next";
import OrgUtils from "@/lib/OrgUtils";
import genValidateSession from "@/lib/genValidateSession";
import ReviewUtils from "@/lib/ReviewUtils";

export default async function set_feedback_requests(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const alias = await genValidateSession(req, res);
  const reports = await OrgUtils.genReports(alias);

  const requests = req.body;
  console.log(requests);

  const safeRequests = [] as Array<any>;
  reports.forEach(r => {
    const reviewee = r.alias;
    const reviewers = requests[reviewee] || [];
    const uniqueReviewers = reviewers.filter(
      (value: any, index: any, array: any) => array.indexOf(value) === index
    );
    uniqueReviewers.forEach((reviewer: any) => {
      safeRequests.push({
        reviewer,
        reviewee,
        requester: alias,
      });
    });
  });

  ReviewUtils.genSaveFeedbackRequests(safeRequests, reports);

  res.status(200).json({
    success: true,
    data: {},
  });
}
