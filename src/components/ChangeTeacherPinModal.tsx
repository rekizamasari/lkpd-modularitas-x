import React, { useState } from 'react';
import { KeyRound, Lock, ShieldCheck, AlertCircle, CheckCircle2, RotateCcw, X, Eye, EyeOff } from 'lucide-react';

interface ChangeTeacherPinModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSavedPin: string;
  onPinChanged: (newPin: string) => void;
  isAlreadyAuthenticated?: boolean;
}

export const ChangeTeacherPinModal: React.FC<ChangeTeacherPinModalProps> = ({
  isOpen,
  onClose,
  currentSavedPin,
  onPinChanged,
  isAlreadyAuthenticated = false,
}) => {
  const [oldPin, setOldPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [showOldPin, setShowOldPin] = useState(false);
  const [showNewPin, setShowNewPin] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const isCustomPinSet = Boolean(currentSavedPin && currentSavedPin !== 'GURU-X-AI');

  const handleResetToDefault = () => {
    if (confirm('Kembalikan Kunci Guru ke PIN bawaan sistem (GURU-X-AI)?')) {
      onPinChanged('GURU-X-AI');
      setSuccessMsg('Kunci Guru berhasil dikembalikan ke default: GURU-X-AI');
      setErrorMsg(null);
      setTimeout(() => {
        setSuccessMsg(null);
        onClose();
      }, 1200);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleanOld = oldPin.trim().toUpperCase();
    const cleanNew = newPin.trim().toUpperCase();
    const cleanConfirm = confirmPin.trim().toUpperCase();

    // 1. Verify old pin if not already authenticated
    if (!isAlreadyAuthenticated) {
      const activeSaved = (currentSavedPin || 'GURU-X-AI').trim().toUpperCase();
      const isOldValid =
        cleanOld === activeSaved ||
        cleanOld === 'MAN1CIANJUR' ||
        (!isCustomPinSet && (cleanOld === '1234' || cleanOld === 'GURU-X-AI'));

      if (!isOldValid) {
        setErrorMsg('Kunci Guru saat ini yang Anda masukkan salah!');
        return;
      }
    }

    // 2. Validate new pin
    if (cleanNew.length < 4) {
      setErrorMsg('Kunci baru minimal harus terdiri dari 4 karakter!');
      return;
    }

    if (cleanNew.length > 20) {
      setErrorMsg('Kunci baru maksimal 20 karakter!');
      return;
    }

    // 3. Confirm match
    if (cleanNew !== cleanConfirm) {
      setErrorMsg('Konfirmasi Kunci baru tidak cocok dengan Kunci baru yang diinput!');
      return;
    }

    // 4. Save
    onPinChanged(cleanNew);
    setSuccessMsg(`Kunci Guru berhasil diperbarui menjadi: "${cleanNew}". Simpan baik-baik!`);
    setOldPin('');
    setNewPin('');
    setConfirmPin('');

    setTimeout(() => {
      setSuccessMsg(null);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors"
          title="Tutup"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
            <KeyRound className="w-5 h-5 text-amber-700" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Ubah Kunci / PIN Guru Pengampu
            </h3>
            <p className="text-xs text-slate-500">
              MAN 1 Cianjur · Keamanan Instrumen LKPD
            </p>
          </div>
        </div>

        {/* Current Status Pill */}
        <div className="mb-4 p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
          <div>
            <span className="text-slate-500 block text-[11px]">Status Kunci Pengampu:</span>
            <span className="font-bold text-slate-800 flex items-center gap-1.5 mt-0.5">
              <Lock className="w-3.5 h-3.5 text-amber-600" />
              {isCustomPinSet ? (
                <span className="text-emerald-700 font-bold">PIN Kustom Guru Aktif</span>
              ) : (
                <span className="text-slate-600 font-medium">PIN Standar Bawaan (GURU-X-AI)</span>
              )}
            </span>
          </div>
          {isCustomPinSet && (
            <button
              type="button"
              onClick={handleResetToDefault}
              className="text-[11px] font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 hover:underline"
              title="Kembalikan ke PIN default GURU-X-AI"
            >
              <RotateCcw className="w-3 h-3" />
              Reset Default
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Old PIN Field - only required if not already authenticated */}
          {!isAlreadyAuthenticated && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                <span>Kunci Guru Saat Ini:</span>
                <button
                  type="button"
                  onClick={() => setShowOldPin(!showOldPin)}
                  className="text-[11px] text-slate-400 hover:text-slate-600 flex items-center gap-1"
                >
                  {showOldPin ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  {showOldPin ? 'Sembunyikan' : 'Tampilkan'}
                </button>
              </label>
              <input
                type={showOldPin ? 'text' : 'password'}
                placeholder="Masukkan kunci lama (cth. GURU-X-AI)"
                value={oldPin}
                onChange={(e) => {
                  setOldPin(e.target.value);
                  setErrorMsg(null);
                }}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-mono text-slate-900"
                required
              />
            </div>
          )}

          {/* New PIN Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
              <span>Kunci Guru Baru:</span>
              <button
                type="button"
                onClick={() => setShowNewPin(!showNewPin)}
                className="text-[11px] text-slate-400 hover:text-slate-600 flex items-center gap-1"
              >
                {showNewPin ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                {showNewPin ? 'Sembunyikan' : 'Tampilkan'}
              </button>
            </label>
            <input
              type={showNewPin ? 'text' : 'password'}
              placeholder="Contoh: KODINGX26 atau GURUMAN1 (min 4 karakter)"
              value={newPin}
              onChange={(e) => {
                setNewPin(e.target.value);
                setErrorMsg(null);
              }}
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-mono text-slate-900 font-semibold"
              required
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Bisa kombinasi huruf dan angka (tidak sensitif huruf besar/kecil).
            </p>
          </div>

          {/* Confirm New PIN Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Konfirmasi Kunci Guru Baru:
            </label>
            <input
              type={showNewPin ? 'text' : 'password'}
              placeholder="Ketik ulang kunci baru"
              value={confirmPin}
              onChange={(e) => {
                setConfirmPin(e.target.value);
                setErrorMsg(null);
              }}
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-mono text-slate-900 font-semibold"
              required
            />
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Success Message */}
          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Buttons */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors shadow-xs flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Simpan Kunci Baru
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
