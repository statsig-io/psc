import type { NextApiRequest, NextApiResponse } from "next";
import ReviewUtils from "@/server/lib/ReviewUtils";
import OrgUtils from "@/server/lib/OrgUtils";
import { ApiHandler, apiExporter } from "@/server/lib/ApiHandler";
import PermissionsUtils from "@/server/lib/PermissionsUtils";

class SetManagerFeedback extends ApiHandler {
  public async handleApiCall(
    _req: NextApiRequest,
    _res: NextApiResponse,
    body?: any,
  ): Promise<any> {
    const { contents, submit } = body;
    const manager = await OrgUtils.genManager(this.alias);
    let managerAlias = this.alias;
    if (manager) {
      managerAlias = manager.alias;
    }
    await PermissionsUtils.ensureCanSaveManagerFeedback(this.alias, managerAlias);
    await ReviewUtils.genSaveManagerFeedback(
      this.alias,
      managerAlias,
      contents,
      submit,
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