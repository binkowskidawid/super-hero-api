import { z } from 'zod'
import dotenv from 'dotenv-safe'

// Load environment variables
dotenv.config({
  allowEmptyValues: false,
  example: '.env.example',
})

/**
 * Environment variable schema validation
 */
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  PORT: z.string().transform(Number),
  DATABASE_URL: z.string().url(),
  CORS_ORIGIN: z.string().url(),
  RATE_LIMIT_WINDOW_MS: z.string().transform(Number).default('900000'),
  RATE_LIMIT_MAX_REQUESTS: z.string().transform(Number).default('100'),
  API_KEY: z.string(),
})

/**
 * Validated environment configuration
 */
const validateEnv = (): z.infer<typeof envSchema> => {
  try {
    return envSchema.parse({
      NODE_ENV: process.env.NODE_ENV,
      PORT: process.env.PORT,
      DATABASE_URL: process.env.DATABASE_URL,
      CORS_ORIGIN: process.env.CORS_ORIGIN,
      RATE_LIMIT_WINDOW_MS: process.env.RATE_LIMIT_WINDOW_MS,
      RATE_LIMIT_MAX_REQUESTS: process.env.RATE_LIMIT_MAX_REQUESTS,
      API_KEY: process.env.API_KEY,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors.map(err => err.path.join('.'))
      throw new Error(`❌ Missing or invalid environment variables: ${missingVars.join(', ')}`)
    }
    throw error
  }
}

export const config = {
  env: validateEnv(),
}

// Export type for TypeScript usage
export type Config = typeof config
