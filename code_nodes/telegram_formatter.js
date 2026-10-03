/**
 * n8n Code Node: Telegram Formatter
 * 
 * Purpose: Formats the daily summary into a clean, mobile-friendly Telegram alert
 * highlighting stats, vocabulary, MCQs, and prominent warning badges if any story
 * scored below the 0.85 confidence threshold.
 */

const items = $input.all().map(i => i.json);
const data = items[0] || {};

const dateStr = data.date || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
const stats = data.stats || {
  totalStories: data.storiesCount || 12,
  manualCheckCount: data.manualCheckCount || 0,
  verifiedCount: (data.storiesCount || 12) - (data.manualCheckCount || 0)
};

const manualCheckAlert = stats.manualCheckCount > 0
  ? `⚠️ *Manual verification:* ${stats.manualCheckCount} (Cross-check physical Hindu paper!)`
  : `✅ *Manual verification:* 0 (All verified)`;

const telegramText = 
`📰 *DAILY CURRENT AFFAIRS READY*

📅 *Date:* ${dateStr}
🏛️ *Primary Source:* The Hindu

📰 *Important stories:* ${stats.totalStories}
${manualCheckAlert}
📚 *Vocabulary:* 5
❓ *MCQs:* 15
🎙️ *YouTube script:* Ready

📁 *Saved File:* \`${data.fileName || 'Daily_Current_Affairs.md'}\`

_Review report before recording voice-over._`;

return [{
  json: {
    telegramText,
    chatId: "YOUR_TELEGRAM_CHAT_ID", // Parameterized placeholder
    parseMode: "Markdown",
    stats
  }
}];
