import { NextFunction, Request, Response } from "express";
import { z } from "zod";

export function asyncRoute(fn: (req: Request, res: Response) => Promise<void>) {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res).catch(next);
  };
}

export function validateInput<T>(data: unknown, zodShape: z.ZodType<T>): T {
  const ret = zodShape.safeParse(data);
  if (ret.success) {
    return ret.data;
  }
  throw new ZodValidationError(ret.error);
}

export class ZodValidationError extends Error {
  constructor(public readonly zodError: z.ZodError) {
    super();
  }
}
