/**
 * Automated 7-Day Editorial Vocabulary Generator (16:9 Marp Slides, PDF & Malayalam Scripts)
 * 
 * Target: Kerala PSC, SSC CGL/CHSL, Banking (IBPS/SBI), UPSC
 * 
 * Features:
 * - 7 Days of Curated High-Yield Exam Verbs (5 words per day = 35 total words).
 * - Complete V1 (Base), V2 (Past), V3 (Past Participle), V4 (-ing) forms.
 * - Bilingual Definitions (English + Malayalam).
 * - Contextual Newspaper Editorial Sentences.
 * - Exam Tips, Synonyms & Antonyms.
 * - Generates Marp Slides (.md), Compiles to Interactive HTML and PDF.
 * - Generates Synced Malayalam Voice-Over Recording Scripts.
 * 
 * Usage:
 *   node scripts/generate_vocabulary_series.js --day=1
 *   node scripts/generate_vocabulary_series.js --all
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const REPORTS_DIR = path.join(__dirname, '../reports');

if (!fs.existsSync(REPORTS_DIR)) {
  fs.mkdirSync(REPORTS_DIR, { recursive: true });
}

// 7-Day Curated Exam Vocabulary Dataset
const VOCABULARY_DAYS = [
  {
    day: 1,
    title: "Editorial Vocabulary Booster: Day 01",
    subtitle: "5 High-Yield Verbs (V1, V2, V3 & Editorial Usage)",
    words: [
      {
        word: "EXACERBATE",
        pos: "Verb / ക്രിയ",
        v1: "exacerbate",
        v2: "exacerbated",
        v3: "exacerbated",
        v4: "exacerbating",
        pronunciation: "/ɪɡˈzæs.ə.beɪt/",
        englishMeaning: "To make a problem, bad situation, or negative feeling worse or more severe.",
        malayalamMeaning: "കൂടുതൽ വഷളാക്കുക, രൂക്ഷമാക്കുക, നില വഷളാക്കുക",
        exampleSentence: "Rising global crude oil prices have further exacerbated domestic inflationary pressures in developing economies.",
        synonyms: "aggravate, worsen, intensify, inflame",
        antonyms: "alleviate, mitigate, soothe, relieve",
        examTip: "PSC & SSC പരീക്ഷകളിൽ 'Worsen' എന്നതിന്റെ Synonyms ചോദിക്കുമ്പോൾ ആവർത്തിച്ചു വരുന്ന പദമാണിത്. 'Alleviate/Mitigate' ഇതിന്റെ Antonyms ആണ്."
      },
      {
        word: "VINDICATE",
        pos: "Verb / ക്രിയ",
        v1: "vindicate",
        v2: "vindicated",
        v3: "vindicated",
        v4: "vindicating",
        pronunciation: "/ˈvɪn.dɪ.keɪt/",
        englishMeaning: "To clear someone of blame or suspicion; to show or prove that something is right, reasonable, or justified.",
        malayalamMeaning: "കുറ്റവിമുക്തനാക്കുക, നിരപരാധിത്വം തെളിയിക്കുക, നീതീകരിക്കുക",
        exampleSentence: "The recent independent audit findings completely vindicated the department's fiscal transparent procedures.",
        synonyms: "exonerate, absolve, justify, acquit",
        antonyms: "incriminate, convict, blame, condemn",
        examTip: "One-Word Substitution-ൽ \"To clear from blame or suspicion\" എന്ന് ചോദിച്ചാൽ ശരിയുത്തരം Vindicate / Exonerate ആണ്."
      },
      {
        word: "ABROGATE",
        pos: "Verb / ക്രിയ",
        v1: "abrogate",
        v2: "abrogated",
        v3: "abrogated",
        v4: "abrogating",
        pronunciation: "/ˈæb.rə.ɡeɪt/",
        englishMeaning: "To repeal, abolish, or do away with an official law, right, treaty, or formal agreement.",
        malayalamMeaning: "നിയമം ഔദ്യോഗികമായി റദ്ദാക്കുക, അസാധുവാക്കുക, ഇല്ലാതാക്കുക",
        exampleSentence: "The legislature introduced a special bill to officially abrogate the obsolete colonial-era maritime regulations.",
        synonyms: "repeal, revoke, annul, nullify, rescind",
        antonyms: "enact, institute, uphold, establish",
        examTip: "പത്രങ്ങളിലും Polity ചോദ്യങ്ങളിലും 'Abrogate / Repeal' സ്ഥിരമായി വരുന്നു. \"To abolish by authoritative action\" = Abrogate."
      },
      {
        word: "MITIGATE",
        pos: "Verb / ക്രിയ",
        v1: "mitigate",
        v2: "mitigated",
        v3: "mitigated",
        v4: "mitigating",
        pronunciation: "/ˈmɪt.ɪ.ɡeɪt/",
        englishMeaning: "To make something bad, painful, or dangerous less severe, harsh, or serious.",
        malayalamMeaning: "ലഘൂകരിക്കുക, കാഠിന്യം കുറയ്ക്കുക, ആശ്വാസം നൽകുക",
        exampleSentence: "Proactive disaster management measures significantly helped mitigate the potential damage from coastal storm surges.",
        synonyms: "alleviate, lessen, ease, diminish, reduce",
        antonyms: "exacerbate, aggravate, worsen, amplify",
        examTip: "Exacerbate-ന്റെ കൃത്യമായ വിപരീത പദമാണ് (Antonym) Mitigate! പരീക്ഷയിൽ ഇവ രണ്ടും ജോഡിയായി ചോദിക്കാറുണ്ട്."
      },
      {
        word: "DISSEMINATE",
        pos: "Verb / ക്രിയ",
        v1: "disseminate",
        v2: "disseminated",
        v3: "disseminated",
        v4: "disseminating",
        pronunciation: "/dɪˈsem.ɪ.neɪt/",
        englishMeaning: "To spread or disperse information, knowledge, or ideas widely to a large group of people.",
        malayalamMeaning: "വ്യാപകമായി പ്രചരിപ്പിക്കുക, വിവരങ്ങൾ എത്തിക്കുക, വിതരണം ചെയ്യുക",
        exampleSentence: "The health authorities leveraged grassroots networks to disseminate verified health advisories during the outbreak.",
        synonyms: "circulate, broadcast, propagate, disperse",
        antonyms: "suppress, conceal, withhold, restrict",
        examTip: "\"To spread news or knowledge widely\" എന്ന One-Word Substitution ചോദിക്കുമ്പോൾ ഉത്തരമായി വരുന്നത് Disseminate ആണ്."
      }
    ]
  },
  {
    day: 2,
    title: "Editorial Vocabulary Booster: Day 02",
    subtitle: "5 High-Yield Verbs (V1, V2, V3 & Editorial Usage)",
    words: [
      {
        word: "PLACATE",
        pos: "Verb / ക്രിയ",
        v1: "placate",
        v2: "placated",
        v3: "placated",
        v4: "placating",
        pronunciation: "/pləˈkeɪt/",
        englishMeaning: "To make someone less angry or hostile, especially by conciliation or concessions.",
        malayalamMeaning: "പ്രീതിപ്പെടുത്തുക, അനുനയിപ്പിക്കുക, ശാന്തനാക്കുക",
        exampleSentence: "The government announced financial subsidies in an attempt to placate the protesting farming community.",
        synonyms: "pacify, appease, conciliate, mollify",
        antonyms: "provoke, enrage, antagonize, irritate",
        examTip: "SSC / PSC പരീക്ഷകളിൽ 'Pacify' അല്ലെങ്കിൽ 'Appease' എന്നതിന്റെ പര്യായമായി ചോദിക്കാറുള്ള പ്രധാന വാക്കാണ് Placate."
      },
      {
        word: "RESCIND",
        pos: "Verb / ക്രിയ",
        v1: "rescind",
        v2: "rescinded",
        v3: "rescinded",
        v4: "rescinding",
        pronunciation: "/rɪˈsɪnd/",
        englishMeaning: "To revoke, cancel, or repeal a law, contract, order, or official decision.",
        malayalamMeaning: "റദ്ദാക്കുക, തിരിച്ചെടുക്കുക, പിൻവലിക്കുക",
        exampleSentence: "Facing severe constitutional challenges, the administrative tribunal was forced to rescind its controversial order.",
        synonyms: "revoke, cancel, overturn, annul, repeal",
        antonyms: "enforce, validate, ratify, implement",
        examTip: "\"To cancel or revoke an official decree\" = Rescind. Abrogate, Revoke, Rescind എന്നിവ ഒരേ അർത്ഥം വരുന്ന പദങ്ങളാണ്."
      },
      {
        word: "AUGMENT",
        pos: "Verb / ക്രിയ",
        v1: "augment",
        v2: "augmented",
        v3: "augmented",
        v4: "augmenting",
        pronunciation: "/ɔːɡˈment/",
        englishMeaning: "To make something greater by adding to it; to increase or enlarge.",
        malayalamMeaning: "വർദ്ധിപ്പിക്കുക, വലുതാക്കുക, കൂടുതൽ കൂട്ടിച്ചേർക്കുക",
        exampleSentence: "The state power utility initiated green energy projects to augment its peak summer power supply.",
        synonyms: "increase, expand, enhance, amplify, enlarge",
        antonyms: "diminish, decrease, deplete, reduce",
        examTip: "'Augment' (വർദ്ധിപ്പിക്കുക) വിപരീത പദമായി വരുന്നത് 'Diminish' അല്ലെങ്കിൽ 'Deplete' ആണ്. വൊക്കാബുലറി ചോദ്യങ്ങളിൽ ആവർത്തിച്ചു വരുന്നു."
      },
      {
        word: "DISPARAGE",
        pos: "Verb / ക്രിയ",
        v1: "disparage",
        v2: "disparaged",
        v3: "disparaged",
        v4: "disparaging",
        pronunciation: "/dɪˈspær.ɪdʒ/",
        englishMeaning: "To regard or represent as being of little worth; to belittle or speak slightingly of.",
        malayalamMeaning: "തരംതാഴ്ത്തി സംസാരിക്കുക, വിലകുറച്ചു കാണുക, ഇകഴ്ത്തുക",
        exampleSentence: "Responsible leaders should never disparage democratic institutions during public election debates.",
        synonyms: "belittle, denigrate, deprecate, decry, defame",
        antonyms: "praise, extol, commend, compliment",
        examTip: "\"To regard as being of little worth\" = Disparage / Belittle. ഇതിന്റെ വിപരീത പദം 'Extol' (പ്രശംസിക്കുക) ആണ്."
      },
      {
        word: "CORROBORATE",
        pos: "Verb / ക്രിയ",
        v1: "corroborate",
        v2: "corroborated",
        v3: "corroborated",
        v4: "corroborating",
        pronunciation: "/kəˈrɒb.ə.reɪt/",
        englishMeaning: "To confirm or give support to a statement, theory, or finding with evidence.",
        malayalamMeaning: "തെളിവുകൾ നിരത്തി സാധൂകരിക്കുക, സ്ഥിരീകരിക്കുക, പിന്തുണയ്ക്കുക",
        exampleSentence: "Satellite telemetry data provided concrete evidence to corroborate the meteorological department's cyclone track forecast.",
        synonyms: "confirm, verify, substantiate, validate, uphold",
        antonyms: "refute, contradict, disprove, deny",
        examTip: "കോടതി വാർത്തകളിലും സയൻസ് എഡിറ്റോറിയലുകളിലും കാണുന്ന വാക്കാണ് Corroborate (സാധൂകരിക്കുക). Antonym: 'Refute' (ഖണ്ഡിക്കുക)."
      }
    ]
  },
  {
    day: 3,
    title: "Editorial Vocabulary Booster: Day 03",
    subtitle: "5 High-Yield Verbs (V1, V2, V3 & Editorial Usage)",
    words: [
      {
        word: "PROLIFERATE",
        pos: "Verb / ക്രിയ",
        v1: "proliferate",
        v2: "proliferated",
        v3: "proliferated",
        v4: "proliferating",
        pronunciation: "/prəˈlɪf.ər.eɪt/",
        englishMeaning: "To increase rapidly in numbers; to multiply rapidly.",
        malayalamMeaning: "അതിവേഗം പെരുകുക, വ്യാപിപ്പിക്കുക, വർദ്ധിക്കുക",
        exampleSentence: "Digital fintech applications have proliferated across tier-two and tier-three Indian towns over the past decade.",
        synonyms: "multiply, escalate, mushroom, burgeon, expand",
        antonyms: "dwindle, diminish, decline, decrease",
        examTip: "\"To grow or increase rapidly\" = Proliferate / Burgeon. Antonym: 'Dwindle' (കുറഞ്ഞു വരിക)."
      },
      {
        word: "CAPITULATE",
        pos: "Verb / ക്രിയ",
        v1: "capitulate",
        v2: "capitulated",
        v3: "capitulated",
        v4: "capitulating",
        pronunciation: "/kəˈpɪtʃ.ə.leɪt/",
        englishMeaning: "To cease to resist an opponent or an unwelcome demand; to surrender.",
        malayalamMeaning: "കീഴടങ്ങുക, സമ്മതിക്കുക, തോൽവി സമ്മതിക്കുക",
        exampleSentence: "Under mounting fiscal scrutiny, the recalcitrant firm finally capitulated to the regulatory guidelines.",
        synonyms: "surrender, yield, concede, succumb",
        antonyms: "resist, conquer, withstand, oppose",
        examTip: "One-Word Substitution-ൽ സ്ഥിരമായി ചോദിക്കുന്ന പദമാണ്: \"To surrender under agreed conditions\" = Capitulate."
      },
      {
        word: "IMPEDE",
        pos: "Verb / ക്രിയ",
        v1: "impede",
        v2: "impeded",
        v3: "impeded",
        v4: "impeding",
        pronunciation: "/ɪmˈpiːd/",
        englishMeaning: "To delay or prevent someone or something by obstructing them; to hinder.",
        malayalamMeaning: "തടസ്സപ്പെടുത്തുക, തടസ്സം സൃഷ്ടിക്കുക, വൈകിപ്പിക്കുക",
        exampleSentence: "Excessive bureaucratic paperwork should never impede legitimate entrepreneurial initiatives in the state.",
        synonyms: "hinder, obstruct, hamper, block, inhibit",
        antonyms: "facilitate, expedite, assist, aid",
        examTip: "ഇതിന്റെ Antonym ആണ് പരീക്ഷകളിൽ സ്ഥിരം വരുന്നത്: 'Expedite' (വേഗത്തിലാക്കുക) അല്ലെങ്കിൽ 'Facilitate' (സഹായിക്കുക)."
      },
      {
        word: "EXONERATE",
        pos: "Verb / ക്രിയ",
        v1: "exonerate",
        v2: "exonerated",
        v3: "exonerated",
        v4: "exonerating",
        pronunciation: "/ɪɡˈzɒn.ə.reɪt/",
        englishMeaning: "To officially absolve someone from blame for a fault or wrongdoing.",
        malayalamMeaning: "കുറ്റവിമുക്തനാക്കുക, ശിക്ഷയിൽ നിന്ന് ഒഴിവാക്കുക",
        exampleSentence: "The judicial inquiry committee report exonerated the civil service officers of all administrative misconduct allegations.",
        synonyms: "absolve, acquit, vindicate, discharge",
        antonyms: "incriminate, blame, convict, indict",
        examTip: "Vindicate, Exonerate, Acquit എന്നിവ ഒരേ അർത്ഥമുള്ള പദങ്ങളാണ് (Synonyms). ഇതിന്റെ വിപരീത പദം 'Incriminate / Convict' ആണ്."
      },
      {
        word: "AMELIORATE",
        pos: "Verb / ക്രിയ",
        v1: "ameliorate",
        v2: "ameliorated",
        v3: "ameliorated",
        v4: "ameliorating",
        pronunciation: "/əˈmiːl.jə.reɪt/",
        englishMeaning: "To make something that is bad or unsatisfactory better; to improve.",
        malayalamMeaning: "മെച്ചപ്പെടുത്തുക, ഗുണകരമായ മാറ്റം വരുത്തുക, അവസ്ഥ നന്നാക്കുക",
        exampleSentence: "Targeted financial welfare packages are designed to ameliorate the living standards of agrarian households.",
        synonyms: "improve, better, enhance, upgrade",
        antonyms: "worsen, deteriorate, exacerbate",
        examTip: "'Exacerbate' (വഷളാക്കുക) എന്നതിന്റെ കൃത്യമായ വിപരീത പദമാണ് 'Ameliorate' (മെച്ചപ്പെടുത്തുക). പരീക്ഷകളിൽ ആവർത്തിച്ചു ചോദിക്കാറുണ്ട്."
      }
    ]
  },
  {
    day: 4,
    title: "Editorial Vocabulary Booster: Day 04",
    subtitle: "5 High-Yield Verbs (V1, V2, V3 & Editorial Usage)",
    words: [
      {
        word: "DELIBERATE",
        pos: "Verb / ക്രിയ",
        v1: "deliberate",
        v2: "deliberated",
        v3: "deliberated",
        v4: "deliberating",
        pronunciation: "/dɪˈlɪb.ə.reɪt/",
        englishMeaning: "To engage in long and careful consideration or discussion before making a decision.",
        malayalamMeaning: "ആഴത്തിൽ ചിന്തിക്കുക, വിശദമായി ചർച്ച ചെയ്ത് തീരുമാനമെടുക്കുക",
        exampleSentence: "The GST Council deliberated for hours before finalizing the revised tax slabs for essential commodities.",
        synonyms: "ponder, contemplate, ruminate, debate, meditate",
        antonyms: "rush, ignore, overlook, disregard",
        examTip: "Deliberate എന്നത് Adjective ആയും വരാം ('ഉദ്ദേശപൂർവ്വമായ'). Verb ആയി വരുമ്പോൾ 'ദീർഘമായി ചർച്ച ചെയ്യുക / ചിന്തിക്കുക' എന്നാണ് അർത്ഥം."
      },
      {
        word: "PREVARICATE",
        pos: "Verb / ക്രിയ",
        v1: "prevaricate",
        v2: "prevaricated",
        v3: "prevaricated",
        v4: "prevaricating",
        pronunciation: "/prɪˈvær.ɪ.keɪt/",
        englishMeaning: "To speak or act in an evasive way; to avoid telling the truth directly.",
        malayalamMeaning: "വളച്ചൊടിച്ചു സംസാരിക്കുക, ഒഴിഞ്ഞുമാറുക, സത്യം പറയാതിരിക്കുക",
        exampleSentence: "When questioned about the budget deficit, the spokesperson continued to prevaricate rather than presenting clear statistics.",
        synonyms: "equivocate, hedge, evade, stall, deceive",
        antonyms: "confront, speak truthfully, clarify",
        examTip: "\"To speak evasively in order to avoid the truth\" = Prevaricate / Equivocate. UPSC & SSC-യിലെ പ്രിയപ്പെട്ട ചോദ്യം."
      },
      {
        word: "ADVOCATE",
        pos: "Verb / ക്രിയ",
        v1: "advocate",
        v2: "advocated",
        v3: "advocated",
        v4: "advocating",
        pronunciation: "/ˈæd.və.keɪt/",
        englishMeaning: "To publicly recommend or support a particular cause, policy, or action.",
        malayalamMeaning: "പരസ്യമായി അനുകൂലിക്കുക, പിന്തുണയ്ക്കുക, വാദിക്കുക",
        exampleSentence: "Environmental scientists advocate stringent carbon pricing mechanisms to combat global warming effectively.",
        synonyms: "champion, promote, endorse, support, uphold",
        antonyms: "oppose, denounce, reject, discourage",
        examTip: "Verb ആയി വരുമ്പോൾ 'അനുകൂലിക്കുക' എന്നാണ് അർത്ഥം. Pronunciation: /ˈæd.və.keɪt/. Antonym: 'Oppose / Denounce'."
      },
      {
        word: "REPROACH",
        pos: "Verb / ക്രിയ",
        v1: "reproach",
        v2: "reproached",
        v3: "reproached",
        v4: "reproaching",
        pronunciation: "/rɪˈprəʊtʃ/",
        englishMeaning: "To express sharp disapproval or disappointment with someone for their actions.",
        malayalamMeaning: "ശകാരിക്കുക, ശാസിക്കുക, കുറ്റപ്പെടുത്തുക",
        exampleSentence: "The apex court reproached the municipal corporation for its utter negligence in road safety maintenance.",
        synonyms: "rebuke, reprimand, censure, scold, admonish",
        antonyms: "praise, commend, applaud, approve",
        examTip: "\"To express sharp disapproval or criticism\" = Reproach / Reprimand / Censure. ഇതെല്ലാം ആവർത്തിച്ചു ചോദിക്കുന്ന Synonyms ആണ്."
      },
      {
        word: "PROPAGATE",
        pos: "Verb / ക്രിയ",
        v1: "propagate",
        v2: "propagated",
        v3: "propagated",
        v4: "propagating",
        pronunciation: "/ˈprɒp.ə.ɡeɪt/",
        englishMeaning: "To spread and promote an idea, theory, or practice widely.",
        malayalamMeaning: "പ്രചരിപ്പിക്കുക, വംശവർദ്ധനവ് വരുത്തുക, വ്യാപിപ്പിക്കുക",
        exampleSentence: "Social reformers worked tirelessly to propagate scientific temper and secular values among the masses.",
        synonyms: "disseminate, spread, circulate, promote, broadcast",
        antonyms: "suppress, hide, censor, squash",
        examTip: "Disseminate, Broadcast, Propagate എന്നിവ Synonyms ആണ്. വിപരീത പദം 'Suppress' (അടിച്ചമർത്തുക)."
      }
    ]
  },
  {
    day: 5,
    title: "Editorial Vocabulary Booster: Day 05",
    subtitle: "5 High-Yield Verbs (V1, V2, V3 & Editorial Usage)",
    words: [
      {
        word: "SUBSTANTIATE",
        pos: "Verb / ക്രിയ",
        v1: "substantiate",
        v2: "substantiated",
        v3: "substantiated",
        v4: "substantiating",
        pronunciation: "/səbˈstæn.ʃi.eɪt/",
        englishMeaning: "To provide evidence to support or prove the truth of something.",
        malayalamMeaning: "തെളിവുകളോടെ സമർത്ഥിക്കുക, തെളിയിക്കുക, സ്ഥാപിക്കുക",
        exampleSentence: "The prosecution failed to produce verified forensic evidence to substantiate its severe accusations.",
        synonyms: "corroborate, verify, authenticate, prove, validate",
        antonyms: "disprove, refute, undermine, invalidate",
        examTip: "Corroborate, Validate, Substantiate എന്നിവ 'തെളിയിക്കുക' എന്ന അർത്ഥത്തിൽ വരുന്ന തുല്യ പദങ്ങളാണ്."
      },
      {
        word: "REPUDIATE",
        pos: "Verb / ക്രിയ",
        v1: "repudiate",
        v2: "repudiated",
        v3: "repudiated",
        v4: "repudiating",
        pronunciation: "/rɪˈpjuː.di.eɪt/",
        englishMeaning: "To refuse to accept, be associated with, or acknowledge the validity of.",
        malayalamMeaning: "തള്ളിപ്പറയുക, അംഗീകരിക്കാൻ വിസമ്മതിക്കുക, നിഷേധിക്കുക",
        exampleSentence: "The sovereign state unequivocally repudiated the unilateral border claims made by its neighbor.",
        synonyms: "reject, renounce, disown, deny, disclaim",
        antonyms: "accept, acknowledge, embrace, ratify",
        examTip: "\"To refuse to accept or acknowledge\" = Repudiate / Disown. Antonym: 'Ratify / Acknowledge'."
      },
      {
        word: "DEVIATE",
        pos: "Verb / ക്രിയ",
        v1: "deviate",
        v2: "deviated",
        v3: "deviated",
        v4: "deviating",
        pronunciation: "/ˈdiː.vi.eɪt/",
        englishMeaning: "To depart from an established course, principle, or standard.",
        malayalamMeaning: "വ്യതിചലിക്കുക, നേർവഴിയിൽ നിന്ന് മാറുക, വ്യതിയാനപ്പെടുക",
        exampleSentence: "The regulatory body warned registered airlines not to deviate from approved flight path protocols.",
        synonyms: "diverge, stray, veer, depart, drift",
        antonyms: "conform, adhere, stay, follow",
        examTip: "Preposition Usage: 'Deviate' കഴിഞ്ഞു എപ്പോഴും Preposition ആയി വരുന്നത് **'from'** ആണ് (e.g. deviate from the rules)."
      },
      {
        word: "ACCENTUATE",
        pos: "Verb / ക്രിയ",
        v1: "accentuate",
        v2: "accentuated",
        v3: "accentuated",
        v4: "accentuating",
        pronunciation: "/əkˈsen.tʃu.eɪt/",
        englishMeaning: "To make something more noticeable or prominent; to emphasize.",
        malayalamMeaning: "എടുത്തു കാണിക്കുക, പ്രാധാന്യം നൽകുക, വ്യക്തമാക്കുക",
        exampleSentence: "The acute economic crisis served only to accentuate the existing income disparities within the country.",
        synonyms: "highlight, emphasize, underscore, feature, spotlight",
        antonyms: "mask, downplay, minimize, disguise",
        examTip: "'Highlight' അല്ലെങ്കിൽ 'Emphasize' എന്നതിന്റെ മികച്ചൊരു എഡിറ്റോറിയൽ പദമാണ് Accentuate. Antonym: 'Downplay'."
      },
      {
        word: "OSCILLATE",
        pos: "Verb / ക്രിയ",
        v1: "oscillate",
        v2: "oscillated",
        v3: "oscillated",
        v4: "oscillating",
        pronunciation: "/ˈɒs.ɪ.leɪt/",
        englishMeaning: "To move or swing back and forth at a regular speed; to waver between different opinions or actions.",
        malayalamMeaning: "ആന്ദോളനം ചെയ്യുക, ചാഞ്ചാടുക, തീരുമാനത്തിൽ ഉറച്ചുനിൽക്കാതിരിക്കുക",
        exampleSentence: "Stock indices continued to oscillate throughout the trading session due to erratic global sentiment.",
        synonyms: "fluctuate, waver, swing, sway, vacillate",
        antonyms: "stabilize, settle, remain constant",
        examTip: "Vacillate, Fluctuate, Oscillate എന്നിവ ഒരേ അർത്ഥമുള്ളവയാണ്. Antonym: 'Stabilize' (സ്ഥിരത കൈവരിക്കുക)."
      }
    ]
  },
  {
    day: 6,
    title: "Editorial Vocabulary Booster: Day 06",
    subtitle: "5 High-Yield Verbs (V1, V2, V3 & Editorial Usage)",
    words: [
      {
        word: "ENUNCIATE",
        pos: "Verb / ക്രിയ",
        v1: "enunciate",
        v2: "enunciated",
        v3: "enunciated",
        v4: "enunciating",
        pronunciation: "/ɪˈnʌn.si.eɪt/",
        englishMeaning: "To say or pronounce clearly; to express a proposition, policy, or theory in clear or definite terms.",
        malayalamMeaning: "വ്യക്തമായി ഉച്ചരിക്കുക, ആശയങ്ങൾ കൃത്യമായി വ്യക്തമാക്കുക / പ്രഖ്യാപിക്കുക",
        exampleSentence: "The governor enunciated the constitutional vision of equitable regional development in his policy address.",
        synonyms: "articulate, pronounce, state, voice, declare",
        antonyms: "mumble, slur, mispronounce, suppress",
        examTip: "\"To pronounce words clearly\" = Enunciate / Articulate. Antonym: 'Mumble' (അവ്യക്തമായി പറയുക)."
      },
      {
        word: "OBLITERATE",
        pos: "Verb / ക്രിയ",
        v1: "obliterate",
        v2: "obliterated",
        v3: "obliterated",
        v4: "obliterating",
        pronunciation: "/əˈblɪt.ər.eɪt/",
        englishMeaning: "To destroy utterly; to wipe out completely or cause to become invisible.",
        malayalamMeaning: "പൂർണ്ണമായി തുടച്ചുനീക്കുക, നശിപ്പിക്കുക, അവശേഷിപ്പില്ലാതെ ഇല്ലാതാക്കുക",
        exampleSentence: "The flash flood swept down the valley, completely obliterating century-old connectivity infrastructure.",
        synonyms: "destroy, wipe out, annihilate, erase, eradicate",
        antonyms: "create, build, preserve, construct",
        examTip: "\"To blot out or destroy completely\" = Obliterate / Annihilate. Antonym: 'Preserve / Construct'."
      },
      {
        word: "EQUIVOCATE",
        pos: "Verb / ക്രിയ",
        v1: "equivocate",
        v2: "equivocated",
        v3: "equivocated",
        v4: "equivocating",
        pronunciation: "/ɪˈkwɪv.ə.keɪt/",
        englishMeaning: "To use ambiguous language to conceal the truth or avoid committing oneself.",
        malayalamMeaning: "ഇരുതലമൂർച്ചയുള്ള വാക്കുകൾ പറയുക, വ്യക്തതയില്ലാതെ സംസാരിക്കുക, വളച്ചൊടിക്കുക",
        exampleSentence: "Under cross-examination, the key witness began to equivocate when asked about his exact whereabouts.",
        synonyms: "prevaricate, hedge, evade, vacillate, dodge",
        antonyms: "be blunt, clarify, confront, state clearly",
        examTip: "Prevaricate & Equivocate എന്നിവ സമാന അർത്ഥമുള്ള പദങ്ങളാണ്. One-word substitution-ൽ ചോദിക്കാറുണ്ട്."
      },
      {
        word: "RETRACT",
        pos: "Verb / ക്രിയ",
        v1: "retract",
        v2: "retracted",
        v3: "retracted",
        v4: "retracting",
        pronunciation: "/rɪˈtrækt/",
        englishMeaning: "To draw back or draw in; to withdraw a statement, accusation, or promise as untrue.",
        malayalamMeaning: "പിൻവലിക്കുക, തിരിച്ചെടുക്കുക, മുൻപ് പറഞ്ഞത് തെറ്റാണെന്ന് പറഞ്ഞു പിൻവലിക്കുക",
        exampleSentence: "Following a legal defamation notice, the media outlet was forced to retract its unfounded allegations.",
        synonyms: "withdraw, recant, revoke, disavow, take back",
        antonyms: "assert, reaffirm, maintain, uphold",
        examTip: "\"To withdraw a statement or belief formally\" = Recant / Retract. Antonym: 'Reaffirm' (ഉറപ്പിച്ചു പറയുക)."
      },
      {
        word: "CONVALESCE",
        pos: "Verb / ക്രിയ",
        v1: "convalesce",
        v2: "convalesced",
        v3: "convalesced",
        v4: "convalescing",
        pronunciation: "/ˌkɒn.vəˈles/",
        englishMeaning: "To recover health and strength gradually after an illness or injury.",
        malayalamMeaning: "രോഗമുക്തി നേടുക, സുഖം പ്രാപിക്കുക, ക്രമേണ ആരോഗ്യം വീണ്ടെടുക്കുക",
        exampleSentence: "The veteran leader took a short hiatus from active politics to convalesce after a minor surgical procedure.",
        synonyms: "recover, recuperate, heal, mend, get better",
        antonyms: "relapse, deteriorate, weaken, sicken",
        examTip: "\"To recover gradually after illness\" = Convalesce / Recuperate. ഇതിൽ നിന്നാണ് 'Convalescent' (രോഗവിമുക്തി നേടുന്ന വ്യക്തി) ഉണ്ടാകുന്നത്."
      }
    ]
  },
  {
    day: 7,
    title: "Editorial Vocabulary Booster: Day 07",
    subtitle: "5 High-Yield Verbs (V1, V2, V3 & Editorial Usage)",
    words: [
      {
        word: "REJUVENATE",
        pos: "Verb / ക്രിയ",
        v1: "rejuvenate",
        v2: "rejuvenated",
        v3: "rejuvenated",
        v4: "rejuvenating",
        pronunciation: "/rɪˈdʒuː.vən.eɪt/",
        englishMeaning: "To make someone or something look or feel younger, fresher, or more lively.",
        malayalamMeaning: "പുനരുജ്ജീവിപ്പിക്കുക, പുതിയ ഉന്മേഷം നൽകുക, നവീകരിക്കുക",
        exampleSentence: "The massive urban renewal scheme aims to rejuvenate historical town centers and enhance civic amenities.",
        synonyms: "revitalize, revive, refresh, regenerate, renew",
        antonyms: "drain, exhaust, age, deplete",
        examTip: "Rejuvenate, Revitalize, Revive എന്നിവ Synonyms ആണ്. Antonym: 'Drain / Exhaust'."
      },
      {
        word: "DETERIORATE",
        pos: "Verb / ക്രിയ",
        v1: "deteriorate",
        v2: "deteriorated",
        v3: "deteriorated",
        v4: "deteriorating",
        pronunciation: "/dɪˈtɪə.ri.ə.reɪt/",
        englishMeaning: "To become progressively worse in quality, condition, or character.",
        malayalamMeaning: "ക്രമേണ വഷളാവുക, മോശമാവുക, ക്ഷയിക്കുക",
        exampleSentence: "Air quality in major metropolitan pockets continues to deteriorate during winter atmospheric inversions.",
        synonyms: "worsen, decline, degenerate, decay, drop",
        antonyms: "improve, ameliorate, recuperate, upgrade",
        examTip: "'Ameliorate' (മെച്ചപ്പെടുക) എന്നതിന്റെ കൃത്യമായ വിപരീത പദമാണ് 'Deteriorate' (വഷളാവുക)."
      },
      {
        word: "CONDONE",
        pos: "Verb / ക്രിയ",
        v1: "condone",
        v2: "condoned",
        v3: "condoned",
        v4: "condoning",
        pronunciation: "/kənˈdəʊn/",
        englishMeaning: "To accept and allow behavior that is considered morally wrong or offensive to continue.",
        malayalamMeaning: "തെറ്റുകൾ കണ്ണടച്ചു വിടുക, വിട്ടുവീഴ്ച ചെയ്യുക, ക്ഷമിക്കുക",
        exampleSentence: "The disciplinary committee declared in strong terms that it would never condone unethical financial conduct.",
        synonyms: "overlook, excuse, forgive, pardon, disregard",
        antonyms: "condemn, punish, denounce, forbid",
        examTip: "\"To accept or overlook morally objectionable behavior\" = Condone. Antonym: 'Condemn' (കഠിനമായി അപലപിക്കുക)."
      },
      {
        word: "EXHORT",
        pos: "Verb / ക്രിയ",
        v1: "exhort",
        v2: "exhorted",
        v3: "exhorted",
        v4: "exhorting",
        pronunciation: "/ɪɡˈzɔːt/",
        englishMeaning: "To strongly encourage or urge someone to do something.",
        malayalamMeaning: "തീവ്രമായി ഉപദേശിക്കുക, പ്രോത്സാഹിപ്പിക്കുക, ഉദ്ബോധിപ്പിക്കുക",
        exampleSentence: "The election commission launched youth campaigns to exhort eligible first-time voters to exercise their democratic franchise.",
        synonyms: "urge, encourage, spur, press, advocate",
        antonyms: "dissuade, discourage, deter, prevent",
        examTip: "\"To strongly urge or advise\" = Exhort. Antonym: 'Dissuade' (പിന്തിരിപ്പിക്കുക)."
      },
      {
        word: "ELUCIDATE",
        pos: "Verb / ക്രിയ",
        v1: "elucidate",
        v2: "elucidated",
        v3: "elucidated",
        v4: "elucidating",
        pronunciation: "/ɪˈluː.sɪ.deɪt/",
        englishMeaning: "To make something clear; to explain in detail.",
        malayalamMeaning: "വിശദമാക്കുക, വ്യക്തമാക്കി കൊടുക്കുക, വിശദീകരിച്ചു സമർത്ഥിക്കുക",
        exampleSentence: "The lead research scientist appeared on national television to elucidate the clinical implications of the new vaccine.",
        synonyms: "explain, clarify, illuminate, expound, clear up",
        antonyms: "confuse, obscure, obfuscate, muddle",
        examTip: "\"To make clear or explain thoroughly\" = Elucidate. Antonym: 'Obfuscate' (ആശയക്കുഴപ്പമുണ്ടാക്കുക / അവ്യക്തമാക്കുക)."
      }
    ]
  }
];

// CSS Styling strictly matching Daily_Current_Affairs_*.md
const MARP_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Manjari:wght@400;700&family=Noto+Sans+Malayalam:wght@400;600;700;800&family=Outfit:wght@400;600;700;800&display=swap');
  
  section {
    font-family: 'Outfit', 'Noto Sans Malayalam', 'Manjari', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    padding: 0;
    margin: 0;
    background: #f8fafc;
    color: #1e293b;
    display: flex;
    flex-direction: column;
    width: 1280px;
    height: 720px;
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
    box-sizing: border-box;
  }

  .slide-container {
    width: 100%;
    height: 100%;
    padding: 28px 48px 24px 48px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background: #ffffff;
  }

  .header-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 2px solid #e2e8f0;
    padding-bottom: 8px;
    margin-bottom: 10px;
  }

  .category-tag {
    display: inline-block;
    font-size: 13px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    color: #2563eb;
    background: #eff6ff;
    padding: 4px 14px;
    border-radius: 6px;
    border: 1px solid #bfdbfe;
  }

  .day-badge {
    display: inline-block;
    font-size: 13px;
    font-weight: 700;
    color: #047857;
    background: #ecfdf5;
    padding: 4px 14px;
    border-radius: 6px;
    border: 1px solid #a7f3d0;
  }

  .word-title {
    font-size: 34px;
    font-weight: 800;
    color: #1e3a8a;
    display: flex;
    align-items: baseline;
    gap: 12px;
    margin: 2px 0 10px 0;
  }

  .pos-badge {
    font-size: 16px;
    font-weight: 600;
    color: #64748b;
    background: #f1f5f9;
    padding: 3px 10px;
    border-radius: 5px;
  }

  .verb-matrix {
    display: flex;
    gap: 12px;
    background: #eff6ff;
    border: 1.5px solid #bfdbfe;
    border-radius: 10px;
    padding: 10px 16px;
    margin-bottom: 12px;
  }

  .verb-item {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .verb-label {
    font-size: 11.5px;
    font-weight: 700;
    color: #2563eb;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 2px;
  }

  .verb-val {
    font-size: 17px;
    font-weight: 800;
    color: #0f172a;
  }

  .content-grid {
    display: flex;
    gap: 16px;
    flex: 1;
  }

  .meaning-box {
    flex: 1.2;
    background: #f8fafc;
    border: 1.5px solid #cbd5e1;
    border-radius: 10px;
    padding: 14px 18px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  }

  .meaning-en {
    font-size: 15.5px;
    line-height: 1.45;
    color: #1e293b;
    margin-bottom: 10px;
  }

  .meaning-ml {
    font-size: 16px;
    font-weight: 700;
    color: #059669;
    line-height: 1.4;
    padding-top: 6px;
    border-top: 1px dashed #cbd5e1;
  }

  .example-box {
    flex: 1.3;
    background: #fafaf9;
    border: 1.5px solid #e7e5e4;
    border-left: 4px solid #f59e0b;
    border-radius: 10px;
    padding: 14px 18px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .example-text {
    font-size: 15px;
    line-height: 1.5;
    color: #334155;
    font-style: italic;
  }

  .highlight-word {
    color: #b45309;
    font-weight: 700;
    font-style: normal;
  }

  .syn-ant-row {
    font-size: 13.5px;
    color: #475569;
    margin-top: 10px;
    line-height: 1.4;
    padding-top: 6px;
    border-top: 1px dashed #e2e8f0;
  }

  .exam-tip-box {
    background: #ecfdf5;
    border: 1.5px solid #a7f3d0;
    border-radius: 8px;
    padding: 8px 16px;
    margin-top: 10px;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .exam-tip-icon {
    font-size: 18px;
  }

  .exam-tip-text {
    font-size: 13.5px;
    font-weight: 600;
    color: #065f46;
  }

  .recap-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 8px;
  }

  .recap-table th {
    background: #1e3a8a;
    color: #ffffff;
    font-size: 14px;
    font-weight: 700;
    padding: 9px 14px;
    text-align: left;
    border: 1px solid #1e3a8a;
  }

  .recap-table td {
    padding: 9px 14px;
    font-size: 14px;
    border: 1px solid #cbd5e1;
    color: #1e293b;
  }

  .recap-table tr:nth-child(even) {
    background: #f8fafc;
  }
`;

/**
 * Generate Marp Markdown Content with zero indented-code-block pitfalls.
 * All HTML is flushed without 4+ leading spaces after blank lines.
 */
