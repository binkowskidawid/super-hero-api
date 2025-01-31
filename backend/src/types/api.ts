import { Superhero } from '@prisma/client'

export interface APIResponse<T> {
  status: 'success' | 'error'
  message?: string
  data?: T
  error?: {
    code: string
    message: string
    details?: unknown
  }
}

export interface SuperheroResponse extends APIResponse<Superhero> {
}

export interface SuperheroListResponse extends APIResponse<Superhero[]> {
}
