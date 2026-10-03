/**
 * Weekly Kerala Current Affairs MCQ Quiz Competition Generator (16:9 Marp Slides & PDF)
 * 
 * Target Execution: Sunday (Captures news from preceding Monday through Saturday)
 * 
 * Features:
 * - Intelligent Hybrid Loader:
 *   1. Local Weekly Ingestion: Scans `reports/Daily_Current_Affairs_YYYY_MM_DD.md` for Monday-Saturday.
 *   2. Live Date-Filtered Scraping: Google News RSS with `q=Kerala+after:YYYY-MM-DD+before:YYYY-MM-DD`
 *      and The Hindu archives when local files are missing or `--scrape` is passed.
 * - Strict Exam-Oriented Filtering:
 *   * Whitelist: Awards, Schemes/Projects, Health/Medicine, MoUs/International, Kerala PSC GK.
 *   * Strict Rejection: Routine road/train accidents, drownings, domestic crime, partisan political bickering.
 *   * Demise Exception: Strictly for legendary national/state luminaries (Padma, Jnanapeeth, Olympians, former CM/PM).
 * - 5 Structured Competition Rounds:
 *   1. പുരസ്കാരങ്ങൾ & അംഗീകാരങ്ങൾ (Awards & Honors)
 *   2. സർക്കാർ പദ്ധതികൾ & വികസനം (Government Schemes & Infrastructure)
 *   3. ശാസ്ത്രം, ആരോഗ്യം & പുതിയ കണ്ടെത്തലുകൾ (Science, Health & Medicine)
 *   4. കരാറുകൾ & അന്താരാഷ്ട്ര സഹകരണം (Agreements, MoUs & Global Signatures)
 *   5. റാപ്പിഡ് ഫയർ പരീക്ഷാ ചോദ്യങ്ങൾ (Kerala PSC Rapid-Fire GK)
 * - 2-Slide Reveal Mechanism per Question:
 *   * Slide A: Question, 4 distinct options [A], [B], [C], [D], timer badge (⏱️ 15 സെക്കൻഡ്), optional image.
 *   * Slide B: Highlighted answer in vibrant emerald green, detailed exam background GK & nodal agency facts.
 * - Compiles to both 16:9 PDF & Interactive HTML via Marp CLI.
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
const REPORTS_DIR = path.join(__dirname, '../reports');
const IMAGES_DIR = path.join(REPORTS_DIR, 'images');

if (!fs.existsSync(IMAGES_DIR)) {
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
}

// Malayalam month names for elegant date display
const MALAYALAM_MONTHS = [
  'ജനുവരി', 'ഫെബ്രുവരി', 'മാർച്ച്', 'ഏപ്രിൽ', 'മെയ്', 'ജൂൺ',
  'ജൂലൈ', 'ഓഗസ്റ്റ്', 'സെപ്റ്റംബർ', 'ഒക്ടോബർ', 'നവംബർ', 'ഡിസംബർ'
];

// Structure of the 5 Competition Rounds
const ROUNDS_CONFIG = [
  {
    id: 1,
    name: 'പുരസ്കാരങ്ങൾ & അംഗീകാരങ്ങൾ',
    nameEn: 'Awards & Honors',
    badge: '🏆 റൗണ്ട് 1: പുരസ്കാരങ്ങൾ & അംഗീകാരങ്ങൾ',
    color: '#f59e0b',
    icon: '🏆',
    focus: 'Kerala Puraskarangal (Jyothi/Prabha/Sree), Ezhuthachan, Vallathol, Akademi awards, National/State film & literary honors, sports achievements.'
  },
  {
    id: 2,
    name: 'സർക്കാർ പദ്ധതികൾ & വികസനം',
    nameEn: 'Government Schemes & Infrastructure',
    badge: '🏛️ റൗണ്ട് 2: സർക്കാർ പദ്ധതികൾ & വികസനം',
    color: '#2563eb',
    icon: '🏛️',
    focus: 'Kerala welfare schemes, industrial policies, LIFE Mission, K-FON, SilverLine, Vizhinjam port milestones, digital governance, NITI Aayog rankings, GI tags, heritage.'
  },
  {
    id: 3,
    name: 'ശാസ്ത്രം, ആരോഗ്യം & പുതിയ കണ്ടെത്തലുകൾ',
    nameEn: 'Science, Health & Medicine',
    badge: '💉 റൗണ്ട് 3: ശാസ്ത്രം, ആരോഗ്യം & പുതിയ കണ്ടെത്തലുകൾ',
    color: '#059669',
    icon: '💉',
    focus: 'Kerala AMR surveillance, Nipah/zoonotic virus protocols, health policies, public healthcare initiatives (Aardram, K-DISC bio-innovations, space/tech).'
  },
  {
    id: 4,
    name: 'കരാറുകൾ & അന്താരാഷ്ട്ര സഹകരണം',
    nameEn: 'Agreements, MoUs & Global Signatures',
    badge: '🌍 റൗണ്ട് 4: കരാറുകൾ & അന്താരാഷ്ട്ര സഹകരണം',
    color: '#7c3aed',
    icon: '🌍',
    focus: 'Bilateral MoUs, World Bank/ADB funding for Kerala, international climate summits, inter-state river water & transport transit agreements.'
  },
  {
    id: 5,
    name: 'റാപ്പിഡ് ഫയർ പരീക്ഷാ ചോദ്യങ്ങൾ',
    nameEn: 'Kerala PSC Rapid-Fire GK',
    badge: '⚡ റൗണ്ട് 5: റാപ്പിഡ് ഫയർ പരീക്ഷാ ചോദ്യങ്ങൾ',
    color: '#dc2626',
    icon: '⚡',
    focus: 'High-yield Kerala PSC & UPSC competitive exam GK directly linked to this week\'s news (constitutions, commissions, ministries, key dates, historical GK).'
  }
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

// Helper: Normalize official terms to English to avoid awkward Malayalam phonetic spelling mistakes
function normalizeEnglishTerms(text) {
  if (!text || typeof text !== 'string') return '';
  let res = text;
  for (const [regex, replacement] of ENGLISH_TERM_REPLACEMENTS) {
    res = res.replace(regex, replacement);
  }
  return res;
}

// Helper: Strip HTML, unescape common entities, and normalize English proper nouns
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

// Format date into Malayalam string e.g. "14 സെപ്റ്റംബർ 2026"
function formatMalayalamDate(dateObj) {
  const day = dateObj.getUTCDate();
  const month = MALAYALAM_MONTHS[dateObj.getUTCMonth()];
  const year = dateObj.getUTCFullYear();
  return `${day} ${month} ${year}`;
}

// Compute previous Monday through Saturday given a target date
function calculateWeekRange(targetDateStr) {
  let target;
  if (targetDateStr) {
    const parts = targetDateStr.split('-').map(Number);
    target = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]));
  } else {
    const now = new Date();
    target = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
  }

  const day = target.getUTCDay(); // 0 is Sunday, 1 is Monday ... 6 is Saturday
  let sunday;
  if (day === 0) {
    sunday = new Date(target);
  } else {
    // If not Sunday, default to the previous completed Sunday
    sunday = new Date(target.getTime() - day * 24 * 60 * 60 * 1000);
  }

  const saturday = new Date(sunday.getTime() - 1 * 24 * 60 * 60 * 1000);
  const monday = new Date(sunday.getTime() - 6 * 24 * 60 * 60 * 1000);

  const fmt = d => d.toISOString().split('T')[0];
  const listDays = [];
  let curr = new Date(monday);
  while (curr <= saturday) {
    listDays.push(fmt(curr));
    curr = new Date(curr.getTime() + 24 * 60 * 60 * 1000);
  }

  return {
    monday: fmt(monday),
    saturday: fmt(saturday),
    sunday: fmt(sunday),
    days: listDays,
    mondayDate: monday,
    saturdayDate: saturday,
    sundayDate: sunday
  };
}

// Filter out routine accidents, ordinary demises, and partisan fights
function isExcludedNews(title, desc = '') {
  const text = `${title} ${desc}`.toLowerCase();

  // Routine accidents (road, train, car, bus, lorry, drowning)
  const routineAccidentPattern = /\b(killed in road accident|road accident|car crash|car collision|lorry collision|truck collision|collides with lorry|dies in mishap|drowns in|drowned|electrocuted|falls to death|hit by train|bus plunges|bus accident|bike accident|vehicle falls)\b/i;

  // Prominent figure indicators (demise exception strictly for competitive exams)
  const prominentFigurePattern = /\b(former president|former prime minister|prime minister|chief minister|union minister|governor|supreme court judge|chief justice|nobel|bharat ratna|padma|sahitya akademi|jnanapeeth|olympian|grandmaster|world champion|veteran author|noted writer|veteran politician|eminent scientist)\b/i;

  if (routineAccidentPattern.test(text) && !prominentFigurePattern.test(text)) {
    return true;
  }

  // Ordinary private citizen deaths
  const ordinaryDeathPattern = /\b(found dead|suicide|dies of cardiac arrest at home|body fished out|student dies|students die|youths die|youth dies|two youths drowned)\b/i;
  if (ordinaryDeathPattern.test(text) && !prominentFigurePattern.test(text)) {
    return true;
  }

  // Partisan political mudslinging lacking legislative or policy substance
  const pettyPoliticalPattern = /\b(flays|hits back at|slams opponent|mud-slinging|alleges conspiracy|workers clash|activists clash|sloganeering|bickering|trade charges|demands resignation|protest march)\b/i;
  if (pettyPoliticalPattern.test(text)) {
    return true;
  }

  return false;
}

// Download image locally to reports/images/
async function downloadImageLocally(imgUrl, filename) {
  if (!imgUrl) return null;
  const localPath = path.join(IMAGES_DIR, filename);
  if (fs.existsSync(localPath)) {
    return `./images/${filename}`;
  }
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

// Generic placeholder / brand logo detector
function isGenericPlaceholderImage(imgUrl) {
  if (!imgUrl || typeof imgUrl !== 'string') return true;
  const lower = imgUrl.toLowerCase();
  const blacklistedKeywords = [
    'og-image', 'thehindu-logo', 'thehindu_logo', 'the_hindu_logo',
    'th-logo', 'th-online', 'default_image', 'placeholder',
    'favicon', 'site-logo', 'brand-logo', 'crest', 'google'
  ];
  return blacklistedKeywords.some(keyword => lower.includes(keyword));
}

// Extract og:image from article page if missing
async function fetchOgImage(articleUrl) {
  if (!articleUrl || !articleUrl.startsWith('http')) return null;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);
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

// Technique 1: Parse local daily markdown reports for date range
function parseLocalDailyReports(datesList) {
  const stories = [];
  const foundDays = [];
  const missingDays = [];

  for (const dateStr of datesList) {
    const fileDate = dateStr.replace(/-/g, '_');
    const filePath = path.join(REPORTS_DIR, `Daily_Current_Affairs_${fileDate}.md`);

    if (fs.existsSync(filePath)) {
      foundDays.push(dateStr);
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        const slides = content.split(/\n---\n/);

        for (const slide of slides) {
          const catMatch = slide.match(/<div class="category-tag">([^<]+)<\/div>/i);
          const titleMatch = slide.match(/<div class="main-title"[^>]*>([\s\S]*?)<\/div>/i);
          const subTitleMatch = slide.match(/<div class="sub-title"[^>]*>([\s\S]*?)<\/div>/i);
          const descMatch = slide.match(/<div class="description"[^>]*>([\s\S]*?)<\/div>/i);
          const imgMatch = slide.match(/<img src="([^"]+)"/i);
          const qMatch = slide.match(/<div class="slide-qa-question"[^>]*>([\s\S]*?)<\/div>/i);
          const aMatch = slide.match(/<div class="slide-qa-answer"[^>]*>([\s\S]*?)<\/div>/i);

          const factMatches = [];
          const liRegex = /<li>([\s\S]*?)<\/li>/gi;
          let m;
          while ((m = liRegex.exec(slide)) !== null) {
            factMatches.push(cleanText(m[1]));
          }

          if (titleMatch) {
            const title = cleanText(titleMatch[1]);
            const subTitle = subTitleMatch ? cleanText(subTitleMatch[1]) : '';
            const description = descMatch ? cleanText(descMatch[1]) : '';
            const category = catMatch ? catMatch[1].trim() : 'GENERAL';

            if (!isExcludedNews(title, description)) {
              stories.push({
                date: dateStr,
                source: 'local_report',
                category,
                title,
                subTitle,
                description,
                facts: factMatches,
                question: qMatch ? cleanText(qMatch[1]).replace(/^.*ചോദ്യം:\s*/i, '') : '',
                answer: aMatch ? cleanText(aMatch[1]).replace(/^.*ഉത്തരം:\s*/i, '') : '',
                image: imgMatch ? imgMatch[1].trim() : null
              });
            }
          }
        }
      } catch (err) {
        console.warn(`⚠️ Error reading ${filePath}: ${err.message}`);
      }
    } else {
      missingDays.push(dateStr);
    }
  }

  return { stories, foundDays, missingDays };
}

