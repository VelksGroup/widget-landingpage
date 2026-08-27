import type { BusinessDemoConfig, DemoLanguage, Offering, QuoteField } from './types';
import { getDemoStrings } from './i18n';

/**
 * Normalizes a phone number for wa.me: keeps only digits, preserving the
 * international country code. wa.me requires digits only (no leading "+").
 */
export function normalizeWhatsappNumber(raw: string): string {
  return raw.replace(/[^\d]/g, '');
}

export function buildWhatsappUrl(rawPhone: string, message: string): string {
  const digits = normalizeWhatsappNumber(rawPhone);
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function buildMailtoUrl(email: string, subject: string, body: string): string {
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function resolveAbsoluteUrl(siteUrl: string, pathOrUrl: string): string {
  if (/^https?:\/\//i.test(pathOrUrl)) {
    return pathOrUrl;
  }
  const normalizedPath = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`;
  return `${siteUrl}${normalizedPath}`;
}

export interface VisitorInfo {
  name: string;
  phone: string;
  email?: string;
  notes?: string;
}

export interface SelectedOffering {
  offering: Offering;
  quantity: number;
  fieldValues: Record<string, string>;
}

const GREETING_BY_LANGUAGE: Record<DemoLanguage, string> = {
  pt: 'Olá, gostaria de pedir informação/orçamento.',
  en: 'Hello, I would like to request information/a quote.',
  es: 'Hola, me gustaría pedir información/un presupuesto.',
  fr: "Bonjour, je souhaite demander des informations/un devis.",
  de: 'Hallo, ich möchte Informationen/ein Angebot anfragen.',
  it: 'Salve, vorrei richiedere informazioni/un preventivo.',
};

const SECTION_LABELS: Record<DemoLanguage, { items: string; data: string; details: string; notes: string }> = {
  pt: { items: 'Itens selecionados', data: 'Dados', details: 'Detalhes', notes: 'Observações' },
  en: { items: 'Selected items', data: 'Details', details: 'Additional details', notes: 'Notes' },
  es: { items: 'Elementos seleccionados', data: 'Datos', details: 'Detalles', notes: 'Observaciones' },
  fr: { items: 'Éléments sélectionnés', data: 'Coordonnées', details: 'Détails', notes: 'Observations' },
  de: { items: 'Ausgewählte Posten', data: 'Angaben', details: 'Details', notes: 'Anmerkungen' },
  it: { items: 'Elementi selezionati', data: 'Dati', details: 'Dettagli', notes: 'Note' },
};

function formatFieldLine(field: QuoteField, value: string): string {
  const unit = field.unit ? ` ${field.unit}` : '';
  return `${field.label}: ${value}${unit}`;
}

export function buildConversionMessage(
  config: BusinessDemoConfig,
  selection: SelectedOffering[],
  globalFieldValues: Record<string, string>,
  visitor: VisitorInfo,
  language: DemoLanguage,
): string {
  const strings = getDemoStrings(language);
  const labels = SECTION_LABELS[language] ?? SECTION_LABELS.pt;
  const lines: string[] = [];

  lines.push(config.conversion.customMessageIntro || GREETING_BY_LANGUAGE[language] || GREETING_BY_LANGUAGE.pt, '');

  if (selection.length > 0) {
    lines.push(`${labels.items}:`);
    for (const { offering, quantity, fieldValues } of selection) {
      const qty = offering.quantityEnabled && quantity > 1 ? ` x${quantity}` : '';
      const price = offering.price ? ` (${offering.priceLabel ?? offering.price})` : '';
      lines.push(`- ${offering.title}${qty}${price}`);
      for (const field of offering.quoteFields ?? []) {
        const value = fieldValues[field.key]?.trim();
        if (value) lines.push(`  ${formatFieldLine(field, value)}`);
      }
    }
    lines.push('');
  }

  lines.push(`${labels.data}:`);
  lines.push(`${strings.name}: ${visitor.name}`);
  lines.push(`${strings.phone}: ${visitor.phone}`);
  if (visitor.email?.trim()) {
    lines.push(`${strings.email}: ${visitor.email.trim()}`);
  }

  const globalFields = config.conversion.globalQuoteFields ?? [];
  const filledGlobalFields = globalFields.filter((field) => globalFieldValues[field.key]?.trim());
  if (filledGlobalFields.length > 0) {
    lines.push('', `${labels.details}:`);
    for (const field of filledGlobalFields) {
      lines.push(formatFieldLine(field, globalFieldValues[field.key].trim()));
    }
  }

  if (visitor.notes?.trim()) {
    lines.push('', `${labels.notes}:`, visitor.notes.trim());
  }

  return lines.join('\n');
}
