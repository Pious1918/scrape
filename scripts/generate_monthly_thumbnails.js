/**
 * Monthly YouTube Thumbnail & Shorts Cover Automation Generator
 * 
 * Generates 31 days (or full month days) of:
 * 1. YouTube Landscape Thumbnails (16:9 / 3:2) - Split Composition
 * 2. YouTube Shorts Vertical Covers (9:16) - Vertical Stacked Composition (Safe Zones)
 * Total: Up to 62 high-impact educational assets per month!
 * 
 * Features:
 * - Dynamic Month & Year handling (Automatic year rollover on January).
 * - Strict Alternating Poses:
 *     - Odd Days: Seated behind desk, holding white spiral notebook horizontally with both hands.
 *     - Even Days: Seated behind desk, one hand gesturing/explaining towards current affairs text.
 * - 31-Day Curated Wardrobe & Color Rotation Matrix (Kurtis, Denim, Sweaters, Gen-Z Crop tops, Hoodies, etc.).
 * - Generates clean structured JSONs, copy-paste prompts, and direct Imagen 3 / Gemini Image API batch caller.
 * 
 * Usage:
 *   node scripts/generate_monthly_thumbnails.js --month=10 --year=2026
 *   node scripts/generate_monthly_thumbnails.js --month=1 --year=2027 --mode=prompts
 *   node scripts/generate_monthly_thumbnails.js --day=1 (test single day)
 */

const fs = require('fs');
const path = require('path');

