import { useState, type FormEvent } from 'react';
import type { DemoCompanyConfig, DemoService } from '../types';
import { getDemoStrings } from '../i18n';
import { buildQuoteMessage, buildWhatsappUrl, buildMailtoUrl } from '../utils';
import { cn } from '../../lib/utils';

interface QuoteRequestProps {
  config: DemoCompanyConfig;
  service: DemoService;
}

export function QuoteRequest({ config, service }: QuoteRequestProps) {
  const strings = getDemoStrings(config.language);
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const [visitorName, setVisitorName] = useState('');
  const [visitorPhone, setVisitorPhone] = useState('');
  const [visitorEmail, setVisitorEmail] = useState('');
  const [visitorNotes, setVisitorNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const canSend = Boolean(config.contact.whatsapp || config.contact.email);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: Record<string, boolean> = {};

    for (const field of service.quoteFields) {
      if (field.required && !fieldValues[field.key]?.trim()) {
        nextErrors[field.key] = true;
      }
    }
    if (!visitorName.trim()) nextErrors.visitorName = true;
    if (!visitorPhone.trim()) nextErrors.visitorPhone = true;

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const message = buildQuoteMessage(
      config,
      service,
      fieldValues,
      { name: visitorName, phone: visitorPhone, email: visitorEmail, notes: visitorNotes },
      config.language,
    );

    if (config.contact.whatsapp) {
      window.open(buildWhatsappUrl(config.contact.whatsapp, message), '_blank', 'noopener,noreferrer');
    } else if (config.contact.email) {
      const subject = `${strings.requestQuote} — ${config.companyName}`;
      window.open(buildMailtoUrl(config.contact.email, subject, message), '_blank', 'noopener,noreferrer');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
      {service.quoteFields.map((field) => (
        <div key={field.key} className="flex flex-col gap-1.5">
          <label htmlFor={`qf-${field.key}`} className="text-sm font-medium text-white/90">
            {field.label}
            {!field.required && <span className="ml-1 text-white/40">({strings.optional})</span>}
          </label>

          {field.type === 'textarea' ? (
            <textarea
              id={`qf-${field.key}`}
              required={field.required}
              placeholder={field.placeholder}
              aria-required={field.required}
              aria-describedby={errors[field.key] ? `qf-${field.key}-error` : undefined}
              value={fieldValues[field.key] ?? ''}
              onChange={(e) => setFieldValues((prev) => ({ ...prev, [field.key]: e.target.value }))}
              rows={3}
              className="rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-white placeholder-white/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
            />
          ) : field.type === 'select' ? (
            <select
              id={`qf-${field.key}`}
              required={field.required}
              aria-required={field.required}
              aria-describedby={errors[field.key] ? `qf-${field.key}-error` : undefined}
              value={fieldValues[field.key] ?? ''}
              onChange={(e) => setFieldValues((prev) => ({ ...prev, [field.key]: e.target.value }))}
              className="rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
            >
              <option value="" disabled>
                {field.placeholder ?? ''}
              </option>
              {field.options?.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          ) : (
            <input
              id={`qf-${field.key}`}
              type={field.type === 'number' ? 'number' : 'text'}
              required={field.required}
              placeholder={field.placeholder}
              aria-required={field.required}
              aria-describedby={errors[field.key] ? `qf-${field.key}-error` : undefined}
              value={fieldValues[field.key] ?? ''}
              onChange={(e) => setFieldValues((prev) => ({ ...prev, [field.key]: e.target.value }))}
              className="rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-white placeholder-white/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
            />
          )}

          {errors[field.key] && (
            <p id={`qf-${field.key}-error`} className="text-xs text-[#ff6b6b]">
              {strings.requiredFieldError}
            </p>
          )}
        </div>
      ))}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="visitor-name" className="text-sm font-medium text-white/90">
            {strings.name}
          </label>
          <input
            id="visitor-name"
            type="text"
            required
            aria-required="true"
            value={visitorName}
            onChange={(e) => setVisitorName(e.target.value)}
            className="rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
          />
          {errors.visitorName && <p className="text-xs text-[#ff6b6b]">{strings.requiredFieldError}</p>}
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="visitor-phone" className="text-sm font-medium text-white/90">
            {strings.phone}
          </label>
          <input
            id="visitor-phone"
            type="tel"
            required
            aria-required="true"
            value={visitorPhone}
            onChange={(e) => setVisitorPhone(e.target.value)}
            className="rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
          />
          {errors.visitorPhone && <p className="text-xs text-[#ff6b6b]">{strings.requiredFieldError}</p>}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="visitor-email" className="text-sm font-medium text-white/90">
          {strings.email} <span className="ml-1 text-white/40">({strings.optional})</span>
        </label>
        <input
          id="visitor-email"
          type="email"
          value={visitorEmail}
          onChange={(e) => setVisitorEmail(e.target.value)}
          className="rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="visitor-notes" className="text-sm font-medium text-white/90">
          {strings.notes} <span className="ml-1 text-white/40">({strings.optional})</span>
        </label>
        <textarea
          id="visitor-notes"
          rows={3}
          value={visitorNotes}
          onChange={(e) => setVisitorNotes(e.target.value)}
          className="rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
        />
      </div>

      {canSend ? (
        <button
          type="submit"
          className="mt-2 rounded-full bg-[#ff003c] px-6 py-3 font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          {config.contact.whatsapp ? strings.sendWhatsapp : strings.sendEmail}
        </button>
      ) : (
        <p className="mt-2 text-sm text-white/60">{strings.contactUnavailable}</p>
      )}
    </form>
  );
}
