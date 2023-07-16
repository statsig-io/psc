import type { NextApiRequest, NextApiResponse } from "next";
import ReviewUtils from "@/server/lib/ReviewUtils";
import { ApiHandler, apiExporter } from "@/server/lib/ApiHandler";
import PermissionsUtils from "@/server/lib/PermissionsUtils";

class SetReportReview extends ApiHandler {
  public async handleApiCall(
    _req: NextApiRequest,
    _res: NextApiResponse,
    body?: any,
  ): Promise<any> {
    const { reportAlias, contents, submit } = body;
    if (!reportAlias) {
      throw new Error("Missing report alias");
    }
    await PermissionsUtils.ensureCanSaveReportReview(this.alias, reportAlias);
    await ReviewUtils.genSaveReportReview(this.alias, reportAlias, contents, submit);
    const doc = await ReviewUtils.genReportReview(this.alias, reportAlias);
    return {
      lastModified: doc?.lastModified,
    };
  }
}

export default apiExporter(SetReportReview);