// 31 Unique Wardrobe Combinations (Alternating Indian Ethnic & Modern Gen-Z Casuals)
const WARDROBE_MATRIX = [
  // Day 1
  {
    style_category: "Gen-Z Casual",
    outerwear: "Oversized sage green sweatshirt",
    innerwear: "White crewneck base",
    details: "Relaxed drop-shoulder silhouette with minimal college graphic font",
    color_palette: "Muted sage / forest green"
  },
  // Day 2
  {
    style_category: "Modern Smart Casual",
    outerwear: "Light blue washed denim jacket",
    innerwear: "White graphic tee with minimal typography 'Good Things Take Time'",
    details: "Rolled-up sleeves at forearm, silver minimalist watch",
    color_palette: "Classic light wash denim blue & crisp white"
  },
  // Day 3
  {
    style_category: "Indian Ethnic Modern",
    outerwear: "Mustard yellow cotton straight-fit Kurti",
    innerwear: "None",
    details: "Subtle geometric white thread embroidery around neckline, 3/4th sleeves",
    color_palette: "Warm mustard yellow & subtle ivory"
  },
  // Day 4
  {
    style_category: "Gen-Z Cozy Vibe",
    outerwear: "Chunky ribbed knit lavender sweater",
    innerwear: "None",
    details: "Slightly oversized mock-neck cozy pullover, warm soft aesthetic",
    color_palette: "Soft pastel lavender / lilac"
  },
  // Day 5
  {
    style_category: "Indian Ethnic Classic",
    outerwear: "Deep royal blue Anarkali kurti",
    innerwear: "None",
    details: "Delicate golden border piping along the collar, elegant neckline",
    color_palette: "Rich royal blue with subtle gold accents"
  },
  // Day 6
  {
    style_category: "Modern Gen-Z Trend",
    outerwear: "Terracotta rust cropped utility jacket over high-waisted inner",
    innerwear: "Beige high-neck ribbed crop top",
    details: "Urban Gen-Z educator vibe, dual front flap pockets",
    color_palette: "Warm terracotta rust & sandy beige"
  },
  // Day 7
  {
    style_category: "Cozy Academic",
    outerwear: "Charcoal heather grey oversized hoodie",
    innerwear: "None",
    details: "Clean front pouch, comfortable relaxed study room look",
    color_palette: "Heather charcoal grey"
  },
  // Day 8
  {
    style_category: "Indian Ethnic Fusion",
    outerwear: "Pastel mint green fusion tunic kurti",
    innerwear: "None",
    details: "Mandarin collar, wooden button accents, subtle linen texture",
    color_palette: "Pastel mint green & natural wood"
  },
  // Day 9
  {
    style_category: "Modern Smart Casual",
    outerwear: "Olive green lightweight shacket (shirt-jacket)",
    innerwear: "Black fitted crewneck tee",
    details: "Unbuttoned relaxed layer, modern competitive exam mentor vibe",
    color_palette: "Earthy olive green & matte black"
  },
  // Day 10
  {
    style_category: "Indian Ethnic Festive",
    outerwear: "Deep maroon / wine A-line kurti",
    innerwear: "None",
    details: "Gold zari minimal border on cuffs, subtle festive academic charm",
    color_palette: "Burgundy wine / deep maroon with subtle gold"
  },
  // Day 11
  {
    style_category: "Gen-Z Casual",
    outerwear: "Beige cable-knit cardigan",
    innerwear: "Dusty rose fitted t-shirt",
    details: "Tortoiseshell buttons, slightly oversized slouchy sleeves",
    color_palette: "Warm oat beige & dusty rose"
  },
  // Day 12
  {
    style_category: "Modern Casual",
    outerwear: "Navy blue varsity bomber jacket",
    innerwear: "Heather grey t-shirt",
    details: "White striped ribbed collar, youthful dynamic college appeal",
    color_palette: "Deep navy blue & athletic heather grey"
  },
  // Day 13
  {
    style_category: "Indian Ethnic Chic",
    outerwear: "Teal blue printed kalamkari cotton kurti",
    innerwear: "None",
    details: "Contemporary handcrafted motif print, breathable cotton texture",
    color_palette: "Vibrant teal & indigo"
  },
  // Day 14
  {
    style_category: "Gen-Z Minimalist",
    outerwear: "Dusty peach relaxed half-zip pullover sweatshirt",
    innerwear: "White mock-neck collar peeking through",
    details: "Metal half-zip zipper slightly open, clean sporty look",
    color_palette: "Soft dusty peach & warm white"
  },
  // Day 15
  {
    style_category: "Indian Ethnic Classic",
    outerwear: "Emerald green straight kurti",
    innerwear: "None",
    details: "Elegant boat neckline with subtle self-colored embroidery",
    color_palette: "Rich emerald green"
  },
  // Day 16
  {
    style_category: "Modern Streetwear Casual",
    outerwear: "Black oversized corduroy button-down overshirt",
    innerwear: "Warm white minimalist typography tee",
    details: "Textured fine-wale corduroy, relaxed open front",
    color_palette: "Deep onyx black & warm off-white"
  },
  // Day 17
  {
    style_category: "Gen-Z Cozy Vibe",
    outerwear: "Warm camel brown crewneck sweater",
    innerwear: "White collared shirt showing collar tips",
    details: "Preppy academic study look, soft wool-blend texture",
    color_palette: "Warm camel brown & crisp white collar"
  },
  // Day 18
  {
    style_category: "Indian Ethnic Modern",
    outerwear: "Coral pink flared kurti with bell sleeves",
    innerwear: "None",
    details: "Subtle mirror-work neckline accents, lively approachable look",
    color_palette: "Vibrant coral pink & warm cream"
  },
  // Day 19
  {
    style_category: "Modern Casual",
    outerwear: "Dark indigo raw denim overshirt",
    innerwear: "Soft yellow basic t-shirt",
    details: "Contrast gold stitching on denim, casual study session vibe",
    color_palette: "Dark indigo blue & warm pastel yellow"
  },
  // Day 20
  {
    style_category: "Gen-Z Trend",
    outerwear: "Cropped olive bomber jacket",
    innerwear: "Charcoal grey ribbed tank / top",
    details: "Modern Gen-Z silhouette, ribbed cuffs and waist",
    color_palette: "Muted olive green & slate charcoal"
  },
  // Day 21
  {
    style_category: "Indian Ethnic Elegant",
    outerwear: "Plum purple chanderi silk-cotton kurti",
    innerwear: "None",
    details: "Subtle sheen texture, minimal gold button placket",
    color_palette: "Deep plum purple & champagne gold"
  },
  // Day 22
  {
    style_category: "Academic Chic",
    outerwear: "Oatmeal beige relaxed waffle-knit sweater",
    innerwear: "None",
    details: "Rich textured thermal waffle pattern, cozy studio lighting fit",
    color_palette: "Oatmeal beige & warm taupe"
  },
  // Day 23
  {
    style_category: "Indian Ethnic Modern",
    outerwear: "Rust orange and cream block-print short kurti",
    innerwear: "None",
    details: "Modern flared sleeves, traditional Kerala handicraft block print",
    color_palette: "Earthy rust orange & natural cream"
  },
  // Day 24
  {
    style_category: "Modern Smart Casual",
    outerwear: "Cobalt blue fitted zip-up fleece jacket",
    innerwear: "White crewneck t-shirt",
    details: "Sporty modern educator aesthetic, sharp high-contrast color",
    color_palette: "Vivid cobalt blue & pure white"
  },
  // Day 25
  {
    style_category: "Gen-Z Casual",
    outerwear: "Vintage washed grey graphic sweatshirt",
    innerwear: "None",
    details: "Subtle faded 'STUDY CLUB / 1998' collegiate arch logo",
    color_palette: "Faded vintage mineral grey"
  },
  // Day 26
  {
    style_category: "Indian Ethnic Classic",
    outerwear: "Ruby red straight cut kurti with round neck",
    innerwear: "None",
    details: "Subtle self-weave jacquard pattern, dignified presence",
    color_palette: "Rich ruby red"
  },
  // Day 27
  {
    style_category: "Gen-Z Cozy Vibe",
    outerwear: "Sage green ribbed fuzzy knit cardigan",
    innerwear: "White ribbed cami / inner top",
    details: "Soft fluffy knit texture, warm studio bokeh reflection",
    color_palette: "Soft sage green & warm milk white"
  },
  // Day 28
  {
    style_category: "Modern Casual",
    outerwear: "Dark chocolate brown utility shirt",
    innerwear: "Cream inner top",
    details: "Twin chest patch pockets, rolled sleeves, earth tone trend",
    color_palette: "Rich chocolate brown & cream"
  },
  // Day 29
  {
    style_category: "Indian Ethnic Modern",
    outerwear: "Powder blue chikankari embroidered kurti",
    innerwear: "None",
    details: "Traditional delicate floral thread embroidery, airy and fresh",
    color_palette: "Pastel powder blue & crisp white thread"
  },
  // Day 30
  {
    style_category: "Gen-Z Trendy Casual",
    outerwear: "Two-tone beige & forest green colorblock windbreaker / track top",
    innerwear: "White t-shirt",
    details: "Retro 90s aesthetic revived for Gen-Z study creators",
    color_palette: "Forest green & sand beige"
  },
  // Day 31
  {
    style_category: "Grand Milestone / Exam Special",
    outerwear: "Premium golden-mustard ethnic jacket over deep maroon kurti",
    innerwear: "Deep maroon inner",
    details: "Layered festive Indo-western look, celebratory month-end review edition",
    color_palette: "Golden mustard & royal maroon"
  }
];

