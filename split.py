import re
import os

with open('src/App.tsx', 'r') as f:
    content = f.read()

def extract_function(name):
    # Regex to find the function block
    # It assumes the function ends with a line starting with }
    pattern = rf'function {name}[^\{{]*\{{.*?^}}'
    match = re.search(pattern, content, re.DOTALL | re.MULTILINE)
    if match:
        return match.group(0)
    return ''

components = ['PromoBanner', 'TopNav', 'VSLHeroScene', 'PainScene', 'MechanismScene', 'TestimonialsScene', 'CTAScene']

os.makedirs('src/components', exist_ok=True)

imports = """import React, { useEffect, useRef, useState } from 'react';
import { Play, ArrowUpRight, AlertTriangle, ChevronRight, Activity, Crosshair, Network, Mail, Globe, Lock, Linkedin, Instagram, Facebook } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TiltCard } from './TiltCard';
import BackgroundCanvas from './BackgroundCanvas';
"""

# First, extract TiltCard
tilt_card = extract_function('TiltCard')
with open('src/components/TiltCard.tsx', 'w') as f:
    f.write(imports + "\ninterface TiltCardProps { children: React.ReactNode; className?: string; glowColor?: string; }\n" + tilt_card + "\nexport { TiltCard };")

for comp in components:
    comp_code = extract_function(comp)
    with open(f'src/components/{comp}.tsx', 'w') as f:
        code = imports + "\n" + comp_code + f"\nexport default {comp};"
        # Quick hack: add globals
        code = code.replace('function ' + comp, f'const stripeCheckoutUrl = "https://book.stripe.com/dRmeVdbV4bCBc2Q7uF2cg00";\nconst whatsappUrl = "https://wa.me/33761569686?text=Ol%C3%A1%2C%20vi%20a%20demo%20da%20VELKS.SPACE%20e%20quero%20implementar%20este%20sistema%20no%20meu%20site.%20Pode%20me%20explicar%20o%20pr%C3%B3ximo%20passo%3F";\nconst handleMainCtaClick = () => window.open(stripeCheckoutUrl, "_blank", "noopener,noreferrer");\nconst handleSecondaryCtaClick = () => window.open(whatsappUrl, "_blank", "noopener,noreferrer");\n\nconst MarqueeContent = () => ( <div className="flex items-center shrink-0"> <span className="text-[#ff003c] animate-pulse whitespace-nowrap">⚡ PROMOÇÃO LIMITADA POR <span className="line-through opacity-50 px-1 font-normal">497€</span> → 297€</span> <span className="opacity-30 mx-3 sm:mx-5">/</span> <span className="text-[#ffaa00] whitespace-nowrap">GANHE 2 MESES GRÁTIS</span> <span className="opacity-30 mx-3 sm:mx-5">/</span> <span className="whitespace-nowrap">PAGAMENTO ÚNICO DE IMPLEMENTAÇÃO</span> <span className="opacity-30 mx-3 sm:mx-5">/</span> </div> );\n\nfunction ' + comp)
        f.write(code)

