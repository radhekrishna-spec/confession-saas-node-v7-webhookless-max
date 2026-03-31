const store = require('../store');
const appsScript = require('./appsScriptService');

async function approve(id) {
  store.props[`state_${id}`] = 'APPROVED';
}

async function reject(id) {
  store.props[`state_${id}`] = 'REJECTED';
}

async function startEdit(id) {
  store.props.editing_active = id;
  store.props.awaiting_edit_input = '1';
}

async function stopEdit(id) {
  delete store.props.editing_active;
  delete store.props.awaiting_edit_input;
}

async function confirmEdit(id) {
  const text = store.props[`pending_edit_${id}`];
  if (!text) return;

  await appsScript.processEdit(id, text);

  store.props[`text_${id}`] = text;
  store.props[`state_${id}`] = 'EDITED';
}

async function processEditQueue() {
  return;
}

module.exports = {
  approve,
  reject,
  startEdit,
  stopEdit,
  confirmEdit,
  processEditQueue,
};
