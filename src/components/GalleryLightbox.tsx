import { useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Play, X } from 'lucide-react';

export type GalleryItem = {
  id: number;
  src: string;
  alt: string;
  type: 'image' | 'video';
  label?: string;
  poster?: string;
};

type GalleryLightboxProps = {
  items: GalleryItem[];
  selectedItem: GalleryItem | null;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
};

export function GalleryLightbox({ items, selectedItem, onClose, onPrevious, onNext }: GalleryLightboxProps) {
  useEffect(() => {
    if (!selectedItem) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowLeft') onPrevious();
      if (event.key === 'ArrowRight') onNext();
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedItem, onClose, onPrevious, onNext]);

  return (
    <AnimatePresence>
      {selectedItem ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 backdrop-blur-xl sm:p-4 md:p-12"
          onClick={onClose}
        >
          <button
            className="absolute right-4 top-4 rounded-full bg-white/5 p-2 text-on-surface-variant transition-colors hover:text-primary backdrop-blur-sm md:right-6 md:top-6"
            onClick={onClose}
          >
            <X size={24} />
          </button>

          {items.length > 1 ? (
            <>
              <button
                type="button"
                className="absolute left-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/35 text-on-surface-variant backdrop-blur-sm transition-colors hover:border-primary/40 hover:text-primary md:left-6 md:h-12 md:w-12"
                onClick={(event) => {
                  event.stopPropagation();
                  onPrevious();
                }}
                aria-label="Foto anterior"
              >
                <ChevronLeft size={20} />
              </button>

              <button
                type="button"
                className="absolute right-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/35 text-on-surface-variant backdrop-blur-sm transition-colors hover:border-primary/40 hover:text-primary md:right-6 md:h-12 md:w-12"
                onClick={(event) => {
                  event.stopPropagation();
                  onNext();
                }}
                aria-label="Próxima foto"
              >
                <ChevronRight size={20} />
              </button>
            </>
          ) : null}

          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="w-full max-w-5xl overflow-hidden rounded-xl border border-outline-variant/20 bg-black shadow-2xl aspect-[4/5] sm:aspect-video"
            onClick={(event) => event.stopPropagation()}
          >
            {selectedItem.type === 'video' ? (
              <div className="relative flex h-full w-full items-center justify-center bg-black">
                <video
                  src={selectedItem.src}
                  poster={selectedItem.poster}
                  controls
                  playsInline
                  preload="metadata"
                  className="h-full w-full object-contain"
                />
                <div className="pointer-events-none absolute left-4 top-4 rounded-full border border-white/10 bg-black/45 px-3 py-2 text-[11px] font-label uppercase tracking-[0.18em] text-on-surface-variant backdrop-blur-sm md:left-6 md:top-6">
                  {selectedItem.label ?? 'Vídeo'}
                </div>
              </div>
            ) : (
              <img
                src={selectedItem.src}
                alt={selectedItem.alt}
                decoding="async"
                className="h-full w-full object-contain"
              />
            )}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}