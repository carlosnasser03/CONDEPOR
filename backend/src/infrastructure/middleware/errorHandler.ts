import { Request, Response, NextFunction } from "express";
import { AppError } from "@infrastructure/errors/AppError";
import logger from "@infrastructure/logger/Logger";

// Wrap async functions to catch errors cleanly
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

// Global error handling middleware
export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  logger.error(`[${err.name || "Error"}] ${err.message}`, {
    error: err.stack || err,
    method: req.method,
    path: req.path,
    ip: req.ip,
  });

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: err.message,
      ...(process.env.NODE_ENV === "development" && err.details ? { details: err.details } : {}),
    });
    return;
  }

  // Handle Zod validation errors
  if (err.name === "ZodError" || (err && Array.isArray(err.errors))) {
    res.status(400).json({
      success: false,
      error: "Validation failed",
      details: process.env.NODE_ENV === "development" ? (err.errors || err) : undefined,
    });
    return;
  }

  // Generic / Unexpected errors
  const status = typeof err.status === "number" ? err.status : typeof err.statusCode === "number" ? err.statusCode : 500;
  res.status(status).json({
    success: false,
    error: process.env.NODE_ENV === "production"
      ? "Internal server error"
      : err.message || "Unknown error occurred",
  });
}
