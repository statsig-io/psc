import type { NextApiRequest, NextApiResponse } from "next";
import ReviewUtils from "@/server/lib/ReviewUtils";
import { ApiHandler, apiExporter } from "@/server/lib/ApiHandler";
import OrgUtils from "@/server/lib/OrgUtils";

class GetReviewFromManager extends ApiHandler {
  public async handleApiCall(
    _: NextApiRequest,
    res: NextApiResponse
  ): Promise<any> {
    const employee = await OrgUtils.genEmployee(this.alias);
    const manager = employee?.managerAlias;
    if (!manager) {
      return {
        review: null,
      }
    }
    const doc = await ReviewUtils.genReviewFromManager(
      this.alias,
      manager,
    );
    const contents = doc?.contents;
    if (!contents) {
      return {
        review: null,
      }
    }
    
    const parsed = JSON.parse(contents);
    return {
      review: parsed.reviewText,
      rating: parsed.rating,
    };
  }
}

export default apiExporter(GetReviewFromManager);