import type { NextApiRequest, NextApiResponse } from "next";
import ReviewUtils from "@/server/lib/ReviewUtils";
import { ApiHandler, apiExporter } from "@/server/lib/ApiHandler";
import PermissionsUtils from "@/server/lib/PermissionsUtils";

class GetSelfReview extends ApiHandler {
  public async handleApiCall(
    _: NextApiRequest,
    res: NextApiResponse
  ): Promise<any> {
    const doc = await ReviewUtils.genSelfReview(this.alias);
    const canEdit = !doc?.submitted && 
      await PermissionsUtils.canUpdateFeedback();
    const dueDate = await PermissionsUtils.genFeedbackDueDate();

    return {
      contents: doc?.contents,
      lastModified: doc?.lastModified,
      canEdit,
      dueDate,
      submitted: doc?.submitted,
    };
  }
}

export default apiExporter(GetSelfReview);