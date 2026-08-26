import { useEffect, useRef, useState } from 'react';

interface CircuitStep {
  label: string;
  description: string;
}

interface CircuitPathProps {
  steps: CircuitStep[];
}

/**
 * Renders a real sequence (contact -> structured request -> direct reply) as a
 * connected circuit path. Order carries meaning here, unlike a decorative 01/02/03.
 */
export function CircuitPath({ steps }: CircuitPathProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="relative">
      <svg
        aria-hidden="true"
        viewBox="0 0 100 4"
        preserveAspectRatio="none"
        className="absolute left-0 right-0 top-[26px] hidden h-[2px] w-full sm:block"
      >
        <line
          x1="8"
          y1="2"
          x2="92"
          y2="2"
          stroke="rgba(234,242,248,0.18)"
          strokeWidth="0.6"
        />
        <line
          x1="8"
          y1="2"
          x2="92"
          y2="2"
          stroke="#e8a33d"
          strokeWidth="0.6"
          strokeDasharray="84"
          strokeDashoffset={inView ? 0 : 84}
          style={{ transition: 'stroke-dashoffset 1.2s ease-out' }}
          className="motion-reduce:!transition-none"
        />
      </svg>

      <div className="relative grid gap-10 sm:grid-cols-3 sm:gap-6">
        {steps.map((step, index) => (
          <div key={step.label} className="flex flex-col items-start sm:items-center sm:text-center">
            <span
              className="mb-4 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-500 motion-reduce:!transition-none"
              style={{
                borderColor: inView ? '#e8a33d' : 'rgba(234,242,248,0.3)',
                backgroundColor: inView ? '#e8a33d' : 'transparent',
                boxShadow: inView ? '0 0 12px 2px rgba(232,163,61,0.6)' : 'none',
                transitionDelay: `${index * 250}ms`,
              }}
            />
            <h3 className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-[#e8a33d]">
              {step.label}
            </h3>
            <p className="mt-2 max-w-xs text-sm text-[#eaf2f8]/70">{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