function buildMarpMarkdown(dayData) {
  const padDay = String(dayData.day).padStart(2, '0');
  
  let md = `---
marp: true
theme: default
size: 16:9
paginate: false
style: |${MARP_CSS}
---

<!-- Slide 1: Cover Slide -->
<div class="cover-slide">
  <div style="background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.3); padding: 6px 20px; border-radius: 30px; font-size: 15px; font-weight: 600; letter-spacing: 1px; color: #7dd3fc; margin-bottom: 16px;">
    SPECIAL 7-DAY VOCABULARY MASTERCLASS
  </div>
  <div style="font-size: 46px; font-weight: 800; color: #ffffff; margin-bottom: 10px; letter-spacing: -0.5px;">
    EDITORIAL VOCABULARY BOOSTER
  </div>
  <div style="font-size: 24px; color: #fbbf24; font-weight: 700; margin-bottom: 22px;">
    DAY ${padDay}: 5 HIGH-YIELD WORDS (V1, V2, V3 & EXAM USE)
  </div>
  <div style="background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255,255,255,0.2); padding: 10px 24px; border-radius: 12px; font-size: 15px; color: #e2e8f0;">
    🎯 Target: Kerala PSC • SSC CGL/CHSL • Banking (IBPS/SBI) • UPSC • Editorial Reading
  </div>
</div>
`;

  dayData.words.forEach((w, idx) => {
    const wordNum = idx + 1;
    const highlightedSentence = w.exampleSentence.replace(
      new RegExp(`\\b(${w.v1}|${w.v2}|${w.v3}|${w.v4})\\b`, 'i'),
      `<span class="highlight-word">$1</span>`
    );

    md += `
---

<!-- Slide ${wordNum + 1}: Word ${wordNum} -->
<div class="slide-container">
<div>
<div class="header-row">
<div class="category-tag">📚 DAILY VOCABULARY BUILDER</div>
<div class="day-badge">DAY ${padDay} • WORD 0${wordNum} / 05</div>
</div>

<div class="word-title">
${wordNum}. ${w.word} <span class="pos-badge">${w.pos}</span>
</div>

<div class="verb-matrix">
<div class="verb-item">
<span class="verb-label">V1 (Base Form)</span>
<span class="verb-val">${w.v1}</span>
</div>
<div class="verb-item">
<span class="verb-label">V2 (Simple Past)</span>
<span class="verb-val">${w.v2}</span>
</div>
<div class="verb-item">
<span class="verb-label">V3 (Past Participle)</span>
<span class="verb-val">${w.v3}</span>
</div>
<div class="verb-item">
<span class="verb-label">V4 / -ing (Continuous)</span>
<span class="verb-val">${w.v4}</span>
</div>
</div>

<div class="content-grid">
<div class="meaning-box">
<div style="font-size: 13px; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 4px;">English Definition</div>
<div class="meaning-en">${w.englishMeaning}</div>
<div style="font-size: 13px; font-weight: 700; color: #047857; text-transform: uppercase; margin-bottom: 4px;">മലയാളം അർത്ഥം</div>
<div class="meaning-ml">${w.malayalamMeaning}</div>
</div>
<div class="example-box">
<div>
<div class="example-text">
"${highlightedSentence}"
</div>
</div>
<div class="syn-ant-row">
<strong>Synonyms:</strong> ${w.synonyms}<br/>
<strong>Antonyms:</strong> ${w.antonyms}
</div>
</div>
</div>
</div>

<div class="exam-tip-box">
<span class="exam-tip-icon">💡</span>
<span class="exam-tip-text">
<strong>Exam Tip:</strong> ${w.examTip}
</span>
</div>
</div>
`;
  });

  // Slide 7: Rapid Recap Table
  md += `
---

<!-- Slide 7: Fast Revision Table -->
<div class="slide-container">
<div>
<div class="header-row">
<div class="category-tag">⚡ RAPID RECAP</div>
<div class="day-badge">DAY ${padDay} • SUMMARY SCREENSHOT</div>
</div>

<div style="font-size: 24px; font-weight: 800; color: #1e3a8a; margin-bottom: 4px;">
Today's 5 Words At A Glance (ദ്രുത റിവിഷൻ)
</div>

<table class="recap-table">
<thead>
<tr>
<th style="width: 20%;">Word</th>
<th style="width: 26%;">V1 | V2 | V3</th>
<th style="width: 30%;">മലയാളം അർത്ഥം</th>
<th style="width: 24%;">Key Synonym</th>
</tr>
</thead>
<tbody>
`;

  dayData.words.forEach((w, idx) => {
    const vShort = `${w.v1} | ${w.v2.slice(-2) === 'ed' ? w.v2 : w.v2} | ${w.v3.slice(-2) === 'ed' ? w.v3 : w.v3}`;
    const mainSyn = w.synonyms.split(',').slice(0, 2).join(', ');
    md += `<tr>
<td><strong>${idx + 1}. ${w.word}</strong></td>
<td>${w.v1} | ${w.v2}</td>
<td>${w.malayalamMeaning.split(',')[0]}</td>
<td>${mainSyn}</td>
</tr>
`;
  });

  md += `</tbody>
</table>
</div>

<div class="exam-tip-box" style="background: #eff6ff; border-color: #bfdbfe;">
<span class="exam-tip-icon">📸</span>
<span class="exam-tip-text" style="color: #1e40af;">
<strong>Revision Tip:</strong> ഈ സ്ലൈഡ് സ്‌ക്രീൻഷോട്ട് എടുത്തു വെയ്ക്കുക. പരീക്ഷാ ഹാളിലേക്ക് പോകും മുൻപ് പെട്ടെന്ന് റിവൈസ് ചെയ്യാൻ സഹായിക്കും.
</span>
</div>
</div>
`;

  // Slide 8: Homework Outro
  const challengeWords = dayData.words.map(w => w.word).join(' • ');
  md += `
---

<!-- Slide 8: Homework & Outro Slide -->
<div class="cover-slide">
  <div style="background: rgba(255,255,255,0.15); padding: 6px 18px; border-radius: 20px; font-size: 14px; font-weight: 700; color: #fbbf24; margin-bottom: 14px;">
    ✍️ TODAY'S HOMEWORK CHALLENGE
  </div>
  <div style="font-size: 32px; font-weight: 800; color: #ffffff; margin-bottom: 16px; line-height: 1.3; max-width: 900px;">
    ഇന്നത്തെ 5 വാക്കുകളിൽ ഏതെങ്കിലും ഒരെണ്ണം ഉപയോഗിച്ച് നിങ്ങളുടെ സ്വന്തം വാചകം താഴെ Comment ചെയ്യുക!
  </div>
  <div style="background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.25); border-radius: 12px; padding: 16px 32px; font-size: 16px; color: #cbd5e1; margin-bottom: 24px;">
    📌 <strong>Challenge Words:</strong> ${challengeWords}
  </div>
  <div style="font-size: 18px; color: #38bdf8; font-weight: 700;">
    ${dayData.day < 7 ? `നാളെ Day 0${dayData.day + 1} പുതിയ 5 ഹൈ-യീൽഡ് പദങ്ങളുമായി വീണ്ടും കാണാം!` : '7-ദിവസത്തെ വൊക്കാബുലറി സീരീസ് വിജയകരമായി പൂർത്തിയായി!'} 👍 Like & Subscribe!
  </div>
</div>
`;

  return md;
}

