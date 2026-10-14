import React, { useState } from 'react';
import { PrintableWorksheet } from './PrintableWorksheet';
import { StudentIdentity } from '../types/lkpd';
import { Printer, X, Copy, Check, Eye, AlertCircle } from 'lucide-react';

interface PrintPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  identity: StudentIdentity;
  studentCodes: Record<string, string>;
  moduleCodes: Record<number, string>;
  reflectionAnswers: Record<string, string>;
  rubricScores: Record<string, number>;
  teacherFeedback: string;
  teacherName: string;
}

export const PrintPreviewModal: React.FC<PrintPreviewModalProps> = ({
  isOpen,
  onClose,
  identity,
  studentCodes,
  moduleCodes,
  reflectionAnswers,
  rubricScores,
  teacherFeedback,
  teacherName,
}) => {
  const [copied, setCopied] = useState(false);
  const [printStatusNotice, setPrintStatusNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleBrowserPrint = () => {
    try {
      setPrintStatusNotice('Membuka dialog cetak browser...');
      window.print();
    } catch {
      setPrintStatusNotice(
        'Dialog cetak dibatasi oleh pengaturan iframe browser. Anda dapat melihat seluruh lembar cetak siap pakai di bawah ini.'
      );
    }
  };

  const handleCopySummary = () => {
    const summary = `========================================================
LEMBAR KERJA PESERTA DIDIK (LKPD) KODING & KECERDASAN ARTIFISIAL
Satuan Pendidikan: ${identity.namaSekolah || 'MAN 1 Cianjur'}
Nama Siswa: ${identity.nama || '-'} | Kelas: ${identity.kelas || '-'} | Kelompok: ${identity.kelompok || '-'}
Tanggal: ${identity.tanggal || '-'}
Topik: Modularitas Python (Fungsi, Parameter, Nilai Balik, Kasir Otomatis)
========================================================

--- LATIHAN TERSTRUKTUR ---
Latihan 1:
${studentCodes['latihan-1'] || ''}

Latihan 2:
${studentCodes['latihan-2'] || ''}

Latihan 3:
${studentCodes['latihan-3'] || ''}

--- PROYEK KASIR OTOMATIS (4 MODUL) ---
Modul 1:
${moduleCodes[1] || ''}

Modul 2:
${moduleCodes[2] || ''}

Modul 3:
${moduleCodes[3] || ''}

Modul 4:
${moduleCodes[4] || ''}

--- REFLEKSI SISWA ---
1. ${reflectionAnswers['refleksi-1'] || '-'}
2. ${reflectionAnswers['refleksi-2'] || '-'}
3. ${reflectionAnswers['refleksi-3'] || '-'}

Catatan Guru: ${teacherFeedback || '-'}
Guru Penilai: ${teacherName || '-'}
`;
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-900/80 backdrop-blur-sm overflow-hidden animate-in fade-in duration-200">
      {/* Top Action Bar (No-print) */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between text-white shrink-0 shadow-lg no-print">
        <div className="flex items-center gap-2">
          <Eye className="w-5 h-5 text-blue-400" />
          <div>
            <h2 className="text-sm font-bold tracking-tight">
              Pratinjau Lembar Kerja LKPD Siap Cetak (A4 Standard)
            </h2>
            <p className="text-[11px] text-slate-400">
              Format Resmi Kurikulum Merdeka · {identity.namaSekolah || 'MAN 1 Cianjur'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Tombol Salin Ringkasan */}
          <button
            onClick={handleCopySummary}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors flex items-center gap-1.5"
            title="Salin isi dokumen LKPD ke clipboard"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copied ? 'Tersalin!' : 'Salin Teks LKPD'}</span>
          </button>

          {/* Tombol Cetak Browser */}
          <button
            onClick={handleBrowserPrint}
            className="px-4 py-1.5 text-xs font-bold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Dokumen Sekarang (PDF / Print)</span>
          </button>

          {/* Tombol Tutup */}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Tutup Pratinjau"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Notice jika browser membatasi print popup */}
      {printStatusNotice && (
        <div className="bg-blue-900/90 border-b border-blue-800 px-4 py-2 text-xs text-blue-100 flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-blue-300 shrink-0" />
            <span>{printStatusNotice}</span>
          </div>
          <button
            onClick={() => setPrintStatusNotice(null)}
            className="text-blue-300 hover:text-white underline text-[11px]"
          >
            Tutup
          </button>
        </div>
      )}

      {/* Sheet Canvas Scroll Container */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-800 flex justify-center">
        <div className="w-full max-w-[210mm] bg-white text-slate-900 rounded-sm shadow-2xl p-8 sm:p-12 min-h-[297mm] transition-all">
          <PrintableWorksheet
            identity={identity}
            studentCodes={studentCodes}
            moduleCodes={moduleCodes}
            reflectionAnswers={reflectionAnswers}
            rubricScores={rubricScores}
            teacherFeedback={teacherFeedback}
            teacherName={teacherName}
            forceDisplay={true}
          />
        </div>
      </div>
    </div>
  );
};
