import { Suspense, lazy, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';

import type { GalleryItem } from './GalleryLightbox';

const GalleryLightbox = lazy(() => import('./GalleryLightbox').then((module) => ({ default: module.GalleryLightbox })));

type GalleryCategory = 'all' | 'image' | 'video';

const getVideoTitle = (src: string) => {
  const fileName = decodeURIComponent(src.split('/').pop() ?? 'Vídeo');
  return fileName.replace(/\.[^/.]+$/, '');
};

const baseGalleryItems = [
  { src: '/galeria/DSC00028.webp', type: 'image' as const, alt: 'Registro Apollo 11 1' },
  { src: '/galeria/dont-look-back-in-anger-oasis.mp4', type: 'video' as const, alt: 'Vídeo da música Dont Look Back in Anger', poster: '/galeria/posters/dont-look-back-in-anger-oasis.jpg' },
  { src: '/galeria/cachimbo-da-paz-gabriel-o-pensador.mp4', type: 'video' as const, alt: 'Vídeo da música Cachimbo da Paz', poster: '/galeria/posters/cachimbo-da-paz-gabriel-o-pensador.jpg' },
  { src: '/galeria/DSC04939.webp', type: 'image' as const, alt: 'Registro Apollo 11 2' },
  { src: '/galeria/DSC05003.webp', type: 'image' as const, alt: 'Registro Apollo 11 3' },
  { src: '/galeria/iris-goo-goo-dolls.mp4', type: 'video' as const, alt: 'Vídeo da música Iris', poster: '/galeria/posters/iris-goo-goo-dolls.jpg' },
  { src: '/galeria/DSC04950.webp', type: 'image' as const, alt: 'Registro Apollo 11 4' },
  { src: '/galeria/DSC04959.webp', type: 'image' as const, alt: 'Registro Apollo 11 5' },
  { src: '/galeria/outra-vida-armandinho.mp4', type: 'video' as const, alt: 'Vídeo da música Outra Vida', poster: '/galeria/posters/outra-vida-armandinho.jpg' },
  { src: '/galeria/DSC04996.webp', type: 'image' as const, alt: 'Registro Apollo 11 6' },
  { src: '/galeria/last-kiss-pearl-jam.mp4', type: 'video' as const, alt: 'Vídeo da música Last Kiss', poster: '/galeria/posters/last-kiss-pearl-jam.jpg' },
  { src: '/galeria/DSC05060.webp', type: 'image' as const, alt: 'Registro Apollo 11 7' },
].map((item, index): GalleryItem => ({
  id: index + 1,
  label: item.type === 'video' ? getVideoTitle(item.src) : undefined,
  ...item,
}));

const imageItems = baseGalleryItems.filter((item) => item.type === 'image');
const videoItems = baseGalleryItems.filter((item) => item.type === 'video');

const galleryItems = [
  ...Array.from({ length: Math.max(videoItems.length, Math.ceil(imageItems.length / 2)) }).flatMap((_, index) => {
    const firstPhoto = imageItems[index * 2];
    const video = videoItems[index];
    const secondPhoto = imageItems[index * 2 + 1];

    return [firstPhoto, video, secondPhoto].filter((item): item is GalleryItem => Boolean(item));
  }),
];

const categoryOptions: Array<{ value: GalleryCategory; label: string }> = [
  { value: 'all', label: 'Tudo' },
  { value: 'image', label: 'Fotos' },
  { value: 'video', label: 'Vídeos' },
];

const ITEMS_PER_PAGE = 3;

export function Gallery() {
  const [page, setPage] = useState(0);
  const [activeCategory, setActiveCategory] = useState<GalleryCategory>('all');
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  const filteredItems = activeCategory === 'all'
    ? galleryItems
    : activeCategory === 'image'
      ? imageItems
      : videoItems;

  const categoryCounts: Record<GalleryCategory, number> = {
    all: galleryItems.length,
    image: imageItems.length,
    video: videoItems.length,
  };

  useEffect(() => {
    setPage(0);
    setSelectedItem(null);
  }, [activeCategory]);

  const pageCount = Math.max(1, Math.ceil(filteredItems.length / ITEMS_PER_PAGE));
  const visibleItems = filteredItems.slice(page * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE + ITEMS_PER_PAGE);

  const showPrevious = () => {
    setPage((current) => (current === 0 ? pageCount - 1 : current - 1));
  };

  const showNext = () => {
    setPage((current) => (current === pageCount - 1 ? 0 : current + 1));
  };

  const selectedIndex = selectedItem ? filteredItems.findIndex((item) => item.id === selectedItem.id) : -1;

  const showPreviousPhoto = () => {
    if (!selectedItem) return;
    const previousIndex = selectedIndex <= 0 ? filteredItems.length - 1 : selectedIndex - 1;
    setSelectedItem(filteredItems[previousIndex]);
  };

  const showNextPhoto = () => {
    if (!selectedItem) return;
    const nextIndex = selectedIndex >= filteredItems.length - 1 ? 0 : selectedIndex + 1;
    setSelectedItem(filteredItems[nextIndex]);
  };

  return (
    <section id="galeria" className="relative px-5 py-20 md:px-6 md:py-28 xl:py-32">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 flex flex-col items-center gap-5 text-center md:mb-16">
          <div>
            <span className="font-label text-primary uppercase tracking-[0.2em] text-xs">Registros</span>
            <h2 className="mt-4 text-3xl font-headline font-bold sm:text-4xl md:text-5xl">Nossa Galeria</h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-on-surface-variant sm:text-base">
              Um pouco do que a Apollo 11 vive no dia a dia: vídeos de ensaio, momentos de show e bastidores. Passe pro lado e confira!
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2.5">
              {categoryOptions.map((option) => {
                const isActive = activeCategory === option.value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setActiveCategory(option.value)}
                    className={`rounded-full border px-4 py-2 font-label text-[11px] uppercase tracking-[0.18em] transition-colors md:text-xs ${isActive ? 'border-primary/40 bg-primary/12 text-primary shadow-[0_0_16px_rgba(230,126,34,0.08)]' : 'border-white/10 bg-white/5 text-on-surface-variant hover:border-white/20 hover:text-on-surface'}`}
                  >
                    {option.label} ({categoryCounts[option.value]})
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 font-label text-[11px] uppercase tracking-[0.18em] text-on-surface-variant md:text-xs md:tracking-widest">
              {String(page + 1).padStart(2, '0')} / {String(pageCount).padStart(2, '0')}
            </div>
            <button
              type="button"
              onClick={showPrevious}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-on-surface-variant transition-colors hover:border-primary/40 hover:text-primary"
              aria-label="Ver fotos anteriores"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={showNext}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-on-surface-variant transition-colors hover:border-primary/40 hover:text-primary"
              aria-label="Ver próximas fotos"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div className="relative overflow-hidden px-12 sm:px-14 lg:px-16">
          <button
            type="button"
            onClick={showPrevious}
            className="absolute left-0 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/35 text-on-surface-variant backdrop-blur-sm transition-colors hover:border-primary/40 hover:text-primary sm:h-11 sm:w-11"
            aria-label="Ver fotos anteriores"
          >
            <ChevronLeft size={18} />
          </button>

          <AnimatePresence mode="wait">
            <motion.div
              key={page}
              initial={{ opacity: 0, x: 36 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -36 }}
              transition={{ duration: 0.32, ease: 'easeOut' }}
              className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3"
            >
              {visibleItems.map((item) => (
                <motion.button
                  type="button"
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.28 }}
                  key={item.id}
                  className="group relative aspect-square overflow-hidden rounded-xl border border-outline-variant/20 text-left"
                  onClick={() => setSelectedItem(item)}
                >
                  {item.type === 'video' ? (
                    <div className="relative h-full w-full overflow-hidden bg-black">
                      <img
                        src={item.poster}
                        alt={item.alt}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/55" />
                      <div className="absolute inset-0 flex h-full flex-col items-center justify-end gap-2 px-5 pb-6 text-center sm:pb-7">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-primary/30 bg-primary/12 text-primary shadow-[0_0_22px_rgba(230,126,34,0.14)]">
                          <Play size={22} fill="currentColor" className="ml-1" />
                        </div>
                        <p className="max-w-[18rem] font-headline text-base font-bold leading-tight text-on-surface sm:text-lg">{item.label ?? 'Vídeo'}</p>
                        <p className="text-[11px] font-label uppercase tracking-[0.2em] text-white/78">Toque para assistir</p>
                      </div>
                    </div>
                  ) : (
                    <img
                      src={item.src}
                      alt={item.alt}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  )}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <span className="rounded-full bg-black/80 px-3 py-2 font-label text-[11px] uppercase tracking-[0.16em] text-primary backdrop-blur-sm md:px-4 md:text-xs md:tracking-widest">{item.type === 'video' ? 'Ver vídeo' : 'Ver foto'}</span>
                  </div>
                </motion.button>
              ))}
            </motion.div>
          </AnimatePresence>

          <button
            type="button"
            onClick={showNext}
            className="absolute right-0 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/35 text-on-surface-variant backdrop-blur-sm transition-colors hover:border-primary/40 hover:text-primary sm:h-11 sm:w-11"
            aria-label="Ver próximas fotos"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        <div className="mt-6 flex justify-center gap-2">
          {Array.from({ length: pageCount }).map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setPage(index)}
              className={`h-2.5 rounded-full transition-all ${page === index ? 'w-10 bg-primary' : 'w-2.5 bg-white/20 hover:bg-white/35'}`}
              aria-label={`Ir para a página ${index + 1} da galeria`}
            />
          ))}
        </div>
      </div>
      <Suspense fallback={null}>
        <GalleryLightbox
          items={filteredItems}
          selectedItem={selectedItem}
          onClose={() => setSelectedItem(null)}
          onPrevious={showPreviousPhoto}
          onNext={showNextPhoto}
        />
      </Suspense>
    </section>
  );
}
