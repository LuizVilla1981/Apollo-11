import type { ChangeEvent, FormEvent } from 'react';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Check, ImagePlus, LoaderCircle, Play, UploadCloud, X } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { reportError } from '../utils/logger';
import { useToast } from './ui/Toast';

type PublicRecord = {
  id: string;
  created_at: string;
  event_date: string | null;
  city: string | null;
  venue: string | null;
  name: string | null;
  instagram: string | null;
  message: string | null;
  file_path: string;
  file_url: string;
  file_type: 'image' | 'video';
  mime_type: string | null;
  approved: boolean;
  consent_repost: boolean;
};

type UploadFormState = {
  eventDate: string;
  city: string;
  venue: string;
  name: string;
  instagram: string;
  message: string;
  consentRepost: boolean;
};

type UploadProgress = {
  completed: number;
  total: number;
};

const MAX_FILES = 5;
const IMAGE_MAX_SIZE = 10 * 1024 * 1024;
const VIDEO_MAX_SIZE = 50 * 1024 * 1024;
const ACCEPTED_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'video/mp4',
  'video/quicktime',
  'video/webm',
]);

const initialFormState: UploadFormState = {
  eventDate: '',
  city: '',
  venue: '',
  name: '',
  instagram: '',
  message: '',
  consentRepost: false,
};

const getFileKind = (file: File): 'image' | 'video' | null => {
  if (file.type.startsWith('image/')) return 'image';
  if (file.type.startsWith('video/')) return 'video';
  return null;
};

const sanitizeFileName = (fileName: string) => fileName.replace(/[^a-zA-Z0-9._-]/g, '-');

const formatRecordMeta = (record: PublicRecord) => {
  const parts = [record.city, record.venue].filter(Boolean);
  return parts.length > 0 ? parts.join(' • ') : 'Registro da comunidade';
};

const getFriendlyUploadErrorMessage = (message?: string) => {
  if (!message) {
    return 'Não foi possível enviar os registros agora. Tente novamente.';
  }

  if (message.includes('Bucket not found')) {
    return 'O bucket public-records ainda não existe no Supabase conectado. Execute o arquivo supabase/public_records.sql no SQL Editor para criar o bucket e as policies.';
  }

  return `Não foi possível enviar os registros: ${message}`;
};

const recordHighlights = ['foto', 'vídeo', 'registro criativo'] as const;

