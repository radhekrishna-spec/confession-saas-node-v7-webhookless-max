const store = require('../store');
const confession = require('./confessionService');
const telegram = require('./telegramService');

async function processTelegramUpdate(update) {
  if (!update) return;

  // message for edit preview
  if (update.message) {
    const editingId = store.props.editing_active;
    const waiting = store.props.awaiting_edit_input;

    if (!editingId || !waiting) return;

    const text = (update.message.text || '').trim();

    if (!text) return;

    store.props[`pending_edit_${editingId}`] = text;
    delete store.props.awaiting_edit_input;

    await telegram.sendPreviewButtons(editingId, text);
    return;
  }

  // callback buttons
  if (update.callback_query) {
    const action = update.callback_query.data;
    const chatId = update.callback_query.message.chat.id;

    if (action.startsWith('approve_')) {
      return confession.approve(action.replace('approve_', ''));
    }

    if (action.startsWith('reject_')) {
      return confession.reject(action.replace('reject_', ''));
    }

    if (action.startsWith('edit_')) {
      return confession.startEdit(action.replace('edit_', ''));
    }

    if (action.startsWith('confirmedit_')) {
      return confession.confirmEdit(action.replace('confirmedit_', ''));
    }

    if (action.startsWith('stopedit_')) {
      return confession.stopEdit(action.replace('stopedit_', ''));
    }
  }
}

module.exports = { processTelegramUpdate };
