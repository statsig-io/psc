import OrgUtils from "./OrgUtils";

export class ViewerContext {
  private constructor(
    public alias: string, 
    private employee: Record<string, any>,
  ) {
  }

  public static async gen(alias: string) {
    const employee = await OrgUtils.genEmployee(alias);
    if (!employee) {
      throw new Error(`No employee found for alias ${alias}`);
    }
    return new ViewerContext(alias, employee);
  }

  public getName() {
    return this.employee.employeeName;
  }

  public async genManager() {
    return await OrgUtils.genManager(this.alias);
  }
}