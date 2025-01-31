#!/bin/sh
set -e

# Function to check if database exists
database_exists() {
    [ -f "/app/prisma/prod.db" ]
}

# Function to check if database needs migration
needs_migration() {
    # You might want to implement a more sophisticated check here
    # For now, we'll assume if the database exists but is empty, it needs migration
    [ -f "/app/prisma/prod.db" ] && [ ! -s "/app/prisma/prod.db" ]
}

# Initialize the database if it doesn't exist
if ! database_exists; then
    echo "🏗️ Initializing database..."
    npx prisma migrate deploy

    echo "🌱 Seeding database..."
    npx prisma db seed

    echo "✅ Database initialization complete!"
elif needs_migration; then
    echo "🔄 Running pending migrations..."
    npx prisma migrate deploy
fi

# Execute the main container command
exec "$@"
