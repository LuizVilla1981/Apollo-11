import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ExternalLink, Music2, X } from 'lucide-react';
import { LazyEmbed } from './LazyEmbed';

export type RepertoireEmbed = {
  title: string;
  url: string;
  height: number;
};

export type RepertoireGenre = {
  key: string;
  title: string;
  description: string;
  tracks: string[];
  spotifyEmbeds: RepertoireEmbed[];
};

type RepertoireModalProps = {
  genre: RepertoireGenre | null;
  onClose: () => void;
};

export function RepertoireModal({ genre, onClose }: RepertoireModalProps) {
  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!genre) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    requestAnimationFrame(() => modalRef.current?.focus());

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [genre, onClose]);

  return (
    <AnimatePresence>
      {genre ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] bg-[#020304]/84 backdrop-blur-xl"
          onClick={onClose}
        >
          <div className="flex h-full items-stretch justify-center p-0 sm:p-3 md:p-6">
            <motion.div
              ref={modalRef}
              tabIndex={-1}
              role="dialog"
              aria-modal="true"
              aria-labelledby="repertoire-modal-title"
              initial={{ opacity: 0, scale: 0.96, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 18 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
              className="relative flex h-full w-full max-w-5xl flex-col overflow-hidden bg-[linear-gradient(180deg,rgba(17,20,23,0.96),rgba(8,10,13,0.98))] text-on-surface outline-none sm:h-auto sm:max-h-[92vh] sm:rounded-[28px] sm:border sm:border-white/10 sm:shadow-[0_32px_120px_rgba(0,0,0,0.45)] md:max-h-[88vh]"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,183,131,0.16),rgba(255,183,131,0)_28%),radial-gradient(circle_at_bottom_left,rgba(67,103,177,0.14),rgba(67,103,177,0)_24%)]" />

              <div className="relative flex items-start justify-between gap-4 border-b border-white/8 px-4 py-4 sm:px-6 sm:py-5 md:px-8 md:py-6">
                <div className="max-w-2xl pr-2 sm:pr-6">
                  <p className="mb-3 font-label text-[11px] uppercase tracking-[0.35em] text-primary">Nosso Repertório</p>
                  <h3 id="repertoire-modal-title" className="font-headline text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
                    {genre.title}
                  </h3>
                  <p className="mt-3 max-w-xl text-sm leading-6 text-on-surface-variant md:mt-4 md:text-base md:leading-7">
                    {genre.description}
                  </p>
                </div>

                <button
                  type="button"
                  aria-label="Fechar modal"
                  onClick={onClose}
                  className="rounded-full border border-white/10 bg-white/5 p-2.5 text-on-surface-variant transition-colors hover:border-primary/40 hover:text-primary sm:p-3"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="relative grid min-h-0 flex-1 grid-cols-1 gap-0 overflow-y-auto md:grid-cols-[0.95fr_1.25fr]">
                <div className="border-b border-white/8 px-4 py-5 sm:px-6 sm:py-6 md:border-b-0 md:border-r md:border-white/8 md:px-8 md:py-8">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="rounded-full border border-primary/30 bg-primary/10 p-2 text-primary">
                      <Music2 size={18} />
                    </div>
                    <h4 className="font-label text-xs uppercase tracking-[0.28em] text-on-surface-variant">Músicas que tocamos</h4>
                  </div>

                  <ul className="space-y-2.5 md:space-y-3">
                    {genre.tracks.map((track) => (
                      <li
                        key={track}
                        className="rounded-2xl border border-white/8 bg-white/[0.04] px-4 py-3 text-sm leading-6 text-on-surface-variant shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]"
                      >
                        {track}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="px-4 py-5 sm:px-6 sm:py-6 md:px-8 md:py-8">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="rounded-full border border-primary/30 bg-primary/10 p-2 text-primary">
                      <ExternalLink size={18} />
                    </div>
                    <h4 className="font-label text-xs uppercase tracking-[0.28em] text-on-surface-variant">Ouça no Spotify</h4>
                  </div>

                  <div className="space-y-5">
                    {genre.spotifyEmbeds.map((embed) => (
                      <div key={embed.url} className="overflow-hidden rounded-[24px] border border-white/8 bg-black/30 p-2">
                        <p className="px-3 pb-2 pt-2 font-label text-[11px] uppercase tracking-[0.22em] text-on-surface-variant">
                          {embed.title}
                        </p>
                        <LazyEmbed
                          title={embed.title}
                          src={embed.url}
                          provider="spotify"
                          loadStrategy="visible"
                          ctaLabel="Carregar playlist"
                          frameClassName="rounded-[18px]"
                          minHeight={Math.max(embed.height - 40, 260)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}