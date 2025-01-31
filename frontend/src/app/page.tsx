import { Metadata } from 'next'
import { AddSuperheroForm } from '@/components/Forms/AddSuperheroForm'
import { SuperheroCard } from '@/components/SuperheroCard'
import { getSuperheroes } from './actions/superhero'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Humble Superheroes | Where Everyday Heroes Shine',
  description: 'Discover and celebrate the most humble superheroes among us. Add your own superhero and see how they rank on the humility scale!',
  openGraph: {
    title: 'Humble Superheroes',
    description: 'Where everyday heroes shine through humility',
    type: 'website',
  },
}

export default async function Home() {
  const year = new Date().getFullYear()

  try {
    const superheroes = await getSuperheroes()

    return (
      <div className="grid grid-rows-[auto_1fr_auto] min-h-screen p-8 gap-8">
        <header className="text-center">
          <h1 className="text-4xl font-bold mb-2">Humble Superheroes</h1>
          <p className="text-muted-foreground">Where everyday heroes shine through humility</p>
        </header>

        <main className="container mx-auto max-w-7xl space-y-8">
          <AddSuperheroForm />

          <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {superheroes.map((hero) => (
              <SuperheroCard key={hero.id} superhero={hero} />
            ))}
          </section>
        </main>

        <footer className="text-center text-sm text-muted-foreground">
          <span>{year} Dawid Bińkowski</span>
        </footer>
      </div>
    )
  } catch (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load superheroes. Please try again later.
            {' '}
            {error instanceof Error && <p>{error.message}</p>}
          </AlertDescription>
        </Alert>
      </div>
    )
  }
}
