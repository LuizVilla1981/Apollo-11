import { motion } from 'motion/react';
import { Quote } from 'lucide-react';

const testimonials = [
  {
    text: "O repertório entrou muito certo. Não teve momento de queda e o público ficou junto do começo ao fim. Dá pra perceber que vocês sabem ler a noite e segurar a energia do lugar.",
    author: "Cadu",
    role: "Público presente",
    company: "Noite em pub"
  },
  {
    text: "Apollo 11 é o tipo de banda que facilita a operação da casa. Chega preparada, entende o ambiente, mantém o volume no ponto e segura o público. Para mim, isso é o que separa show bonito de show que funciona.",
    author: "Christian",
    role: "Dono de casa",
    company: "Emporium"
  },
  {
    text: "No meu aniversário, vocês acertaram exatamente o clima que eu queria. Ficou forte sem ficar invasivo, animado sem perder elegância. Foi o tipo de show que faz o evento crescer de nível.",
    author: "Marcelo",
    role: "Contratante",
    company: "Aniversário"
  }
];

export function Testimonials() {
  return (
    <section id="depoimentos" className="overflow-hidden py-32 px-6 relative scroll-mt-24 md:scroll-mt-28">
      <div className="max-w-7xl mx-auto">
        <div className="mb-14 text-center md:mb-20">
          <span className="font-label text-primary uppercase tracking-[0.2em] text-xs">O que dizem</span>
          <h2 className="mt-4 text-4xl font-headline font-bold md:text-5xl">Quem contrata e quem assiste percebe.</h2>
          <p className="mx-auto mt-5 max-w-3xl text-sm leading-7 text-on-surface-variant sm:text-base md:text-lg md:leading-8">
            Esses relatos valem porque falam do que realmente importa: repertório, presença, nostalgia e resposta do público.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="relative overflow-hidden rounded-[1.6rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-8 backdrop-blur-md transition-colors hover:border-primary/40"
            >
              <div className="mb-6 inline-flex rounded-full border border-primary/25 bg-primary/10 px-3 py-1 font-label text-[10px] uppercase tracking-[0.2em] text-primary">
                {item.role} {item.company && `• ${item.company}`}
              </div>
              <Quote className="text-primary/18 absolute top-6 right-6" size={48} />
              <p className="text-on-surface-variant font-body leading-8 mb-8 relative z-10 italic">
                "{item.text}"
              </p>
              <div>
                <h4 className="font-headline font-bold text-lg">{item.author}</h4>
                <p className="text-xs font-label text-on-surface-variant uppercase tracking-widest mt-1">
                  Relato real da experiência com a banda
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
