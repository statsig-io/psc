import type { NextApiRequest, NextApiResponse } from "next";
import ReviewUtils from "@/server/lib/ReviewUtils";
import { ApiHandler, apiExporter } from "@/server/lib/ApiHandler";
import PermissionsUtils from "@/server/lib/PermissionsUtils";

class SetPeerFeedback extends ApiHandler {
  public async handleApiCall(
    _req: NextApiRequest,
    _res: NextApiResponse,
    body?: any,
  ): Promise<any> {
    const { peerAlias, contents, submit } = body;
    if (!peerAlias) {
      throw new Error("Missing peer alias");
    }
    
    await PermissionsUtils.ensureCanSavePeerFeedback(this.alias, peerAlias);
    await ReviewUtils.genSavePeerFeedback(this.alias, peerAlias, contents, submit);
    const doc = await ReviewUtils.genPeerFeedback(this.alias, peerAlias);
    return {
      lastModified: doc?.lastModified,
    };
  }
}

export default apiExporter(SetPeerFeedback);
