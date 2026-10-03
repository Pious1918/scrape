/**
 * n8n Code Node: Confidence Gate & Verification Evaluator
 * 
 * Purpose: Evaluates AI research accuracy against the minimum confidence threshold (0.85).
 * Flags low-confidence stories for manual newspaper cross-checking.
 * Computes workflow-wide verification metrics.
 */

const items = $input.all().map(i => i.json);
const MINIMUM_CONFIDENCE = 0.85;

const processedStories = [];
let verifiedCount = 0;
let manualCheckCount = 0;

for (const story of items) {
  const confidence = typeof story.confidence === 'number' ? story.confidence : parseFloat(story.confidence) || 0.0;
  const isFactuallyVerified = story.verified === true && confidence >= MINIMUM_CONFIDENCE;

  if (isFactuallyVerified) {
    verifiedCount++;
    processedStories.push({
      ...story,
      confidence,
      verified: true,
      needsManualCheck: false,
      verificationBadge: '✅ VERIFIED',
      verificationNote: 'Confidence >= ' + MINIMUM_CONFIDENCE
    });
  } else {
    manualCheckCount++;
    processedStories.push({
      ...story,
      confidence,
      verified: false,
      needsManualCheck: true,
      verificationBadge: '⚠️ MANUAL_VERIFICATION_REQUIRED',
      verificationNote: `Confidence (${confidence.toFixed(2)}) is below ${MINIMUM_CONFIDENCE}. Please cross-check against your physical copy of The Hindu.`
    });
  }
}

return processedStories.map(story => ({
  json: {
    ...story,
    summaryStats: {
      totalStories: processedStories.length,
      verifiedCount,
      manualCheckCount
    }
  }
}));
