import ReviewUtils from "@/server/lib/ReviewUtils";
import { ApiHandler, apiExporter } from "@/server/lib/ApiHandler";
import { NextApiRequest, NextApiResponse } from "next";
import OrgUtils from "@/server/lib/OrgUtils";

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
    return {
      contents: doc?.contents,
      lastModified: doc?.lastModified,
      report,
    };
  }
}

export default apiExporter(GetReportReview);
