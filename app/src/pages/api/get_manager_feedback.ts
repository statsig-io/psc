import OrgUtils from "@/server/lib/OrgUtils";
import ReviewUtils from "@/server/lib/ReviewUtils";
import { ApiHandler, apiExporter } from "@/server/lib/ApiHandler";

class GetManagerFeedback extends ApiHandler {
  public async handleApiCall(): Promise<any> {
    const manager = await OrgUtils.genManager(this.alias);
    let doc = null;
    if (manager) {
      doc = await ReviewUtils.genManagerFeedback(this.alias, manager?.alias);
    }
    
    return {
      contents: doc?.contents,
      lastModified: doc?.lastModified,
      manager: manager,
    };
  }
}

export default apiExporter(GetManagerFeedback);
