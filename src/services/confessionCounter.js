const store = require('../store');

// EXACT APP SCRIPT SAME
async function getNextConfessionNo() {
  let num = Number(store.get('CONFESSION_NO') || 0) + 1;

  store.set('CONFESSION_NO', num);

  return num;
}

module.exports = {
  getNextConfessionNo,
};
