import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, ArrowUpRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const SealsRow = () => {
  const { t } = useTranslation();
  return (
    <div className="text-white/70 text-xs mt-8">
      {t('seals_row_placeholder')}
    </div>
  );
};

const whatsappUrl = "https://wa.me/33761569686?text=Ol%C3%A1%2C%20vi%20a%20demo%20da%20VELKS.SPACE%20e%20quero%20implementar%20este%20sistema%20no%20meu%20site.%20Pode%20me%20explicar%20o%20pr%C3%B3ximo%20passo%3F";
const handleSecondaryCtaClick = () => window.open(whatsappUrl, "_blank", "noopener,noreferrer");

function HeroDemoVideo() {
  const { t } = useTranslation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Explicitly set DOM properties for cross-browser autoplay support
    video.muted = true;
    video.defaultMuted = true;

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
        })
        .catch((error) => {
          console.warn("Video autoplay prevented by browser policy:", error);
          setIsPlaying(false);
        });
    }
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  return (
    <div id="demo-video-container" className="relative w-full aspect-[9/16] max-w-[350px] sm:max-w-[400px] mx-auto lg:ml-auto lg:mr-0 z-20 order-2 lg:order-2 perspective-1000">
      {/* Background ambient glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#cc00ff]/30 via-transparent to-[#ff00a2]/30 blur-2xl -z-10 rounded-3xl animate-pulse"></div>
      
      <div className="w-full h-full glass-panel-light p-1 lg:p-2 rounded-2xl border border-white/20 shadow-2xl relative overflow-hidden group bg-black/40">
        {/* Vertical Video element */}
        <video 
          ref={videoRef}
          className="w-full h-full object-cover rounded-xl block cursor-pointer"
          src="/demo-video.mp4" 
          autoPlay 
          loop 
          muted 
          playsInline
          preload="auto"
          onLoadedData={() => setIsLoaded(true)}
          onClick={togglePlay}
        >
          <source src="/demo-video.mp4" type="video/mp4" />
          Seu navegador não suporta a exibição de vídeos.
        </video>

        {/* Loading overlay */}
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-xl">
            <div className="w-8 h-8 border-2 border-[#00ff88] border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* Interactive Overlay Controls */}
        <div 
          onClick={togglePlay}
          className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4 cursor-pointer rounded-xl"
        >
          {/* Top Bar: Audio Toggle */}
          <div className="flex justify-end">
            <button
              onClick={toggleMute}
              className="p-2.5 bg-black/70 hover:bg-black text-white rounded-full backdrop-blur-md border border-white/20 transition-all duration-300 transform hover:scale-105"
              title={isMuted ? "Ativar som" : "Desativar som"}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-white/80" /> : <Volume2 className="w-4 h-4 text-[#00ff88]" />}
            </button>
          </div>

          {/* Center Play/Pause button when paused */}
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-16 h-16 bg-[#00ff88] text-black rounded-full flex items-center justify-center shadow-lg shadow-[#00ff88]/50 transform scale-110">
                <Play className="w-8 h-8 fill-black ml-1" />
              </div>
            </div>
          )}

          {/* Bottom Bar: Live badge & Mute state */}
          <div className="flex items-center justify-between text-xs text-white/90 font-mono">
            <div className="flex items-center gap-2 bg-black/60 px-3 py-1 rounded-full border border-white/10 backdrop-blur-md">
              <div className="w-2 h-2 bg-[#00ff88] rounded-full animate-ping"></div>
              <span className="uppercase text-[10px] tracking-wider text-[#00ff88] font-bold">DEMO ORION AI</span>
            </div>
            {isMuted && (
              <span className="text-[10px] bg-black/60 px-2.5 py-1 rounded-full border border-white/10 text-white/70">
                Som desligado
              </span>
            )}
          </div>
        </div>

        {/* Edge Glow */}
        <div className="absolute inset-0 border border-[#00ff88]/30 rounded-xl pointer-events-none mix-blend-overlay"></div>
      </div>
      
      {/* Mobile-only assist message under video */}
      <div className="mt-4 text-center lg:hidden bg-black/60 backdrop-blur-md border border-white/10 p-3 rounded-xl">
        <p className="text-white/80 text-xs font-light">
          {t('hero_demo_cta_line1')}. {t('hero_demo_cta_line2')}
        </p>
      </div>
    </div>
  );
}

