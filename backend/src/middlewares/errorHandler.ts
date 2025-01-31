import { NextFunction, Request, Response } from 'express'
import { z } from 'zod'
import { logger } from '../utils/logger'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'

/**
 * Custom error class for API-specific errors
 */
export class APIError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string,
  ) {
    super(message)
    this.name = 'APIError'
  }
}

/**
 * Custom error class for authentication failures
 */
export class AuthError extends APIError {
  constructor(message: string = 'Authentication failed') {
    super(401, message, 'AUTH_ERROR')
    this.name = 'AuthError'
  }
}

/**
 * Map Prisma errors to user-friendly messages
 */
const handlePrismaError = (error: PrismaClientKnownRequestError): APIError => {
  switch (error.code) {
    case 'P2002':
      return new APIError(409, 'A superhero with this name already exists', 'DUPLICATE_ERROR')
    case 'P2025':
      return new APIError(404, 'Superhero not found', 'NOT_FOUND')
    default:
      logger.error('Unhandled Prisma error:', error)
      return new APIError(500, 'Internal database error', 'DATABASE_ERROR')
  }
}

/**
 * Global error handling middleware
 */
export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  logger.error('Error processing request:', {
    path: req.path,
    method: req.method,
    error: error.message,
    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
  })

  // Handle different types of errors
  if (error instanceof APIError) {
    res.status(error.statusCode).json({
      status: 'error',
      code: error.code,
      message: error.message,
    })
    return
  }

  if (error instanceof z.ZodError) {
    res.status(400).json({
      status: 'error',
      code: 'VALIDATION_ERROR',
      message: 'Invalid request data',
      details: error.errors,
    })
    return
  }

  if (error instanceof PrismaClientKnownRequestError) {
    const apiError = handlePrismaError(error)
    res.status(apiError.statusCode).json({
      status: 'error',
      code: apiError.code,
      message: apiError.message,
    })
    return
  }

  // Default error response
  res.status(500).json({
    status: 'error',
    code: 'INTERNAL_ERROR',
    message: process.env.NODE_ENV === 'production'
      ? 'An unexpected error occurred'
      : error.message,
  })
}
