#!/bin/bash
# -----------------------------------------------------------------------------
# 🎓 1-Click Manorama Education & Scholarship Reel Generator
# -----------------------------------------------------------------------------
# Focus: Teachers, SSLC/CBSE/ICSE, Central Entrances (IIT/CUET),
#        Kerala & Central Scholarships, Foreign Scholarships.
#
# Usage:
#   ./scripts/generate_education_reel.sh                   # Auto (Checks for image or fetches online)
#   ./scripts/generate_education_reel.sh --image=photo.jpg # Scans physical newspaper photo
#   ./scripts/generate_education_reel.sh --online          # Fetches live from Manorama Online
#   ./scripts/generate_education_reel.sh --count=3         # Number of alerts to provide (Default: 4)
# -----------------------------------------------------------------------------

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

node "$PROJECT_ROOT/scripts/generate_education_reel.js" "$@"
