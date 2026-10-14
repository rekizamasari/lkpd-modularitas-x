import React, { useState } from 'react';
import { RUBRIC_CRITERIA, REFLECTION_QUESTIONS } from '../data/lkpdData';
import {
  Award,
  ShieldCheck,
  KeyRound,
  Lock,
  Unlock,
  FileText,
  Check,
  Info,
  ShieldAlert,
} from 'lucide-react';

interface RubricSectionProps {
  reflectionAnswers: Record<string, string>;
  onReflectionChange: (id: string, text: string) => void;
  rubricScores: Record<string, number>;
  onRubricScoreChange: (criteriaId: string, score: number) => void;
  teacherFeedback: string;
  onTeacherFeedbackChange: (text: string) => void;
  teacherName: string;
  onTeacherNameChange: (text: string) => void;
  isTeacherMode: boolean;
  isGroupDataFilled?: boolean;
  onRequestTeacherAuth: () => void;
  onPrint: () => void;
}

export const RubricSection: React.FC<RubricSectionProps> = ({
  reflectionAnswers,
  onReflectionChange,
  rubricScores,
  onRubricScoreChange,
  teacherFeedback,
  onTeacherFeedbackChange,
  teacherName,
  onTeacherNameChange,
  isTeacherMode,
  isGroupDataFilled = true,
  onRequestTeacherAuth,
  onPrint,
}) => {
  const [showLockedAlert, setShowLockedAlert] = useState(false);

  // Calculate final score
  const totalScoreRaw = Object.values(rubricScores).reduce((acc, curr) => acc + (curr || 0), 0);
  const finalNumericScore = Math.round((totalScoreRaw / 16) * 100);

  const getPredicate = (score: number) => {
    if (totalScoreRaw === 0)
      return {
        letter: '-',
        text: 'Belum Dinilai',
        color: 'text-slate-600 bg-slate-100 border-slate-300',
      };
    if (score >= 90)
      return {
        letter: 'A',
        text: 'Sangat Mahir',
        color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      };
    if (score >= 80)
      return {
        letter: 'B',
        text: 'Mahir',
        color: 'text-blue-700 bg-blue-50 border-blue-200',
      };
    if (score >= 70)
      return {
        letter: 'C',
        text: 'Cukup',
        color: 'text-amber-700 bg-amber-50 border-amber-200',
      };
    return {
      letter: 'D',
      text: 'Perlu Bimbingan',
      color: 'text-rose-700 bg-rose-50 border-rose-200',
    };
  };

  const predicate = getPredicate(finalNumericScore);

  const handleScoreCardClick = (criteriaId: string, level: number) => {
    if (!isTeacherMode) {
      setShowLockedAlert(true);
      setTimeout(() => setShowLockedAlert(false), 3500);
      return;
    }
    onRubricScoreChange(criteriaId, level);
  };

  return (
    <div className="space-y-8">
      {/* Banner Perbedaan Mode Siswa vs Guru */}
      {!isTeacherMode ? (
        <div className="p-4 rounded-xl bg-slate-100 border border-slate-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 text-slate-800">
            <Lock className="w-4 h-4 text-slate-500 shrink-0" />
            <div>
              <span className="font-bold">Mode Siswa Aktif:</span>
              <p className="text-slate-600 mt-0.5">
                Anda dapat mengisi Lembar Refleksi Diri di bawah. Rubrik penilaian guru dan pembahasan kunci jawaban dikunci khusus untuk Guru Pengampu.
              </p>
            </div>
          </div>
          <button
            onClick={onRequestTeacherAuth}
            className={`px-3.5 py-1.5 font-bold rounded-lg transition-colors shrink-0 flex items-center gap-1.5 shadow-xs ${
              !isGroupDataFilled
                ? 'bg-amber-50 border border-amber-300 text-amber-900 hover:bg-amber-100'
                : 'bg-white border border-slate-300 text-slate-800 hover:bg-slate-50'
            }`}
            title={!isGroupDataFilled ? 'Mode Guru Terkunci: Siswa harus mengisi data kelompok terlebih dahulu' : 'Masuk Mode Guru'}
          >
            {!isGroupDataFilled ? (
              <>
                <Lock className="w-3.5 h-3.5 text-amber-600" />
                <span>Guru Terkunci (Isi Kelompok)</span>
              </>
            ) : (
              <>
                <KeyRound className="w-3.5 h-3.5 text-amber-600" />
                <span>Masuk Mode Guru</span>
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-xs text-amber-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <span className="font-bold text-amber-900 text-sm">
                Mode Guru Pengampu Aktif (MAN 1 Cianjur)
              </span>
              <p className="text-amber-800 mt-0.5">
                Akses Terbuka: Anda dapat mengklik level capaian rubrik untuk memberikan nilai, menuliskan umpan balik evaluasi, dan menelaah kunci jawaban lengkap.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Bagian 1: Refleksi Diri Siswa (Dapat Diisi Siswa & Guru) */}
      <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-2">
          <FileText className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-bold text-slate-900">
            Lembar Refleksi Pemahaman Peserta Didik
          </h2>
        </div>
        <p className="text-xs text-slate-600 mb-6 leading-relaxed">
          Tuliskan pemahaman konseptual dan pengalaman belajar Anda selama merancang sistem kasir modular berbasis Python.
        </p>

        <div className="space-y-5">
          {REFLECTION_QUESTIONS.map((item, idx) => (
            <div key={item.id} className="p-4 rounded-lg bg-slate-50 border border-slate-200">
              <label className="block text-xs font-bold text-slate-800 mb-2">
                <span className="text-blue-600 mr-1.5">{idx + 1}.</span>
                {item.question}
              </label>
              <textarea
                value={reflectionAnswers[item.id] || ''}
                onChange={(e) => onReflectionChange(item.id, e.target.value)}
                rows={3}
                placeholder="Tuliskan analisis dan penjelasan Anda di sini..."
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-md focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 leading-relaxed"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Alert jika siswa mencoba klik rubrik skor */}
      {showLockedAlert && (
        <div className="p-3 bg-amber-50 border border-amber-300 rounded-lg text-xs text-amber-900 flex items-center justify-between gap-2 shadow-md animate-in fade-in">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>Penilaian Dikunci:</strong> Pengisian skor rubrik hanya dapat dilakukan oleh Guru Pengampu. Silakan login ke Mode Guru terlebih dahulu.
            </span>
          </div>
          <button
            onClick={onRequestTeacherAuth}
            className="px-2.5 py-1 text-[11px] font-bold bg-amber-600 text-white rounded hover:bg-amber-700"
          >
            Login Guru
          </button>
        </div>
      )}

      {/* Bagian 2: Rubrik Penilaian Guru Autentik */}
      <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Award className="w-5 h-5 text-amber-500" />
              <h2 className="text-lg font-bold text-slate-900">
                Rubrik Asesmen Otentik Guru (Skala 1 - 4)
              </h2>
            </div>
            <p className="text-xs text-slate-600">
              {isTeacherMode
                ? 'Klik pada kotak level untuk memberikan skor kinerja peserta didik.'
                : 'Pedoman kriteria penilaian resmi Kurikulum Merdeka Fase E.'}
            </p>
          </div>

          {/* Skor Tally Card */}
          <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200 self-start sm:self-auto">
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Nilai Akhir
              </span>
              <span className="text-2xl font-black text-slate-900 tabular-nums">
                {finalNumericScore}
                <span className="text-xs font-normal text-slate-500"> / 100</span>
              </span>
            </div>
            <div className={`px-2.5 py-1 rounded text-xs font-bold border ${predicate.color}`}>
              {predicate.letter} · {predicate.text}
            </div>
          </div>
        </div>

        {/* Tabel Kriteria */}
        <div className="space-y-6">
          {RUBRIC_CRITERIA.map((criteria, index) => {
            const currentScore = rubricScores[criteria.id] || 3;
            return (
              <div key={criteria.id} className="border border-slate-200 rounded-lg overflow-hidden">
                <div className="bg-slate-50 p-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center">
                      {index + 1}
                    </span>
                    <h3 className="text-xs font-bold text-slate-800">
                      {criteria.title}
                    </h3>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-500">
                    Bobot: {criteria.weight}%
                  </span>
                </div>

                {/* Level Deskriptor 4, 3, 2, 1 */}
                <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-slate-200 bg-white">
                  {[
                    { level: 4, label: 'Sangat Mahir (4)', desc: criteria.descriptors.level4 },
                    { level: 3, label: 'Mahir (3)', desc: criteria.descriptors.level3 },
                    { level: 2, label: 'Cukup (2)', desc: criteria.descriptors.level2 },
                    { level: 1, label: 'Perlu Bimbingan (1)', desc: criteria.descriptors.level1 },
                  ].map((lvl) => {
                    const isSelected = currentScore === lvl.level;
                    return (
                      <div
                        key={lvl.level}
                        onClick={() => handleScoreCardClick(criteria.id, lvl.level)}
                        className={`p-3 text-xs transition-all flex flex-col justify-between ${
                          isTeacherMode ? 'cursor-pointer' : 'cursor-default'
                        } ${
                          isSelected
                            ? 'bg-blue-50/80 ring-2 ring-blue-500/30'
                            : isTeacherMode
                            ? 'hover:bg-slate-50'
                            : 'bg-white'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span
                              className={`text-[11px] font-bold ${
                                isSelected ? 'text-blue-700' : 'text-slate-700'
                              }`}
                            >
                              {lvl.label}
                            </span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-blue-600" />}
                          </div>
                          <p className="text-[11px] text-slate-600 leading-relaxed">
                            {lvl.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Kolom Umpan Balik Guru & Pengesahan */}
        <div className="mt-6 pt-6 border-t border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center justify-between">
              <span>Catatan Umpan Balik Guru (Feedback Formatif):</span>
              {!isTeacherMode && (
                <span className="text-[10px] text-slate-400 font-normal">
                  (Hanya Guru yang dapat mengedit)
                </span>
              )}
            </label>
            <textarea
              readOnly={!isTeacherMode}
              value={teacherFeedback}
              onChange={(e) => onTeacherFeedbackChange(e.target.value)}
              rows={3}
              placeholder={
                isTeacherMode
                  ? 'Ketikkan catatan evaluasi dan saran perbaikan untuk siswa...'
                  : 'Catatan akan dituliskan oleh Guru Pengampu setelah LKPD dikumpulkan.'
              }
              className={`w-full px-3 py-2 text-xs rounded-md text-slate-800 leading-relaxed border ${
                isTeacherMode
                  ? 'bg-white border-amber-300 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20'
                  : 'bg-slate-100 border-slate-200 cursor-not-allowed'
              }`}
            />
          </div>

          <div className="flex flex-col justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center justify-between">
                <span>Nama Guru Pengampu / Penilai:</span>
                {!isTeacherMode && (
                  <span className="text-[10px] text-slate-400 font-normal">
                    (Terverifikasi Guru)
                  </span>
                )}
              </label>
              <input
                type="text"
                readOnly={!isTeacherMode}
                placeholder="Nama Guru beserta Gelar (cth. Rian Z. S.Kom., Gr.)"
                value={teacherName}
                onChange={(e) => onTeacherNameChange(e.target.value)}
                className={`w-full px-3 py-1.5 text-xs rounded-md border ${
                  isTeacherMode
                    ? 'bg-white border-amber-300 focus:outline-hidden'
                    : 'bg-slate-100 border-slate-200 cursor-not-allowed'
                }`}
              />
            </div>

            <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-200">
              <span className="text-[11px] text-slate-500">
                Status:{' '}
                <strong className="text-slate-700">
                  {teacherName ? 'Tervalidasi Guru' : 'Menunggu Penilaian'}
                </strong>
              </span>
              <button
                onClick={onPrint}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
              >
                Cetak Lembar Nilai
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Bagian 3: Pembahasan Kunci Jawaban Guru Terproteksi */}
      <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-600" />
            <h2 className="text-base font-bold text-slate-900">
              Panduan Kunci Jawaban Guru & Solusi Ideal
            </h2>
          </div>
          {isTeacherMode ? (
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200 flex items-center gap-1">
              <Unlock className="w-3.5 h-3.5" /> Terbuka (Akses Guru)
            </span>
          ) : (
            <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded border border-slate-200 flex items-center gap-1">
              <Lock className="w-3.5 h-3.5" /> Terkunci untuk Siswa
            </span>
          )}
        </div>

        {!isTeacherMode ? (
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="text-xs text-slate-600">
              <p className="font-semibold text-slate-800">
                Kunci Jawaban Resmi Dilindungi
              </p>
              <p className="mt-0.5">
                Bagian ini hanya dapat diakses oleh Guru Pengampu MAN 1 Cianjur untuk keperluan demonstrasi atau penilaian di kelas.
              </p>
            </div>
            <button
              onClick={onRequestTeacherAuth}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shrink-0 shadow-xs ${
                !isGroupDataFilled
                  ? 'bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300'
                  : 'text-white bg-amber-600 hover:bg-amber-700'
              }`}
              title={!isGroupDataFilled ? 'Mode Guru Terkunci: Siswa harus mengisi data kelompok terlebih dahulu' : 'Masukkan PIN Guru'}
            >
              {!isGroupDataFilled ? (
                <>
                  <Lock className="w-3.5 h-3.5 text-amber-700" />
                  <span>Guru Terkunci (Isi Kelompok)</span>
                </>
              ) : (
                <>
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Masukkan PIN Guru</span>
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="space-y-4 pt-2">
            <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-950">
              <p className="font-semibold mb-1">
                Catatan Pedagogik Guru (MAN 1 Cianjur):
              </p>
              <p className="leading-relaxed">
                Tujuan LKPD ini adalah melatih dekomposisi masalah komputasional. Pastikan siswa memahami perbedaan void function (`print()`) dan fruitful function (`return`) pada Python.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 bg-slate-900 text-slate-100 rounded-lg text-xs font-mono">
                <div className="text-slate-400 mb-1 text-[11px]"># Kunci Modul 1: Subtotal</div>
                <pre>{`def hitung_subtotal(harga_satuan, kuantitas):
    if kuantitas <= 0: return 0
    return int(harga_satuan * kuantitas)`}</pre>
              </div>

              <div className="p-3 bg-slate-900 text-slate-100 rounded-lg text-xs font-mono">
                <div className="text-slate-400 mb-1 text-[11px]"># Kunci Modul 2: Diskon Bertingkat</div>
                <pre>{`def hitung_diskon_kasir(subtotal, is_member):
    d = 0.10 if subtotal >= 100000 else 0.0
    if is_member: d += 0.05
    d = min(d, 0.20)
    return int(subtotal * d)`}</pre>
              </div>

              <div className="p-3 bg-slate-900 text-slate-100 rounded-lg text-xs font-mono">
                <div className="text-slate-400 mb-1 text-[11px]"># Kunci Modul 3: PPN & Total</div>
                <pre>{`def hitung_pajak_dan_total(subtotal, diskon, tarif_pajak=0.11):
    dasar = subtotal - diskon
    pajak = dasar * tarif_pajak
    return int(round(pajak)), int(round(dasar + pajak))`}</pre>
              </div>

              <div className="p-3 bg-slate-900 text-slate-100 rounded-lg text-xs font-mono">
                <div className="text-slate-400 mb-1 text-[11px]"># Kunci Modul 4: Cetak Struk</div>
                <pre>{`def format_struk_transaksi(nama_kasir, subtotal, diskon, pajak, total_akhir):
    return f"Kasir: {nama_kasir}\\nSubtotal: Rp {subtotal}..."`}</pre>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
