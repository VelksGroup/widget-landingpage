import { useEffect, useState, type FormEvent } from 'react';
import type { ResolvedTheme } from './theme';
import type { DemoRecord, ConversionMode, ConversionChannel } from '../types';
import type { SelectedOffering } from '../utils';
import { getDemoStrings } from '../i18n';
import {
  buildConversionMessage,
  buildMailtoUrl,
  buildWhatsappUrl,
  buildTelUrl,
  formatCurrency,
  formatOfferingPrice,
  ITEM_NOTE_FIELD_KEY,
} from '../utils';
import { logDemoEvent } from '../fetchDemo';

const TRIGGER_ICON: Record<ConversionMode, string> = {
  order: '🛍️',
  quote: '📋',
  booking: '📅',
  contact: '✉️',
  consultation: '🩺',
};

interface FloatingTriggerProps {
  demo: DemoRecord;
  theme: ResolvedTheme;
  count: number;
  onClick: () => void;
}

export function FloatingTrigger({ demo, theme, count, onClick }: FloatingTriggerProps) {
  const strings = getDemoStrings(demo.language);
  const labelKey = `openConversion${capitalize(demo.conversion.mode)}` as keyof ReturnType<typeof getDemoStrings>;
  const label = demo.conversion.triggerLabel || (strings[labelKey] as string) || strings.requestQuote;

  return (
    <button
      type="button"
      onClick={onClick}
      className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full px-5 py-3.5 font-semibold shadow-2xl transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:bottom-8 sm:right-8"
      style={{ backgroundColor: theme.accent, color: theme.accentInk }}
      aria-label={label}
    >
      <span aria-hidden="true">{TRIGGER_ICON[demo.conversion.mode]}</span>
      <span>{label}</span>
      {count > 0 && (
        <span
          className="flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-xs font-bold"
          style={{ backgroundColor: theme.accentInk, color: theme.accent }}
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

function resolveChannelContact(demo: DemoRecord, channel: ConversionChannel | undefined): string | undefined {
  if (!channel) return undefined;
  if (channel === 'whatsapp') return demo.contact.whatsapp;
  if (channel === 'email') return demo.contact.email;
  if (channel === 'phone') return demo.contact.phone;
  return undefined;
}

interface ConversionCenterProps {
  demo: DemoRecord;
  theme: ResolvedTheme;
  isOpen: boolean;
  onClose: () => void;
  selection: SelectedOffering[];
  onUpdateQuantity: (offeringId: string, quantity: number) => void;
  onUpdateFieldValue: (offeringId: string, fieldKey: string, value: string) => void;
  onRemove: (offeringId: string) => void;
  onSubmitted?: () => void;
}

export function ConversionCenter({
  demo,
  theme,
  isOpen,
  onClose,
  selection,
  onUpdateQuantity,
  onUpdateFieldValue,
  onRemove,
  onSubmitted,
}: ConversionCenterProps) {
  const strings = getDemoStrings(demo.language);
  const modeLabelKey = `openConversion${capitalize(demo.conversion.mode)}` as keyof ReturnType<typeof getDemoStrings>;
  const dialogTitle = (strings[modeLabelKey] as string) || strings.requestQuote;
  const [globalFieldValues, setGlobalFieldValues] = useState<Record<string, string>>({});
  const [visitorName, setVisitorName] = useState('');
  const [visitorPhone, setVisitorPhone] = useState('');
  const [visitorEmail, setVisitorEmail] = useState('');
  const [visitorNotes, setVisitorNotes] = useState('');
  const [orderFulfillment, setOrderFulfillment] = useState('');
  const [orderPreferredTime, setOrderPreferredTime] = useState('');
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const isOrderMode = demo.conversion.mode === 'order';

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const primaryContact = resolveChannelContact(demo, demo.conversion.primaryChannel);
  const secondaryContact = resolveChannelContact(demo, demo.conversion.secondaryChannel);
  const activeChannel: ConversionChannel | undefined = primaryContact
    ? demo.conversion.primaryChannel
    : secondaryContact
      ? demo.conversion.secondaryChannel
      : undefined;
  const activeContact = primaryContact ?? secondaryContact;
  const canSend = Boolean(activeChannel && activeContact);
  const requiresSelection = !demo.conversion.allowEmptySelection && selection.length === 0;

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
    for (const field of demo.conversion.globalQuoteFields ?? []) {
      if (field.required && !globalFieldValues[field.key]?.trim()) {
        nextErrors[`global:${field.key}`] = true;
      }
    }
    if (!visitorName.trim()) nextErrors.visitorName = true;
    if (!visitorPhone.trim()) nextErrors.visitorPhone = true;

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0 || requiresSelection || !activeChannel || !activeContact) return;

    const message = buildConversionMessage(
      demo,
      selection,
      globalFieldValues,
      { name: visitorName, phone: visitorPhone, email: visitorEmail, notes: visitorNotes },
      demo.language,
      isOrderMode ? { fulfillmentType: orderFulfillment, preferredTime: orderPreferredTime } : undefined,
    );

    if (activeChannel === 'whatsapp') {
      window.open(buildWhatsappUrl(activeContact, message), '_blank', 'noopener,noreferrer');
      logDemoEvent(demo.id, 'whatsapp_click');
    } else if (activeChannel === 'email') {
      const subject = `${strings.requestQuote} — ${demo.identity.companyName}`;
      window.open(buildMailtoUrl(activeContact, subject, message), '_blank', 'noopener,noreferrer');
      logDemoEvent(demo.id, 'email_click');
    } else if (activeChannel === 'phone') {
      window.location.href = buildTelUrl(activeContact);
      logDemoEvent(demo.id, 'phone_click');
    }
    onSubmitted?.();
  }

  const sendLabel =
    activeChannel === 'whatsapp' ? strings.sendWhatsapp : activeChannel === 'phone' ? strings.sendPhone : strings.sendEmail;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={dialogTitle}
        className="relative flex h-full w-full flex-col overflow-y-auto shadow-2xl sm:max-w-md"
        style={{ backgroundColor: theme.surface, color: theme.ink }}
      >
        <div className="flex items-center justify-between border-b px-5 py-4 sm:px-6" style={{ borderColor: theme.border }}>
          <h2 className="text-lg font-bold">{dialogTitle}</h2>
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
            <p style={{ color: theme.inkMuted }}>{strings.emptySelection}</p>
          ) : (
            <ul className="flex flex-col gap-4">
              {selection.map((item) => {
                const priceLabel = formatOfferingPrice(item.offering);
                return (
                <li key={item.offering.id} className="rounded-lg border p-4" style={{ borderColor: theme.border }}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      {item.offering.image && (
                        <img
                          src={item.offering.image}
                          alt=""
                          referrerPolicy="no-referrer"
                          className="h-12 w-12 shrink-0 rounded-md object-cover"
                          style={{ backgroundColor: theme.border }}
                        />
                      )}
                      <div>
                        <p className="font-semibold">{item.offering.title}</p>
                        {priceLabel && (
                          <p className="text-sm" style={{ color: theme.inkMuted }}>
                            {priceLabel}
                          </p>
                        )}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => onRemove(item.offering.id)}
                      className="shrink-0 text-xs font-medium underline opacity-70 hover:opacity-100"
                    >
                      {strings.remove}
                    </button>
                  </div>

                  {item.offering.quantityEnabled && (
                    <div className="mt-3 flex items-center gap-3">
                      <span className="text-sm" style={{ color: theme.inkMuted }}>
                        {strings.quantity}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.offering.id, Math.max(1, item.quantity - 1))}
                          className="h-7 w-7 rounded-full border text-sm"
                          style={{ borderColor: theme.border }}
                          aria-label="-"
                        >
                          −
                        </button>
                        <span className="w-4 text-center text-sm">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.offering.id, item.quantity + 1)}
                          className="h-7 w-7 rounded-full border text-sm"
                          style={{ borderColor: theme.border }}
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
                          theme={theme}
                          value={item.fieldValues[field.key] ?? ''}
                          onChange={(v) => onUpdateFieldValue(item.offering.id, field.key, v)}
                          hasError={Boolean(errors[`${item.offering.id}:${field.key}`])}
                          errorText={strings.requiredFieldError}
                          idPrefix={`cc-${item.offering.id}`}
                          optionalLabel={strings.optional}
                        />
                      ))}
                    </div>
                  )}

                  <div className="mt-3 flex flex-col gap-1">
                    <label htmlFor={`cc-${item.offering.id}-note`} className="text-xs font-medium" style={{ color: theme.inkMuted }}>
                      {strings.notes} ({strings.optional})
                    </label>
                    <textarea
                      id={`cc-${item.offering.id}-note`}
                      rows={1}
                      value={item.fieldValues[ITEM_NOTE_FIELD_KEY] ?? ''}
                      onChange={(e) => onUpdateFieldValue(item.offering.id, ITEM_NOTE_FIELD_KEY, e.target.value)}
                      className="w-full rounded-lg border px-3 py-2 text-sm focus-visible:outline focus-visible:outline-2"
                      style={{ borderColor: theme.border, backgroundColor: 'transparent', color: theme.ink }}
                    />
                  </div>
                </li>
                );
              })}
            </ul>
          )}

          {hasAnyPrice && (
            <div className="flex items-center justify-between border-t pt-4 text-sm font-semibold" style={{ borderColor: theme.border }}>
              <span>
                {strings.total}
                {hasNonNumericPrice ? ` (${strings.estimated})` : ''}
              </span>
              <span>{numericTotal > 0 ? formatCurrency(numericTotal) : '—'}</span>
            </div>
          )}

          {isOrderMode && (
            <div className="grid gap-3 border-t pt-4 sm:grid-cols-2" style={{ borderColor: theme.border }}>
              <div className="flex flex-col gap-1">
                <label htmlFor="cc-order-fulfillment" className="text-sm font-medium">
                  {strings.fulfillmentTypeLabel} <span className="ml-1 opacity-50">({strings.optional})</span>
                </label>
                <select
                  id="cc-order-fulfillment"
                  value={orderFulfillment}
                  onChange={(e) => setOrderFulfillment(e.target.value)}
                  className="w-full rounded-lg border px-3 py-2 text-sm focus-visible:outline focus-visible:outline-2"
                  style={{ borderColor: theme.border, backgroundColor: 'transparent', color: theme.ink }}
                >
                  <option value=""></option>
                  <option value={strings.fulfillmentPickup}>{strings.fulfillmentPickup}</option>
                  <option value={strings.fulfillmentDelivery}>{strings.fulfillmentDelivery}</option>
                  <option value={strings.fulfillmentOther}>{strings.fulfillmentOther}</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="cc-order-time" className="text-sm font-medium">
                  {strings.preferredTimeLabel} <span className="ml-1 opacity-50">({strings.optional})</span>
                </label>
                <input
                  id="cc-order-time"
                  type="text"
                  value={orderPreferredTime}
                  onChange={(e) => setOrderPreferredTime(e.target.value)}
                  className="w-full rounded-lg border px-3 py-2 text-sm focus-visible:outline focus-visible:outline-2"
                  style={{ borderColor: theme.border, backgroundColor: 'transparent', color: theme.ink }}
                />
              </div>
            </div>
          )}

          {(demo.conversion.globalQuoteFields ?? []).length > 0 && (
            <div className="flex flex-col gap-3 border-t pt-4" style={{ borderColor: theme.border }}>
              {demo.conversion.globalQuoteFields!.map((field) => (
                <FieldInput
                  key={field.key}
                  field={field}
                  theme={theme}
                  value={globalFieldValues[field.key] ?? ''}
                  onChange={(v) => setGlobalFieldValues((prev) => ({ ...prev, [field.key]: v }))}
                  hasError={Boolean(errors[`global:${field.key}`])}
                  errorText={strings.requiredFieldError}
                  idPrefix="cc-global"
                  optionalLabel={strings.optional}
                />
              ))}
            </div>
          )}

          <div className="flex flex-col gap-3 border-t pt-4" style={{ borderColor: theme.border }}>
            <p className="text-sm font-semibold">{strings.yourDetails}</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <TextInput
                id="cc-visitor-name"
                label={strings.name}
                theme={theme}
                value={visitorName}
                onChange={setVisitorName}
                required
                hasError={errors.visitorName}
                errorText={strings.requiredFieldError}
              />
              <TextInput
                id="cc-visitor-phone"
                label={strings.phone}
                theme={theme}
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
              theme={theme}
              value={visitorEmail}
              onChange={setVisitorEmail}
              type="email"
            />
            <TextAreaInput
              id="cc-visitor-notes"
              label={`${strings.notes} (${strings.optional})`}
              theme={theme}
              value={visitorNotes}
              onChange={setVisitorNotes}
            />
          </div>

          {requiresSelection && (
            <p className="text-sm" style={{ color: theme.inkMuted }}>
              {strings.selectServicePrompt}
            </p>
          )}

          {canSend ? (
            <button
              type="submit"
              disabled={requiresSelection}
              className="mt-1 rounded-full px-6 py-3.5 font-semibold transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-40"
              style={{ backgroundColor: theme.accent, color: theme.accentInk }}
            >
              {sendLabel}
            </button>
          ) : (
            <p className="text-sm" style={{ color: theme.inkMuted }}>
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
  theme,
  value,
  onChange,
  hasError,
  errorText,
  idPrefix,
  optionalLabel,
}: {
  field: import('../types').QuoteField;
  theme: ResolvedTheme;
  value: string;
  onChange: (v: string) => void;
  hasError: boolean;
  errorText: string;
  idPrefix: string;
  optionalLabel: string;
}) {
  const id = `${idPrefix}-${field.key}`;
  const inputClass = 'w-full rounded-lg border px-3 py-2 text-sm focus-visible:outline focus-visible:outline-2';
  const style = { borderColor: theme.border, backgroundColor: 'transparent', color: theme.ink };

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium">
        {field.label}
        {!field.required && <span className="ml-1 opacity-50">({optionalLabel})</span>}
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
  theme,
  value,
  onChange,
  required,
  type = 'text',
  hasError,
  errorText,
}: {
  id: string;
  label: string;
  theme: ResolvedTheme;
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
        style={{ borderColor: theme.border, backgroundColor: 'transparent', color: theme.ink }}
      />
      {hasError && errorText && <p className="text-xs text-red-500">{errorText}</p>}
    </div>
  );
}

function TextAreaInput({
  id,
  label,
  theme,
  value,
  onChange,
}: {
  id: string;
  label: string;
  theme: ResolvedTheme;
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
        style={{ borderColor: theme.border, backgroundColor: 'transparent', color: theme.ink }}
      />
    </div>
  );
}
