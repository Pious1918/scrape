#!/bin/bash
# -------------------------------------------------------------
# Generate High-Resolution Presentation PDF from Daily Report
# -------------------------------------------------------------

# Find latest daily report in reports/
LATEST_REPORT=$(ls -t /Users/pious/Documents/personalproject/scrapping/reports/Daily_Current_Affairs_*.md 2>/dev/null | head -n 1)

if [ -z "$LATEST_REPORT" ]; then
  echo "⚠️ No daily report found in reports/ directory."
  exit 1
fi

REPORT_NAME=$(basename "$LATEST_REPORT" .md)
OUTPUT_PDF="/Users/pious/Documents/personalproject/scrapping/reports/${REPORT_NAME}_Presentation.pdf"

echo "📄 Generating Presentation PDF: $OUTPUT_PDF ..."

# Convert using Marp to PDF with allow-local-files and no-stdin
npx -y @marp-team/marp-cli "$LATEST_REPORT" --pdf --allow-local-files --no-stdin -o "$OUTPUT_PDF"

if [ $? -eq 0 ]; then
  echo "✅ High-Resolution Presentation PDF Created: $OUTPUT_PDF"
  echo "📄 Opening PDF in Preview..."
  open "$OUTPUT_PDF"
else
  echo "❌ Error generating PDF."
fi
