const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

function getBaseUrl() {
  return `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`;
}

async function sendTelegramMessage(id, text, imagePath) {
  const form = new FormData();

  form.append('chat_id', process.env.TELEGRAM_CHAT_ID);
  form.append('photo', fs.createReadStream(imagePath));
  form.append('caption', `📝 New Confession #${id}\n\n${text}`);

  form.append(
    'reply_markup',
    JSON.stringify({
      inline_keyboard: [
        [
          {
            text: '✅ Approve',
            callback_data: `approve_${id}`,
          },
          {
            text: '❌ Reject',
            callback_data: `reject_${id}`,
          },
        ],
        [
          {
            text: '✏️ Edit',
            callback_data: `edit_${id}`,
          },
        ],
      ],
    }),
  );

  await axios.post(`${getBaseUrl()}/sendPhoto`, form, {
    headers: form.getHeaders(),
  });
}

async function sendPreviewButtons(id, text) {
  await axios.post(`${getBaseUrl()}/sendMessage`, {
    chat_id: process.env.TELEGRAM_CHAT_ID,
    text: `📝 Preview #${id}\n\n${text}`,
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: 'CONFIRM EDIT ✅',
            callback_data: `confirmedit_${id}`,
          },
          {
            text: 'REJECT EDIT ❌',
            callback_data: `stopedit_${id}`,
          },
        ],
      ],
    },
  });
}

module.exports = {
  sendTelegramMessage,
  sendPreviewButtons,
};
