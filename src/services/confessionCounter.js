const store = require('../store');

const DEFAULT_CONFESSION_NO = 1000; // yaha hardcoded set karo

async function getNextConfessionNo() {
  let current = store.get('CONFESSION_NO');

  // first time hardcoded start
  if (current === undefined || current === null) {
    current = DEFAULT_CONFESSION_NO;
  }

  const next = Number(current) + 1;

  store.set('CONFESSION_NO', next);

  return next;
}

function setConfessionNo(newNo) {
  store.set('CONFESSION_NO', Number(newNo));
  return Number(newNo);
}

function getCurrentConfessionNo() {
  return Number(store.get('CONFESSION_NO') || DEFAULT_CONFESSION_NO);
}

module.exports = {
  getNextConfessionNo,
  setConfessionNo,
  getCurrentConfessionNo,
};
