import type { NextApiRequest, NextApiResponse } from "next";
import ReviewUtils from "@/server/lib/ReviewUtils";
import { ApiHandler, apiExporter } from "@/server/lib/ApiHandler";

class GetSelfReview extends ApiHandler {
  public async handleApiCall(
    _: NextApiRequest,
    res: NextApiResponse
  ): Promise<any> {
    const doc = await ReviewUtils.genSelfReview(this.alias);
    if (!doc) {
      throw new Error("No self review found");
    }

    return {
      contents: doc?.contents,
      lastModified: doc?.lastModified,
    };
  }
}

export default apiExporter(GetSelfReview);