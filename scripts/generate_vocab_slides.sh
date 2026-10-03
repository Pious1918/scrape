#!/bin/bash
# -----------------------------------------------------------------
# Generate Editorial Vocabulary Slides, PDF & Scripts (Day 1 to 7)
# -----------------------------------------------------------------

DAY="${1:-1}"

if [ "$DAY" = "all" ]; then
  echo "🚀 Generating vocabulary decks & scripts for ALL 7 DAYS..."
  node /Users/pious/Documents/personalproject/scrapping/scripts/generate_vocabulary_series.js --all
else
  echo "🚀 Generating vocabulary deck & script for DAY $DAY..."
  node /Users/pious/Documents/personalproject/scrapping/scripts/generate_vocabulary_series.js --day="$DAY"
fi

PAD_DAY=$(printf "%02d" "$DAY" 2>/dev/null || echo "01")
HTML_FILE="/Users/pious/Documents/personalproject/scrapping/reports/Daily_Vocabulary_Day_${PAD_DAY}_slides.html"

if [ -f "$HTML_FILE" ]; then
  echo "🌐 Opening Day $PAD_DAY slides in browser..."
  open "$HTML_FILE"
fi
