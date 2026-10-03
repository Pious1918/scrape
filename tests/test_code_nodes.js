/**
 * Unit Test Suite for n8n JavaScript Code Nodes
 * Tests normalization, fuzzy deduplication, confidence gate, report builder, and telegram formatter.
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');

function runTest(name, fn) {
  try {
    fn();
    console.log(`✅ [PASS] ${name}`);
  } catch (err) {
    console.error(`❌ [FAIL] ${name}`);
    console.error(err);
    process.exit(1);
  }
}

// 1. Test Normalize Sources
runTest('Normalize Sources Node', () => {
  const rawInput = [
    {
      json: {
        title: "India&#39;s GDP grows at 7.2% &amp; outperforms expectations",
        description: "<p>The Indian economy grew by <b>7.2%</b> in Q1 &ndash; according to official estimates.</p>",
        link: "https://www.thehindu.com/business/economy/gdp-growth-q1/article12345.ece?utm_source=rss&utm_medium=feed",
        pubDate: "Tue, 01 Sep 2026 05:00:00 GMT",
        category: "Economy"
      }
    },
    {
      json: {
        title: "", // empty title should be skipped
        description: "Empty test"
      }
    }
  ];

  // Emulate n8n $input.all()
  global.$input = { all: () => rawInput };
  
  const code = fs.readFileSync(path.join(__dirname, '../code_nodes/normalize_sources.js'), 'utf8');
  const result = eval(`(function() { ${code} })()`);
  
  assert.strictEqual(result.length, 1, "Should filter out empty item");
  assert.strictEqual(result[0].json.title, "India's GDP grows at 7.2% & outperforms expectations");
  assert.strictEqual(result[0].json.description, "The Indian economy grew by 7.2% in Q1 – according to official estimates.");
  assert.strictEqual(result[0].json.isPrimary, true);
  assert.strictEqual(result[0].json.url, "https://www.thehindu.com/business/economy/gdp-growth-q1/article12345.ece");
});

// 2. Test Deduplication Node
runTest('Deduplication Node (Fuzzy + URL)', () => {
  const rawInput = [
    {
      json: {
        title: "RBI keeps repo rate unchanged at 6.5 percent",
        description: "Monetary Policy Committee keeps key rates steady.",
        url: "https://www.thehindu.com/business/rbi-monetary-policy/article1.ece",
        source: "The Hindu",
        isPrimary: true,
        category: "Economy",
        publishedAt: "2026-09-01T04:00:00Z"
      }
    },
    {
      json: {
        title: "Reserve Bank of India retains repo rate at 6.5 percent in latest MPC review",
        description: "RBI governor announces status quo on rates.",
        url: "https://www.rbi.org.in/scripts/BS_PressReleaseDisplay.aspx?prid=9999",
        source: "RBI",
        isPrimary: false,
        category: "Economy",
        publishedAt: "2026-09-01T04:15:00Z"
      }
    },
    {
      json: {
        title: "ISRO prepares for next lunar mission rover test",
        description: "ISRO gears up for rover testing.",
        url: "https://www.thehindu.com/sci-tech/isro-mission/article2.ece",
        source: "The Hindu",
        isPrimary: true,
        category: "Sci-Tech",
        publishedAt: "2026-09-01T04:30:00Z"
      }
    }
  ];

  global.$input = { all: () => rawInput.map(j => ({ json: j.json })) };
  const code = fs.readFileSync(path.join(__dirname, '../code_nodes/deduplicate.js'), 'utf8');
  const result = eval(`(function() { ${code} })()`);

  assert.strictEqual(result.length, 2, "Duplicate RBI story should be merged into 1 story");
  const rbiStory = result.find(s => s.json.title.includes("RBI"));
  assert.ok(rbiStory, "RBI story exists");
  assert.strictEqual(rbiStory.json.isPrimary, true, "The Hindu retained as primary");
  assert.strictEqual(rbiStory.json.supportingSources.length, 1, "Secondary source preserved in supportingSources");
  assert.strictEqual(rbiStory.json.supportingSources[0].source, "RBI");
});

// 3. Test Confidence Gate Node
runTest('Confidence Gate Node', () => {
  const rawInput = [
    {
      json: {
        title: "Story 1 High Confidence",
        confidence: 0.95,
        verified: true
      }
    },
    {
      json: {
        title: "Story 2 Low Confidence",
        confidence: 0.72,
        verified: false
      }
    }
  ];

  global.$input = { all: () => rawInput.map(j => ({ json: j.json })) };
  const code = fs.readFileSync(path.join(__dirname, '../code_nodes/confidence_gate.js'), 'utf8');
  const result = eval(`(function() { ${code} })()`);

  assert.strictEqual(result.length, 2);
  assert.strictEqual(result[0].json.needsManualCheck, false);
  assert.strictEqual(result[0].json.verificationBadge, '✅ VERIFIED');
  assert.strictEqual(result[1].json.needsManualCheck, true);
  assert.strictEqual(result[1].json.verificationBadge, '⚠️ MANUAL_VERIFICATION_REQUIRED');
  assert.strictEqual(result[0].json.summaryStats.manualCheckCount, 1);
  assert.strictEqual(result[0].json.summaryStats.verifiedCount, 1);
});

// 4. Test Report Builder Node
runTest('Report Builder Node', () => {
  const rawInput = [
    {
      json: {
        date: "2026-09-01",
        stories: [
          {
            title: "Cabinet approves new semiconductor mission scheme",
            category: "National",
            confidence: 0.96,
            needsManualCheck: false,
            whatHappened: "Union Cabinet cleared 10,000 Cr outlay.",
            whyImportant: "Boosts domestic chip manufacturing.",
            examPoints: ["Allocation: 10,000 Cr", "Nodal agency: ISM"],
            source: "The Hindu",
            url: "https://thehindu.com/article1"
          }
        ],
        vocabulary: [
          {
            word: "indigenous",
            partOfSpeech: "adjective",
            englishMeaning: "originating or occurring naturally in a particular place; native",
            malayalamMeaning: "സ്വദേശീയമായ",
            synonyms: ["native", "domestic"],
            antonym: "foreign",
            exampleSentence: "India aims for indigenous chip fabrication."
          }
        ],
        mcqs: [
          {
            question: "What is the financial outlay for the new semiconductor mission scheme?",
            options: { A: "5,000 Cr", B: "10,000 Cr", C: "15,000 Cr", D: "20,000 Cr" },
            correctAnswer: "B",
            explanation: "The Union Cabinet approved an outlay of 10,000 Crore."
          }
        ],
        youtubeScript: "# Malayalam YouTube Script Intro..."
      }
    }
  ];

  global.$input = { all: () => rawInput.map(j => ({ json: j.json })) };
  const code = fs.readFileSync(path.join(__dirname, '../code_nodes/report_builder.js'), 'utf8');
  const result = eval(`(function() { ${code} })()`);

  assert.strictEqual(result.length, 1);
  const report = result[0].json;
  assert.ok(report.markdownReport.includes("DAILY CURRENT AFFAIRS"));
  assert.ok(report.markdownReport.includes("NATIONAL"));
  assert.ok(report.markdownReport.includes("DAILY VOCABULARY"));
  assert.ok(report.markdownReport.includes("INDIGENOUS"));
  assert.strictEqual(report.fileName, "Daily_Current_Affairs_2026_09_01.md");
});

// 5. Test Telegram Formatter Node
runTest('Telegram Formatter Node', () => {
  const rawInput = [
    {
      json: {
        date: "01 September 2026",
        fileName: "Daily_Current_Affairs_2026_09_01.md",
        storiesCount: 13,
        manualCheckCount: 1,
        stats: { totalStories: 13, manualCheckCount: 1, verifiedCount: 12 }
      }
    }
  ];

  global.$input = { all: () => rawInput.map(j => ({ json: j.json })) };
  const code = fs.readFileSync(path.join(__dirname, '../code_nodes/telegram_formatter.js'), 'utf8');
  const result = eval(`(function() { ${code} })()`);

  assert.strictEqual(result.length, 1);
  const tg = result[0].json;
  assert.ok(tg.telegramText.includes("DAILY CURRENT AFFAIRS READY"));
  assert.ok(tg.telegramText.includes("⚠️ *Manual verification:* 1"));
  assert.strictEqual(tg.parseMode, "Markdown");
});

console.log("\n✨ ALL CODE NODE TESTS PASSED SUCCESSFULLY! ✨");
