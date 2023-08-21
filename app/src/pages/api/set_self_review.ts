import type { NextApiRequest, NextApiResponse } from "next";
import ReviewUtils from "@/server/lib/ReviewUtils";
import { ApiHandler, apiExporter } from "@/server/lib/ApiHandler";
import PermissionsUtils from "@/server/lib/PermissionsUtils";

class SetSelfReview extends ApiHandler {
  public async handleApiCall(
    _req: NextApiRequest,
    _res: NextApiResponse,
    body?: any,
  ): Promise<any> {
    // await PermissionsUtils.ensureCanSaveSelfReview(this.alias);
    
    const { contents, submit } = body;
    await ReviewUtils.genSaveSelfReview(this.alias, contents, submit);
    const doc = await ReviewUtils.genSelfReview(this.alias);
    return {
      lastModified: doc?.lastModified,
    };
  }
}

export default apiExporter(SetSelfReview);
