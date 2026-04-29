import React, { useEffect, useRef, useState } from 'react';
import BackgroundCanvas from './components/BackgroundCanvas';
import CustomCursor from './components/CustomCursor';
import { Play, ArrowUpRight, AlertTriangle, ChevronRight, Activity, Crosshair, Network, Mail, Globe } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Substituir este link pelo Payment Link real da Stripe quando o produto estiver criado.
const stripeCheckoutUrl = "COLOCAR_AQUI_LINK_DO_CHECKOUT_STRIPE";
const whatsappUrl = "https://wa.me/33761569686?text=Ol%C3%A1%2C%20vi%20a%20demo%20da%20VELKS.SPACE%20e%20quero%20implementar%20este%20sistema%20no%20meu%20site.%20Pode%20me%20explicar%20o%20pr%C3%B3ximo%20passo%3F";

const handleMainCtaClick = () => {
  window.open(stripeCheckoutUrl, "_blank", "noopener,noreferrer");
};

const handleSecondaryCtaClick = () => {
  window.open(whatsappUrl, "_blank", "noopener,noreferrer");
};

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
    <div className="fixed top-4 right-4 z-50 flex justify-end pointer-events-none">
      {/* Hidden original widget */}
      <div id="google_translate_element" className="hidden"></div>
      
      <div className="pointer-events-auto flex items-center gap-1.5 bg-[#11001a]/80 backdrop-blur-xl border border-white/10 p-2 transition-all shadow-[0_0_20px_rgba(204,0,255,0.15)] rounded-[20px]">
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
        transform: isHovered ? `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)` : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)',
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
      <div className="w-full h-full relative">
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
        <div className="flex flex-col z-10 w-full order-1 lg:order-1 pt-6 lg:pt-0">
          <div className="inline-flex items-center gap-3 px-4 py-2 border border-brand-cyan/20 bg-brand-cyan/5 w-max backdrop-blur-md rounded-none mb-6">
            <div className="w-1.5 h-1.5 bg-brand-cyan animate-pulse box-glow-cyan"></div>
            <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.2em] text-white">VELKS.SPACE · DEMO PRIVADA</span>
          </div>
          
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[6rem] font-bold tracking-tighter text-white leading-[1] drop-shadow-2xl mb-6">
            O cliente <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-blue-400">quente</span><br/> não espera.
          </h1>
          
          <p className="text-lg sm:text-xl md:text-2xl text-white/90 font-light max-w-lg leading-snug lg:leading-relaxed mb-6">
            Quando ele entra no teu site, tens poucos segundos para responder antes que ele vá para o concorrente.
          </p>

          <div className="border-l-[3px] border-brand-cyan pl-4 py-1 mb-6">
             <p className="font-mono text-sm sm:text-base uppercase tracking-widest text-[#00e5ff] font-bold">
               Este sistema entra nesse momento.
             </p>
          </div>
          
          {/* Assiste message */}
          <div className="bg-black/40 backdrop-blur-md border border-white/10 p-4 w-full max-w-md hidden lg:block mb-6">
             <p className="text-white text-sm font-light leading-relaxed">
               Assiste à demo.<br/> Em menos de 60 segundos vais perceber onde estás a perder clientes.
             </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative w-full sm:w-auto group/btn">
              <div className="absolute inset-0 bg-brand-cyan/60 blur-lg rounded opacity-50 group-hover/btn:opacity-100 transition-opacity duration-500 animate-[pulse_3s_ease-in-out_infinite]"></div>
              <button onClick={handleMainCtaClick} className="relative w-full sm:w-auto px-10 py-5 bg-brand-cyan text-black font-bold uppercase tracking-widest text-sm hover:bg-white transition-all duration-500 hover:-translate-y-1 shadow-[0_0_20px_rgba(0,229,255,0.4)] group-hover/btn:shadow-[0_0_40px_rgba(0,229,255,0.8)] flex items-center justify-center gap-3">
                Quero implementar isto <ArrowUpRight className="w-5 h-5 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
              </button>
            </div>
            <button onClick={() => {
              const el = document.getElementById('demo-video-container');
              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }} className="w-full sm:w-auto px-8 py-5 bg-transparent border border-white/20 text-white font-mono text-sm uppercase tracking-widest hover:bg-white/10 transition-all duration-300">
              Ver como funciona
            </button>
          </div>
          
          <SealsRow />
        </div>

        {/* Vertical Video Demo Hero - Centered and highlighted */}
        <div id="demo-video-container" className="relative w-full aspect-[9/16] max-w-[350px] sm:max-w-[400px] mx-auto lg:ml-auto lg:mr-0 z-20 order-2 lg:order-2 perspective-1000">
           <div className="absolute inset-0 bg-gradient-to-br from-brand-cyan/30 via-transparent to-[#cc00ff]/30 blur-2xl -z-10 rounded-3xl"></div>
           
           <div className="w-full h-full glass-panel-light p-1 lg:p-2 rounded-2xl border border-white/20 shadow-2xl relative overflow-hidden group">
              {/* Vertical Video background */}
              <video 
                className="absolute inset-0 w-full h-full object-cover rounded-xl"
                src="https://cdn.pixabay.com/video/2020/07/28/45887-446755452_large.mp4" 
                autoPlay 
                loop 
                muted 
                playsInline
              />
              
              {/* Premium Glow Edge */}
              <div className="absolute inset-0 border border-brand-cyan/40 rounded-xl pointer-events-none mix-blend-overlay"></div>
              
              {/* Play Button Overlay (Optional, if video autoplays it's just visual) */}
              <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-black/20 group-hover:bg-black/10 transition-colors">
                <div className="w-16 h-16 bg-brand-cyan/20 backdrop-blur-md rounded-full flex items-center justify-center border border-brand-cyan/50 group-hover:scale-110 group-hover:bg-brand-cyan/40 transition-all duration-300">
                  <Play className="w-6 h-6 text-white ml-1" fill="currentColor" />
                </div>
              </div>
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

          <div className="pain-cards-container grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6 z-10 lg:ml-8">
             {[
               { title: "Resposta lenta", result: "Interesse frio" },
               { title: "Site parado", result: "Cliente perdido" },
               { title: "Mensagem solta", result: "Sem contexto" },
               { title: "Equipa ocupada", result: "Venda escapando" }
             ].map((card, i) => (
               <div key={i} className="pain-card-animate">
                 <TiltCard
                   className="pain-card group cursor-pointer border border-[#ff3366]/30 bg-[#ff3366]/5 backdrop-blur-[40px] flex flex-col justify-center min-h-[120px] sm:min-h-[160px] shadow-[0_0_50px_rgba(255,0,60,0.15)_inset]"
                   glowColor="rgba(255,0,60,0.8)"
                 >
                   <div className="p-5 sm:p-8 h-full w-full flex flex-col justify-center">
                     <AlertTriangle className="w-6 h-6 sm:w-8 sm:h-8 text-[#ff3366] opacity-90 mb-3 sm:mb-4 group-hover:scale-125 transition-transform duration-300 drop-shadow-[0_0_20px_rgba(255,51,102,1)]" />
                     <p className="text-white font-mono text-[10px] sm:text-sm font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] mb-1 sm:mb-2 drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">{card.title}</p>
                     <p className="text-[#ff3366] font-black text-lg sm:text-2xl tracking-tighter leading-none drop-shadow-[0_0_15px_rgba(255,51,102,0.8)]">{card.result}</p>
                   </div>
                 </TiltCard>
               </div>
             ))}
             
             <div className="col-span-1 sm:col-span-2 mt-4 sm:mt-6 flex justify-center sm:justify-end" style={{ transform: 'translateZ(20px)' }}>
               <button onClick={handleMainCtaClick} className="px-8 py-4 sm:py-5 bg-white/5 border border-white/20 text-white font-mono font-bold text-xs sm:text-sm uppercase tracking-[0.1em] hover:bg-[#ff003c] hover:border-[#ff003c] hover:shadow-[0_0_30px_rgba(255,0,60,0.6)] transition-all duration-500 backdrop-blur-xl rounded-lg w-full sm:w-auto">
                  Parar de perder intenção →
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
             Enquanto a tua equipa trabalha, o sistema aborda, qualifica e envia o cliente pronto para ti.
           </p>
           
           <div className="p-6 bg-white/5 border border-white/20 border-l-[4px] border-l-[#00e5ff] backdrop-blur-[30px] rounded-r-xl shadow-[0_0_40px_rgba(0,229,255,0.1)_inset]">
             <p className="font-mono text-sm sm:text-base text-[#00e5ff] uppercase tracking-[0.2em] font-black leading-relaxed drop-shadow-[0_0_10px_rgba(0,229,255,0.6)]">
               NÃO É ATENDIMENTO.<br/>É UM VENDEDOR QUE NUNCA DORME E NUNCA DEIXA NINGUÉM ESPERAR.
             </p>
           </div>
        </div>

        <div className="mechanism-container lg:w-7/12 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full z-10">
           {[
             { title: "ABORDA", desc: "O visitante recebe atenção absoluta antes de sair.", icon: <Activity className="w-6 h-6 text-[#00e5ff]" /> },
             { title: "QUALIFICA", desc: "O sistema entende a intenção exata da busca.", icon: <Crosshair className="w-6 h-6 text-[#00e5ff]" /> },
             { title: "ORGANIZA", desc: "A conversa caótica vira um dossiê perfeito.", icon: <Network className="w-6 h-6 text-[#00e5ff]" /> },
             { title: "ENTREGA", desc: "Recebes tudo no email: pronto para o fecho.", icon: <Mail className="w-6 h-6 text-[#00e5ff]" /> }
           ].map((step, i) => (
             <div key={i} className="mechanism-step-animate h-full">
               <TiltCard className="group border border-[#00e5ff]/40 bg-[#00e5ff]/5 backdrop-blur-[40px] shadow-[0_0_40px_rgba(0,229,255,0.15)_inset] overflow-hidden min-h-[300px]" glowColor="rgba(0,229,255,0.6)">
                 <div className="p-6 sm:p-8 h-full w-full relative flex flex-col justify-between">
                   <div className="absolute -top-10 -right-10 text-[140px] font-mono font-black text-white/10 group-hover:text-[#00e5ff]/10 transition-colors duration-500 z-0 drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                     0{i+1}
                   </div>
                   <div className="w-14 h-14 border-2 border-[#00e5ff]/60 bg-[#00e5ff]/20 flex items-center justify-center mb-6 relative z-10 rounded-xl shadow-[0_0_30px_rgba(0,229,255,0.5)]">
                     {step.icon}
                   </div>
                   <div>
                     <h4 className="text-white text-3xl font-black tracking-tight mb-3 relative z-10 drop-shadow-[0_0_15px_rgba(255,255,255,0.9)]">{step.title}</h4>
                     <p className="text-white font-bold text-base md:text-lg leading-relaxed relative z-10 drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">{step.desc}</p>
                   </div>
                 </div>
               </TiltCard>
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
               Implementamos o <b className="text-[#ffcc00] font-black" style={{ textShadow: '0 4px 10px rgba(0,0,0,1)' }}>sistema quântico</b> no seu site para captar, qualificar e <i className="text-[#ffaa00]" style={{ textShadow: '0 4px 10px rgba(0,0,0,1)' }}>injetar</i> clientes no seu funil enquanto foca no operacional.
             </p>
           </div>
         </TiltCard>

         <div className="bg-black/60 backdrop-blur-3xl border border-[#ffaa00]/50 shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-lg px-4 sm:px-16 py-6 mb-16 transform -rotate-1 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#ffaa00]/20 to-transparent -translate-x-[200%] group-hover:translate-x-[200%] transition-transform duration-[2000ms] skew-x-12"></div>
            <p className="text-sm sm:text-2xl text-[#ffcc00] font-black uppercase tracking-[0.1em] sm:tracking-[0.2em] font-mono m-0 flex items-center justify-center gap-2 sm:gap-4" style={{ textShadow: '0 4px 15px rgba(0,0,0,1)' }}>
              <span className="w-4 h-4 bg-[#ffaa00] rounded-full animate-ping"></span>
               APENAS 2 VAGAS REAIS ESTA SEMANA
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

         <div className="flex flex-col sm:flex-row divide-y justify-between sm:divide-y-0 sm:divide-x divide-white/20 border-y border-white/20 py-4 sm:py-8 opacity-100 w-full max-w-4xl text-center bg-black/50 backdrop-blur-xl rounded-xl shadow-[0_20px_40px_rgba(0,0,0,0.5)]">
           <span className="font-mono text-[10px] sm:text-xs md:text-sm font-bold uppercase tracking-widest text-[#ffcc00] px-4 sm:px-8 py-3 sm:py-0" style={{ textShadow: '0 4px 15px rgba(0,0,0,1)' }}>Sem equipa extra</span>
           <span className="font-mono text-[10px] sm:text-xs md:text-sm font-bold uppercase tracking-widest text-[#ffcc00] px-4 sm:px-8 py-3 sm:py-0" style={{ textShadow: '0 4px 15px rgba(0,0,0,1)' }}>Sem resposta atrasada</span>
           <span className="font-mono text-[10px] sm:text-xs md:text-sm font-bold uppercase tracking-widest text-[#ffcc00] px-4 sm:px-8 py-3 sm:py-0" style={{ textShadow: '0 4px 15px rgba(0,0,0,1)' }}>Sem cliente perdido em silêncio</span>
         </div>
       </div>
    </section>
  );
}

export default function App() {
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const sections = gsap.utils.toArray<HTMLElement>('section');
      
      sections.forEach((sec, index) => {
        if (index === 0) return; // Skip hero

        // Create a surreal entrance wrapper effect (Scaling, rotating, unblurring from depth)
        gsap.fromTo(sec, 
          { 
            scale: 0.8,
            rotationX: 15,
            y: 200,
            opacity: 0,
            filter: "blur(20px) contrast(150%)",
          }, 
          { 
            scale: 1,
            rotationX: 0,
            y: 0,
            opacity: 1, 
            filter: "blur(0px) contrast(100%)",
            duration: 2, 
            ease: "expo.out",
            scrollTrigger: {
              trigger: sec,
              start: "top 90%",
              end: "top 40%",
              scrub: 1.5,
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
          trigger: document.body,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
        }
      });
    }, mainRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <div className="progress-bar fixed top-0 left-0 h-1.5 bg-gradient-to-r from-[#00e5ff] via-[#cc00ff] to-[#ffaa00] w-full z-[100] scale-x-0 origin-left" />
      <CustomCursor />
      <TopNav />
      <BackgroundCanvas />
      <main id="main-scroll-container" className="relative w-full font-sans text-white pb-10 mix-blend-normal z-10" ref={mainRef}>
        <VSLHeroScene />
        <PainScene />
        <MechanismScene />
        <CTAScene />
      </main>
    </>
  );
}
