---
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
  <div style="background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.25); padding: 8px 20px; border-radius: 30px; font-size: 16px;">📅 05 October 2026 | The Hindu & Official Sources | Kerala PSC • SSC • UPSC • Banking</div>
</div>

---

<div class="slide-container">
  <div class="left-content">
    <div>
      <div class="category-tag">KERALA AFFAIRS</div>
      <div class="main-title">കാണാതായ സൈനികന്റെ തിരോധാനം: സിബിഐ അന്വേഷണത്തിന് ഹൈക്കോടതി ഉത്തരവ്</div>
      <div class="sub-title">14 വർഷം മുൻപ് കാണാതായ സൈനികൻ സുഭാഷ് ചന്ദ്രബോസിന്റെ കേസ് സിബിഐക്ക് കൈമാറി</div>
      <div class="description">2012 ഏപ്രിലിൽ അവധി കഴിഞ്ഞ് ജോലിയിൽ തിരികെ പ്രവേശിക്കാൻ ട്രെയിനിൽ യാത്ര ചെയ്യവെ കാണാതായ എറണാകുളം വെങ്ങൂർ സ്വദേശി സുഭാഷ് ചന്ദ്രബോസിന്റെ തിരോധാനത്തിൽ സിബിഐ അന്വേഷണത്തിന് കേരള ഹൈക്കോടതി ഉത്തരവിട്ടു. ത്രിപുര സ്റ്റേറ്റ് റൈഫിൾസിൽ സേവനമനുഷ്ഠിച്ചിരുന്ന സൈനികന്റെ കേസ് വർഷങ്ങളായി ദുരൂഹമായി തുടരുകയായിരുന്നു.</div>
    </div>
    <div class="fact-box">
      <div class="fact-box-title">⚓ പ്രധാന വസ്തുതകൾ & പരീക്ഷാ പോയിന്റുകൾ</div>
      <ul class="fact-list">
        <li>കാണാതായ സൈനികൻ: സുഭാഷ് ചന്ദ്രബോസ്</li>
        <li>അന്വേഷണ ഏജൻസി: സിബിഐ (CBI)</li>
      </ul>
    </div>
    <div class="slide-qa-box">
      <div class="slide-qa-question">❓ <strong>ചോദ്യം:</strong> 14 വർഷം മുൻപ് കാണാതായ ത്രിപുര സ്റ്റേറ്റ് റൈഫിൾസ് സൈനികന്റെ തിരോധാനത്തിൽ അന്വേഷണം നടത്താൻ ഹൈക്കോടതി നിർദ്ദേശിച്ച ഏജൻസി ഏത്?</div>
      <div class="slide-qa-answer">✅ <strong>ഉത്തരം:</strong> സിബിഐ (CBI)</div>
    </div>
  </div>
  <div class="right-visual">
    <div class="image-wrapper">
      <img src="./images/story_exact_1.jpg" alt="KERALA" />
    </div>
  </div>
</div>

---

<div class="slide-container">
  <div class="left-content">
    <div>
      <div class="category-tag">KERALA AFFAIRS</div>
      <div class="main-title">മുസിരിസ് പൈതൃക പദ്ധതി വിപുലീകരിക്കുന്നു</div>
      <div class="sub-title">അന്താരാഷ്ട്ര പൈതൃക ടൂറിസം കേന്ദ്രമായി മുസിരിസിനെ മാറ്റാൻ സർക്കാർ പദ്ധതി</div>
      <div class="description">മുസിരിസ് ഹെറിറ്റേജ് പ്രോജക്റ്റിന്റെ ഭാഗമായി വാട്ടർ ടാക്സി, കയാക്കിംഗ് സേവനങ്ങൾ എഴിക്കര, കോട്ടപ്പുറം, അഴീക്കോട് എന്നിവിടങ്ങളിലേക്ക് വ്യാപിപ്പിക്കാൻ സർക്കാർ തീരുമാനിച്ചു. മുസിരിസിനെ ഒരു അന്താരാഷ്ട്ര നിലവാരമുള്ള പൈതൃക ടൂറിസം കേന്ദ്രമാക്കി മാറ്റാനാണ് ലക്ഷ്യമിടുന്നത്.</div>
    </div>
    <div class="fact-box">
      <div class="fact-box-title">⚓ പ്രധാന വസ്തുതകൾ & പരീക്ഷാ പോയിന്റുകൾ</div>
      <ul class="fact-list">
        <li>പദ്ധതി: മുസിരിസ് ഹെറിറ്റേജ് പ്രോജക്റ്റ്</li>
        <li>പ്രധാന ലക്ഷ്യം: അന്താരാഷ്ട്ര പൈതൃക ടൂറിസം വികസനം</li>
      </ul>
    </div>
    <div class="slide-qa-box">
      <div class="slide-qa-question">❓ <strong>ചോദ്യം:</strong> മുസിരിസ് ഹെറിറ്റേജ് പ്രോജക്റ്റിന്റെ ഭാഗമായി വാട്ടർ ടാക്സി സേവനം വ്യാപിപ്പിക്കാൻ തീരുമാനിച്ച പ്രധാന സ്ഥലങ്ങൾ ഏവ?</div>
      <div class="slide-qa-answer">✅ <strong>ഉത്തരം:</strong> എഴിക്കര, കോട്ടപ്പുറം, അഴീക്കോട്</div>
    </div>
  </div>
  <div class="right-visual">
    <div class="image-wrapper">
      <img src="./images/story_exact_2.jpg" alt="KERALA" />
    </div>
  </div>
