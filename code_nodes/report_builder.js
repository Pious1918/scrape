/**
 * n8n Code Node: Report & Presentation Slide Builder
 * 
 * Purpose: Generates the 16:9 split-screen presentation layout matching the YouTube slide design:
 * - Left column: Category tag, Main headline, Sub-headline, Explanation, Highlighted green exam facts box.
 * - Right column: Image visual.
 * - Categories: Kerala, India (National & Economy), Sports, International, Vocabulary (2 words).
 */

const items = $input.all().map(i => i.json);
const payload = items[0] || {};
const dateStr = payload.date || new Date().toISOString().split('T')[0];
const stories = payload.stories || [];
const vocabulary = (payload.vocabulary || []).slice(0, 2); // exactly 2 words

// Category image fallbacks
const CATEGORY_IMAGES = {
  'KERALA': 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=900&auto=format&fit=crop&q=80',
  'INDIA': 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=900&auto=format&fit=crop&q=80',
  'NATIONAL': 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=900&auto=format&fit=crop&q=80',
  'ECONOMY': 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=900&auto=format&fit=crop&q=80',
  'SPORTS': 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=900&auto=format&fit=crop&q=80',
  'INTERNATIONAL': 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=900&auto=format&fit=crop&q=80',
  'DEFAULT': 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=900&auto=format&fit=crop&q=80'
};

function getImageForCategory(cat) {
  const c = (cat || '').toUpperCase();
  if (c.includes('KERALA')) return CATEGORY_IMAGES['KERALA'];
  if (c.includes('SPORT')) return CATEGORY_IMAGES['SPORTS'];
  if (c.includes('INTERNATION')) return CATEGORY_IMAGES['INTERNATIONAL'];
  if (c.includes('ECONOM') || c.includes('BANK')) return CATEGORY_IMAGES['ECONOMY'];
  if (c.includes('INDIA') || c.includes('NATION')) return CATEGORY_IMAGES['INDIA'];
  return CATEGORY_IMAGES['DEFAULT'];
}

let md = `---
marp: true
theme: default
size: 16:9
paginate: false
style: |
  @import url('https://fonts.googleapis.com/css2?family=Manjari:wght@400;700&family=Noto+Sans+Malayalam:wght@400;600;700;800&display=swap');
  section {
    font-family: 'Noto Sans Malayalam', 'Manjari', -apple-system, sans-serif;
    padding: 0; margin: 0; background: #f8fafc; color: #1e293b;
    display: flex; flex-direction: row; width: 1280px; height: 720px;
  }
  .slide-container { display: flex; flex-direction: row; width: 100%; height: 100%; }
  .left-content { width: 55%; height: 100%; padding: 40px 35px 30px 45px; box-sizing: border-box; display: flex; flex-direction: column; justify-content: space-between; background: #ffffff; }
  .right-visual { width: 45%; height: 100%; background-size: cover; background-position: center; }
  .category-tag { display: inline-block; font-size: 13px; font-weight: 700; text-transform: uppercase; color: #2563eb; background: #eff6ff; padding: 4px 12px; border-radius: 6px; margin-bottom: 6px; width: fit-content; }
  .main-title { font-size: 32px; font-weight: 800; color: #1e3a8a; line-height: 1.25; margin: 0 0 10px 0; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; }
  .sub-title { font-size: 20px; font-weight: 700; color: #2563eb; margin: 0 0 12px 0; }
  .description { font-size: 15px; line-height: 1.55; color: #334155; margin: 0 0 14px 0; }
  .fact-box { background: #ecfdf5; border: 1.5px solid #a7f3d0; border-radius: 12px; padding: 12px 16px; margin-top: auto; }
  .fact-box-title { font-size: 15px; font-weight: 700; color: #065f46; margin-bottom: 6px; }
  .fact-list { margin: 0; padding: 0; list-style: none; font-size: 13.5px; color: #064e3b; line-height: 1.45; }
  .fact-list li { margin-bottom: 4px; position: relative; padding-left: 14px; }
  .fact-list li::before { content: "•"; position: absolute; left: 0; color: #059669; font-weight: bold; }
  .cover-slide { width: 100%; height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%); color: #ffffff; }
  .vocab-card { background: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: 12px; padding: 16px; margin-bottom: 12px; }
---

<!-- Cover Slide -->
<div class="cover-slide">
  <div style="font-size: 48px; font-weight: 800; color: #38bdf8; margin-bottom: 12px;">DAILY CURRENT AFFAIRS</div>
  <div style="font-size: 24px; color: #fbbf24; margin-bottom: 24px;">പ്രധാന കറന്റ് അഫയേഴ്സ് & പരീക്ഷാ വസ്തുതകൾ</div>
  <div style="background: rgba(255,255,255,0.15); padding: 8px 20px; border-radius: 30px; font-size: 16px;">📅 ${dateStr} | The Hindu & Official Sources | Kerala PSC • SSC • UPSC • Banking</div>
</div>\n\n`;

