import fs from 'fs';
import path from 'path';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const componentsDir = path.join(process.cwd(), 'src', 'components');
const files = fs.readdirSync(componentsDir).filter(f => f.endsWith('.tsx') && !['BackgroundCanvas.tsx', 'CustomCursor.tsx', 'SEOSchema.tsx', 'TiltCard.tsx'].includes(f));

let translations = { pt: {}, en: {}, es: {}, fr: {}, de: {} };

async function processFile(file) {
  const filePath = path.join(componentsDir, file);
  const content = fs.readFileSync(filePath, 'utf-8');
  
  const prompt = `
  You are an expert React developer. I have a React component in Portuguese.
  Please rewrite the component to use 'react-i18next' (import { useTranslation } from 'react-i18next').
  Extract all text content, labels, titles, descriptions into translation keys (e.g. {t('hero_title')}).
  Also, return a JSON block with the translations for these keys in PT, EN, ES, FR, DE.
  
  Format your response exactly like this:
  
  ===COMPONENT===
  [The rewritten TSX code]
  ===TRANSLATIONS===
  {
    "pt": { "key": "value" },
    "en": { "key": "value" },
    "es": { "key": "value" },
    "fr": { "key": "value" },
    "de": { "key": "value" }
  }
  
  Component Code:
  \`\`\`tsx
  ${content}
  \`\`\`
  `;
  
  const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
  });
  
  const text = response.text;
  const compMatch = text.match(/===COMPONENT===\n([\s\S]*?)===TRANSLATIONS===/);
  const transMatch = text.match(/===TRANSLATIONS===\n([\s\S]*)/);
  
  if (compMatch && transMatch) {
    let newCode = compMatch[1].replace(/```tsx/g, '').replace(/```/g, '').trim();
    const transJson = JSON.parse(transMatch[1].replace(/```json/g, '').replace(/```/g, '').trim());
    
    fs.writeFileSync(filePath, newCode);
    
    for (const lang in transJson) {
      translations[lang] = { ...translations[lang], ...transJson[lang] };
    }
    console.log(`Processed ${file}`);
  } else {
    console.log(`Failed to process ${file}`);
  }
}

async function run() {
  for (const file of files) {
    await processFile(file);
  }
  
  const localesDir = path.join(process.cwd(), 'src', 'locales');
  for (const lang in translations) {
    fs.writeFileSync(path.join(localesDir, `${lang}.json`), JSON.stringify(translations[lang], null, 2));
  }
  console.log('Done!');
}

run();