</div>

---

<div class="slide-container">
  <div class="left-content">
    <div>
      <div class="category-tag">KERALA AFFAIRS</div>
      <div class="main-title">വംശനാശം സംഭവിച്ചെന്ന് കരുതിയ സസ്യം വീണ്ടും കണ്ടെത്തി</div>
      <div class="sub-title">പറമ്പിക്കുളം വന്യജീവി വാരാഘോഷത്തിൽ താരമായി Haplothismia exannulata</div>
      <div class="description">ഒരു നൂറ്റാണ്ടിലേറെയായി കാണാതിരുന്ന Haplothismia exannulata എന്ന അപൂർവ്വ സസ്യം 26 വർഷം മുൻപ് പറമ്പിക്കുളത്ത് വീണ്ടും കണ്ടെത്തിയിരുന്നു. ഈ സസ്യത്തിന്റെ പേര് നൽകിയാണ് ഇത്തവണത്തെ വന്യജീവി വാരാഘോഷം സംഘടിപ്പിക്കുന്നത്.</div>
    </div>
    <div class="fact-box">
      <div class="fact-box-title">⚓ പ്രധാന വസ്തുതകൾ & പരീക്ഷാ പോയിന്റുകൾ</div>
      <ul class="fact-list">
        <li>അപൂർവ്വ സസ്യം: Haplothismia exannulata</li>
        <li>പ്രദേശം: പറമ്പിക്കുളം</li>
      </ul>
    </div>
    <div class="slide-qa-box">
      <div class="slide-qa-question">❓ <strong>ചോദ്യം:</strong> പറമ്പിക്കുളം വന്യജീവി വാരാഘോഷത്തിന് പേര് നൽകിയ, വംശനാശം സംഭവിച്ചെന്ന് കരുതിയ അപൂർവ്വ സസ്യം ഏത്?</div>
      <div class="slide-qa-answer">✅ <strong>ഉത്തരം:</strong> Haplothismia exannulata</div>
    </div>
  </div>
  <div class="right-visual">
    <div class="image-wrapper">
      <img src="./images/story_exact_3.jpg" alt="KERALA" />
    </div>
  </div>
</div>

---

<div class="slide-container">
  <div class="left-content">
    <div>
      <div class="category-tag">KERALA AFFAIRS</div>
      <div class="main-title">വയലാർ അവാർഡ് ആർ. രാജശ്രീക്ക്</div>
      <div class="sub-title">അത്രേയാകം എന്ന കൃതിക്ക് വയലാർ അവാർഡ്</div>
      <div class="description">പ്രശസ്ത എഴുത്തുകാരി ആർ. രാജശ്രീയുടെ 'അത്രേയാകം' എന്ന കൃതിക്ക് ഇത്തവണത്തെ വയലാർ അവാർഡ് ലഭിച്ചു. മലയാള സാഹിത്യ രംഗത്തെ മികച്ച സംഭാവനകൾക്കുള്ള അംഗീകാരമാണിത്.</div>
    </div>
    <div class="fact-box">
      <div class="fact-box-title">⚓ പ്രധാന വസ്തുതകൾ & പരീക്ഷാ പോയിന്റുകൾ</div>
      <ul class="fact-list">
        <li>അവാർഡ്: വയലാർ അവാർഡ്</li>
        <li>കൃതി: അത്രേയാകം</li>
        <li>എഴുത്തുകാരി: ആർ. രാജശ്രീ</li>
      </ul>
    </div>
    <div class="slide-qa-box">
      <div class="slide-qa-question">❓ <strong>ചോദ്യം:</strong> ഇത്തവണത്തെ വയലാർ അവാർഡ് ലഭിച്ച 'അത്രേയാകം' എന്ന കൃതിയുടെ രചയിതാവ് ആര്?</div>
      <div class="slide-qa-answer">✅ <strong>ഉത്തരം:</strong> ആർ. രാജശ്രീ</div>
    </div>
  </div>
  <div class="right-visual">
    <div class="image-wrapper">
      <img src="./images/story_exact_4.jpg" alt="KERALA" />
    </div>
  </div>
