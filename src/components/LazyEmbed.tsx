import { memo, useEffect, useRef, useState } from 'react';
import { ExternalLink, Play } from 'lucide-react';

type LazyEmbedProps = {
  title: string;
  src: string;
  provider?: 'spotify' | 'youtube' | 'instagram' | 'generic';
  className?: string;
  frameClassName?: string;
  minHeightClassName?: string;
  minHeight?: number;
  loadStrategy?: 'visible' | 'click';
  ctaLabel?: string;
};

function LazyEmbedComponent({
  title,
  src,
  provider = 'generic',
  className = '',
  frameClassName = '',
  minHeightClassName = 'min-h-[320px]',
  minHeight,
  loadStrategy = 'visible',
  ctaLabel,
}: LazyEmbedProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    if (loadStrategy !== 'visible' || shouldLoad) {
      return;
    }

    const element = containerRef.current;
    if (!element) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: '240px 0px' }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [loadStrategy, shouldLoad]);

  const label = ctaLabel ?? (provider === 'spotify' ? 'Carregar player' : 'Abrir embed');

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      {shouldLoad ? (
        <iframe
          title={title}
          src={src}
          width="100%"
          height="100%"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          style={minHeight ? { border: 0, minHeight } : { border: 0 }}
          className={frameClassName}
        />
      ) : (
        <button
          type="button"
          onClick={() => setShouldLoad(true)}
          style={minHeight ? { minHeight } : undefined}
          className={`flex w-full flex-col items-center justify-center gap-4 rounded-[inherit] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(0,0,0,0.3))] px-5 py-6 text-center text-on-surface-variant transition-colors hover:border-primary/35 hover:text-on-surface ${minHeightClassName}`}
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary">
            {provider === 'youtube' ? <Play size={20} fill="currentColor" /> : <ExternalLink size={20} />}
          </div>
          <div>
            <p className="font-headline text-lg font-bold text-on-surface">{title}</p>
            <p className="mt-2 text-sm leading-6">{label}</p>
          </div>
        </button>
      )}
    </div>
  );
}

export const LazyEmbed = memo(LazyEmbedComponent);