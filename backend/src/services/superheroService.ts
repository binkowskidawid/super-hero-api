import { Prisma, PrismaClient } from '@prisma/client'
import { APIError } from '@/middlewares/errorHandler'

const prisma = new PrismaClient()

export class SuperheroService {
  /**
   * Creates a new superhero
   * @throws {APIError} If creation fails
   */
  public static async createSuperhero(data: Prisma.SuperheroCreateInput) {
    try {
      return await prisma.superhero.create({
        data,
      })
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new APIError(409, 'A superhero with this name already exists')
        }
      }
      throw error
    }
  }

  /**
   * Retrieves superheroes with optional filtering
   * @param minHumility Optional minimum humility score filter
   */
  public static async getSuperheroes(minHumility?: number) {
    const where = minHumility
      ? { humilityScore: { gte: minHumility } }
      : {}

    const superheroes = await prisma.superhero.findMany({
      where,
      orderBy: {
        humilityScore: 'desc',
      },
    })

    if (!superheroes.length) {
      throw new APIError(404, 'No superheroes found matching your criteria')
    }

    return superheroes
  }

  /**
   * Retrieves a single superhero by ID
   * @throws {APIError} If superhero not found
   */
  public static async getSuperheroById(id: number) {
    const superhero = await prisma.superhero.findUnique({
      where: { id },
    })

    if (!superhero) {
      throw new APIError(404, 'Superhero not found')
    }

    return superhero
  }
}
