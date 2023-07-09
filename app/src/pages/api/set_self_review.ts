import type { NextApiRequest, NextApiResponse } from "next";
import ReviewUtils from "@/server/lib/ReviewUtils";
import { ApiHandler, apiExporter } from "@/server/lib/ApiHandler";

class SetSelfReview extends ApiHandler {
  public async handleApiCall(
    _req: NextApiRequest,
    _res: NextApiResponse,
    body?: any,
  ): Promise<any> {
    const { contents } = body;
    await ReviewUtils.genSaveSelfReview(this.alias, contents);
    const doc = await ReviewUtils.genSelfReview(this.alias);
    return {
      lastModified: doc?.lastModified,
    };
  }
}

export default apiExporter(SetSelfReview);
