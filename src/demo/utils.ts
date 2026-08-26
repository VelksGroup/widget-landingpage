import type { DemoCompanyConfig, DemoService, DemoLanguage } from './types';
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

export interface VisitorInfo {
  name: string;
  phone: string;
  email?: string;
  notes?: string;
}

export function buildQuoteMessage(
  config: DemoCompanyConfig,
  service: DemoService,
  fieldValues: Record<string, string>,
  visitor: VisitorInfo,
  language: DemoLanguage,
): string {
  const strings = getDemoStrings(language);
  const lines: string[] = [];

  const greeting =
    language === 'en'
      ? 'Hello, I would like to request a quote.'
      : language === 'es'
        ? 'Hola, me gustaría pedir un presupuesto.'
        : language === 'fr'
          ? 'Bonjour, je souhaite demander un devis.'
          : language === 'de'
            ? 'Hallo, ich möchte ein Angebot anfragen.'
            : language === 'it'
              ? 'Salve, vorrei richiedere un preventivo.'
              : 'Olá, gostaria de pedir um orçamento.';

  lines.push(greeting, '');

  const companyLabel =
    language === 'en'
      ? 'Company'
      : language === 'es'
        ? 'Empresa'
        : language === 'fr'
          ? 'Entreprise'
          : language === 'de'
            ? 'Firma'
            : language === 'it'
              ? 'Azienda'
              : 'Empresa';
  const serviceLabel =
    language === 'en'
      ? 'Service'
      : language === 'es'
        ? 'Servicio'
        : language === 'fr'
          ? 'Service'
          : language === 'de'
            ? 'Leistung'
            : language === 'it'
              ? 'Servizio'
              : 'Serviço';

  lines.push(`${companyLabel}: ${config.companyName}`);
  lines.push(`${serviceLabel}: ${service.title}`);
  lines.push('');

  for (const field of service.quoteFields) {
    const value = fieldValues[field.key]?.trim();
    if (value) {
      const unit = field.unit ? ` ${field.unit}` : '';
      lines.push(`${field.label}: ${value}${unit}`);
    }
  }

  lines.push('');
  lines.push(`${strings.name}: ${visitor.name}`);
  lines.push(`${strings.phone}: ${visitor.phone}`);
  if (visitor.email?.trim()) {
    lines.push(`${strings.email}: ${visitor.email.trim()}`);
  }

  if (visitor.notes?.trim()) {
    lines.push('');
    lines.push(`${strings.notes}:`);
    lines.push(visitor.notes.trim());
  }

  return lines.join('\n');
}

export function resolveAbsoluteUrl(siteUrl: string, pathOrUrl: string): string {
  if (/^https?:\/\//i.test(pathOrUrl)) {
    return pathOrUrl;
  }
  const normalizedPath = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`;
  return `${siteUrl}${normalizedPath}`;
}
