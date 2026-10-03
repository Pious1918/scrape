#!/bin/bash
# -------------------------------------------------------------
# Weekly Kerala Current Affairs MCQ Quiz Competition Generator
# -------------------------------------------------------------
# Usage:
#   ./scripts/generate_weekly_quiz.sh
#   ./scripts/generate_weekly_quiz.sh 2026-09-20
#   ./scripts/generate_weekly_quiz.sh --date 2026-09-20 --count 20
#   ./scripts/generate_weekly_quiz.sh --scrape
# -------------------------------------------------------------

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_ROOT"

echo "🎯 Starting Weekly Kerala Current Affairs Quiz Generation..."
node "$PROJECT_ROOT/scripts/generate_weekly_kerala_quiz.js" "$@"
