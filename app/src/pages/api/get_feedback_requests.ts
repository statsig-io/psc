import OrgUtils from "@/server/lib/OrgUtils";
import ReviewUtils from "@/server/lib/ReviewUtils";
import { ApiHandler, apiExporter } from "@/server/lib/ApiHandler";

class GetFeedbackRequests extends ApiHandler {
  public async handleApiCall(): Promise<any> {
    const reports = await OrgUtils.genReports(this.alias);
    const employees = await OrgUtils.genAllEmployees();
    const requests = await ReviewUtils.genFeedbackRequests(
      reports.map(r => r.alias)
    );

    const reportsAndRequests: Array<Record<string, any>> = [];
    for (const report of reports) {
      reportsAndRequests.push({
        alias: report.alias,
        employeeName: report.employeeName,
        requests: requests.filter(
            r => r.reviewee === report.alias
          ).map(r => r.reviewer),
      });
    }

    return {
      reportsAndRequests,
      reports,
      employees,
    };
  }
}

export default apiExporter(GetFeedbackRequests);