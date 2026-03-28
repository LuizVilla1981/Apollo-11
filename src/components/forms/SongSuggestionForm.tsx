import type { ChangeEvent, FormEvent } from 'react';
import { useState } from 'react';
import { LoaderCircle, Music4 } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { reportError } from '../../utils/logger';
import { useCooldown } from '../../hooks/useCooldown';
import { useToast } from '../ui/Toast';

type SuggestionFormState = {
  songName: string;
  artist: string;
  spotifyUrl: string;
  suggestedBy: string;
};

const initialState: SuggestionFormState = {
  songName: '',
  artist: '',
  spotifyUrl: '',
  suggestedBy: '',
};

export function SongSuggestionForm() {
  const [form, setForm] = useState<SuggestionFormState>(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const { isCooling, remaining, trigger: triggerCooldown } = useCooldown(10_000);
  const { showToast } = useToast();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    if (feedback) {
      setFeedback(null);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.songName.trim() || !form.artist.trim()) {
      setFeedback({ type: 'error', message: 'Preencha os campos obrigatórios antes de enviar.' });
      return;
    }

    if (isCooling) return;

    if (!supabase) {
      setFeedback({ type: 'error', message: 'Supabase não configurado. Verifique as variáveis de ambiente.' });
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    const { error } = await supabase.from('song_suggestions').insert({
      song_name: form.songName.trim(),
      artist: form.artist.trim(),
      spotify_link: form.spotifyUrl.trim() || null,
      suggested_by: form.suggestedBy.trim() || null,
    });

    setIsSubmitting(false);

    if (error) {
      reportError('[SongSuggestionForm] Failed to save suggestion.', error);
      const isMissingTable = error.code === 'PGRST205';
      showToast('error', isMissingTable
        ? 'A tabela de sugestões ainda não existe no Supabase. Crie a tabela song_suggestions para habilitar o envio.'
        : 'Não foi possível enviar agora. Tente novamente.');
      return;
    }

    setForm(initialState);
    showToast('success', 'Enviado! Valeu pela sugestão 👊');
    triggerCooldown();
  };

  return (
    <div className="rounded-[1.75rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-5 backdrop-blur-xl sm:p-6 md:p-8">
      <div className="mb-6 flex flex-col gap-3 md:mb-8 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="font-label text-primary uppercase tracking-[0.2em] text-xs">Participação do público</span>
          <h3 className="mt-3 text-2xl font-headline font-bold sm:text-3xl md:text-4xl">Sugerir uma música</h3>
        </div>
        <p className="max-w-xl text-sm leading-6 text-on-surface-variant md:text-base md:text-right md:leading-7">
          Manda uma música que você gostaria de ouvir no nosso show. Se fizer sentido no repertório, ela pode pintar por aqui.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="songName" className="mb-2 block text-xs font-label uppercase tracking-widest text-on-surface-variant">
            Nome da música
          </label>
          <input
            id="songName"
            name="songName"
            type="text"
            required
            value={form.songName}
            onChange={handleChange}
            className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-on-surface outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
            placeholder="Ex.: Wish You Were Here"
          />
        </div>

        <div>
          <label htmlFor="artist" className="mb-2 block text-xs font-label uppercase tracking-widest text-on-surface-variant">
            Artista
          </label>
          <input
            id="artist"
            name="artist"
            type="text"
            required
            value={form.artist}
            onChange={handleChange}
            className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-on-surface outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
            placeholder="Ex.: Pink Floyd"
          />
        </div>

        <div>
          <label htmlFor="spotifyUrl" className="mb-2 block text-xs font-label uppercase tracking-widest text-on-surface-variant">
            Link do Spotify (opcional)
          </label>
          <input
            id="spotifyUrl"
            name="spotifyUrl"
            type="url"
            value={form.spotifyUrl}
            onChange={handleChange}
            className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-on-surface outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
            placeholder="https://open.spotify.com/track/..."
          />
        </div>

        <div>
          <label htmlFor="suggestedBy" className="mb-2 block text-xs font-label uppercase tracking-widest text-on-surface-variant">
            Nome da pessoa (opcional)
          </label>
          <input
            id="suggestedBy"
            name="suggestedBy"
            type="text"
            value={form.suggestedBy}
            onChange={handleChange}
            className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-on-surface outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
            placeholder="Seu nome"
          />
        </div>

        <div className="md:col-span-2 flex flex-col gap-4 pt-2 md:flex-row md:items-center md:justify-between">
          <div className="min-h-6 text-sm leading-6">
            {feedback ? (
              <p className="text-rose-300">{feedback.message}</p>
            ) : (
              <p className="text-on-surface-variant">Campos obrigatórios validados antes do envio.</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting || isCooling}
            className="flex min-h-12 w-full items-center justify-center gap-3 rounded-xl bg-primary-container px-6 py-4 text-center font-label text-sm font-bold uppercase tracking-[0.2em] text-on-primary-container transition-all hover:brightness-110 hover:shadow-[0_0_28px_rgba(230,126,34,0.28)] disabled:cursor-not-allowed disabled:opacity-70 md:w-auto"
          >
            {isSubmitting ? <LoaderCircle size={18} className="animate-spin" /> : <Music4 size={18} />}
            {isSubmitting ? 'Enviando...' : isCooling ? `Aguarde ${remaining}s` : 'Salvar sugestão'}
          </button>
        </div>
      </form>
    </div>
  );
}