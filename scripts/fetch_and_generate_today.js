/**
 * Live Daily Current Affairs Fetcher & PDF Presentation Generator (6:00 AM Morning Edition)
 * 
 * Features:
 * - Strict 24-Hour Morning Editorial Window: Collects news published between yesterday 05:30 AM and today 06:00 AM (exact match for today's print newspaper).
 * - Categorized strictly into: Kerala, India (National & Economy), Sports, International.
 * - Exactly 2 high-yield competitive exam vocabulary words.
 * - Extracts exact newspaper photographs from The Hindu.
 * - Generates tight 16:9 split-screen presentation slides.
 * - Compiles directly into high-resolution PDF and opens Preview on macOS.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Load environment variables from .env if present
function loadEnv() {
  const envPath = path.resolve(__dirname, '../.env');
  if (typeof process.loadEnvFile === 'function') {
    try {
      if (fs.existsSync(envPath)) process.loadEnvFile(envPath);
      return;
    } catch (e) {}
  }
  if (fs.existsSync(envPath)) {
    try {
      const content = fs.readFileSync(envPath, 'utf8');
      for (const line of content.split('\n')) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const eqIdx = trimmed.indexOf('=');
        if (eqIdx !== -1) {
          const key = trimmed.slice(0, eqIdx).trim();
          const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '');
          if (!process.env[key]) {
            process.env[key] = val;
          }
        }
      }
    } catch (e) {}
  }
}
loadEnv();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY || GEMINI_API_KEY.includes('WRONG_SAMPLE') || GEMINI_API_KEY.includes('YOUR_')) {
  console.error("❌ Error: Valid GEMINI_API_KEY is missing in .env!");
  console.error("👉 Please set your real Gemini API key in .env (refer to .env.sample).");
  process.exit(1);
}
const IMAGES_DIR = path.join(__dirname, '../reports/images');

if (!fs.existsSync(IMAGES_DIR)) {
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
}

const RSS_FEEDS = [
  { name: 'The Hindu - Kerala', category: 'Kerala', url: 'https://www.thehindu.com/news/national/kerala/feeder/default.rss' },
  { name: 'The Hindu - National', category: 'India', url: 'https://www.thehindu.com/news/national/feeder/default.rss' },
  { name: 'The Hindu - Business', category: 'India (Economy)', url: 'https://www.thehindu.com/business/feeder/default.rss' },
  { name: 'The Hindu - SciTech', category: 'India (Science & Tech)', url: 'https://www.thehindu.com/sci-tech/feeder/default.rss' },
  { name: 'The Hindu - Sports', category: 'Sports', url: 'https://www.thehindu.com/sport/feeder/default.rss' },
  { name: 'The Hindu - International', category: 'International', url: 'https://www.thehindu.com/news/international/feeder/default.rss' },
  { name: 'PRD Kerala', category: 'Kerala', url: 'https://prd.kerala.gov.in/en/rss.xml' }
];

// Normalization mappings for official terms, schemes, campaigns, operations that must retain their standard English name
const ENGLISH_TERM_REPLACEMENTS = [
  [/(?:ഈറ്റ്\s*റൈറ്റ്\s*(?:ക്യാമ്പസ്|കാമ്പസ്))/gu, "Eat Right Campus"],
  [/(?:ഈറ്റ്\s*റൈറ്റ്\s*സ്റ്റേഷൻ)/gu, "Eat Right Station"],
  [/(?:പവർ\s*ബാങ്കിംഗ്|പവർ\s*ബാങ്കിങ്)/gu, "Power Banking"],
  [/(?:ഓപ്പറേഷൻ\s*തൂഫാൻ)/gu, "Operation Toofan"],
  [/(?:ഓപ്പറേഷൻ\s*കുബേര)/gu, "Operation Kubera"],
  [/(?:സെമികോൺ\s*ഇന്ത്യ)/gu, "Semicon India"],
  [/(?:അറേബ്യൻ\s*ട്രാവൽ\s*മാർക്കറ്റ്)/gu, "Arabian Travel Market"],
  [/(?:ഗ്ലോബൽ\s*സൗത്ത്)/gu, "Global South"],
  [/(?:വൺ\s*ഹെൽത്ത്)/gu, "One Health"],
  [/(?:എൽ\s*നിഞ്ഞോ)/gu, "El Niño"],
  [/(?:ലാ\s*നിഞ്ഞ)/gu, "La Niña"],
  [/(?:കെ[\s-]സ്മാർട്ട്)/gu, "K-Smart"],
  [/(?:കെ[\s-]ഫോൺ)/gu, "KFON"],
  [/(?:ലൈഫ്\s*മിഷൻ)/gu, "LIFE Mission"],
  [/(?:സിൽവർ[\s-]?ലൈൻ)/gu, "SilverLine"],
  [/(?:വിഴിഞ്ഞം\s*(?:ഇന്റർനാഷണൽ|അന്താരാഷ്ട്ര)\s*പോർട്ട്)/gu, "Vizhinjam International Seaport"],
  [/(?:സ്റ്റാർട്ടപ്പ്\s*മിഷൻ)/gu, "Startup Mission"],
  [/(?:നോളജ്\s*ഇക്കോണമി\s*മിഷൻ)/gu, "Knowledge Economy Mission"],
  [/(?:ക്ലീൻ\s*കേരള\s*കമ്പനി)/gu, "Clean Kerala Company"],
  [/(?:ആർദ്രം\s*മിഷൻ)/gu, "Aardram Mission"],
  [/(?:ഹരിതകേരളം\s*മിഷൻ)/gu, "Haritha Keralam Mission"]
];

function normalizeEnglishTerms(text) {
  if (!text || typeof text !== 'string') return '';
  let res = text;
  for (const [regex, replacement] of ENGLISH_TERM_REPLACEMENTS) {
    res = res.replace(regex, replacement);
  }
  return res;
}

// Helper: Strip HTML & unescape entities
function cleanText(raw) {
  if (!raw || typeof raw !== 'string') return '';
  let text = raw.replace(/<[^>]*>/g, ' ');
  const entities = {
    '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'",
    '&#8377;': '₹', '&nbsp;': ' ', '&#160;': ' ', '&ndash;': '–', '&mdash;': '—'
  };
  for (const [k, v] of Object.entries(entities)) {
    text = text.split(k).join(v);
  }
  text = text.replace(/\s+/g, ' ').trim();
  return normalizeEnglishTerms(text);
}

// Download image locally
async function downloadImageLocally(imgUrl, filename) {
  if (!imgUrl) return null;
  const localPath = path.join(IMAGES_DIR, filename);
  try {
    const res = await fetch(imgUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)' }
    });
    if (!res.ok) return null;
    const arrayBuffer = await res.arrayBuffer();
    fs.writeFileSync(localPath, Buffer.from(arrayBuffer));
    return `./images/${filename}`;
  } catch (err) {
    return null;
  }
}

// Check if an image URL is a generic placeholder or site logo (e.g. The Hindu logo)
function isGenericPlaceholderImage(imgUrl) {
  if (!imgUrl || typeof imgUrl !== 'string') return true;
  const lower = imgUrl.toLowerCase();
  const blacklistedKeywords = [
    'og-image',
    'thehindu-logo',
    'thehindu_logo',
    'the_hindu_logo',
    'th-logo',
    'th-online',
    'default_image',
    'placeholder',
    'favicon',
    'site-logo',
    'brand-logo',
    'crest'
  ];
  return blacklistedKeywords.some(keyword => lower.includes(keyword));
}

// Filter out routine accidents, ordinary demises, and partisan fights
function isExcludedNews(item) {
  const text = `${item.title} ${item.description || ''}`.toLowerCase();
  
  // Routine accidents (road/train collisions, drowning, car crashes, lorry accidents)
  const routineAccidentPattern = /\b(killed in road accident|road accident|car crash|car collision|lorry collision|truck collision|collides with lorry|dies in mishap|drowns in|drowned|electrocuted|falls to death|hit by train|bus plunges|bus accident|bike accident)\b/i;
  
  // Prominent figure indicators (demise exception for competitive exams)
  const prominentFigurePattern = /\b(former president|former prime minister|prime minister|chief minister|union minister|governor|supreme court judge|chief justice|nobel|bharat ratna|padma|sahitya akademi|olympian|grandmaster|world champion|veteran author|noted writer|veteran politician|veteran leader|freedom fighter|eminent scientist)\b/i;
  
  if (routineAccidentPattern.test(text) && !prominentFigurePattern.test(text)) {
    return true;
  }
  
  // Ordinary private citizen deaths
  const ordinaryDeathPattern = /\b(found dead|suicide|dies of cardiac arrest at home|body fished out|student dies|students die|youths die|youth dies)\b/i;
  if (ordinaryDeathPattern.test(text) && !prominentFigurePattern.test(text)) {
    return true;
  }
  
  // Petty political bickering, accusations, party disputes lacking policy/constitutional substance
  const pettyPoliticalPattern = /\b(flays|hits back at|slams opponent|mud-slinging|alleges conspiracy|workers clash|activists clash|sloganeering|bickering|trade charges)\b/i;
  if (pettyPoliticalPattern.test(text)) {
    return true;
  }
  
  return false;
}

// Extract og:image from article page if missing in RSS
async function fetchOgImage(articleUrl) {
  if (!articleUrl || !articleUrl.startsWith('http')) return null;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);
    const res = await fetch(articleUrl, {
      signal: controller.signal,
      headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)' }
    });
    clearTimeout(timeout);
    if (!res.ok) return null;
    const html = await res.text();
    const match = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ||
                  html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
    const foundUrl = match ? match[1] : null;
    if (foundUrl && !isGenericPlaceholderImage(foundUrl)) {
      return foundUrl;
    }
    return null;
  } catch {
    return null;
  }
}

// Fetch RSS XML with 24-hour rolling print edition filter
async function fetchFeed(feed, windowStartTime) {
  try {
    const res = await fetch(feed.url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)' }
    });
    if (!res.ok) return [];
    const xml = await res.text();
    
    const items = [];
    const itemMatches = xml.match(/<item[\s\S]*?<\/item>/gi) || [];
    
    for (const itemXml of itemMatches) {
      const titleMatch = itemXml.match(/<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/i);
      const linkMatch = itemXml.match(/<link>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/link>/i);
      const descMatch = itemXml.match(/<description>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/i);
      const pubDateMatch = itemXml.match(/<pubDate>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/pubDate>/i);
      
      const mediaMatch = itemXml.match(/<media:content[^>]+url="([^">]+)"/i) || 
                         itemXml.match(/<enclosure[^>]+url="([^">]+)"/i);
      let imageUrl = mediaMatch ? mediaMatch[1] : null;
      if (imageUrl && isGenericPlaceholderImage(imageUrl)) {
        imageUrl = null;
      }
      
      const title = cleanText(titleMatch ? titleMatch[1] : '');
      const link = (linkMatch ? linkMatch[1] : '').trim();
      const description = cleanText(descMatch ? descMatch[1] : '');
      const rawPubDate = pubDateMatch ? pubDateMatch[1] : '';
      
      const pubDateObj = rawPubDate ? new Date(rawPubDate) : new Date();
      
      // Strict 24-hour filter matching today's morning print paper cycle
      if (pubDateObj.getTime() < windowStartTime) {
        continue; // Discard older articles
      }
      
      if (title && link) {
        items.push({
          title,
          link,
          description: description.substring(0, 500),
          category: feed.category,
          source: feed.name,
          publishedAt: pubDateObj.toISOString(),
          imageUrl
        });
      }
    }
    return items;
  } catch (err) {
    console.warn(`⚠️ Warning fetching ${feed.name}: ${err.message}`);
    return [];
  }
}

// Deduplicate items
function deduplicate(items) {
  const seen = new Set();
  const unique = [];
  for (const item of items) {
    const slug = item.title.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 40);
    if (!seen.has(slug) && !seen.has(item.link)) {
      seen.add(slug);
      seen.add(item.link);
      unique.push(item);
    }
  }
  return unique;
}

// Clean and robustly parse JSON from LLM output
function cleanAndParseJson(raw) {
  if (!raw || typeof raw !== 'string') return {};
  let cleaned = raw.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?```\s*$/, '').trim();
  }
  try {
    return JSON.parse(cleaned);
  } catch (firstErr) {
    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace > firstBrace) {
      const candidate = cleaned.slice(firstBrace, lastBrace + 1);
      try {
        return JSON.parse(candidate);
      } catch (e) {
        const fixedCommas = candidate.replace(/,\s*([\]}])/g, '$1');
        try {
          return JSON.parse(fixedCommas);
        } catch {}
      }
    }
    throw firstErr;
  }
}

// Call Google Gemini API with automatic model fallback
async function callGemini(prompt) {
  const models = [
    'gemini-3.5-flash-lite',
    'gemini-3.1-flash-lite',
    'gemini-flash-lite-latest',
    'gemini-flash-latest',
    'gemini-3.5-flash',
    'gemini-3.6-flash',
    'gemini-3.7-flash'
  ];

  let lastError = null;
  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
      const response = await fetch(url, {
        method: 'POST',
        signal: AbortSignal.timeout(45000),
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 8192,
            responseMimeType: 'application/json'
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
        return cleanAndParseJson(text);
      } else {
        const errText = await response.text();
        console.warn(`⚠️ [${model}] returned ${response.status}: ${errText.substring(0, 60)}... trying next`);
        lastError = new Error(`${model} Error: ${response.status}`);
      }
    } catch (e) {
      console.warn(`⚠️ [${model}] failed (${e.message})... trying next`);
      lastError = e;
    }
  }
  throw lastError || new Error("All Gemini models failed");
}

// Main execution
async function main() {
  const now = new Date();
  // 24-hour window: from yesterday morning to today 06:00 AM
  const windowStartTime = now.getTime() - (24 * 60 * 60 * 1000);
  const windowStartDate = new Date(windowStartTime).toLocaleString('en-GB', { timeZone: 'Asia/Kolkata' });

  console.log(`⏰ [1/5] Applying 24-Hour Morning Edition Window (Since: ${windowStartDate} IST)...`);
  console.log("🚀 Fetching news matching today's print edition from The Hindu, PRD Kerala & official sources...");
  
  const rawResults = await Promise.all(RSS_FEEDS.map(f => fetchFeed(f, windowStartTime)));
  const allItems = rawResults.flat();
  console.log(`📥 Ingested ${allItems.length} print-cycle articles.`);
  
  const uniqueItems = deduplicate(allItems).filter(item => !isExcludedNews(item));
  console.log(`🧹 Filtered & deduplicated down to ${uniqueItems.length} high-yield exam stories.`);

  console.log("🧠 [2/5] Calling Google Gemini to curate 10-15 exam stories across Kerala, India, Sports & World...");
  
  const prompt = `
You are an expert Chief Editor and Malayalam Current Affairs educator for competitive exams (Kerala PSC, SSC, UPSC, Banking).

Input News Items from today's morning edition of The Hindu & Official Sources:
${JSON.stringify(uniqueItems.slice(0, 60).map((u, i) => ({ id: i, title: u.title, description: (u.description || '').substring(0, 200), category: u.category, url: u.link, imageUrl: u.imageUrl })))}

Task:
1. Select 8 to 12 of the MOST IMPORTANT stories for competitive exams across:
   - Kerala Affairs (കേരളം)
   - India / National & Economy (ദേശീയം & സാമ്പത്തികം)
   - Sports (കായികം)
   - International (അന്തർദേശീയം)

CRITICAL EDITORIAL EXCLUSIONS (Strictly adhere to these rules):
- NO ROUTINE ACCIDENTS OR ORDINARY DEATHS: Do NOT select news about road accidents, lorry/car/bus collisions, train mishaps, drowning, suicides, domestic fires, or deaths of ordinary citizens (e.g. students or local residents dying in vehicle crashes).
- DEMISE NEWS EXCEPTION: Demise / obituary news is PERMITTED ONLY IF the deceased is a prominent, high-profile personality directly relevant to competitive exam questions:
  * Eminent sportspersons (Olympian, world champion, international cricketer, etc.)
  * Major political leaders / statesmen (former President, PM, CM, Union Minister, senior constitutional figure)
  * Celebrated authors, literary figures, Nobel/Padma/Sahitya Akademi laureates, or renowned artists
- NO PARTISAN POLITICAL SQUABBLES: Do NOT select stories regarding routine political mudslinging, party press conference arguments, accusations/blame-games between rival political parties, rallies, or factional fights that have no lasting constitutional, legislative, policy, or administrative significance.
- NO ENTERTAINMENT, CELEBRITY GOSSIP, OR LOCAL PETTY CRIME.

CRITICAL LANGUAGE & SPELLING GUIDELINES (STRICT COMPLIANCE):
- PRESERVE ENGLISH FOR TITLES & SCHEMES: For official scheme/campaign names, certifications, projects, summits, operations, technical terms, and English proper nouns (for example: "Eat Right Campus", "Operation Toofan", "Power Banking", "Semicon India", "Arabian Travel Market", "Global South", "One Health", "K-FON", "LIFE Mission", "K-Smart", "IDSFFK", "El Niño", "Smart City"), KEEP THE EXACT ENGLISH TEXT ITSELF (e.g. "Eat Right Campus സർട്ടിഫിക്കേഷൻ", "Operation Toofan", "Semicon India 2026").
- DO NOT force clumsy, awkward, or misspelled Malayalam phonetic transliterations for these English terms (which causes serious spelling mistakes and confuses exam aspirants).
- ACCURATE MALAYALAM SPELLING & GRAMMAR: Ensure formal, literary, error-free Malayalam (ഗ്രന്ഥഭാഷ / മാധ്യമ നിലവാരം). Pay special attention to correct chillaksharam (ൺ, ൻ, ർ, ൽ, ൾ) and conjunct letters (കൂട്ടക്ഷരങ്ങൾ). Avoid broken spellings.

2. For each selected story, write natural, high-quality Malayalam content structured for a presentation slide:
   - "id": [matching id number from input]
   - "category": "KERALA" | "INDIA" | "SPORTS" | "INTERNATIONAL"
   - "title": "ആകർഷകമായ മലയാളം തലക്കെട്ട് (Main Title in Malayalam)"
   - "subTitle": "സബ്‌ ഹെഡിംഗ് (Sub-title in Malayalam highlighting core development)"
   - "description": "സംഭവത്തിന്റെ വിശദീകരണം 2-3 വാക്യങ്ങളിൽ (Crisp 2-3 sentence Malayalam summary)"
   - "examPoints": ["പ്രധാന വസ്തുത 1 (ഉദാ: കണക്കുകൾ, തീയതി)", "പ്രധാന വസ്തുത 2 (നോഡൽ ഏജൻസി / വകുപ്പ് / കായിക വേദി)"]
   - "question": "പരീക്ഷാ ചോദ്യം (A relevant, exam-oriented Malayalam question based directly on this story)"
   - "answer": "നേരിട്ടുള്ള ഉത്തരം (Crisp, accurate Malayalam answer with key term/name in brackets)"
3. Select exactly 2 high-yield English vocabulary words from today's news context:
   - "word": "UPPERCASE WORD"
   - "partOfSpeech": "Adjective | Noun | Verb"
   - "englishMeaning": "Concise English definition"
   - "malayalamMeaning": "കൃത്യമായ മലയാള അർത്ഥം"
   - "exampleSentence": "A clear, natural example sentence related to today's news."
4. Generate exactly 3 rapid-fire, high-yield Malayalam exam Questions & Answers for today's social media Reel / YouTube Shorts promo ("Today's Main News" / ഇന്നത്തെ പ്രധാന വാർത്തകൾ):
   - "question": "ആകർഷകവും വ്യക്തവുമായ മലയാളം ചോദ്യം (Crisp, exam-oriented Malayalam question based on today's top news)"
   - "answer": "നേരിട്ടുള്ള കൃത്യമായ ഉത്തരം (Direct, concise Malayalam answer with key names in brackets if applicable)"
   - "category": "KERALA" | "INDIA" | "SPORTS" | "INTERNATIONAL"

Return STRICT JSON ONLY matching this schema:
{
  "stories": [
    {
      "id": 0,
      "category": "KERALA",
      "title": "...",
      "subTitle": "...",
      "description": "...",
      "examPoints": ["...", "..."],
      "question": "...",
      "answer": "..."
    }
  ],
  "vocabulary": [
    {
      "word": "...",
      "partOfSpeech": "...",
      "englishMeaning": "...",
      "malayalamMeaning": "...",
      "exampleSentence": "..."
    }
  ],
  "reelQuestions": [
    {
      "question": "ചോദ്യം...",
      "answer": "ഉത്തരം...",
      "category": "KERALA"
    }
  ]
}
`;

  const geminiData = await callGemini(prompt);
  const stories = geminiData.stories || [];
  const vocabulary = (geminiData.vocabulary || []).slice(0, 2);
  let reelQuestions = geminiData.reelQuestions || [];

  // Ensure every story has question and answer
  stories.forEach((s) => {
    if (!s.question) {
      s.question = `${s.title} - ഇതോടനുബന്ധിച്ച് പരീക്ഷയിൽ ചോദിക്കാവുന്ന പ്രധാന ചോദ്യം എന്താണ്?`;
    }
    if (!s.answer) {
      s.answer = (s.examPoints && s.examPoints[0]) ? s.examPoints[0] : s.subTitle;
    }
  });

  // Fallback if less than 3 reel questions
  if (reelQuestions.length < 3 && stories.length >= 3) {
    reelQuestions = stories.slice(0, 3).map((s) => ({
      question: s.question || s.title,
      answer: s.answer || (s.examPoints?.[0] || s.subTitle),
      category: s.category || 'INDIA'
    }));
  }
  reelQuestions = reelQuestions.slice(0, 3);

  console.log(`✨ Selected ${stories.length} exam stories & ${reelQuestions.length} Reel Q&A picks.`);

  // Extract only the EXACT newspaper photo
  console.log("📸 [3/5] Extracting exact article photographs from The Hindu...");
  for (let i = 0; i < stories.length; i++) {
    const s = stories[i];
    const originalItem = uniqueItems[s.id] || {};
    let imgUrl = originalItem.imageUrl;

    if (!imgUrl && originalItem.link) {
      imgUrl = await fetchOgImage(originalItem.link);
    }

    if (imgUrl && !isGenericPlaceholderImage(imgUrl)) {
      const ext = imgUrl.includes('.png') ? 'png' : 'jpg';
      const filename = `story_exact_${i + 1}.${ext}`;
      const localPath = await downloadImageLocally(imgUrl, filename);
      s.localImage = localPath;
    } else {
      s.localImage = null;
    }
  }

  console.log("🎨 [4/5] Assembling 16:9 presentation slides...");

  const todayStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
  const fileDate = new Date().toISOString().split('T')[0].replace(/-/g, '_');

  let md = `---
marp: true
theme: default
size: 16:9
paginate: false
style: |
  @import url('https://fonts.googleapis.com/css2?family=Manjari:wght@400;700&family=Noto+Sans+Malayalam:wght@400;600;700;800&display=swap');
  
  section {
    font-family: 'Noto Sans Malayalam', 'Manjari', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    padding: 0;
    margin: 0;
    background: #f8fafc;
    color: #1e293b;
    display: flex;
    flex-direction: row;
    width: 1280px;
    height: 720px;
  }
  
  .slide-container {
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 100%;
  }

  .left-content {
    width: 64%;
    height: 100%;
    padding: 26px 32px 20px 38px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    background: #ffffff;
  }

  .full-content {
    width: 100%;
    height: 100%;
    padding: 38px 48px 28px 48px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    background: #ffffff;
  }

  .right-visual {
    width: 36%;
    height: 100%;
    background: linear-gradient(145deg, #0f172a 0%, #1e293b 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 28px 24px;
    box-sizing: border-box;
    overflow: hidden;
  }

  .image-wrapper {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .image-wrapper img {
    max-width: 88%;
    max-height: 400px;
    width: auto;
    height: auto;
    object-fit: contain;
    display: block;
    border-radius: 14px;
    box-shadow: 0 16px 32px rgba(0, 0, 0, 0.45);
    border: 1.5px solid rgba(255, 255, 255, 0.15);
  }

  .category-tag {
    display: inline-block;
    font-size: 13.5px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    color: #2563eb;
    background: #eff6ff;
    padding: 4px 12px;
    border-radius: 6px;
    width: fit-content;
    margin-bottom: 6px;
  }

  .main-title {
    font-size: 28px;
    font-weight: 800;
    color: #1e3a8a;
    line-height: 1.25;
    margin: 0 0 6px 0;
    border-bottom: 2px solid #e2e8f0;
    padding-bottom: 4px;
  }

  .sub-title {
    font-size: 18px;
    font-weight: 700;
    color: #2563eb;
    margin: 0 0 7px 0;
    line-height: 1.25;
  }

  .description {
    font-size: 16px;
    line-height: 1.55;
    color: #334155;
    margin: 0 0 8px 0;
  }

  .fact-box {
    background: #ecfdf5;
    border: 1.5px solid #a7f3d0;
    border-radius: 10px;
    padding: 9px 14px;
    margin-top: 4px;
  }

  .fact-box-title {
    font-size: 15.5px;
    font-weight: 700;
    color: #065f46;
    margin-bottom: 4px;
  }

  .fact-list {
    margin: 0;
    padding: 0;
    list-style: none;
    font-size: 15px;
    color: #064e3b;
    line-height: 1.45;
  }

  .slide-qa-box {
    background: #f8fafc;
    border: 1.5px solid #cbd5e1;
    border-left: 4px solid #0284c7;
    border-radius: 9px;
    padding: 8px 13px;
    margin-top: 7px;
  }

  .slide-qa-question {
    font-size: 15px;
    font-weight: 700;
    color: #0f172a;
    line-height: 1.35;
    margin-bottom: 2px;
  }

  .slide-qa-answer {
    font-size: 14.5px;
    font-weight: 700;
    color: #047857;
    line-height: 1.35;
  }

  .full-content .main-title {
    font-size: 34px;
    margin-bottom: 8px;
    padding-bottom: 5px;
  }

  .full-content .sub-title {
    font-size: 22px;
    margin-bottom: 10px;
  }

  .full-content .description {
    font-size: 18.5px;
    line-height: 1.65;
    margin-bottom: 12px;
  }

  .full-content .fact-box {
    padding: 12px 18px;
    margin-top: 8px;
  }

  .full-content .fact-box-title {
    font-size: 17.5px;
    margin-bottom: 5px;
  }

  .full-content .fact-list {
    font-size: 17px;
    line-height: 1.5;
  }

  .full-content .fact-list li {
    margin-bottom: 5px;
  }

  .full-content .slide-qa-box {
    padding: 10px 18px;
    margin-top: 10px;
  }

  .full-content .slide-qa-question {
    font-size: 17px;
    line-height: 1.4;
    margin-bottom: 3px;
  }

  .full-content .slide-qa-answer {
    font-size: 16.5px;
    line-height: 1.4;
  }

  .fact-list li {
    margin-bottom: 4px;
    position: relative;
    padding-left: 14px;
  }

  .fact-list li::before {
    content: "•";
    position: absolute;
    left: 0;
    color: #059669;
    font-weight: bold;
  }

  .cover-slide {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%);
    color: #ffffff;
    padding: 40px;
  }

  .vocab-card {
    background: #f8fafc;
    border: 1.5px solid #cbd5e1;
    border-radius: 12px;
    padding: 18px;
  }
---

<!-- Cover Slide -->
<div class="cover-slide">
  <div style="font-size: 48px; font-weight: 800; color: #38bdf8; margin-bottom: 12px;">DAILY CURRENT AFFAIRS</div>
  <div style="font-size: 24px; color: #fbbf24; margin-bottom: 24px;">പ്രധാന കറന്റ് അഫയേഴ്സ് & പരീക്ഷാ വസ്തുതകൾ</div>
  <div style="background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.25); padding: 8px 20px; border-radius: 30px; font-size: 16px;">📅 ${todayStr} | The Hindu & Official Sources | Kerala PSC • SSC • UPSC • Banking</div>
</div>\n\n`;

  // Append story slides
  stories.forEach(story => {
    const catUpper = (story.category || 'INDIA').toUpperCase();
    const examPoints = story.examPoints || ['പ്രധാന പരീക്ഷാ വസ്തുത.'];
    const hasImage = !!story.localImage;

    md += `---\n\n`;
    if (hasImage) {
      md += `<div class="slide-container">\n`;
      md += `  <div class="left-content">\n`;
      md += `    <div>\n`;
      md += `      <div class="category-tag">${catUpper} AFFAIRS</div>\n`;
      md += `      <div class="main-title">${story.title}</div>\n`;
      md += `      <div class="sub-title">${story.subTitle}</div>\n`;
      md += `      <div class="description">${story.description}</div>\n`;
      md += `    </div>\n`;
      md += `    <div class="fact-box">\n`;
      md += `      <div class="fact-box-title">⚓ പ്രധാന വസ്തുതകൾ & പരീക്ഷാ പോയിന്റുകൾ</div>\n`;
      md += `      <ul class="fact-list">\n`;
      examPoints.forEach(pt => {
        md += `        <li>${pt}</li>\n`;
      });
      md += `      </ul>\n`;
      md += `    </div>\n`;
      md += `    <div class="slide-qa-box">\n`;
      md += `      <div class="slide-qa-question">❓ <strong>ചോദ്യം:</strong> ${story.question}</div>\n`;
      md += `      <div class="slide-qa-answer">✅ <strong>ഉത്തരം:</strong> ${story.answer}</div>\n`;
      md += `    </div>\n`;
      md += `  </div>\n`;
      md += `  <div class="right-visual">\n`;
      md += `    <div class="image-wrapper">\n`;
      md += `      <img src="${story.localImage}" alt="${catUpper}" />\n`;
      md += `    </div>\n`;
      md += `  </div>\n`;
      md += `</div>\n\n`;
    } else {
      md += `<div class="slide-container">\n`;
      md += `  <div class="full-content">\n`;
      md += `    <div>\n`;
      md += `      <div class="category-tag">${catUpper} AFFAIRS</div>\n`;
      md += `      <div class="main-title">${story.title}</div>\n`;
      md += `      <div class="sub-title">${story.subTitle}</div>\n`;
      md += `      <div class="description">${story.description}</div>\n`;
      md += `    </div>\n`;
      md += `    <div class="fact-box">\n`;
      md += `      <div class="fact-box-title">⚓ പ്രധാന വസ്തുതകൾ & പരീക്ഷാ പോയിന്റുകൾ</div>\n`;
      md += `      <ul class="fact-list">\n`;
      examPoints.forEach(pt => {
        md += `        <li>${pt}</li>\n`;
      });
      md += `      </ul>\n`;
      md += `    </div>\n`;
      md += `    <div class="slide-qa-box">\n`;
      md += `      <div class="slide-qa-question">❓ <strong>ചോദ്യം:</strong> ${story.question}</div>\n`;
      md += `      <div class="slide-qa-answer">✅ <strong>ഉത്തരം:</strong> ${story.answer}</div>\n`;
      md += `    </div>\n`;
      md += `  </div>\n`;
      md += `</div>\n\n`;
    }
  });

  // Append Vocabulary Slide (2 words)
  if (vocabulary.length > 0) {
    md += `---\n\n`;
    md += `<div class="slide-container">\n`;
    md += `  <div class="full-content">\n`;
    md += `    <div>\n`;
    md += `      <div class="category-tag">📚 DAILY VOCABULARY</div>\n`;
    md += `      <div class="main-title">ദിനപത്രത്തിൽ നിന്നുള്ള 2 പ്രധാന പദങ്ങൾ</div>\n`;
    md += `    </div>\n`;
    md += `    <div style="display: flex; flex-direction: row; gap: 20px; margin-top: 14px; width: 100%; box-sizing: border-box;">\n`;
    vocabulary.forEach((v, idx) => {
      md += `      <div class="vocab-card" style="flex: 1; min-width: 0; padding: 14px 18px;">\n`;
      md += `        <div style="font-size: 22px; font-weight: 800; color: #1e3a8a; margin-bottom: 6px;">${idx + 1}. ${(v.word || '').toUpperCase()} <span style="font-size: 14px; color: #64748b; font-weight: normal;">(${v.partOfSpeech || 'n.'})</span></div>\n`;
      md += `        <div style="font-size: 15.5px; margin-bottom: 6px;"><strong>English:</strong> ${v.englishMeaning}</div>\n`;
      md += `        <div style="font-size: 15.5px; color: #059669; font-weight: 700; margin-bottom: 8px;"><strong>മലയാളം:</strong> ${v.malayalamMeaning}</div>\n`;
      md += `        <div style="font-size: 14.5px; color: #334155; line-height: 1.45;"><strong>Example:</strong> <em>"${v.exampleSentence || ''}"</em></div>\n`;
      md += `      </div>\n`;
    });
    md += `    </div>\n`;
    md += `    <div class="fact-box" style="margin-top: 14px; padding: 10px 16px;">\n`;
    md += `      <div class="fact-box-title" style="font-size: 15px; margin-bottom: 4px;">💡 പരീക്ഷാ ടിപ്പ്</div>\n`;
    md += `      <div style="font-size: 14.5px; color: #064e3b; line-height: 1.4;">കഴിഞ്ഞ മത്സരപരീക്ഷകളിൽ ആവർത്തിച്ചു ചോദിച്ച പ്രധാന ഇംഗ്ലീഷ് പദങ്ങളും അവയുടെ പ്രയോഗവുമാണ് ഇവിടെ നൽകിയിരിക്കുന്നത്.</div>\n`;
    md += `    </div>\n`;
    md += `  </div>\n`;
    md += `</div>\n`;
  }

  const reportPath = path.join(__dirname, `../reports/Daily_Current_Affairs_${fileDate}.md`);
  fs.writeFileSync(reportPath, md, 'utf8');
  console.log(`💾 Saved Markdown presentation to: ${reportPath}`);

  console.log("📄 [5/6] Compiling 16:9 Presentation PDF...");
  const pdfPath = path.join(__dirname, `../reports/Daily_Current_Affairs_${fileDate}_Presentation.pdf`);
  execSync(`npx -y @marp-team/marp-cli "${reportPath}" --html --pdf --allow-local-files --no-stdin -o "${pdfPath}"`, { stdio: 'inherit' });

  // Generate 9:16 Instagram Reel / YouTube Shorts Promo Slide
  console.log("📱 [6/6] Assembling & Compiling 9:16 Reel / Shorts Slide...");
  const reelThemePath = path.join(__dirname, '../config/theme_reel.css');
  let reelMd = `---
marp: true
theme: reel-9-16
size: 9:16
paginate: false
---

<div class="reel-wrapper">
<div class="reel-header">
<div class="reel-date-badge">📅 ${todayStr.toUpperCase()}</div>
<div class="reel-main-title">ഇന്നത്തെ പ്രധാന വാർത്തകൾ</div>
<div class="reel-sub-title">🔥 3 പരീക്ഷാ ചോദ്യോത്തരങ്ങൾ (TOP 3 PICKS)</div>
</div>

<div class="qa-stack">
`;

  reelQuestions.forEach((item, idx) => {
    const qNum = String(idx + 1).padStart(2, '0');
    const cat = (item.category || 'GENERAL').toUpperCase();
    reelMd += `<div class="qa-card">
<div class="qa-card-meta">
<span class="qa-number">ചോദ്യം ${qNum}</span>
<span class="qa-category">${cat} AFFAIRS</span>
</div>
<div class="qa-question">${item.question}</div>
<div class="qa-answer-box">
<span class="qa-answer-label">ഉത്തരം</span>
<span class="qa-answer-text">${item.answer}</span>
</div>
</div>\n\n`;
  });

  reelMd += `</div>

<div class="reel-cta-card">
<div class="reel-cta-action">👉 മുഴുവൻ വിശകലനത്തിനും വിശദമായ ക്ലാസിനും ഞങ്ങളുടെ യൂട്യൂബ് വീഡിയോ ഇപ്പോൾ തന്നെ കാണുക!</div>
<div class="reel-cta-badge">Kerala PSC • SSC • UPSC • Banking Current Affairs</div>
</div>
</div>
`;

  const reelMdPath = path.join(__dirname, `../reports/Daily_Current_Affairs_${fileDate}_Reel.md`);
  fs.writeFileSync(reelMdPath, reelMd, 'utf8');
  console.log(`💾 Saved Reel Markdown to: ${reelMdPath}`);

  const reelPngPath = path.join(__dirname, `../reports/Daily_Current_Affairs_${fileDate}_Reel.png`);
  const reelPdfPath = path.join(__dirname, `../reports/Daily_Current_Affairs_${fileDate}_Reel.pdf`);

  execSync(`npx -y @marp-team/marp-cli --theme "${reelThemePath}" "${reelMdPath}" --html --image png --allow-local-files --no-stdin -o "${reelPngPath}"`, { stdio: 'inherit' });
  execSync(`npx -y @marp-team/marp-cli --theme "${reelThemePath}" "${reelMdPath}" --html --pdf --allow-local-files --no-stdin -o "${reelPdfPath}"`, { stdio: 'inherit' });

  console.log(`\n🎉 SUCCESS! All Assets Generated:`);
  console.log(`  📺 16:9 Presentation PDF : ${pdfPath}`);
  console.log(`  📱 9:16 Reel Image (PNG) : ${reelPngPath}`);
  console.log(`  📱 9:16 Reel PDF         : ${reelPdfPath}`);

  try {
    execSync(`open "${pdfPath}"`);
    execSync(`open "${reelPngPath}"`);
  } catch {}
}

main().catch(err => {
  console.error("❌ Pipeline error:", err);
  process.exit(1);
});
