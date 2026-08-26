import type { DemoLanguage } from './types';

interface DemoStrings {
  requestQuote: string;
  services: string;
  work: string;
  name: string;
  phone: string;
  email: string;
  notes: string;
  send: string;
  sendWhatsapp: string;
  sendEmail: string;
  optional: string;
  requiredFieldError: string;
  selectServicePrompt: string;
  close: string;
  unavailableTitle: string;
  unavailableBody: string;
  contactUnavailable: string;
}

const STRINGS: Record<DemoLanguage, DemoStrings> = {
  pt: {
    requestQuote: 'Pedir orçamento',
    services: 'Serviços',
    work: 'Trabalhos',
    name: 'Nome',
    phone: 'Telefone',
    email: 'Email',
    notes: 'Observações',
    send: 'Enviar pedido',
    sendWhatsapp: 'Enviar por WhatsApp',
    sendEmail: 'Enviar por email',
    optional: 'opcional',
    requiredFieldError: 'Preencha este campo obrigatório.',
    selectServicePrompt: 'Escolha um serviço para pedir orçamento.',
    close: 'Fechar',
    unavailableTitle: 'Demonstração indisponível',
    unavailableBody: 'Esta demonstração não está disponível de momento.',
    contactUnavailable: 'Contacto indisponível de momento.',
  },
  en: {
    requestQuote: 'Request a quote',
    services: 'Services',
    work: 'Our work',
    name: 'Name',
    phone: 'Phone',
    email: 'Email',
    notes: 'Notes',
    send: 'Send request',
    sendWhatsapp: 'Send via WhatsApp',
    sendEmail: 'Send via email',
    optional: 'optional',
    requiredFieldError: 'Please fill in this required field.',
    selectServicePrompt: 'Choose a service to request a quote.',
    close: 'Close',
    unavailableTitle: 'Demo unavailable',
    unavailableBody: 'This demo is not available right now.',
    contactUnavailable: 'Contact currently unavailable.',
  },
  es: {
    requestQuote: 'Pedir presupuesto',
    services: 'Servicios',
    work: 'Trabajos',
    name: 'Nombre',
    phone: 'Teléfono',
    email: 'Email',
    notes: 'Observaciones',
    send: 'Enviar solicitud',
    sendWhatsapp: 'Enviar por WhatsApp',
    sendEmail: 'Enviar por email',
    optional: 'opcional',
    requiredFieldError: 'Rellene este campo obligatorio.',
    selectServicePrompt: 'Elija un servicio para pedir presupuesto.',
    close: 'Cerrar',
    unavailableTitle: 'Demostración no disponible',
    unavailableBody: 'Esta demostración no está disponible en este momento.',
    contactUnavailable: 'Contacto no disponible en este momento.',
  },
  fr: {
    requestQuote: 'Demander un devis',
    services: 'Services',
    work: 'Réalisations',
    name: 'Nom',
    phone: 'Téléphone',
    email: 'Email',
    notes: 'Observations',
    send: 'Envoyer la demande',
    sendWhatsapp: 'Envoyer via WhatsApp',
    sendEmail: 'Envoyer par email',
    optional: 'optionnel',
    requiredFieldError: 'Veuillez remplir ce champ obligatoire.',
    selectServicePrompt: 'Choisissez un service pour demander un devis.',
    close: 'Fermer',
    unavailableTitle: 'Démonstration indisponible',
    unavailableBody: "Cette démonstration n'est pas disponible pour le moment.",
    contactUnavailable: 'Contact indisponible pour le moment.',
  },
  de: {
    requestQuote: 'Angebot anfordern',
    services: 'Leistungen',
    work: 'Arbeiten',
    name: 'Name',
    phone: 'Telefon',
    email: 'E-Mail',
    notes: 'Anmerkungen',
    send: 'Anfrage senden',
    sendWhatsapp: 'Über WhatsApp senden',
    sendEmail: 'Per E-Mail senden',
    optional: 'optional',
    requiredFieldError: 'Bitte füllen Sie dieses Pflichtfeld aus.',
    selectServicePrompt: 'Wählen Sie einen Service für ein Angebot.',
    close: 'Schließen',
    unavailableTitle: 'Demo nicht verfügbar',
    unavailableBody: 'Diese Demo ist derzeit nicht verfügbar.',
    contactUnavailable: 'Kontakt derzeit nicht verfügbar.',
  },
  it: {
    requestQuote: 'Richiedi preventivo',
    services: 'Servizi',
    work: 'Lavori',
    name: 'Nome',
    phone: 'Telefono',
    email: 'Email',
    notes: 'Note',
    send: 'Invia richiesta',
    sendWhatsapp: 'Invia via WhatsApp',
    sendEmail: 'Invia via email',
    optional: 'facoltativo',
    requiredFieldError: 'Compila questo campo obbligatorio.',
    selectServicePrompt: 'Scegli un servizio per richiedere un preventivo.',
    close: 'Chiudi',
    unavailableTitle: 'Demo non disponibile',
    unavailableBody: 'Questa demo non è disponibile al momento.',
    contactUnavailable: 'Contatto non disponibile al momento.',
  },
};

export function getDemoStrings(language: DemoLanguage | string | undefined): DemoStrings {
  if (language && language in STRINGS) {
    return STRINGS[language as DemoLanguage];
  }
  return STRINGS.pt;
}
