import type { ChangeEvent, FormEvent } from 'react';
import { useState } from 'react';
import { Check, LoaderCircle, MessageCircleMore } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { reportError } from '../../utils/logger';
import { useToast } from '../ui/Toast';

const eventTypes = ['bar', 'pub', 'aniversario', 'festival', 'corporativo'] as const;
const durationOptions = ['1h', '1h30', '2h', '2h30', '3h', '3h30', '4h', '4h30'] as const;
const formationOptions = ['Trio acústico', 'Banda completa'] as const;
const bookingWhatsappNumber = '5535997096187';

const eventTypeLabels: Record<(typeof eventTypes)[number], string> = {
  bar: 'Bar / restaurante',
  pub: 'Pub / casa noturna',
  aniversario: 'Aniversário / celebração',
  festival: 'Festival / evento maior',
  corporativo: 'Corporativo / evento fechado',
};

const bookingTrustNotes = [
  'O orçamento leva em conta duração, formação e estrutura do local.',
  'Ao enviar, o atendimento continua no WhatsApp para agilizar a resposta.',
];

type DurationOption = (typeof durationOptions)[number];

type BookingFormState = {
  eventDate: string;
  city: string;
  eventType: string;
  duration: DurationOption | '';
  venueHasSoundLight: 'sim' | 'nao' | '';
  contactWhatsapp: string;
  formationPreference: 'Trio acústico' | 'Banda completa' | '';
  notes: string;
};

const initialState: BookingFormState = {
  eventDate: '',
  city: '',
  eventType: '',
  duration: '',
  venueHasSoundLight: '',
  contactWhatsapp: '',
  formationPreference: '',
  notes: '',
};

const formatEventDate = (eventDate: string) => {
  const [year, month, day] = eventDate.split('-');

  if (!year || !month || !day) {
    return eventDate;
  }

  return `${day}/${month}/${year}`;
};

const buildWhatsappUrl = (form: BookingFormState) => {
  const message = [
    'Olá! Quero solicitar um orçamento para a Apollo 11.',
    '',
    `Data: ${formatEventDate(form.eventDate)}`,
    `Cidade: ${form.city.trim()}`,
    `Tipo de evento: ${form.eventType}`,
    `Duração: ${form.duration}`,
    `Local com som e luz: ${form.venueHasSoundLight === 'sim' ? 'Sim' : 'Não'}`,
    `Contato: ${form.contactWhatsapp.trim()}`,
    `Formação: ${form.formationPreference}`,
    `Observações: ${form.notes.trim() || 'Sem observações.'}`,
  ].join('\n');

  return `https://wa.me/${bookingWhatsappNumber}?text=${encodeURIComponent(message)}`;
};

