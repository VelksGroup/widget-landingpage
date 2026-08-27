import { ArrowRight, ArrowUpRight, Mail, Map, MapPin, Phone } from 'lucide-react';
import type { DemoRecord } from '../types';
import type { ResolvedTheme } from './theme';
import { getDemoStrings } from '../i18n';
import { buildWhatsappUrl, buildTelUrl } from '../utils';

export function SiteFooter({
  demo,
  theme,
  logoSrc,
  onOpenConversion,
}: {
  demo: DemoRecord;
  theme: ResolvedTheme;
  logoSrc: string | undefined;
  onOpenConversion: () => void;
}) {
  const strings = getDemoStrings(demo.language);
  const { contact, identity } = demo;

  return (
    <footer id="contacto" className="text-white" style={{ backgroundColor: '#111114' }}>
      {/* Final CTA band */}
      <div className="border-b border-white/10 py-20 sm:py-24">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="font-serif text-4xl font-semibold sm:text-6xl">
            {demo.content.tagline}
          </h2>
          {demo.content.shortDescription && (
            <p className="mx-auto mt-6 max-w-2xl text-lg font-light text-white/60">{demo.content.shortDescription}</p>
          )}
          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <button
              type="button"
              onClick={onOpenConversion}
              className="inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 font-medium transition-transform hover:scale-[1.02] active:scale-100"
              style={{ backgroundColor: theme.accent, color: theme.accentInk }}
            >
              {demo.conversion.ctaLabel || strings.requestQuote}
              <ArrowRight className="h-5 w-5" />
            </button>
            {contact.whatsapp && (
              <a
                href={buildWhatsappUrl(contact.whatsapp, '')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-green-600 px-8 py-4 font-medium text-white transition-transform hover:scale-[1.02] hover:bg-green-700 active:scale-100"
              >
                <Phone className="h-5 w-5" />
                WhatsApp
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Contacts / info grid */}
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 py-16 sm:px-10 md:grid-cols-2 lg:grid-cols-4 lg:px-12">
        <div>
          {logoSrc && <img src={logoSrc} alt={identity.companyName} referrerPolicy="no-referrer" className="mb-4 h-10 w-auto object-contain" />}
          <h3 className="font-serif text-2xl font-bold">{identity.companyName}</h3>
          {demo.content.shortDescription && <p className="mt-3 font-light text-white/50">{demo.content.shortDescription}</p>}
        </div>

        <div>
          <h4 className="mb-6 text-lg font-medium">Contactos</h4>
          <ul className="space-y-4 font-light text-white/50">
            {contact.phone && (
              <li>
                <a href={buildTelUrl(contact.phone)} className="flex items-start gap-3 transition-colors hover:text-white">
                  <Phone className="mt-0.5 h-5 w-5 shrink-0" style={{ color: theme.accent }} />
                  <span>{contact.phone}</span>
                </a>
              </li>
            )}
            {contact.email && (
              <li>
                <a href={`mailto:${contact.email}`} className="flex items-start gap-3 transition-colors hover:text-white">
                  <Mail className="mt-0.5 h-5 w-5 shrink-0" style={{ color: theme.accent }} />
                  <span>{contact.email}</span>
                </a>
              </li>
            )}
          </ul>
        </div>

        <div>
          <h4 className="mb-6 text-lg font-medium">{strings.viewOnMap}</h4>
          {contact.address && (
            <a
              href={contact.mapsUrl || `https://maps.google.com/?q=${encodeURIComponent(contact.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 font-light text-white/50 transition-colors hover:text-white"
            >
              <MapPin className="mt-0.5 h-5 w-5 shrink-0" style={{ color: theme.accent }} />
              <span>{contact.address}</span>
            </a>
          )}
          {(contact.directionsUrl || contact.mapsUrl) && (
            <a
              href={contact.directionsUrl || contact.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 flex items-center gap-2 text-sm font-medium uppercase tracking-widest transition-colors hover:text-white"
              style={{ color: theme.accent }}
            >
              <Map className="h-4 w-4" />
              {strings.getDirections}
            </a>
          )}
          {(contact.socialLinks ?? []).length > 0 && (
            <div className="mt-6 flex flex-wrap gap-4">
              {contact.socialLinks!.map((link) => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium uppercase tracking-widest text-white/50 underline-offset-4 transition-colors hover:text-white hover:underline"
                >
                  {link.platform}
                </a>
              ))}
            </div>
          )}
        </div>

        <div>
          <h4 className="mb-6 text-lg font-medium">{strings.openingHours}</h4>
          <ul className="space-y-2 font-light text-white/50">
            {(contact.openingHours ?? []).length > 0 ? (
              contact.openingHours!.map((entry) => (
                <li key={entry.days} className="flex justify-between gap-4">
                  <span>{entry.days}</span>
                  <span className="text-white/70">{entry.hours}</span>
                </li>
              ))
            ) : (
              <li className="italic text-white/30">—</li>
            )}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 px-6 py-6 text-center text-sm text-white/40 sm:px-10">
        <p>
          &copy; {new Date().getFullYear()} {identity.legalName ?? identity.companyName}. Todos os direitos reservados.
          <span className="mx-2 opacity-30">·</span>
          <a
            href="https://velksgroup.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-1 font-semibold"
            style={{ color: '#58a6ff' }}
          >
            {strings.demoCredit}
            <ArrowUpRight
              className="h-3.5 w-3.5 opacity-70 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
            />
          </a>
        </p>
      </div>
    </footer>
  );
}
