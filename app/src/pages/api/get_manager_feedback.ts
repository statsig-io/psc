import OrgUtils from "@/server/lib/OrgUtils";
import ReviewUtils from "@/server/lib/ReviewUtils";
import { ApiHandler, apiExporter } from "@/server/lib/ApiHandler";
import PermissionsUtils from "@/server/lib/PermissionsUtils";

class GetManagerFeedback extends ApiHandler {
  public async handleApiCall(): Promise<any> {
    const manager = await OrgUtils.genManager(this.alias);
    let doc = null;
    if (manager) {
      doc = await ReviewUtils.genManagerFeedback(this.alias, manager?.alias);
    }

    const canEdit = !doc?.submitted && (
      await PermissionsUtils.canUpdateFeedback()
    );
    const dueDate = await PermissionsUtils.genFeedbackDueDate();
   
    return {
      contents: doc?.contents,
      lastModified: doc?.lastModified,
      manager: manager,
      canEdit,
      dueDate,
      submitted: doc?.submitted,
    };
  }
}

export default apiExporter(GetManagerFeedback);
