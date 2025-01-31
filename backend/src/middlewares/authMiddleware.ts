import { NextFunction, Request, Response } from 'express'
import { AuthError } from './errorHandler'

/**
 * Extended Request interface to include API key
 */
export interface AuthenticatedRequest extends Request {
  apiKey?: string
}

/**
 * Middleware to validate API token
 * Checks for token in header or query parameter
 */
export const authenticateToken = (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction,
): void => {
  const token = req.headers['x-api-key'] || req.query.apiKey

  if (!token || token !== process.env.API_KEY) {
    throw new AuthError('Invalid or missing API key')
  }

  req.apiKey = token as string
  next()
}
