import React, { useEffect, useRef, useState } from 'react';
import BackgroundCanvas from './components/BackgroundCanvas';
import CustomCursor from './components/CustomCursor';
import { Play, ArrowUpRight, AlertTriangle, ChevronRight, Activity, Crosshair, Network, Mail, Globe, Lock, Linkedin, Instagram, Facebook } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Substituir este link pelo Payment Link real da Stripe quando o produto estiver criado.
const stripeCheckoutUrl = "https://book.stripe.com/dRmeVdbV4bCBc2Q7uF2cg00";
const whatsappUrl = "https://wa.me/33761569686?text=Ol%C3%A1%2C%20vi%20a%20demo%20da%20VELKS.SPACE%20e%20quero%20implementar%20este%20sistema%20no%20meu%20site.%20Pode%20me%20explicar%20o%20pr%C3%B3ximo%20passo%3F";

const handleMainCtaClick = () => {
  window.open(stripeCheckoutUrl, "_blank", "noopener,noreferrer");
};

const handleSecondaryCtaClick = () => {
  window.open(whatsappUrl, "_blank", "noopener,noreferrer");
};

function PromoBanner() {
  return (
    <div className="relative w-full bg-black/80 backdrop-blur-md border-b justify-center flex overflow-hidden border-[#ff003c]/40 text-white text-[10px] sm:text-xs font-black tracking-widest uppercase py-2.5 sm:py-3 z-[200]">
      <div className="flex whitespace-nowrap animate-[marquee_20s_linear_infinite] sm:animate-none sm:justify-center items-center gap-4 sm:gap-6 min-w-full">
        <span className="text-[#ff003c] animate-pulse">⚡ PROMOÇÃO LIMITADA</span>
        <span className="hidden sm:inline opacity-30">/</span>
        <span>SETUP COMPLETO POR <span className="line-through opacity-50 px-1 font-normal">397€</span> 297€</span>
        <span className="hidden sm:inline opacity-30">/</span>
        <span className="text-[#ffaa00]">GANHE 2 MESES DE MENSALIDADE GRÁTIS</span>
        <span className="hidden sm:inline opacity-30">/</span>
        <span>VAGAS LIMITADAS ⏳</span>
        
        {/* Repeat for continuous marquee on mobile */}
        <span className="sm:hidden text-[#ff003c] animate-pulse ml-8">⚡ PROMOÇÃO LIMITADA</span>
        <span className="sm:hidden">SETUP COMPLETO POR <span className="line-through opacity-50 px-1 font-normal">397€</span> 297€</span>
        <span className="sm:hidden text-[#ffaa00]">GANHE 2 MESES DE MENSALIDADE GRÁTIS</span>
        <span className="sm:hidden">VAGAS LIMITADAS ⏳</span>
      </div>
    </div>
  );
}

// Custom Seals Component
const SealsRow = () => {
  const seals = [
    { label: "Instalação 24h", tooltip: "Setup completo do agente no ecossistema do teu negócio em menos de 24h." },
    { label: "Lead no email", tooltip: "Recebes as informações e contexto do lead diretamente no e-mail." },
    { label: "Sem equipa extra", tooltip: "Automação total para o teu fluxo sem necessidade de contratar atendentes." }
  ];

  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {seals.map((seal, idx) => (
        <div key={idx} className="relative group cursor-pointer inline-block">
          <span className="block px-2 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-mono uppercase tracking-widest text-white/50 whitespace-nowrap hover:bg-[#cc00ff]/10 hover:border-[#cc00ff]/30 hover:text-white transition-all duration-300">
            {seal.label}
          </span>
          <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-48 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-50">
            <div className="bg-[#1a0024]/95 backdrop-blur-md border border-[#cc00ff]/40 text-white/90 p-2.5 text-[10px] sm:text-xs text-center leading-relaxed rounded-md shadow-[0_4px_20px_rgba(204,0,255,0.25)]">
              {seal.tooltip}
            </div>
            {/* Tooltip Arrow */}
            <div className="absolute left-1/2 -translate-x-1/2 top-full border-solid border-t-[#cc00ff]/40 border-l-transparent border-r-transparent border-b-transparent" style={{ borderWidth: '5px 5px 0 5px' }}></div>
          </div>
        </div>
      ))}
    </div>
  );
};

