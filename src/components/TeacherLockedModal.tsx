import React from 'react';
import { Lock, Users, AlertTriangle, X, ArrowRight, ShieldAlert } from 'lucide-react';

interface TeacherLockedModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenGroupRegistration: () => void;
  onOpenTeacherPin?: () => void;
}

export const TeacherLockedModal: React.FC<TeacherLockedModalProps> = ({
  isOpen,
  onClose,
  onOpenGroupRegistration,
  onOpenTeacherPin,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl border border-amber-200 max-w-md w-full p-6 shadow-2xl relative overflow-hidden">
        {/* Accent top bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-rose-500 to-amber-500" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          title="Tutup dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 rounded-xl bg-amber-100 border border-amber-300 text-amber-700 flex items-center justify-center shrink-0 shadow-xs">
            <Lock className="w-6 h-6 text-amber-700" />
          </div>
          <div className="pr-6">
            <span className="text-[11px] font-bold tracking-wider uppercase text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
              Akses Terkunci
            </span>
            <h3 className="text-base font-extrabold text-slate-900 mt-1">
              Mode Guru Belum Terbuka
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Siswa wajib mengisi data kelompok terlebih dahulu di perangkat ini
            </p>
          </div>
        </div>

        {/* Explanatory Box */}
        <div className="p-3.5 bg-amber-50/80 rounded-xl border border-amber-200 text-xs text-amber-950 space-y-2 mb-4 leading-relaxed">
          <div className="flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p>
              Sesuai instruksi pengerjaan LKPD, <strong>siswa harus mendaftarkan nama kelompok dan anggotanya terlebih dahulu</strong> sebelum mengerjakan tugas.
            </p>
          </div>
          <p className="text-slate-700 pl-6 text-[11px]">
            Jika Anda adalah Guru Pengampu yang sedang membuka di HP/komputer Guru, Anda dapat langsung memasukkan PIN Guru untuk memantau seluruh kelompok.
          </p>
        </div>

        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs text-slate-600 mb-5 flex items-center gap-2">
          <Users className="w-4 h-4 text-blue-600 shrink-0" />
          <span>
            Bagi siswa: Silakan klik tombol <strong>Isi Data Kelompok Siswa</strong> di bawah.
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5">
          {onOpenTeacherPin ? (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenTeacherPin();
              }}
              className="w-full sm:w-auto px-3 py-2 text-xs font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 border border-amber-300 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs"
            >
              <Lock className="w-3.5 h-3.5 text-amber-700" />
              <span>Masuk sebagai Guru (PIN)</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Tutup
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenGroupRegistration();
            }}
            className="w-full sm:w-auto px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Isi Data Kelompok Siswa</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
