import { NextFunction, Request, Response } from 'express'
import { AnyZodObject, z } from 'zod'
import { APIError } from './errorHandler'

// Define the schema structure type
export type RequestValidationSchema = {
  params?: AnyZodObject
  query?: AnyZodObject
  body?: AnyZodObject
}

/**
 * Creates middleware that validates different parts of the request against provided schemas
 * @param schemas Object containing Zod schemas for different request parts
 */
export const validateRequest = (schemas: RequestValidationSchema) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (schemas.params) {
        req.params = await schemas.params.parseAsync(req.params)
      }
      if (schemas.query) {
        req.query = await schemas.query.parseAsync(req.query)
      }
      if (schemas.body) {
        req.body = await schemas.body.parseAsync(req.body)
      }
      next()
    } catch (error) {
      if (error instanceof z.ZodError) {
        next(new APIError(400, 'Validation failed', 'VALIDATION_ERROR'))
      }
      next(error)
    }
  }
}
