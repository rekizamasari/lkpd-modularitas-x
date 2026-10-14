import React from 'react';
import { StudentIdentity } from '../types/lkpd';
import { LKPD_METADATA, EXERCISES, KASIR_MODULES, RUBRIC_CRITERIA, REFLECTION_QUESTIONS } from '../data/lkpdData';

interface PrintableWorksheetProps {
  identity: StudentIdentity;
  studentCodes: Record<string, string>;
  moduleCodes: Record<number, string>;
  reflectionAnswers: Record<string, string>;
  rubricScores: Record<string, number>;
  teacherFeedback: string;
  teacherName: string;
  forceDisplay?: boolean;
}

export const PrintableWorksheet: React.FC<PrintableWorksheetProps> = ({
  identity,
  studentCodes,
  moduleCodes,
  reflectionAnswers,
  rubricScores,
  teacherFeedback,
  teacherName,
  forceDisplay = false,
}) => {
  const totalScoreRaw = Object.values(rubricScores).reduce((acc, curr) => acc + (curr || 0), 0);
  const finalNumericScore = Math.round((totalScoreRaw / 16) * 100);

  return (
    <div
      className={`${
        forceDisplay ? 'block w-full' : 'print-only'
      } text-slate-900 bg-white font-serif leading-normal p-4 sm:p-6 max-w-4xl mx-auto`}
    >
      {/* KOP RESMI DOKUMEN LKPD */}
      <div className="text-center pb-3 border-b-4 border-double border-slate-900 mb-6">
        <h1 className="text-sm font-bold tracking-widest uppercase mb-0.5">
          {identity.namaSekolah || 'SATUAN PENDIDIKAN MENENGAH (SMA / SMK)'}
        </h1>
        <h2 className="text-base font-extrabold uppercase tracking-tight text-slate-900">
          LEMBAR KERJA PESERTA DIDIK (LKPD) INTERAKTIF & PRAKTIKUM
        </h2>
        <div className="text-xs font-semibold text-slate-800 space-x-2 mt-1 font-sans">
          <span>Mata Pelajaran: {LKPD_METADATA.mataPelajaran}</span>
          <span>·</span>
          <span>Fase / Kelas: {LKPD_METADATA.kelasSemester}</span>
          <span>·</span>
          <span>Alokasi Waktu: {LKPD_METADATA.alokasiWaktu}</span>
        </div>
        <div className="text-xs font-bold text-slate-900 mt-1 uppercase font-sans">
          Topik: {LKPD_METADATA.topikUtama}
        </div>
      </div>

      {/* TABEL IDENTITAS PESERTA DIDIK */}
      <div className="mb-6 border border-slate-800 p-3 font-sans text-xs">
        <div className="grid grid-cols-2 gap-x-6 gap-y-2">
          <div>
            <span className="font-bold w-24 inline-block">Nama Siswa:</span>
            <span className="border-b border-dotted border-slate-700 pb-0.5 font-semibold">
              {identity.nama || '__________________________________'}
            </span>
          </div>
          <div>
            <span className="font-bold w-24 inline-block">Kelas / No:</span>
            <span className="border-b border-dotted border-slate-700 pb-0.5 font-semibold">
              {identity.kelas || '__________________'}
            </span>
          </div>
          <div>
            <span className="font-bold w-24 inline-block">Kelompok:</span>
            <span className="border-b border-dotted border-slate-700 pb-0.5 font-semibold">
              {identity.kelompok || '__________________'}
            </span>
          </div>
          <div>
            <span className="font-bold w-24 inline-block">Tanggal:</span>
            <span className="border-b border-dotted border-slate-700 pb-0.5 font-semibold">
              {identity.tanggal || '__________________'}
            </span>
          </div>
        </div>

        {/* Daftar Anggota Kelompok */}
        <div className="mt-2 pt-2 border-t border-dotted border-slate-400">
          <span className="font-bold block mb-1">Anggota Kelompok:</span>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px]">
            {identity.anggota && identity.anggota.length > 0 ? (
              identity.anggota.map((namaAnggota, idx) => (
                <div key={idx}>
                  <span className="font-semibold text-slate-700 mr-1">{idx + 1}.</span>
                  <span>{namaAnggota}</span>
                </div>
              ))
            ) : (
              <div>1. {identity.nama || '__________________________________'}</div>
            )}
          </div>
        </div>
      </div>

      {/* BAGIAN I: CAPAIAN & TUJUAN PEMBELAJARAN */}
      <section className="mb-6 font-sans text-xs space-y-2">
        <h3 className="font-bold text-sm uppercase bg-slate-100 p-1.5 border-l-4 border-slate-800 text-slate-900">
          I. Capaian & Tujuan Pembelajaran (ATP)
        </h3>
        <p className="text-slate-800 leading-relaxed italic">
          "{LKPD_METADATA.capaianPembelajaran}"
        </p>
        <div className="pl-4">
          <p className="font-bold mb-1">Tujuan Pembelajaran:</p>
          <ol className="list-decimal pl-4 space-y-1 text-slate-700">
            {LKPD_METADATA.tujuanPembelajaran.map((tp, idx) => (
              <li key={idx}>{tp}</li>
            ))}
          </ol>
        </div>
      </section>

      {/* BAGIAN II: LATIHAN TERSTRUKTUR & OPTIMASI KODE */}
      <section className="mb-6 font-sans text-xs space-y-4 page-break-inside-avoid">
        <h3 className="font-bold text-sm uppercase bg-slate-100 p-1.5 border-l-4 border-slate-800 text-slate-900">
          II. Latihan Terstruktur & Pemahaman Optimasi Kode
        </h3>

        {EXERCISES.map((ex, idx) => {
          const code = studentCodes[ex.id] || ex.starterCode;
          return (
            <div key={ex.id} className="border border-slate-400 p-3 rounded-xs space-y-2">
              <div className="flex justify-between items-center font-bold">
                <span>{idx + 1}. {ex.title}</span>
                <span className="text-[11px] text-slate-600">Bobot: 10 Poin</span>
              </div>
              <p className="text-slate-800">{ex.problemStatement}</p>
              <div className="bg-slate-50 border border-slate-300 p-2 font-mono text-[10px] leading-relaxed whitespace-pre-wrap">
                {code}
              </div>
            </div>
          );
        })}
      </section>

      {/* BAGIAN III: STUDI KASUS SISTEM KASIR OTOMATIS BERTAHAP */}
      <section className="mb-6 font-sans text-xs space-y-4 page-break-before">
        <h3 className="font-bold text-sm uppercase bg-slate-100 p-1.5 border-l-4 border-slate-800 text-slate-900">
          III. Proyek Kasir Otomatis: Dekomposisi 4 Modul Berbasis Fungsi Python
        </h3>
        <p className="text-slate-800">
          Siswa mendekomposisi alur kasir menjadi 4 modul fungsi independen berikut:
        </p>

        {KASIR_MODULES.map((mod) => {
          const code = moduleCodes[mod.step] || mod.starterCode;
          return (
            <div key={mod.step} className="border border-slate-400 p-3 rounded-xs space-y-1.5">
              <div className="flex justify-between items-center font-bold text-slate-900">
                <span>Modul {mod.step}: {mod.title}</span>
                <span className="font-mono text-[11px]">{mod.functionSignature}</span>
              </div>
              <p className="text-slate-700 text-[11px]">{mod.description}</p>
              <div className="bg-slate-50 border border-slate-300 p-2 font-mono text-[10px] leading-relaxed whitespace-pre-wrap">
                {code}
              </div>
            </div>
          );
        })}
      </section>

      {/* BAGIAN IV: LEMBAR REFLEKSI DIRI SISWA */}
      <section className="mb-6 font-sans text-xs space-y-3 page-break-inside-avoid">
        <h3 className="font-bold text-sm uppercase bg-slate-100 p-1.5 border-l-4 border-slate-800 text-slate-900">
          IV. Lembar Refleksi Pemahaman Peserta Didik
        </h3>

        {REFLECTION_QUESTIONS.map((q, idx) => (
          <div key={q.id} className="border border-slate-300 p-2.5 space-y-1">
            <p className="font-bold text-slate-900">
              {idx + 1}. {q.question}
            </p>
            <div className="p-2 bg-slate-50 border border-slate-200 text-slate-800 min-h-[50px] whitespace-pre-wrap">
              {reflectionAnswers[q.id] || '(Belum diisi oleh siswa)'}
            </div>
          </div>
        ))}
      </section>

      {/* BAGIAN V: RUBRIK PENILAIAN & PENGESAHAN GURU */}
      <section className="mb-6 font-sans text-xs space-y-4 page-break-inside-avoid">
        <h3 className="font-bold text-sm uppercase bg-slate-100 p-1.5 border-l-4 border-slate-800 text-slate-900">
          V. Rubrik Penilaian Kinerja & Pengesahan Guru Pengampu
        </h3>

        <table className="w-full border-collapse border border-slate-600 text-[11px]">
          <thead>
            <tr className="bg-slate-200">
              <th className="border border-slate-600 p-1.5 text-left">No</th>
              <th className="border border-slate-600 p-1.5 text-left">Aspek Penilaian</th>
              <th className="border border-slate-600 p-1.5 text-center">Bobot</th>
              <th className="border border-slate-600 p-1.5 text-center">Skor (1-4)</th>
              <th className="border border-slate-600 p-1.5 text-left">Keterangan Capaian</th>
            </tr>
          </thead>
          <tbody>
            {RUBRIC_CRITERIA.map((crit, idx) => {
              const score = rubricScores[crit.id] || 0;
              return (
                <tr key={crit.id}>
                  <td className="border border-slate-600 p-1.5 text-center">{idx + 1}</td>
                  <td className="border border-slate-600 p-1.5 font-bold">{crit.title}</td>
                  <td className="border border-slate-600 p-1.5 text-center">{crit.weight}%</td>
                  <td className="border border-slate-600 p-1.5 text-center font-bold text-sm">
                    {score > 0 ? score : '-'}
                  </td>
                  <td className="border border-slate-600 p-1.5 text-[10px]">
                    {score === 4
                      ? 'Sangat Mahir'
                      : score === 3
                      ? 'Mahir'
                      : score === 2
                      ? 'Cukup'
                      : score === 1
                      ? 'Perlu Bimbingan'
                      : 'Belum Dinilai'}
                  </td>
                </tr>
              );
            })}
            <tr className="bg-slate-100 font-bold">
              <td colSpan={3} className="border border-slate-600 p-1.5 text-right uppercase">
                Nilai Akhir (Skala 0 - 100):
              </td>
              <td colSpan={2} className="border border-slate-600 p-1.5 text-center text-sm">
                {totalScoreRaw === 0 ? 'Belum Dinilai (Menunggu Asesmen Guru)' : `${finalNumericScore} / 100`}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Catatan Feedback & Tanda Tangan */}
        <div className="grid grid-cols-2 gap-6 pt-4">
          <div className="border border-slate-400 p-3">
            <span className="font-bold block mb-1">Catatan Umpan Balik Guru:</span>
            <p className="text-[11px] text-slate-700 italic min-h-[60px]">
              {teacherFeedback || 'Peserta didik telah menyelesaikan seluruh modul sistem kasir otomatis sesuai kriteria.'}
            </p>
          </div>

          <div className="text-center font-sans text-xs flex flex-col justify-between">
            <div>
              <p>Mengetahui / Memeriksa,</p>
              <p className="font-semibold">Guru Mata Pelajaran Koding & AI</p>
            </div>
            <div className="my-6">
              <p className="text-slate-400">[ Tanda Tangan & Paraf ]</p>
            </div>
            <div>
              <p className="font-bold underline">
                {teacherName || '( ______________________________ )'}
              </p>
              <p className="text-[10px] text-slate-600">NIP. ..................................................</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