// Story Slides
stories.forEach((s, idx) => {
  const cat = (s.category || 'National').toUpperCase();
  const bgImg = getImageForCategory(cat);
  const examPoints = s.examPoints && s.examPoints.length ? s.examPoints : ['പ്രധാന പരീക്ഷാ ചോദ്യങ്ങൾക്ക് സാധ്യതയുള്ള വാർത്ത.'];

  md += `---\n\n`;
  md += `<div class="slide-container">\n`;
  md += `  <div class="left-content">\n`;
  md += `    <div>\n`;
  md += `      <div class="category-tag">${cat}</div>\n`;
  md += `      <div class="main-title">${s.title || 'പ്രധാന വാർത്ത'}</div>\n`;
  md += `      <div class="sub-title">${s.subTitle || s.whyImportant || 'പ്രധാന പരീക്ഷാ വിവരണം'}</div>\n`;
  md += `      <div class="description">${s.whatHappened || s.description || ''}</div>\n`;
  md += `    </div>\n`;
  md += `    <div class="fact-box">\n`;
  md += `      <div class="fact-box-title">🎯 പ്രധാന വസ്തുതകൾ & പരീക്ഷാ പോയിന്റുകൾ</div>\n`;
  md += `      <ul class="fact-list">\n`;
  examPoints.forEach(pt => {
    md += `        <li>${pt}</li>\n`;
  });
  md += `      </ul>\n`;
  md += `    </div>\n`;
  md += `  </div>\n`;
  md += `  <div class="right-visual" style="background-image: url('${bgImg}');">\n`;
  md += `  </div>\n`;
  md += `</div>\n\n`;
});

// Vocabulary Slide (2 words)
if (vocabulary.length > 0) {
  md += `---\n\n`;
  md += `<div class="slide-container">\n`;
  md += `  <div class="left-content" style="width: 100%;">\n`;
  md += `    <div>\n`;
  md += `      <div class="category-tag">📚 DAILY VOCABULARY</div>\n`;
  md += `      <div class="main-title">ദിനപത്രത്തിൽ നിന്നുള്ള 2 പ്രധാന പദങ്ങൾ</div>\n`;
  md += `    </div>\n`;
  md += `    <div style="display: flex; gap: 20px; margin-top: 15px;">\n`;
  vocabulary.forEach((v, i) => {
    md += `      <div class="vocab-card" style="flex: 1;">\n`;
    md += `        <div style="font-size: 22px; font-weight: 800; color: #1e3a8a; margin-bottom: 6px;">${i + 1}. ${(v.word || '').toUpperCase()} <span style="font-size: 14px; color: #64748b; font-weight: normal;">(${v.partOfSpeech || 'n.'})</span></div>\n`;
    md += `        <div style="font-size: 15px; margin-bottom: 6px;"><strong>English:</strong> ${v.englishMeaning}</div>\n`;
    md += `        <div style="font-size: 15px; color: #059669; font-weight: 700; margin-bottom: 8px;"><strong>മലയാളം:</strong> ${v.malayalamMeaning}</div>\n`;
    md += `        <div style="font-size: 14px; color: #334155;"><strong>Example:</strong> <em>"${v.exampleSentence || ''}"</em></div>\n`;
    md += `      </div>\n`;
  });
  md += `    </div>\n`;
  md += `  </div>\n`;
  md += `</div>\n`;
}

const fileName = `Daily_Current_Affairs_${dateStr.replace(/[^a-zA-Z0-9]/g, '_')}.md`;
const filePath = `/Users/pious/Documents/personalproject/scrapping/reports/${fileName}`;

return [{
  json: {
    date: dateStr,
    fileName,
    filePath,
    markdownReport: md,
    storiesCount: stories.length
  }
}];
