const store = require('../store');
const { processFormSubmit } = require('../services/formSubmitService');
const { sendTelegramMessage } = require('../services/telegramService');

// EXACT SAME QUEUE ADD
function addToEditQueue(confessionNo, text) {
  let queue = store.get('EDIT_QUEUE') || [];

  // remove old same id
  queue = queue.filter((q) => q.id != confessionNo);

  queue.push({
    id: confessionNo,
    text,
    time: Date.now(),
  });

  store.set('EDIT_QUEUE', queue);
}

// EXACT SAME HISTORY SAVE
function saveEditHistory(confessionNo, text) {
  let history = store.get(`edit_history_${confessionNo}`) || [];

  history.unshift({
    text,
    time: new Date().toLocaleString(),
  });

  history = history.slice(0, 5);

  store.set(`edit_history_${confessionNo}`, history);
}

// EXACT SAME PROCESS FLOW
async function processEditQueue() {
  const queue = store.get('EDIT_QUEUE') || [];

  if (!queue.length) return;

  const job = queue[0];

  store.set('EDIT_WORKING_TIME', Date.now());

  try {
    // overwrite old text
    store.set(`text_${job.id}`, job.text);

    saveEditHistory(job.id, job.text);

    // regenerate exact same flow
    await processFormSubmit({
      confession: job.text,
    });

    // remove processed job
    queue.shift();

    store.set('EDIT_QUEUE', queue);

    store.delete('EDIT_WORKING');
  } catch (error) {
    console.error('EDIT FAILED', error.message);
  }
}

// EXACT SAME AUTO WORKER
function startEditQueueWorker() {
  console.log('Edit queue worker started...');

  setInterval(processEditQueue, 3000);
}

module.exports = {
  addToEditQueue,
  processEditQueue,
  startEditQueueWorker,
};
