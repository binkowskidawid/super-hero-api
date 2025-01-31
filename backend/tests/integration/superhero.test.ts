import request = require('supertest')
import { createApp, prisma } from '../../src'
import { config } from '../../src/config/config'

describe('Superhero API Integration Tests', () => {
  const app = createApp()
  const apiKey = config.env.API_KEY

  // Test data we'll use throughout our tests
  const testSuperhero = {
    name: 'Test Hero',
    superpower: 'Writing amazing tests',
    humilityScore: 8,
  }

  // Before each test, clean up the database
  beforeEach(async () => {
    // Clean the database before each test to ensure isolation
    await prisma.superhero.deleteMany()
  })

  // After all tests, close Prisma client
  afterAll(async () => {
    await prisma.$disconnect()
  })

  describe('POST /api/v1/superheroes', () => {
    it('should create a new superhero when valid data is provided', async () => {
      const response = await request(app)
        .post('/api/v1/superheroes')
        .set('x-api-key', apiKey)
        .send(testSuperhero)

      expect(response.status).toBe(201)
      expect(response.body.status).toBe('success')
      expect(response.body.data).toMatchObject({
        ...testSuperhero,
        id: expect.any(Number),
      })
    })

    it('should return 401 when API key is missing', async () => {
      const response = await request(app)
        .post('/api/v1/superheroes')
        .send(testSuperhero)

      expect(response.status).toBe(401)
      expect(response.body.status).toBe('error')
    })

    it('should return 400 when humility score is out of range', async () => {
      const invalidHero = {
        ...testSuperhero,
        humilityScore: 11,
      }

      const response = await request(app)
        .post('/api/v1/superheroes')
        .set('x-api-key', apiKey)
        .send(invalidHero)

      expect(response.status).toBe(400)
      expect(response.body.status).toBe('error')
    })

    it('should prevent duplicate hero names', async () => {
      // First create a hero
      await request(app)
        .post('/api/v1/superheroes')
        .set('x-api-key', apiKey)
        .send(testSuperhero)

      // Try to create another hero with the same name
      const response = await request(app)
        .post('/api/v1/superheroes')
        .set('x-api-key', apiKey)
        .send(testSuperhero)

      expect(response.status).toBe(409)
      expect(response.body.status).toBe('error')
    })
  })

  describe('GET /api/v1/superheroes', () => {
    beforeEach(async () => {
      // Seed some test data before each GET test
      const heroes = [
        { name: 'Hero 1', superpower: 'Power 1', humilityScore: 7 },
        { name: 'Hero 2', superpower: 'Power 2', humilityScore: 9 },
        { name: 'Hero 3', superpower: 'Power 3', humilityScore: 5 },
      ]

      for (const hero of heroes) {
        await prisma.superhero.create({ data: hero })
      }
    })

    it('should retrieve all superheroes sorted by humility score', async () => {
      const response = await request(app)
        .get('/api/v1/superheroes')
        .set('x-api-key', apiKey)

      expect(response.status).toBe(200)
      expect(response.body.status).toBe('success')
      expect(response.body.data).toHaveLength(3)

      // Verify sorting by humility score (descending)
      const scores = response.body.data.map((hero: any) => hero.humilityScore)
      expect(scores).toEqual([9, 7, 5])
    })

    it('should filter heroes by minimum humility score', async () => {
      const response = await request(app)
        .get('/api/v1/superheroes?minHumility=8')
        .set('x-api-key', apiKey)

      expect(response.status).toBe(200)
      expect(response.body.data).toHaveLength(1)
      expect(response.body.data[0].humilityScore).toBe(9)
    })

    it('should return 401 without API key', async () => {
      const response = await request(app)
        .get('/api/v1/superheroes')

      expect(response.status).toBe(401)
      expect(response.body.status).toBe('error')
    })

    it('should return 400 with invalid minHumility parameter', async () => {
      const response = await request(app)
        .get('/api/v1/superheroes?minHumility=invalid')
        .set('x-api-key', apiKey)

      expect(response.status).toBe(400)
      expect(response.body.status).toBe('error')
    })

    it('should return 404 when no heroes match criteria', async () => {
      const response = await request(app)
        .get('/api/v1/superheroes?minHumility=10')
        .set('x-api-key', apiKey)

      expect(response.status).toBe(404)
      expect(response.body.status).toBe('error')
    })
  })
})