// Pose 1: Holding notebook horizontally (Odd Days: 1, 3, 5, 7...)
const POSE_1 = {
  pose_id: "pose_1_notebook_hold",
  framing: "Medium shot behind study desk",
  pose_description: "Seated behind a dark warm wooden study desk, facing camera directly in relaxed upright posture. Both hands holding a white spiral-bound study notebook horizontally in front of torso at desk level.",
  expression: "Friendly, confident, approachable slight smile with direct warm eye contact",
  gesture: "Both hands holding notebook naturally, relaxed shoulders",
  desk_elements: [
    "Black coffee mug with white text 'Better Days Ahead' and small smiley on desk",
    "Stack of competitive exam books: 'INDIAN POLITY', 'ECONOMY', 'CURRENT AFFAIRS'",
    "Open laptop partially visible on desk edge",
    "Writing pens / desk accessory"
  ]
};

// Pose 2: Hand gesturing towards Current Affairs text (Even Days: 2, 4, 6, 8...)
const POSE_2 = {
  pose_id: "pose_2_hand_gesture_explain",
  framing: "Medium shot behind study desk",
  pose_description: "Seated behind a dark warm wooden study desk, body slightly angled toward the left typography. One hand warmly extended/gesturing toward the bold 'DAILY CURRENT AFFAIRS' text as if explaining the day's topics to students, other hand resting naturally on the desk.",
  expression: "Warm genuine smile, highly engaging, encouraging teacher expression looking directly at camera",
  gesture: "Right hand open palm gesture pointing toward the headline",
  desk_elements: [
    "Open study notebook or notes resting on the dark wooden desk",
    "Black coffee mug with smiley face",
    "Bookshelf background with warm ambient glow",
    "Small potted indoor succulent plant on desk corner"
  ]
};

