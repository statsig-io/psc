import type { NextApiRequest, NextApiResponse } from "next";
import ReviewUtils from "@/server/lib/ReviewUtils";
import { ApiHandler, apiExporter } from "@/server/lib/ApiHandler";
import OrgUtils from "@/server/lib/OrgUtils";

class SetReportReview extends ApiHandler {
  public async handleApiCall(
    _req: NextApiRequest,
    _res: NextApiResponse,
    body?: any,
  ): Promise<any> {
    const { reportAlias, contents } = body;
    if (!reportAlias) {
      throw new Error("Missing report alias");
    }
    const report = await OrgUtils.genEmployee(reportAlias);
    if (report?.managerAlias !== this.alias) {
      throw new Error("You are not the manager of this employee");
    }

    await ReviewUtils.genSaveReportReview(this.alias, reportAlias, contents);
    const doc = await ReviewUtils.genReportReview(this.alias, reportAlias);
    return {
      lastModified: doc?.lastModified,
    };
  }
}

export default apiExporter(SetReportReview);