</div>

---

<div class="slide-container">
  <div class="full-content">
    <div>
      <div class="category-tag">KERALA AFFAIRS</div>
      <div class="main-title">തിരുവനന്തപുരത്ത് AVGC-XR സെന്റർ ഓഫ് എക്സലൻസ് വരുന്നു</div>
      <div class="sub-title">C-DIT-ഉം ഇന്ത്യൻ ഇൻസ്റ്റിറ്റ്യൂട്ട് ഓഫ് ക്രിയേറ്റീവ് ടെക്നോളജീസും തമ്മിൽ ധാരണാപത്രം</div>
      <div class="description">സംസ്ഥാനത്തെ ആനിമേഷൻ, വിഷ്വൽ എഫക്ട്സ്, ഗെയിമിംഗ്, കോമിക്സ്, എക്സ്റ്റൻഡഡ് റിയാലിറ്റി (AVGC-XR) മേഖലകൾ ശക്തിപ്പെടുത്തുന്നതിനായി തിരുവനന്തപുരത്ത് സെന്റർ ഓഫ് എക്സലൻസ് സ്ഥാപിക്കുന്നു. ഇതിനായി C-DIT ഇന്ത്യൻ ഇൻസ്റ്റിറ്റ്യൂട്ട് ഓഫ് ക്രിയേറ്റീവ് ടെക്നോളജിയുമായി കരാർ ഒപ്പിട്ടു.</div>
    </div>
    <div class="fact-box">
      <div class="fact-box-title">⚓ പ്രധാന വസ്തുതകൾ & പരീക്ഷാ പോയിന്റുകൾ</div>
      <ul class="fact-list">
        <li>പദ്ധതി: AVGC-XR സെന്റർ ഓഫ് എക്സലൻസ്</li>
        <li>സ്ഥലം: തിരുവനന്തപുരം</li>
        <li>പങ്കാളിത്തം: C-DIT</li>
      </ul>
    </div>
    <div class="slide-qa-box">
      <div class="slide-qa-question">❓ <strong>ചോദ്യം:</strong> കേരളത്തിലെ ആനിമേഷൻ, ഗെയിമിംഗ് മേഖലകൾ ശക്തിപ്പെടുത്താൻ തിരുവനന്തപുരത്ത് സ്ഥാപിക്കുന്ന കേന്ദ്രം ഏത്?</div>
      <div class="slide-qa-answer">✅ <strong>ഉത്തരം:</strong> AVGC-XR സെന്റർ ഓഫ് എക്സലൻസ്</div>
    </div>
  </div>
</div>

---

