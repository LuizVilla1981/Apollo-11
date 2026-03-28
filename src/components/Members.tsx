import { motion } from 'motion/react';
import { LazyEmbed } from './LazyEmbed';

const createSpotifyTrackEmbed = (trackId: string) =>
  `https://open.spotify.com/embed/track/${trackId}?utm_source=generator&theme=0`;

const members = [
  {
    name: 'Apolo Bagattini',
    role: 'Vocalista',
    image: '/members/apolo-bagattini.webp',
    favoriteSong: 'Hey Jude',
    favoriteArtist: 'The Beatles',
    spotifyEmbed: createSpotifyTrackEmbed('3m7V717IKZqZLW5qUIOxdD'),
  },
  {
    name: 'Luiz Avelar',
    role: 'Baixista',
    image: '/members/luiz-avelar.webp',
    favoriteSong: 'Killing in the Name',
    favoriteArtist: 'Rage Against the Machine',
    spotifyEmbed: createSpotifyTrackEmbed('59WN2psjkt1tyaxjspN8fp'),
  },
  {
    name: 'Luiz Villanacci',
    role: 'Violonista',
    image: '/members/luiz-villanacci.webp',
    favoriteSong: 'Black',
    favoriteArtist: 'Pearl Jam',
    spotifyEmbed: createSpotifyTrackEmbed('5Xak5fmy089t0FYmh3VJiY'),
  }
];

export function Members() {
  return (
    <section id="integrantes" className="relative px-5 py-20 md:px-6 md:py-28 xl:py-32">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 text-center md:mb-20">
          <span className="font-label text-primary uppercase tracking-[0.2em] text-xs">O Núcleo</span>
          <h2 className="mt-4 text-3xl font-headline font-bold sm:text-4xl md:text-5xl">Integrantes</h2>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 md:gap-10 xl:gap-12">
          {members.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="group relative rounded-[1.75rem] border border-white/10 bg-white/[0.03] px-4 py-4 backdrop-blur-[3px] transition-all hover:-translate-y-2 hover:border-cyan-300/20 hover:bg-white/[0.05] md:px-6 md:py-5"
            >
              <div className="relative mb-6 transition-all duration-700 md:mb-8">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  width="400"
                  height="500"
                  loading="lazy"
                  decoding="async"
                  className="w-full max-h-[22rem] h-auto object-contain scale-[1.03] group-hover:scale-[1.06] transition-transform duration-700 sm:max-h-[24rem] md:max-h-[34rem]"
                />
              </div>
              <h3 className="mb-2 text-xl font-headline font-bold sm:text-2xl">{member.name}</h3>
              <p className="font-label text-primary uppercase text-xs tracking-[0.2em]">{member.role}</p>

              <div className="mt-6 rounded-[1.25rem] border border-primary/30 bg-[linear-gradient(180deg,rgba(230,126,34,0.18),rgba(8,10,14,0.24))] p-3 shadow-[0_0_22px_rgba(230,126,34,0.12)] backdrop-blur-sm sm:p-4">
                <p className="inline-flex rounded-full border border-primary/35 bg-primary/12 px-3 py-1 font-label text-[11px] uppercase tracking-[0.22em] text-primary">Música favorita</p>
                <p className="mt-2 text-sm font-body text-on-surface-variant">
                  {member.favoriteSong} <span className="text-on-surface/70">• {member.favoriteArtist}</span>
                </p>
                <LazyEmbed
                  title={`Player Spotify de ${member.name}`}
                  src={member.spotifyEmbed}
                  provider="spotify"
                  loadStrategy="visible"
                  ctaLabel="Carregar música favorita"
                  className="mt-3 rounded-[1.2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(0,0,0,0.36),rgba(255,255,255,0.04))] p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] sm:p-2"
                  frameClassName="min-h-[152px] overflow-hidden rounded-[1rem]"
                  minHeightClassName="min-h-[152px]"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
