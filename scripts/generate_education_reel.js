#!/usr/bin/env node

/**
 * 🎓 Shradha Edu Alerts - 9:16 Shorts / Reel Generator (Full HD)
 * 
 * Target Focus:
 * 1. Teachers: K-TET, aided/gov school orders, teacher recruitment, service rules
 * 2. SSLC & Kerala State Syllabus: 10th/12th exams, HSCAP Plus One, model exams, grace marks
 * 3. CBSE & ICSE Students in Kerala: Board updates, circulars, syllabus rules
 * 4. Central University & National Entrances: CUET, IIT (CEED, UCEED, JEE), NEET, TIFR, GATE
 * 5. Scholarships & Government Schemes: State/Central grants (NMMS, LIC, NSP, Vidyasamunnathi)
 * 6. Foreign Scholarships: Overseas study grants for Kerala students & teachers
 * 
 * Features:
 * - At least 4 news alerts per day
 * - Automatic deduplication against yesterday's alerts (in config/education_alerts_history.json)
 * - Last-Day Exception: If an alert's deadline is TODAY, it is highlighted as "🚨 ഇന്ന് അവസാന തീയതി! (LAST DAY TODAY!)"
 * - Clean Light Theme without any raw code blocks
 * - No publisher marks; branded as "SHRADHA EDU ALERTS"
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PROJECT_ROOT = path.resolve(__dirname, '..');
const REPORTS_DIR = path.join(PROJECT_ROOT, 'reports');
const CONFIG_DIR = path.join(PROJECT_ROOT, 'config');
const THEME_PATH = path.join(CONFIG_DIR, 'theme_education_reel.css');
const HISTORY_FILE = path.join(CONFIG_DIR, 'education_alerts_history.json');
// Load environment variables from .env if present
function loadEnv() {
  const envPath = path.resolve(PROJECT_ROOT, '.env');
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

if (!fs.existsSync(REPORTS_DIR)) {
  fs.mkdirSync(REPORTS_DIR, { recursive: true });
}
if (!fs.existsSync(CONFIG_DIR)) {
  fs.mkdirSync(CONFIG_DIR, { recursive: true });
}

// Parse arguments
const args = process.argv.slice(2);
const onlineMode = args.includes('--online');
const imageArg = args.find(a => a.startsWith('--image='));
const explicitImagePath = imageArg ? imageArg.split('=')[1] : null;

// Allow user to specify count (Minimum: 4)
function getCountArg() {
  const countArg = args.find(a => a.startsWith('--count=') || a.startsWith('--limit='));
  if (countArg) {
    const val = parseInt(countArg.split('=')[1], 10);
    return isNaN(val) ? 4 : Math.max(4, val);
  }
  return 4; // Guaranteed at least 4 news a day
}
const targetAlertsCount = getCountArg();

// Helper: Dates
function getFormattedDate() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}_${month}_${day}`;
}

function getDisplayDate() {
  const d = new Date();
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

// History & Deduplication helpers
function loadHistory() {
  if (fs.existsSync(HISTORY_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf8'));
    } catch (e) {
      return [];
    }
  }
  return [];
}

function saveHistory(history) {
  const trimmed = history.slice(-150); // Keep last 150 alerts
  fs.writeFileSync(HISTORY_FILE, JSON.stringify(trimmed, null, 2), 'utf8');
}

// Acronym Normalization: Acronyms must be strictly in English
const ACRONYM_MAP = [
  [/(?:യു[\.\s-]?സി[\.\s-]?ഇ[\.\s-]?ഇ[\.\s-]?ഡി(?:\s*\(UCEED\))?|യുസിഇഇഡി)/gu, "UCEED"],
  [/(?:സി[\.\s-]?ഇ[\.\s-]?ഇ[\.\s-]?ഡി(?:\s*\(CEED\))?|സിഇഇഡി)/gu, "CEED"],
  [/(?:എൻ[\.\s-]?എം[\.\s-]?എം[\.\s-]?എസ്(?:\s*\(NMMS\))?|എൻഎംഎംഎസ്)/gu, "NMMS"],
  [/(?:കെ[\.\s-]?ടെറ്റ്|കെ[\.\s-]?റ്റെറ്റ്)/gu, "K-TET"],
  [/(?:സി[\.\s-]?ബി[\.\s-]?എസ്[\.\s-]?ഇ)/gu, "CBSE"],
  [/(?:ഐ[\.\s-]?സി[\.\s-]?എസ്[\.\s-]?ഇ)/gu, "ICSE"],
  [/(?:സി[\.\s-]?യു[\.\s-]?ഇ[\.\s-]?ടി)/gu, "CUET"],
  [/(?:ടി[\.\s-]?ഐ[\.\s-]?എഫ്[\.\s-]?ആർ)/gu, "TIFR"],
  [/(?:ഡി[\.\s-]?ഇ[\.\s-]?ഒ(?:മാർക്ക്|മാർ|മാരുടെ)?)/gu, "DEO"],
  [/(?:പി[\.\s-]?എസ്[\.\s-]?സി)/gu, "PSC"],
  [/(?:എൽ[\.\s-]?ഐ[\.\s-]?സി)/gu, "LIC"],
  [/(?:എൽ[\.\s-]?ബി[\.\s-]?എസ്)/gu, "LBS"],
  [/(?:ജി[\.\s-]?എം[\.\s-]?ഇ)/gu, "GME"],
  [/(?:എൻ[\.\s-]?ഐ[\.\s-]?ടി)/gu, "NIT"],
  [/(?:ഐ[\.\s-]?ഐ[\.\s-]?ടി)/gu, "IIT"],
  [/(?:ഐ[\.\s-]?ഐ[\.\s-]?എസ്[\.\s-]?സി)/gu, "IISc"],
  [/(?:എസ്[\.\s-]?എസ്[\.\s-]?എൽ[\.\s-]?സി)/gu, "SSLC"]
];

function cleanAcronyms(text) {
  if (!text || typeof text !== 'string') return '';
  let res = text;
  for (const [regex, replacement] of ACRONYM_MAP) {
    res = res.replace(regex, replacement);
  }
  // Remove redundant parentheses like "UCEED (UCEED)"
  res = res.replace(/\b([A-Z0-9-]+)\s*\(\1\)/g, '$1');
  return res;
}

function sanitizeAlert(alert) {
  return {
    ...alert,
    title: cleanAcronyms(alert.title),
    titleEn: cleanAcronyms(alert.titleEn),
    targetAudience: cleanAcronyms(alert.targetAudience),
    eligibility: cleanAcronyms(alert.eligibility),
    benefits: cleanAcronyms(alert.benefits),
    lastDate: cleanAcronyms(alert.lastDate),
    examDate: cleanAcronyms(alert.examDate),
    voiceoverScript: cleanAcronyms(alert.voiceoverScript)
  };
}

function normalizeTitle(t) {
  if (!t) return '';
  return t.toLowerCase()
    .replace(/[^\u0D00-\u0D7Fa-zA-Z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function isSimilar(t1, t2) {
  const words1 = new Set(normalizeTitle(t1).split(' ').filter(w => w.length > 2));
  const words2 = new Set(normalizeTitle(t2).split(' ').filter(w => w.length > 2));
  if (words1.size === 0 || words2.size === 0) return false;
  let matches = 0;
  for (const w of words1) {
    if (words2.has(w)) matches++;
  }
  const ratio = matches / Math.min(words1.size, words2.size);
  return ratio >= 0.45; // 45%+ keyword overlap considered same topic
}

// Check if deadline is TODAY
function isDeadlineToday(lastDateText) {
  if (!lastDateText || typeof lastDateText !== 'string') return false;
  const lower = lastDateText.toLowerCase();
  if (lower.includes('ഇന്ന്') || lower.includes('today')) return true;

  const d = new Date();
  const day = d.getDate();
  const monthNamesMalayalam = [
    'ജനുവരി', 'ഫെബ്രുവരി', 'മാർച്ച്', 'ഏപ്രിൽ', 'മെയ്', 'ജൂൺ',
    'ജൂലൈ', 'ഓഗസ്റ്റ്', 'സെപ്റ്റംബർ', 'ഒക്ടോബർ', 'നവംബർ', 'ഡിസംബർ'
  ];
  const curMonthMl = monthNamesMalayalam[d.getMonth()];
  if (lower.includes(curMonthMl) && lower.includes(String(day))) {
    return true;
  }
  return false;
}

// Deduplicate alerts against history
function filterAndDeduplicate(alerts, history, todayStr) {
  const pastHistory = history.filter(h => h.postedDate !== todayStr);
  const result = [];
  const seenThisRun = new Set();

  for (const alert of alerts) {
    const norm = normalizeTitle(alert.title);
    if (seenThisRun.has(norm)) continue;

    // Check if appeared in previous days
    const pastMatch = pastHistory.find(h => 
      isSimilar(h.title, alert.title) || 
      (alert.titleEn && h.titleEn && isSimilar(h.titleEn, alert.titleEn))
    );

    if (pastMatch) {
      // If deadline is TODAY, include as high-urgency alert!
      if (isDeadlineToday(alert.lastDate)) {
        alert.isLastDayAlert = true;
        result.push(alert);
        seenThisRun.add(norm);
        console.log(`🚨 Re-including yesterday's alert because deadline is TODAY: "${alert.title}"`);
      } else {
        console.log(`⏩ Skipping duplicate alert from yesterday: "${alert.title}" (Due: ${alert.lastDate})`);
      }
    } else {
      // Fresh new alert
      result.push(alert);
      seenThisRun.add(norm);
    }
  }

  return result;
}

// Clean and parse JSON
function cleanAndParseJson(text) {
  try {
    let cleaned = text.trim();
    if (cleaned.startsWith('```json')) cleaned = cleaned.slice(7);
    else if (cleaned.startsWith('```')) cleaned = cleaned.slice(3);
    if (cleaned.endsWith('```')) cleaned = cleaned.slice(0, -3);
    return JSON.parse(cleaned.trim());
  } catch (err) {
    const jsonMatch = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw err;
  }
}

// Call Google Gemini API
async function callGemini(parts) {
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
        signal: AbortSignal.timeout(60000),
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts }],
          generationConfig: {
            temperature: 0.1,
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
        console.warn(`⚠️ [${model}] ${response.status}: ${errText.substring(0, 80)}... trying next`);
        lastError = new Error(`${model} Error: ${response.status}`);
      }
    } catch (e) {
      console.warn(`⚠️ [${model}] failed (${e.message})... trying next`);
      lastError = e;
    }
  }
  throw lastError || new Error("All Gemini models failed");
}

const SYSTEM_PROMPT = `
You are a senior Malayalam educational journalist and social media producer specializing in Kerala school and college education alerts.
Your task is to analyze education news and output at least 5 to 6 distinct high-priority alerts tailored for 30-60 second YouTube Shorts / Instagram Reels.

TARGET TOPICS TO PRIORITIZE:
1. Teachers: K-TET, aided/government school teacher appointments, service rules, training, transfers.
2. SSLC & Kerala State Syllabus: 10th/12th exams, timetable, grace marks, HSCAP Plus One/Two, LBS diplomas.
3. CBSE & ICSE Students in Kerala: Board updates, Supreme Court rulings, circulars, syllabus rules.
4. Central University & National Entrance Exams: CUET (UG/PG), IITs (CEED, UCEED, JEE), NEET, TIFR, GATE, IISc.
5. Scholarships & Government Schemes: NMMS, LIC Golden Jubilee, Vidyasamunnathi, minority scholarships, NSP portal, Central Sector.
6. Foreign Scholarships: Overseas study scholarships by Kerala Govt & Central Govt for students and teachers of Kerala.

STRICT REQUIREMENTS FOR EACH ITEM:
- You must extract at least 5 to 6 distinct alerts so there is sufficient variety.
- CRITICAL RULES FOR ABBREVIATIONS & ACRONYMS:
  * NEVER transliterate abbreviations into Malayalam phonetics! Always write abbreviations in clean uppercase English!
  * Write 'UCEED' (NEVER write 'യുസിഇഇഡി' or 'യു.സി.ഇ.ഇ.ഡി')
  * Write 'CEED' (NEVER write 'സിഇഇഡി' or 'സി.ഇ.ഇ.ഡി')
  * Write 'NMMS' (NEVER write 'എൻ.എം.എം.എസ്' or 'എൻഎംഎംഎസ്')
  * Write 'K-TET' (NEVER write 'കെ-ടെറ്റ്' or 'കെടെറ്റ്')
  * Write 'CBSE', 'ICSE', 'CUET', 'TIFR', 'DEO', 'PSC', 'LIC', 'LBS', 'IIT', 'IISc', 'SSLC' strictly in English!
- CRITICAL RULES FOR ELIGIBILITY & CRITERIA:
  * NEVER use vague filler phrases like 'വ്യവസ്ഥകൾ ബാധകമായവർ', 'മാനദണ്ഡങ്ങൾ ഉള്ളവർ', 'നിബന്ധനകൾ പാലിച്ച്', or 'യോഗ്യതാ മാനദണ്ഡങ്ങൾ പ്രകാരം'.
  * ALWAYS list the specific concrete criteria from the news article:
    - For teacher/school news (e.g. Aided school appointments): Explicitly state the criteria: 'ഭിന്നശേഷി 4% സംവരണ റോസ്റ്റർ ക്രമീകരിക്കൽ, K-TET യോഗ്യത, അംഗീകൃത അധ്യാപന ബിരുദം (B.Ed/D.El.Ed), DEO സർട്ടിഫിക്കറ്റ് വേരിഫിക്കേഷൻ'.
    - For scholarships: Explicitly state the mark percentage and income limit (e.g. '7-ാം ക്ലാസിൽ 55% മാർക്ക്, കുടുംബ വാർഷിക വരുമാനം ₹3.5 ലക്ഷത്തിൽ താഴെ').
    - For entrance exams: Explicitly state the required educational degree (e.g. 'പ്ലസ്ടു / അംഗീകൃത ബിരുദം (മിനിമം 50% മാർക്ക്)').
- DATES MUST BE ACCURATE AND STRICTLY DISTINGUISHED:
  * lastDate: The absolute DEADLINE TO APPLY (അപേക്ഷിക്കേണ്ട അവസാന തീയതി, e.g. "ഒക്ടോബർ 20", "ഒക്ടോബർ 31"). NEVER confuse the application deadline with the exam date!
  * examDate: The date the test/exam takes place (പരീക്ഷാ തീയതി, e.g. "ജനുവരി 17", "ഡിസംബർ 13"). If there is no exam, set to "ബാധകമല്ല".
- Fields to extract:
  * title: Punchy Malayalam headline (max 8-10 words, keep acronyms in English like 'UCEED', 'CEED')
  * titleEn: Short English title (e.g. "UCEED & CEED IIT Design Entrance Exams")
  * category: One of: "SCHOLARSHIP" | "ENTRANCE" | "TEACHERS" | "SCHOOL" | "FOREIGN"
  * categoryMalayalam: e.g. "സ്കോളർഷിപ്പ്" | "പ്രവേശന പരീക്ഷ" | "അധ്യാപകർ" | "സ്കൂൾ വിദ്യാഭ്യാസം" | "വിദേശ സ്കോളർഷിപ്പ്"
  * targetAudience: Crisp 3-5 words in Malayalam (e.g. "8-ാം ക്ലാസ് വിദ്യാർത്ഥികൾ")
  * eligibility: Concrete Malayalam criteria bullet (no vague filler!)
  * benefits: 1 clear Malayalam bullet (e.g. "പ്രതിവർഷം ₹12,000 (ആകെ ₹48,000)")
  * website: Official website URL (clean domain, e.g. "www.uceed.iitb.ac.in")
  * voiceoverScript: 2-3 sentences of natural, engaging spoken Malayalam for the creator to record in a reel.

Return JSON in this format:
{
  "alerts": [
    {
      "title": "...",
      "titleEn": "...",
      "category": "SCHOLARSHIP",
      "categoryMalayalam": "...",
      "targetAudience": "...",
      "eligibility": "...",
      "benefits": "...",
      "lastDate": "...",
      "examDate": "...",
      "website": "...",
      "voiceoverScript": "..."
    }
  ]
}
`;

// Mode A: Process Image
async function processImage(imagePath) {
  console.log(`📸 Reading newspaper image: ${imagePath}`);
  const imageBuffer = fs.readFileSync(imagePath);
  const base64Data = imageBuffer.toString('base64');
  const ext = path.extname(imagePath).toLowerCase();
  const mimeType = ext === '.png' ? 'image/png' : 'image/jpeg';

  const parts = [
    {
      inlineData: {
        data: base64Data,
        mimeType: mimeType
      }
    },
    {
      text: `${SYSTEM_PROMPT}\n\nPlease examine this newspaper page image carefully. Read all text, headlines, deadlines, and notifications. Extract at least 4 to 6 distinct educational alerts (scholarships, entrance exams, teacher orders, school notices).`
    }
  ];

  console.log(`🤖 Analyzing newspaper image with Gemini Vision AI...`);
  const result = await callGemini(parts);
  return result.alerts || [];
}

// Mode B: Process Online RSS
async function processOnline() {
  const rssUrl = "https://www.manoramaonline.com/career-education/education-news.feeds.rss.xml";
  console.log(`🌐 Fetching live education feed: ${rssUrl}`);
  const res = await fetch(rssUrl, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)' }
  });
  if (!res.ok) throw new Error(`HTTP Error ${res.status} fetching RSS`);
  const xml = await res.text();

  const items = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;
  while ((match = itemRegex.exec(xml)) !== null) {
    const raw = match[1];
    const titleMatch = raw.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/) || raw.match(/<title>([\s\S]*?)<\/title>/);
    const descMatch = raw.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/) || raw.match(/<description>([\s\S]*?)<\/description>/);
    const linkMatch = raw.match(/<link>([\s\S]*?)<\/link>/);

    if (titleMatch && descMatch) {
      items.push({
        title: titleMatch[1].trim(),
        description: descMatch[1].replace(/<[^>]+>/g, '').trim(),
        link: linkMatch ? linkMatch[1].trim() : ''
      });
    }
  }

  console.log(`📡 Found ${items.length} live articles from education feed.`);
  const textPrompt = `${SYSTEM_PROMPT}\n\nHere are recent articles from Education News:\n\n` +
    items.map((it, idx) => `ARTICLE ${idx + 1}:\nTitle: ${it.title}\nLink: ${it.link}\nDetails: ${it.description}\n`).join('\n---\n') +
    `\nFilter and extract at least 5 to 6 distinct high-priority alerts into the specified JSON format. Focus strictly on deadlines, eligibility, and websites.`;

  console.log(`🤖 Analyzing articles with Gemini AI...`);
  const result = await callGemini([{ text: textPrompt }]);
  return result.alerts || [];
}

// Render comma-separated or array criteria as distinct bullet points
function renderPointsAsBullets(targetAudience, rawCriteria, splitComma = true) {
  const points = [];
  if (targetAudience && targetAudience.trim()) {
    points.push(`<strong>${targetAudience.trim()}</strong>`);
  }

  if (Array.isArray(rawCriteria)) {
    for (const c of rawCriteria) {
      if (c && c.trim()) points.push(cleanAcronyms(c.trim()));
    }
  } else if (typeof rawCriteria === 'string') {
    if (splitComma) {
      // Split on commas or semicolons outside parentheses (preserves e.g. "(B.Ed/D.El.Ed)")
      const parts = rawCriteria.split(/,(?![^(]*\))|;(?![^(]*\))/g);
      for (const p of parts) {
        const trimmed = p.trim().replace(/^[-•*]\s*/, '');
        if (trimmed) points.push(cleanAcronyms(trimmed));
      }
    } else {
      const trimmed = rawCriteria.trim().replace(/^[-•*]\s*/, '');
      if (trimmed) points.push(cleanAcronyms(trimmed));
    }
  }

  if (points.length === 0) {
    return `<div class="edu-point-value">വിജ്ഞാപനം കാണുക</div>`;
  }

  if (points.length === 1) {
    return `<div class="edu-point-value">${points[0]}</div>`;
  }

  let html = `<div class="edu-point-list">\n`;
  for (const pt of points) {
    html += `<div class="edu-point-item">${pt}</div>\n`;
  }
  html += `</div>`;
  return html;
}

