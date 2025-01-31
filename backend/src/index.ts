import express, { NextFunction, Request, Response } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import { PrismaClient } from '@prisma/client'
import { config } from '@/config/config'
import { logger } from '@/utils/logger'
import { superheroRouter } from '@/routes/superheroes'
import { errorHandler } from '@/middlewares/errorHandler'

// Initialize Prisma client
const prisma = new PrismaClient()

/**
 * Initialize Express application with security middleware and routes
 * @returns {express.Application} Configured Express application
 */
export const createApp = (): express.Application => {
  const app = express()

  // Basic security headers
  app.use(helmet())

  // CORS configuration
  const corsOptions = {
    origin: config.env.CORS_ORIGIN,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 600, // Cache preflight requests for 10 minutes
  }
  app.use(cors(corsOptions))

  // Rate limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
  })
  app.use(limiter)

  // Request body size limit
  app.use(express.json({ limit: '10kb' }))

  // Request logging
  app.use((req: Request, _res: Response, next: NextFunction) => {
    logger.info(`${req.method} ${req.path}`)
    next()
  })

  // Health check endpoint
  app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({ status: 'healthy' })
  })

  // API routes
  app.use('/api/v1/superheroes', superheroRouter)

  // 404 handler
  app.use((_req: Request, res: Response) => {
    res.status(404).json({ error: 'Route not found' })
  })

  // Global error handler
  app.use(errorHandler)

  return app
}

/**
 * Start the server
 * @param {express.Application} app - Express application
 */
const startServer = async (app: express.Application): Promise<void> => {
  try {
    const port = config.env.PORT || 3001
    app.listen(port, () => {
      logger.info(`🦸 Server is running on port ${port}`)
    })
  } catch (error) {
    logger.error('Failed to start server:', error)
    process.exit(1)
  }
}

// Only start the server if this file is run directly
if (require.main === module) {
  const app = createApp()
  startServer(app)
    .catch((error) => {
      logger.error('Startup error:', error)
      process.exit(1)
    })
}

// Clean up database connections on shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received. Cleaning up...')
  await prisma.$disconnect()
  process.exit(0)
})

export { prisma }
