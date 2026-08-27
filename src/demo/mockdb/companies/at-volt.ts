import type { BusinessDemoConfig } from '../../types';

// Fontes: perfil Instagram @atvolteletrica (posts públicos indicados na prospecção,
// conteúdo não acessível sem sessão autenticada — sem imagens extraídas). Nenhum
// website público indexado encontrado. Telefone/WhatsApp não verificável na origem
// (prospecção continha #ERROR! no campo de telefone) — contacto assenta em email.
const atVolt: BusinessDemoConfig = {
  slug: 'at-volt',
  companyName: 'AT VOLT',
  niche: 'Instalações elétricas e pequenos arranjos',
  locality: 'Coimbra, Portugal',
  countryCode: 'PT',
  locale: 'pt-PT',
  language: 'pt',
  tagline: 'Eletricidade feita com precisão, em Coimbra.',

  contact: {
    email: 'geral@atvolt.pt',
  },

  media: {
    hero: { src: '/demo/at-volt/hero.jpg', alt: 'AT VOLT — instalações elétricas em Coimbra', role: 'hero' },
    ogImage: { src: '/demo/at-volt/og.jpg', alt: 'AT VOLT', role: 'og' },
    gallery: [],
  },

  offerings: [
    {
      id: 'instalacoes-eletricas',
      title: 'Instalações elétricas',
      description:
        'Instalação e alteração de pontos de luz, tomadas e quadros elétricos, em obra nova ou remodelação.',
      selectable: true,
      quantityEnabled: false,
      quoteFields: [
        { key: 'espaco', label: 'Espaço ou divisão', type: 'text', required: true, placeholder: 'Ex: cozinha, garagem, escritório' },
        {
          key: 'tipoObra',
          label: 'Tipo de obra',
          type: 'select',
          required: true,
          options: ['Obra nova', 'Remodelação / alteração'],
          placeholder: 'Escolha uma opção',
        },
        { key: 'numPontos', label: 'Número aproximado de pontos', type: 'number', required: false, unit: 'pontos' },
        { key: 'localidade', label: 'Localidade', type: 'text', required: true, placeholder: 'Ex: Coimbra' },
      ],
    },
    {
      id: 'arranjos-reparacoes',
      title: 'Pequenos arranjos e reparações',
      description: 'Resolução de avarias, substituições e pequenos arranjos elétricos no dia a dia.',
      selectable: true,
      quantityEnabled: false,
      quoteFields: [
        { key: 'problema', label: 'Descreva o problema', type: 'textarea', required: true, placeholder: 'O que está a acontecer?' },
        { key: 'inicio', label: 'Quando começou', type: 'text', required: false, placeholder: 'Ex: há 2 dias' },
        {
          key: 'imovel',
          label: 'Tipo de imóvel',
          type: 'select',
          required: true,
          options: ['Habitação', 'Escritório / comércio', 'Outro'],
          placeholder: 'Escolha uma opção',
        },
        {
          key: 'urgencia',
          label: 'Urgência',
          type: 'select',
          required: true,
          options: ['Assim que possível', 'Esta semana', 'Sem pressa'],
          placeholder: 'Escolha uma opção',
        },
        { key: 'localidade', label: 'Localidade', type: 'text', required: true, placeholder: 'Ex: Coimbra' },
      ],
    },
  ],

  conversion: {
    mode: 'quote',
    allowEmptySelection: true,
    primaryChannel: 'email',
    ctaLabel: 'Pedir orçamento',
    triggerLabel: 'Pedir orçamento',
  },

  visual: {
    visualProfile: 'technical',
    heroStyle: 'full-bleed',
    offeringStyle: 'cards',
    footerStyle: 'full',
    sectionOrder: ['hero', 'offerings', 'process', 'finalCta', 'footer'],
  },

  motion: {
    motionProfile: 'calm',
    heroMotion: true,
    parallaxIntensity: 'subtle',
    scrollStory: true,
    cameraTransitions: false,
    enableThree: false,
    enableCanvas: false,
    reducedMotionFallback: true,
  },

  process: [
    { title: 'Descreva o trabalho', description: 'Indique o espaço, o tipo de intervenção e os detalhes que já sabe.' },
    { title: 'Pedido estruturado', description: 'A informação é organizada num pedido claro, pronto a enviar.' },
    { title: 'Resposta direta da AT VOLT', description: 'Sem trocas infinitas de mensagens para chegar ao essencial.' },
  ],

  sourceNote:
    'Instagram @atvolteletrica indicado na prospecção; conteúdo não acessível publicamente sem login, sem imagens extraídas. Sem website público indexado. Telefone/WhatsApp não disponível (#ERROR! na origem) — contacto real usa apenas geral@atvolt.pt.',

  og: {
    title: 'AT VOLT — Eletricidade em Coimbra | Demonstração',
    description: 'Instalações elétricas e pequenos arranjos em Coimbra. Peça um orçamento estruturado em poucos minutos.',
    image: '/demo/at-volt/og.jpg',
  },
};

export default atVolt;
