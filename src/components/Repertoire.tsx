import { Suspense, lazy, useState } from 'react';
import { motion } from 'motion/react';
import { Music, Plus, Radio, Star } from 'lucide-react';
import type { RepertoireGenre } from './RepertoireModal';
import { LazyEmbed } from './LazyEmbed';
import { SongSuggestionForm } from './forms/SongSuggestionForm';

const RepertoireModal = lazy(() => import('./RepertoireModal').then((module) => ({ default: module.RepertoireModal })));

const repertoireGenres: RepertoireGenre[] = [
  {
    key: 'rock-classico',
    title: 'Rock (Nacional e Internacional)',
    description:
      'Clássicos de rock nacional e internacional que atravessam gerações, do acústico emotivo aos refrões que todo mundo canta junto.',
    tracks: [
      'Wish You Were Here — Pink Floyd',
      'Comfortably Numb — Pink Floyd',
      'Black — Pearl Jam',
      'Last Kiss — Pearl Jam',
      'Yellow Ledbetter — Pearl Jam',
      'Alive — Pearl Jam',
      'With Or Without You — U2',
      'Don’t Look Back in Anger — Oasis',
      'Stop Crying Your Heart Out — Oasis',
      'Wonderwall — Oasis',
      'Nothing Else Matters — Metallica',
      'Patience — Guns N’ Roses',
      'Sweet Child O’ Mine — Guns N’ Roses',
      'Civil War — Guns N’ Roses',
      'November Rain — Guns N’ Roses',
      'Knockin’ On Heaven’s Door — Bob Dylan',
      'Smells Like Teen Spirit — Nirvana',
      'Polly — Nirvana',
      'Behind Blue Eyes — Limp Bizkit',
      'Still Loving You — Scorpions',
      'Wind Of Change — Scorpions',
      'You Give Love A Bad Name — Bon Jovi',
      'Sultans Of Swing — Dire Straits',
      'Hotel California (2013 Remaster) — Eagles',
      'What’s Up? — 4 Non Blondes',
      'Zombie (2025 Remastered) — The Cranberries',
      'Creep — Radiohead',
      'Fake Plastic Trees — Radiohead',
      'Every Breath You Take — The Police',
      'Use Somebody — Kings of Leon',
      'Everlong — Foo Fighters',
      'More Than Words — Extreme',
      'Man in the Box — Alice In Chains',
      'Nutshell — Alice In Chains',
      'Killing In The Name — Rage Against The Machine',
      'Psycho Killer — Talking Heads',
      'Hey Jude — The Beatles',
      'Come Together (Remastered) — The Beatles',
      '3X4 (Ao Vivo) — Engenheiros do Hawaii',
      'Infinita Highway (Ao Vivo) — Engenheiros do Hawaii',
      'Pra Ser Sincero — Engenheiros do Hawaii',
      'Era um Garoto, Que Como Eu… — Engenheiros do Hawaii',
      'Mulher de Fases — Raimundos',
      'Cowboy Fora da Lei — Raul Seixas',
      'Na Sua Estante — Pitty',
      'O Astronauta de Mármore — Nenhum de Nós',
      'Camila, Camila — Nenhum de Nós',
      'Pelados em Santos — Mamonas Assassinas',
      'Robocop Gay — Mamonas Assassinas',
    ],
    spotifyEmbeds: [
      {
        title: 'Playlist Rock Internacional e Nacional',
        url: 'https://open.spotify.com/embed/playlist/1dRJGyrdjx40SY10SNR3Lf?utm_source=generator&theme=0',
        height: 500,
      },
    ],
  },
  {
    key: 'mpb-groove',
    title: 'MPB',
    description:
      'Canções brasileiras com balanço, assinatura forte e clima quente, ideais para um show próximo do público e cheio de identidade.',
    tracks: [
      'Você — Tim Maia',
      'O Descobridor dos Sete Mares — Tim Maia',
      'La Belle de Jour — Alceu Valença',
      'Tropicana (Morena Tropicana) — Alceu Valença',
    ],
    spotifyEmbeds: [
      {
        title: 'Playlist MPB',
        url: 'https://open.spotify.com/embed/playlist/51RgNG9NvC7VTIKNqyKDxV?utm_source=generator&theme=0',
        height: 500,
      },
    ],
  },
  {
    key: 'pop-rock',
    title: 'Pop Rock',
    description:
      'Hinos do pop rock nacional e internacional para manter o repertório leve, cantado e com energia constante do começo ao fim.',
    tracks: [
      'Dois Rios — Skank',
      'Ainda Gosto Dela — Skank',
      'Vou Deixar — Skank',
      'Vamos Fugir — Skank',
      'À Sua Maneira — Capital Inicial',
      'À Sua Maneira (De Música Lig…) — Capital Inicial',
      'Primeiros Erros (Chove) (Ao Vivo) — Capital Inicial',
      'Meu Erro — Os Paralamas do Sucesso',
      'Lanterna dos Afogados — Os Paralamas do Sucesso',
      'Whisky a Go-Go — Roupa Nova',
      'A Dois Passos do Paraíso — Blitz',
      'Anna Júlia — Los Hermanos',
      'Segredos — Frejat',
      'Razões e Emoções — NX Zero',
      'Never Tear Us Apart — INXS',
      'Everybody Wants To Rule The World — Tears For Fears',
      'Iris — The Goo Goo Dolls',
      'Losing My Religion — R.E.M.',
      'Yellow — Coldplay',
      'Mr. Brightside — The Killers',
      'Somewhere Only We Know — Keane',
    ],
    spotifyEmbeds: [
      {
        title: 'Playlist Pop Rock',
        url: 'https://open.spotify.com/embed/playlist/7irh4Ix460bKGJ2OabXrbO?utm_source=generator&theme=0',
        height: 500,
      },
    ],
  },
  {
    key: 'em-breve',
    title: 'Pop e Outros',
    description:
      'Uma seleção mais aberta, com pop, reggae, forró e xote para variar a dinâmica do show sem perder a identidade da banda.',
    tracks: [
      'Stand By Me — Ben E. King',
      'Feel Good Inc. — Gorillaz, De La Soul',
      'Beautiful Girls — Sean Kingston',
      'Purple Rain — Prince',
      'Cachimbo da Paz (feat. Lulu Sant…) — Gabriel O Pensador',
      'Pescador de Ilusões — O Rappa',
      'Tudo Que Ela Gosta de Escutar — Charlie Brown Jr.',
      'Só Por Uma Noite — Charlie Brown Jr.',
      'Outra Vida — Armandinho',
      'Rindo à Toa — Falamansa',
      'Xote dos Milagres — Falamansa',
    ],
    spotifyEmbeds: [
      {
        title: 'Playlist Pop e Outros',
        url: 'https://open.spotify.com/embed/playlist/5b5L4IXFR0Vfbg6dhX3fc3?utm_source=generator&theme=0',
        height: 500,
      },
    ],
  },
];

