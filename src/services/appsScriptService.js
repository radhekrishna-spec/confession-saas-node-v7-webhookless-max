const axios = require('axios');

const APPS_SCRIPT_URL = process.env.APPS_SCRIPT_URL;

async function createConfession(text) {
  const res = await axios.post(APPS_SCRIPT_URL, {
    action: 'submit_confession',
    text,
  });

  return res.data;
}

async function processEdit(id, text) {
  const res = await axios.post(APPS_SCRIPT_URL, {
    action: 'edit_confession',
    id,
    text,
  });

  return res.data;
}

module.exports = {
  createConfession,
  processEdit,
};