// Technique 2: Live date-range news scraping via Google News RSS & The Hindu
async function scrapeLiveDateRange(startDateStr, endDateStr) {
  console.log(`🌐 Live Scraping: Querying Google News RSS for date window [${startDateStr} to ${endDateStr}]...`);

  // Calculate day after endDate for inclusive Google News query syntax
  const endParts = endDateStr.split('-').map(Number);
  const endObj = new Date(Date.UTC(endParts[0], endParts[1] - 1, endParts[2]));
  const dayAfterEnd = new Date(endObj.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const queries = [
    `Kerala after:${startDateStr} before:${dayAfterEnd}`,
    `Kerala government award scheme project after:${startDateStr} before:${dayAfterEnd}`,
    `The Hindu Kerala after:${startDateStr} before:${dayAfterEnd}`
  ];

  const scrapedItems = [];

  for (const q of queries) {
    const encoded = encodeURIComponent(q);
    const feedUrl = `https://news.google.com/rss/search?q=${encoded}&hl=en-IN&gl=IN&ceid=IN:en`;

    try {
      const res = await fetch(feedUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)' }
      });
      if (!res.ok) continue;
      const xml = await res.text();
      const items = xml.match(/<item[\s\S]*?<\/item>/gi) || [];

      for (const itemXml of items) {
        const titleMatch = itemXml.match(/<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/i);
        const linkMatch = itemXml.match(/<link>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/link>/i);
        const descMatch = itemXml.match(/<description>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/i);
        const pubDateMatch = itemXml.match(/<pubDate>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/pubDate>/i);

        const title = cleanText(titleMatch ? titleMatch[1] : '');
        const link = (linkMatch ? linkMatch[1] : '').trim();
        const description = cleanText(descMatch ? descMatch[1] : '');
        const rawPubDate = pubDateMatch ? pubDateMatch[1] : '';

        if (title && link && !isExcludedNews(title, description)) {
          scrapedItems.push({
            date: rawPubDate ? new Date(rawPubDate).toISOString().split('T')[0] : startDateStr,
            source: 'google_news_rss',
            category: 'KERALA',
            title,
            subTitle: '',
            description: description.substring(0, 400),
            facts: [],
            question: '',
            answer: '',
            image: null,
            link
          });
        }
      }
    } catch (e) {
      console.warn(`⚠️ Warning scraping query "${q}": ${e.message}`);
    }
  }

  // Deduplicate scraped items
  const seen = new Set();
  const unique = [];
  for (const item of scrapedItems) {
    const slug = item.title.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 35);
    if (!seen.has(slug)) {
      seen.add(slug);
      unique.push(item);
    }
  }

  console.log(`📡 Fetched ${unique.length} live articles from Google News RSS for ${startDateStr} to ${endDateStr}.`);
  return unique;
}

