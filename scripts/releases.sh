#!/bin/bash

set -e

echo "🚀 Starting release..."

echo ""
echo "📦 Syncing branches..."

./scripts/sync-branches.sh

echo ""
echo "🧪 Running lint..."

npm run lint

echo ""
echo "🧪 Running typecheck..."

npm run typecheck

echo ""
echo "🧪 Running tests..."

npm run test:e2e

echo ""
echo "🏗️ Building project..."

npm run build

echo ""
echo "✅ Project is ready for release."