export function BookingRequestForm() {
  const [form, setForm] = useState<BookingFormState>(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const { showToast } = useToast();

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    if (feedback) {
      setFeedback(null);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      !form.eventDate ||
      !form.city.trim() ||
      !form.eventType ||
      !form.duration ||
      !form.venueHasSoundLight ||
      !form.contactWhatsapp.trim() ||
      !form.formationPreference
    ) {
      setFeedback({ type: 'error', message: 'Preencha os campos obrigatórios antes de enviar.' });
      return;
    }

    const whatsappDigits = form.contactWhatsapp.replace(/\D/g, '');
    if (whatsappDigits.length < 10) {
      setFeedback({ type: 'error', message: 'O WhatsApp precisa ter no mínimo 10 dígitos (DDD + número).' });
      return;
    }

    const eventDate = new Date(form.eventDate + 'T12:00:00');
    if (Number.isNaN(eventDate.getTime()) || eventDate < new Date()) {
      setFeedback({ type: 'error', message: 'A data do evento precisa ser no futuro.' });
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    const whatsappUrl = buildWhatsappUrl(form);

    if (supabase) {
      const { error } = await supabase.from('booking_requests').insert({
        event_date: form.eventDate,
        city: form.city.trim(),
        event_type: form.eventType,
        duration: form.duration,
        venue_has_sound_light: form.venueHasSoundLight === 'sim',
        contact_whatsapp: form.contactWhatsapp.trim(),
        formation_preference: form.formationPreference,
        notes: form.notes.trim() || null,
      });

      if (error) {
        reportError('[BookingRequestForm] Failed to save booking request before WhatsApp redirect.', error);
        showToast('error', 'Não foi possível salvar o pedido, mas você será redirecionado ao WhatsApp.');
      }
    }

    setForm(initialState);
    setIsSubmitting(false);
    window.location.assign(whatsappUrl);
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md sm:p-6 md:p-10">
      <div className="mb-6 flex items-start justify-between gap-4 md:mb-8">
        <div>
          <p className="font-label text-xs uppercase tracking-[0.22em] text-primary">Pedido de orçamento</p>
          <h3 className="mt-3 text-2xl font-headline font-bold sm:text-3xl">Peça seu orçamento</h3>
          <p className="mt-3 max-w-lg text-sm leading-6 text-on-surface-variant">
            Quanto mais preciso o contexto do evento, mais fácil fica indicar a formação ideal e o melhor formato de show.
          </p>
        </div>
        <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-primary md:flex">
          <MessageCircleMore size={20} />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
          <div>
            <label htmlFor="eventDate" className="block text-xs font-label text-on-surface-variant uppercase tracking-widest mb-2">Data</label>
            <input
              type="date"
              id="eventDate"
              name="eventDate"
              required
              value={form.eventDate}
              onChange={handleChange}
              className="w-full bg-surface-container-high/20 backdrop-blur-sm border border-white/10 rounded-lg px-4 py-3 text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
            />
          </div>
          <div>
            <label htmlFor="city" className="block text-xs font-label text-on-surface-variant uppercase tracking-widest mb-2">Cidade</label>
            <input
              type="text"
              id="city"
              name="city"
              required
              value={form.city}
              onChange={handleChange}
              className="w-full bg-surface-container-high/20 backdrop-blur-sm border border-white/10 rounded-lg px-4 py-3 text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              placeholder="Ex.: Itajubá, MG"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
          <div>
            <label htmlFor="eventType" className="block text-xs font-label text-on-surface-variant uppercase tracking-widest mb-2">Tipo de evento</label>
            <select
              id="eventType"
              name="eventType"
              required
              value={form.eventType}
              onChange={handleChange}
              className="w-full bg-surface-container-high/20 backdrop-blur-sm border border-white/10 rounded-lg px-4 py-3 text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors appearance-none"
            >
              <option value="" disabled className="bg-black">Selecione...</option>
              {eventTypes.map((eventType) => (
                <option key={eventType} value={eventType} className="bg-black">
                  {eventTypeLabels[eventType]}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="contactWhatsapp" className="block text-xs font-label text-on-surface-variant uppercase tracking-widest mb-2">Contato (WhatsApp)</label>
            <input
              type="text"
              id="contactWhatsapp"
              name="contactWhatsapp"
              required
              value={form.contactWhatsapp}
              onChange={handleChange}
              className="w-full bg-surface-container-high/20 backdrop-blur-sm border border-white/10 rounded-lg px-4 py-3 text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              placeholder="(35) 99999-9999"
            />
          </div>
        </div>

        <div>
          <label htmlFor="duration" className="block text-xs font-label text-on-surface-variant uppercase tracking-widest mb-2">Duração</label>
          <select
            id="duration"
            name="duration"
            required
            value={form.duration}
            onChange={handleChange}
            className="w-full bg-surface-container-high/20 backdrop-blur-sm border border-white/10 rounded-lg px-4 py-3 text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors appearance-none"
          >
            <option value="" disabled className="bg-black">Selecione a duração...</option>
            {durationOptions.map((option) => (
              <option key={option} value={option} className="bg-black">
                {option}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="venueHasSoundLight" className="block text-xs font-label text-on-surface-variant uppercase tracking-widest mb-2">O local possui som e iluminação?</label>
          <select
            id="venueHasSoundLight"
            name="venueHasSoundLight"
            required
            value={form.venueHasSoundLight}
            onChange={handleChange}
            className="w-full bg-surface-container-high/20 backdrop-blur-sm border border-white/10 rounded-lg px-4 py-3 text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors appearance-none"
          >
            <option value="" disabled className="bg-black">Selecione...</option>
            <option value="sim" className="bg-black">Sim</option>
            <option value="nao" className="bg-black">Não</option>
          </select>
        </div>

        <fieldset>
          <legend className="block text-xs font-label text-on-surface-variant uppercase tracking-widest mb-3">Preferência de formação</legend>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {formationOptions.map((option) => (
              <label key={option} className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/15 px-4 py-3 text-sm text-on-surface-variant transition-colors hover:border-primary/35">
                <input
                  type="radio"
                  name="formationPreference"
                  value={option}
                  checked={form.formationPreference === option}
                  onChange={handleChange}
                  className="accent-[var(--color-primary)]"
                />
                {option}
              </label>
            ))}
          </div>
        </fieldset>

        <div>
          <label htmlFor="notes" className="block text-xs font-label text-on-surface-variant uppercase tracking-widest mb-2">Observações</label>
          <textarea
            id="notes"
            name="notes"
            rows={4}
            value={form.notes}
            onChange={handleChange}
            className="w-full bg-surface-container-high/20 backdrop-blur-sm border border-white/10 rounded-lg px-4 py-3 text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors resize-none"
            placeholder="Passe mais contexto sobre o evento, horário ou estrutura..."
          />
        </div>

        <div className="flex flex-col gap-4 pt-2">
          <div className="min-h-6 text-sm leading-6">
            {feedback ? (
              <p className={feedback.type === 'success' ? 'text-primary' : 'text-rose-300'}>{feedback.message}</p>
            ) : null}
          </div>
          <div className="space-y-2 rounded-2xl border border-white/8 bg-black/15 px-4 py-4">
            {bookingTrustNotes.map((note) => (
              <p key={note} className="text-xs leading-5 text-on-surface-variant">
                {note}
              </p>
            ))}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary text-on-primary py-4 rounded-lg font-label uppercase tracking-widest text-sm hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(230,126,34,0.3)] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? <LoaderCircle size={18} className="animate-spin" /> : <Check size={18} />}
            {isSubmitting ? 'Abrindo WhatsApp...' : 'Enviar e abrir WhatsApp'}
          </button>
        </div>
      </form>
    </div>
  );
}