// Generate Marp 9:16 Slide Markdown (Clean Light Theme, Branded Shradha Edu Alerts)
function buildMarpMarkdown(alerts, displayDate) {
  let md = `---
marp: true
theme: education-reel-9-16
size: 9:16
paginate: false
---

`;

  alerts.forEach((alert, index) => {
    const categoryClass = `category-${(alert.category || 'scholarship').toLowerCase()}`;
    const categoryBadge = alert.categoryMalayalam || alert.category || 'വിദ്യാഭ്യാസം';

    md += `<!-- _class: ${categoryClass} -->
<div class="edu-wrapper">

<div class="edu-header">
<div class="edu-series-tag">🎓 SHRADHA EDU ALERTS</div>
<br/>
${alert.isLastDayAlert ? `<div class="edu-lastday-pill">🚨 ഇന്ന് അവസാന തീയതി! (LAST DAY TODAY!)</div><br/>` : ''}
<span class="edu-category-pill ${categoryClass}">${categoryBadge}</span>
<h1 class="edu-main-title">${alert.title}</h1>
${alert.titleEn ? `<div class="edu-sub-title">${alert.titleEn}</div>` : ''}
</div>

<div class="edu-card">

<div class="edu-point-row">
<div class="edu-point-icon">🎯</div>
<div class="edu-point-body">
<div class="edu-point-label">ആർക്കൊക്കെ അപേക്ഷിക്കാം? (ELIGIBILITY)</div>
${renderPointsAsBullets(alert.targetAudience, alert.eligibility)}
</div>
</div>

<div class="edu-point-row">
<div class="edu-point-icon">💰</div>
<div class="edu-point-body">
<div class="edu-point-label">BENEFITS & OPPORTUNITY</div>
${renderPointsAsBullets('', alert.benefits, false)}
</div>
</div>

<div class="edu-highlight-deadline">
<div class="edu-point-icon">🚨</div>
<div class="edu-point-body">
<div class="edu-point-label">അവസാന തീയതി (LAST DATE TO APPLY)</div>
<div class="edu-point-value">${alert.lastDate || 'വിജ്ഞാപനം കാണുക'}</div>
</div>
</div>

${alert.examDate && alert.examDate !== 'ബാധകമല്ല' ? `
<div class="edu-highlight-exam">
<div class="edu-point-icon">🗓️</div>
<div class="edu-point-body">
<div class="edu-point-label">പരീക്ഷാ / അഭിമുഖ തീയതി (EXAM DATE)</div>
<div class="edu-point-value">${alert.examDate}</div>
</div>
</div>` : ''}

<div class="edu-highlight-website">
<div class="edu-point-icon">🌐</div>
<div class="edu-point-body">
<div class="edu-point-label">അപേക്ഷിക്കേണ്ട ഔദ്യോഗിക വെബ്സൈറ്റ് (WEBSITE)</div>
<div class="edu-point-value">${alert.website || 'വിജ്ഞാപനം കാണുക'}</div>
</div>
</div>

</div>

<div class="edu-footer">
<div class="edu-source-tag"><strong>SHRADHA EDU ALERTS</strong></div>
<div class="edu-date-tag">${displayDate}</div>
</div>

</div>

---
`;
  });

  // Append creator voiceover notes
  md += `
<!--
🎙️ REEL CREATOR VOICEOVER SCRIPT (മലയാളം വോയ്‌സ് ഓവർ സ്ക്രിപ്റ്റ്):
===================================================================
`;

  alerts.forEach((alert, i) => {
    md += `\n[SLIDE ${i + 1}: ${alert.titleEn || alert.title}]\n"${alert.voiceoverScript || ''}"\n`;
  });

  md += `-->\n`;
  return md;
}