// Background Environment Specification
const BACKGROUND_SPEC = {
  setting: "Modern cozy study room / professional educational studio",
  lighting: "Warm cinematic indoor lighting, soft key light on face, subtle rim lighting on curly hair",
  color_tone: "Dark warm brown, deep charcoal, rich mahogany wood tones",
  elements: [
    "Dark wooden bookshelf filled with neatly arranged books",
    "Warm hanging pendant lamp with soft yellow incandescent glow",
    "Small green indoor potted plants (money plant, snake plant, succulents)",
    "Decorative wall frame with minimal motivational quote 'Good Things Take Time'",
    "Window in background with soft natural daylight and green foliage bokeh blur",
    "Cinematic depth of field with creamy background blur"
  ]
};

// Female Teacher Core Identity (Consistent Across All 31 Days)
const TEACHER_IDENTITY = {
  persona: "Young Indian female educator (Kerala PSC mentor aesthetic)",
  age: "Mid-20s",
  ethnicity: "South Indian / Malayali",
  skin_tone: "Warm medium brown skin tone, natural photorealistic skin texture",
  hair: "Long voluminous naturally curly/wavy dark brown-black hair framing face and resting over shoulders",
  facial_features: "Expressive warm brown eyes, natural brows, subtle natural everyday makeup, genuine inviting smile",
  accessories: "Minimal dark smartwatch on wrist, tiny simple ear studs"
};

// Month Names for formatting
const MONTH_NAMES = [
  "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
  "JUL", "AUG", "SEPT", "OCT", "NOV", "DEC"
];

const MONTH_FULL_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

function getDaysInMonth(year, monthIndex) {
  // monthIndex is 0-based: 0 = Jan, 11 = Dec
  return new Date(year, monthIndex + 1, 0).getDate();
}

/**
 * Builds the 16:9 Landscape YouTube Thumbnail Prompt
 */
