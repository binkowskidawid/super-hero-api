# 🦸 Humble Superhero API 🦸‍♀️

A full-stack application celebrating everyday heroes, built with Next.js 15, React 19, Express, TypeScript, and Prisma.

## Features

- REST API with Express, TypeScript, and Prisma
- Next.js frontend with TailwindCSS and Shadcn/ui
- Real-time superhero management
- Secure API with authentication and rate limiting
- SQLite database with Prisma ORM
- Docker support for easy deployment
- Comprehensive test coverage

## Tech Stack

### Backend

- Node.js + Express
- TypeScript
- Prisma ORM
- SQLite
- Jest for testing
- Zod for validation

### Frontend

- Next.js 15
- React 19
- TailwindCSS
- Shadcn/ui
- React Hook Form

## Project Structure

```
super-hero-api/
├── backend/              # Express API with TypeScript
│   ├── src/              # Source code
│   ├── prisma/           # Database schema and migrations
│   └── tests/            # API tests
└── frontend/             # Next.js application
    ├── src/
    │   ├── app/          # Next.js app directory
    │   ├── components/   # React components
    │   └── lib/          # Shared utilities
    └── public/           # Static assets

```

## Getting Started

### Prerequisites

- Node.js >=18
- npm >=8
- Git

### Installation

1. Clone and install dependencies:

```bash
git clone <repository-url>
cd super-hero-api
npm install
```

2. Configure environment:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

3. Setup database:

```bash
cd backend
npm run db:setup
```

4. Start development servers:

```bash
# Root directory
npm run dev
```

Access:

- Frontend: http://localhost:3000
- API: http://localhost:3001

### Docker Deployment

Run with Docker Compose:

```bash
docker-compose up -d
```

## API Endpoints

### POST /api/v1/superheroes

Add a new superhero

```json
{
  "name": "The Silent Helper",
  "superpower": "Making others feel valued",
  "humilityScore": 9
}
```

### GET /api/v1/superheroes

Fetch superheroes sorted by humility score

```json
[
  {
    "id": 1,
    "name": "The Silent Helper",
    "superpower": "Making others feel valued",
    "humilityScore": 9,
    "createdAt": "2024-01-31T12:00:00.000Z"
  }
]
```

## Security Features

- Environment variable validation (dotenv-safe + Zod)
- API key authentication
- Request rate limiting
- CORS protection
- Input validation
- Request size limiting
- Secure HTTP headers (Helmet)

## Testing

Run tests:

```bash
# All tests
npm test

# Backend only
npm run test:backend

# Frontend only
npm run test:frontend
```

## Future Improvements

- OAuth2 authentication
- Redis caching
- CI/CD pipeline
- E2E testing with Playwright
- OpenAPI/Swagger documentation

## Author

[Dawid Bińkowski](https://github.com/dawidbinkowski)
