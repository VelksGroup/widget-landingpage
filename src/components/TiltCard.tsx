import React, { useEffect, useRef, useState } from 'react';
import { Play, ArrowUpRight, AlertTriangle, ChevronRight, Activity, Crosshair, Network, Mail, Globe, Lock, Linkedin, Instagram, Facebook } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';


interface TiltCardProps { children: React.ReactNode; className?: string; glowColor?: string; }
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
export { TiltCard };