import type {
  Request,
  Response,
  NextFunction,
  ErrorRequestHandler,
} from "express";
import { env } from "../config/env.js";

export const errorHandler: ErrorRequestHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const statusCode = res.statusCode !== 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    stack: env.NODE_ENV === "development" ? err.stack : undefined,
  });
};
