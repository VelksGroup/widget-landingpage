import type { DemoService } from '../types';
import { cn } from '../../lib/utils';

interface ServiceCardProps {
  service: DemoService;
  selected: boolean;
  onSelect: (service: DemoService) => void;
}

export function ServiceCard({ service, selected, onSelect }: ServiceCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(service)}
      aria-pressed={selected}
      className={cn(
        'group flex flex-col text-left rounded-2xl border p-5 transition-colors',
        'bg-white/5 border-white/10 hover:border-white/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white',
        selected && 'border-[#ff003c] bg-[#ff003c]/10',
      )}
    >
      {service.image && (
        <img
          src={service.image}
          alt=""
          loading="lazy"
          className="mb-4 h-36 w-full rounded-xl object-cover"
        />
      )}
      <h3 className="text-lg font-semibold text-white">{service.title}</h3>
      <p className="mt-2 text-sm text-white/70">{service.description}</p>
    </button>
  );
}
