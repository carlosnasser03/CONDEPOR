/**
 * ENVIRONMENT VARIABLES VALIDATION & CONFIG
 * Centralizes and validates environment configurations.
 */

const requiredEnvVars = ['NEXT_PUBLIC_API_URL'] as const;

const missingEnvVars = requiredEnvVars.filter(
  (envVar) => !process.env[envVar]
);

if (missingEnvVars.length > 0 && process.env.NODE_ENV === 'production' && typeof window === 'undefined') {
  console.warn(
    `[Env Validation] Warning/Missing environment variables: ${missingEnvVars.join(', ')}. Using default fallbacks.`
  );
}

export const config = {
  api: {
    url: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api',
  },
  hero: {
    animationUrl: process.env.NEXT_PUBLIC_HERO_ANIMATION_URL || '',
  },
} as const;

export type Config = typeof config;
