import {PrismaClient} from '@prisma/client'

// Initialize Prisma Client
const prisma = new PrismaClient()

async function main() {
  // First, clean up existing data
  await prisma.superhero.deleteMany()

  // Define our initial superheroes
  const superheroes = [
    {
      name: 'The Silent Guardian',
      superpower: 'Invisibly helps others without seeking recognition',
      humilityScore: 9,
    },
    {
      name: 'Captain Kindness',
      superpower: 'Empathy amplification and mood lifting',
      humilityScore: 8,
    },
    {
      name: 'The Quiet Helper',
      superpower: 'Can be in multiple places helping others simultaneously',
      humilityScore: 10,
    },
    {
      name: 'Doctor Support',
      superpower: 'Healing through encouragement and positivity',
      humilityScore: 7,
    },
  ]

  console.log('Starting to seed the database...')

  // Create each superhero in the database
  for (const hero of superheroes) {
    const createdHero = await prisma.superhero.create({
      data: hero,
    })
    console.log(`Created superhero: ${createdHero.name}`)
  }

  console.log('Database has been seeded with humble superheroes! 🦸‍♂️')
}

// Execute the main function
main()
  .catch((e) => {
    console.error('Error seeding the database:', e)
    process.exit(1)
  })
  .finally(async () => {
    // Close Prisma Client at the end
    await prisma.$disconnect()
  })
