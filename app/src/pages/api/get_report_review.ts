import ReviewUtils from "@/server/lib/ReviewUtils";
import { ApiHandler, apiExporter } from "@/server/lib/ApiHandler";
import { NextApiRequest, NextApiResponse } from "next";
import OrgUtils from "@/server/lib/OrgUtils";
import PermissionsUtils from "@/server/lib/PermissionsUtils";

class GetReportReview extends ApiHandler {
  public async handleApiCall(
    _req: NextApiRequest,
    _res: NextApiResponse,
    body: any,
  ): Promise<any> {
    const { reportAlias } = body;
    if (!reportAlias) {
      throw new Error("Missing report alias");
    }
    const report = await OrgUtils.genEmployee(reportAlias);
    if (report?.managerAlias !== this.alias) {
      throw new Error("You are not the manager of this employee");
    }

    const doc = await ReviewUtils.genReportReview(this.alias, reportAlias);    
    const allPeerFeedbacks = 
      await ReviewUtils.genAllSubmittedPeerFeedbacks(reportAlias);
    const peerFeedbacks = allPeerFeedbacks.filter(
      (f) => f.reviewer !== this.alias,
    );
    const aliasSet = new Set<string>();
    peerFeedbacks.forEach((f) => {
      aliasSet.add(f.reviewer);
      aliasSet.add(f.reviewee);
    });
    const employeeNames = await OrgUtils.genEmployeeNames(Array.from(aliasSet));
    const canEdit = await PermissionsUtils.canUpdateReportReview();
    const dueDate = await PermissionsUtils.genReportReviewDueDate();
    return {
      contents: doc?.contents,
      lastModified: doc?.lastModified,
      peerFeedbacks,
      employeeNames,
      report,
      canEdit,
      dueDate,
    };
  }
}

export default apiExporter(GetReportReview);
