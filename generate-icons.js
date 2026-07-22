import fs from 'fs';
import { PNG } from 'pngjs';
import path from 'path';

function createIcon(size, name) {
  const png = new PNG({ width: size, height: size });
  for (let y = 0; y < png.height; y++) {
    for (let x = 0; x < png.width; x++) {
      const idx = (png.width * y + x) << 2;
      // black background
      png.data[idx] = 2; // R
      png.data[idx + 1] = 2; // G
      png.data[idx + 2] = 5; // B
      png.data[idx + 3] = 255; // Alpha
    }
  }
  png.pack().pipe(fs.createWriteStream(path.join('public', name)));
}

createIcon(32, 'favicon-32x32.png');
createIcon(16, 'favicon-16x16.png');
createIcon(180, 'apple-touch-icon.png');
createIcon(192, 'favicon-192x192.png');
createIcon(512, 'favicon-512x512.png');
