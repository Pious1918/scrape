/**
 * n8n Code Node: Normalize Sources
 * 
 * Purpose: Converts diverse items from RSS Feed / HTTP nodes into a unified standard schema.
 * Handles missing fields, HTML stripping, HTML entity unescaping, and date normalization.
 */

// Helper to strip HTML tags and decode basic HTML entities
function cleanHtml(rawText) {
  if (!rawText || typeof rawText !== 'string') return '';
  
  let text = rawText.replace(/<[^>]*>/g, ' '); // Strip HTML tags
  
  // Unescape standard HTML entities
  const entities = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&apos;': "'",
    '&#8377;': '₹',
    '&nbsp;': ' ',
    '&#160;': ' ',
    '&ndash;': '–',
    '&mdash;': '—',
    '&rsquo;': "'",
    '&lsquo;': "'",
    '&rdquo;': '"',
    '&ldquo;': '"'
  };
  
  for (const [entity, char] of Object.entries(entities)) {
    text = text.split(entity).join(char);
  }
  
  // Also decode generic numeric entities like &#8217;
  text = text.replace(/&#(\d+);/g, (match, dec) => {
    try {
      return String.fromCharCode(parseInt(dec, 10));
    } catch {
      return match;
    }
  });

  return text.replace(/\s+/g, ' ').trim();
}

// Clean and normalize URLs
function cleanUrl(rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string') return '';
  let url = rawUrl.trim();
  // Remove tracking query parameters (utm_*, ref, etc.)
  try {
    const parsed = new URL(url);
    const trackingParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'ref', 'source'];
    trackingParams.forEach(p => parsed.searchParams.delete(p));
    return parsed.toString();
  } catch {
    return url;
  }
}

// Normalize dates to ISO 8601 string
function normalizeDate(rawDate) {
  if (!rawDate) return new Date().toISOString();
  try {
    const parsed = new Date(rawDate);
    if (!isNaN(parsed.getTime())) {
      return parsed.toISOString();
    }
  } catch {
    // Ignore and fallback
  }
  return new Date().toISOString();
}

// Process all input items from n8n
const normalizedItems = [];

for (const item of $input.all()) {
  const data = item.json || {};
  
  // Title extraction with fallbacks
  const rawTitle = data.title || data['atom:title'] || data.headline || data.name || '';
  const title = cleanHtml(typeof rawTitle === 'object' ? rawTitle._ || rawTitle['#text'] || '' : rawTitle);
  
  // Skip completely empty items
  if (!title || title.length < 5) continue;
  
  // Description extraction with fallbacks
  const rawDesc = data.description || data.contentSnippet || data.summary || data.content || data['content:encoded'] || '';
  const description = cleanHtml(typeof rawDesc === 'object' ? rawDesc._ || rawDesc['#text'] || '' : rawDesc);
  
  // Link/URL extraction
  const rawUrl = data.link || data.url || data.guid || (typeof data.guid === 'object' ? data.guid._ : '');
  const url = cleanUrl(rawUrl);
  
  // Source extraction
  const source = data.source || data.sourceName || data.feedTitle || (url.includes('thehindu.com') ? 'The Hindu' : (url.includes('pib.gov.in') ? 'PIB' : (url.includes('rbi.org.in') ? 'RBI' : (url.includes('prd.kerala.gov.in') ? 'PRD Kerala' : 'Official Source'))));
  const isPrimary = source.toLowerCase().includes('the hindu');
  
  // Category / Tag extraction
  const category = data.category || (Array.isArray(data.categories) ? data.categories[0] : '') || 'General';
  
  // Publication Date
  const rawPubDate = data.pubDate || data.isoDate || data.published || data.date || data.publishedAt;
  const publishedAt = normalizeDate(rawPubDate);
  
  normalizedItems.push({
    json: {
      title,
      description: description.substring(0, 1000), // Cap description length to save tokens
      url,
      source,
      isPrimary,
      category: typeof category === 'string' ? category : 'General',
      publishedAt
    }
  });
}

return normalizedItems;
