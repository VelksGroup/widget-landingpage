interface GlyphProps {
  className?: string;
}

/** Panel + outlet schematic — new circuits and installations. */
export function InstallationGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" className={className}>
      <rect x="6" y="6" width="16" height="22" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
      <line x1="10" y1="12" x2="18" y2="12" stroke="currentColor" strokeWidth="1.4" />
      <line x1="10" y1="17" x2="18" y2="17" stroke="currentColor" strokeWidth="1.4" />
      <line x1="10" y1="22" x2="18" y2="22" stroke="currentColor" strokeWidth="1.4" />
      <path d="M22 17H30V33" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="34" cy="37" r="6" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="32" cy="36" r="0.9" fill="currentColor" />
      <circle cx="36" cy="36" r="0.9" fill="currentColor" />
    </svg>
  );
}

/** Wrench + spark schematic — repairs and small fixes. */
export function RepairGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" className={className}>
      <path
        d="M30 12a7 7 0 00-9.6 8l-11 11 4 4 11-11a7 7 0 008-9.6l-4.4 4.4-3.4-1-1-3.4z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M34 8l1.6 4.4L40 14l-4 2-1.6 4-1.6-4-4-2 4.4-1.6z" fill="currentColor" />
    </svg>
  );
}
