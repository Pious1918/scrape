/**
 * n8n Code Node: Deduplicate Stories
 * 
 * Purpose: Deterministically removes duplicate and overlapping news stories across multiple sources.
 * Features:
 * - Acronym normalization (RBI, ISRO, SC, PM, CM, UPSC, etc.)
 * - Stopword removal & tokenization
 * - Hybrid Dice & Containment similarity matching
 * - Source hierarchy: Preserves The Hindu as primary while storing secondary sources in `supportingSources`.
 */

const ACRONYM_MAP = {
  'rbi': 'reserve bank india',
  'isro': 'indian space research organisation',
  'drdo': 'defence research development organisation',
  'sc': 'supreme court',
  'hc': 'high court',
  'pm': 'prime minister',
  'cm': 'chief minister',
  'mpc': 'monetary policy committee',
  'upsc': 'union public service commission',
  'psc': 'public service commission',
  'kpsc': 'kerala public service commission',
  'gdp': 'gross domestic product',
  'cpi': 'consumer price index',
  'wpi': 'wholesale price index',
  'sebi': 'securities exchange board india',
  'pib': 'press information bureau'
};

const STOP_WORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
  'from', 'as', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has',
  'had', 'do', 'does', 'did', 'will', 'would', 'shall', 'should', 'can', 'could',
  'may', 'might', 'must', 'that', 'which', 'who', 'whom', 'this', 'these', 'those',
  'it', 'its', 'itself', 'new', 'after', 'over', 'into', 'under', 'says', 'said',
  'holds', 'keeps', 'retains', 'announces', 'unveils', 'launches', 'sets'
]);

function tokenizeAndExpandTitle(title) {
  if (!title) return new Set();
  
  let text = title.toLowerCase().replace(/[^a-z0-9\s]/g, ' ');
  
  // Expand common acronyms
  for (const [acronym, expansion] of Object.entries(ACRONYM_MAP)) {
    const regex = new RegExp(`\\b${acronym}\\b`, 'g');
    text = text.replace(regex, expansion);
  }
  
  const words = text
    .split(/\s+/)
    .filter(w => w.length > 1 && !STOP_WORDS.has(w));
    
  return new Set(words);
}

function calculateSimilarity(setA, setB) {
  if (setA.size === 0 || setB.size === 0) return 0;
  let intersectionSize = 0;
  for (const token of setA) {
    if (setB.has(token)) intersectionSize++;
  }
  
  // Containment score (how much the smaller headline is contained in the larger)
  const containment = intersectionSize / Math.min(setA.size, setB.size);
  // Dice coefficient
  const dice = (2 * intersectionSize) / (setA.size + setB.size);
  
  return Math.max(containment, dice);
}

const inputItems = $input.all().map(i => i.json);
const uniqueStories = [];
const seenUrls = new Set();

for (const item of inputItems) {
  if (!item.title || !item.url) continue;

  // 1. Exact URL deduplication
  if (seenUrls.has(item.url)) {
    continue;
  }

  const currentTokens = tokenizeAndExpandTitle(item.title);
  let duplicateIndex = -1;

  // 2. Fuzzy Title similarity check
  for (let i = 0; i < uniqueStories.length; i++) {
    const existing = uniqueStories[i];
    const existingTokens = existing._tokens;
    
    const similarity = calculateSimilarity(currentTokens, existingTokens);
    
    // If similarity score >= 0.55
    if (similarity >= 0.55) {
      duplicateIndex = i;
      break;
    }
  }

  if (duplicateIndex === -1) {
    // New unique story
    seenUrls.add(item.url);
    uniqueStories.push({
      title: item.title,
      description: item.description,
      url: item.url,
      source: item.source,
      isPrimary: item.isPrimary || item.source.toLowerCase().includes('the hindu'),
      category: item.category || 'General',
      publishedAt: item.publishedAt,
      supportingSources: [],
      _tokens: currentTokens
    });
  } else {
    // Duplicate detected: merge sources intelligently
    const existing = uniqueStories[duplicateIndex];
    
    // If current item is from The Hindu and existing is not, promote The Hindu to primary
    if ((item.isPrimary || item.source.toLowerCase().includes('the hindu')) && !existing.isPrimary) {
      existing.supportingSources.push({
        source: existing.source,
        url: existing.url,
        title: existing.title,
        publishedAt: existing.publishedAt
      });
      existing.title = item.title;
      existing.description = item.description || existing.description;
      existing.url = item.url;
      existing.source = item.source;
      existing.isPrimary = true;
      existing.category = item.category || existing.category;
      existing.publishedAt = item.publishedAt;
      existing._tokens = currentTokens;
      seenUrls.add(item.url);
    } else {
      // Add secondary supporting source
      existing.supportingSources.push({
        source: item.source,
        url: item.url,
        title: item.title,
        publishedAt: item.publishedAt
      });
      seenUrls.add(item.url);
    }
  }
}

// Strip internal tokens before returning
return uniqueStories.map(story => {
  const { _tokens, ...cleanStory } = story;
  return { json: cleanStory };
});
