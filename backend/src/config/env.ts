import dotenv from "dotenv";
import { z } from "zod";

// Ensure environment variables are loaded
dotenv.config();

const EnvSchema = z.object({
  // Database
  DATABASE_URL: z.string().refine(
    (val) =>
      val.startsWith("file:") ||
      val.startsWith("postgresql:") ||
      val.startsWith("postgres:") ||
      val.startsWith("sqlite:"),
    { message: "Invalid DATABASE_URL schema. Must be file:, postgresql:, or sqlite:" }
  ),

  // Server
  PORT: z.coerce.number().default(4000),
  NODE_ENV: z.enum(["development", "staging", "production"]).default("development"),

  // CORS
  CORS_ORIGIN: z.string().optional(),
  CORS_ORIGINS: z.string().optional(),

  // Logging
  LOG_LEVEL: z.enum(["error", "warn", "info", "http", "debug"]).default("info"),

  // Optional Defaults
  DEFAULT_CATEGORY_ID: z.string().optional(),
});

type Env = z.infer<typeof EnvSchema>;

let env: Env;

try {
  env = EnvSchema.parse(process.env);
} catch (error: any) {
  if (error instanceof z.ZodError || error?.errors || error?.issues) {
    console.error("❌ Invalid environment variables:");
    const issues = (error.errors || error.issues || []) as any[];
    issues.forEach((err: any) => {
      const path = Array.isArray(err.path) ? err.path.join(".") : "unknown";
      console.error(`  - ${path}: ${err.message}`);
    });
  }
  process.exit(1);
}

export default env;
