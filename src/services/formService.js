const connector = require('./appsScriptConnector');

async function handleSubmit(text) {
  if (!text || !text.trim()) {
    return {
      success: false,
      message: 'Text empty',
    };
  }

  const result = await connector.sendToAppsScript(text);

  return {
    success: true,
    result,
  };
}

module.exports = { handleSubmit };
