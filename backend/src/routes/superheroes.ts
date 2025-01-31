import { Router } from 'express'
import { SuperheroController } from '@/controllers/superheroController'
import { authenticateToken } from '@/middlewares/authMiddleware'
import { validateRequest } from '@/middlewares/validateRequest'
import { getSuperheroesQuerySchema, superheroIdSchema, superheroSchema } from '@/validators/superheroSchema'

const superheroRouter = Router()

/**
 * @route POST /api/v1/superheroes
 * @description Create a new superhero
 * @access Protected - Requires API key
 */
superheroRouter.post(
  '/',
  authenticateToken,
  validateRequest({
    body: superheroSchema,
  }),
  SuperheroController.createSuperhero,
)

/**
 * @route GET /api/v1/superheroes
 * @description Get all superheroes, optionally filtered by minimum humility score
 * @access Protected - Requires API key
 */
superheroRouter.get(
  '/',
  authenticateToken,
  validateRequest({
    query: getSuperheroesQuerySchema,
  }),
  SuperheroController.getAllSuperheroes,
)

/**
 * @route GET /api/v1/superheroes/:id
 * @description Get a specific superhero by ID
 * @access Protected - Requires API key
 */
superheroRouter.get(
  '/:id',
  authenticateToken,
  validateRequest({
    params: superheroIdSchema,
  }),
  SuperheroController.getSuperheroById,
)

export { superheroRouter }