const LANGUAGES = [
  { code: 'pt', label: 'Português', flag: '🇵🇹' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
];

function TopNav() {
  const [activeLang, setActiveLang] = useState('pt');

  useEffect(() => {
    // Check initial language from cookies
    const match = document.cookie.match(/googtrans=\/pt\/([a-z]{2})/);
    if (match && match[1]) {
      setActiveLang(match[1]);
    }

    // Inject Google Translate script if it doesn't exist
    if (!document.getElementById('google-translate-script')) {
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      document.body.appendChild(script);

      // Define the callback
      (window as any).googleTranslateElementInit = () => {
        new (window as any).google.translate.TranslateElement(
          { 
            pageLanguage: 'pt',
            includedLanguages: 'en,es,fr,de',
            autoDisplay: false,
          },
          'google_translate_element'
        );
      };
    }
  }, []);

  const handleTranslate = (langCode: string) => {
    setActiveLang(langCode);
    
    if (langCode === 'pt') {
      document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname}`;
      window.location.reload();
      return;
    }

    const select = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    if (select) {
      select.value = langCode;
      select.dispatchEvent(new Event('change'));
    } else {
      document.cookie = `googtrans=/pt/${langCode}; path=/;`;
      document.cookie = `googtrans=/pt/${langCode}; path=/; domain=${window.location.hostname}`;
      window.location.reload();
    }
  };

  return (
    <div className="absolute top-[50px] right-4 sm:right-6 z-[90] flex justify-end pointer-events-none">
      {/* Hidden original widget */}
      <div id="google_translate_element" className="hidden"></div>
      
      <div className="pointer-events-auto flex items-center gap-1.5 bg-black/80 backdrop-blur-xl border border-white/20 p-2 transition-all shadow-[0_0_30px_rgba(0,0,0,0.8)] rounded-full">
        {LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            onClick={() => handleTranslate(lang.code)}
            className={`flex items-center justify-center w-8 h-8 rounded-full text-lg transition-all duration-300 ${
              activeLang === lang.code 
                ? 'bg-[#cc00ff]/30 border border-[#cc00ff]/60 scale-110 shadow-[0_0_10px_rgba(204,0,255,0.4)] z-10' 
                : 'hover:bg-white/10 border border-transparent grayscale-[0.6] hover:grayscale-0'
            }`}
            title={lang.label}
          >
            <span role="img" aria-label={lang.label} className="pointer-events-none -mt-0.5">{lang.flag}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
}

function TiltCard({ children, className = '', glowColor = 'rgba(255,255,255,0.2)' }: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glareX, setGlareX] = useState(50);
  const [glareY, setGlareY] = useState(50);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Max rotation = 15deg
    const rotateYVal = ((mouseX / width) - 0.5) * 30; 
    const rotateXVal = ((mouseY / height) - 0.5) * -30; 
    
    setRotateX(rotateXVal);
    setRotateY(rotateYVal);
    setGlareX((mouseX / width) * 100);
    setGlareY((mouseY / height) * 100);
  };

  return (
    <div
      ref={cardRef}
      className={`relative rounded-2xl ease-out transition-transform duration-200 ${className}`}
      style={{
        transformStyle: 'preserve-3d',
        transform: isHovered ? `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)` : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
        zIndex: isHovered ? 50 : 1,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setRotateX(0); setRotateY(0); }}
    >
      <div 
        className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(circle at ${glareX}% ${glareY}%, ${glowColor}, transparent 60%)`,
          mixBlendMode: 'screen',
          zIndex: 10,
        }}
      />
      <div className="w-full h-full relative" style={{ transform: 'translateZ(40px)', transformStyle: 'preserve-3d' }}>
        {children}
      </div>
    </div>
  );
}

