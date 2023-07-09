import ReviewUtils from "@/server/lib/ReviewUtils";
import { ApiHandler, apiExporter } from "@/server/lib/ApiHandler";
import { NextApiRequest, NextApiResponse } from "next";
import OrgUtils from "@/server/lib/OrgUtils";

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
    return {
      contents: doc?.contents,
      lastModified: doc?.lastModified,
      peer,
    };
  }
}

export default apiExporter(GetPeerFeedback);
