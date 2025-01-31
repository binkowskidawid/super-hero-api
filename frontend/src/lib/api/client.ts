import { validateEnvironment } from './validation'
import type { ApiResponse } from './types'

/**
 * Custom error class for API errors.
 * @class ApiError
 * @extends Error
 * @param {string} message - The error message.
 * @param {number} statusCode - The HTTP status code of the error.
 * @param {unknown} [body] - The response body of the error.
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public body?: unknown,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

/**
 * Get the base configuration for API requests.
 * @returns {object} The base configuration object.
 * @throws {Error} If the environment variables are not set.
 * @throws {Error} If the environment variables are not valid.
 */
const getBaseConfig = () => {
  const env = validateEnvironment()

  return {
    baseUrl: env.BACKEND_URL,
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': env.API_KEY,
    },
  }
}

/**
 * Fetch data from the API.
 * @template T - The type of the data to fetch.
 * @param {string} endpoint - The API endpoint to fetch data from.
 * @param {RequestInit} [options] - The options to pass to the fetch function.
 * @returns {Promise<ApiResponse<T>>} A promise that resolves to the API response.
 * @throws {ApiError} If the API request fails.
 */
export async function fetchFromApi<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  const config = getBaseConfig()

  try {
    const response = await fetch(`${config.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        ...config.headers,
        ...options.headers,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      throw new ApiError(
        data.message || 'API request failed',
        response.status,
        data,
      )
    }

    return data as ApiResponse<T>
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }

    // Handle network or other errors
    throw new ApiError(
      error instanceof Error ? error.message : 'Network request failed',
      500,
    )
  }
}
