import Statsig from "statsig-node";
import type { DynamicConfig } from "statsig-node";
import Secrets from "./secrets";

export default abstract class StatsigServer {
  private static isInitialized = false;

  public static async getConfig(configKey: string): Promise<DynamicConfig> {
    await this.ensureInitialized();
    const user = this.getStatsigUser();
    return await Statsig.getConfig(user, configKey);
  }

  private static getStatsigUser() {
    return {
      userID: 'server',
    };
  }

  private static async ensureInitialized() {
    if (this.isInitialized) {
      return;
    }

    await Statsig.initialize(Secrets.STATSIG_SERVER_KEY);
    this.isInitialized = true;  
  }
}