function VSLHeroScene() {
  return (
    <section id="scene-1" className="relative w-full min-h-screen pt-24 pb-16 flex flex-col justify-center px-4 lg:px-12 z-10 box-border">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
        
        {/* Mobile-first: Text content above video on small screens, beside it on desktop */}
        <div className="flex flex-col space-y-6 z-10 w-full order-1 lg:order-1 pt-6 lg:pt-0">
          <div className="inline-flex items-center gap-3 px-4 py-2 border border-[#00ff88]/30 bg-[#00ff88]/10 w-max backdrop-blur-md rounded-none">
            <div className="w-1.5 h-1.5 bg-[#00ff88] animate-pulse"></div>
            <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.2em] text-[#00ff88]">VELKS.SPACE · DEMO PRIVADA</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.5rem] font-black tracking-tighter text-white leading-[1.1] drop-shadow-2xl uppercase">
            SEU ASSISTENTE DE IA <br className="hidden lg:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ff88] to-[#00ffa6] drop-shadow-[0_0_15px_rgba(0,255,136,0.5)]">ORION 24H 7/7</span>
          </h1>
          
          <p className="text-lg sm:text-xl md:text-2xl text-white/90 font-light max-w-2xl leading-snug lg:leading-relaxed">
            AGENTE de IA que atende, qualifica e converte clientes <span className="text-[#00ff88] font-bold">24 horas por dia</span> — para você ter mais tempo, mais vendas e menos stress.
          </p>

          <div className="border-l-[3px] border-[#00ff88] pl-4 py-1 my-2">
             <p className="font-mono text-sm sm:text-base uppercase tracking-widest text-[#00ff88] font-bold drop-shadow-[0_0_5px_rgba(0,255,136,0.3)]">
               Este sistema entra no momento exato em que há interesse.
             </p>
          </div>
          
          {/* Assiste message */}
          <div className="bg-black/40 backdrop-blur-md border border-white/10 p-4 w-full max-w-md hidden lg:block mt-4">
             <p className="text-white text-sm font-light leading-relaxed">
               Assiste à demo.<br/> Em menos de 60 segundos vais perceber onde estás a perder clientes.
             </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 pt-4 mt-2">
            <div className="relative w-full sm:w-auto group/btn">
              <div className="absolute inset-0 bg-[#00ff88]/40 blur-[20px] rounded opacity-50 group-hover/btn:opacity-100 transition-opacity duration-500 animate-[pulse_3s_ease-in-out_infinite]"></div>
              <button onClick={handleSecondaryCtaClick} className="relative w-full sm:w-auto px-10 py-5 bg-[#00ff88] text-black font-black uppercase tracking-widest text-sm hover:bg-white hover:text-black transition-all duration-500 hover:-translate-y-1 shadow-[0_0_20px_rgba(0,255,136,0.4)] group-hover/btn:shadow-[0_0_40px_rgba(0,255,136,0.8)] flex items-center justify-center gap-3">
                Quero implementar isto <ArrowUpRight className="w-5 h-5 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
              </button>
            </div>
            <button onClick={() => {
              const el = document.getElementById('demo-video-container');
              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }} className="w-full sm:w-auto px-8 py-5 bg-transparent border-2 border-[#00ff88]/50 text-[#00ff88] hover:text-black font-mono text-sm font-bold uppercase tracking-widest hover:bg-[#00ff88] transition-all duration-300 shadow-[0_0_15px_rgba(0,255,136,0.1)]">
               Ver como funciona
            </button>
          </div>
          
          <SealsRow />
        </div>

        {/* Vertical Video Demo Hero - Centered and highlighted */}
        <div id="demo-video-container" className="relative w-full aspect-[9/16] max-w-[350px] sm:max-w-[400px] mx-auto lg:ml-auto lg:mr-0 z-20 order-2 lg:order-2 perspective-1000">
           <div className="absolute inset-0 bg-gradient-to-br from-[#cc00ff]/30 via-transparent to-[#ff00a2]/30 blur-2xl -z-10 rounded-3xl"></div>
           
           <div className="w-full h-full glass-panel-light p-1 lg:p-2 rounded-2xl border border-white/20 shadow-2xl relative overflow-hidden group">
              {/* Vertical Video background */}
              <video 
                className="absolute inset-0 w-full h-full object-cover rounded-xl"
                src="/demo-video.mp4" 
                autoPlay 
                loop 
                muted 
                playsInline
              />
              
              {/* Premium Glow Edge */}
              <div className="absolute inset-0 border border-brand-cyan/40 rounded-xl pointer-events-none mix-blend-overlay"></div>
           </div>
           
           {/* Mobile-only assist message under video */}
           <div className="mt-4 text-center lg:hidden bg-black/60 backdrop-blur-md border border-white/10 p-3">
             <p className="text-white/80 text-xs font-light">
               Assiste à demo. Em menos de 60 segundos vais perceber onde estás a perder clientes.
             </p>
           </div>
        </div>
      </div>
    </section>
  );
}

