import fs from 'fs';
import path from 'path';

const appContent = fs.readFileSync('src/App.tsx', 'utf-8');

function extract(name, regex) {
  const match = appContent.match(regex);
  if (match) {
    return match[0];
  }
  return '';
}

// Just to be safe, I'll extract them using sed or awk via bash.
