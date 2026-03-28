import { motion } from 'motion/react';
import { CheckCircle2, Mail, MapPin, Phone } from 'lucide-react';
import { BookingRequestForm } from './forms/BookingRequestForm';

const contactAssurances = [
  'Resposta rápida para pubs, aniversários e eventos.',
  'Formato ajustado ao espaço, duração e estrutura do local.',
  'Contato direto com a banda, sem burocracia desnecessária.',
];

export function Contact() {
  return (
    <section id="contato" className="relative overflow-hidden px-5 py-20 md:px-6 md:py-28 xl:py-32">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
          
          {/* Info Side */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="font-label text-primary uppercase tracking-[0.2em] text-xs">CONTRATAR</span>
            <h2 className="mt-4 mb-6 max-w-xl text-3xl font-headline font-bold leading-tight sm:text-4xl md:mb-8 md:text-5xl">A banda certa para segurar o clima do seu evento do começo ao fim.</h2>
            <p className="mb-8 max-w-xl font-body text-base leading-7 text-on-surface-variant md:mb-10 md:text-lg md:leading-8">
              Se a ideia é contratar um show com repertório forte, nostalgia e presença real, este é o ponto de partida. Envie as informações e seguimos com um orçamento claro, direto e rápido.
            </p>

            <div className="mb-8 space-y-3 rounded-[1.5rem] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-5 backdrop-blur-sm md:mb-10 md:p-6">
              {contactAssurances.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-primary" />
                  <p className="text-sm leading-6 text-on-surface-variant md:text-[15px]">{item}</p>
                </div>
              ))}
            </div>

            <div className="space-y-6 md:space-y-8">
              <div className="flex items-center gap-4 group sm:gap-6">
                <div className="w-12 h-12 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
                  <Phone size={20} />
                </div>
                <div>
                  <p className="text-xs font-label text-on-surface-variant uppercase tracking-widest mb-1">Telefone / WhatsApp</p>
                  <p className="font-headline font-bold text-lg">+55 35 99709-6187</p>
                </div>
              </div>

              <div className="flex items-center gap-4 group sm:gap-6">
                <div className="w-12 h-12 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-xs font-label text-on-surface-variant uppercase tracking-widest mb-1">E-mail</p>
                  <p className="font-headline font-bold text-lg">trioapollo11@gmail.com</p>
                </div>
              </div>

              <div className="flex items-center gap-4 group sm:gap-6">
                <div className="w-12 h-12 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="text-xs font-label text-on-surface-variant uppercase tracking-widest mb-1">Base</p>
                  <p className="font-headline font-bold text-lg">Itajubá, Minas Gerais - Brasil</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Form Side */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <BookingRequestForm />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
