import { useEffect, useState } from 'react';
import { MessageCircle } from 'lucide-react';
import type { DemoRecord } from '../types';
import type { ResolvedTheme } from './theme';
import { getDemoStrings } from '../i18n';

interface NavLink {
  id: string;
  label: string;
}

export function SiteHeader({
  demo,
  theme,
  logoSrc,
  navLinks,
  onOpenConversion,
}: {
  demo: DemoRecord;
  theme: ResolvedTheme;
  logoSrc: string | undefined;
  navLinks: NavLink[];
  onOpenConversion: () => void;
}) {
  const strings = getDemoStrings(demo.language);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 48);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav
      className="fixed top-0 left-0 z-50 w-full transition-all duration-300"
      style={{
        backgroundColor: isScrolled ? `${theme.surface}e6` : 'transparent',
        backdropFilter: isScrolled ? 'blur(14px)' : undefined,
        boxShadow: isScrolled ? '0 1px 0 0 rgba(0,0,0,0.06)' : 'none',
        paddingTop: isScrolled ? '0.85rem' : '1.5rem',
        paddingBottom: isScrolled ? '0.85rem' : '1.5rem',
      }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-12">
        <a
          href="#topo"
          className="flex items-center gap-2 font-serif text-xl font-bold tracking-tight sm:text-2xl"
          style={{ color: isScrolled ? theme.ink : '#fff' }}
        >
          {logoSrc && <img src={logoSrc} alt={demo.identity.companyName} referrerPolicy="no-referrer" className="h-9 w-auto object-contain sm:h-10" />}
          {demo.identity.companyName}
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollTo(link.id)}
              className="text-sm font-medium transition-colors hover:opacity-70"
              style={{ color: isScrolled ? theme.inkMuted : 'rgba(255,255,255,0.85)' }}
            >
              {link.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={onOpenConversion}
          className="flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-colors sm:px-5"
          style={{
            backgroundColor: isScrolled ? theme.accent : 'rgba(255,255,255,0.14)',
            color: isScrolled ? theme.accentInk : '#fff',
            backdropFilter: isScrolled ? undefined : 'blur(8px)',
          }}
        >
          <MessageCircle className="h-4 w-4" strokeWidth={2} />
          <span className="hidden sm:inline">{demo.conversion.triggerLabel || strings.requestQuote}</span>
        </button>
      </div>
    </nav>
  );
}
