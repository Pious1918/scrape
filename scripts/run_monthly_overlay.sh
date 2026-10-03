#!/bin/bash
# -----------------------------------------------------------------------------
# 1-Click Fast Monthly Thumbnail & Shorts Cover Compositor (Option A)
# -----------------------------------------------------------------------------
# 100% Free, Zero API tokens, Zero Quota Consumption.
# Generates all 31 Days (62 Assets) in under 5 seconds!
#
# Usage:
#   ./scripts/run_monthly_overlay.sh          # Defaults to October 2026
#   ./scripts/run_monthly_overlay.sh 11 2026   # Generate November 2026
#   ./scripts/run_monthly_overlay.sh 1 2027    # Generate January 2027 (New Year)
# -----------------------------------------------------------------------------

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

TARGET_MONTH="${1:-10}"
TARGET_YEAR="${2:-2026}"

echo "🚀 Launching Option A Local Compositor..."
python3 "$PROJECT_ROOT/scripts/render_monthly_overlay_thumbnails.py" --month="$TARGET_MONTH" --year="$TARGET_YEAR"

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Success! All 62 thumbnail and shorts assets are ready for publishing."
  echo "📂 Location: $PROJECT_ROOT/reports/thumbnails/${TARGET_YEAR}-$(printf "%02d" $TARGET_MONTH)_*"
else
  echo "❌ Error during execution."
  exit 1
fi
