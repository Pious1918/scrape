#!/bin/bash
# -----------------------------------------------------------------------------
# 1-Click Monthly YouTube Thumbnails & Shorts Generator
# -----------------------------------------------------------------------------
# Default: Generates next or specified month (e.g. Month 10 Year 2026)
# Usage:
#   ./scripts/generate_monthly_thumbnails.sh
#   ./scripts/generate_monthly_thumbnails.sh 11 2026
#   ./scripts/generate_monthly_thumbnails.sh 1 2027
# -----------------------------------------------------------------------------

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Defaults if not passed
TARGET_MONTH="${1:-$(date +%m)}"
TARGET_YEAR="${2:-$(date +%Y)}"

echo "🎬 Starting 1-Click Monthly Thumbnail & Shorts Suite..."
echo "📅 Generating for Month: $TARGET_MONTH, Year: $TARGET_YEAR"

node "$PROJECT_ROOT/scripts/generate_monthly_thumbnails.js" --month="$TARGET_MONTH" --year="$TARGET_YEAR"

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Complete! 62 Thumbnail specifications and ready-to-run prompts generated successfully."
  echo "📂 Check: $PROJECT_ROOT/reports/thumbnails/"
else
  echo "❌ Error during generation."
  exit 1
fi
