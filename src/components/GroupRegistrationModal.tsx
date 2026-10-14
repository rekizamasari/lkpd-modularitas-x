import React, { useState, useEffect } from 'react';
import { StudentIdentity } from '../types/lkpd';
import { Users, UserPlus, Trash2, GraduationCap, CheckCircle2, School, Calendar, Lock, ShieldAlert, KeyRound } from 'lucide-react';

interface GroupRegistrationModalProps {
  isOpen: boolean;
  initialIdentity: StudentIdentity;
  onSave: (identity: StudentIdentity) => void;
  canCancel?: boolean;
  onClose?: () => void;
  onOpenTeacherPin?: () => void;
}

export const GroupRegistrationModal: React.FC<GroupRegistrationModalProps> = ({
  isOpen,
  initialIdentity,
  onSave,
  canCancel = false,
  onClose,
  onOpenTeacherPin,
}) => {
  const [kelompok, setKelompok] = useState(initialIdentity.kelompok || 'Kelompok 1');
  const [kelas, setKelas] = useState(initialIdentity.kelas || 'X');
  const [tanggal, setTanggal] = useState(
    initialIdentity.tanggal || new Date().toISOString().split('T')[0]
  );
  const [namaSekolah, setNamaSekolah] = useState(
    initialIdentity.namaSekolah || 'MAN 1 Cianjur'
  );

  // List of member names
  const [anggotaList, setAnggotaList] = useState<string[]>(() => {
    if (initialIdentity.anggota && initialIdentity.anggota.length > 0) {
      return initialIdentity.anggota;
    }
    return ['', '', ''];
  });

  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setKelompok(initialIdentity.kelompok || '');
      setKelas(initialIdentity.kelas || 'X');
      setTanggal(initialIdentity.tanggal || new Date().toISOString().split('T')[0]);
      setNamaSekolah(initialIdentity.namaSekolah || 'MAN 1 Cianjur');
      if (initialIdentity.anggota && initialIdentity.anggota.length > 0) {
        setAnggotaList(initialIdentity.anggota);
      } else {
        setAnggotaList(['', '', '']);
      }
      setValidationError(null);
    }
  }, [isOpen, initialIdentity]);

  if (!isOpen) return null;

  const handleAddMember = () => {
    setAnggotaList((prev) => [...prev, '']);
  };

  const handleRemoveMember = (index: number) => {
    if (anggotaList.length <= 1) return;
    setAnggotaList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMemberChange = (index: number, val: string) => {
    setAnggotaList((prev) => {
      const updated = [...prev];
      updated[index] = val;
      return updated;
    });
    setValidationError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const cleanKelompok = kelompok.trim();
    if (!cleanKelompok) {
      setValidationError('Silakan isi nama atau nomor kelompok.');
      return;
    }

    const filteredAnggota = anggotaList.map((a) => a.trim()).filter(Boolean);
    if (filteredAnggota.length === 0) {
      setValidationError('Silakan masukkan minimal 1 nama anggota kelompok.');
      return;
    }

    const updatedIdentity: StudentIdentity = {
      kelompok: cleanKelompok,
      kelas: kelas.trim() || 'X',
      tanggal,
      namaSekolah: namaSekolah.trim() || 'MAN 1 Cianjur',
      nama: filteredAnggota[0] || '', // Nama ketua / penanggung jawab utama
      anggota: filteredAnggota,
      isRegistered: true,
    };

    onSave(updatedIdentity);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 shadow-2xl my-8 relative">
        {/* Header KOP Onboarding */}
        <div className="flex items-start gap-3.5 pb-4 border-b border-slate-100">
          <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">
              MAN 1 Cianjur · Kurikulum Merdeka
            </span>
            <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
              Registrasi Identitas Kelompok Siswa
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              LKPD Koding & AI · Materi Modularitas Pemrograman Python
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-600 my-3 leading-relaxed bg-blue-50/70 p-3 rounded-lg border border-blue-100">
          Selamat datang! Sebelum memulai pengerjaan latihan dan studi kasus kasir otomatis, silakan lengkapi identitas kelompok dan seluruh nama anggota kelompok di bawah ini.
        </p>

        {/* Guru Pengampu Quick Switch Box */}
        {onOpenTeacherPin && (
          <div className="mb-4 p-3.5 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 text-xs text-amber-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 shadow-2xs font-bold">
                <KeyRound className="w-4 h-4" />
              </div>
              <div>
                <strong className="text-amber-950 block font-bold text-xs">
                  Buka sebagai Guru Pengampu?
                </strong>
                <p className="text-[11px] text-amber-900 mt-0.5 leading-relaxed">
                  Guru di HP/laptop pengampu tidak perlu mengisi data kelompok siswa. Klik tombol untuk langsung masuk ke Dashboard Guru via PIN.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onOpenTeacherPin}
              className="px-3.5 py-2 text-xs font-bold text-slate-950 bg-amber-300 hover:bg-amber-400 border border-amber-500 rounded-lg transition-colors flex items-center justify-center gap-1.5 shrink-0 shadow-xs cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-slate-900" />
              <span>Masuk Mode Guru (PIN)</span>
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-blue-600" />
                Nama / No. Kelompok:
              </label>
              <input
                type="text"
                required
                placeholder="cth. Kelompok 1 (Koding)"
                value={kelompok}
                onChange={(e) => {
                  setKelompok(e.target.value);
                  setValidationError(null);
                }}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Kelas:
              </label>
              <input
                type="text"
                required
                placeholder="cth. X-1 / X"
                value={kelas}
                onChange={(e) => setKelas(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold text-slate-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                <School className="w-3.5 h-3.5 text-slate-400" />
                Satuan Pendidikan:
              </label>
              <input
                type="text"
                value={namaSekolah}
                onChange={(e) => setNamaSekolah(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-hidden text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Tanggal Pengerjaan:
              </label>
              <input
                type="date"
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-hidden text-slate-800"
              />
            </div>
          </div>

          {/* Section Daftar Anggota Kelompok */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <span>Daftar Anggota Kelompok (Ketua & Anggota):</span>
              </label>
              <button
                type="button"
                onClick={handleAddMember}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>+ Tambah Anggota</span>
              </button>
            </div>

            <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
              {anggotaList.map((nama, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="w-6 text-center text-xs font-bold text-slate-400 tabular-nums">
                    {idx + 1}.
                  </span>
                  <input
                    type="text"
                    placeholder={
                      idx === 0
                        ? 'Nama Ketua Kelompok (cth. Rian Ramadhan)'
                        : `Nama Anggota ${idx + 1}`
                    }
                    value={nama}
                    onChange={(e) => handleMemberChange(idx, e.target.value)}
                    className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800"
                  />
                  {anggotaList.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveMember(idx)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md transition-colors"
                      title="Hapus anggota"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {validationError && (
            <p className="text-xs text-rose-600 font-semibold bg-rose-50 p-2 rounded border border-rose-200">
              {validationError}
            </p>
          )}

          <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            {onOpenTeacherPin ? (
              <button
                type="button"
                onClick={onOpenTeacherPin}
                className="text-xs text-amber-900 hover:text-amber-950 font-bold underline flex items-center gap-1.5 py-1 cursor-pointer"
              >
                <KeyRound className="w-3.5 h-3.5 text-amber-700" />
                <span>Masuk sebagai Guru Pengampu (Gunakan PIN)</span>
              </button>
            ) : <div />}

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              {canCancel && onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Batal
                </button>
              )}
              <button
                type="submit"
                className="w-full sm:w-auto px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Simpan Identitas & Mulai Kerjakan LKPD</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
