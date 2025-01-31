import { PrismaClient } from '@prisma/client';
import * as path from 'path';
import * as dotenv from 'dotenv-safe';

// Load test environment variables
dotenv.config({
  path: path.resolve(__dirname, '../.env.test'),
  example: path.resolve(__dirname, '../.env.example'),
  allowEmptyValues: true
});

const prisma = new PrismaClient();

export const setup = async (): Promise<void> => {
  try {
    // Clean up the test database
    await prisma.$executeRaw`DELETE FROM "Superhero";`;
  } catch (error) {
    console.error('Error during test setup:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
};

export const teardown = async (): Promise<void> => {
  await prisma.$disconnect();
};

export default { setup, teardown };
