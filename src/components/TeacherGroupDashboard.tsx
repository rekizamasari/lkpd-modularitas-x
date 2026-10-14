import React, { useState } from 'react';
import { GroupSubmission } from '../types/lkpd';
import {
  Users,
  RotateCcw,
  Trash2,
  Award,
  CheckCircle2,
  Clock,
  Printer,
  Eye,
  Plus,
  AlertTriangle,
  KeyRound,
  Search,
  Cloud,
  CheckCircle,
  Radio,
} from 'lucide-react';

interface TeacherGroupDashboardProps {
  groups: GroupSubmission[];
  activeGroupId: string;
  isCloudConnected?: boolean;
  onSelectGroup: (groupId: string) => void;
  onResetGroupWork: (groupId: string) => void;
  onDeleteGroup: (groupId: string) => void;
  onAddNewGroup: () => void;
  onPrintGroup: (group: GroupSubmission) => void;
  onLoadSampleGroups?: () => void;
  onOpenChangePin?: () => void;
}

export const TeacherGroupDashboard: React.FC<TeacherGroupDashboardProps> = ({
  groups,
  activeGroupId,
  isCloudConnected = true,
  onSelectGroup,
  onResetGroupWork,
  onDeleteGroup,
  onAddNewGroup,
  onPrintGroup,
  onLoadSampleGroups,
  onOpenChangePin,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'ungraded'>('all');

  // Filter groups
  const filteredGroups = groups.filter((g) => {
    const matchesSearch =
      (g.identity?.kelompok || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (g.identity?.nama || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (g.identity?.anggota || []).some((m) => m.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchesSearch) return false;

    if (filterStatus === 'completed') {
      const passedCount =
        Object.values(g.passedExercises || {}).filter(Boolean).length +
        Object.values(g.passedModules || {}).filter(Boolean).length;
      return passedCount === 7;
    }
    if (filterStatus === 'ungraded') {
      const raw = Object.values(g.rubricScores || {}).reduce((acc, curr) => acc + (curr || 0), 0);
      return raw === 0;
    }
    return true;
  });
  // Compute overall class statistics
  const totalGroups = groups.length;
  const completedGroups = groups.filter((g) => {
    const passedEx = Object.values(g.passedExercises || {}).filter(Boolean).length;
    const passedMod = Object.values(g.passedModules || {}).filter(Boolean).length;
    return passedEx + passedMod === 7;
  }).length;

  const gradedGroups = groups.filter((g) => {
    const raw = Object.values(g.rubricScores || {}).reduce((acc, curr) => acc + (curr || 0), 0);
    return raw > 0;
  });

  const averageScore =
    gradedGroups.length > 0
      ? Math.round(
          gradedGroups.reduce((acc, g) => {
            const raw = Object.values(g.rubricScores || {}).reduce((a, c) => a + (c || 0), 0);
            return acc + Math.round((raw / 16) * 100);
          }, 0) / gradedGroups.length
        )
      : 0;

  return (
    <section className="bg-white rounded-2xl border border-amber-300 shadow-md p-6 mb-8 relative overflow-hidden">
      {/* Decorative top accent */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600" />

      {/* Header Panel Guru */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
              Panel Pengampu MAN 1 Cianjur
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Rekapitulasi & Penilaian Hasil Kerja Tiap Kelompok
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Kelola, periksa kode, berikan nilai rubrik, atau reset pengerjaan masing-masing kelompok peserta didik.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onOpenChangePin && (
            <button
              onClick={onOpenChangePin}
              className="px-3.5 py-2 text-xs font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 border border-amber-300 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
              title="Ganti Kunci / PIN Guru Pengampu"
            >
              <KeyRound className="w-3.5 h-3.5 text-amber-700" />
              <span>Ganti Kunci Guru</span>
            </button>
          )}
          <button
            onClick={onAddNewGroup}
            className="px-3.5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Daftarkan Kelompok Baru</span>
          </button>
        </div>
      </div>

      {/* Statistik Cepat Kelas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
        <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-amber-800 block">Total Kelompok</span>
            <span className="text-xl font-extrabold text-slate-900 tabular-nums">
              {totalGroups} <span className="text-xs font-normal text-slate-500">Kelompok</span>
            </span>
          </div>
          <Users className="w-6 h-6 text-amber-600 opacity-60" />
        </div>

        <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-emerald-800 block">Tuntas 7 Tugas</span>
            <span className="text-xl font-extrabold text-slate-900 tabular-nums">
              {completedGroups} / {totalGroups}{' '}
              <span className="text-xs font-normal text-slate-500">
                ({totalGroups > 0 ? Math.round((completedGroups / totalGroups) * 100) : 0}%)
              </span>
            </span>
          </div>
          <CheckCircle2 className="w-6 h-6 text-emerald-600 opacity-60" />
        </div>

        <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-200 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-blue-800 block">Rata-rata Nilai</span>
            <span className="text-xl font-extrabold text-slate-900 tabular-nums">
              {averageScore > 0 ? `${averageScore} / 100` : 'Belum Dinilai'}
            </span>
          </div>
          <Award className="w-6 h-6 text-blue-600 opacity-60" />
        </div>
      </div>

      {/* Cloud Real-Time Live Sync Notification Banner */}
      <div className="my-3 p-3 bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 border border-emerald-200 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Cloud className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-bold text-emerald-950">
                Sinkronisasi Cloud Real-Time Aktif (Firebase Firestore)
              </span>
            </div>
            <p className="text-[11px] text-slate-600 mt-0.5">
              Setiap kelompok yang mendaftar atau mengerjakan LKPD di HP mereka langsung tampil di dashboard ini secara otomatis. Anda tidak perlu membuka HP siswa satu per satu.
            </p>
          </div>
        </div>

        <div className="shrink-0 flex items-center gap-1.5 px-2.5 py-1 bg-white/80 border border-emerald-300 rounded-lg text-emerald-800 text-[11px] font-bold">
          <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
          <span>{groups.length} Kelompok Terhubung</span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 my-3 pb-2 border-b border-slate-100">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nama kelompok atau anggota siswa..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
          />
        </div>

        <div className="flex items-center gap-1 text-xs">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-colors ${
              filterStatus === 'all'
                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Semua ({groups.length})
          </button>
          <button
            onClick={() => setFilterStatus('completed')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-colors ${
              filterStatus === 'completed'
                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Tuntas ({completedGroups})
          </button>
          <button
            onClick={() => setFilterStatus('ungraded')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-colors ${
              filterStatus === 'ungraded'
                ? 'bg-blue-100 text-blue-900 border border-blue-300'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Belum Dinilai ({groups.length - gradedGroups.length})
          </button>
        </div>
      </div>

      {/* Daftar Kelompok Card / Table */}
      {filteredGroups.length === 0 ? (
        <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-300 p-6">
          <Users className="w-10 h-10 mx-auto text-slate-300 mb-2" />
          <p className="text-xs font-semibold text-slate-700">
            {searchTerm ? 'Tidak ada kelompok yang sesuai kata kunci pencarian.' : 'Belum ada kelompok yang terdaftar.'}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">
            {searchTerm
              ? 'Coba gunakan kata kunci nama kelompok atau anggota lain.'
              : 'Ketika siswa membuka LKPD di HP mereka dan mendaftar, kelompok otomatis tampil di sini.'}
          </p>
          {onLoadSampleGroups && !searchTerm && (
            <button
              onClick={onLoadSampleGroups}
              className="mt-3.5 px-3.5 py-1.5 text-xs font-semibold text-amber-900 bg-amber-100 hover:bg-amber-200 border border-amber-300 rounded-lg transition-colors inline-flex items-center gap-1.5 shadow-xs"
            >
              <span>+ Muat 3 Kelompok Contoh untuk Simulasi Kelas</span>
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredGroups.map((group, idx) => {
            const isSelected = group.id === activeGroupId;
            const passedCount =
              Object.values(group.passedExercises || {}).filter(Boolean).length +
              Object.values(group.passedModules || {}).filter(Boolean).length;
            const percentage = Math.round((passedCount / 7) * 100);

            const rawScore = Object.values(group.rubricScores || {}).reduce(
              (acc, curr) => acc + (curr || 0),
              0
            );
            const score100 = Math.round((rawScore / 16) * 100);

            const anggotaList =
              group.identity.anggota && group.identity.anggota.length > 0
                ? group.identity.anggota
                : [group.identity.nama || 'Tanpa nama'];

            return (
              <div
                key={group.id}
                className={`p-4 rounded-xl border transition-all ${
                  isSelected
                    ? 'bg-amber-50/40 border-amber-400 ring-2 ring-amber-400/20 shadow-xs'
                    : 'bg-slate-50/50 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Info Kelompok & Anggota */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <h3 className="text-sm font-extrabold text-slate-900">
                        {group.identity.kelompok || `Kelompok ${idx + 1}`}
                      </h3>
                      {isSelected ? (
                        <span className="text-[10px] font-bold text-amber-900 bg-amber-200 px-2 py-0.5 rounded-full">
                          Sedang Ditinjau Guru
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-500">
                          Kelas {group.identity.kelas || 'X'}
                        </span>
                      )}
                    </div>

                    {/* Anggota Chips */}
                    <div className="flex flex-wrap items-center gap-1.5 mt-2">
                      <span className="text-[11px] font-semibold text-slate-500 mr-1">
                        Anggota ({anggotaList.length}):
                      </span>
                      {anggotaList.map((nama, aIdx) => (
                        <span
                          key={aIdx}
                          className="inline-flex items-center text-[11px] bg-white border border-slate-200 rounded px-2 py-0.5 text-slate-700 font-medium"
                        >
                          {aIdx === 0 && <strong className="text-blue-600 mr-1">[Ketua]</strong>}
                          {nama}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Progres Tugas & Nilai */}
                  <div className="flex flex-wrap items-center gap-6 lg:justify-end">
                    {/* Progress Bar Mini */}
                    <div className="w-36">
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-slate-500">Tugas:</span>
                        <span className="font-bold tabular-nums text-slate-800">
                          {passedCount}/7 ({percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            passedCount === 7 ? 'bg-emerald-500' : 'bg-blue-600'
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>

                    {/* Nilai Rubrik */}
                    <div className="text-right min-w-[90px]">
                      <span className="text-[10px] font-semibold text-slate-500 uppercase block">
                        Nilai Rubrik
                      </span>
                      <span
                        className={`text-sm font-black tabular-nums ${
                          rawScore > 0 ? 'text-slate-900' : 'text-slate-400'
                        }`}
                      >
                        {rawScore > 0 ? `${score100} / 100` : 'Belum Dinilai'}
                      </span>
                    </div>

                    {/* Tombol Aksi Guru */}
                    <div className="flex items-center gap-1.5 border-t sm:border-t-0 pt-2 sm:pt-0">
                      {/* Tombol Pilih & Tinjau */}
                      <button
                        onClick={() => onSelectGroup(group.id)}
                        className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-1 ${
                          isSelected
                            ? 'bg-amber-600 text-white shadow-xs'
                            : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                        }`}
                        title="Tinjau kode & berikan penilaian untuk kelompok ini"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>{isSelected ? 'Aktif' : 'Tinjau & Nilai'}</span>
                      </button>

                      {/* Tombol Cetak Dokumen Kelompok */}
                      <button
                        onClick={() => onPrintGroup(group)}
                        className="p-1.5 text-slate-600 hover:text-blue-700 hover:bg-blue-50 border border-slate-200 rounded-lg transition-colors"
                        title="Cetak lembar kerja kelompok ini ke PDF / Kertas"
                      >
                        <Printer className="w-3.5 h-3.5" />
                      </button>

                      {/* Tombol Reset Pengerjaan */}
                      <button
                        onClick={() => onResetGroupWork(group.id)}
                        className="p-1.5 text-slate-600 hover:text-amber-700 hover:bg-amber-50 border border-slate-200 rounded-lg transition-colors"
                        title="Reset pengerjaan kelompok ini (mengosongkan kode & nilai)"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>

                      {/* Tombol Hapus Kelompok */}
                      <button
                        onClick={() => onDeleteGroup(group.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-700 hover:bg-rose-50 border border-slate-200 rounded-lg transition-colors"
                        title="Hapus kelompok ini dari daftar"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
