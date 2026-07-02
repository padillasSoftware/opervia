#!/bin/bash

set -e

echo "📦 Installing dependencies..."
npm install

echo ""
echo "⚙️ Generating Prisma Client..."
npx prisma generate

echo ""
echo "🌱 Seeding database..."
npm run seed

echo ""
echo "✅ Project ready!"