<div class="slide-container">
  <div class="left-content">
    <div>
      <div class="category-tag">KERALA AFFAIRS</div>
      <div class="main-title">കാസർകോട് സോളാർ പാർക്കിൽ BESS സ്ഥാപിക്കുന്നു</div>
      <div class="sub-title">100 മെഗാവാട്ട് സോളാർ പാർക്കിൽ ബാറ്ററി എനർജി സ്റ്റോറേജ് സിസ്റ്റം ഒരുക്കുന്നു</div>
      <div class="description">കാസർകോട് സോളാർ പാർക്കിന്റെ രണ്ടാം ഘട്ടത്തിൽ 50 മെഗാവാട്ട്/100 MWh ശേഷിയുള്ള ബാറ്ററി എനർജി സ്റ്റോറേജ് സിസ്റ്റം (BESS) സ്ഥാപിക്കാൻ സർക്കാർ തീരുമാനിച്ചു. സംസ്ഥാനത്തെ സൗരോർജ്ജ ഉൽപ്പാദന ശേഷി വർദ്ധിപ്പിക്കുന്നതിന്റെ ഭാഗമായാണ് ഈ പദ്ധതി.</div>
    </div>
    <div class="fact-box">
      <div class="fact-box-title">⚓ പ്രധാന വസ്തുതകൾ & പരീക്ഷാ പോയിന്റുകൾ</div>
      <ul class="fact-list">
        <li>പദ്ധതി: 100 MW കാസർകോട് സോളാർ പാർക്ക്</li>
        <li>സാങ്കേതികവിദ്യ: BESS (Battery Energy Storage System)</li>
      </ul>
    </div>
    <div class="slide-qa-box">
      <div class="slide-qa-question">❓ <strong>ചോദ്യം:</strong> കാസർകോട് സോളാർ പാർക്കിൽ സ്ഥാപിക്കാൻ ഉദ്ദേശിക്കുന്ന ബാറ്ററി എനർജി സ്റ്റോറേജ് സിസ്റ്റത്തിന്റെ ശേഷി എത്ര?</div>
      <div class="slide-qa-answer">✅ <strong>ഉത്തരം:</strong> 50 മെഗാവാട്ട് / 100 MWh</div>
    </div>
  </div>
  <div class="right-visual">
    <div class="image-wrapper">
      <img src="./images/story_exact_6.jpg" alt="KERALA" />
    </div>
  </div>
</div>

---

<div class="slide-container">
  <div class="left-content">
    <div>
      <div class="category-tag">KERALA AFFAIRS</div>
      <div class="main-title">കോഴിക്കോട് അവയവമാറ്റ ശസ്ത്രക്രിയ ഇൻസ്റ്റിറ്റ്യൂട്ട്</div>
      <div class="sub-title">30 മാസത്തിനുള്ളിൽ നിർമ്മാണം പൂർത്തിയാക്കാൻ ലക്ഷ്യം</div>
      <div class="description">കോഴിക്കോട് ചേവായൂരിൽ 20 ഏക്കർ സ്ഥലത്ത് 271 കോടി രൂപ ചെലവിൽ അവയവമാറ്റ ശസ്ത്രക്രിയ ഇൻസ്റ്റിറ്റ്യൂട്ട് സ്ഥാപിക്കുന്നു. അവയവമാറ്റവുമായി ബന്ധപ്പെട്ട എല്ലാ ചികിത്സാ സൗകര്യങ്ങളും ഒരൊറ്റ കുടക്കീഴിൽ കൊണ്ടുവരികയാണ് പദ്ധതിയുടെ ലക്ഷ്യം.</div>
    </div>
    <div class="fact-box">
      <div class="fact-box-title">⚓ പ്രധാന വസ്തുതകൾ & പരീക്ഷാ പോയിന്റുകൾ</div>
      <ul class="fact-list">
        <li>സ്ഥലം: ചേവായൂർ, കോഴിക്കോട്</li>
        <li>അനുവദിച്ച തുക: 271 കോടി രൂപ</li>
      </ul>
    </div>
    <div class="slide-qa-box">
      <div class="slide-qa-question">❓ <strong>ചോദ്യം:</strong> അവയവമാറ്റ ശസ്ത്രക്രിയകൾക്കായി കോഴിക്കോട് സ്ഥാപിക്കുന്ന പുതിയ ഇൻസ്റ്റിറ്റ്യൂട്ട് എവിടെയാണ്?</div>
      <div class="slide-qa-answer">✅ <strong>ഉത്തരം:</strong> ചേവായൂർ</div>
    </div>
  </div>
  <div class="right-visual">
    <div class="image-wrapper">
      <img src="./images/story_exact_7.jpg" alt="KERALA" />
    </div>
  </div>
</div>

---

