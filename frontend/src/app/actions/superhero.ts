'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { type CreateSuperheroInput, createSuperheroSchema, fetchFromApi, type Superhero } from '@/lib/api'

export async function getSuperheroes(): Promise<Superhero[]> {
  try {
    const response = await fetchFromApi<Superhero[]>('/api/v1/superheroes')
    return response.data || []
  } catch (error) {
    console.error('Failed to fetch superheroes:', error)
    throw new Error('Failed to load superheroes')
  }
}

export async function createSuperhero(input: CreateSuperheroInput) {
  try {
    // Validate input server-side
    const validatedData = createSuperheroSchema.parse(input)

    // Make API request
    const response = await fetchFromApi<Superhero>('/api/v1/superheroes', {
      method: 'POST',
      body: JSON.stringify(validatedData),
    })

    // Revalidate the superheroes page to show the new hero
    revalidatePath('/')

    return { success: true, data: response.data }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error ?? 'Invalid superhero data' }
    }

    console.error('Failed to create superhero:', error)
    return { success: false, error: error ?? 'Failed to create superhero' }
  }
}