const repertoireCards = [
  {
    key: 'rock-classico',
    title: 'Rock (Nacional e Internacional)',
    subtitle: 'Pink Floyd, Pearl Jam, Oasis...',
    icon: Star,
    className: 'bg-white/5 backdrop-blur-md border border-white/10',
  },
  {
    key: 'mpb-groove',
    title: 'MPB',
    subtitle: 'Tim Maia, Alceu Valença...',
    icon: Music,
    className: 'bg-white/5 backdrop-blur-md border border-white/10',
  },
  {
    key: 'pop-rock',
    title: 'Pop Rock',
    subtitle: 'Skank, Capital Inicial, Keane...',
    icon: Radio,
    className: 'bg-white/5 backdrop-blur-md border border-white/10',
  },
  {
    key: 'em-breve',
    title: 'Pop e Outros',
    subtitle: 'Prince, O Rappa, Falamansa...',
    icon: Plus,
    className: 'bg-primary-container/20 backdrop-blur-md border border-primary/30 shadow-[0_0_30px_rgba(230,126,34,0.15)]',
  },
] as const;

export function Repertoire() {
  const [selectedGenre, setSelectedGenre] = useState<RepertoireGenre | null>(null);

  const openGenre = (genreKey: string) => {
    const genre = repertoireGenres.find((item) => item.key === genreKey);
    if (genre) {
      setSelectedGenre(genre);
    }
  };

  return (
    <>
      <section id="repertorio" className="relative overflow-hidden px-5 py-20 scroll-mt-24 md:px-6 md:py-28 md:scroll-mt-28 xl:py-32">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 text-center md:mb-16">
            <span className="font-label text-primary uppercase tracking-[0.2em] text-xs">Playlist Infinito</span>
            <h2 className="mt-4 text-3xl font-headline font-bold sm:text-4xl md:text-5xl">Nosso Repertório</h2>
            <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-on-surface-variant sm:text-base sm:leading-8">
              Faixas que abrem, crescem e seguram a noite — clássicos que todo mundo conhece, com espaço para ajustar o clima de cada evento. Rock, pop rock e MPB com peso, memória e proximidade.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-7 flex flex-col gap-6">
              <div className="grid h-full grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
                {repertoireCards.map((card) => {
                  const Icon = card.icon;

                  return (
                    <motion.button
                      key={card.key}
                      type="button"
                      whileHover={{ y: -5 }}
                      whileTap={{ scale: 0.985 }}
                      onClick={() => openGenre(card.key)}
                      className={`${card.className} min-h-[180px] rounded-xl p-6 text-left transition-colors hover:border-primary/40 hover:bg-white/8 md:min-h-[200px] md:p-8`}
                    >
                      <div className="flex h-full flex-col justify-between">
                        <Icon className="mb-5 text-primary md:mb-6" size={30} />
                        <div>
                          <h3 className="mb-2 text-xl font-headline font-bold sm:text-2xl">{card.title}</h3>
                          <p className="mb-3 font-label text-[11px] uppercase tracking-[0.22em] text-primary/85">O que a gente toca</p>
                          <p className="text-sm font-label text-on-surface-variant">{card.subtitle}</p>
                          <p className="mt-4 text-xs font-label uppercase tracking-widest text-primary">Ver músicas →</p>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-5 overflow-hidden rounded-xl border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.07),rgba(255,255,255,0.03))] p-3 backdrop-blur-md flex flex-col min-h-[460px] md:min-h-[460px]"
            >
              <div className="p-4 pb-3 md:p-6 md:pb-4">
                <h3 className="text-xl font-headline font-bold mb-1">Nosso repertório no Spotify</h3>
                <p className="text-xs font-label text-on-surface-variant uppercase tracking-widest">Playlist Oficial da Apollo 11</p>
              </div>
              <LazyEmbed
                title="Playlist Oficial da Apollo 11"
                src="https://open.spotify.com/embed/playlist/6qPDZpaOeIlcYcnIxARdY7?utm_source=generator&theme=0"
                provider="spotify"
                loadStrategy="visible"
                ctaLabel="Carregar playlist oficial"
                className="flex-grow overflow-hidden rounded-[1.1rem] border border-white/10 bg-[linear-gradient(180deg,rgba(0,0,0,0.45),rgba(255,255,255,0.04))] p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] sm:p-2"
                frameClassName="min-h-[420px] sm:min-h-[440px] md:min-h-[420px] rounded-[16px]"
                minHeightClassName="min-h-[420px] sm:min-h-[440px] md:min-h-[420px]"
              />
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-8 md:mt-10"
          >
            <SongSuggestionForm />
          </motion.div>
        </div>
      </section>

      <Suspense fallback={null}>
        <RepertoireModal genre={selectedGenre} onClose={() => setSelectedGenre(null)} />
      </Suspense>
    </>
  );
}
