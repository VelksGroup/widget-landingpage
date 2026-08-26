import { useState } from 'react';
import type { DemoCompanyConfig, DemoService } from '../../types';
import { QuoteRequest } from '../../components/QuoteRequest';
import { BlueprintGrid } from './BlueprintGrid';
import { BreakerButton } from './BreakerButton';
import { HeroSchematic } from './HeroSchematic';
import { CircuitPath } from './CircuitPath';
import { AtVoltServiceCard } from './AtVoltServiceCard';
import { InstallationGlyph, RepairGlyph } from './ServiceGlyphs';

const GLYPHS: Record<string, React.ReactNode> = {
  'instalacoes-eletricas': <InstallationGlyph className="h-full w-full" />,
  'arranjos-reparacoes': <RepairGlyph className="h-full w-full" />,
};

const PROCESS_STEPS = [
  {
    label: 'Descreva o trabalho',
    description: 'Indique o espaço, o tipo de intervenção e os detalhes que já sabe.',
  },
  {
    label: 'Pedido estruturado',
    description: 'A informação é organizada num pedido claro, pronto a enviar.',
  },
  {
    label: 'Resposta direta da AT VOLT',
    description: 'Sem trocas infinitas de mensagens para chegar ao essencial.',
  },
];

export function AtVoltDemo({ config }: { config: DemoCompanyConfig }) {
  const [selectedService, setSelectedService] = useState<DemoService | undefined>(undefined);

  return (
    <div className="bg-[#0b1d2e] font-sans text-[#eaf2f8]">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-[#eaf2f8]/10 px-6 pb-20 pt-28 sm:px-10 lg:pt-36">
        <BlueprintGrid className="pointer-events-none absolute inset-0 h-full w-full" />

        <div className="relative mx-auto flex max-w-6xl flex-col items-start gap-12 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#e8a33d]/50 px-4 py-1.5 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-[#e8a33d]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#e8a33d] shadow-[0_0_8px_2px_rgba(232,163,61,0.7)]" />
              {config.locality}
            </span>

            <h1 className="mt-6 text-4xl font-black uppercase leading-[0.95] tracking-tight sm:text-6xl">
              {config.companyName}
            </h1>
            <p className="mt-5 text-xl font-semibold text-[#eaf2f8]/90 sm:text-2xl">{config.headline}</p>
            <p className="mt-4 max-w-md text-base text-[#eaf2f8]/60">{config.subheadline}</p>

            <div className="mt-10">
              <BreakerButton href="#orcamento">Pedir orçamento</BreakerButton>
            </div>
          </div>

          <HeroSchematic className="hidden w-full max-w-md text-[#eaf2f8] lg:block" />
        </div>
      </section>

      {/* Serviços */}
      <section className="mx-auto max-w-5xl px-6 py-20 sm:px-10">
        <h2 className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-[#e8a33d]">
          Serviços
        </h2>
        <p className="mt-3 max-w-lg text-2xl font-bold text-[#eaf2f8]">
          Escolha o tipo de trabalho para pedir orçamento.
        </p>
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {config.services.map((service) => (
            <AtVoltServiceCard
              key={service.id}
              service={service}
              glyph={GLYPHS[service.id]}
              selected={selectedService?.id === service.id}
              onSelect={setSelectedService}
            />
          ))}
        </div>
      </section>

      {/* Processo */}
      <section className="border-y border-[#eaf2f8]/10 bg-[#091725] px-6 py-20 sm:px-10">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-[#e8a33d]">
            Como funciona
          </h2>
          <p className="mt-3 max-w-lg text-2xl font-bold text-[#eaf2f8]">
            Um pedido de orçamento sem perder tempo em mensagens.
          </p>
          <div className="mt-14">
            <CircuitPath steps={PROCESS_STEPS} />
          </div>
        </div>
      </section>

      {/* Pedido de orçamento */}
      <section id="orcamento" className="mx-auto max-w-2xl px-6 py-20 sm:px-10">
        <h2 className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-[#e8a33d]">
          Pedir orçamento
        </h2>
        <p className="mt-3 text-2xl font-bold text-[#eaf2f8]">Explique o que precisa.</p>

        {selectedService ? (
          <div className="mt-8 rounded-lg border border-[#eaf2f8]/15 bg-[#091725] p-6 sm:p-8">
            <p className="mb-6 font-mono text-xs uppercase tracking-[0.14em] text-[#e8a33d]">
              {selectedService.title}
            </p>
            <QuoteRequest
              config={config}
              service={selectedService}
              accentClassName="bg-[#e8a33d] text-[#0b1d2e] focus-visible:outline-[#e8a33d]"
            />
          </div>
        ) : (
          <p className="mt-6 text-[#eaf2f8]/60">
            Escolha um serviço acima para ver as perguntas do orçamento.
          </p>
        )}
      </section>

      {/* Contacto / footer */}
      <footer className="border-t border-[#eaf2f8]/10 px-6 py-10 sm:px-10">
        <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="font-semibold text-[#eaf2f8]">{config.companyName}</p>
            <p className="mt-1 text-sm text-[#eaf2f8]/50">
              {config.locality} · {config.contact.email}
            </p>
          </div>
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#eaf2f8]/30">
            Demonstração · velks.space
          </p>
        </div>
      </footer>
    </div>
  );
}
