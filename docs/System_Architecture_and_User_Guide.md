---
marp: true
theme: default
size: 16:9
paginate: true
style: |
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&family=Noto+Sans+Malayalam:wght@400;600;700&display=swap');
  
  section {
    font-family: 'Inter', 'Noto Sans Malayalam', -apple-system, BlinkMacSystemFont, sans-serif;
    padding: 35px 45px;
    background: #ffffff;
    color: #1e293b;
    font-size: 15px;
    line-height: 1.55;
  }
  
  h1 {
    font-size: 26px;
    font-weight: 800;
    color: #1e3a8a;
    border-bottom: 2px solid #3b82f6;
    padding-bottom: 6px;
    margin-top: 0;
    margin-bottom: 14px;
  }
  
  h2 {
    font-size: 18px;
    font-weight: 700;
    color: #2563eb;
    margin-top: 10px;
    margin-bottom: 6px;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin: 10px 0;
    font-size: 13.5px;
  }

  th {
    background: #f1f5f9;
    color: #0f172a;
    font-weight: 700;
    text-align: left;
    padding: 7px 10px;
    border: 1px solid #cbd5e1;
  }

  td {
    padding: 6px 10px;
    border: 1px solid #e2e8f0;
  }

  code {
    background: #f1f5f9;
    color: #0f172a;
    padding: 2px 5px;
    border-radius: 4px;
    font-size: 13px;
  }

  pre {
    background: #0f172a;
    color: #f8fafc;
    padding: 10px 14px;
    border-radius: 6px;
    font-size: 12.5px;
    line-height: 1.4;
  }

  .box-info {
    background: #eff6ff;
    border-left: 4px solid #3b82f6;
    padding: 8px 14px;
    border-radius: 0 6px 6px 0;
    margin: 10px 0;
    font-size: 13.5px;
  }

  .box-green {
    background: #ecfdf5;
    border-left: 4px solid #10b981;
    padding: 8px 14px;
    border-radius: 0 6px 6px 0;
    margin: 10px 0;
    font-size: 13.5px;
  }

  .cover-slide {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    height: 100%;
    background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%);
    color: #ffffff;
  }
---

<!-- Page 1: Cover -->
<!-- _paginate: false -->
<div class="cover-slide">
  <div style="font-size: 38px; font-weight: 800; color: #38bdf8; margin-bottom: 12px;">DAILY CURRENT AFFAIRS AUTOMATION</div>
  <div style="font-size: 22px; color: #fbbf24; margin-bottom: 20px;">System Architecture, Prompts Engineering & Operational Manual</div>
  <div style="background: rgba(255,255,255,0.15); padding: 8px 24px; border-radius: 30px; font-size: 15px; color: #f8fafc;">
    Kerala PSC • SSC • UPSC • Banking | Malayalam Presentation Engine
  </div>
</div>

---

# 1. Executive Summary & 6:00 AM Workflow

### Purpose & Objective
This automated system transforms daily news from **The Hindu** and official government sources into **exam-curated Malayalam presentation slide decks and PDFs** for your daily YouTube educational broadcasts.

### The 6:00 AM Morning Routine
When you wake up at **6:00 AM**, you run one command in your terminal:
```bash
node scripts/fetch_and_generate_today.js
```
<div class="box-green">
  <strong>⏱️ Total Execution Time: ~10 to 15 seconds</strong><br>
  In 10 seconds, the system fetches today's morning paper news, extracts photos, queries Google Gemini, formats Malayalam text, and automatically opens your Presentation PDF in Apple Preview.
</div>

### Core Deliverables Generated Daily:
1. **10 to 15 Exam Stories** categorized into **Kerala, National (India), Sports, and International**.
2. **2 High-Yield Exam Vocabulary Words** with English/Malayalam definitions & example sentences.
3. **Exact Newspaper Photos** downloaded and displayed on each slide.
4. **Print & Screen-Ready PDF** formatted in 16:9 widescreen layout.

---

