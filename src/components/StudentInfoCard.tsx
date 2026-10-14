import React from 'react';
import { StudentIdentity } from '../types/lkpd';
import { Award, Calendar, School, Users, CheckCircle2, Edit3, UserCheck, Lock } from 'lucide-react';
import { BadgeSystem } from './BadgeSystem';

interface StudentInfoCardProps {
  identity: StudentIdentity;
  onChange: (updated: Partial<StudentIdentity>) => void;
  passedTasks: number;
  totalTasks: number;
  passedExercisesCount?: number;
  totalExercisesCount?: number;
  passedKasirCount?: number;
  totalKasirCount?: number;
  passedExercises?: Record<string, boolean>;
  passedModules?: Record<number, boolean>;
  onOpenGroupModal?: () => void;
}

export const StudentInfoCard: React.FC<StudentInfoCardProps> = ({
  identity,
  onChange,
  passedTasks,
  totalTasks,
  passedExercisesCount = 0,
  totalExercisesCount = 3,
  passedKasirCount = 0,
  totalKasirCount = 4,
  passedExercises = {},
  passedModules = {},
  onOpenGroupModal,
}) => {
  const percentage = totalTasks > 0 ? Math.round((passedTasks / totalTasks) * 100) : 0;
  const isCompleted = passedTasks >= totalTasks && totalTasks > 0;

  // SVG Progress Ring calculations
  const ringRadius = 32;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringOffset = ringCircumference - (percentage / 100) * ringCircumference;

  // Bar progress calculations
  const exercisePercent =
    totalExercisesCount > 0 ? Math.round((passedExercisesCount / totalExercisesCount) * 100) : 0;
  const kasirPercent =
    totalKasirCount > 0 ? Math.round((passedKasirCount / totalKasirCount) * 100) : 0;

  const isDataIncomplete = !identity.isRegistered || !identity.kelompok || !identity.anggota || identity.anggota.length === 0;
  const anggotaList = identity.anggota && identity.anggota.length > 0 ? identity.anggota : [identity.nama || 'Belum diisi'];

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs mb-6">
      {/* Banner Peringatan jika data belum diisi */}
      {isDataIncomplete && (
        <div className="mb-4 p-3 bg-amber-50 border border-amber-300 rounded-lg text-xs text-amber-950 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 shadow-2xs">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>Perhatian Siswa:</strong> Identitas kelompok belum terdaftar. Mode Guru dan penilaian sedang terkunci hingga data kelompok disimpan.
            </span>
          </div>
          {onOpenGroupModal && (
            <button
              type="button"
              onClick={onOpenGroupModal}
              className="px-3 py-1 text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white rounded transition-colors self-start sm:self-auto shrink-0 shadow-2xs"
            >
              Isi Data Kelompok
            </button>
          )}
        </div>
      )}

      <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-6">
        {/* Kolom Kiri: Ringkasan Kelompok & Anggota */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-blue-600" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                Identitas Kelompok Belajar
              </h2>
            </div>
            {onOpenGroupModal && (
              <button
                type="button"
                onClick={onOpenGroupModal}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-md border border-blue-200 flex items-center gap-1.5 transition-colors"
                title="Edit nama kelompok atau anggota"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Kelompok & Anggota</span>
              </button>
            )}
          </div>

          {/* Info Utama Kelompok */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3.5">
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <span className="text-[11px] font-semibold text-slate-500 block">Nama Kelompok</span>
              <span className="text-sm font-extrabold text-slate-900 flex items-center gap-1 mt-0.5">
                <Users className="w-4 h-4 text-blue-600" />
                {identity.kelompok || 'Kelompok Belum Dinamai'}
              </span>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <span className="text-[11px] font-semibold text-slate-500 block">Kelas & Sekolah</span>
              <span className="text-sm font-bold text-slate-800 mt-0.5 block truncate">
                Kelas {identity.kelas || 'X'} · {identity.namaSekolah || 'MAN 1 Cianjur'}
              </span>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <span className="text-[11px] font-semibold text-slate-500 block">Tanggal Praktikum</span>
              <span className="text-sm font-bold text-slate-800 mt-0.5 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                {identity.tanggal || '-'}
              </span>
            </div>
          </div>

          {/* Daftar Anggota Kelompok */}
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-slate-700">
                Anggota Kelompok ({anggotaList.length} Siswa):
              </span>
              <span className="text-[11px] text-slate-500">
                Ketua: <strong className="text-slate-800">{anggotaList[0] || '-'}</strong>
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {anggotaList.map((nama, idx) => (
                <div
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-white text-slate-800 border border-slate-200 shadow-2xs"
                >
                  <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <span>{nama}</span>
                  {idx === 0 && (
                    <span className="text-[9px] bg-amber-100 text-amber-800 px-1 rounded font-bold">
                      Ketua
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Panel Visualisasi: Progress Ring & Grafik Batang */}
        <div className="xl:w-96 bg-slate-50 rounded-xl p-4 border border-slate-200 flex flex-col justify-between gap-3 shrink-0">
          <div className="flex items-center justify-between border-b border-slate-200/70 pb-2">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-amber-500" />
              Progres Latihan & Kasir
            </span>
            <span
              className={`text-[11px] font-bold px-2 py-0.5 rounded border ${
                isCompleted
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-blue-50 text-blue-700 border-blue-200'
              }`}
            >
              {isCompleted ? '100% Selesai' : `${percentage}% Selesai`}
            </span>
          </div>

          {/* Sisi Atas: Progress Ring & Ringkasan Angka */}
          <div className="flex items-center gap-4">
            {/* SVG Progress Ring */}
            <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
              <svg className="w-20 h-20 -rotate-90 transform" viewBox="0 0 80 80">
                <circle
                  cx="40"
                  cy="40"
                  r={ringRadius}
                  stroke="currentColor"
                  strokeWidth="7"
                  className="text-slate-200"
                  fill="none"
                />
                <circle
                  cx="40"
                  cy="40"
                  r={ringRadius}
                  stroke="currentColor"
                  strokeWidth="7"
                  strokeDasharray={ringCircumference}
                  strokeDashoffset={ringOffset}
                  strokeLinecap="round"
                  className={`transition-all duration-700 ${
                    isCompleted ? 'text-emerald-500' : 'text-blue-600'
                  }`}
                  fill="none"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-base font-extrabold text-slate-900 tabular-nums leading-none">
                  {percentage}%
                </span>
                <span className="text-[9px] font-bold text-slate-400 mt-0.5">TUNTAS</span>
              </div>
            </div>

            {/* Total Task Stat */}
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Total Terverifikasi:</span>
                <span className="font-bold text-slate-900 tabular-nums">
                  {passedTasks} / {totalTasks}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px]">
                {isCompleted ? (
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Semua Modul Siap Diases
                  </span>
                ) : (
                  <span className="text-slate-500">
                    Sisa <strong className="text-blue-600">{totalTasks - passedTasks}</strong> tugas belum lulus autograder
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Sisi Bawah: Grafik Batang Komparatif (Bar Graph) */}
          <div className="space-y-2 pt-1 border-t border-slate-200/70">
            {/* Batang 1: Latihan Terstruktur */}
            <div>
              <div className="flex items-center justify-between text-[11px] font-medium text-slate-700 mb-1">
                <span>1. Latihan Terstruktur (Optimasi)</span>
                <span className="font-bold tabular-nums text-slate-800">
                  {passedExercisesCount}/{totalExercisesCount} ({exercisePercent}%)
                </span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-blue-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${exercisePercent}%` }}
                />
              </div>
            </div>

            {/* Batang 2: Studi Kasus Kasir Otomatis */}
            <div>
              <div className="flex items-center justify-between text-[11px] font-medium text-slate-700 mb-1">
                <span>2. Proyek Kasir Otomatis (4 Modul)</span>
                <span className="font-bold tabular-nums text-slate-800">
                  {passedKasirCount}/{totalKasirCount} ({kasirPercent}%)
                </span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${kasirPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Komponen Medali Pencapaian Siswa (BadgeSystem) */}
      <BadgeSystem passedExercises={passedExercises} passedModules={passedModules} />
    </div>
  );
};