function buildLandscapePrompt(dayNum, monthIndex, year, categoryBanner) {
  const monthAbbr = MONTH_NAMES[monthIndex];
  const formattedDay = String(dayNum).padStart(2, '0');
  const dateText = `${monthAbbr} ${formattedDay}, ${year}`;
  const isOdd = dayNum % 2 !== 0;
  const pose = isOdd ? POSE_1 : POSE_2;
  const wardrobe = WARDROBE_MATRIX[(dayNum - 1) % WARDROBE_MATRIX.length];

  const jsonSpec = {
    image_type: "YouTube Thumbnail (Long-form)",
    aspect_ratio: "16:9",
    resolution: "1280x720",
    theme: "Educational Daily Current Affairs",
    target_audience: "Kerala PSC Degree Level aspirants & competitive exam students",
    style: "Premium, photorealistic, professional educational YouTube creator thumbnail",
    
    date_badge: {
      text: dateText,
      position: "Upper-left corner",
      style: "Slightly tilted rounded rectangle container with pale cream/yellow background, bold black 900-weight condensed typography, small yellow accent ray marks"
    },

    main_headline: {
      text: "DAILY\nCURRENT\nAFFAIRS",
      position: "Left-center",
      typography: "Extra-heavy 900 condensed display sans-serif, pure white, very tight line spacing, subtle dark drop shadow and distressed texture",
      decoration: "Hand-painted golden yellow brush underline directly beneath the word AFFAIRS"
    },

    category_badge: {
      text: categoryBanner || "KERALA PSC | DEGREE LEVEL",
      position: "Bottom-left beneath headline",
      style: "Deep burgundy / maroon rounded pill banner, golden border, bold warm-white condensed font"
    },

    teacher: {
      identity: TEACHER_IDENTITY,
      pose_mode: isOdd ? "Pose 1: Notebook Holding" : "Pose 2: Hand Gesturing",
      pose_details: pose.pose_description,
      expression: pose.expression,
      wardrobe: wardrobe,
      position: "Right side of frame (occupying approximately 45% of composition)",
      lighting: "Soft cinematic key light on face, warm rim light outlining curly hair"
    },

    study_desk_and_props: {
      desk: "Warm dark mahogany wood desk",
      props: pose.desk_elements
    },

    background: BACKGROUND_SPEC,

    composition_rules: [
      "Strict split-screen composition: Left 55% dedicated to high-contrast typography, Right 45% dedicated to female teacher",
      "Teacher does NOT obstruct the white title text",
      "All text must remain 100% crisp, readable, and legible at small mobile thumbnail sizes",
      "Photorealistic skin, no cartoon or AI plastic look"
    ],

    negative_prompt: [
      "cartoon", "anime", "illustration", "3D render", "distorted hands", "extra fingers", 
      "mutated anatomy", "blurry text", "misspelled text", "washed out colors", "overexposed", 
      "neon glare", "watermark", "ugly faces"
    ]
  };

  const naturalLanguagePrompt = `A premium professional YouTube video thumbnail (16:9 aspect ratio, 1280x720). Split composition for educational channel. 
LEFT SIDE (55%): High-impact typography on dark moody background. At top-left, a tilted pale cream-yellow rounded rectangle badge with bold black text '${dateText}'. Centered on the left is massive, bold, extra-condensed white display lettering reading 'DAILY CURRENT AFFAIRS' with tight line spacing and a distressed finish. Directly underneath 'AFFAIRS' is a vibrant golden-yellow hand-drawn brush stroke underline. Below that is a sleek rounded burgundy-red banner with gold trim reading '${categoryBanner || "KERALA PSC | DEGREE LEVEL"}'.
RIGHT SIDE (45%): A photorealistic medium shot of an attractive young South Indian female teacher in her 20s with long voluminous naturally curly dark hair, warm medium-brown skin, and a friendly, confident, approachable smile looking directly into the camera. She is seated behind a dark wooden study desk. ${pose.pose_description} She is wearing a stylish ${wardrobe.outerwear} (${wardrobe.details}, color: ${wardrobe.color_palette}). On the desk in the foreground: ${pose.desk_elements.join(', ')}. 
BACKGROUND: Warm cozy study studio with dark bookshelves filled with books, a warm glowing pendant lamp, potted green indoor plants, and soft cinematic depth-of-field bokeh. High contrast, sharp focus, cinematic warm lighting, 8k commercial photography style.`;

  return { jsonSpec, naturalLanguagePrompt };
}

/**
 * Builds the 9:16 Vertical YouTube Shorts Thumbnail / Cover Prompt
 * Re-architected for mobile vertical safe zones:
 * - Upper third: Typography and Date (Clear of top status bar)
 * - Middle: Educator at desk in alternating pose
 * - Lower third: Desk and props (Kept clean so YouTube title/channel icons don't cover her face)
 */