async function main() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('   🎓 SHRADHA EDU ALERTS - REEL & SHORTS GENERATOR');
  console.log('═══════════════════════════════════════════════════════════════');

  const fileDate = getFormattedDate();
  const displayDate = getDisplayDate();
  const history = loadHistory();

  let targetImagePath = explicitImagePath;
  if (!targetImagePath && !onlineMode) {
    const candidatePaths = [
      path.join(REPORTS_DIR, 'education_input.jpg'),
      path.join(REPORTS_DIR, 'sample_newspaper_education.jpg')
    ];
    for (const p of candidatePaths) {
      if (fs.existsSync(p)) {
        targetImagePath = p;
        break;
      }
    }
  }

  let rawAlerts = [];
  if (targetImagePath && fs.existsSync(targetImagePath)) {
    console.log(`📷 Mode: NEWSPAPER IMAGE SCAN (${path.basename(targetImagePath)})`);
    rawAlerts = await processImage(targetImagePath);
  } else {
    console.log(`🌐 Mode: ONLINE LIVE EDUCATION FETCHER`);
    rawAlerts = await processOnline();
  }

  // Ensure all acronyms are strictly in uppercase English (never transliterated into Malayalam)
  rawAlerts = rawAlerts.map(sanitizeAlert);

  // 1. Deduplicate against past history
  console.log(`\n🔍 Checking alerts against past days history (avoiding repeats)...`);
  let filteredAlerts = filterAndDeduplicate(rawAlerts, history, fileDate);

  // 2. Guarantee at least 4 news a day! If image mode didn't have 4 fresh alerts, fetch online to fill up
  if (filteredAlerts.length < targetAlertsCount && targetImagePath) {
    console.log(`ℹ️ Only ${filteredAlerts.length} fresh alert(s) found in image. Supplementing with online news to guarantee at least ${targetAlertsCount} alerts...`);
    try {
      const onlineRaw = await processOnline();
      const onlineSanitized = onlineRaw.map(sanitizeAlert);
      const onlineFiltered = filterAndDeduplicate(onlineSanitized, history, fileDate);
      for (const oa of onlineFiltered) {
        if (!filteredAlerts.some(fa => isSimilar(fa.title, oa.title))) {
          filteredAlerts.push(oa);
        }
        if (filteredAlerts.length >= targetAlertsCount) break;
      }
    } catch (e) {
      console.warn(`⚠️ Could not supplement with online feed: ${e.message}`);
    }
  }

  if (filteredAlerts.length === 0) {
    console.error('❌ No fresh educational alerts available today. All were either duplicate or empty.');
    process.exit(1);
  }

  const selectedAlerts = filteredAlerts.slice(0, targetAlertsCount);

  console.log(`\n✅ Providing ${selectedAlerts.length} high-yield educational alert(s) today (1 alert per slide):`);
  selectedAlerts.forEach((a, i) => {
    const tag = a.isLastDayAlert ? '🚨 [LAST DAY TODAY]' : `[${a.category}]`;
    console.log(`   ${i + 1}. ${tag} ${a.title} | Due: ${a.lastDate}`);
  });

  // 3. Write Markdown slide deck
  const mdFileName = `Education_Reel_${fileDate}.md`;
  const mdPath = path.join(REPORTS_DIR, mdFileName);
  const marpContent = buildMarpMarkdown(selectedAlerts, displayDate);
  fs.writeFileSync(mdPath, marpContent, 'utf8');
  console.log(`\n📄 Generated Markdown Slide Deck: ${mdPath}`);

  // 4. Render to PNG & PDF using Marp
  const pngPath = path.join(REPORTS_DIR, `Education_Reel_${fileDate}.png`);
  const pdfPath = path.join(REPORTS_DIR, `Education_Reel_${fileDate}.pdf`);

  console.log(`📱 Compiling to 9:16 Full HD PNG Image Deck...`);
  execSync(`npx -y @marp-team/marp-cli --theme "${THEME_PATH}" "${mdPath}" --html --image png --allow-local-files --no-stdin -o "${pngPath}"`);

  console.log(`📄 Compiling to 9:16 Full HD PDF Deck...`);
  execSync(`npx -y @marp-team/marp-cli --theme "${THEME_PATH}" "${mdPath}" --html --pdf --allow-local-files --no-stdin -o "${pdfPath}"`);

  // 5. Update history with today's selected alerts
  const updatedHistory = [...history];
  for (const a of selectedAlerts) {
    updatedHistory.push({
      title: a.title,
      titleEn: a.titleEn || '',
      category: a.category,
      lastDate: a.lastDate,
      postedDate: fileDate,
      isLastDay: !!a.isLastDayAlert
    });
  }
  saveHistory(updatedHistory);
  console.log(`💾 Saved ${selectedAlerts.length} alert(s) to history (${HISTORY_FILE}) to prevent repeats tomorrow.`);

  console.log(`\n🎉 All Assets Successfully Created:`);
  console.log(`   🖼️ Image : ${pngPath}`);
  console.log(`   📄 PDF   : ${pdfPath}`);
  console.log(`   📝 Script: ${mdPath}`);

  // Open Preview on macOS
  console.log(`👁️ Opening generated Reel slide in Preview...`);
  try {
    execSync(`open "${pngPath}"`);
  } catch (e) {}

  console.log(`\n✨ Ready to record your Reel / Shorts video!\n`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
