import type { FormEvent } from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Calendar,
  CheckSquare,
  Eye,
  EyeOff,
  Instagram,
  LoaderCircle,
  LogOut,
  Music,
  Play,
  RefreshCw,
  Search,
  Square,
  Trash2,
  X,
} from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { reportError } from '../../utils/logger';
import type { Session } from '@supabase/supabase-js';

/* --- Types -------------------------------------------------- */

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

type BookingRequest = {
  id: string;
  created_at: string;
  event_date: string;
  city: string;
  event_type: string;
  duration: string;
  venue_has_sound_light: boolean;
  contact_whatsapp: string;
  formation_preference: string;
  notes: string | null;
  status: string;
};

type SongSuggestion = {
  id: string;
  created_at: string;
  song_name: string;
  artist: string;
  spotify_link: string | null;
  suggested_by: string | null;
  status: string;
};

type IgRequest = {
  id: string;
  created_at: string;
  request_type: string;
  message: string;
  name: string | null;
  status: string;
};

type RecordFilter = 'all' | 'pending' | 'approved';
type GenericFilter = 'all' | 'pending' | 'done';
type Tab = 'records' | 'bookings' | 'songs' | 'instagram';

/* --- Audit helper ------------------------------------------- */

async function logAction(
  email: string,
  action: string,
  targetTable: string,
  targetId: string,
  details?: Record<string, unknown>,
) {
  if (!supabase) return;
  await supabase.from('admin_audit_log').insert({
    user_email: email,
    action,
    target_table: targetTable,
    target_id: targetId,
    details: details ?? null,
  });
}

/* --- Login -------------------------------------------------- */

function AdminLogin({ onSession }: { onSession: (s: Session) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    setLoading(true);
    setError('');
    const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError || !data.session) {
      setError(authError?.message ?? 'Login falhou.');
      setLoading(false);
      return;
    }
    onSession(data.session);
  };

  if (!supabase) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface px-4">
        <p className="text-on-surface-variant">Supabase n\u00e3o configurado.</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-5 rounded-3xl border border-outline-variant/30 bg-surface-container p-8">
        <h1 className="text-center text-xl font-bold text-on-surface">Painel Admin</h1>
        {error && <p className="rounded-xl bg-rose-500/10 px-4 py-2 text-sm text-rose-400">{error}</p>}
        <label className="block space-y-1">
          <span className="text-sm text-on-surface-variant">Email</span>
          <input type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-xl border border-outline-variant/40 bg-surface px-4 py-2.5 text-on-surface outline-none transition focus:border-primary" />
        </label>
        <label className="block space-y-1">
          <span className="text-sm text-on-surface-variant">Senha</span>
          <input type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-xl border border-outline-variant/40 bg-surface px-4 py-2.5 text-on-surface outline-none transition focus:border-primary" />
        </label>
        <button type="submit" disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 font-semibold text-on-primary transition hover:brightness-110 disabled:opacity-60">
          {loading && <LoaderCircle size={16} className="animate-spin" />}
          Entrar
        </button>
      </form>
    </div>
  );
}

/* --- Confirm Dialog ----------------------------------------- */

