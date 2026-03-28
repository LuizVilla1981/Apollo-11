import { motion } from 'motion/react';

export function About() {
  return (
    <section id="sobre" className="relative overflow-hidden px-5 py-20 md:px-6 md:py-28 xl:py-32">
      <div className="max-w-7xl mx-auto grid items-center gap-10 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:gap-16">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-reading-surface"
        >
          <span className="font-label text-primary uppercase tracking-[0.2em] text-xs">A Banda</span>
          <h2 className="mb-6 text-3xl font-bold font-headline leading-tight sm:text-4xl md:mb-8 md:text-6xl">
            Sobre <span className="text-primary">a Apollo 11.</span>
          </h2>
          <p className="mb-6 text-base leading-8 text-on-surface-variant font-body sm:text-lg md:mb-8 md:text-xl md:leading-relaxed">
            A Apollo 11 nasceu em Itajubá com uma missão: tocar as músicas que marcaram a vida das pessoas e transformar qualquer noite num momento que ninguém quer que acabe.
          </p>
          <p className="mb-8 text-base leading-8 text-on-surface-variant font-body sm:text-lg md:mb-10 md:text-xl md:leading-relaxed">
            Seja no formato acústico ou com banda completa, o que move a gente é ver o público cantando junto, criando memória e sentindo que aquele show foi feito pra ele.
          </p>


        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          {/* Decorative constellation line */}
          <svg className="absolute -top-12 -left-12 w-32 h-32 text-outline/20 pointer-events-none hidden sm:block" viewBox="0 0 100 100">
            <line x1="10" y1="90" x2="90" y2="10" stroke="currentColor" strokeWidth="1" />
            <circle cx="10" cy="90" r="2" fill="currentColor" />
            <circle cx="90" cy="10" r="2" fill="currentColor" />
            <circle cx="50" cy="50" r="3" fill="var(--color-primary)" className="opacity-50" />
          </svg>

          <div className="relative mt-2 overflow-hidden rounded-[1.75rem] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] backdrop-blur-[2px] group shadow-[0_18px_60px_rgba(2,6,23,0.22)] md:mt-12">
            <img 
              src="/brand/about-hero.webp" 
              alt="Foto da banda Apollo 11 ao vivo" 
              width="600"
              height="400"
              loading="lazy"
              decoding="async"
              className="w-full h-auto max-h-[22rem] object-contain object-center transition-transform duration-700 group-hover:scale-[1.02] sm:max-h-[25rem] md:max-h-[34rem]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/16 via-transparent to-transparent"></div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