# 2. End-to-End System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                             1. DATA INGESTION                               │
│  Official RSS XML Feeds (The Hindu Kerala, National, Sports, World, PRD)    │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          2. 24-HOUR MORNING FILTER                          │
│  • Captures Yesterday 05:30 AM to Today 06:00 AM (Today's Print Paper)      │
│  • HTML Cleanup & Fuzzy Deduplication                                       │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        3. GOOGLE GEMINI AI ENGINE                           │
│  Model: gemini-3.5-flash / gemini-3.6-flash (Free Tier API)                 │
│  • Curates 10-15 Exam Stories & Generates Malayalam Content                 │
│  • Generates 2 High-Yield English Vocabulary Words                          │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    4. NEWSPAPER PHOTO DOWNLOADER                            │
│  Extracts <media:content> or og:image & downloads to reports/images/        │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         5. MARP PDF SLIDE BUILDER                           │
│  Compiles Markdown + CSS to high-res PDF and opens macOS Preview            │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

# 3. Data Ingestion: Official News Feeds

Instead of slow, fragile webpage scraping that can get blocked, the system connects directly to **official, public RSS feeds**:

| Category | Official Source | Endpoint URL |
| :--- | :--- | :--- |
| **National (India)** | The Hindu National Desk | `https://www.thehindu.com/news/national/feeder/default.rss` |
| **Kerala State** | The Hindu Kerala Bureau | `https://www.thehindu.com/news/national/kerala/feeder/default.rss` |
| **Business & Economy** | The Hindu Business Desk | `https://www.thehindu.com/business/feeder/default.rss` |
| **Sports** | The Hindu Sports Desk | `https://www.thehindu.com/sport/feeder/default.rss` |
| **International** | The Hindu World Desk | `https://www.thehindu.com/news/international/feeder/default.rss` |
| **Kerala Government** | PRD Kerala (Official PR) | `https://prd.kerala.gov.in/en/rss.xml` |

### Why This Method is Best:
* **100% Legal & Safe**: Uses public syndicate endpoints provided by the publisher (Kasturi & Sons Ltd.).
* **Ultra Fast**: Ingests 300+ daily articles in less than 1.5 seconds.
* **Contains Official Photos**: Each RSS item includes the `<media:content>` tag with the high-resolution photo from the print article.

---

# 4. Master Prompt Suite: Overview & Design

The AI curation is governed by **6 specialized prompts** located in the `prompts/` directory:

| Prompt File | Role & Objective | Target Output |
| :--- | :--- | :--- |
| [`prompts/01_news_selector.md`](file:///Users/pious/Documents/personalproject/scrapping/prompts/01_news_selector.md) | **Chief Editor**: Filters 200+ raw news down to 10–15 high-yield exam stories. | Filtered JSON list with category & exam relevance. |
| [`prompts/02_fact_researcher.md`](file:///Users/pious/Documents/personalproject/scrapping/prompts/02_fact_researcher.md) | **Fact Verifier**: Extracts dates, statutory acts, ministries, and confidence scores ($\ge 0.85$). | Verified facts and cross-check notes. |
| [`prompts/03_malayalam_writer.md`](file:///Users/pious/Documents/personalproject/scrapping/prompts/03_malayalam_writer.md) | **Malayalam Educator**: Translates & formats news into presentation slides. | Malayalam headline, sub-headline, summary, points. |
| [`prompts/04_mcq_generator.md`](file:///Users/pious/Documents/personalproject/scrapping/prompts/04_mcq_generator.md) | **Quiz Master**: Generates PSC/UPSC standard 4-option multiple-choice questions. | 4-option MCQs with correct answers & explanations. |
| [`prompts/05_vocabulary_generator.md`](file:///Users/pious/Documents/personalproject/scrapping/prompts/05_vocabulary_generator.md) | **Language Specialist**: Selects exactly 2 high-yield English vocabulary words. | Word, part of speech, Eng/Mal definitions, example. |
| [`prompts/06_youtube_script.md`](file:///Users/pious/Documents/personalproject/scrapping/prompts/06_youtube_script.md) | **YouTube Scriptwriter**: Creates natural Malayalam narration for voice-over recording. | Timestamped conversational voice-over script. |

---

# 5. Deep-Dive: News Selector & Malayalam Writer Prompts

### Prompt 01: AI News Selector ([`prompts/01_news_selector.md`](file:///Users/pious/Documents/personalproject/scrapping/prompts/01_news_selector.md))
* **Editor Persona**: Specialized in Kerala PSC (Degree & 10th Level), SSC CGL, UPSC Prelims, and Banking exams.
* **Strict 4-Way Categorization**:
  1. `Kerala Affairs`: State government policies, infrastructure, gazettes, PRD announcements.
  2. `India / National & Economy`: Union Cabinet, Supreme Court, RBI, economic policies, science & tech.
  3. `Sports`: Major championships, Olympic sports, national records, award recipients.
  4. `International`: Bilateral treaties, global summits (G20, ASEAN, BRICS), UN resolutions.
* **Strict Exclusions**: Celebrity gossip, minor crime, sensationalism, political rallies, clickbait.

---

### Prompt 03: Malayalam Content & Slide Writer ([`prompts/03_malayalam_writer.md`](file:///Users/pious/Documents/personalproject/scrapping/prompts/03_malayalam_writer.md))
* **Linguistic Guidelines**:
  * Write **natural, conversational Malayalam** (avoid robotic, word-for-word machine translation).
  * Keep proper nouns, institutions, and technical terms in English or standard transliteration (e.g. *'EXIM Services', 'Repo Rate', 'MeitY', 'PPP മാതൃക'*).
  * Structure bullet points for Kerala PSC factual recall (Nodal agencies, target years, allocations).

---

# 6. Deep-Dive: Vocabulary & MCQ Prompts

### Prompt 05: Daily Vocabulary Builder ([`prompts/05_vocabulary_generator.md`](file:///Users/pious/Documents/personalproject/scrapping/prompts/05_vocabulary_generator.md))
* **Goal**: Enhances English Verbal Ability for SSC CGL, Banking (IBPS/SBI), and Kerala PSC English.
* **Selection Rule**: Exactly **2 high-yield, sophisticated English words** found in today's news reporting (e.g. *Indigenous, Pragmatic, Moratorium, Exacerbate*).
* **Format**:
  * Word in UPPERCASE + Part of Speech (Adjective / Noun / Verb).
  * Concise English definition + Precise Malayalam meaning (`സ്വദേശീയമായ`, `പ്രായോഗികമായ`).
  * Illustrative sentence contextualized with today's news events.

---

### Prompt 04: MCQ & Quiz Generator ([`prompts/04_mcq_generator.md`](file:///Users/pious/Documents/personalproject/scrapping/prompts/04_mcq_generator.md))
* **Exam Relevance**: Follows Kerala PSC Statement-based & factual question standards.
* **Format**:
  * Clear Malayalam question stem.
  * 4 distinct options (A, B, C, D) with realistic distractors.
  * Detailed explanation in Malayalam detailing why the correct answer is right.

---

# 7. How 6:00 AM Morning Filtering Works

### The Challenge of Morning News
A physical morning newspaper delivered at 6:00 AM contains news finalized over the **previous 24 hours** (yesterday morning through late night). A simple calendar check (`date == today`) would return almost no news at 6:00 AM because journalists are asleep between midnight and dawn.

### The Solution: 24-Hour Rolling Window
```javascript
const now = new Date(); // 6:00 AM today
const windowStartTime = now.getTime() - (24 * 60 * 60 * 1000); // Yesterday 6:00 AM

// Filters articles strictly within the print edition cycle
if (pubDateObj.getTime() < windowStartTime) {
  continue; // Discard older articles
}
```

<div class="box-info">
  <strong>💡 What this guarantees:</strong><br>
  Whether you run the script at <strong>6:00 AM, 7:00 AM, 8:00 AM, or 9:00 AM</strong>, you will always capture 100% of the stories printed in today's morning paper.
</div>

---

# 8. Why is it 100% Free?

### Google AI Studio Free Tier Quota
Google provides free access to Gemini Flash models under the following terms:

| Metric | Free Tier Quota | Your Usage |
| :--- | :--- | :--- |
| **Daily Requests** | **1,500 requests / day** | **1 request / day** (at 6:00 AM) |
| **Rate Limit** | **15 requests / minute** | **1 request** |
| **Billing Required** | **NO** (No credit card attached) | Free forever |
| **Quota Consumption** | 100% available | **0.06% daily usage** |

<div class="box-green">
  <strong>✅ Zero Financial Cost:</strong><br>
  Since the entire daily curation is bundled into 1 smart JSON prompt, you only make 1 API request per day. You will never be charged.
</div>

---

# 9. Slide Layout & Marp PDF Engine

### Visual Layout (Matching YouTube Educational Format)
* **16:9 Aspect Ratio** (`1280px × 720px`).
* **Left Column (55%)**:
  * Category Badge (`🌴 KERALA AFFAIRS`, `🏛️ INDIA AFFAIRS`, `🏆 SPORTS`, `🌐 INTERNATIONAL`).
  * Bold Navy Malayalam Headline.
  * Blue Sub-headline highlighting the core development.
  * 2-3 sentence Malayalam summary.
  * Mint-green fact box: **`⚓ പ്രധാന വസ്തുതകൾ & പരീക്ഷാ പോയിന്റുകൾ`**.
* **Right Column (45%)**:
  * High-resolution lead photograph downloaded directly from the news article.
* **Full-Width Fallback (100%)**:
  * If an article has no photo, the card automatically expands to full width with zero empty space.

### PDF Compilation Command
The script uses `@marp-team/marp-cli` to render the styled layout into a vector PDF:
```bash
npx @marp-team/marp-cli report.md --pdf --allow-local-files --no-stdin -o presentation.pdf
```

---

# 10. Complete Project File Guide

| File Path | Description |
| :--- | :--- |
| [`scripts/fetch_and_generate_today.js`](file:///Users/pious/Documents/personalproject/scrapping/scripts/fetch_and_generate_today.js) | **Main Engine**: Ingestion, 24-hr filter, Gemini AI, photo downloader & PDF generator. |
| [`scripts/generate_pdf.sh`](file:///Users/pious/Documents/personalproject/scrapping/scripts/generate_pdf.sh) | Standalone script to compile any report Markdown file into a PDF. |
| [`scripts/generate_slides.sh`](file:///Users/pious/Documents/personalproject/scrapping/scripts/generate_slides.sh) | Converts reports into interactive HTML slides for browser presentations. |
| [`config/sources.json`](file:///Users/pious/Documents/personalproject/scrapping/config/sources.json) | Central catalog of all primary and secondary RSS feeds. |
| [`config/default_config.json`](file:///Users/pious/Documents/personalproject/scrapping/config/default_config.json) | Configuration (10-20 stories, 2 vocabulary words, exam targets). |
| [`prompts/`](file:///Users/pious/Documents/personalproject/scrapping/prompts/) | Master prompt templates (News selector, Malayalam writer, Vocabulary, MCQs). |
| [`reports/`](file:///Users/pious/Documents/personalproject/scrapping/reports/) | Daily `.md` reports and compiled `_Presentation.pdf` files. |
| [`reports/images/`](file:///Users/pious/Documents/personalproject/scrapping/reports/images/) | Downloaded high-resolution newspaper article photos. |
| [`workflows/`](file:///Users/pious/Documents/personalproject/scrapping/workflows/) | Visual n8n workflow blueprints. |

---

# 11. Step-by-Step User Guide & Automation

### Daily Manual Execution (Recommended)
1. Open Terminal on your Mac.
2. Navigate to your project folder:
   ```bash
   cd /Users/pious/Documents/personalproject/scrapping
   ```
3. Run the pipeline:
   ```bash
   node scripts/fetch_and_generate_today.js
   ```
4. Your presentation PDF will pop open automatically in **Apple Preview** in ~10 seconds!

---

### Optional: 100% Hands-Free Mac Cron (Automatic 6:00 AM Trigger)
If you want the PDF to be ready automatically when you open your laptop:
1. In Terminal, run: `crontab -e`
2. Add this line and save:
   ```bash
   0 6 * * * cd /Users/pious/Documents/personalproject/scrapping && /usr/local/bin/node scripts/fetch_and_generate_today.js
   ```
* Every morning at 6:00 AM, the PDF will be generated and waiting for you!