// Clean and robustly parse JSON from Gemini LLM output
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

// Call Google Gemini API with responseSchema & automatic model fallback
async function callGemini(prompt) {
  const models = [
    'gemini-3.5-flash-lite',
    'gemini-3.5-flash',
    'gemini-3.6-flash',
    'gemini-3.7-flash',
    'gemini-3.8-flash',
    'gemini-3.1-flash-lite'
  ];

  const responseSchema = {
    type: "OBJECT",
    properties: {
      questions: {
        type: "ARRAY",
        items: {
          type: "OBJECT",
          properties: {
            roundId: { type: "INTEGER" },
            storyRefId: { type: "INTEGER" },
            question: { type: "STRING" },
            options: {
              type: "ARRAY",
              items: { type: "STRING" }
            },
            correctOption: {
              type: "STRING",
              enum: ["A", "B", "C", "D"]
            },
            explanation: { type: "STRING" },
            nodalAgency: { type: "STRING" },
            examKeyFacts: {
              type: "ARRAY",
              items: { type: "STRING" }
            }
          },
          required: [
            "roundId",
            "question",
            "options",
            "correctOption",
            "explanation",
            "nodalAgency",
            "examKeyFacts"
          ]
        }
      }
    },
    required: ["questions"]
  };

  let lastError = null;
  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
      const response = await fetch(url, {
        method: 'POST',
        signal: AbortSignal.timeout(60000),
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 8192,
            responseMimeType: 'application/json',
            responseSchema: responseSchema
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
        return cleanAndParseJson(text);
      } else {
        const errText = await response.text();
        console.warn(`⚠️ [${model}] returned ${response.status}: ${errText.substring(0, 70)}...`);
        lastError = new Error(`${model} Error: ${response.status}`);
        // Small backoff before next model
        await new Promise(r => setTimeout(r, 1500));
      }
    } catch (e) {
      console.warn(`⚠️ [${model}] failed (${e.message})... trying next`);
      lastError = e;
      await new Promise(r => setTimeout(r, 1000));
    }
  }
  throw lastError || new Error("All Gemini models failed");
}

// Helper: Sanitize option text by removing duplicate option letters (e.g. "A) text" -> "text")
function sanitizeOptionText(raw) {
  if (!raw || typeof raw !== 'string') return '';
  return cleanText(raw)
    .replace(/^[A-Da-d][\)\.\:\-]\s*/, '')
    .replace(/^\[[A-Da-d]\]\s*/, '')
    .trim();
}

