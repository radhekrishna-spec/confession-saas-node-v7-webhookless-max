const { google } = require('googleapis');
const { Readable } = require('stream');
const store = require('../store');

const ROOT_FOLDER_ID = process.env.ROOT_FOLDER_ID;

function getDriveClient() {
  const auth = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
  );

  auth.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
  });

  return google.drive({
    version: 'v3',
    auth,
  });
}

function getDriveDirectImageUrl(fileId) {
  return `https://lh3.googleusercontent.com/d/${fileId}`;
}

async function uploadImagesToDrive(imageBuffers, confessionNo) {
  const drive = getDriveClient();

  let storedImages = [];
  let ids = store.get(`fileIds_${confessionNo}`) || [];

  for (let index = 0; index < imageBuffers.length; index++) {
    const imgName =
      imageBuffers.length === 1
        ? `c_${confessionNo}.png`
        : `c_${confessionNo}_part${index + 1}.png`;

    const stream = Readable.from(imageBuffers[index]);

    const res = await drive.files.create({
      requestBody: {
        name: imgName,
        parents: [ROOT_FOLDER_ID],
      },
      media: {
        mimeType: 'image/png',
        body: stream,
      },
      fields: 'id',
    });

    const fileId = res.data.id;

    ids.push(fileId);

    storedImages.push(getDriveDirectImageUrl(fileId));
  }

  store.set(`fileIds_${confessionNo}`, ids);

  return storedImages;
}

module.exports = {
  uploadImagesToDrive,
  getDriveDirectImageUrl,
};
