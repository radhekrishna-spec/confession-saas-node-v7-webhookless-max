const axios = require('axios');

const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const IG_USER_ID = process.env.IG_USER_ID;

// EXACT SAME APPSCRIPT
async function postCarousel(images, caption) {
  const children = [];

  // STEP 1 child media
  for (const url of images) {
    const res = await axios.post(
      `https://graph.facebook.com/v19.0/${IG_USER_ID}/media`,
      null,
      {
        params: {
          image_url: url,
          is_carousel_item: true,
          access_token: ACCESS_TOKEN,
        },
      },
    );

    const id = res.data.id;

    if (!id) {
      throw new Error('Child media create failed');
    }

    children.push(id);
  }

  // SAME WAIT
  await new Promise((r) => setTimeout(r, 15000));

  // STEP 2 carousel
  const carousel = await axios.post(
    `https://graph.facebook.com/v19.0/${IG_USER_ID}/media`,
    null,
    {
      params: {
        children: children.join(','),
        caption,
        media_type: 'CAROUSEL',
        access_token: ACCESS_TOKEN,
      },
    },
  );

  const creationId = carousel.data.id;

  if (!creationId) {
    throw new Error('Carousel create failed');
  }

  // STEP 3 publish
  await axios.post(
    `https://graph.facebook.com/v19.0/${IG_USER_ID}/media_publish`,
    null,
    {
      params: {
        creation_id: creationId,
        access_token: ACCESS_TOKEN,
      },
    },
  );

  return true;
}

module.exports = {
  postCarousel,
};
