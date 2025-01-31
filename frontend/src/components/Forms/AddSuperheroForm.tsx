'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { AlertCircle } from 'lucide-react'

import { createSuperhero } from '@/app/actions/superhero'
import { CreateSuperheroInput, createSuperheroSchema } from '@/lib/api'

export function AddSuperheroForm() {
  const router = useRouter()
  const [error, setError] = useState('')

  // Initialize the form with React Hook Form and Zod validation
  const form = useForm<CreateSuperheroInput>({
    resolver: zodResolver(createSuperheroSchema),
    defaultValues: {
      name: '',
      superpower: '',
      humilityScore: 5,
    },
  })

  // Handle form submission
  async function onSubmit(data: CreateSuperheroInput) {
    setError('')

    try {
      const result = await createSuperhero(data)

      if (!result.success) {
        throw new Error(result.error as string)
      }

      // Reset form on success
      form.reset()

      // Refresh the page to show new data
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Add New Superhero</CardTitle>
        <CardDescription>Enter the details of our new humble hero</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hero Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="The Humble Helper" />
                  </FormControl>
                  <FormDescription>
                    Choose a name that reflects your hero&apos;s humble nature.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="superpower"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Superpower</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Making others feel valued and appreciated" />
                  </FormControl>
                  <FormDescription>
                    Describe your hero&apos;s unique ability to help others.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="humilityScore"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Humility Score</FormLabel>
                  <FormControl>
                    <Slider
                      min={1}
                      max={10}
                      step={1}
                      value={[field.value]}
                      onValueChange={([value]) => field.onChange(value)}
                      className="pt-2"
                    />
                  </FormControl>
                  <FormDescription className="text-right">
                    Score: {field.value}/10
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? 'Adding Hero...' : 'Add Hero'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