function VSLHeroScene() {
  const { t } = useTranslation();

  return (
    <section id="scene-1" className="relative w-full min-h-screen pt-24 pb-16 flex flex-col justify-center px-4 lg:px-12 z-10 box-border">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
        
        {/* Mobile-first: Text content above video on small screens, beside it on desktop */}
        <div className="flex flex-col space-y-6 z-10 w-full order-1 lg:order-1 pt-6 lg:pt-0">
          <div className="inline-flex items-center gap-3 px-4 py-2 border border-[#00ff88]/30 bg-[#00ff88]/10 w-max backdrop-blur-md rounded-none">
            <div className="w-1.5 h-1.5 bg-[#00ff88] animate-pulse"></div>
            <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.2em] text-[#00ff88]">{t('hero_tagline')}</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.5rem] font-black tracking-tighter text-white leading-[1.1] drop-shadow-2xl uppercase">
            {t('hero_title_line1')} <br className="hidden lg:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ff88] to-[#00ffa6] drop-shadow-[0_0_15px_rgba(0,255,136,0.5)]">{t('hero_title_line2')}</span>
          </h1>
          
          <p className="text-lg sm:text-xl md:text-2xl text-white/90 font-light max-w-2xl leading-snug lg:leading-relaxed">
            {t('hero_description_part1')} <span className="text-[#00ff88] font-bold">{t('hero_description_highlight')}</span> {t('hero_description_part2')}
          </p>

          <div className="border-l-[3px] border-[#00ff88] pl-4 py-1 my-2">
             <p className="font-mono text-sm sm:text-base uppercase tracking-widest text-[#00ff88] font-bold drop-shadow-[0_0_5px_rgba(0,255,136,0.3)]">
               {t('hero_warning_line1')}<br className="hidden sm:block" />
               {t('hero_warning_line2')}
             </p>
          </div>
          
          {/* Assist message */}
          <div className="bg-black/40 backdrop-blur-md border border-white/10 p-4 w-full max-w-md hidden lg:block mt-4">
             <p className="text-white text-sm font-light leading-relaxed">
               {t('hero_demo_cta_line1')}<br/> {t('hero_demo_cta_line2')}
             </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 pt-4 mt-2">
            <div className="relative w-full sm:w-auto group/btn">
              <div className="absolute inset-0 bg-[#00ff88]/40 blur-[20px] rounded opacity-50 group-hover/btn:opacity-100 transition-opacity duration-500 animate-[pulse_3s_ease-in-out_infinite]"></div>
              <button onClick={handleSecondaryCtaClick} className="relative w-full sm:w-auto px-10 py-5 bg-[#00ff88] text-black font-black uppercase tracking-widest text-sm hover:bg-white hover:text-black transition-all duration-500 hover:-translate-y-1 shadow-[0_0_20px_rgba(0,255,136,0.4)] group-hover/btn:shadow-[0_0_40px_rgba(0,255,136,0.8)] flex items-center justify-center gap-3">
                {t('hero_cta_implement')} <ArrowUpRight className="w-5 h-5 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
              </button>
            </div>
            <button onClick={() => {
              const el = document.getElementById('demo-video-container');
              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }} className="w-full sm:w-auto px-8 py-5 bg-transparent border-2 border-[#00ff88]/50 text-[#00ff88] hover:text-black font-mono text-sm font-bold uppercase tracking-widest hover:bg-[#00ff88] transition-all duration-300 shadow-[0_0_15px_rgba(0,255,136,0.1)]">
               {t('hero_cta_watch_demo')}
            </button>
          </div>
          
          <SealsRow />
        </div>

        {/* Hero Demo Video Component */}
        <HeroDemoVideo />

      </div>
    </section>
  );
}

export default VSLHeroScene;
