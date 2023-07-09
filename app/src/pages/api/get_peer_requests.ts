import { ApiHandler, apiExporter } from "@/server/lib/ApiHandler";
import OrgUtils from "@/server/lib/OrgUtils";
import ReviewUtils from "@/server/lib/ReviewUtils";

class GetPeerRequests extends ApiHandler {
  public async handleApiCall(): Promise<any> {
    const requests = await ReviewUtils.genPeerReviewList(this.alias);
    const allEmployees = await OrgUtils.genEmployeeNames(
      requests.map((r: any) => r.reviewee)
    );
    return requests.map((r: any) => ({
      alias: r.reviewee,
      requestDate: r.requestDate,
      employeeName: allEmployees.find(
        (e: any) => e.alias === r.reviewee
      )?.employeeName,
    }));
  }
}

export default apiExporter(GetPeerRequests);