function buildShortsPrompt(dayNum, monthIndex, year, categoryBanner) {
  const monthAbbr = MONTH_NAMES[monthIndex];
  const formattedDay = String(dayNum).padStart(2, '0');
  const dateText = `${monthAbbr} ${formattedDay}, ${year}`;
  const isOdd = dayNum % 2 !== 0;
  const pose = isOdd ? POSE_1 : POSE_2;
  const wardrobe = WARDROBE_MATRIX[(dayNum - 1) % WARDROBE_MATRIX.length];

  const jsonSpec = {
    image_type: "YouTube Shorts Cover / Thumbnail (Vertical)",
    aspect_ratio: "9:16",
    resolution: "1080x1920",
    theme: "Educational Daily Current Affairs (Shorts Edition)",
    target_audience: "Kerala PSC mobile aspirants & Shorts viewers",
    style: "Vertical mobile-first, high-impact educational visual",
    
    vertical_layout_safe_zones: {
      top_zone: "Date badge and 'DAILY CURRENT AFFAIRS' headline centered in top 35% safe zone",
      middle_zone: "Female teacher seated behind study desk centered between 35% and 75% height",
      bottom_zone: "Desk surface and exam books in bottom 25% (allowing space for YouTube Shorts UI title, channel avatar, sound badge, and action buttons without obscuring the teacher's face)"
    },

    date_badge: {
      text: dateText,
      position: "Top-center",
      style: "Pale cream/yellow rounded rectangle pill, bold black condensed font, yellow accent rays"
    },

    main_headline: {
      text: "DAILY\nCURRENT AFFAIRS",
      position: "Directly below date badge in upper vertical third",
      typography: "Massive bold condensed white sans-serif, high contrast against dark wooden study background",
      decoration: "Golden yellow brush stroke underline under CURRENT AFFAIRS",
      sub_pill: categoryBanner || "KERALA PSC | DEGREE LEVEL"
    },

    teacher: {
      identity: TEACHER_IDENTITY,
      pose_mode: isOdd ? "Pose 1: Notebook Holding" : "Pose 2: Hand Gesturing",
      pose_details: isOdd 
        ? "Seated behind study desk in vertical frame, holding white spiral notebook horizontally with both hands, looking into the camera with an engaging smile" 
        : "Seated behind study desk, gesturing upward towards the 'DAILY CURRENT AFFAIRS' headline with an enthusiastic, encouraging teaching expression",
      expression: pose.expression,
      wardrobe: wardrobe,
      position: "Vertical center of frame, perfectly framed for 9:16 smartphone screens"
    },

    background: {
      ...BACKGROUND_SPEC,
      vertical_adaptation: "Tall dark bookshelf, hanging pendant lamp at top right, indoor greenery framing the vertical edges"
    },

    negative_prompt: [
      "cartoon", "anime", "illustration", "distorted hands", "extra fingers", 
      "blurry text", "misspelled text", "head cut off", "face covered by icons", "dull colors"
    ]
  };

  const naturalLanguagePrompt = `A premium vertical (9:16 aspect ratio, 1080x1920) YouTube Shorts cover thumbnail for Kerala PSC Daily Current Affairs.
VERTICAL COMPOSITION & SAFE ZONES: 
TOP SECTION (Upper 35%): At the top center, a prominent pale cream-yellow rounded pill badge reading in bold black text '${dateText}'. Directly underneath is massive, high-impact condensed white display typography reading 'DAILY CURRENT AFFAIRS' with a textured edge and a bright golden-yellow brush stroke underline. Below the text is a sleek burgundy pill banner with gold border reading '${categoryBanner || "KERALA PSC | DEGREE LEVEL"}'.
MIDDLE SECTION (Center 40%): A photorealistic vertical medium shot of a young South Indian female teacher in her 20s with long voluminous naturally curly dark hair, warm medium-brown skin, and an engaging, radiant smile looking straight at the viewer. She is seated behind a dark wooden study desk. ${isOdd ? "She is holding a white spiral-bound notebook horizontally with both hands at desk level." : "Her right hand is gesturing upwards toward the Current Affairs headline as if introducing today's top stories."} She is wearing a stylish ${wardrobe.outerwear} (${wardrobe.details}, color: ${wardrobe.color_palette}).
BOTTOM SECTION (Lower 25%): The surface of the dark wooden desk with a black ceramic coffee mug with white text 'Better Days Ahead', competitive exam books ('INDIAN POLITY', 'CURRENT AFFAIRS'), designed cleanly so mobile UI overlays do not block her face or main text.
BACKGROUND: Warm cozy study room studio with tall dark wooden bookshelves filled with books, warm glowing pendant lamp, potted green indoor plants, and soft cinematic bokeh blur. Highly polished, crisp 4K mobile quality.`;

  return { jsonSpec, naturalLanguagePrompt };
}

