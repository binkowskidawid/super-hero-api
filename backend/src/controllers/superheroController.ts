import { NextFunction, Request, Response } from 'express'
import { SuperheroService } from '@/services/superheroService'
import { SuperheroListResponse, SuperheroResponse } from '@/types/api'
import { superheroSchema } from '@/validators/superheroSchema'

export class SuperheroController {
  /**
   * Creates a new superhero
   */
  public static async createSuperhero(
    req: Request,
    res: Response<SuperheroResponse>,
    next: NextFunction,
  ): Promise<void> {
    try {
      const validatedData = superheroSchema.parse(req.body)
      const superhero = await SuperheroService.createSuperhero(validatedData)

      res.status(201).json({
        status: 'success',
        message: 'A new humble hero joins the ranks!',
        data: superhero,
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Retrieves all superheroes with optional filtering
   */
  public static async getAllSuperheroes(
    req: Request,
    res: Response<SuperheroListResponse>,
    next: NextFunction,
  ): Promise<void> {
    try {
      const minHumility = req.query.minHumility
        ? parseInt(req.query.minHumility as string)
        : undefined

      const superheroes = await SuperheroService.getSuperheroes(minHumility)

      res.status(200).json({
        status: 'success',
        data: superheroes,
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Retrieves a specific superhero by ID
   */
  public static async getSuperheroById(
    req: Request,
    res: Response<SuperheroResponse>,
    next: NextFunction,
  ): Promise<void> {
    try {
      const id = parseInt(req.params.id)
      const superhero = await SuperheroService.getSuperheroById(id)

      res.status(200).json({
        status: 'success',
        data: superhero,
      })
    } catch (error) {
      next(error)
    }
  }
}
