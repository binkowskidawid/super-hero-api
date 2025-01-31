import { z } from 'zod'

/**
 * Schema for validating superhero creation and updates
 * Enforces rules about name format, superpower description length,
 * and valid humility score range
 */
export const superheroSchema = z.object({
  name: z
    .string({
      required_error: 'Hero name is required',
      invalid_type_error: 'Hero name must be a string',
    })
    .min(2, 'Hero name must be at least 2 characters')
    .max(50, 'Hero name must not exceed 50 characters')
    .refine((name) => /^[a-zA-Z0-9\s-]+$/.test(name), {
      message: 'Hero name can only contain letters, numbers, spaces, and hyphens',
    }),
  superpower: z
    .string({
      required_error: 'Superpower description is required',
      invalid_type_error: 'Superpower description must be a string',
    })
    .min(2, 'Superpower description must be at least 2 characters')
    .max(200, 'Superpower description must not exceed 200 characters'),
  humilityScore: z
    .number({
      required_error: 'Humility score is required',
      invalid_type_error: 'Humility score must be a number',
    })
    .int('Humility score must be a whole number')
    .min(1, 'Humility score must be between 1 and 10')
    .max(10, 'Humility score must be between 1 and 10'),
})

/**
 * Schema for validating query parameters when fetching superheroes
 * Used to validate optional filters like minimum humility score
 */
export const getSuperheroesQuerySchema = z.object({
  minHumility: z
    .string()
    .optional()
    .refine(
      (value) => {
        if (!value) return true
        const num = parseInt(value)
        return !isNaN(num) && num >= 1 && num <= 10
      },
      {
        message: 'Minimum humility score must be between 1 and 10',
      },
    ),
})

/**
 * Schema for validating superhero ID in route parameters
 * Ensures the ID parameter is a valid positive integer
 */
export const superheroIdSchema = z.object({
  id: z
    .string()
    .refine(
      (value) => {
        const num = parseInt(value)
        return !isNaN(num) && num > 0
      },
      {
        message: 'Superhero ID must be a positive integer',
      },
    ),
})