/**
 * Main Generator Engine
 */
async function generateMonthBatch(options = {}) {
  const now = new Date();
  const year = parseInt(options.year) || now.getFullYear();
  // month is 1-indexed in CLI (1 = Jan, 12 = Dec), convert to 0-indexed
  const monthIndex = options.month ? (parseInt(options.month) - 1) : now.getMonth();
  const monthName = MONTH_NAMES[monthIndex];
  const monthFullName = MONTH_FULL_NAMES[monthIndex];
  const totalDays = getDaysInMonth(year, monthIndex);
  const targetDay = options.day ? parseInt(options.day) : null;
  const categoryBanner = options.category || "KERALA PSC | DEGREE LEVEL";

  console.log("==================================================================");
  console.log(`🚀 MONTHLY THUMBNAIL & SHORTS BATCH GENERATOR`);
  console.log(`📅 Target Period : ${monthFullName} ${year} (${totalDays} Days)`);
  console.log(`🎯 Category      : ${categoryBanner}`);
  console.log(`🖼️ Formats       : 16:9 YouTube Thumbnail + 9:16 Shorts Cover`);
  console.log(`📊 Total Assets  : ${targetDay ? 2 : totalDays * 2} images`);
  console.log("==================================================================\n");

  const outputBaseDir = path.join(__dirname, `../reports/thumbnails/${year}-${String(monthIndex + 1).padStart(2, '0')}_${monthName}`);
  if (!fs.existsSync(outputBaseDir)) {
    fs.mkdirSync(outputBaseDir, { recursive: true });
  }

  const batchManifest = [];
  const daysToProcess = targetDay ? [targetDay] : Array.from({ length: totalDays }, (_, i) => i + 1);

  for (const dayNum of daysToProcess) {
    const formattedDay = String(dayNum).padStart(2, '0');
    const isOdd = dayNum % 2 !== 0;
    const poseName = isOdd ? "Pose 1 (Holding Notebook)" : "Pose 2 (Gesturing to Text)";
    const wardrobe = WARDROBE_MATRIX[(dayNum - 1) % WARDROBE_MATRIX.length];

    // Build Landscape (16:9)
    const landscapeData = buildLandscapePrompt(dayNum, monthIndex, year, categoryBanner);
    const landscapeFileName = `Day_${formattedDay}_Landscape_16x9.json`;
    fs.writeFileSync(
      path.join(outputBaseDir, landscapeFileName),
      JSON.stringify(landscapeData.jsonSpec, null, 2),
      'utf8'
    );

    // Build Shorts (9:16)
    const shortsData = buildShortsPrompt(dayNum, monthIndex, year, categoryBanner);
    const shortsFileName = `Day_${formattedDay}_Shorts_9x16.json`;
    fs.writeFileSync(
      path.join(outputBaseDir, shortsFileName),
      JSON.stringify(shortsData.jsonSpec, null, 2),
      'utf8'
    );

    batchManifest.push({
      day: dayNum,
      date_formatted: `${monthName} ${formattedDay}, ${year}`,
      pose_type: poseName,
      wardrobe_style: wardrobe.style_category,
      outfit: wardrobe.outerwear,
      color: wardrobe.color_palette,
      landscape_json: landscapeFileName,
      landscape_prompt: landscapeData.naturalLanguagePrompt,
      shorts_json: shortsFileName,
      shorts_prompt: shortsData.naturalLanguagePrompt
    });

    console.log(`✅ Day ${formattedDay} (${monthName} ${formattedDay}, ${year}) -> [${poseName}] | Outfit: ${wardrobe.outerwear} (${wardrobe.color_palette})`);
  }

  // Save Batch Master Manifest JSON
  const manifestPath = path.join(outputBaseDir, `batch_manifest_${monthName}_${year}.json`);
  fs.writeFileSync(manifestPath, JSON.stringify(batchManifest, null, 2), 'utf8');

  // Save Human-Readable Markdown Guide for Easy Copy-Pasting or Review
  let markdownContent = `# Monthly Thumbnail & Shorts Prompts: ${monthFullName} ${year}\n\n`;
  markdownContent += `Generated on: ${new Date().toISOString()}\n`;
  markdownContent += `Total Days: ${daysToProcess.length} | Total Assets: ${daysToProcess.length * 2}\n\n`;
  markdownContent += `| Day | Date | Pose | Wardrobe Category | Outfit & Color |\n`;
  markdownContent += `|:---|:---|:---|:---|:---|\n`;

  for (const item of batchManifest) {
    markdownContent += `| ${item.day} | ${item.date_formatted} | ${item.pose_type.split(' ')[1]} | ${item.wardrobe_style} | ${item.outfit} (${item.color}) |\n`;
  }

  markdownContent += `\n---\n\n## Daily Copy-Paste Prompts for AI Generators (Midjourney / Ideogram / Imagen 3)\n\n`;
  for (const item of batchManifest) {
    markdownContent += `### 📅 Day ${String(item.day).padStart(2, '0')}: ${item.date_formatted}\n`;
    markdownContent += `- **Pose**: ${item.pose_type}\n`;
    markdownContent += `- **Wardrobe**: ${item.outfit} (${item.color})\n\n`;
    
    markdownContent += `#### 1. YouTube Standard Thumbnail (16:9 Landscape)\n`;
    markdownContent += `\`\`\`text\n${item.landscape_prompt}\n\`\`\`\n\n`;
    
    markdownContent += `#### 2. YouTube Shorts Cover (9:16 Vertical)\n`;
    markdownContent += `\`\`\`text\n${item.shorts_prompt}\n\`\`\`\n\n`;
    markdownContent += `---\n\n`;
  }

  const markdownPath = path.join(outputBaseDir, `README_Prompts_${monthName}_${year}.md`);
  fs.writeFileSync(markdownPath, markdownContent, 'utf8');

  console.log(`\n🎉 Batch generation complete!`);
  console.log(`📁 Files saved in: ${outputBaseDir}`);
  console.log(`📄 Manifest JSON : ${manifestPath}`);
  console.log(`📋 Prompt Guide  : ${markdownPath}`);
}

// Parse Command Line Flags
function parseArgs() {
  const args = {};
  for (const arg of process.argv.slice(2)) {
    if (arg.startsWith('--')) {
      const [key, value] = arg.slice(2).split('=');
      args[key] = value || true;
    }
  }
  return args;
}

// Run if called directly
if (require.main === module) {
  const args = parseArgs();
  generateMonthBatch(args).catch(err => {
    console.error("❌ Error generating batch:", err);
    process.exit(1);
  });
}

module.exports = {
  generateMonthBatch,
  buildLandscapePrompt,
  buildShortsPrompt,
  WARDROBE_MATRIX,
  POSE_1,
  POSE_2
};
