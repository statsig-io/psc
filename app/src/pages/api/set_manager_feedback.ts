import type { NextApiRequest, NextApiResponse } from "next";
import ReviewUtils from "@/server/lib/ReviewUtils";
import OrgUtils from "@/server/lib/OrgUtils";
import { ApiHandler, apiExporter } from "@/server/lib/ApiHandler";

class SetManagerFeedback extends ApiHandler {
  public async handleApiCall(
    _req: NextApiRequest,
    _res: NextApiResponse,
    body?: any,
  ): Promise<any> {
    const { contents } = body;
    const manager = await OrgUtils.genManager(this.alias);
    let managerAlias = this.alias;
    if (manager) {
      managerAlias = manager.alias;
    }
    await ReviewUtils.genSaveManagerFeedback(
      this.alias,
      managerAlias,
      contents,
    );
    const doc = await ReviewUtils.genManagerFeedback(
      this.alias,
      managerAlias,
    );
    return {
      lastModified: doc?.lastModified,
    };
  }
}

export default apiExporter(SetManagerFeedback);