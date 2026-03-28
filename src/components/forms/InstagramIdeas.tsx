import type { ChangeEvent, FormEvent } from 'react';
import { useState } from 'react';
import { Check, LoaderCircle } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { useCooldown } from '../../hooks/useCooldown';
import { useToast } from '../ui/Toast';

type IdeaFormState = {
  message: string;
  name: string;
  isSubmitting: boolean;
  feedback: { type: 'success' | 'error'; message: string } | null;
};

const initialFormState: IdeaFormState = { message: '', name: '', isSubmitting: false, feedback: null };

export function InstagramIdeas() {
  const [form, setForm] = useState<IdeaFormState>(initialFormState);
  const { isCooling, remaining, trigger: triggerCooldown } = useCooldown(10_000);
  const { showToast } = useToast();

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value, feedback: null }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.message.trim()) {
      setForm((current) => ({ ...current, feedback: { type: 'error', message: 'Preencha a mensagem antes de enviar.' } }));
      return;
    }

    if (isCooling) return;

    if (!supabase) {
      setForm((current) => ({ ...current, feedback: { type: 'error', message: 'Não foi possível enviar agora. Tente novamente.' } }));
      return;
    }

    setForm((current) => ({ ...current, isSubmitting: true, feedback: null }));

    const { error } = await supabase.from('ig_requests').insert({
      request_type: 'next_video_song',
      message: form.message.trim(),
      name: form.name.trim() || null,
    });

    setForm({ message: '', name: '', isSubmitting: false, feedback: error ? { type: 'error', message: 'Não foi possível enviar agora. Tente novamente.' } : null });

    if (error) {
      showToast('error', 'Não foi possível enviar agora. Tente novamente.');
    } else {
      showToast('success', 'Enviado! Valeu pela sugestão 👊');
      triggerCooldown();
    }
  };

  return (
    <div className="mt-10">
      <div className="rounded-[1.5rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.025))] p-5 backdrop-blur-xl transition-all duration-300 hover:border-primary/25">
        <h3 className="text-xl font-headline font-bold leading-tight">Qual música você quer ver a gente tocando no próximo vídeo?</h3>

        <form onSubmit={(event) => void handleSubmit(event)} className="mt-5 space-y-4">
          <div>
            <label htmlFor="ig-message" className="mb-2 block text-xs font-label uppercase tracking-widest text-on-surface-variant">
              Mensagem
            </label>
            <textarea
              id="ig-message"
              name="message"
              required
              rows={3}
              value={form.message}
              onChange={handleChange}
              className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-on-surface outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary resize-none"
              placeholder="Conta pra gente qual faixa não pode faltar."
            />
          </div>

          <div>
            <label htmlFor="ig-name" className="mb-2 block text-xs font-label uppercase tracking-widest text-on-surface-variant">
              Nome (opcional)
            </label>
            <input
              id="ig-name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-on-surface outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
              placeholder="Seu nome"
            />
          </div>

          <div className="min-h-6 text-sm leading-6">
            {form.feedback ? (
              <p className="text-rose-300">{form.feedback.message}</p>
            ) : null}
          </div>

          <button
            type="submit"
            disabled={form.isSubmitting || isCooling}
            className="flex w-full min-h-12 items-center justify-center gap-3 rounded-xl bg-white/[0.04] px-5 py-4 text-center font-label text-sm font-bold uppercase tracking-[0.2em] text-on-surface transition-all hover:border-primary/35 hover:bg-white/[0.07] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {form.isSubmitting ? <LoaderCircle size={18} className="animate-spin" /> : <Check size={18} />}
            {form.isSubmitting ? 'Enviando...' : isCooling ? `Aguarde ${remaining}s` : 'Enviar'}
          </button>
        </form>
      </div>
    </div>
  );
}