// Generate the Marp Markdown presentation
function generateMarpMarkdown(quizData, dateRangeInfo, totalQuestions) {
  const startMalayalam = formatMalayalamDate(dateRangeInfo.mondayDate);
  const endMalayalam = formatMalayalamDate(dateRangeInfo.saturdayDate);
  const displayRange = `${startMalayalam} – ${endMalayalam}`;

  let md = `---
marp: true
theme: default
size: 16:9
paginate: false
style: |
  @import url('https://fonts.googleapis.com/css2?family=Manjari:wght@400;700&family=Noto+Sans+Malayalam:wght@400;600;700;800&family=Outfit:wght@400;600;700;800&display=swap');

  section {
    font-family: 'Noto Sans Malayalam', 'Outfit', 'Manjari', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    padding: 0;
    margin: 0;
    background: #0f172a;
    color: #1e293b;
    width: 1280px;
    height: 720px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .cover-slide {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    background: linear-gradient(135deg, #090d16 0%, #1e1b4b 55%, #0f172a 100%);
    color: #ffffff;
    padding: 40px;
    box-sizing: border-box;
    position: relative;
  }

  .cover-badge {
    background: rgba(245, 158, 11, 0.18);
    border: 1.5px solid #f59e0b;
    color: #fbbf24;
    padding: 6px 20px;
    border-radius: 30px;
    font-size: 15px;
    font-weight: 700;
    letter-spacing: 1px;
    margin-bottom: 16px;
    text-transform: uppercase;
  }

  .cover-title {
    font-size: 52px;
    font-weight: 800;
    line-height: 1.15;
    background: linear-gradient(to right, #38bdf8, #818cf8, #f472b6);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 12px;
  }

  .cover-subtitle {
    font-size: 26px;
    font-weight: 700;
    color: #f8fafc;
    margin-bottom: 24px;
  }

  .cover-pill-box {
    display: flex;
    gap: 16px;
    margin-top: 10px;
  }

  .cover-pill {
    background: rgba(255, 255, 255, 0.12);
    border: 1px solid rgba(255, 255, 255, 0.25);
    padding: 8px 22px;
    border-radius: 30px;
    font-size: 15.5px;
    color: #e2e8f0;
  }

  .quiz-slide {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    padding: 26px 44px 22px 44px;
    box-sizing: border-box;
    background: #ffffff;
    color: #1e293b;
    position: relative;
  }

  .quiz-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 2px solid #e2e8f0;
    padding-bottom: 10px;
    margin-bottom: 14px;
  }

  .round-pill {
    background: #eff6ff;
    color: #1d4ed8;
    border: 1.5px solid #bfdbfe;
    padding: 5px 16px;
    border-radius: 20px;
    font-size: 14px;
    font-weight: 700;
  }

  .qnum-pill {
    background: #f8fafc;
    color: #0f172a;
    border: 1.5px solid #cbd5e1;
    padding: 5px 16px;
    border-radius: 20px;
    font-size: 14px;
    font-weight: 800;
    letter-spacing: 0.5px;
  }

  .timer-pill {
    background: #fef2f2;
    color: #dc2626;
    border: 1.5px solid #fecaca;
    padding: 5px 16px;
    border-radius: 20px;
    font-size: 14px;
    font-weight: 800;
  }

  .answer-status-pill {
    background: #ecfdf5;
    color: #059669;
    border: 1.5px solid #a7f3d0;
    padding: 5px 16px;
    border-radius: 20px;
    font-size: 14px;
    font-weight: 800;
  }

  .question-box {
    background: #f8fafc;
    border: 1.5px solid #cbd5e1;
    border-left: 6px solid #2563eb;
    border-radius: 12px;
    padding: 14px 20px;
    margin-bottom: 16px;
  }

  .question-text {
    font-size: 21.5px;
    font-weight: 700;
    line-height: 1.45;
    color: #0f172a;
  }

  .options-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
    margin-top: 4px;
  }

  .option-card {
    background: #ffffff;
    border: 2px solid #e2e8f0;
    border-radius: 12px;
    padding: 12px 18px;
    display: flex;
    align-items: center;
    gap: 14px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.03);
  }

  .option-letter {
    color: #ffffff;
    width: 32px;
    height: 32px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 800;
    font-size: 15px;
    flex-shrink: 0;
  }

  .option-letter-A { background: #2563eb; }
  .option-letter-B { background: #7c3aed; }
  .option-letter-C { background: #059669; }
  .option-letter-D { background: #d97706; }

  .option-text {
    font-size: 16px;
    font-weight: 600;
    color: #334155;
    line-height: 1.35;
  }

  .answer-highlight-box {
    background: #ecfdf5;
    border: 2.5px solid #10b981;
    border-radius: 12px;
    padding: 14px 20px;
    margin-bottom: 14px;
    display: flex;
    align-items: center;
    gap: 14px;
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.15);
  }

  .answer-badge-icon {
    background: #059669;
    color: #ffffff;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    font-weight: bold;
    flex-shrink: 0;
  }

  .answer-title-text {
    font-size: 21px;
    font-weight: 800;
    color: #065f46;
    line-height: 1.35;
  }

  .facts-panel {
    background: #f8fafc;
    border: 1.5px solid #cbd5e1;
    border-radius: 12px;
    padding: 14px 20px;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  }

  .facts-header {
    font-size: 15px;
    font-weight: 800;
    color: #1e3a8a;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .facts-list {
    margin: 0;
    padding: 0;
    list-style: none;
    font-size: 14.5px;
    color: #334155;
    line-height: 1.5;
  }

  .facts-list li {
    margin-bottom: 6px;
    position: relative;
    padding-left: 18px;
  }

  .facts-list li::before {
    content: "📌";
    position: absolute;
    left: 0;
    font-size: 12px;
    top: 2px;
  }

  .split-container {
    display: flex;
    width: 100%;
    height: calc(100% - 60px);
    gap: 24px;
  }

  .split-left {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .split-right {
    width: 320px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #0f172a;
    border-radius: 12px;
    padding: 16px;
    box-sizing: border-box;
    overflow: hidden;
  }

  .split-right img {
    max-width: 100%;
    max-height: 480px;
    object-fit: contain;
    border-radius: 8px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
  }

  .rules-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-top: 24px;
    width: 100%;
    max-width: 1100px;
  }

  .rules-card {
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 12px;
    padding: 18px 24px;
    text-align: left;
  }

  .rules-card-title {
    font-size: 18px;
    font-weight: 700;
    color: #38bdf8;
    margin-bottom: 8px;
  }

  .rules-card-text {
    font-size: 14.5px;
    color: #cbd5e1;
    line-height: 1.5;
  }
---

<!-- Cover Slide -->
<div class="cover-slide">
  <div class="cover-badge">🏆 WEEKLY MEGA QUIZ COMPETITION • KERALA PSC & UPSC</div>
  <div class="cover-title">WEEKLY KERALA CURRENT AFFAIRS</div>
  <div class="cover-subtitle">പ്രതിവാര കറന്റ് അഫയേഴ്സ് മെഗാ ക്വിസ് മത്സരം</div>
  <div class="cover-pill-box">
    <div class="cover-pill">📅 ${displayRange}</div>
    <div class="cover-pill">🎯 ${totalQuestions} ചോദ്യങ്ങൾ • 5 റൗണ്ടുകൾ</div>
    <div class="cover-pill">⏱️ 15 സെക്കൻഡ് ടൈമർ</div>
  </div>
  <div style="margin-top: 30px; font-size: 14.5px; color: #94a3b8;">
    The Hindu • PRD Kerala • Kerala State Portals | മത്സരപരീക്ഷാ പ്രത്യേക പതിപ്പ്
  </div>
</div>

---

<!-- Rules & Structure Slide -->
<div class="cover-slide" style="justify-content: flex-start; padding-top: 50px;">
  <div style="font-size: 34px; font-weight: 800; color: #38bdf8; margin-bottom: 8px;">📋 മത്സര ഘടന & നിർദ്ദേശങ്ങൾ</div>
  <div style="font-size: 17px; color: #e2e8f0; margin-bottom: 10px;">5 പ്രധാന റൗണ്ടുകളിലായി ഈ ആഴ്ചയിലെ ഏറ്റവും പ്രധാനപ്പെട്ട കറന്റ് അഫയേഴ്സ് ചോദ്യങ്ങൾ</div>
  
  <div class="rules-grid">
    <div class="rules-card">
      <div class="rules-card-title">🏆 5 പ്രത്യേക റൗണ്ടുകൾ</div>
      <div class="rules-card-text">
        1. പുരസ്കാരങ്ങൾ & അംഗീകാരങ്ങൾ<br/>
        2. സർക്കാർ പദ്ധതികൾ & വികസനം<br/>
        3. ശാസ്ത്രം, ആരോഗ്യം & പുതിയ കണ്ടെത്തലുകൾ<br/>
        4. കരാറുകൾ & അന്താരാഷ്ട്ര സഹകരണം<br/>
        5. റാപ്പിഡ് ഫയർ പരീക്ഷാ ചോദ്യങ്ങൾ
      </div>
    </div>
    <div class="rules-card">
      <div class="rules-card-title">⏱️ സമയക്രമം & സ്കോറിംഗ്</div>
      <div class="rules-card-text">
        • ഓരോ ചോദ്യത്തിനും ആലോചിക്കാൻ <strong>15 സെക്കൻഡ്</strong> സമയം.<br/>
        • ഓരോ ശരിയുത്തരത്തിനും <strong>+2 മാർക്ക്</strong>.<br/>
        • അടുത്ത സ്ലൈഡിൽ ശരിയുത്തരവും പരീക്ഷയ്ക്ക് ആവശ്യമായ പ്രധാന അനുബന്ധ വിവരങ്ങളും ലഭ്യമാണ്.
      </div>
    </div>
  </div>

  <div style="margin-top: 36px; background: rgba(16, 185, 129, 0.2); border: 1.5px solid #10b981; border-radius: 30px; padding: 10px 32px; font-size: 16px; color: #6ee7b7; font-weight: 700;">
    👉 പേപ്പറും പേനയും തയ്യാറാക്കി നിങ്ങളുടെ ഉത്തരങ്ങൾ കുറിച്ചുവെക്കൂ! All the Best!
  </div>
</div>
`;

  // Render Questions across the rounds
  const questions = quizData.questions || [];
  questions.forEach((q, idx) => {
    const qNum = String(idx + 1).padStart(2, '0');
    const totalNum = String(totalQuestions).padStart(2, '0');
    const roundConfig = ROUNDS_CONFIG.find(r => r.id === q.roundId) || ROUNDS_CONFIG[0];
    const hasImage = !!q.localImage;

    const optLetters = ['A', 'B', 'C', 'D'];
    const optLabels = (q.options || []).map((text, oIdx) => ({
      letter: optLetters[oIdx],
      text: sanitizeOptionText(text)
    }));

    const correctLetter = q.correctOption || 'A';
    const correctText = optLabels.find(o => o.letter === correctLetter)?.text || sanitizeOptionText(q.options?.[0] || '');
    const cleanQuestion = normalizeEnglishTerms(q.question);
    const cleanExplanation = normalizeEnglishTerms(q.explanation);

    // SLIDE A: Question Slide
    md += `\n---\n\n`;
    md += `<div class="quiz-slide">\n`;
    md += `  <div class="quiz-header">\n`;
    md += `    <div class="round-pill">${roundConfig.badge}</div>\n`;
    md += `    <div class="qnum-pill">🎯 ചോദ്യം ${qNum} / ${totalNum}</div>\n`;
    md += `    <div class="timer-pill">⏱️ 15 സെക്കൻഡ്</div>\n`;
    md += `  </div>\n`;

    if (hasImage) {
      md += `  <div class="split-container">\n`;
      md += `    <div class="split-left">\n`;
      md += `      <div class="question-box">\n`;
      md += `        <div class="question-text">${cleanQuestion}</div>\n`;
      md += `      </div>\n`;
      md += `      <div class="options-grid" style="grid-template-columns: 1fr;">\n`;
      optLabels.forEach(opt => {
        md += `        <div class="option-card"><div class="option-letter option-letter-${opt.letter}">${opt.letter}</div><div class="option-text">${opt.text}</div></div>\n`;
      });
      md += `      </div>\n`;
      md += `    </div>\n`;
      md += `    <div class="split-right">\n`;
      md += `      <img src="${q.localImage}" alt="${roundConfig.nameEn}" />\n`;
      md += `    </div>\n`;
      md += `  </div>\n`;
    } else {
      md += `  <div class="question-box">\n`;
      md += `    <div class="question-text">${cleanQuestion}</div>\n`;
      md += `  </div>\n`;
      md += `  <div class="options-grid">\n`;
      optLabels.forEach(opt => {
        md += `    <div class="option-card"><div class="option-letter option-letter-${opt.letter}">${opt.letter}</div><div class="option-text">${opt.text}</div></div>\n`;
      });
      md += `  </div>\n`;
    }
    md += `</div>\n`;

    // SLIDE B: Answer Reveal Slide
    md += `\n---\n\n`;
    md += `<div class="quiz-slide">\n`;
    md += `  <div class="quiz-header">\n`;
    md += `    <div class="round-pill">${roundConfig.badge}</div>\n`;
    md += `    <div class="qnum-pill">🎯 ഉത്തരം - ചോദ്യം ${qNum} / ${totalNum}</div>\n`;
    md += `    <div class="answer-status-pill">✅ ശരിയുത്തരം / ANSWER REVEAL</div>\n`;
    md += `  </div>\n`;

    const factsList = (q.examKeyFacts || []).map(normalizeEnglishTerms);
    if (q.nodalAgency && !factsList.some(f => f.includes(q.nodalAgency))) {
      factsList.unshift(`നോഡൽ ഏജൻസി / വകുപ്പ്: ${normalizeEnglishTerms(q.nodalAgency)}`);
    }

    if (hasImage) {
      md += `  <div class="split-container">\n`;
      md += `    <div class="split-left">\n`;
      md += `      <div class="answer-highlight-box">\n`;
      md += `        <div class="answer-badge-icon">✓</div>\n`;
      md += `        <div class="answer-title-text">[${correctLetter}] ${correctText}</div>\n`;
      md += `      </div>\n`;
      md += `      <div class="facts-panel">\n`;
      md += `        <div class="facts-header">⚓ പരീക്ഷാ പോയിന്റുകൾ & വസ്തുതകൾ</div>\n`;
      md += `        <div style="font-size: 14.5px; color: #334155; margin-bottom: 8px; line-height: 1.45;"><strong>വിശദീകരണം:</strong> ${cleanExplanation}</div>\n`;
      md += `        <ul class="facts-list">\n`;
      factsList.forEach(pt => {
        md += `          <li>${pt}</li>\n`;
      });
      md += `        </ul>\n`;
      md += `      </div>\n`;
      md += `    </div>\n`;
      md += `    <div class="split-right">\n`;
      md += `      <img src="${q.localImage}" alt="${roundConfig.nameEn}" />\n`;
      md += `    </div>\n`;
      md += `  </div>\n`;
    } else {
      md += `  <div class="answer-highlight-box">\n`;
      md += `    <div class="answer-badge-icon">✓</div>\n`;
      md += `    <div class="answer-title-text">[${correctLetter}] ${correctText}</div>\n`;
      md += `  </div>\n`;
      md += `  <div class="facts-panel">\n`;
      md += `    <div class="facts-header">⚓ പരീക്ഷാ പോയിന്റുകൾ & വസ്തുതകൾ (FACTS TO REMEMBER)</div>\n`;
      md += `    <div style="font-size: 15.5px; color: #1e293b; margin-bottom: 10px; line-height: 1.5;"><strong>വിശദീകരണം:</strong> ${cleanExplanation}</div>\n`;
      md += `    <ul class="facts-list">\n`;
      factsList.forEach(pt => {
        md += `      <li>${pt}</li>\n`;
      });
      md += `    </ul>\n`;
      md += `  </div>\n`;
    }
    md += `</div>\n`;
  });

  // Final Slide: Scoreboard & Summary
  md += `\n---\n\n`;
  md += `<div class="cover-slide" style="justify-content: center;">\n`;
  md += `  <div class="cover-badge" style="background: rgba(16, 185, 129, 0.2); border-color: #10b981; color: #6ee7b7;">🎉 QUIZ COMPETITION COMPLETED</div>\n`;
  md += `  <div class="cover-title" style="font-size: 44px; margin-bottom: 8px;">സ്കോർ ബോർഡ് & അഭിനന്ദനങ്ങൾ!</div>\n`;
  md += `  <div style="font-size: 20px; color: #e2e8f0; margin-bottom: 24px;">നിങ്ങളുടെ ആകെ സ്കോർ എത്രയാണെന്ന് സ്വയം വിലയിരുത്തൂ</div>\n`;
  
  md += `  <div style="display: flex; gap: 20px; width: 100%; max-width: 960px; justify-content: center; margin-bottom: 24px;">\n`;
  md += `    <div style="background: rgba(255, 255, 255, 0.08); border: 1.5px solid #10b981; border-radius: 12px; padding: 16px 20px; flex: 1; text-align: center;">\n`;
  md += `      <div style="font-size: 24px; font-weight: 800; color: #6ee7b7;">26 - 30 Marks</div>\n`;
  md += `      <div style="font-size: 14px; color: #f8fafc; margin-top: 4px; font-weight: 700;">🌟 Outstanding!</div>\n`;
  md += `      <div style="font-size: 12.5px; color: #cbd5e1; margin-top: 2px;">Kerala PSC Rank Maker Level</div>\n`;
  md += `    </div>\n`;
  md += `    <div style="background: rgba(255, 255, 255, 0.08); border: 1.5px solid #38bdf8; border-radius: 12px; padding: 16px 20px; flex: 1; text-align: center;">\n`;
  md += `      <div style="font-size: 24px; font-weight: 800; color: #38bdf8;">20 - 24 Marks</div>\n`;
  md += `      <div style="font-size: 14px; color: #f8fafc; margin-top: 4px; font-weight: 700;">👏 Excellent!</div>\n`;
  md += `      <div style="font-size: 12.5px; color: #cbd5e1; margin-top: 2px;">Strong Weekly Preparation</div>\n`;
  md += `    </div>\n`;
  md += `    <div style="background: rgba(255, 255, 255, 0.08); border: 1.5px solid #f59e0b; border-radius: 12px; padding: 16px 20px; flex: 1; text-align: center;">\n`;
  md += `      <div style="font-size: 24px; font-weight: 800; color: #fbbf24;">Below 20 Marks</div>\n`;
  md += `      <div style="font-size: 14px; color: #f8fafc; margin-top: 4px; font-weight: 700;">📚 Need Revision!</div>\n`;
  md += `      <div style="font-size: 12.5px; color: #cbd5e1; margin-top: 2px;">Revise Daily Affairs Slides</div>\n`;
  md += `    </div>\n`;
  md += `  </div>\n`;

  md += `  <div style="background: rgba(255, 255, 255, 0.1); border-radius: 30px; padding: 8px 26px; font-size: 15px; color: #e2e8f0;">\n`;
  md += `    💡 <strong>പരീക്ഷാ ടിപ്പ്:</strong> അടുത്ത ആഴ്ചയിലെ ക്വിസിനായി ഓരോ ദിവസത്തെയും പ്രഭാത പതിപ്പ് കറന്റ് അഫയേഴ്സ് കൃത്യമായി വായിക്കുക!\n`;
  md += `  </div>\n`;
  md += `</div>\n`;

  return md;
}

