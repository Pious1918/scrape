#!/bin/bash
# -------------------------------------------------------------
# 1-Click Reports Cleanup Script
# -------------------------------------------------------------
# Safely frees up disk space by deleting older heavy PDFs, Shorts/Reel
# assets, and stale images.
#
# GUARANTEE: Never touches reports/thumbnails/ (Protected)
#
# Usage:
#   ./scripts/cleanup.sh              # Normal cleanup with interactive confirmation
#   ./scripts/cleanup.sh --dry-run    # Preview what will be deleted without touching files
#   ./scripts/cleanup.sh --clean-md   # Also remove older daily .md reports (> 7 days)
#   ./scripts/cleanup.sh --keep 5     # Keep the latest 5 days of PDFs & Shorts instead of 3
#   ./scripts/cleanup.sh --clean-vocab# Also clean old vocabulary slides & PDFs
#   ./scripts/cleanup.sh --clean-quizzes# Also clean old quiz HTML slides
#   ./scripts/cleanup.sh -y           # Run non-interactively (e.g. automated cron)
# -------------------------------------------------------------

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

node "$PROJECT_ROOT/scripts/cleanup_reports.js" "$@"
