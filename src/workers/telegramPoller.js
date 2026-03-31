const axios = require('axios');
const { processTelegramUpdate } = require('../services/telegramUpdateService');

let offset = 0;
let isPolling = false;

function startTelegramPoller() {
  setInterval(async () => {
    if (isPolling) return;

    isPolling = true;

    try {
      const token = process.env.TELEGRAM_BOT_TOKEN;

      const res = await axios.get(
        `https://api.telegram.org/bot${token}/getUpdates`,
        {
          params: {
            offset: offset + 1,
            timeout: 10,
          },
          timeout: 15000,
        },
      );

      const updates = res.data.result || [];

      for (const update of updates) {
        offset = update.update_id;
        await processTelegramUpdate(update);
      }
    } catch (error) {
      console.log('telegram poll error', error.message);
    } finally {
      isPolling = false;
    }
  }, 12000);
}

module.exports = { startTelegramPoller };
