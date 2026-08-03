const fs = require('fs');

const translations = {
  pt: {
    "footer_network_title": "REDE OPERACIONAL VELKS",
    "footer_network_institutional": "Institucional",
    "footer_network_ai_infrastructure": "Infraestrutura IA",
    "footer_network_commercial_automation": "Automação Comercial",
    "footer_network_digital_experiences": "Experiências Digitais"
  },
  en: {
    "footer_network_title": "VELKS OPERATIONAL NETWORK",
    "footer_network_institutional": "Institutional",
    "footer_network_ai_infrastructure": "AI Infrastructure",
    "footer_network_commercial_automation": "Commercial Automation",
    "footer_network_digital_experiences": "Digital Experiences"
  },
  es: {
    "footer_network_title": "RED OPERATIVA VELKS",
    "footer_network_institutional": "Institucional",
    "footer_network_ai_infrastructure": "Infraestructura IA",
    "footer_network_commercial_automation": "Automatización Comercial",
    "footer_network_digital_experiences": "Experiencias Digitales"
  },
  fr: {
    "footer_network_title": "RÉSEAU OPÉRATIONNEL VELKS",
    "footer_network_institutional": "Institutionnel",
    "footer_network_ai_infrastructure": "Infrastructure IA",
    "footer_network_commercial_automation": "Automatisation Commerciale",
    "footer_network_digital_experiences": "Expériences Numériques"
  },
  de: {
    "footer_network_title": "VELKS BETRIEBSNETZWERK",
    "footer_network_institutional": "Institutionell",
    "footer_network_ai_infrastructure": "KI-Infrastruktur",
    "footer_network_commercial_automation": "Kommerzielle Automatisierung",
    "footer_network_digital_experiences": "Digitale Erlebnisse"
  }
};

for (const lang in translations) {
  const file = `src/locales/${lang}.json`;
  let data = JSON.parse(fs.readFileSync(file, 'utf8'));
  data = { ...data, ...translations[lang] };
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}
