import Image from 'next/image'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Shield } from 'lucide-react'
import { type Superhero } from '@/lib/api'

export function SuperheroCard({ superhero }: { superhero: Superhero }) {

  // Generate deterministic avatar URL based on name
  const avatarUrl = `https://api.multiavatar.com/${superhero.name}.png`

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center gap-4">
        <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-100">
          <Image
            src={avatarUrl}
            alt={superhero.name}
            fill
            className="object-cover"
            sizes="64px"
          />
        </div>
        <div>
          <CardTitle>{superhero.name}</CardTitle>
          <CardDescription>{superhero.superpower}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4" />
          <span>Humility Score: {superhero.humilityScore}/10</span>
        </div>
      </CardContent>
    </Card>
  )
}
