import rateLimit from "express-rate-limit";
import express from "express";

// General API limiter
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  keyGenerator: (req: express.Request) => {
    return req.ip || req.socket.remoteAddress || "unknown";
  },
});

// Strict limiter for critical endpoints (e.g., recording results)
export const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15, // 15 requests per windowMs
  skipSuccessfulRequests: true,
  message: "Too many attempts, please try again after 15 minutes.",
  standardHeaders: true,
  legacyHeaders: false,
});

// Create endpoint limiter (e.g., creating resources)
export const createLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // 50 creates per hour
  skipSuccessfulRequests: false,
  message: "Too many resources created, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});
