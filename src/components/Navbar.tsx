import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BrandLogo } from './BrandLogo';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    let frameId = 0;

    const handleScroll = () => {
      if (frameId) {
        return;
      }

      frameId = window.requestAnimationFrame(() => {
        const nextIsScrolled = window.scrollY > 50;
        setIsScrolled((current) => (current === nextIsScrolled ? current : nextIsScrolled));
        frameId = 0;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.cancelAnimationFrame(frameId);
    };
  }, []);

  const navLinks = [
    { name: 'A Banda', href: '#sobre' },
    { name: 'Integrantes', href: '#integrantes' },
    { name: 'Repertório', href: '#repertorio' },
    { name: 'Instagram', href: '#instagram' },
    { name: 'Galeria', href: '#galeria' },
    { name: 'Registros', href: '#registros' },
    { name: 'Contato', href: '#contato' },
  ];

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-black/40 backdrop-blur-xl border-b border-white/10 py-3 md:py-4' : 'bg-transparent py-4 md:py-6'}`}>
      <div className="max-w-7xl mx-auto px-5 md:px-12 flex justify-between items-center">
        <a href="#" className="flex items-center">
          <BrandLogo
            className="flex items-center"
            imageClassName="h-9 w-auto object-contain md:h-14"
            fallbackClassName="text-2xl font-bold tracking-tighter text-on-surface font-headline"
            priority={true}
          />
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8">
          {navLinks.map((link) => (
            <a key={link.name} href={link.href} className="text-sm font-label text-on-surface-variant hover:text-primary transition-colors">
              {link.name}
            </a>
          ))}
          <a href="#contato" className="bg-primary-container text-on-primary-container px-6 py-2 rounded-md font-label font-bold text-xs uppercase tracking-widest hover:brightness-110 transition-all shadow-[0_0_15px_rgba(230,126,34,0.3)] hover:shadow-[0_0_25px_rgba(230,126,34,0.5)]">
            PEDIR ORÇAMENTO
          </a>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-on-surface p-1" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label={isMobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}>
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-black/80 backdrop-blur-xl border-b border-white/10 px-5 py-5 flex flex-col gap-5 md:hidden"
          >
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href} 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-base font-headline font-medium text-on-surface hover:text-primary transition-colors"
              >
                {link.name}
              </a>
            ))}
            <a 
              href="#contato" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="bg-primary-container text-on-primary-container px-6 py-3 rounded-md font-label font-bold text-sm uppercase tracking-[0.18em] text-center mt-1"
            >
              PEDIR ORÇAMENTO
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
