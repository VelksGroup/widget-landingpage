import type { DemoService } from '../../types';
import { cn } from '../../../lib/utils';

interface AtVoltServiceCardProps {
  service: DemoService;
  glyph: React.ReactNode;
  selected: boolean;
  onSelect: (service: DemoService) => void;
}

export function AtVoltServiceCard({ service, glyph, selected, onSelect }: AtVoltServiceCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(service)}
      aria-pressed={selected}
      className={cn(
        'group flex flex-col items-start rounded-lg border p-6 text-left transition-colors',
        'border-[#eaf2f8]/15 bg-[#0b1d2e]/60 hover:border-[#e8a33d]/50',
        selected && 'border-[#e8a33d] bg-[#e8a33d]/10',
      )}
    >
      <span
        className={cn(
          'flex h-11 w-11 items-center justify-center rounded-md border text-[#eaf2f8]/70 transition-colors',
          'border-[#eaf2f8]/20',
          selected && 'border-[#e8a33d] text-[#e8a33d]',
        )}
      >
        <span className="h-6 w-6">{glyph}</span>
      </span>
      <h3 className="mt-4 text-lg font-semibold text-[#eaf2f8]">{service.title}</h3>
      <p className="mt-2 text-sm text-[#eaf2f8]/60">{service.description}</p>
      <span
        className={cn(
          'mt-4 font-mono text-xs uppercase tracking-[0.14em] text-[#eaf2f8]/40 transition-colors',
          selected && 'text-[#e8a33d]',
        )}
      >
        {selected ? 'Selecionado ✓' : 'Pedir orçamento →'}
      </span>
    </button>
  );
}
