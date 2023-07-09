import type { NextApiRequest, NextApiResponse } from "next";
import ReviewUtils from "@/server/lib/ReviewUtils";
import { ApiHandler, apiExporter } from "@/server/lib/ApiHandler";

class SetPeerFeedback extends ApiHandler {
  public async handleApiCall(
    _req: NextApiRequest,
    _res: NextApiResponse,
    body?: any,
  ): Promise<any> {
    const { peerAlias, contents } = body;
    if (!peerAlias) {
      throw new Error("Missing peer alias");
    }
    await ReviewUtils.genSavePeerFeedback(this.alias, peerAlias, contents);
    const doc = await ReviewUtils.genPeerFeedback(this.alias, peerAlias);
    return {
      lastModified: doc?.lastModified,
    };
  }
}

export default apiExporter(SetPeerFeedback);