/**
 * Generate Voice-Over Script (Malayalam) for the given day
 */
function buildVoiceOverScript(dayData) {
  const padDay = String(dayData.day).padStart(2, '0');
  
  let script = `# 🎙️ YouTube Voice-Over Script: Daily Vocabulary Special (Day ${padDay})
**Series:** Editorial Vocabulary Booster — 7-Day High-Yield Sprint  
**Target Audience:** Kerala PSC, SSC CGL/CHSL, Banking, UPSC, The Hindu Editorial Readers  
**Slide Reference:** \`reports/Daily_Vocabulary_Day_${padDay}.md\` / \`reports/Daily_Vocabulary_Day_${padDay}_slides.html\`  
**Estimated Duration:** 6 – 8 Minutes  

---

### [00:00 – 00:45] INTRO: Greeting & Context
*(Display Slide 1: Cover Slide)*

**[Tone: Warm, energetic, authoritative teacher voice]**

> "എല്ലാവർക്കും നമസ്കാരം, വെൽക്കം ബാക്ക്!  
> നമ്മുടെ സ്‌പെഷ്യൽ **7-Day Editorial Vocabulary Masterclass**-ന്റെ **Day ${padDay}**-ലേക്ക് സ്വാഗതം.  
> 
> ദിനപത്രങ്ങളിലെ എഡിറ്റോറിയലുകൾ വായിക്കുമ്പോഴും മത്സരപരീക്ഷകളിലെ ഇംഗ്ലീഷ് ചോദ്യപേപ്പർ ചെയ്യുമ്പോഴും ഉയർന്ന മാർക്ക് നേടാൻ സഹായിക്കുന്ന **5 അതിപ്രധാനമായ പദങ്ങളാണ്** ഇന്ന് നമ്മൾ പഠിക്കുന്നത്.  
> 
> ഓരോ വാക്കിന്റെയും അർത്ഥം, പരീക്ഷകളിൽ നേരിട്ട് ചോദിക്കുന്ന **V1, V2, V3 Verb Forms**, എഡിറ്റോറിയൽ മാതൃകാ വാക്യങ്ങൾ, ഒപ്പം ഇതിന്റെ **Synonyms & Antonyms** സഹിതമാണ് നാം പഠിക്കുന്നത്.  
> 
> വരൂ, ഒട്ടും സമയം കളയാതെ ഇന്നത്തെ ആദ്യത്തെ വാക്കിലേക്ക് നമുക്ക് കടക്കാം!"

---
`;

  const timings = [
    "[00:45 – 02:00]",
    "[02:00 – 03:15]",
    "[03:15 – 04:30]",
    "[04:30 – 05:30]",
    "[05:30 – 06:45]"
  ];

  dayData.words.forEach((w, idx) => {
    const wordNum = idx + 1;
    const timing = timings[idx] || `[0${wordNum + 1}:00 – 0${wordNum + 2}:00]`;

    script += `### ${timing} WORD 0${wordNum}: ${w.word}
*(Switch to Slide ${wordNum + 1}: Word ${wordNum})*

**[Teaching Cue: Pronounce clearly: ${w.pronunciation}]**

> "നമ്മുടെ ${wordNum === 1 ? 'ആദ്യത്തെ' : wordNum === 2 ? 'രണ്ടാമത്തെ' : wordNum === 3 ? 'മൂന്നാമത്തെ' : wordNum === 4 ? 'നാലാമത്തെ' : 'അഞ്ചാമത്തെ'} വാക്ക്: **${w.word}**.  
> ഇതിന്റെ പാർട്ട് ഓഫ് സ്പീച്ച് **${w.pos}** ആണ്.  
> 
> ഇതിന്റെ **Verb Forms** ആദ്യം നോക്കൂ:  
> - **V1 (Base Form):** \`${w.v1}\`  
> - **V2 (Simple Past):** \`${w.v2}\`  
> - **V3 (Past Participle):** \`${w.v3}\`  
> - **V4 (Continuous):** \`${w.v4}\`  
> 
> **ഇതിന്റെ കൃത്യമായ അർത്ഥം:**  
> *'${w.englishMeaning}'*  
> മലയാളത്തിൽ: **'${w.malayalamMeaning}'** എന്നാണ് അർത്ഥം വരുന്നത്.  
> 
> ദിനപത്രങ്ങളിലെ ഇതിന്റെ യഥാർത്ഥ പ്രയോഗം ശ്രദ്ധിക്കൂ:  
> *"${w.exampleSentence}"*  
> 
> **💡 പരീക്ഷാ പോയിന്റ്:**  
> ഇതിന്റെ പ്രധാന **Synonyms**: \`${w.synonyms}\`.  
> ഇതിന്റെ പ്രധാന **Antonyms**: \`${w.antonyms}\`.  
> *${w.examTip}*"

---
`;
  });

  // Recap and Outro
  script += `### [06:45 – 07:30] RAPID RECAP & SCREENSHOT MOMENT
*(Switch to Slide 7: Fast Revision Table)*

> "ഇനി നമ്മൾ പഠിച്ച 5 വാക്കുകളും പെട്ടെന്ന് ഒന്നുകൂടി റിവൈസ് ചെയ്യാം. എല്ലാവരും സ്‌ക്രീനിലേക്ക് ശ്രദ്ധിക്കൂ:  
`;

  dayData.words.forEach((w, idx) => {
    script += `> ${idx + 1}. **${w.word}** (V1: ${w.v1}, V2: ${w.v2}) 👉 ${w.malayalamMeaning.split(',')[0]} (Synonym: ${w.synonyms.split(',')[0]})  \n`;
  });

  script += `> 
> പരീക്ഷയ്ക്ക് തൊട്ടുമുമ്പ് നോക്കാൻ എല്ലാവരും ഈ സ്ലൈഡ് ഒന്ന് **സ്‌ക്രീൻഷോട്ട്** എടുത്തു വെയ്ക്കൂ!"

---

### [07:30 – 08:15] OUTRO & HOMEWORK CHALLENGE
*(Switch to Slide 8: Homework & Outro Slide)*

> "അവസാനമായി ഇന്നത്തെ നമ്മുടെ **Homework Challenge**!  
> ഇന്ന് നമ്മൾ പഠിച്ച ഈ 5 വാക്കുകളിൽ ഏതെങ്കിലും ഒരു വാക്ക് ഉപയോഗിച്ച് നിങ്ങളുടെ സ്വന്തം വാചകം ഉണ്ടാക്കി **താഴെ കമന്റ് ചെയ്യുക!**  
> 
> ${dayData.day < 7 ? `നാളെ **Day 0${dayData.day + 1}** പുതിയ 5 പവർഫുൾ എഡിറ്റോറിയൽ വാക്കുകളുമായി വീണ്ടും കാണാം.` : 'നമ്മുടെ 7-ഡേ വൊക്കാബുലറി സീരീസ് ഇവിടെ പൂർത്തിയാകുന്നു. നിങ്ങളുടെ മാർക്കുകൾ ഉറപ്പാക്കാൻ ഈ വീഡിയോകൾ ആവർത്തിച്ചു കാണുക.'}  
> ക്ലാസ്സ് ഉപകാരപ്പെട്ടെങ്കിൽ തീർച്ചയായും ലൈക് ചെയ്യുക, കൂട്ടുകാർക്ക് ഷെയർ ചെയ്യുക.  
> താങ്ക് യു, ആൻഡ് കീപ്പ് ലേണിംഗ്!"
`;

  return script;
}

