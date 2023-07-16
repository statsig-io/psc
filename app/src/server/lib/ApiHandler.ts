import type { NextApiRequest, NextApiResponse } from "next";
import genValidateSession from "./genValidateSession";
import { ViewerContext } from "./ViewerContext";

type StaticThis<T> = { new (alias: string): T };

export abstract class ApiHandler {
  protected vc: ViewerContext | null = null;
  constructor(protected alias: string) {
  }

  protected abstract handleApiCall(
    req: NextApiRequest,
    res: NextApiResponse,
    body?: any,
  ): Promise<any>;

  public async handleInternal(
    req: NextApiRequest,
    res: NextApiResponse
  ): Promise<void> {
    if (req.method !== "POST") {
      throw new Error("Invalid method");
    }
    if (this.alias) {
      this.vc = await ViewerContext.gen(this.alias);
    }
   
    try {
      const data = await this.handleApiCall(req, res, req.body);
      if (data) {
        res.status(200).json({
          success: true,
          data: data,
        });
      }
    } catch (e: any) {
      res.status(500).json({
        success: false,
        error: e.message,
      });
    }
  }
}

export function apiExporter<T extends ApiHandler>(
  type: StaticThis<T>,
): (req: NextApiRequest, res: NextApiResponse) => Promise<void> {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const alias = await genValidateSession(req, res);
    const child = new type(alias);
    await child.handleInternal(req, res);
  };
}