function PainScene() {
  return (
    <section id="scene-2" className="relative w-full min-h-screen py-24 flex items-center justify-center px-4 z-10 box-border">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        
        <div className="relative border-l-[4px] border-[#ff003c] pl-6 lg:pl-12 z-10 mb-8 lg:mb-0">
          <h2 className="text-4xl md:text-6xl lg:text-[5.5rem] font-bold text-white tracking-tighter leading-[1] mb-6 drop-shadow-xl">
            A venda não morre no orçamento.
          </h2>
          
          <h3 className="text-2xl md:text-4xl text-[#ff003c] font-light tracking-tight mb-8">
            Ela morre antes, quando ninguém responde no momento da intenção.
          </h3>

            <div className="text-lg md:text-xl text-white/90 font-light mb-10 space-y-4 p-8 bg-white/5 border border-white/20 backdrop-blur-[30px] rounded-xl shadow-[0_0_30px_rgba(255,0,60,0.1)_inset]">
              <p className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-[#ff003c] shadow-[0_0_10px_#ff003c]"></span> O cliente entra.</p>
              <p className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-[#ff003c] shadow-[0_0_10px_#ff003c]"></span> Procura preço. Tem dúvida.</p>
              <p className="flex items-center gap-3 opacity-60"><span className="w-2 h-2 rounded-full bg-white/50"></span> Não recebe resposta. Sai.</p>
              <p className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-[#ff003c] shadow-[0_0_10px_#ff003c]"></span> Compara. Fecha noutro lugar.</p>
            </div>

            <p className="font-mono text-sm sm:text-base font-bold uppercase tracking-[0.2em] text-[#ff3366] border border-white/10 p-5 inline-block bg-white/5 backdrop-blur-[40px] drop-shadow-[0_0_10px_rgba(255,51,102,0.8)] rounded-lg">
              Tu não viste a perda. Mas ela aconteceu.
            </p>
          </div>

          <div className="pain-cards-container grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6 z-10 lg:ml-8" style={{ perspective: '2000px' }}>
             {[
               { title: "Resposta lenta", result: "Interesse frio" },
               { title: "Site parado", result: "Cliente perdido" },
               { title: "Mensagem solta", result: "Sem contexto" },
               { title: "Equipa ocupada", result: "Venda escapando" }
             ].map((card, i) => (
               <TiltCard
                 key={i} 
                 className="pain-card pain-card-animate group cursor-pointer border border-[#ff3366]/30 bg-[#ff3366]/5 backdrop-blur-[40px] flex flex-col justify-center min-h-[120px] sm:min-h-[160px] shadow-[0_0_50px_rgba(255,0,60,0.15)_inset]"
                 glowColor="rgba(255,0,60,0.8)"
               >
                 <div className="p-5 sm:p-8 h-full w-full flex flex-col justify-center">
                   <AlertTriangle className="w-6 h-6 sm:w-8 sm:h-8 text-[#ff3366] opacity-90 mb-3 sm:mb-4 group-hover:scale-125 transition-transform duration-300 drop-shadow-[0_0_20px_rgba(255,51,102,1)]" style={{ transform: 'translateZ(30px)' }} />
                   <p className="text-white font-mono text-[10px] sm:text-sm font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] mb-1 sm:mb-2 drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" style={{ transform: 'translateZ(20px)' }}>{card.title}</p>
                   <p className="text-[#ff3366] font-black text-lg sm:text-2xl tracking-tighter leading-none drop-shadow-[0_0_15px_rgba(255,51,102,0.8)]" style={{ transform: 'translateZ(40px)' }}>{card.result}</p>
                 </div>
               </TiltCard>
             ))}
             
             <div className="col-span-1 sm:col-span-2 mt-4 sm:mt-6 flex justify-center sm:justify-end" style={{ transform: 'translateZ(20px)' }}>
               <button onClick={handleSecondaryCtaClick} className="px-8 py-4 sm:py-5 bg-[#ff003c] border border-[#ff003c] text-white font-mono font-black text-sm sm:text-base uppercase tracking-[0.1em] shadow-[0_0_20px_rgba(255,0,60,0.6)] hover:bg-white hover:text-[#ff003c] hover:border-white hover:shadow-[0_0_40px_rgba(255,0,60,0.9)] hover:scale-105 hover:-translate-y-1 animate-pulse transition-all duration-500 backdrop-blur-xl rounded-lg w-full sm:w-auto group">
                  <span className="flex items-center gap-2">
                    Quero meu AGENTE DE IA <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
               </button>
             </div>
          </div>

      </div>
    </section>
  );
}

function MechanismScene() {
  return (
    <section id="scene-3" className="relative w-full min-h-screen py-24 flex items-center justify-center px-4 z-10 box-border">
      <div className="max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
        
        <div className="lg:w-5/12 z-10 text-left">
           <div className="inline-flex items-center gap-2 px-4 py-2 border border-[#00e5ff]/50 bg-[#00e5ff]/10 mb-8 rounded-full backdrop-blur-md shadow-[0_0_15px_rgba(0,229,255,0.2)_inset]">
              <span className="w-2 h-2 bg-[#00e5ff] rounded-full animate-pulse shadow-[0_0_8px_#00e5ff]"></span>
              <span className="text-xs font-mono font-bold text-[#00e5ff] uppercase tracking-widest drop-shadow-[0_0_5px_#00e5ff]">Ação Simultânea</span>
           </div>
           
           <h2 className="text-5xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70 leading-[0.9] tracking-tighter mb-8" style={{ filter: 'drop-shadow(0 0 20px rgba(0,229,255,0.4))' }}>
             O FUNIL<br/> <span className="text-[#00e5ff]" style={{ filter: 'drop-shadow(0 0 30px rgba(0,229,255,0.8))' }}>SANGRA AQUI.</span>
           </h2>
           
           <p className="text-2xl md:text-3xl text-white/90 font-light mb-10 leading-snug drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
             Enquanto a tua equipa trabalha, este sistema aborda, qualifica e envia o cliente pronto para ti.
           </p>
           
           <div className="p-6 bg-white/5 border border-white/20 border-l-[4px] border-l-[#00e5ff] backdrop-blur-[30px] rounded-r-xl shadow-[0_0_40px_rgba(0,229,255,0.1)_inset]">
             <p className="font-mono text-sm sm:text-base text-[#00e5ff] uppercase tracking-[0.2em] font-black leading-relaxed drop-shadow-[0_0_10px_rgba(0,229,255,0.6)]">
               NÃO É ATENDIMENTO.<br/>É UM VENDEDOR QUE NUNCA DORME E NUNCA DEIXA NINGUÉM ESPERAR.
             </p>
           </div>
        </div>

        <div className="mechanism-container lg:w-7/12 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full z-10" style={{ perspective: '2000px' }}>
           {[
             { title: "ABORDA", desc: "O visitante recebe atenção absoluta antes de sair.", icon: <Activity className="w-6 h-6 text-[#00e5ff]" /> },
             { title: "QUALIFICA", desc: "O sistema entende a intenção exata da busca.", icon: <Crosshair className="w-6 h-6 text-[#00e5ff]" /> },
             { title: "ORGANIZA", desc: "A conversa caótica vira um dossiê perfeito.", icon: <Network className="w-6 h-6 text-[#00e5ff]" /> },
             { title: "ENTREGA", desc: "Recebes tudo no e-mail: pronto para o fecho.", icon: <Mail className="w-6 h-6 text-[#00e5ff]" /> }
           ].map((step, i) => (
             <TiltCard key={i} className="mechanism-step-animate group border border-[#00e5ff]/40 bg-[#00e5ff]/5 backdrop-blur-[40px] shadow-[0_0_40px_rgba(0,229,255,0.15)_inset] overflow-hidden" glowColor="rgba(0,229,255,0.6)">
               <div className="p-6 sm:p-8 h-full w-full relative">
                 <div className="absolute -top-10 -right-10 text-[140px] font-mono font-black text-white/10 group-hover:text-[#00e5ff]/10 transition-colors duration-500 z-0 drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                   0{i+1}
                 </div>
                 <div className="w-14 h-14 border-2 border-[#00e5ff]/60 bg-[#00e5ff]/20 flex items-center justify-center mb-6 relative z-10 rounded-xl shadow-[0_0_30px_rgba(0,229,255,0.5)]" style={{ transform: 'translateZ(30px)' }}>
                   {step.icon}
                 </div>
                 <h4 className="text-white text-3xl font-black tracking-tight mb-3 relative z-10 drop-shadow-[0_0_15px_rgba(255,255,255,0.9)]" style={{ transform: 'translateZ(40px)' }}>{step.title}</h4>
                 <p className="text-white font-bold text-base md:text-lg leading-relaxed relative z-10 drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" style={{ transform: 'translateZ(20px)' }}>{step.desc}</p>
               </div>
             </TiltCard>
           ))}
        </div>

      </div>
    </section>
  );
}

function TestimonialsScene() {
  return (
    <section id="scene-testimonials" className="relative w-full min-h-screen flex flex-col justify-center py-24 px-4 z-10 box-border overflow-hidden">
      <div className="max-w-7xl mx-auto w-full z-10 flex flex-col pt-12">
        <div className="text-center mb-24 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg h-32 bg-[#cc00ff]/20 blur-[100px] pointer-events-none rounded-full"></div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-gray-400 drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)]">
            A RECEPCIONISTA QUE FAZ TUDO.<br/> 
            <span className="text-[#00ffcc] relative inline-block drop-shadow-[0_0_30px_rgba(0,255,204,0.6)] animate-pulse mt-2 md:text-7xl">
              AGENTE DE VOZ COM IA
              <span className="absolute -bottom-2 left-0 w-full h-1 bg-[#00ffcc] shadow-[0_0_15px_#00ffcc]"></span>
            </span>
          </h2>
          <p className="font-mono text-[#00ffcc] bg-[#00ffcc]/10 border border-[#00ffcc]/30 p-4 sm:p-6 rounded-xl max-w-3xl mx-auto text-sm sm:text-base md:text-lg leading-relaxed backdrop-blur-sm shadow-[0_0_30px_rgba(0,255,204,0.15)_inset]">
            Muito mais que uma automação. O seu <b className="text-white drop-shadow-md">Agente de Voz ultra-realista</b> atua como um funcionário incansável que atende, qualifica e agenda 24/7, programado exclusivamente para <b className="text-white drop-shadow-md">MULTIPLICAR O SEU ROI</b> sem custos de contratação.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 justify-items-center w-full">
          {[
            {
              name: "E-commerce & Saúde",
              result: "Avatar de Suporte: +45% Agendamentos",
              src: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&h=711&q=80",
            },
            {
              name: "Tech & Software",
              result: "Avatar Inside Sales: Zero perda",
              src: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&h=711&q=80",
            },
            {
              name: "Consultoria Digital",
              result: "Avatar de Triagem: 24/7",
              src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&h=711&q=80",
            }
          ].map((caseData, i) => (
            <div key={i} className={`group relative w-full max-w-[320px] aspect-[9/16] rounded-2xl overflow-hidden bg-[#11001a] border-2 cursor-pointer transition-all duration-500 cyber-card-${i % 3}`}>
               <img 
                 src={caseData.src} 
                 alt={caseData.name}
                 className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 relative z-10 mix-blend-screen"
               />
               
               {/* Cyber grid overlay */}
               <div className="absolute inset-0 z-10 opacity-30 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(0, 255, 204, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 204, 0.2) 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
               <div className="absolute top-4 right-4 z-20 bg-black/80 backdrop-blur-md rounded-full px-4 py-1.5 font-mono text-xs text-[#00ffcc] border border-[#00ffcc]/50 flex gap-2 items-center shadow-[0_0_15px_rgba(0,255,204,0.5)]">
                 <span className="flex items-end gap-[2px] h-3">
                    <span className="w-[3px] rounded-full bg-[#00ffcc] h-full animate-[pulse_0.8s_ease-in-out_infinite]"></span>
                    <span className="w-[3px] rounded-full bg-[#00ffcc] h-2/3 animate-[pulse_1.2s_ease-in-out_infinite]"></span>
                    <span className="w-[3px] rounded-full bg-[#00ffcc] h-full animate-[pulse_1s_ease-in-out_infinite]"></span>
                    <span className="w-[3px] rounded-full bg-[#00ffcc] h-1/2 animate-[pulse_0.9s_ease-in-out_infinite]"></span>
                 </span>
                 <span className="text-[10px] uppercase font-bold text-[#00ffcc]">VOZ ATIVA</span>
               </div>
               <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent pointer-events-none z-10 transition-opacity duration-500 group-hover:opacity-80"></div>
               <div className="absolute bottom-0 left-0 w-full p-6 z-20 flex flex-col gap-3 pointer-events-none transform group-hover:-translate-y-2 transition-transform duration-500">
                 <div className="flex items-center gap-2 bg-black/50 w-max px-3 py-1.5 rounded-full border border-[#00ffcc]/30 backdrop-blur-sm">
                   <div className="w-2 h-2 rounded-full bg-[#00ffcc] animate-pulse shadow-[0_0_10px_#00ffcc]"></div>
                   <p className="font-mono text-[10px] uppercase tracking-widest text-[#00ffcc] font-bold drop-shadow-md m-0">{caseData.name}</p>
                 </div>
                 <h3 className="text-2xl sm:text-3xl font-black text-white drop-shadow-[0_5px_15px_rgba(0,255,204,0.6)] leading-tight uppercase tracking-tight group-hover:text-[#00ffcc] transition-colors duration-300">{caseData.result}</h3>
               </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTAScene() {
  return (
    <section id="scene-4" className="relative w-full min-h-screen flex items-center justify-center py-24 px-4 z-10 text-center box-border overflow-hidden">
       <div className="max-w-5xl mx-auto flex flex-col items-center z-10 relative">
         
         <h2 
           className="text-5xl sm:text-6xl md:text-8xl lg:text-[7.5rem] font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/80 tracking-tighter leading-[0.9] mb-8"
           style={{ filter: 'drop-shadow(0px 10px 20px rgba(0, 0, 0, 0.9)) drop-shadow(0px 0px 40px rgba(255, 170, 0, 0.3))' }}
         >
           DOMINE O MERCADO <br/>
           <span className="text-[#ffaa00] inline-block mt-2" style={{ filter: 'drop-shadow(0px 5px 20px rgba(0, 0, 0, 1))' }}>É PRIORIDADE.</span>
         </h2>
         
         <TiltCard className="mb-12 w-full max-w-4xl" glowColor="rgba(255,170,0,0.6)">
           <div className="bg-black/50 backdrop-blur-[40px] border border-white/20 rounded-2xl p-6 sm:p-8 md:p-12 shadow-[0_0_100px_rgba(0,0,0,0.5)_inset,0_20px_40px_rgba(0,0,0,0.5)] h-full w-full">
             <p className="text-xl sm:text-2xl md:text-4xl font-light text-white mb-0 leading-relaxed" style={{ transform: 'translateZ(30px)', textShadow: '0 5px 15px rgba(0,0,0,1), 0 0 40px rgba(0,0,0,1)' }}>
               Instalamos o <b className="text-[#ffcc00] font-black" style={{ textShadow: '0 4px 10px rgba(0,0,0,1)' }}>sistema de IA</b> no seu site para captar, qualificar e <i className="text-[#ffaa00]" style={{ textShadow: '0 4px 10px rgba(0,0,0,1)' }}>injetar</i> clientes diretamente para o teu funil enquanto tu focas no operacional.
             </p>
           </div>
         </TiltCard>

         <div className="bg-black/60 backdrop-blur-3xl border border-[#ffaa00]/50 shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-lg px-4 sm:px-16 py-6 mb-16 transform -rotate-1 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#ffaa00]/20 to-transparent -translate-x-[200%] group-hover:translate-x-[200%] transition-transform duration-[2000ms] skew-x-12"></div>
            <p className="text-sm sm:text-2xl text-[#ffcc00] font-black uppercase tracking-[0.1em] sm:tracking-[0.2em] font-mono m-0 flex items-center justify-center gap-2 sm:gap-4" style={{ textShadow: '0 4px 15px rgba(0,0,0,1)' }}>
              <span className="w-4 h-4 bg-[#ffaa00] rounded-full animate-ping"></span>
               RESTAM APENAS 2 VAGAS ESTA SEMANA
            </p>
         </div>

         <div className="flex flex-col sm:flex-row gap-6 w-full justify-center max-w-3xl mb-16 px-4">
            <button onClick={handleMainCtaClick} className="relative w-full sm:w-auto px-6 sm:px-12 py-5 sm:py-6 bg-[#ffaa00] text-black font-black uppercase tracking-[0.1em] sm:tracking-[0.2em] text-sm sm:text-lg hover:bg-white transition-all duration-500 shadow-[0_10px_30px_rgba(0,0,0,0.5),0_0_40px_rgba(255,170,0,0.6)] hover:shadow-[0_10px_40px_rgba(0,0,0,0.6),0_0_80px_rgba(255,170,0,1)] hover:-translate-y-2 hover:scale-105 flex items-center justify-center gap-4 group">
               GARANTIR MINHA VAGA <ChevronRight className="w-5 sm:w-6 h-5 sm:h-6 group-hover:translate-x-2 transition-transform" />
            </button>
            
            <button onClick={handleSecondaryCtaClick} className="w-full sm:w-auto px-6 sm:px-12 py-5 sm:py-6 bg-black/60 text-white font-mono text-sm sm:text-base font-bold uppercase tracking-[0.1em] sm:tracking-[0.2em] border border-white/30 hover:bg-black/80 hover:border-white transition-all duration-300 backdrop-blur-2xl flex items-center justify-center gap-4 hover:-translate-y-1 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
               FALAR COM A VELKS <ArrowUpRight className="w-5 h-5 text-[#ffaa00]" />
            </button>
         </div>

         {/* Badges / Mentions */}
         <div className="flex flex-wrap justify-center gap-4 font-mono text-xs sm:text-sm font-bold tracking-widest uppercase mb-16 z-10 drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">
            <div className="flex items-center gap-2 px-5 py-3 border-2 border-white bg-white text-black rounded-full shadow-[0_0_20px_rgba(255,255,255,0.4)]">
              <span>🇪🇺</span> Made in EU
            </div>
            <div className="flex items-center gap-2 px-5 py-3 border-2 border-brand-cyan bg-brand-cyan text-black rounded-full shadow-[0_0_20px_rgba(0,229,255,0.4)]">
              <Lock className="w-4 h-4" /> Conformidade RGPD
            </div>
         </div>

         <div className="flex flex-col sm:flex-row divide-y justify-between sm:divide-y-0 sm:divide-x divide-white/20 border-y border-white/20 py-4 sm:py-8 opacity-100 w-full max-w-4xl text-center bg-black/50 backdrop-blur-xl rounded-xl shadow-[0_20px_40px_rgba(0,0,0,0.5)]">
           <span className="font-mono text-[10px] sm:text-xs md:text-sm font-bold uppercase tracking-widest text-[#ffcc00] px-4 sm:px-8 py-3 sm:py-0" style={{ textShadow: '0 4px 15px rgba(0,0,0,1)' }}>Sem equipa extra</span>
           <span className="font-mono text-[10px] sm:text-xs md:text-sm font-bold uppercase tracking-widest text-[#ffcc00] px-4 sm:px-8 py-3 sm:py-0" style={{ textShadow: '0 4px 15px rgba(0,0,0,1)' }}>Sem resposta atrasada</span>
           <span className="font-mono text-[10px] sm:text-xs md:text-sm font-bold uppercase tracking-widest text-[#ffcc00] px-4 sm:px-8 py-3 sm:py-0" style={{ textShadow: '0 4px 15px rgba(0,0,0,1)' }}>Sem cliente perdido em silêncio</span>
         </div>
       </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="w-full relative z-20 bg-black py-8 px-4 border-t border-white/10 overflow-hidden">
      {/* Background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-xl h-40 bg-brand-cyan/5 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 md:gap-0 z-10 relative">
        {/* Left: Logo & Address */}
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 lg:border-r border-white/10 lg:pr-8">
            <img 
              src="/velks-logo.png" 
              alt="VELKS Group - Made in Luxembourg" 
              className="h-12 sm:h-16 w-auto object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]" 
            />
            <div className="text-center sm:text-left font-mono text-xs text-gray-400 leading-tight lg:border-l-0 lg:pl-0 border-l border-white/20 pl-4">
                <p>Avenue de la Gare</p>
                <p>L-1611 Luxembourg</p>
            </div>
        </div>

        {/* Center: Socials */}
        <div className="flex gap-4 items-center justify-center">
            <a href="#" className="text-gray-500 hover:text-white transition-colors duration-300 hover:shadow-[0_0_15px_rgba(255,255,255,0.5)] rounded-full"><Linkedin size={18}/></a>
            <a href="#" className="text-gray-500 hover:text-white transition-colors duration-300 hover:shadow-[0_0_15px_rgba(255,255,255,0.5)] rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4l11.733 16h4.267l-11.733 -16z" /><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" /></svg>
            </a>
            <a href="#" className="text-gray-500 hover:text-white transition-colors duration-300 hover:shadow-[0_0_15px_rgba(255,255,255,0.5)] rounded-full"><Instagram size={18}/></a>
            <a href="#" className="text-gray-500 hover:text-white transition-colors duration-300 hover:shadow-[0_0_15px_rgba(255,255,255,0.5)] rounded-full"><Facebook size={18}/></a>
            <a href="#" className="text-gray-500 hover:text-white transition-colors duration-300 hover:shadow-[0_0_15px_rgba(255,255,255,0.5)] rounded-full"><Mail size={18}/></a>
        </div>

        {/* Right: Legal & Copyright stack */}
        <div className="flex flex-col items-center md:items-end gap-2 text-center md:text-right text-[10px] font-mono text-gray-500">
            <div className="flex flex-wrap justify-center md:justify-end gap-4">
               <a href="#" className="hover:text-white transition-colors underline decoration-gray-800 underline-offset-2">Termos Gerais</a>
               <a href="#" className="hover:text-white transition-colors underline decoration-gray-800 underline-offset-2">Privacidade</a>
               <a href="#" className="hover:text-white transition-colors underline decoration-gray-800 underline-offset-2">Avisos legais</a>
            </div>
            
            <p className="text-gray-600 mt-2 uppercase tracking-wide">
              © {new Date().getFullYear()} VELKS Group — Todos os direitos reservados ⊛
            </p>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const sections = gsap.utils.toArray<HTMLElement>('section');
      
      sections.forEach((sec, index) => {
        if (index === 0) return; // Skip hero

        // Create a surreal entrance wrapper effect but ONLY on the child container to avoid trigger bugs
        gsap.fromTo(sec.children, 
          { 
            y: 50,
            opacity: 0,
            filter: "blur(10px)",
          }, 
          { 
            y: 0,
            opacity: 1, 
            filter: "blur(0px)",
            duration: 1.5, 
            ease: "expo.out",
            scrollTrigger: {
              trigger: sec,
              start: "top 85%",
              end: "top 40%",
              scrub: 1,
            }
          }
        );
      });

      // Specific staggered animations for pain cards
      gsap.fromTo('.pain-card-animate', 
        {
          z: -500,
          rotationY: 45,
          opacity: 0,
        },
        {
          z: 0,
          rotationY: 0,
          opacity: 1,
          duration: 1.5,
          stagger: 0.2, // Stagger effect
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: ".pain-cards-container",
            start: "top 80%",
            end: "top 40%",
            scrub: true,
          }
        }
      );

      // Specific staggered animations for mechanism steps
      gsap.fromTo('.mechanism-step-animate',
        {
          x: 200,
          rotationZ: 10,
          opacity: 0,
        },
        {
          x: 0,
          rotationZ: 0,
          opacity: 1,
          duration: 1.5,
          stagger: 0.3,
          ease: "elastic.out(1, 0.5)",
          scrollTrigger: {
            trigger: ".mechanism-container",
            start: "top 85%",
            end: "top 40%",
            scrub: 1,
          }
        }
      );

      // Scroll Progress Bar
      gsap.to('.progress-bar', {
        scaleX: 1,
        ease: 'none',
        transformOrigin: "left",
        scrollTrigger: {
          trigger: mainRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
        }
      });

      // Recalculate ScrollTrigger on interval and window load to handle external widgets
      const refreshInterval = setInterval(() => {
        ScrollTrigger.refresh();
      }, 1000);
      
      setTimeout(() => clearInterval(refreshInterval), 8000);

      const handleLoad = () => ScrollTrigger.refresh();
      window.addEventListener('load', handleLoad);

      return () => {
        clearInterval(refreshInterval);
        window.removeEventListener('load', handleLoad);
        ctx.revert();
      };
    }, mainRef);
  }, []);

  return (
    <div className="relative w-full overflow-x-hidden min-h-screen bg-brand-dark">
      <PromoBanner />
      <div className="progress-bar fixed top-0 left-0 h-1.5 bg-gradient-to-r from-[#00e5ff] via-[#cc00ff] to-[#ffaa00] w-full z-[100] scale-x-0 origin-left mt-[44px] sm:mt-[40px]" />
      <CustomCursor />
      <TopNav />
      <BackgroundCanvas />
      <main id="main-scroll-container" className="relative w-full font-sans text-white mix-blend-normal z-10" ref={mainRef}>
        <VSLHeroScene />
        <PainScene />
        <MechanismScene />
        <TestimonialsScene />
        <CTAScene />
      </main>
      <Footer />
    </div>
  );
}
