#!/usr/bin/env bash

set -euo pipefail

usage() {
  cat <<'EOF'
Usage: ./scripts/mirror-branches.sh SOURCE_BRANCH TARGET_BRANCH

This script makes the remote TARGET_BRANCH match the remote SOURCE_BRANCH.
It is destructive for the target branch, so use it only when you want both
branches to be identical in the remote repository.

Examples:
  ./scripts/mirror-branches.sh staging master
  ./scripts/mirror-branches.sh master staging
EOF
  exit 1
}

if [ "$#" -ne 2 ]; then
  usage
fi

SOURCE="$1"
TARGET="$2"

if [ "$SOURCE" = "$TARGET" ]; then
  echo "Source and target branch must be different."
  usage
fi

if [[ "$SOURCE" != "master" && "$SOURCE" != "staging" ]]; then
  echo "Source branch must be 'master' or 'staging'."
  usage
fi

if [[ "$TARGET" != "master" && "$TARGET" != "staging" ]]; then
  echo "Target branch must be 'master' or 'staging'."
  usage
fi

if [ "$SOURCE" = "master" ] && [ "$TARGET" = "staging" ]; then
  echo "WARNING: this will make origin/staging match origin/master."
fi

if [ "$SOURCE" = "staging" ] && [ "$TARGET" = "master" ]; then
  echo "WARNING: this will make origin/master match origin/staging."
fi

read -p "Mirror origin/${SOURCE} to origin/${TARGET}? (y/N): " CONFIRM

if [[ "$CONFIRM" != "y" ]]; then
  echo "Cancelled."
  exit 0
fi

git fetch origin --prune

git push origin --force-with-lease "origin/${SOURCE}:refs/heads/${TARGET}"

echo "✅ origin/${TARGET} now matches origin/${SOURCE}."