export function PublicRecordsSection() {
  const [form, setForm] = useState<UploadFormState>(initialFormState);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [records, setRecords] = useState<PublicRecord[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingRecords, setIsLoadingRecords] = useState(true);
  const [progress, setProgress] = useState<UploadProgress>({ completed: 0, total: 0 });
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<PublicRecord | null>(null);
  const [visibleCount, setVisibleCount] = useState(12);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { showToast } = useToast();

  const loadRecords = async () => {
    if (!supabase) {
      setFeedback({ type: 'error', message: 'Supabase não configurado. A galeria pública não pode ser carregada.' });
      setIsLoadingRecords(false);
      return;
    }

    setIsLoadingRecords(true);

    const { data, error } = await supabase
      .from('public_records')
      .select('*')
      .eq('approved', true)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      reportError('[PublicRecordsSection] Failed to load public records.', error);
      setFeedback({ type: 'error', message: 'Não foi possível carregar os registros do público agora.' });
      setIsLoadingRecords(false);
      return;
    }

    setRecords((data ?? []) as PublicRecord[]);
    setVisibleCount(12);
    setIsLoadingRecords(false);
  };

  useEffect(() => {
    void loadRecords();
  }, []);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = event.target;
    const checked = type === 'checkbox' ? (event.target as HTMLInputElement).checked : undefined;

    setForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (feedback) {
      setFeedback(null);
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextFiles = Array.from(event.target.files ?? []);
    setSelectedFiles(nextFiles);
    if (feedback) {
      setFeedback(null);
    }
  };

  const validateFiles = (files: File[]) => {
    if (files.length === 0) {
      return 'Selecione pelo menos um arquivo.';
    }

    if (files.length > MAX_FILES) {
      return `Você pode enviar no máximo ${MAX_FILES} arquivos por vez.`;
    }

    for (const file of files) {
      if (!ACCEPTED_TYPES.has(file.type)) {
        return `O arquivo ${file.name} não é suportado.`;
      }

      const fileKind = getFileKind(file);
      if (fileKind === 'image' && file.size > IMAGE_MAX_SIZE) {
        return `A imagem ${file.name} ultrapassa o limite de 10MB.`;
      }

      if (fileKind === 'video' && file.size > VIDEO_MAX_SIZE) {
        return `O vídeo ${file.name} ultrapassa o limite de 50MB.`;
      }
    }

    return null;
  };

  const resetForm = () => {
    setForm(initialFormState);
    setSelectedFiles([]);
    setProgress({ completed: 0, total: 0 });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.consentRepost) {
      setFeedback({ type: 'error', message: 'Você precisa autorizar o repost para enviar os registros.' });
      return;
    }

    if (!supabase) {
      setFeedback({ type: 'error', message: 'Supabase não configurado. Verifique as variáveis de ambiente.' });
      return;
    }

    const fileError = validateFiles(selectedFiles);
    if (fileError) {
      setFeedback({ type: 'error', message: fileError });
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);
    setProgress({ completed: 0, total: selectedFiles.length });

    const folder = new Date().toISOString().slice(0, 7);
    const results = await Promise.all(
      selectedFiles.map(async (file) => {
        const uniqueName = `${Date.now()}-${crypto.randomUUID()}-${sanitizeFileName(file.name)}`;
        const storagePath = `${folder}/${uniqueName}`;
        const filePath = `public-records/${storagePath}`;
        const fileKind = getFileKind(file);

        if (!fileKind) {
          return {
            success: false,
            fileName: file.name,
            reason: 'tipo-invalido',
            detail: 'Tipo de arquivo inválido.',
          } as const;
        }

        try {
          const { error: uploadError } = await supabase!.storage.from('public-records').upload(storagePath, file, {
            contentType: file.type,
            upsert: false,
          });

          if (uploadError) {
            reportError('[PublicRecordsSection] Failed to upload file.', uploadError);
            return {
              success: false,
              fileName: file.name,
              reason: 'upload',
              detail: uploadError.message,
            } as const;
          }

          const { data: publicUrlData } = supabase!.storage.from('public-records').getPublicUrl(storagePath);
          const { error: insertError } = await supabase!.from('public_records').insert({
            event_date: form.eventDate || null,
            city: form.city.trim() || null,
            venue: form.venue.trim() || null,
            name: form.name.trim() || null,
            instagram: form.instagram.trim() || null,
            message: form.message.trim() || null,
            file_path: filePath,
            file_url: publicUrlData.publicUrl,
            file_type: fileKind,
            mime_type: file.type || null,
            approved: true,
            consent_repost: form.consentRepost,
          });

          if (insertError) {
            reportError('[PublicRecordsSection] Failed to insert public record metadata.', insertError);
            return {
              success: false,
              fileName: file.name,
              reason: 'insert',
              detail: insertError.message,
            } as const;
          }

          return { success: true, fileName: file.name } as const;
        } catch (error) {
          reportError('[PublicRecordsSection] Unexpected upload error.', error);
          return {
            success: false,
            fileName: file.name,
            reason: 'unexpected',
            detail: error instanceof Error ? error.message : 'Erro inesperado.',
          } as const;
        } finally {
          setProgress((current) => ({ ...current, completed: current.completed + 1 }));
        }
      })
    );

    const successCount = results.filter((result) => result.success).length;
    const failureCount = results.length - successCount;

    setIsSubmitting(false);

    if (successCount > 0) {
      resetForm();
      await loadRecords();
      if (failureCount === 0) {
        showToast('success', 'Enviado! Valeu por compartilhar 👊');
      } else {
        showToast('error', `Parte dos arquivos foi enviada (${successCount}/${results.length}). Tente reenviar os que falharam.`);
      }
      return;
    }

    const firstFailure = results.find((result) => !result.success);
    showToast('error', getFriendlyUploadErrorMessage(firstFailure?.detail));
  };

  return (
    <section id="registros" className="relative overflow-hidden px-5 py-20 scroll-mt-24 md:px-6 md:py-28 md:scroll-mt-28 xl:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col items-center gap-5 text-center md:mb-14 md:gap-6">
          <div className="text-reading-surface flex flex-col items-center">
            <span className="font-label text-xs uppercase tracking-[0.2em] text-primary">Comunidade</span>
            <h2 className="mt-4 font-headline text-3xl font-bold sm:text-4xl md:text-5xl">Registros do Público</h2>
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.65, delay: 0.08 }}
              className="mt-4 inline-flex max-w-3xl flex-wrap items-center justify-center gap-2 rounded-[1.5rem] border border-primary/25 bg-[linear-gradient(90deg,rgba(230,126,34,0.14),rgba(255,255,255,0.04))] px-4 py-3 text-center text-xs text-on-surface-variant shadow-[0_0_24px_rgba(230,126,34,0.08)] sm:mt-5 sm:rounded-full sm:text-sm"
            >
              <span>Envie aqui seu registro do show, seja uma</span>
              {recordHighlights.map((item, index) => (
                <motion.span
                  key={item}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.4, delay: 0.2 + index * 0.12 }}
                  className="rounded-full border border-white/10 bg-black/20 px-3 py-1 font-label text-[11px] uppercase tracking-[0.22em] text-primary"
                >
                  {item}
                </motion.span>
              ))}
              <span>ou qualquer outro estilo que queira.</span>
            </motion.div>
          </div>
          <p className="max-w-3xl text-sm leading-7 text-on-surface-variant sm:text-base sm:leading-8">
            Foi no show? Envie sua foto ou vídeo e deixe esse momento registrado na galeria da comunidade.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.05fr_1.25fr] xl:gap-8">
          <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.07),rgba(255,255,255,0.025))] p-5 shadow-[0_28px_90px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:p-6 md:p-8">
            <div className="mb-6 flex items-start justify-between gap-4 md:mb-8">
              <div>
                <p className="font-label text-xs uppercase tracking-[0.22em] text-primary">Envio público</p>
                <h3 className="mt-3 font-headline text-2xl font-bold sm:text-3xl">Compartilhe seu olhar do show</h3>
                <p className="mt-3 max-w-xl text-sm leading-6 text-on-surface-variant">
                  Registros espontâneos ajudam a mostrar o que a noite realmente foi do ponto de vista de quem viveu o show.
                </p>
              </div>
              <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-primary md:flex">
                <ImagePlus size={20} />
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2">
                <div>
                  <label htmlFor="eventDate" className="mb-2 block text-xs font-label uppercase tracking-widest text-on-surface-variant">
                    Data do show
                  </label>
                  <input
                    id="eventDate"
                    name="eventDate"
                    type="date"
                    value={form.eventDate}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-on-surface outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label htmlFor="city" className="mb-2 block text-xs font-label uppercase tracking-widest text-on-surface-variant">
                    Cidade
                  </label>
                  <input
                    id="city"
                    name="city"
                    type="text"
                    value={form.city}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-on-surface outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
                    placeholder="Ex.: Itajubá, MG"
                  />
                </div>

                <div>
                  <label htmlFor="venue" className="mb-2 block text-xs font-label uppercase tracking-widest text-on-surface-variant">
                    Local / Evento
                  </label>
                  <input
                    id="venue"
                    name="venue"
                    type="text"
                    value={form.venue}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-on-surface outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
                    placeholder="Ex.: Festival de Inverno"
                  />
                </div>

                <div>
                  <label htmlFor="name" className="mb-2 block text-xs font-label uppercase tracking-widest text-on-surface-variant">
                    Seu nome
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-on-surface outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
                    placeholder="Como você quer aparecer"
                  />
                </div>

                <div>
                  <label htmlFor="instagram" className="mb-2 block text-xs font-label uppercase tracking-widest text-on-surface-variant">
                    @Instagram
                  </label>
                  <input
                    id="instagram"
                    name="instagram"
                    type="text"
                    value={form.instagram}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-on-surface outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
                    placeholder="@seuusuario"
                  />
                </div>

                <div>
                  <label htmlFor="files" className="mb-2 block text-xs font-label uppercase tracking-widest text-on-surface-variant">
                    Fotos e vídeos
                  </label>
                  <label className="flex min-h-[3.5rem] cursor-pointer items-center gap-3 rounded-xl border border-dashed border-primary/35 bg-white/[0.04] px-4 py-3 text-sm text-on-surface-variant transition-colors hover:border-primary hover:bg-white/[0.06]">
                    <UploadCloud size={18} className="shrink-0 text-primary" />
                    <span>
                      {selectedFiles.length > 0 ? `${selectedFiles.length} arquivo(s) selecionado(s)` : 'Selecione até 5 arquivos'}
                    </span>
                    <input
                      id="files"
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept=".jpg,.jpeg,.png,.webp,.mp4,.mov,.webm"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div>
                <label htmlFor="message" className="mb-2 block text-xs font-label uppercase tracking-widest text-on-surface-variant">
                  Mensagem
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={form.message}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-on-surface outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary resize-none"
                  placeholder="Conta como foi viver esse show do seu ponto de vista..."
                />
              </div>

              <div className="rounded-2xl border border-white/8 bg-black/20 px-4 py-4 text-sm leading-6 text-on-surface-variant">
                <p>Formatos aceitos: JPG, JPEG, PNG, WEBP, MP4, MOV e WEBM.</p>
                <p className="mt-2">Limites: até 10MB por imagem e 50MB por vídeo.</p>
              </div>

              <label className="flex items-start gap-3 rounded-xl border border-white/8 bg-white/[0.03] px-4 py-4 text-sm text-on-surface-variant">
                <input
                  name="consentRepost"
                  type="checkbox"
                  checked={form.consentRepost}
                  onChange={handleInputChange}
                  className="mt-1 accent-[var(--color-primary)]"
                />
                <span>Autorizo repostar esse conteúdo.</span>
              </label>

              <div className="flex flex-col gap-3 pt-1 sm:gap-4">
                <div className="min-h-6 text-sm leading-6">
                  {isSubmitting ? (
                    <p className="text-on-surface-variant">
                      Enviando {progress.completed}/{progress.total} arquivo(s)...
                    </p>
                  ) : feedback ? (
                    <p className={feedback.type === 'success' ? 'text-primary' : 'text-rose-300'}>{feedback.message}</p>
                  ) : (
                    <p className="text-on-surface-variant">Os registros aprovados aparecem automaticamente na galeria da comunidade abaixo.</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex min-h-12 w-full items-center justify-center gap-3 rounded-xl bg-primary-container px-6 py-4 text-center font-label text-sm font-bold uppercase tracking-[0.2em] text-on-primary-container transition-all hover:brightness-110 hover:shadow-[0_0_28px_rgba(230,126,34,0.28)] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? <LoaderCircle size={18} className="animate-spin" /> : <Check size={18} />}
                  {isSubmitting ? 'Enviando registros...' : 'Enviar registros'}
                </button>
              </div>
            </form>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-4 shadow-[0_28px_90px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:p-5 md:p-6">
            <div className="mb-5 flex items-end justify-between gap-3 md:mb-6 md:gap-4">
              <div>
                <p className="font-label text-xs uppercase tracking-[0.22em] text-primary">Galeria da comunidade</p>
                <h3 className="mt-3 font-headline text-xl font-bold sm:text-2xl md:text-3xl">Momentos enviados pelos fãs</h3>
              </div>
              <button
                type="button"
                onClick={() => void loadRecords()}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-[11px] font-label uppercase tracking-[0.18em] text-on-surface-variant transition-colors hover:border-primary/40 hover:text-primary sm:px-4 sm:text-xs sm:tracking-widest"
              >
                Atualizar
              </button>
            </div>

            {isLoadingRecords ? (
              <div className="flex min-h-[18rem] items-center justify-center rounded-[1.5rem] border border-white/8 bg-black/20 text-on-surface-variant">
                <LoaderCircle size={22} className="animate-spin" />
              </div>
            ) : records.length === 0 ? (
              <div className="flex min-h-[18rem] flex-col items-center justify-center rounded-[1.5rem] border border-white/8 bg-black/20 px-6 text-center text-on-surface-variant">
                <ImagePlus size={28} className="mb-4 text-primary" />
                <p className="font-headline text-xl font-bold text-on-surface">Ainda não há registros enviados.</p>
                <p className="mt-3 max-w-md text-sm leading-7">Seja a primeira pessoa a compartilhar um momento do show com a comunidade.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
                {records.slice(0, visibleCount).map((record) => (
                  <button
                    key={record.id}
                    type="button"
                    onClick={() => setSelectedRecord(record)}
                    className="group overflow-hidden rounded-[1.35rem] border border-white/10 bg-white/[0.03] text-left transition-all hover:border-primary/35 hover:shadow-[0_0_28px_rgba(230,126,34,0.12)]"
                  >
                    <div className="relative aspect-square overflow-hidden bg-black/30">
                      {record.file_type === 'image' ? (
                        <img
                          src={record.file_url}
                          alt={record.message || 'Registro do público'}
                          loading="lazy"
                          decoding="async"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                        />
                      ) : (
                        <div className="relative h-full w-full">
                          <video
                            src={`${record.file_url}#t=0.001`}
                            preload="metadata"
                            muted
                            playsInline
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                          />
                          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/40">
                            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-black/50 text-primary backdrop-blur-sm">
                              <Play size={22} fill="currentColor" className="ml-1" />
                            </div>
                            <p className="font-label text-[11px] uppercase tracking-[0.18em] text-on-surface-variant">Vídeo</p>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2 px-3 py-3 sm:px-4 sm:py-4">
                      <p className="line-clamp-2 text-xs leading-5 text-on-surface-variant sm:text-sm sm:leading-6">
                        {record.message || formatRecordMeta(record)}
                      </p>
                      <p className="text-[11px] font-label uppercase tracking-[0.22em] text-primary/90">
                        {record.instagram || record.name || formatRecordMeta(record)}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {!isLoadingRecords && records.length > visibleCount ? (
              <div className="mt-5 flex justify-center">
                <button
                  type="button"
                  onClick={() => setVisibleCount((current) => Math.min(current + 12, records.length))}
                  className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-xs font-label uppercase tracking-[0.18em] text-on-surface-variant transition-colors hover:border-primary/40 hover:text-primary"
                >
                  Carregar mais
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedRecord ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-[#020304]/88 backdrop-blur-xl"
            onClick={() => setSelectedRecord(null)}
          >
            <div className="flex h-full items-center justify-center p-3 sm:p-4 md:p-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 18 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: 18 }}
                transition={{ duration: 0.24, ease: 'easeOut' }}
                className="relative flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-[1.5rem] border border-white/10 bg-[linear-gradient(180deg,rgba(17,20,23,0.97),rgba(7,9,12,0.98))] shadow-[0_32px_120px_rgba(0,0,0,0.42)] sm:rounded-[2rem] md:max-h-[88vh]"
                onClick={(event) => event.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={() => setSelectedRecord(null)}
                  className="absolute right-3 top-3 z-10 rounded-full border border-white/10 bg-black/35 p-2.5 text-on-surface-variant transition-colors hover:border-primary/40 hover:text-primary sm:right-4 sm:top-4 sm:p-3"
                >
                  <X size={20} />
                </button>

                <div className="grid min-h-0 flex-1 grid-cols-1 md:grid-cols-[1.35fr_0.8fr]">
                  <div className="flex min-h-[14rem] items-center justify-center bg-black/25 p-3 sm:min-h-[18rem] sm:p-4 md:p-6">
                    {selectedRecord.file_type === 'image' ? (
                      <img
                        src={selectedRecord.file_url}
                        alt={selectedRecord.message || 'Registro ampliado do público'}
                        loading="lazy"
                        decoding="async"
                        className="max-h-[72vh] w-full rounded-[1.5rem] object-contain"
                      />
                    ) : (
                      <video
                        src={selectedRecord.file_url}
                        controls
                        preload="metadata"
                        className="max-h-[72vh] w-full rounded-[1.5rem] bg-black object-contain"
                      />
                    )}
                  </div>

                  <div className="overflow-y-auto border-t border-white/8 px-4 py-5 sm:px-6 sm:py-6 md:border-l md:border-t-0 md:px-7">
                    <p className="font-label text-xs uppercase tracking-[0.24em] text-primary">Registro do Público</p>
                    <h3 className="mt-3 font-headline text-xl font-bold sm:text-2xl">
                      {selectedRecord.name || selectedRecord.instagram || 'Fã da Apollo 11'}
                    </h3>
                    <p className="mt-4 text-sm leading-7 text-on-surface-variant">
                      {selectedRecord.message || 'Compartilhado com a comunidade da Apollo 11.'}
                    </p>

                    <div className="mt-6 space-y-3 text-sm text-on-surface-variant">
                      {selectedRecord.instagram ? <p>Instagram: {selectedRecord.instagram}</p> : null}
                      {selectedRecord.event_date ? <p>Data do show: {selectedRecord.event_date}</p> : null}
                      {selectedRecord.city ? <p>Cidade: {selectedRecord.city}</p> : null}
                      {selectedRecord.venue ? <p>Local / Evento: {selectedRecord.venue}</p> : null}
                      <p>Tipo: {selectedRecord.file_type === 'image' ? 'Foto' : 'Vídeo'}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}