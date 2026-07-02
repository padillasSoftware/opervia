#!/bin/bash

set -e

echo "🔄 Fetching latest changes..."
git fetch origin

echo "📦 Switching to master..."
git checkout master

echo "⬇️ Pulling master..."
git pull --ff-only origin master

echo "📦 Switching to staging..."
git checkout staging

echo "⬇️ Pulling staging..."
git pull --ff-only origin staging

echo ""
echo "✅ Branches synchronized successfully!"
echo "📍 Current branch: $(git branch --show-current)"