/**
 * Main Controller
 */
function run() {
  const args = process.argv.slice(2);
  let targetDays = [1]; // default Day 1

  if (args.includes('--all')) {
    targetDays = [1, 2, 3, 4, 5, 6, 7];
  } else {
    const dayArg = args.find(a => a.startsWith('--day='));
    if (dayArg) {
      const d = parseInt(dayArg.split('=')[1], 10);
      if (d >= 1 && d <= 7) targetDays = [d];
    }
  }

  console.log(`🚀 Starting Vocabulary Generation for Day(s): ${targetDays.join(', ')}...`);

  targetDays.forEach(dayNum => {
    const dayData = VOCABULARY_DAYS.find(d => d.day === dayNum);
    if (!dayData) return;

    const padDay = String(dayNum).padStart(2, '0');
    const mdPath = path.join(REPORTS_DIR, `Daily_Vocabulary_Day_${padDay}.md`);
    const htmlPath = path.join(REPORTS_DIR, `Daily_Vocabulary_Day_${padDay}_slides.html`);
    const pdfPath = path.join(REPORTS_DIR, `Daily_Vocabulary_Day_${padDay}_Presentation.pdf`);
    const scriptPath = path.join(REPORTS_DIR, `Daily_Vocabulary_Day_${padDay}_Script.md`);

    console.log(`\n📄 [Day ${padDay}] Generating Marp Slide Deck & Script...`);
    
    // 1. Write Slide Deck MD
    const mdContent = buildMarpMarkdown(dayData);
    fs.writeFileSync(mdPath, mdContent, 'utf8');
    console.log(`   ✅ Slide Deck MD: ${mdPath}`);

    // 2. Write Voice-Over Script
    const scriptContent = buildVoiceOverScript(dayData);
    fs.writeFileSync(scriptPath, scriptContent, 'utf8');
    console.log(`   ✅ Voice Script: ${scriptPath}`);

    // 3. Compile to HTML via Marp CLI
    console.log(`   ⚙️ Compiling HTML slides via Marp CLI...`);
    try {
      execSync(`npx -y @marp-team/marp-cli "${mdPath}" --html --allow-local-files --no-stdin -o "${htmlPath}"`, { stdio: 'inherit' });
      console.log(`   ✅ HTML Slides Created: ${htmlPath}`);
    } catch (e) {
      console.error(`   ❌ Failed to compile HTML slides:`, e.message);
    }

    // 4. Compile to PDF via Marp CLI
    console.log(`   ⚙️ Compiling PDF presentation via Marp CLI...`);
    try {
      execSync(`npx -y @marp-team/marp-cli "${mdPath}" --pdf --allow-local-files --no-stdin -o "${pdfPath}"`, { stdio: 'inherit' });
      console.log(`   ✅ PDF Presentation Created: ${pdfPath}`);
    } catch (e) {
      console.error(`   ❌ Failed to compile PDF:`, e.message);
    }
  });

  console.log(`\n🎉 All done! You can open any generated slide deck using:\n   open reports/Daily_Vocabulary_Day_01_slides.html`);
}

run();
