import { Instagram, MessageCircleMore } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

const instagramProfileUrl = 'https://www.instagram.com/trioapollo11/';
const whatsappUrl = 'https://wa.me/5535997096187';
const spotifyPlaylistUrl = 'https://open.spotify.com/playlist/6qPDZpaOeIlcYcnIxARdY7';

function SpotifyGlyph() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[18px] w-[18px] fill-none stroke-current" strokeWidth="1.8">
      <circle cx="12" cy="12" r="9" />
      <path d="M7.5 10.2c3.2-1 5.9-.8 8.9.6" strokeLinecap="round" />
      <path d="M8.4 13c2.4-.7 4.5-.5 6.8.5" strokeLinecap="round" />
      <path d="M9.4 15.6c1.6-.4 3-.3 4.5.4" strokeLinecap="round" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/10 bg-black/40 px-5 pb-10 pt-16 backdrop-blur-xl md:px-6 md:pt-20">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 grid grid-cols-1 gap-10 text-center md:mb-16 md:grid-cols-4 md:gap-12 md:text-left">
          <div className="md:col-span-2">
            <BrandLogo
              className="mb-5 flex justify-center md:mb-6 md:justify-start"
              imageClassName="h-14 w-auto object-contain md:h-16"
              fallbackClassName="text-3xl font-bold tracking-tighter text-on-surface font-headline"
            />
            <p className="mx-auto mb-6 max-w-sm font-body text-on-surface-variant md:mx-0 md:mb-8">
              Rock, pop rock e MPB com repertório forte, nostalgia e presença de palco para pubs, eventos e noites que pedem resposta do público.
            </p>
            <div className="flex justify-center gap-4 md:justify-start">
              <a href={instagramProfileUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center text-on-surface-variant hover:text-primary hover:border-primary/40 transition-all" aria-label="Instagram da banda">
                <Instagram size={18} />
              </a>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center text-on-surface-variant hover:text-primary hover:border-primary/40 transition-all" aria-label="WhatsApp da banda">
                <MessageCircleMore size={18} />
              </a>
              <a href={spotifyPlaylistUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center text-on-surface-variant hover:text-primary hover:border-primary/40 transition-all" aria-label="Playlist da banda no Spotify">
                <SpotifyGlyph />
              </a>
            </div>
          </div>

          <div>
            <h4 className="mb-5 font-label text-xs uppercase tracking-widest text-on-surface-variant md:mb-6">Navegação</h4>
            <ul className="space-y-4 font-body text-sm">
              <li><a href="#sobre" className="hover:text-primary focus-visible:text-primary focus-visible:outline-none transition-colors">Sobre a Banda</a></li>
              <li><a href="#integrantes" className="hover:text-primary focus-visible:text-primary focus-visible:outline-none transition-colors">Integrantes</a></li>
              <li><a href="#repertorio" className="hover:text-primary focus-visible:text-primary focus-visible:outline-none transition-colors">Repertório</a></li>
              <li><a href="#instagram" className="hover:text-primary focus-visible:text-primary focus-visible:outline-none transition-colors">Instagram</a></li>
              <li><a href="#galeria" className="hover:text-primary focus-visible:text-primary focus-visible:outline-none transition-colors">Galeria</a></li>
              <li><a href="#registros" className="hover:text-primary focus-visible:text-primary focus-visible:outline-none transition-colors">Registros do Público</a></li>
              <li><a href="#depoimentos" className="hover:text-primary focus-visible:text-primary focus-visible:outline-none transition-colors">Depoimentos</a></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-5 font-label text-xs uppercase tracking-widest text-on-surface-variant md:mb-6">Contato</h4>
            <ul className="space-y-4 font-body text-sm">
              <li className="text-on-surface-variant">trioapollo11@gmail.com</li>
              <li className="text-on-surface-variant">+55 35 99709-6187</li>
              <li className="text-on-surface-variant">Itajubá, Minas Gerais</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-outline-variant/10 pt-6 text-center md:pt-8">
          <p className="text-[11px] font-label uppercase tracking-[0.18em] text-on-surface-variant md:text-xs md:tracking-widest">
            Desenvolvido por{' '}
            <a href="https://www.instagram.com/Luiz_Villanacci" target="_blank" rel="noopener noreferrer" className="text-primary hover:brightness-110 transition-colors">
              Luiz Villanacci
            </a>
          </p>
          <p className="mt-2 text-[11px] font-label uppercase tracking-[0.18em] text-on-surface-variant md:text-xs md:tracking-widest">
            &copy; 2026 Trio Apollo 11. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
