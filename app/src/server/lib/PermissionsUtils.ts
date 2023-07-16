
import OrgUtils from './OrgUtils';
import ReviewUtils from './ReviewUtils';
import StatsigServer from './StatsigServer';

export default abstract class PermissionsUtils {
  public static async canUpdateFeedback() {
    const dueDate = await this.genFeedbackDueDate();
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    return dueDate >= currentDate;
  }

  public static async canUpdateReportReview() {
    const dueDate = await this.genReportReviewDueDate();
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    return dueDate >= currentDate;
  }

  public static async ensureCanUpdateFeedback() {
    if (!await this.canUpdateFeedback()) {
      throw new Error("Feedback period has ended");
    }
  }

  public static async ensureCanReviewEmployee(
    managerAlias: string,
    reportAlias: string,
  ) {
    if (!await this.canUpdateReportReview()) {
      throw new Error("Review period has ended");
    }
    const report = await OrgUtils.genEmployee(reportAlias);
    if (report?.managerAlias !== managerAlias) {
      throw new Error("You are not the manager of this employee");
    }
  }

  public static async ensureCanSaveSelfReview(alias: string) {
    const doc = await ReviewUtils.genSelfReview(alias);
    if (doc?.submitted) {
      throw new Error("You have already submitted your self review");
    }
    await this.ensureCanUpdateFeedback();
  }

  public static async ensureCanSaveManagerFeedback(alias: string, managerAlias: string) {
    const doc = await ReviewUtils.genManagerFeedback(alias, managerAlias);
    if (doc?.submitted) {
      throw new Error("You have already submitted your manager's review");
    }
    await this.ensureCanUpdateFeedback();
  }

  public static async ensureCanSavePeerFeedback(alias: string, peerAlias: string) {
    const doc = await ReviewUtils.genPeerFeedback(alias, peerAlias);
    if (doc?.submitted) {
      throw new Error("You have already submitted your peer review");
    }
    await this.ensureCanUpdateFeedback();
  }

  public static async ensureCanSaveReportReview(managerAlias: string, reportAlias: string) {
    const doc = await ReviewUtils.genReportReview(managerAlias, reportAlias);
    if (doc?.submitted) {
      throw new Error("You have already submitted your report review");
    }
    await this.ensureCanReviewEmployee(managerAlias, reportAlias);
  }

  public static async genFeedbackDueDate() {
    const config = await StatsigServer.getConfig('review_config');
    return new Date(config.get('feedback_due', ''));
  }

  public static async genReportReviewDueDate() {
    const config = await StatsigServer.getConfig('review_config');
    return new Date(config.get('review_ends', ''));
  }
}