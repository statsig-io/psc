import OrgUtils from "@/server/lib/OrgUtils";
import { ApiHandler, apiExporter } from "@/server/lib/ApiHandler";

class GetAllEmployees extends ApiHandler {
  public async handleApiCall(): Promise<any> {
    const employees = await OrgUtils.genAllEmployees();
    return employees;
  }
}

export default apiExporter(GetAllEmployees);