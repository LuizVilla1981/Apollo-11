import { motion } from 'motion/react';
import { InstagramIdeas } from './forms/InstagramIdeas';

const instagramProfileUrl = 'https://www.instagram.com/trioapollo11/';
const instagramReelsUrl = 'https://www.instagram.com/reel/DVuWkqIjYSH/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==';

function InstagramGlyph() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-none stroke-current" strokeWidth="1.8">
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.9" className="fill-current stroke-none" />
    </svg>
  );
}

export function InstagramSection() {
  return (
    <section id="instagram" className="relative overflow-hidden px-5 py-20 scroll-mt-24 md:px-6 md:py-28 md:scroll-mt-28 xl:py-32">
      <div className="pointer-events-none absolute left-1/2 top-1/4 h-[20rem] w-[20rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/12 blur-[120px] md:h-[26rem] md:w-[26rem]" />

      <div className="relative z-10 mx-auto max-w-4xl">
        <div className="mb-12 text-center md:mb-16">
          <span className="font-label text-primary uppercase tracking-[0.2em] text-xs">Conexão Direta</span>
          <h2 className="mt-4 text-3xl font-headline font-bold sm:text-4xl md:text-5xl">Instagram</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-on-surface-variant sm:text-base md:mt-5 md:text-lg">
            As datas, vídeos e novidades estão sempre atualizadas por lá.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.65 }}
          className="mx-auto"
        >
          <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-5 text-center shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl transition-all duration-500 hover:border-primary/25 hover:bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] sm:p-6 md:p-8">
            <div className="mb-6 flex flex-col items-center gap-4 md:mb-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 text-primary shadow-[0_0_24px_rgba(230,126,34,0.18)]">
                <InstagramGlyph />
              </div>
              <div>
                <p className="font-label text-[11px] uppercase tracking-[0.3em] text-on-surface-variant">Perfil oficial</p>
                <a
                  href={instagramProfileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-block break-all text-[1.7rem] font-headline font-bold tracking-tight text-on-surface transition-colors hover:text-primary sm:break-normal sm:text-[2rem] md:text-[2.5rem]"
                >
                  @trioapollo11
                </a>
              </div>
            </div>

            <p className="mx-auto max-w-xl text-sm leading-relaxed text-on-surface-variant md:text-base">
              Segue a gente para acompanhar a agenda e os bastidores.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-4 md:mt-10">
              <a
                href={instagramProfileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-12 items-center justify-center rounded-xl bg-primary-container px-6 py-4 text-center font-label text-sm font-bold uppercase tracking-[0.2em] text-on-primary-container transition-all hover:brightness-110 hover:shadow-[0_0_28px_rgba(230,126,34,0.28)]"
              >
                Abrir Instagram
              </a>
              <a
                href={instagramReelsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-12 items-center justify-center rounded-xl border border-white/15 bg-white/[0.04] px-6 py-4 text-center font-label text-sm font-bold uppercase tracking-[0.2em] text-on-surface transition-all hover:border-primary/35 hover:text-primary"
              >
                Ver reels
              </a>
            </div>
          </div>
        </motion.div>

        <div className="mt-8 md:mt-10">
          <div className="mb-6 text-center md:mb-8">
            <span className="font-label text-primary uppercase tracking-[0.2em] text-xs">Participação da comunidade</span>
            <h3 className="mt-3 text-2xl font-headline font-bold sm:text-3xl md:text-4xl">Sugestões para conteúdo</h3>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-on-surface-variant md:text-base md:leading-7">
              Deixa sua ideia para reels, que se possível gravaremos um cover e postaremos!
            </p>
          </div>

          <InstagramIdeas />
        </div>
      </div>
    </section>
  );
}