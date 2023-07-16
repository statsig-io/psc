import ReviewUtils from "@/server/lib/ReviewUtils";
import { ApiHandler, apiExporter } from "@/server/lib/ApiHandler";
import { NextApiRequest, NextApiResponse } from "next";
import OrgUtils from "@/server/lib/OrgUtils";
import PermissionsUtils from "@/server/lib/PermissionsUtils";

class GetPeerFeedback extends ApiHandler {
  public async handleApiCall(
    _req: NextApiRequest,
    _res: NextApiResponse,
    body: any,
  ): Promise<any> {
    const { peerAlias } = body;
    if (!peerAlias) {
      throw new Error("Missing peer alias");
    }
    const peer = await OrgUtils.genEmployee(peerAlias);
    const doc = await ReviewUtils.genPeerFeedback(this.alias, peerAlias);  
    const canEdit = !doc?.submitted && (
      await PermissionsUtils.canUpdateFeedback()
    );
    const dueDate = await PermissionsUtils.genFeedbackDueDate();

    return {
      contents: doc?.contents,
      lastModified: doc?.lastModified,
      peer,
      canEdit,
      dueDate,
      submitted: doc?.submitted,
    };
  }
}

export default apiExporter(GetPeerFeedback);
