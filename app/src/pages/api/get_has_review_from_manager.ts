import type { NextApiRequest, NextApiResponse } from "next";
import ReviewUtils from "@/server/lib/ReviewUtils";
import { ApiHandler, apiExporter } from "@/server/lib/ApiHandler";
import OrgUtils from "@/server/lib/OrgUtils";

class GetHasReviewFromManager extends ApiHandler {
  public async handleApiCall(
    _: NextApiRequest,
    res: NextApiResponse
  ): Promise<any> {
    const employee = await OrgUtils.genEmployee(this.alias);
    const manager = employee?.managerAlias;
    if (!manager) {
      return {
        hasReviewFromManager: false,
      }
    }
    const doc = await ReviewUtils.genReviewFromManager(this.alias, manager);    
    return {
      hasReviewFromManager: !!doc,
    };
  }
}

export default apiExporter(GetHasReviewFromManager);