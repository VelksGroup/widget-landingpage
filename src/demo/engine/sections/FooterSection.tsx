import type { BusinessDemoConfig } from '../../types';
import type { VisualProfileTokens } from '../visualProfiles';
import { getDemoStrings } from '../../i18n';

interface FooterSectionProps {
  config: BusinessDemoConfig;
  tokens: VisualProfileTokens;
}

export function FooterSection({ config, tokens }: FooterSectionProps) {
  const strings = getDemoStrings(config.language);
  const { contact } = config;

  return (
    <footer
      className="border-t px-6 py-12 sm:px-10"
      style={{ borderColor: tokens.palette.border, backgroundColor: tokens.palette.background, color: tokens.palette.ink }}
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            {config.logo?.src && (
              <img src={config.logo.src} alt={config.logo.alt} className="mb-3 h-9 w-auto object-contain" />
            )}
            <p className="font-semibold">{config.companyName}</p>
            {config.shortDescription && (
              <p className="mt-2 max-w-xs text-sm" style={{ color: tokens.palette.inkMuted }}>
                {config.shortDescription}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1.5 text-sm" style={{ color: tokens.palette.inkMuted }}>
            {contact.phone && <span>{contact.phone}</span>}
            {contact.whatsapp && <span>WhatsApp: {contact.whatsapp}</span>}
            {contact.email && <span>{contact.email}</span>}
            {contact.address && <span>{contact.address}</span>}
            {contact.directionsUrl && (
              <a href={contact.directionsUrl} target="_blank" rel="noopener noreferrer" className="mt-1 font-semibold underline" style={{ color: tokens.palette.accent }}>
                {strings.getDirections}
              </a>
            )}
          </div>

          <div className="flex flex-col gap-3">
            {(contact.openingHours ?? []).length > 0 && (
              <div className="text-sm" style={{ color: tokens.palette.inkMuted }}>
                <p className="font-semibold" style={{ color: tokens.palette.ink }}>
                  {strings.openingHours}
                </p>
                {contact.openingHours!.map((entry) => (
                  <p key={entry.days}>
                    {entry.days}: {entry.hours}
                  </p>
                ))}
              </div>
            )}
            {(contact.socialLinks ?? []).length > 0 && (
              <div className="flex gap-3">
                {contact.socialLinks!.map((link) => (
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold underline"
                    style={{ color: tokens.palette.accent }}
                  >
                    {link.platform}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        <div
          className="flex flex-col items-center gap-2 border-t pt-6 text-center text-xs sm:flex-row sm:justify-between sm:text-left"
          style={{ borderColor: tokens.palette.border, color: tokens.palette.inkMuted }}
        >
          <span>
            © {new Date().getFullYear()} {config.legalName ?? config.companyName}
          </span>
          <a href="https://velks.space" target="_blank" rel="noopener noreferrer" className="font-semibold underline opacity-80 hover:opacity-100">
            {strings.demoCredit}
          </a>
        </div>
      </div>
    </footer>
  );
}
