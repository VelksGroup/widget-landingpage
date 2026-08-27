import { useState } from 'react';

interface BreakerButtonProps {
  href: string;
  children: React.ReactNode;
}

/**
 * Primary CTA styled as a circuit breaker rocker switch — flips "on" on hover/focus.
 * Purely decorative state; the link itself always works regardless of the toggle.
 */
export function BreakerButton({ href, children }: BreakerButtonProps) {
  const [engaged, setEngaged] = useState(false);

  return (
    <a
      href={href}
      onMouseEnter={() => setEngaged(true)}
      onMouseLeave={() => setEngaged(false)}
      onFocus={() => setEngaged(true)}
      onBlur={() => setEngaged(false)}
      className="group inline-flex items-center gap-4 rounded-md border border-[#e8a33d]/60 bg-[#0b1d2e] px-6 py-4 transition-colors hover:bg-[#e8a33d]/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e8a33d]"
    >
      <span
        aria-hidden="true"
        className="relative flex h-7 w-12 shrink-0 items-center rounded-full border border-[#e8a33d]/50 bg-black/40 p-1 transition-colors"
      >
        <span
          className="h-5 w-5 rounded-full bg-[#e8a33d] shadow-[0_0_10px_2px_rgba(232,163,61,0.7)] transition-transform duration-300 ease-out motion-reduce:transition-none"
          style={{ transform: engaged ? 'translateX(20px)' : 'translateX(0)' }}
        />
      </span>
      <span className="font-mono text-sm font-semibold uppercase tracking-[0.14em] text-[#eaf2f8]">
        {children}
      </span>
    </a>
  );
}
