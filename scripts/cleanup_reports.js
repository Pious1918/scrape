#!/usr/bin/env node

/**
 * Cleanup Utility for Scrapping Project Reports
 * 
 * Safely frees up disk space by removing older heavy generated assets:
 * - Presentation PDFs (Daily_Current_Affairs_*_Presentation.pdf)
 * - 9:16 Shorts/Reel PDFs & PNG images (Daily_Current_Affairs_*_Reel.{pdf,png})
 * - Older Reel Markdown scripts (Daily_Current_Affairs_*_Reel.md)
 * - Old scraped news images in reports/images/
 * - Generated HTML slides (*_slides.html)
 * - (Optional) Older daily markdown reports (Daily_Current_Affairs_*.md) with safe weekly retention
 * 
 * CRITICAL SAFETY:
 * - NEVER touches anything inside reports/thumbnails/ (Protected monthly thumbnails & templates)
 * - NEVER touches code, configs, workflows, prompts, or README files
 * - Includes --dry-run mode for previewing deletions before executing
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const PROJECT_ROOT = path.resolve(__dirname, '..');
const REPORTS_DIR = path.join(PROJECT_ROOT, 'reports');
const IMAGES_DIR = path.join(REPORTS_DIR, 'images');
const THUMBNAILS_DIR = path.join(REPORTS_DIR, 'thumbnails');

// Parse CLI arguments
const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  console.log(`
Usage: ./scripts/cleanup.sh [OPTIONS]

Safely clean up older current affairs PDFs, Shorts/Reel assets, and images.
Guaranteed: Never touches reports/thumbnails/

Options:
  --dry-run, -n       Preview files to be deleted and space reclaimed without deleting
  --keep, --keep-heavy <N> Number of most recent daily editions to keep for heavy files
                      (PDF presentations, Reel/Shorts PDFs & PNGs, Reel scripts). Default: 3
  --clean-md          Also prune older daily current affairs markdown reports (.md)
  --keep-md <N>       Number of most recent daily markdown reports to keep when --clean-md
                      is enabled (Default: 7, preserves current week for Sunday quiz)
  --clean-vocab       Also clean up older vocabulary presentations and HTML slide decks
  --clean-quizzes     Also clean up older weekly quiz HTML slide decks
  --no-images         Do NOT clean up stale images in reports/images/
  --no-html           Do NOT clean up generated HTML slide decks
  --force, -y         Skip interactive yes/no confirmation prompt
  --help, -h          Show this help message
`);
  process.exit(0);
}

const isDryRun = args.includes('--dry-run') || args.includes('-n');
const isForce = args.includes('--force') || args.includes('-y');
const cleanMdReports = args.includes('--clean-md');
const cleanImages = !args.includes('--no-images');
const cleanHtml = !args.includes('--no-html');
const cleanVocab = args.includes('--clean-vocab');
const cleanQuizzes = args.includes('--clean-quizzes');

// Parse numerical options
function getArgValue(flag, defaultValue) {
  const arg = args.find(a => a.startsWith(`${flag}=`));
  if (arg) {
    const val = parseInt(arg.split('=')[1], 10);
    return isNaN(val) ? defaultValue : val;
  }
  const idx = args.indexOf(flag);
  if (idx !== -1 && idx + 1 < args.length) {
    const val = parseInt(args[idx + 1], 10);
    return isNaN(val) ? defaultValue : val;
  }
  return defaultValue;
}

// Retention settings (number of most recent editions to keep)
const KEEP_HEAVY_EDITIONS = getArgValue('--keep', getArgValue('--keep-heavy', 3)); // Keep last 3 days of PDFs/Shorts
const KEEP_MD_EDITIONS = getArgValue('--keep-md', 7); // Keep last 7 days of .md (for weekly quiz ingestion)

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function getSortedDatesFromFiles(pattern) {
  if (!fs.existsSync(REPORTS_DIR)) return [];
  const files = fs.readdirSync(REPORTS_DIR);
  const dateSet = new Set();
  for (const f of files) {
    const match = f.match(pattern);
    if (match) {
      dateSet.add(match[1]); // YYYY_MM_DD
    }
  }
  return Array.from(dateSet).sort().reverse(); // Most recent first
}

function scanFilesToDelete() {
  const toDelete = [];

  if (!fs.existsSync(REPORTS_DIR)) {
    console.error(`❌ Reports directory not found: ${REPORTS_DIR}`);
    return toDelete;
  }

  // 1. Gather all distinct Current Affairs dates
  const caDates = getSortedDatesFromFiles(/^Daily_Current_Affairs_(\d{4}_\d{2}_\d{2})/);
  const heavyKeepDates = new Set(caDates.slice(0, KEEP_HEAVY_EDITIONS));
  const mdKeepDates = new Set(caDates.slice(0, KEEP_MD_EDITIONS));

  const allEntries = fs.readdirSync(REPORTS_DIR, { withFileTypes: true });

  for (const entry of allEntries) {
    if (entry.isDirectory()) continue;
    const filename = entry.name;
    const fullPath = path.join(REPORTS_DIR, filename);

    // Absolute safety guard: never touch thumbnails or README
    if (filename.toLowerCase() === 'readme.md' || fullPath.startsWith(THUMBNAILS_DIR)) {
      continue;
    }

    const stat = fs.statSync(fullPath);
    const size = stat.size;

    // A. Presentation PDFs (e.g. Daily_Current_Affairs_2026_09_28_Presentation.pdf)
    const presMatch = filename.match(/^Daily_Current_Affairs_(\d{4}_\d{2}_\d{2})_Presentation\.pdf$/);
    if (presMatch) {
      const dateStr = presMatch[1];
      if (!heavyKeepDates.has(dateStr)) {
        toDelete.push({ path: fullPath, relName: filename, size, category: 'Presentation PDF' });
      }
      continue;
    }

    // B. Reel / Shorts PDFs (e.g. Daily_Current_Affairs_2026_09_29_Reel.pdf, Education_Reel_2026_10_03.pdf)
    const reelPdfMatch = filename.match(/^(?:Daily_Current_Affairs|Education)_(\d{4}_\d{2}_\d{2})_Reel\.pdf$/) || filename.match(/^Education_Reel_(\d{4}_\d{2}_\d{2})\.pdf$/);
    if (reelPdfMatch) {
      const dateStr = reelPdfMatch[1];
      if (!heavyKeepDates.has(dateStr)) {
        toDelete.push({ path: fullPath, relName: filename, size, category: 'Shorts/Reel PDF' });
      }
      continue;
    }

    // C. Reel / Shorts PNGs (e.g. Daily_Current_Affairs_2026_09_28_Reel.png, Education_Reel_2026_10_03.png)
    const reelPngMatch = filename.match(/^(?:Daily_Current_Affairs|Education)_(\d{4}_\d{2}_\d{2})_Reel\.png$/) || filename.match(/^Education_Reel_(\d{4}_\d{2}_\d{2})\.png$/);
    if (reelPngMatch) {
      const dateStr = reelPngMatch[1];
      if (!heavyKeepDates.has(dateStr)) {
        toDelete.push({ path: fullPath, relName: filename, size, category: 'Shorts/Reel Image (PNG)' });
      }
      continue;
    }

    // D. Reel Markdown scripts older than heavy retention (e.g. Daily_Current_Affairs_2026_09_28_Reel.md, Education_Reel_2026_10_03.md)
    const reelMdMatch = filename.match(/^(?:Daily_Current_Affairs|Education)_(\d{4}_\d{2}_\d{2})_Reel\.md$/) || filename.match(/^Education_Reel_(\d{4}_\d{2}_\d{2})\.md$/);
    if (reelMdMatch) {
      const dateStr = reelMdMatch[1];
      if (!heavyKeepDates.has(dateStr)) {
        toDelete.push({ path: fullPath, relName: filename, size, category: 'Shorts/Reel Markdown Script' });
      }
      continue;
    }

    // E. Generated HTML slides (Daily_Current_Affairs_*_slides.html)
    const htmlMatch = filename.match(/^Daily_Current_Affairs_(\d{4}_\d{2}_\d{2})_slides\.html$/);
    if (htmlMatch && cleanHtml) {
      const dateStr = htmlMatch[1];
      if (!heavyKeepDates.has(dateStr)) {
        toDelete.push({ path: fullPath, relName: filename, size, category: 'HTML Slides' });
      }
      continue;
    }

    // F. Main Daily Markdown Reports (Daily_Current_Affairs_YYYY_MM_DD.md)
    // Only deleted if user passed --clean-md AND date is older than KEEP_MD_EDITIONS
    const mainMdMatch = filename.match(/^Daily_Current_Affairs_(\d{4}_\d{2}_\d{2})\.md$/);
    if (mainMdMatch && cleanMdReports) {
      const dateStr = mainMdMatch[1];
      if (!mdKeepDates.has(dateStr)) {
        toDelete.push({ path: fullPath, relName: filename, size, category: 'Daily Current Affairs Markdown Report' });
      }
      continue;
    }

    // G. Vocabulary presentation PDFs / HTMLs (Optional)
    if (cleanVocab) {
      if (filename.match(/^Daily_Vocabulary_Day_\d+_Presentation\.pdf$/)) {
        toDelete.push({ path: fullPath, relName: filename, size, category: 'Vocabulary PDF' });
      } else if (filename.match(/^Daily_Vocabulary_Day_\d+_slides\.html$/)) {
        toDelete.push({ path: fullPath, relName: filename, size, category: 'Vocabulary Slides' });
      }
    }

    // H. Weekly Quiz slides / reports (Optional)
    if (cleanQuizzes) {
      if (filename.match(/^Weekly_Kerala_Quiz_.*_Slides\.html$/)) {
        toDelete.push({ path: fullPath, relName: filename, size, category: 'Weekly Quiz Slides (HTML)' });
      } else if (cleanMdReports && filename.match(/^Weekly_Kerala_Quiz_.*\.md$/)) {
        toDelete.push({ path: fullPath, relName: filename, size, category: 'Weekly Quiz Markdown' });
      }
    }
  }

  // 2. Scraped Newspaper Images in reports/images/
  if (cleanImages && fs.existsSync(IMAGES_DIR)) {
    const imgFiles = fs.readdirSync(IMAGES_DIR);
    // Find modification times. If an image is older than 2 days or has extension .png (from legacy runs), queue it
    const now = Date.now();
    const TWO_DAYS_MS = 2 * 24 * 60 * 60 * 1000;

    for (const f of imgFiles) {
      if (f.startsWith('.')) continue;
      const fullPath = path.join(IMAGES_DIR, f);
      try {
        const stat = fs.statSync(fullPath);
        const isLegacyPng = f.endsWith('.png');
        const isOlder = (now - stat.mtimeMs) > TWO_DAYS_MS;

        // Legacy .png images or jpgs older than 2 days
        if (isLegacyPng || isOlder) {
          toDelete.push({ path: fullPath, relName: `images/${f}`, size: stat.size, category: 'Scraped Article Image' });
        }
      } catch (e) {}
    }
  }

  return toDelete;
}

async function confirmAction(promptText) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  return new Promise(resolve => {
    rl.question(promptText, answer => {
      rl.close();
      resolve(answer.trim().toLowerCase() === 'y' || answer.trim().toLowerCase() === 'yes');
    });
  });
}

async function main() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('   🧹 SCRAPPING ASSET CLEANUP & DISK SPACE RECLAIMER');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log(`🔒 THUMBNAILS PROTECTION : 100% Guaranteed (reports/thumbnails/ untouched)`);
  console.log(`📦 Retention Rules:`);
  console.log(`   • Heavy Files (PDFs, Shorts/Reel PNGs & PDFs) : Keep latest ${KEEP_HEAVY_EDITIONS} days`);
  console.log(`   • Daily Markdown Reports (.md)                : ${cleanMdReports ? `Delete older than ${KEEP_MD_EDITIONS} days` : `Preserved (use --clean-md to prune older than ${KEEP_MD_EDITIONS} days)`}`);
  console.log(`   • Scraped Images (reports/images/)            : ${cleanImages ? 'Clean legacy & images older than 2 days' : 'Preserved'}`);
  console.log(`   • Vocabulary Files                            : ${cleanVocab ? 'Cleaning old vocab PDFs/HTMLs' : 'Preserved (use --clean-vocab to clean)'}`);
  console.log(`   • Quiz Slides                                 : ${cleanQuizzes ? 'Cleaning quiz slides/reports' : 'Preserved (use --clean-quizzes to clean)'}`);
  console.log(`   • Mode                                        : ${isDryRun ? '🔍 DRY RUN (Preview only, no files will be deleted)' : '⚡ LIVE DELETION'}`);
  console.log('───────────────────────────────────────────────────────────────\n');

  const filesToDelete = scanFilesToDelete();

  if (filesToDelete.length === 0) {
    console.log('✨ No older files match the cleanup criteria. Your directory is already clean!\n');
    return;
  }

  let totalBytes = 0;
  console.log(`Found ${filesToDelete.length} file(s) eligible for cleanup:\n`);
  console.log(`  ${'Type'.padEnd(32)} | ${'Size'.padStart(9)} | File`);
  console.log(`  ${'-'.repeat(32)} | ${'-'.repeat(9)} | ${'-'.repeat(35)}`);

  for (const item of filesToDelete) {
    totalBytes += item.size;
    console.log(`  ${item.category.padEnd(32)} | ${formatBytes(item.size).padStart(9)} | ${item.relName}`);
  }

  console.log(`\n📊 Total Space to Reclaim: ${formatBytes(totalBytes)} across ${filesToDelete.length} files`);

  if (isDryRun) {
    console.log('\n🔍 DRY-RUN COMPLETE: No files were touched or deleted.');
    console.log('💡 To perform the real cleanup, run:');
    console.log('   node scripts/cleanup_reports.js' + (cleanMdReports ? ' --clean-md' : ''));
    console.log('   or: ./scripts/cleanup.sh\n');
    return;
  }

  if (!isForce) {
    const confirmed = await confirmAction(`\n⚠️  Are you sure you want to permanently delete these ${filesToDelete.length} files (${formatBytes(totalBytes)})? [y/N]: `);
    if (!confirmed) {
      console.log('❌ Cleanup cancelled by user. No files were deleted.\n');
      return;
    }
  }

  console.log('\n🚀 Deleting files...');
  let deletedCount = 0;
  let reclaimedBytes = 0;

  for (const item of filesToDelete) {
    try {
      fs.unlinkSync(item.path);
      deletedCount++;
      reclaimedBytes += item.size;
    } catch (err) {
      console.error(`⚠️ Failed to delete ${item.relName}: ${err.message}`);
    }
  }

  console.log(`\n🎉 Success! Deleted ${deletedCount} files and freed ${formatBytes(reclaimedBytes)} of disk space!`);
  console.log(`🔒 Thumbnails in reports/thumbnails/ remain completely intact.\n`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
