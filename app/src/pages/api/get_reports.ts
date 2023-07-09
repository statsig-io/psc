import OrgUtils from "@/server/lib/OrgUtils";
import { ApiHandler, apiExporter } from "@/server/lib/ApiHandler";

class GetReports extends ApiHandler {
  public async handleApiCall(): Promise<any> {
    const reports = await OrgUtils.genReports(this.alias);
    return reports;
  }
}

export default apiExporter(GetReports);