// Main execution function
async function main() {
  const args = process.argv.slice(2);
  let targetDate = null;
  let startDateArg = null;
  let endDateArg = null;
  let questionCount = 15;
  let forceScrape = false;
  let noOpen = false;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--date' && args[i + 1]) {
      targetDate = args[i + 1];
      i++;
    } else if (args[i] === '--start' && args[i + 1]) {
      startDateArg = args[i + 1];
      i++;
    } else if (args[i] === '--end' && args[i + 1]) {
      endDateArg = args[i + 1];
      i++;
    } else if (args[i] === '--count' && args[i + 1]) {
      questionCount = parseInt(args[i + 1], 10) || 15;
      i++;
    } else if (args[i] === '--scrape') {
      forceScrape = true;
    } else if (args[i] === '--no-open') {
      noOpen = true;
    } else if (!args[i].startsWith('--') && !targetDate) {
      targetDate = args[i];
    }
  }

  console.log(`\n=============================================================`);
  console.log(`🏆 WEEKLY KERALA CURRENT AFFAIRS QUIZ COMPETITION GENERATOR`);
  console.log(`=============================================================`);

  // Step 1: Calculate Date Window
  console.log(`\n📅 [1/6] Computing Weekly News Date Window...`);
  let dateRangeInfo;
  if (startDateArg && endDateArg) {
    const listDays = [];
    let curr = new Date(startDateArg + 'T00:00:00Z');
    const end = new Date(endDateArg + 'T00:00:00Z');
    while (curr <= end) {
      listDays.push(curr.toISOString().split('T')[0]);
      curr = new Date(curr.getTime() + 24 * 60 * 60 * 1000);
    }
    dateRangeInfo = {
      monday: startDateArg,
      saturday: endDateArg,
      sunday: endDateArg,
      days: listDays,
      mondayDate: new Date(startDateArg + 'T00:00:00Z'),
      saturdayDate: new Date(endDateArg + 'T00:00:00Z'),
      sundayDate: new Date(endDateArg + 'T00:00:00Z')
    };
  } else {
    dateRangeInfo = calculateWeekRange(targetDate);
  }

  const startMal = formatMalayalamDate(dateRangeInfo.mondayDate);
  const endMal = formatMalayalamDate(dateRangeInfo.saturdayDate);
  console.log(`  🎯 Target Date Range : ${dateRangeInfo.monday} to ${dateRangeInfo.saturday} (${startMal} – ${endMal})`);
  console.log(`  🎯 Days Included     : ${dateRangeInfo.days.join(', ')}`);
  console.log(`  🎯 Question Count    : ${questionCount} MCQs across 5 Rounds`);

  // Step 2: Intelligent Hybrid Ingestion
  console.log(`\n📥 [2/6] Running Intelligent Hybrid News Ingestion...`);
  const localResult = parseLocalDailyReports(dateRangeInfo.days);
  console.log(`  📂 Local Reports Scanned:`);
  console.log(`     - Found days   : ${localResult.foundDays.length > 0 ? localResult.foundDays.join(', ') : 'None'}`);
  console.log(`     - Missing days : ${localResult.missingDays.length > 0 ? localResult.missingDays.join(', ') : 'None'}`);
  console.log(`     - Stories read : ${localResult.stories.length} verified exam stories`);

  let allStories = [...localResult.stories];

  // If local stories are insufficient, or missing days exist, or --scrape is forced:
  if (forceScrape || localResult.missingDays.length > 0 || allStories.length < 15) {
    if (forceScrape) {
      console.log(`  ⚡ Force scrape flag (--scrape) is active.`);
    } else if (localResult.missingDays.length > 0) {
      console.log(`  ⚠️ Missing ${localResult.missingDays.length} days in local reports. Triggering live date-range fallback...`);
    } else {
      console.log(`  ℹ️ Insufficient local stories (${allStories.length}). Supplementing with live date scraping...`);
    }

    const scraped = await scrapeLiveDateRange(dateRangeInfo.monday, dateRangeInfo.saturday);
    allStories = allStories.concat(scraped);
  }

  // Deduplicate all combined stories
  const seenStories = new Set();
  const dedupedStories = [];
  for (const s of allStories) {
    const slug = s.title.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 35);
    if (!seenStories.has(slug)) {
      seenStories.add(slug);
      dedupedStories.push(s);
    }
  }

  console.log(`  ✨ Total Ingested & De-duplicated Stories: ${dedupedStories.length}`);

  if (dedupedStories.length === 0) {
    throw new Error(`No stories found for date range ${dateRangeInfo.monday} to ${dateRangeInfo.saturday}`);
  }

  // Step 3: AI Exam Curator (Gemini 3.5/3.6/3.8 Flash)
  console.log(`\n🧠 [3/6] Curating ${questionCount} Competition-Grade MCQs via Google Gemini...`);
  console.log(`  Dividing evenly across the 5 structured rounds...`);

  const questionsPerRound = Math.ceil(questionCount / 5);

  const prompt = `
You are an expert Chief Quiz Master and Kerala PSC/UPSC competitive exam educator.

Input news stories collected for the week (${dateRangeInfo.monday} to ${dateRangeInfo.saturday}):
${JSON.stringify(dedupedStories.slice(0, 70).map((s, idx) => ({
  id: idx,
  date: s.date,
  title: s.title,
  subTitle: s.subTitle || '',
  description: (s.description || '').substring(0, 250),
  facts: s.facts || [],
  category: s.category || 'KERALA',
  hasImage: !!s.image
})))}

Your task:
Formulate exactly ${questionCount} high-yield, competitive-exam grade Multiple Choice Questions (MCQs) in Malayalam, divided across the following 5 structured competition rounds:

Round 1: പുരസ്കാരങ്ങൾ & അംഗീകാരങ്ങൾ (Awards & Honors) -> ${questionsPerRound} questions
Focus: Kerala Puraskarangal (Jyothi/Prabha/Sree), Ezhuthachan, Vallathol, Kerala Sahitya/Sangeetha Akademi awards, Film/Sports honors.

Round 2: സർക്കാർ പദ്ധതികൾ & വികസനം (Government Schemes & Infrastructure) -> ${questionsPerRound} questions
Focus: Welfare schemes, industrial policies, LIFE Mission, K-FON, SilverLine, Vizhinjam international port, digital governance, NITI Aayog rankings, GI tags, heritage.

Round 3: ശാസ്ത്രം, ആരോഗ്യം & പുതിയ കണ്ടെത്തലുകൾ (Science, Health & Medicine) -> ${questionsPerRound} questions
Focus: Kerala AMR surveillance, Nipah/zoonotic protocols, health policies, public healthcare initiatives (Aardram, K-DISC, biotech).

Round 4: കരാറുകൾ & അന്താരാഷ്ട്ര സഹകരണം (Agreements, MoUs & Global Signatures) -> ${questionsPerRound} questions
Focus: Bilateral MoUs, World Bank/ADB funding for Kerala, climate partnerships, inter-state river water / transport agreements.

Round 5: റാപ്പിഡ് ഫയർ പരീക്ഷാ ചോദ്യങ്ങൾ (Kerala PSC Rapid-Fire GK) -> ${questionCount - (questionsPerRound * 4)} questions
Focus: High-yield, factual exam GK from this week's news context (nodal commissions, constitutional articles, year of establishment, statutory bodies).

CRITICAL EXCLUSIONS:
- NO ROUTINE ACCIDENTS, ROAD/TRAIN CRASHES, DROWNINGS, DOMESTIC FIRES, SUICIDES, OR LOCAL PETTY CRIME.
- NO PARTISAN POLITICAL SQUABBLES, PRESS CONFERENCE ACCUSATIONS, OR FACTIONAL BICKERING.
- DEMISE NEWS EXCEPTION: ONLY for legendary national/state luminaries (Jnanapeeth, Bharat Ratna, Padma, Olympians, former CM/PM).

CRITICAL LANGUAGE & SPELLING GUIDELINES (STRICT COMPLIANCE):
1. PRESERVE ENGLISH FOR TITLES & SCHEMES: For official scheme/campaign names, certifications, projects, summits, operations, technical terms, and English proper nouns (for example: "Eat Right Campus", "Operation Toofan", "Power Banking", "Semicon India", "Arabian Travel Market", "Global South", "One Health", "K-FON", "LIFE Mission", "K-Smart", "IDSFFK", "El Niño", "Smart City"), KEEP THE EXACT ENGLISH TEXT ITSELF (e.g. "Eat Right Campus സർട്ടിഫിക്കേഷൻ", "Operation Toofan", "Semicon India 2026").
2. DO NOT force clumsy, awkward, or misspelled Malayalam phonetic transliterations for these English terms (which causes serious spelling mistakes and confuses exam aspirants).
3. ACCURATE MALAYALAM SPELLING & GRAMMAR: Ensure formal, literary, error-free Malayalam (ഗ്രന്ഥഭാഷ / മാധ്യമ നിലവാരം). Pay special attention to correct chillaksharam (ൺ, ൻ, ർ, ൽ, ൾ) and conjunct letters (കൂട്ടക്ഷരങ്ങൾ). Avoid broken spellings.
4. Each question must have EXACTLY 4 distinct, plausible options [A, B, C, D] (no silly distractors).
5. "correctOption" must be one of: "A", "B", "C", "D".
6. Provide a clear, educational explanation in Malayalam explaining WHY the answer is correct.
7. Provide 2-3 key exam points (examKeyFacts) containing crucial background GK for Kerala PSC / UPSC (e.g. nodal department, statutory act, historical firsts).
8. If the question maps to an input story with an image, specify the story's "id" in "storyRefId".
`;

  const geminiResult = await callGemini(prompt);
  let questions = geminiResult.questions || [];

  if (questions.length === 0) {
    throw new Error("Gemini returned 0 quiz questions");
  }

  // Trim or adjust to target question count
  questions = questions.slice(0, questionCount);
  console.log(`  ✅ Successfully formulated ${questions.length} competition MCQs.`);

  // Step 4: Associate Images
  console.log(`\n📸 [4/6] Associating & Downloading Visuals for Quiz Slides...`);
  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    let localImage = null;

    if (q.storyRefId !== undefined && dedupedStories[q.storyRefId]) {
      const story = dedupedStories[q.storyRefId];
      if (story.image) {
        localImage = story.image;
      } else if (story.link) {
        const og = await fetchOgImage(story.link);
        if (og) {
          const ext = og.includes('.png') ? 'png' : 'jpg';
          const filename = `quiz_img_${i + 1}.${ext}`;
          localImage = await downloadImageLocally(og, filename);
        }
      }
    }

    q.localImage = localImage;
  }

  // Step 5: Generate Marp Markdown
  console.log(`\n🎨 [5/6] Building 16:9 Marp Presentation Slides...`);
  const fileDate = dateRangeInfo.sunday.replace(/-/g, '_');
  const marpContent = generateMarpMarkdown({ questions }, dateRangeInfo, questions.length);

  const reportMdPath = path.join(REPORTS_DIR, `Weekly_Kerala_Quiz_${fileDate}.md`);
  fs.writeFileSync(reportMdPath, marpContent, 'utf8');
  console.log(`  💾 Saved Marp Markdown: ${reportMdPath}`);

  // Step 6: Compile to 16:9 PDF & HTML
  console.log(`\n📄 [6/6] Compiling 16:9 PDF & Interactive HTML Presentation...`);
  const pdfPath = path.join(REPORTS_DIR, `Weekly_Kerala_Quiz_${fileDate}.pdf`);
  const htmlPath = path.join(REPORTS_DIR, `Weekly_Kerala_Quiz_${fileDate}_Slides.html`);

  try {
    execSync(`npx -y @marp-team/marp-cli "${reportMdPath}" --pdf --allow-local-files --no-stdin -o "${pdfPath}"`, { stdio: 'inherit' });
    console.log(`  ✅ PDF Generated: ${pdfPath}`);
  } catch (err) {
    console.error(`  ❌ Error generating PDF: ${err.message}`);
  }

  try {
    execSync(`npx -y @marp-team/marp-cli "${reportMdPath}" --html --allow-local-files --no-stdin -o "${htmlPath}"`, { stdio: 'inherit' });
    console.log(`  ✅ HTML Generated: ${htmlPath}`);
  } catch (err) {
    console.error(`  ❌ Error generating HTML: ${err.message}`);
  }

  console.log(`\n=============================================================`);
  console.log(`🎉 WEEKLY QUIZ DECK COMPLETED SUCCESSFULLY!`);
  console.log(`  📺 Markdown Source : ${reportMdPath}`);
  console.log(`  📄 16:9 PDF Deck   : ${pdfPath}`);
  console.log(`  🌐 Interactive HTML: ${htmlPath}`);
  console.log(`=============================================================\n`);

  if (!noOpen) {
    try {
      execSync(`open "${pdfPath}"`);
      execSync(`open "${htmlPath}"`);
    } catch {}
  }
}

main().catch(err => {
  console.error("❌ Fatal Quiz Generator Error:", err);
  process.exit(1);
});
