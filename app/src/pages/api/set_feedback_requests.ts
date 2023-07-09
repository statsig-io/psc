import type { NextApiRequest, NextApiResponse } from "next";
import OrgUtils from "@/server/lib/OrgUtils";
import ReviewUtils from "@/server/lib/ReviewUtils";
import { ApiHandler, apiExporter } from "@/server/lib/ApiHandler";

class SetFeedbackRequests extends ApiHandler {
  public async handleApiCall(
    _req: NextApiRequest,
    _res: NextApiResponse,
    body?: any,
  ): Promise<any> {
    const reports = await OrgUtils.genReports(this.alias);
    const { requests } = body;

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
          requester: this.alias,
        });
      });
    });

    await ReviewUtils.genSaveFeedbackRequests(safeRequests, reports);

    return {};
  }
}

export default apiExporter(SetFeedbackRequests);