<div class="slide-container">
  <div class="left-content">
    <div>
      <div class="category-tag">SPORTS AFFAIRS</div>
      <div class="main-title">ഏഷ്യൻ ഗെയിംസ് 2026: കർണാടക താരങ്ങൾക്ക് മികച്ച നേട്ടം</div>
      <div class="sub-title">നാല് സ്വർണ്ണമടക്കം ഒൻപത് മെഡലുകൾ സ്വന്തമാക്കി</div>
      <div class="description">2026-ലെ ഏഷ്യൻ ഗെയിംസിൽ കർണാടകയിൽ നിന്നുള്ള കായിക താരങ്ങൾ നാല് സ്വർണ്ണവും മൂന്ന് വെള്ളിയും രണ്ട് വെങ്കലവും ഉൾപ്പെടെ ഒൻപത് മെഡലുകൾ നേടി. കഴിഞ്ഞ ഏഷ്യൻ ഗെയിംസിനെ അപേക്ഷിച്ച് മികച്ച പ്രകടനമാണ് ഇത്തവണ താരങ്ങൾ കാഴ്ചവെച്ചത്.</div>
    </div>
    <div class="fact-box">
      <div class="fact-box-title">⚓ പ്രധാന വസ്തുതകൾ & പരീക്ഷാ പോയിന്റുകൾ</div>
      <ul class="fact-list">
        <li>ഇനം: ഏഷ്യൻ ഗെയിംസ് 2026</li>
        <li>നേട്ടം: 4 സ്വർണ്ണം, 3 വെള്ളി, 2 വെങ്കലം</li>
      </ul>
    </div>
    <div class="slide-qa-box">
      <div class="slide-qa-question">❓ <strong>ചോദ്യം:</strong> 2026-ലെ ഏഷ്യൻ ഗെയിംസിൽ കർണാടക താരങ്ങൾ ആകെ എത്ര മെഡലുകളാണ് നേടിയത്?</div>
      <div class="slide-qa-answer">✅ <strong>ഉത്തരം:</strong> ഒൻപത് (4 സ്വർണ്ണം, 3 വെള്ളി, 2 വെങ്കലം)</div>
    </div>
  </div>
  <div class="right-visual">
    <div class="image-wrapper">
      <img src="./images/story_exact_8.jpg" alt="SPORTS" />
    </div>
  </div>
</div>

---

<div class="slide-container">
  <div class="full-content">
    <div>
      <div class="category-tag">📚 DAILY VOCABULARY</div>
      <div class="main-title">ദിനപത്രത്തിൽ നിന്നുള്ള 2 പ്രധാന പദങ്ങൾ</div>
    </div>
    <div style="display: flex; flex-direction: row; gap: 20px; margin-top: 14px; width: 100%; box-sizing: border-box;">
      <div class="vocab-card" style="flex: 1; min-width: 0; padding: 14px 18px;">
        <div style="font-size: 22px; font-weight: 800; color: #1e3a8a; margin-bottom: 6px;">1. SPURIOUS <span style="font-size: 14px; color: #64748b; font-weight: normal;">(Adjective)</span></div>
        <div style="font-size: 15.5px; margin-bottom: 6px;"><strong>English:</strong> Not being what it purports to be; false or fake.</div>
        <div style="font-size: 15.5px; color: #059669; font-weight: 700; margin-bottom: 8px;"><strong>മലയാളം:</strong> വ്യാജമായ, കൃത്രിമമായ</div>
        <div style="font-size: 14.5px; color: #334155; line-height: 1.45;"><strong>Example:</strong> <em>"The investigation into the spurious drugs case revealed international links."</em></div>
      </div>
      <div class="vocab-card" style="flex: 1; min-width: 0; padding: 14px 18px;">
        <div style="font-size: 22px; font-weight: 800; color: #1e3a8a; margin-bottom: 6px;">2. DOG-WHISTLE <span style="font-size: 14px; color: #64748b; font-weight: normal;">(Noun)</span></div>
        <div style="font-size: 15.5px; margin-bottom: 6px;"><strong>English:</strong> Political messaging employing coded language that appears normal to the general public but conveys a specific meaning to a targeted group.</div>
        <div style="font-size: 15.5px; color: #059669; font-weight: 700; margin-bottom: 8px;"><strong>മലയാളം:</strong> സൂചന നൽകുന്ന രഹസ്യഭാഷ (രാഷ്ട്രീയത്തിൽ)</div>
        <div style="font-size: 14.5px; color: #334155; line-height: 1.45;"><strong>Example:</strong> <em>"The Chief Minister accused the opposition of using dog-whistle politics to polarize the community."</em></div>
      </div>
    </div>
    <div class="fact-box" style="margin-top: 14px; padding: 10px 16px;">
      <div class="fact-box-title" style="font-size: 15px; margin-bottom: 4px;">💡 പരീക്ഷാ ടിപ്പ്</div>
      <div style="font-size: 14.5px; color: #064e3b; line-height: 1.4;">കഴിഞ്ഞ മത്സരപരീക്ഷകളിൽ ആവർത്തിച്ചു ചോദിച്ച പ്രധാന ഇംഗ്ലീഷ് പദങ്ങളും അവയുടെ പ്രയോഗവുമാണ് ഇവിടെ നൽകിയിരിക്കുന്നത്.</div>
    </div>
  </div>
</div>
