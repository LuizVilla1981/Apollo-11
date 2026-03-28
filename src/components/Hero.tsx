import type { MouseEvent } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Play, MessageCircle } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

const heroHighlights = ['Pubs e barzinhos', 'Aniversários e eventos', 'Trio ou banda completa'];

const trustNotes = [
  'Base em Itajubá, MG',
  'Nostalgia, peso e repertório flexível',
  'Retorno rápido para orçamento',
];

export function Hero() {
  const scrollToSection = (event: MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    event.preventDefault();

    const target = document.getElementById(sectionId);
    if (!target) return;

    const navElement = document.querySelector('nav');
    const navHeight = navElement?.getBoundingClientRect().height ?? (window.innerWidth < 768 ? 84 : 96);
    const visualBreathingRoom = window.innerWidth < 768 ? 18 : 28;
    const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight - visualBreathingRoom;

    window.scrollTo({
      top: Math.max(targetTop, 0),
      behavior: 'smooth',
    });
  };

  return (
    <section id="hero" className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-5 pb-20 pt-28 text-center md:px-6 md:pt-32 md:pb-24">
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative z-10 flex max-w-5xl flex-col items-center"
      >
        <BrandLogo
          className="mb-5 flex items-center justify-center"
          imageClassName="h-28 w-auto object-contain object-center sm:h-32 md:h-48 lg:h-60 xl:h-68 drop-shadow-[0_18px_42px_rgba(0,0,0,0.38)]"
          fallbackClassName="text-6xl md:text-8xl lg:text-[9rem] font-extrabold tracking-tighter font-headline text-on-surface leading-none"
          priority={true}
        />
        <p className="mb-5 max-w-[18rem] text-[11px] font-label font-light uppercase tracking-[0.32em] text-primary sm:max-w-none sm:text-sm md:text-base md:tracking-[0.38em]">
          Rock • Pop Rock • MPB
        </p>

        <div className="mb-6 flex flex-wrap items-center justify-center gap-2.5 md:mb-8">
          {heroHighlights.map((item) => (
            <span
              key={item}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-2 font-label text-[10px] uppercase tracking-[0.18em] text-on-surface-variant backdrop-blur-sm sm:text-[11px]"
            >
              {item}
            </span>
          ))}
        </div>

        <h1 className="max-w-4xl text-balance font-headline text-3xl font-extrabold leading-[1.05] text-on-surface sm:text-4xl md:text-5xl lg:text-6xl">
          Show certo para noites que pedem repertório forte e resposta do público.
        </h1>

        <p className="mt-4 max-w-2xl text-pretty text-xs leading-5 text-on-surface-variant sm:text-sm md:mt-5 md:text-base md:leading-7">
          Rock, pop rock e MPB com nostalgia, presença de palco e formato flexível para bares, aniversários e eventos.
        </p>

        <div className="mt-8 flex w-full max-w-sm flex-col items-stretch gap-3 sm:max-w-none sm:flex-row sm:items-center sm:justify-center sm:gap-4 md:mt-10 md:gap-6">
          <a
            href="#contato"
            onClick={(event) => scrollToSection(event, 'contato')}
            className="group flex min-h-12 items-center justify-center gap-3 rounded-md bg-primary-container px-6 py-4 text-center font-label text-xs font-bold uppercase tracking-[0.18em] text-on-primary-container transition-all hover:brightness-110 hover:shadow-[0_0_30px_rgba(230,126,34,0.4)] shadow-[0_0_20px_rgba(230,126,34,0.2)] sm:w-auto sm:px-8 sm:text-sm sm:tracking-widest"
          >
            <MessageCircle size={18} />
            Pedir orçamento
          </a>
          <a
            href="#repertorio"
            onClick={(event) => scrollToSection(event, 'repertorio')}
            className="group flex min-h-12 items-center justify-center gap-3 rounded-md border border-white/20 bg-white/5 px-6 py-4 text-center font-label text-xs font-bold uppercase tracking-[0.18em] text-white transition-all hover:border-primary hover:text-primary backdrop-blur-md sm:w-auto sm:px-8 sm:text-sm sm:tracking-widest"
          >
            <Play size={18} className="fill-current" />
            Ver repertório
          </a>
          <a
            href="#galeria"
            onClick={(event) => scrollToSection(event, 'galeria')}
            className="group flex min-h-12 items-center justify-center gap-2 rounded-md border border-transparent px-4 py-4 text-center font-label text-[11px] font-bold uppercase tracking-[0.2em] text-on-surface-variant transition-colors hover:text-primary sm:w-auto sm:px-2 sm:text-xs"
          >
            Ver provas ao vivo
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </a>
        </div>

        <div className="mt-8 grid w-full max-w-4xl grid-cols-1 gap-3 sm:grid-cols-3 md:mt-10 md:gap-4">
          {trustNotes.map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.07),rgba(255,255,255,0.02))] px-4 py-4 text-center backdrop-blur-sm"
            >
              <p className="font-label text-[11px] uppercase tracking-[0.2em] text-on-surface-variant sm:text-xs">{item}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 md:bottom-12 md:gap-3"
      >
        <span className="text-[10px] font-label text-outline uppercase tracking-[0.3em]">Descubra</span>
        <motion.div 
          animate={{ y: [0, 10, 0] }} 
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="w-[1px] h-12 bg-gradient-to-b from-primary to-transparent"
        ></motion.div>
      </motion.div>
    </section>
  );
}
