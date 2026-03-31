const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

async function generateConfessionImage(id, text) {
  const width = 1080;
  const height = 1350;

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);

  // heading
  ctx.fillStyle = '#000000';
  ctx.font = 'bold 48px Arial';
  ctx.fillText(`Confession #${id}`, 80, 100);

  // footer watermark
  ctx.font = '28px Arial';
  ctx.fillText('@miet_k_dilwale_confession_wale', 80, 1280);

  // confession text
  ctx.font = '42px Arial';
  wrapText(ctx, text, 80, 220, 900, 60);

  const filePath = path.join(
    process.cwd(),
    'generated',
    `confession_${id}.png`,
  );

  if (!fs.existsSync(path.join(process.cwd(), 'generated'))) {
    fs.mkdirSync(path.join(process.cwd(), 'generated'));
  }

  fs.writeFileSync(filePath, canvas.toBuffer('image/png'));

  return filePath;
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';

  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + ' ';
    const metrics = ctx.measureText(testLine);

    if (metrics.width > maxWidth && i > 0) {
      ctx.fillText(line, x, y);
      line = words[i] + ' ';
      y += lineHeight;
    } else {
      line = testLine;
    }
  }

  ctx.fillText(line, x, y);
}

module.exports = {
  generateConfessionImage,
};