function ConfirmDialog({ message, onConfirm, onCancel }: { message: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="w-full max-w-sm rounded-2xl border border-outline-variant/30 bg-surface-container p-6 space-y-4">
        <p className="text-on-surface">{message}</p>
        <div className="flex justify-end gap-3">
          <button type="button" onClick={onCancel} className="rounded-xl px-4 py-2 text-sm text-on-surface-variant transition hover:bg-surface-container-high">Cancelar</button>
          <button type="button" onClick={onConfirm} className="rounded-xl bg-rose-500/20 px-4 py-2 text-sm font-semibold text-rose-400 transition hover:bg-rose-500/30">Confirmar</button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* --- Lightbox ------------------------------------------------ */

function Lightbox({ record, onClose }: { record: PublicRecord; onClose: () => void }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md px-4" onClick={onClose}>
      <button type="button" onClick={onClose} className="absolute top-4 right-4 z-10 rounded-full bg-black/50 p-2 text-white/80 transition hover:text-white"><X size={24} /></button>
      <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="max-h-[90vh] max-w-[90vw] overflow-hidden rounded-2xl" onClick={(e) => e.stopPropagation()}>
        {record.file_type === 'video' ? (
          <video src={record.file_url} className="max-h-[90vh] max-w-[90vw] rounded-2xl" controls autoPlay playsInline />
        ) : (
          <img src={record.file_url} alt={record.name ?? 'Registro'} className="max-h-[90vh] max-w-[90vw] rounded-2xl object-contain" />
        )}
      </motion.div>
    </motion.div>
  );
}

/* --- Record Card -------------------------------------------- */

function RecordCard({ record, selected, onToggleSelect, onToggleApproval, onDelete, onOpen, busy }: {
  record: PublicRecord; selected: boolean; onToggleSelect: (id: string) => void;
  onToggleApproval: (r: PublicRecord) => void; onDelete: (r: PublicRecord) => void;
  onOpen: (r: PublicRecord) => void; busy: boolean;
}) {
  const meta = [record.city, record.venue].filter(Boolean).join(' \u2022 ');
  const date = record.event_date ? new Date(record.event_date + 'T12:00:00').toLocaleDateString('pt-BR') : null;

  return (
    <motion.div layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
      className={`group relative overflow-hidden rounded-2xl border bg-surface-container transition-colors ${selected ? 'border-primary/60 ring-1 ring-primary/30' : 'border-outline-variant/20'}`}>
      <button type="button" onClick={() => onToggleSelect(record.id)} className="absolute top-2 right-2 z-10 rounded-lg bg-black/40 p-1 text-white/80 transition hover:text-white">
        {selected ? <CheckSquare size={16} /> : <Square size={16} />}
      </button>
      <button type="button" className="relative aspect-square w-full overflow-hidden bg-black" onClick={() => onOpen(record)}>
        {record.file_type === 'video' ? (
          <video src={record.file_url} className="h-full w-full object-cover" muted playsInline preload="metadata" />
        ) : (
          <img src={record.file_url} alt={record.name ?? 'Registro'} className="h-full w-full object-cover" loading="lazy" />
        )}
        {record.file_type === 'video' && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none"><Play size={32} className="text-white/70" fill="currentColor" /></div>
        )}
        <span className={`absolute top-2 left-2 rounded-full px-2.5 py-0.5 text-xs font-semibold ${record.approved ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
          {record.approved ? 'Aprovado' : 'Pendente'}
        </span>
        {record.consent_repost && <span className="absolute bottom-2 left-2 rounded-full bg-blue-500/20 px-2.5 py-0.5 text-xs font-semibold text-blue-400">Repost OK</span>}
      </button>
      <div className="space-y-1 p-3">
        {record.name && (
          <p className="text-sm font-semibold text-on-surface truncate">
            {record.name}{record.instagram && <span className="ml-1 font-normal text-on-surface-variant">@{record.instagram.replace(/^@/, '')}</span>}
          </p>
        )}
        {meta && <p className="text-xs text-on-surface-variant truncate">{meta}</p>}
        {date && <p className="text-xs text-on-surface-variant">{date}</p>}
        {record.message && <p className="text-xs text-on-surface-variant/80 line-clamp-2">{record.message}</p>}
        <p className="text-[10px] text-on-surface-variant/50">{new Date(record.created_at).toLocaleString('pt-BR')}</p>
      </div>
      <div className="flex border-t border-outline-variant/20">
        <button type="button" onClick={() => onToggleApproval(record)} disabled={busy} className="flex flex-1 items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition hover:bg-surface-container-high disabled:opacity-40">
          {record.approved ? (<><EyeOff size={14} className="text-amber-400" /><span className="text-amber-400">Reprovar</span></>) : (<><Eye size={14} className="text-emerald-400" /><span className="text-emerald-400">Aprovar</span></>)}
        </button>
        <div className="w-px bg-outline-variant/20" />
        <button type="button" onClick={() => onDelete(record)} disabled={busy} className="flex flex-1 items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-rose-400 transition hover:bg-rose-500/10 disabled:opacity-40">
          <Trash2 size={14} />Deletar
        </button>
      </div>
    </motion.div>
  );
}

/* --- Status Pill -------------------------------------------- */

function StatusPill({ status }: { status: string }) {
  const map: Record<string, { bg: string; text: string; label: string }> = {
    pending: { bg: 'bg-amber-500/20', text: 'text-amber-400', label: 'Pendente' },
    responded: { bg: 'bg-blue-500/20', text: 'text-blue-400', label: 'Respondido' },
    closed: { bg: 'bg-zinc-500/20', text: 'text-zinc-400', label: 'Fechado' },
    added: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', label: 'Adicionada' },
    done: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', label: 'Conclu\u00eddo' },
  };
  const s = map[status] ?? map.pending;
  return <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${s.bg} ${s.text}`}>{s.label}</span>;
}

/* --- Tab: Records ------------------------------------------- */

function RecordsTab({ session }: { session: Session }) {
  const [records, setRecords] = useState<PublicRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [filter, setFilter] = useState<RecordFilter>('all');
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [deleteTarget, setDeleteTarget] = useState<PublicRecord | null>(null);
  const [batchDeleteConfirm, setBatchDeleteConfirm] = useState(false);
  const [lightboxRecord, setLightboxRecord] = useState<PublicRecord | null>(null);

  const loadRecords = useCallback(async () => {
    if (!supabase) return;
    setLoading(true);
    const { data, error } = await supabase.from('public_records').select('*').order('created_at', { ascending: false });
    if (error) reportError('[AdminPanel] Failed to load records.', error);
    setRecords((data ?? []) as PublicRecord[]);
    setSelectedIds(new Set());
    setLoading(false);
  }, []);

  useEffect(() => { void loadRecords(); }, [loadRecords]);

  const filtered = useMemo(() => {
    let result = records;
    if (filter === 'pending') result = result.filter((r) => !r.approved);
    if (filter === 'approved') result = result.filter((r) => r.approved);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((r) =>
        r.name?.toLowerCase().includes(q) || r.city?.toLowerCase().includes(q) ||
        r.venue?.toLowerCase().includes(q) || r.instagram?.toLowerCase().includes(q) ||
        r.message?.toLowerCase().includes(q),
      );
    }
    return result;
  }, [records, filter, search]);

  const counts = useMemo(() => ({
    all: records.length,
    pending: records.filter((r) => !r.approved).length,
    approved: records.filter((r) => r.approved).length,
  }), [records]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next; });
  };
  const selectAll = () => {
    setSelectedIds(selectedIds.size === filtered.length ? new Set() : new Set(filtered.map((r) => r.id)));
  };

  const toggleApproval = async (record: PublicRecord) => {
    if (!supabase) return;
    setBusy(true);
    const { error } = await supabase.from('public_records').update({ approved: !record.approved }).eq('id', record.id);
    if (!error) {
      setRecords((prev) => prev.map((r) => (r.id === record.id ? { ...r, approved: !r.approved } : r)));
      await logAction(session.user.email ?? '', record.approved ? 'unapprove' : 'approve', 'public_records', record.id);
    }
    setBusy(false);
  };

  const batchApprove = async (approve: boolean) => {
    if (!supabase || selectedIds.size === 0) return;
    setBusy(true);
    const ids = Array.from(selectedIds);
    const { error } = await supabase.from('public_records').update({ approved: approve }).in('id', ids);
    if (!error) {
      setRecords((prev) => prev.map((r) => (selectedIds.has(r.id) ? { ...r, approved: approve } : r)));
      for (const id of ids) await logAction(session.user.email ?? '', approve ? 'batch_approve' : 'batch_unapprove', 'public_records', id);
      setSelectedIds(new Set());
    }
    setBusy(false);
  };

  const confirmDelete = async () => {
    if (!supabase || !deleteTarget) return;
    setBusy(true);
    await supabase.storage.from('public-records').remove([deleteTarget.file_path]);
    const { error } = await supabase.from('public_records').delete().eq('id', deleteTarget.id);
    if (!error) {
      setRecords((prev) => prev.filter((r) => r.id !== deleteTarget.id));
      await logAction(session.user.email ?? '', 'delete', 'public_records', deleteTarget.id, { name: deleteTarget.name, file_path: deleteTarget.file_path });
    }
    setDeleteTarget(null);
    setBusy(false);
  };

  const confirmBatchDelete = async () => {
    if (!supabase || selectedIds.size === 0) return;
    setBusy(true);
    const toDelete = records.filter((r) => selectedIds.has(r.id));
    await supabase.storage.from('public-records').remove(toDelete.map((r) => r.file_path));
    const { error } = await supabase.from('public_records').delete().in('id', Array.from(selectedIds));
    if (!error) {
      setRecords((prev) => prev.filter((r) => !selectedIds.has(r.id)));
      for (const r of toDelete) await logAction(session.user.email ?? '', 'batch_delete', 'public_records', r.id, { name: r.name });
      setSelectedIds(new Set());
    }
    setBatchDeleteConfirm(false);
    setBusy(false);
  };

  return (
    <>
      <div className="space-y-3">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/60" />
          <input type="text" placeholder="Buscar por nome, cidade, @instagram..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-outline-variant/30 bg-surface pl-10 pr-4 py-2.5 text-sm text-on-surface outline-none transition focus:border-primary" />
          {search && <button type="button" onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant/60 hover:text-on-surface"><X size={14} /></button>}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {(['all', 'pending', 'approved'] as RecordFilter[]).map((f) => {
            const labels: Record<RecordFilter, string> = { all: 'Todos', pending: 'Pendentes', approved: 'Aprovados' };
            return (
              <button key={f} type="button" onClick={() => setFilter(f)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${filter === f ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface'}`}>
                {labels[f]} <span className="opacity-70">({counts[f]})</span>
              </button>
            );
          })}
          <div className="ml-auto flex flex-wrap items-center gap-2">
            {selectedIds.size > 0 && (
              <>
                <span className="text-xs text-on-surface-variant">{selectedIds.size} selecionado{selectedIds.size > 1 ? 's' : ''}</span>
                <button type="button" onClick={() => batchApprove(true)} disabled={busy} className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-medium text-emerald-400 transition hover:bg-emerald-500/25 disabled:opacity-40">Aprovar</button>
                <button type="button" onClick={() => batchApprove(false)} disabled={busy} className="rounded-full bg-amber-500/15 px-3 py-1 text-xs font-medium text-amber-400 transition hover:bg-amber-500/25 disabled:opacity-40">Reprovar</button>
                <button type="button" onClick={() => setBatchDeleteConfirm(true)} disabled={busy} className="rounded-full bg-rose-500/15 px-3 py-1 text-xs font-medium text-rose-400 transition hover:bg-rose-500/25 disabled:opacity-40">Deletar</button>
              </>
            )}
            <button type="button" onClick={selectAll} className="rounded-full bg-surface-container-high px-3 py-1.5 text-xs text-on-surface-variant transition hover:text-on-surface">
              {selectedIds.size === filtered.length && filtered.length > 0 ? 'Desmarcar todos' : 'Selecionar todos'}
            </button>
            <button type="button" onClick={() => void loadRecords()} disabled={loading} className="flex items-center gap-1.5 rounded-full bg-surface-container-high px-3 py-1.5 text-xs text-on-surface-variant transition hover:text-on-surface disabled:opacity-40">
              <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />Atualizar
            </button>
          </div>
        </div>
      </div>
      <div className="mt-5">
        {loading ? (
          <div className="flex items-center justify-center py-20"><LoaderCircle size={28} className="animate-spin text-primary" /></div>
        ) : filtered.length === 0 ? (
          <p className="py-20 text-center text-on-surface-variant">Nenhum registro encontrado.</p>
        ) : (
          <motion.div layout className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            <AnimatePresence mode="popLayout">
              {filtered.map((record) => (
                <RecordCard key={record.id} record={record} selected={selectedIds.has(record.id)} onToggleSelect={toggleSelect} onToggleApproval={toggleApproval} onDelete={setDeleteTarget} onOpen={setLightboxRecord} busy={busy} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
      <AnimatePresence>
        {deleteTarget && <ConfirmDialog message={`Deletar permanentemente este registro${deleteTarget.name ? ` de ${deleteTarget.name}` : ''}?`} onConfirm={confirmDelete} onCancel={() => setDeleteTarget(null)} />}
        {batchDeleteConfirm && <ConfirmDialog message={`Deletar permanentemente ${selectedIds.size} registro${selectedIds.size > 1 ? 's' : ''}?`} onConfirm={confirmBatchDelete} onCancel={() => setBatchDeleteConfirm(false)} />}
        {lightboxRecord && <Lightbox record={lightboxRecord} onClose={() => setLightboxRecord(null)} />}
      </AnimatePresence>
    </>
  );
}

/* --- Tab: Bookings ------------------------------------------ */

function BookingsTab({ session }: { session: Session }) {
  const [rows, setRows] = useState<BookingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [filter, setFilter] = useState<GenericFilter>('all');
  const [deleteTarget, setDeleteTarget] = useState<BookingRequest | null>(null);

  const load = useCallback(async () => {
    if (!supabase) return;
    setLoading(true);
    const { data, error } = await supabase.from('booking_requests').select('*').order('created_at', { ascending: false });
    if (error) reportError('[Admin] Failed to load bookings.', error);
    setRows((data ?? []) as BookingRequest[]);
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  const updateStatus = async (row: BookingRequest, status: string) => {
    if (!supabase) return;
    setBusy(true);
    const { error } = await supabase.from('booking_requests').update({ status }).eq('id', row.id);
    if (!error) {
      setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, status } : r)));
      await logAction(session.user.email ?? '', `status_${status}`, 'booking_requests', row.id);
    }
    setBusy(false);
  };

  const confirmDelete = async () => {
    if (!supabase || !deleteTarget) return;
    setBusy(true);
    const { error } = await supabase.from('booking_requests').delete().eq('id', deleteTarget.id);
    if (!error) {
      setRows((prev) => prev.filter((r) => r.id !== deleteTarget.id));
      await logAction(session.user.email ?? '', 'delete', 'booking_requests', deleteTarget.id);
    }
    setDeleteTarget(null);
    setBusy(false);
  };

  const filtered = useMemo(() => {
    if (filter === 'pending') return rows.filter((r) => r.status === 'pending');
    if (filter === 'done') return rows.filter((r) => r.status !== 'pending');
    return rows;
  }, [rows, filter]);

  const pendingCount = rows.filter((r) => r.status === 'pending').length;

  return (
    <>
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {(['all', 'pending', 'done'] as GenericFilter[]).map((f) => {
          const labels: Record<GenericFilter, string> = { all: 'Todos', pending: 'Pendentes', done: 'Respondidos' };
          return (
            <button key={f} type="button" onClick={() => setFilter(f)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${filter === f ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface'}`}>
              {labels[f]}{f === 'pending' && pendingCount > 0 && <span className="ml-1 opacity-70">({pendingCount})</span>}
            </button>
          );
        })}
        <button type="button" onClick={() => void load()} disabled={loading} className="ml-auto flex items-center gap-1.5 rounded-full bg-surface-container-high px-3 py-1.5 text-xs text-on-surface-variant transition hover:text-on-surface disabled:opacity-40">
          <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>
      {loading ? (
        <div className="flex items-center justify-center py-20"><LoaderCircle size={28} className="animate-spin text-primary" /></div>
      ) : filtered.length === 0 ? (
        <p className="py-20 text-center text-on-surface-variant">Nenhuma solicita\u00e7\u00e3o.</p>
      ) : (
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((row) => (
              <motion.div key={row.id} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }}
                className="rounded-2xl border border-outline-variant/20 bg-surface-container p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-on-surface">{row.city}</span>
                      <StatusPill status={row.status} />
                    </div>
                    <p className="text-sm text-on-surface-variant">{row.event_type} \u2022 {row.duration} \u2022 {new Date(row.event_date + 'T12:00:00').toLocaleDateString('pt-BR')}</p>
                    <p className="text-sm text-on-surface-variant">Forma\u00e7\u00e3o: {row.formation_preference} \u2022 Som/Luz: {row.venue_has_sound_light ? 'Sim' : 'N\u00e3o'}</p>
                    <p className="text-sm text-on-surface">WhatsApp: <a href={`https://wa.me/${row.contact_whatsapp.replace(/\\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-primary underline">{row.contact_whatsapp}</a></p>
                    {row.notes && <p className="text-xs text-on-surface-variant/80 mt-1">{row.notes}</p>}
                    <p className="text-[10px] text-on-surface-variant/50">{new Date(row.created_at).toLocaleString('pt-BR')}</p>
                  </div>
                  <div className="flex gap-1.5 shrink-0">
                    {row.status === 'pending' && <button type="button" onClick={() => updateStatus(row, 'responded')} disabled={busy} className="rounded-lg bg-blue-500/15 px-3 py-1.5 text-xs font-medium text-blue-400 transition hover:bg-blue-500/25 disabled:opacity-40">Respondido</button>}
                    {row.status !== 'closed' && <button type="button" onClick={() => updateStatus(row, 'closed')} disabled={busy} className="rounded-lg bg-zinc-500/15 px-3 py-1.5 text-xs font-medium text-zinc-400 transition hover:bg-zinc-500/25 disabled:opacity-40">Fechar</button>}
                    <button type="button" onClick={() => setDeleteTarget(row)} disabled={busy} className="rounded-lg bg-rose-500/15 p-1.5 text-rose-400 transition hover:bg-rose-500/25 disabled:opacity-40"><Trash2 size={14} /></button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
      <AnimatePresence>
        {deleteTarget && <ConfirmDialog message="Deletar esta solicita\u00e7\u00e3o de show?" onConfirm={confirmDelete} onCancel={() => setDeleteTarget(null)} />}
      </AnimatePresence>
    </>
  );
}

/* --- Tab: Songs --------------------------------------------- */

function SongsTab({ session }: { session: Session }) {
  const [rows, setRows] = useState<SongSuggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [filter, setFilter] = useState<GenericFilter>('all');
  const [deleteTarget, setDeleteTarget] = useState<SongSuggestion | null>(null);

  const load = useCallback(async () => {
    if (!supabase) return;
    setLoading(true);
    const { data, error } = await supabase.from('song_suggestions').select('*').order('created_at', { ascending: false });
    if (error) reportError('[Admin] Failed to load songs.', error);
    setRows((data ?? []) as SongSuggestion[]);
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  const toggleAdded = async (row: SongSuggestion) => {
    if (!supabase) return;
    setBusy(true);
    const next = row.status === 'added' ? 'pending' : 'added';
    const { error } = await supabase.from('song_suggestions').update({ status: next }).eq('id', row.id);
    if (!error) {
      setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, status: next } : r)));
      await logAction(session.user.email ?? '', `status_${next}`, 'song_suggestions', row.id);
    }
    setBusy(false);
  };

  const confirmDelete = async () => {
    if (!supabase || !deleteTarget) return;
    setBusy(true);
    const { error } = await supabase.from('song_suggestions').delete().eq('id', deleteTarget.id);
    if (!error) {
      setRows((prev) => prev.filter((r) => r.id !== deleteTarget.id));
      await logAction(session.user.email ?? '', 'delete', 'song_suggestions', deleteTarget.id);
    }
    setDeleteTarget(null);
    setBusy(false);
  };

  const filtered = useMemo(() => {
    if (filter === 'pending') return rows.filter((r) => r.status !== 'added');
    if (filter === 'done') return rows.filter((r) => r.status === 'added');
    return rows;
  }, [rows, filter]);

  const pendingCount = rows.filter((r) => r.status !== 'added').length;

  return (
    <>
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {(['all', 'pending', 'done'] as GenericFilter[]).map((f) => {
          const labels: Record<GenericFilter, string> = { all: 'Todas', pending: 'Pendentes', done: 'Adicionadas' };
          return (
            <button key={f} type="button" onClick={() => setFilter(f)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${filter === f ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface'}`}>
              {labels[f]}{f === 'pending' && pendingCount > 0 && <span className="ml-1 opacity-70">({pendingCount})</span>}
            </button>
          );
        })}
        <button type="button" onClick={() => void load()} disabled={loading} className="ml-auto flex items-center gap-1.5 rounded-full bg-surface-container-high px-3 py-1.5 text-xs text-on-surface-variant transition hover:text-on-surface disabled:opacity-40">
          <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>
      {loading ? (
        <div className="flex items-center justify-center py-20"><LoaderCircle size={28} className="animate-spin text-primary" /></div>
      ) : filtered.length === 0 ? (
        <p className="py-20 text-center text-on-surface-variant">Nenhuma sugest\u00e3o.</p>
      ) : (
        <div className="space-y-2">
          <AnimatePresence mode="popLayout">
            {filtered.map((row) => (
              <motion.div key={row.id} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }}
                className="flex items-center gap-3 rounded-2xl border border-outline-variant/20 bg-surface-container px-4 py-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-on-surface truncate">{row.song_name}</span>
                    <span className="text-sm text-on-surface-variant">\u2014 {row.artist}</span>
                    <StatusPill status={row.status} />
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs text-on-surface-variant/70">
                    {row.suggested_by && <span>por {row.suggested_by}</span>}
                    {row.spotify_link && <a href={row.spotify_link} target="_blank" rel="noopener noreferrer" className="text-emerald-400 underline">Spotify</a>}
                    <span>{new Date(row.created_at).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>
                <div className="flex gap-1.5 shrink-0">
                  <button type="button" onClick={() => toggleAdded(row)} disabled={busy}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition disabled:opacity-40 ${row.status === 'added' ? 'bg-amber-500/15 text-amber-400 hover:bg-amber-500/25' : 'bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25'}`}>
                    {row.status === 'added' ? 'Remover' : 'Adicionada'}
                  </button>
                  <button type="button" onClick={() => setDeleteTarget(row)} disabled={busy} className="rounded-lg bg-rose-500/15 p-1.5 text-rose-400 transition hover:bg-rose-500/25 disabled:opacity-40"><Trash2 size={14} /></button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
      <AnimatePresence>
        {deleteTarget && <ConfirmDialog message={`Deletar "${deleteTarget.song_name}"?`} onConfirm={confirmDelete} onCancel={() => setDeleteTarget(null)} />}
      </AnimatePresence>
    </>
  );
}

/* --- Tab: Instagram ----------------------------------------- */

function InstagramTab({ session }: { session: Session }) {
  const [rows, setRows] = useState<IgRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [filter, setFilter] = useState<GenericFilter>('all');
  const [deleteTarget, setDeleteTarget] = useState<IgRequest | null>(null);

  const load = useCallback(async () => {
    if (!supabase) return;
    setLoading(true);
    const { data, error } = await supabase.from('ig_requests').select('*').order('created_at', { ascending: false });
    if (error) reportError('[Admin] Failed to load ig_requests.', error);
    setRows((data ?? []) as IgRequest[]);
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  const toggleDone = async (row: IgRequest) => {
    if (!supabase) return;
    setBusy(true);
    const next = row.status === 'done' ? 'pending' : 'done';
    const { error } = await supabase.from('ig_requests').update({ status: next }).eq('id', row.id);
    if (!error) {
      setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, status: next } : r)));
      await logAction(session.user.email ?? '', `status_${next}`, 'ig_requests', row.id);
    }
    setBusy(false);
  };

  const confirmDelete = async () => {
    if (!supabase || !deleteTarget) return;
    setBusy(true);
    const { error } = await supabase.from('ig_requests').delete().eq('id', deleteTarget.id);
    if (!error) {
      setRows((prev) => prev.filter((r) => r.id !== deleteTarget.id));
      await logAction(session.user.email ?? '', 'delete', 'ig_requests', deleteTarget.id);
    }
    setDeleteTarget(null);
    setBusy(false);
  };

  const filtered = useMemo(() => {
    if (filter === 'pending') return rows.filter((r) => r.status !== 'done');
    if (filter === 'done') return rows.filter((r) => r.status === 'done');
    return rows;
  }, [rows, filter]);

  const pendingCount = rows.filter((r) => r.status !== 'done').length;

  return (
    <>
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {(['all', 'pending', 'done'] as GenericFilter[]).map((f) => {
          const labels: Record<GenericFilter, string> = { all: 'Todos', pending: 'Pendentes', done: 'Conclu\u00eddos' };
          return (
            <button key={f} type="button" onClick={() => setFilter(f)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${filter === f ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface'}`}>
              {labels[f]}{f === 'pending' && pendingCount > 0 && <span className="ml-1 opacity-70">({pendingCount})</span>}
            </button>
          );
        })}
        <button type="button" onClick={() => void load()} disabled={loading} className="ml-auto flex items-center gap-1.5 rounded-full bg-surface-container-high px-3 py-1.5 text-xs text-on-surface-variant transition hover:text-on-surface disabled:opacity-40">
          <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>
      {loading ? (
        <div className="flex items-center justify-center py-20"><LoaderCircle size={28} className="animate-spin text-primary" /></div>
      ) : filtered.length === 0 ? (
        <p className="py-20 text-center text-on-surface-variant">Nenhum pedido do Instagram.</p>
      ) : (
        <div className="space-y-2">
          <AnimatePresence mode="popLayout">
            {filtered.map((row) => (
              <motion.div key={row.id} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }}
                className="flex items-start gap-3 rounded-2xl border border-outline-variant/20 bg-surface-container px-4 py-3">
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs rounded-full bg-surface-container-high px-2.5 py-0.5 text-on-surface-variant">{row.request_type}</span>
                    <StatusPill status={row.status} />
                  </div>
                  <p className="text-sm text-on-surface">{row.message}</p>
                  <div className="flex items-center gap-3 text-[10px] text-on-surface-variant/60">
                    {row.name && <span>{row.name}</span>}
                    <span>{new Date(row.created_at).toLocaleString('pt-BR')}</span>
                  </div>
                </div>
                <div className="flex gap-1.5 shrink-0">
                  <button type="button" onClick={() => toggleDone(row)} disabled={busy}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition disabled:opacity-40 ${row.status === 'done' ? 'bg-amber-500/15 text-amber-400 hover:bg-amber-500/25' : 'bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25'}`}>
                    {row.status === 'done' ? 'Reabrir' : 'Concluir'}
                  </button>
                  <button type="button" onClick={() => setDeleteTarget(row)} disabled={busy} className="rounded-lg bg-rose-500/15 p-1.5 text-rose-400 transition hover:bg-rose-500/25 disabled:opacity-40"><Trash2 size={14} /></button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
      <AnimatePresence>
        {deleteTarget && <ConfirmDialog message="Deletar este pedido do Instagram?" onConfirm={confirmDelete} onCancel={() => setDeleteTarget(null)} />}
      </AnimatePresence>
    </>
  );
}

/* --- Dashboard ---------------------------------------------- */

const TAB_CONFIG: { key: Tab; label: string; icon: typeof Calendar }[] = [
  { key: 'records', label: 'Registros', icon: Eye },
  { key: 'bookings', label: 'Shows', icon: Calendar },
  { key: 'songs', label: 'M\u00fasicas', icon: Music },
  { key: 'instagram', label: 'Instagram', icon: Instagram },
];

function AdminDashboard({ session }: { session: Session }) {
  const [tab, setTab] = useState<Tab>('records');
  const [pendingCounts, setPendingCounts] = useState({ records: 0, bookings: 0, songs: 0, instagram: 0 });

  useEffect(() => {
    if (!supabase) return;
    const sb = supabase;
    const loadCounts = async () => {
      const [r1, r2, r3, r4] = await Promise.all([
        sb.from('public_records').select('id', { count: 'exact', head: true }).eq('approved', false),
        sb.from('booking_requests').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
        sb.from('song_suggestions').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
        sb.from('ig_requests').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
      ]);
      setPendingCounts({ records: r1.count ?? 0, bookings: r2.count ?? 0, songs: r3.count ?? 0, instagram: r4.count ?? 0 });
    };
    void loadCounts();
    const interval = setInterval(loadCounts, 30_000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => { await supabase?.auth.signOut(); window.location.reload(); };
  const totalPending = pendingCounts.records + pendingCounts.bookings + pendingCounts.songs + pendingCounts.instagram;

  return (
    <div className="min-h-screen bg-surface">
      <header className="sticky top-0 z-30 border-b border-outline-variant/20 bg-surface-container/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <a href="/" className="text-sm text-on-surface-variant transition hover:text-on-surface">{'\u2190'} Voltar</a>
            <span className="text-on-surface-variant/30">|</span>
            <h1 className="text-sm font-bold text-on-surface sm:text-base">Painel Admin</h1>
            {totalPending > 0 && <span className="rounded-full bg-amber-500/20 px-2.5 py-0.5 text-xs font-semibold text-amber-400">{totalPending} pendente{totalPending > 1 ? 's' : ''}</span>}
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-on-surface-variant sm:inline">{session.user.email}</span>
            <button type="button" onClick={handleLogout} className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs text-on-surface-variant transition hover:bg-surface-container-high hover:text-on-surface">
              <LogOut size={14} />Sair
            </button>
          </div>
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <nav className="flex gap-1 -mb-px overflow-x-auto">
            {TAB_CONFIG.map(({ key, label, icon: Icon }) => {
              const count = pendingCounts[key];
              return (
                <button key={key} type="button" onClick={() => setTab(key)}
                  className={`flex items-center gap-1.5 whitespace-nowrap border-b-2 px-4 py-2.5 text-sm font-medium transition ${tab === key ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-on-surface'}`}>
                  <Icon size={15} />{label}
                  {count > 0 && <span className="ml-1 min-w-[1.25rem] rounded-full bg-amber-500/20 px-1.5 py-0.5 text-center text-[10px] font-bold text-amber-400">{count}</span>}
                </button>
              );
            })}
          </nav>
        </div>
      </header>
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        {tab === 'records' && <RecordsTab session={session} />}
        {tab === 'bookings' && <BookingsTab session={session} />}
        {tab === 'songs' && <SongsTab session={session} />}
        {tab === 'instagram' && <InstagramTab session={session} />}
      </div>
    </div>
  );
}

/* --- Root --------------------------------------------------- */

export default function AdminPanel() {
  const [session, setSession] = useState<Session | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!supabase) { setChecking(false); return; }
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setChecking(false); });
  }, []);

  if (checking) {
    return <div className="flex min-h-screen items-center justify-center bg-surface"><LoaderCircle size={28} className="animate-spin text-primary" /></div>;
  }
  if (!session) return <AdminLogin onSession={setSession} />;
  return <AdminDashboard session={session} />;
}
