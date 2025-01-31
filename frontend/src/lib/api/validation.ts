import { z } from 'zod'

/**
 * Environment variables validation schema
 * This schema ensures that the required environment variables are present and valid.
 */
export const envSchema = z.object({
  BACKEND_URL: z.string().url('Backend URL must be a valid URL'),
  API_KEY: z.string().min(1, 'API key is required'),
})

/**
 * Validates the environment variables and returns them if valid.
 * @throws {Error} If the environment variables are invalid.  *
 */
export function validateEnvironment() {
  const result = envSchema.safeParse({
    BACKEND_URL: process.env.BACKEND_URL,
    API_KEY: process.env.API_KEY,
  })

  if (!result.success) {
    console.error('❌ Invalid environment variables:', result.error.flatten().fieldErrors)
    throw new Error('Missing or invalid environment variables')
  }

  return result.data
}

/**
 * Superhero schema for validation
 * This schema ensures that the superhero data conforms to the expected structure and constraints.
 */
export const createSuperheroSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must not exceed 50 characters')
    .regex(/^[a-zA-Z0-9\s-]+$/, 'Name can only contain letters, numbers, spaces, and hyphens'),

  superpower: z.string()
    .min(2, 'Superpower must be at least 2 characters')
    .max(200, 'Superpower must not exceed 200 characters'),

  humilityScore: z.number()
    .int('Humility score must be a whole number')
    .min(1, 'Humility score must be between 1 and 10')
    .max(10, 'Humility score must be between 1 and 10'),
})

export type CreateSuperheroInput = z.infer<typeof createSuperheroSchema>;
