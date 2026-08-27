import { useEffect, useState, type FormEvent } from 'react';
import type { VisualProfileTokens } from './visualProfiles';
import type { BusinessDemoConfig, ConversionMode } from '../types';
import type { SelectedOffering } from '../utils';
import { getDemoStrings } from '../i18n';
import { buildConversionMessage, buildMailtoUrl, buildWhatsappUrl } from '../utils';

const TRIGGER_ICON: Record<ConversionMode, string> = {
  order: '🛍️',
  quote: '📋',
  booking: '📅',
  contact: '✉️',
  consultation: '🩺',
};

interface FloatingTriggerProps {
  config: BusinessDemoConfig;
  tokens: VisualProfileTokens;
  count: number;
  onClick: () => void;
}

export function FloatingTrigger({ config, tokens, count, onClick }: FloatingTriggerProps) {
  const strings = getDemoStrings(config.language);
  const labelKey = `openConversion${capitalize(config.conversion.mode)}` as keyof ReturnType<typeof getDemoStrings>;
  const label = config.conversion.triggerLabel || (strings[labelKey] as string) || strings.requestQuote;

  return (
    <button
      type="button"
      onClick={onClick}
      className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full px-5 py-3.5 font-semibold shadow-2xl transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:bottom-8 sm:right-8"
      style={{ backgroundColor: tokens.palette.accent, color: tokens.palette.accentInk }}
      aria-label={label}
    >
      <span aria-hidden="true">{TRIGGER_ICON[config.conversion.mode]}</span>
      <span>{label}</span>
      {count > 0 && (
        <span
          className="flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-xs font-bold"
          style={{ backgroundColor: tokens.palette.accentInk, color: tokens.palette.accent }}
        >
          {count}
        </span>
      )}
    </button>
  );
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

interface ConversionCenterProps {
  config: BusinessDemoConfig;
  tokens: VisualProfileTokens;
  isOpen: boolean;
  onClose: () => void;
  selection: SelectedOffering[];
  onUpdateQuantity: (offeringId: string, quantity: number) => void;
  onUpdateFieldValue: (offeringId: string, fieldKey: string, value: string) => void;
  onRemove: (offeringId: string) => void;
}

export function ConversionCenter({
  config,
  tokens,
  isOpen,
  onClose,
  selection,
  onUpdateQuantity,
  onUpdateFieldValue,
  onRemove,
}: ConversionCenterProps) {
  const strings = getDemoStrings(config.language);
  const [globalFieldValues, setGlobalFieldValues] = useState<Record<string, string>>({});
  const [visitorName, setVisitorName] = useState('');
  const [visitorPhone, setVisitorPhone] = useState('');
  const [visitorEmail, setVisitorEmail] = useState('');
  const [visitorNotes, setVisitorNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const canSend = Boolean(config.contact.whatsapp || config.contact.email);
  const requiresSelection = !config.conversion.allowEmptySelection && selection.length === 0;

  const numericTotal = selection.reduce((sum, item) => {
    return typeof item.offering.price === 'number' ? sum + item.offering.price * item.quantity : sum;
  }, 0);
  const hasNonNumericPrice = selection.some((item) => item.offering.price && typeof item.offering.price !== 'number');
  const hasAnyPrice = selection.some((item) => item.offering.price !== undefined);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: Record<string, boolean> = {};

    for (const item of selection) {
      for (const field of item.offering.quoteFields ?? []) {
        if (field.required && !item.fieldValues[field.key]?.trim()) {
          nextErrors[`${item.offering.id}:${field.key}`] = true;
        }
      }
    }
    for (const field of config.conversion.globalQuoteFields ?? []) {
      if (field.required && !globalFieldValues[field.key]?.trim()) {
        nextErrors[`global:${field.key}`] = true;
      }
    }
    if (!visitorName.trim()) nextErrors.visitorName = true;
    if (!visitorPhone.trim()) nextErrors.visitorPhone = true;

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0 || requiresSelection) return;

    const message = buildConversionMessage(
      config,
      selection,
      globalFieldValues,
      { name: visitorName, phone: visitorPhone, email: visitorEmail, notes: visitorNotes },
      config.language,
    );

    const channel = config.contact.whatsapp ? 'whatsapp' : config.contact.email ? 'email' : null;
    if (channel === 'whatsapp' && config.contact.whatsapp) {
      window.open(buildWhatsappUrl(config.contact.whatsapp, message), '_blank', 'noopener,noreferrer');
    } else if (channel === 'email' && config.contact.email) {
      const subject = `${strings.requestQuote} — ${config.companyName}`;
      window.open(buildMailtoUrl(config.contact.email, subject, message), '_blank', 'noopener,noreferrer');
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={strings.requestQuote}
        className="relative flex h-full w-full flex-col overflow-y-auto shadow-2xl sm:max-w-md"
        style={{ backgroundColor: tokens.palette.surface, color: tokens.palette.ink }}
      >
        <div
          className="flex items-center justify-between border-b px-5 py-4 sm:px-6"
          style={{ borderColor: tokens.palette.border }}
        >
          <h2 className="text-lg font-bold">{strings.requestQuote}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={strings.close}
            className="rounded-full p-2 text-xl leading-none opacity-70 hover:opacity-100 focus-visible:outline focus-visible:outline-2"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-6 px-5 py-5 sm:px-6" noValidate>
          {selection.length === 0 ? (
            <p style={{ color: tokens.palette.inkMuted }}>{strings.emptySelection}</p>
          ) : (
            <ul className="flex flex-col gap-4">
              {selection.map((item) => (
                <li
                  key={item.offering.id}
                  className="rounded-lg border p-4"
                  style={{ borderColor: tokens.palette.border }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold">{item.offering.title}</p>
                      {item.offering.price !== undefined && (
                        <p className="text-sm" style={{ color: tokens.palette.inkMuted }}>
                          {item.offering.priceLabel ?? item.offering.price}
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => onRemove(item.offering.id)}
                      className="text-xs font-medium underline opacity-70 hover:opacity-100"
                    >
                      {strings.remove}
                    </button>
                  </div>

                  {item.offering.quantityEnabled && (
                    <div className="mt-3 flex items-center gap-3">
                      <span className="text-sm" style={{ color: tokens.palette.inkMuted }}>
                        {strings.quantity}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.offering.id, Math.max(1, item.quantity - 1))}
                          className="h-7 w-7 rounded-full border text-sm"
                          style={{ borderColor: tokens.palette.border }}
                          aria-label="-"
                        >
                          −
                        </button>
                        <span className="w-4 text-center text-sm">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.offering.id, item.quantity + 1)}
                          className="h-7 w-7 rounded-full border text-sm"
                          style={{ borderColor: tokens.palette.border }}
                          aria-label="+"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  )}

                  {(item.offering.quoteFields ?? []).length > 0 && (
                    <div className="mt-4 flex flex-col gap-3">
                      {item.offering.quoteFields!.map((field) => (
                        <FieldInput
                          key={field.key}
                          field={field}
                          tokens={tokens}
                          value={item.fieldValues[field.key] ?? ''}
                          onChange={(v) => onUpdateFieldValue(item.offering.id, field.key, v)}
                          hasError={Boolean(errors[`${item.offering.id}:${field.key}`])}
                          errorText={strings.requiredFieldError}
                          idPrefix={`cc-${item.offering.id}`}
                        />
                      ))}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}

          {hasAnyPrice && (
            <div className="flex items-center justify-between border-t pt-4 text-sm font-semibold" style={{ borderColor: tokens.palette.border }}>
              <span>
                {strings.total}
                {hasNonNumericPrice ? ` (${strings.estimated})` : ''}
              </span>
              <span>{numericTotal > 0 ? numericTotal : '—'}</span>
            </div>
          )}

          {(config.conversion.globalQuoteFields ?? []).length > 0 && (
            <div className="flex flex-col gap-3 border-t pt-4" style={{ borderColor: tokens.palette.border }}>
              {config.conversion.globalQuoteFields!.map((field) => (
                <FieldInput
                  key={field.key}
                  field={field}
                  tokens={tokens}
                  value={globalFieldValues[field.key] ?? ''}
                  onChange={(v) => setGlobalFieldValues((prev) => ({ ...prev, [field.key]: v }))}
                  hasError={Boolean(errors[`global:${field.key}`])}
                  errorText={strings.requiredFieldError}
                  idPrefix="cc-global"
                />
              ))}
            </div>
          )}

          <div className="flex flex-col gap-3 border-t pt-4" style={{ borderColor: tokens.palette.border }}>
            <p className="text-sm font-semibold">{strings.yourDetails}</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <TextInput
                id="cc-visitor-name"
                label={strings.name}
                tokens={tokens}
                value={visitorName}
                onChange={setVisitorName}
                required
                hasError={errors.visitorName}
                errorText={strings.requiredFieldError}
              />
              <TextInput
                id="cc-visitor-phone"
                label={strings.phone}
                tokens={tokens}
                value={visitorPhone}
                onChange={setVisitorPhone}
                required
                type="tel"
                hasError={errors.visitorPhone}
                errorText={strings.requiredFieldError}
              />
            </div>
            <TextInput
              id="cc-visitor-email"
              label={`${strings.email} (${strings.optional})`}
              tokens={tokens}
              value={visitorEmail}
              onChange={setVisitorEmail}
              type="email"
            />
            <TextAreaInput
              id="cc-visitor-notes"
              label={`${strings.notes} (${strings.optional})`}
              tokens={tokens}
              value={visitorNotes}
              onChange={setVisitorNotes}
            />
          </div>

          {requiresSelection && (
            <p className="text-sm" style={{ color: tokens.palette.inkMuted }}>
              {strings.selectServicePrompt}
            </p>
          )}

          {canSend ? (
            <button
              type="submit"
              disabled={requiresSelection}
              className="mt-1 rounded-full px-6 py-3.5 font-semibold transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-40"
              style={{ backgroundColor: tokens.palette.accent, color: tokens.palette.accentInk }}
            >
              {config.contact.whatsapp ? strings.sendWhatsapp : strings.sendEmail}
            </button>
          ) : (
            <p className="text-sm" style={{ color: tokens.palette.inkMuted }}>
              {strings.contactUnavailable}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

function FieldInput({
  field,
  tokens,
  value,
  onChange,
  hasError,
  errorText,
  idPrefix,
}: {
  field: import('../types').QuoteField;
  tokens: VisualProfileTokens;
  value: string;
  onChange: (v: string) => void;
  hasError: boolean;
  errorText: string;
  idPrefix: string;
}) {
  const id = `${idPrefix}-${field.key}`;
  const strings = { optional: 'opcional' };

  const inputClass = 'w-full rounded-lg border px-3 py-2 text-sm focus-visible:outline focus-visible:outline-2';
  const style = { borderColor: tokens.palette.border, backgroundColor: 'transparent', color: tokens.palette.ink };

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium">
        {field.label}
        {!field.required && <span className="ml-1 opacity-50">({strings.optional})</span>}
      </label>
      {field.type === 'textarea' ? (
        <textarea id={id} rows={2} value={value} onChange={(e) => onChange(e.target.value)} placeholder={field.placeholder} className={inputClass} style={style} />
      ) : field.type === 'select' ? (
        <select id={id} value={value} onChange={(e) => onChange(e.target.value)} className={inputClass} style={style}>
          <option value="" disabled>
            {field.placeholder ?? ''}
          </option>
          {field.options?.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={id}
          type={field.type === 'number' ? 'number' : 'text'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          className={inputClass}
          style={style}
        />
      )}
      {hasError && <p className="text-xs text-red-500">{errorText}</p>}
    </div>
  );
}

function TextInput({
  id,
  label,
  tokens,
  value,
  onChange,
  required,
  type = 'text',
  hasError,
  errorText,
}: {
  id: string;
  label: string;
  tokens: VisualProfileTokens;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  type?: string;
  hasError?: boolean;
  errorText?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <input
        id={id}
        type={type}
        required={required}
        aria-required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border px-3 py-2 text-base focus-visible:outline focus-visible:outline-2"
        style={{ borderColor: tokens.palette.border, backgroundColor: 'transparent', color: tokens.palette.ink }}
      />
      {hasError && errorText && <p className="text-xs text-red-500">{errorText}</p>}
    </div>
  );
}

function TextAreaInput({
  id,
  label,
  tokens,
  value,
  onChange,
}: {
  id: string;
  label: string;
  tokens: VisualProfileTokens;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <textarea
        id={id}
        rows={3}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border px-3 py-2 text-base focus-visible:outline focus-visible:outline-2"
        style={{ borderColor: tokens.palette.border, backgroundColor: 'transparent', color: tokens.palette.ink }}
      />
    </div>
  );
}
