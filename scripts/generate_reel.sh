#!/bin/bash
# -------------------------------------------------------------
# Generate 9:16 Reel/Shorts Image (PNG) and PDF from Daily Report
# -------------------------------------------------------------

# Find latest daily Reel report in reports/
LATEST_REEL=$(ls -t /Users/pious/Documents/personalproject/scrapping/reports/Daily_Current_Affairs_*_Reel.md 2>/dev/null | head -n 1)

if [ -z "$LATEST_REEL" ]; then
  echo "⚠️ No daily Reel markdown found in reports/ directory yet. Run fetch_and_generate_today.js first!"
  exit 1
fi

REPORT_BASE="${LATEST_REEL%.md}"
OUTPUT_PNG="${REPORT_BASE}.png"
OUTPUT_PDF="${REPORT_BASE}.pdf"
THEME_PATH="/Users/pious/Documents/personalproject/scrapping/config/theme_reel.css"

echo "📱 Converting latest Reel: $LATEST_REEL to 9:16 Full HD assets..."

# Convert using Marp to PNG
npx -y @marp-team/marp-cli --theme "$THEME_PATH" "$LATEST_REEL" --html --image png --allow-local-files --no-stdin -o "$OUTPUT_PNG"

# Convert using Marp to PDF
npx -y @marp-team/marp-cli --theme "$THEME_PATH" "$LATEST_REEL" --html --pdf --allow-local-files --no-stdin -o "$OUTPUT_PDF"

if [ $? -eq 0 ]; then
  echo "✅ 9:16 Reel Assets Created:"
  echo "   🖼️ Image : $OUTPUT_PNG"
  echo "   📄 PDF   : $OUTPUT_PDF"
  echo "👁️ Opening Reel image in Preview..."
  open "$OUTPUT_PNG"
else
  echo "❌ Error generating Reel assets."
fi
