const { startTelegramPoller } = require('./telegramPoller');
const { startCommandPoller } = require('./commandPoller');
const { startEditQueueWorker } = require('./editQueueWorker');
const { startSchedulerWorker } = require('./schedulerWorker');

function startAllWorkers(){
  startTelegramPoller();
  startCommandPoller();
  startEditQueueWorker();
  startSchedulerWorker();
}
module.exports={ startAllWorkers };