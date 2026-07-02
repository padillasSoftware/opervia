#!/bin/bash

set -e

echo "🧹 Cleaning project..."

rm -rf node_modules
rm -rf .nuxt
rm -rf .output
rm -rf playwright-report
rm -rf test-results

echo ""
echo "📦 Installing dependencies..."

npm install

echo ""
echo "⚙️ Generating Prisma Client..."

npx prisma generate

echo ""
echo "✅ Clean completed!"