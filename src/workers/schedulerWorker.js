const store = require('../store');
const { postCarousel } = require('../services/instagramService');
const { updateTelegramButtons } = require('../services/telegramUpdateService');

const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

// EXACT SAME TIME WINDOW LOGIC + SAFE
function shouldPostNow() {
  const now = Date.now();
  const nowDate = new Date();

  const lastPost = Number(store.get('LAST_POST_TIME') || 0);

  if (!lastPost) {
    store.set('LAST_POST_TIME', now);
    return true;
  }

  const gap = now - lastPost;
  const hour = nowDate.getHours();

  let minGap;
  let maxGap;

  if (hour >= 0 && hour <= 6) {
    minGap = 160 * 60 * 1000;
    maxGap = 240 * 60 * 1000;
  } else if (hour >= 7 && hour <= 11) {
    minGap = 90 * 60 * 1000;
    maxGap = 140 * 60 * 1000;
  } else if (hour >= 12 && hour <= 18) {
    minGap = 70 * 60 * 1000;
    maxGap = 120 * 60 * 1000;
  } else {
    minGap = 80 * 60 * 1000;
    maxGap = 130 * 60 * 1000;
  }

  const randomDelayMs = Math.floor(Math.random() * 10 * 60 * 1000);

  if (gap < minGap + randomDelayMs) {
    return false;
  }

  if (gap >= minGap && gap <= maxGap) {
    const skipChance = Math.random();

    if (skipChance < 0.25) {
      return false;
    }

    store.set('LAST_POST_TIME', now);

    return true;
  }

  if (gap > maxGap) {
    store.set('LAST_POST_TIME', now);

    return true;
  }

  return false;
}

// EXACT SAME APPROVED FIND + FIFO
function getNextApprovedConfession() {
  const all = store.getAll() || {};

  const approved = [];

  for (const key in all) {
    if (key.startsWith('state_') && all[key] === 'APPROVED') {
      const id = key.replace('state_', '');

      approved.push(Number(id));
    }
  }

  if (!approved.length) {
    return null;
  }

  approved.sort((a, b) => a - b);

  return approved[0];
}

// EXACT SAME POST FLOW + DUP SAFE
async function processApprovedQueue() {
  const confessionNo = getNextApprovedConfession();

  if (!confessionNo) return;

  // prevent duplicate posting
  if (store.get(`posting_${confessionNo}`)) {
    return;
  }

  const images = store.get(`images_${confessionNo}`) || [];

  const caption = store.get(`caption_${confessionNo}`) || '';

  if (!images.length) {
    store.set(`state_${confessionNo}`, 'FAILED');
    return;
  }

  try {
    store.set(`posting_${confessionNo}`, '1');

    store.set(`state_${confessionNo}`, 'POSTING');

    await postCarousel(images, caption);

    store.set(`state_${confessionNo}`, 'POSTED');

    store.set(`posted_time_${confessionNo}`, Date.now());

    const tgMsgId = store.get(`telegram_msg_${confessionNo}`);

    await updateTelegramButtons(CHAT_ID, tgMsgId, 'posted', confessionNo);

    console.log(`🚀 Posted confession #${confessionNo}`);
  } catch (error) {
    console.error('POST FAIL', error.message);

    store.set(`state_${confessionNo}`, 'FAILED');
  } finally {
    store.delete(`posting_${confessionNo}`);
  }
}

// EXACT SAME AUTO WORKER
function startSchedulerWorker() {
  console.log('Scheduler worker started...');

  setInterval(async () => {
    try {
      if (shouldPostNow()) {
        await processApprovedQueue();
      }
    } catch (error) {
      console.error('SCHEDULER ERROR:', error.message);
    }
  }, 60000); // every 1 min
}

module.exports = {
  shouldPostNow,
  processApprovedQueue,
  startSchedulerWorker,
};
