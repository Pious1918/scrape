#!/bin/bash
# -------------------------------------------------------------
# Generate Presentation Slides from Daily Current Affairs Report
# -------------------------------------------------------------

# Find latest daily report in reports/
LATEST_REPORT=$(ls -t /Users/pious/Documents/personalproject/scrapping/reports/Daily_Current_Affairs_*.md 2>/dev/null | head -n 1)

if [ -z "$LATEST_REPORT" ]; then
  echo "⚠️ No daily report found in reports/ directory yet. Run the n8n master workflow first!"
  exit 1
fi

REPORT_NAME=$(basename "$LATEST_REPORT" .md)
OUTPUT_HTML="/Users/pious/Documents/personalproject/scrapping/reports/${REPORT_NAME}_slides.html"

echo "📄 Converting latest report: $LATEST_REPORT to interactive slides..."

# Convert using Marp with --no-stdin
npx -y @marp-team/marp-cli "$LATEST_REPORT" --html --no-stdin -o "$OUTPUT_HTML"

if [ $? -eq 0 ]; then
  echo "✅ HTML Slide Deck Created: $OUTPUT_HTML"
  echo "🌐 Opening slides in browser..."
  open "$OUTPUT_HTML"
else
  echo "❌ Error generating slides."
fi
