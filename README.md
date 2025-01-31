# 🦸 Humble Superhero API 🦸‍♀️

A full-stack application that celebrates the humble superheroes among us. This project includes both a backend API and a
frontend interface for managing our everyday superheroes.

## Project Structure

```
super-hero-api/
├── backend/         # Node.js + Express + TypeScript API
├── frontend/        # React + TypeScript frontend
├── .gitignore      # Git ignore rules
├── package.json    # Root package.json for monorepo management
└── README.md       # This file
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (v8 or higher)
- Git

### Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd super-hero-api
   ```

2. Install dependencies for both projects:
   ```bash
   npm run install:all
   ```

3. Set up the database:
   ```bash
   cd backend
   npm run db:setup
   ```
   This will:
    - Create a new SQLite database
    - Run all migrations
    - Seed the database with sample superhero data

   Note: The database will be automatically created with sample data when you first run the setup command. You don't
   need to do any additional configuration!

3. Start both frontend and backend in development mode:
   ```bash
   npm start
   ```

### Development

- Frontend development server: `npm run start:frontend`
- Backend development server: `npm run start:backend`
- Run all tests: `npm test`
- Build both projects: `npm run build`

## Team Collaboration

This project is structured as a monorepo to facilitate:

- Shared configuration and tooling
- Easy dependency management
- Consistent development experience
- Simplified deployment process

When collaborating:

1. Create feature branches from `main`
2. Follow the conventional commits specification
3. Submit PRs with comprehensive descriptions
4. Ensure tests pass before merging

## If I Had More Time

Future improvements could include:

- Implement WebSocket for real-time updates
- Add authentication system
- Create a CI/CD pipeline
- Add end-to-end testing
- Implement caching strategy
- Add documentation with Swagger/OpenAPI
- Create Docker setup for easy deployment

## License

ISC
