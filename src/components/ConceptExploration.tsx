import React, { useState } from 'react';
import { LKPD_METADATA } from '../data/lkpdData';
import { BookOpen, Sparkles, Layers, ArrowRight, Check, AlertTriangle, Code, Play } from 'lucide-react';

export const ConceptExploration: React.FC<{ onNavigateToExercises: () => void }> = ({
  onNavigateToExercises,
}) => {
  const [selectedView, setSelectedView] = useState<'perbandingan' | 'anatomi' | 'alur'>('perbandingan');

  return (
    <div className="space-y-8">
      {/* Kartu Header Materi & Capaian Pembelajaran */}
      <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="w-5 h-5 text-blue-600" />
          <span className="text-xs font-bold tracking-wider uppercase text-blue-600">
            Fase E · Kurikulum Merdeka
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
          {LKPD_METADATA.topikUtama}
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed max-w-4xl mb-4">
          {LKPD_METADATA.capaianPembelajaran}
        </p>

        {/* Tujuan Pembelajaran */}
        <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            Tujuan Pembelajaran (Alur Tujuan Pembelajaran)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-700">
            {LKPD_METADATA.tujuanPembelajaran.map((tp, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold shrink-0 text-[10px]">
                  {idx + 1}
                </span>
                <span>{tp}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tabs Eksplorasi Konsep */}
      <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-lg max-w-fit">
        <button
          onClick={() => setSelectedView('perbandingan')}
          className={`px-4 py-2 text-xs font-semibold rounded-md transition-all ${
            selectedView === 'perbandingan'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          1. Monolitik vs Modular
        </button>
        <button
          onClick={() => setSelectedView('anatomi')}
          className={`px-4 py-2 text-xs font-semibold rounded-md transition-all ${
            selectedView === 'anatomi'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          2. Anatomi Fungsi & Return
        </button>
        <button
          onClick={() => setSelectedView('alur')}
          className={`px-4 py-2 text-xs font-semibold rounded-md transition-all ${
            selectedView === 'alur'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          3. Dekomposisi Sistem Kasir
        </button>
      </div>

      {/* Tab Content 1: Perbandingan Monolitik vs Modular */}
      {selectedView === 'perbandingan' && (
        <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-1">
              Mengapa Kita Membutuhkan Modularitas?
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Bayangkan Anda membuat program kasir untuk minimarket. Ketika pelanggan membeli 5 barang, apakah Anda akan mengetik rumus hitung diskon dan pajak sebanyak 5 kali secara berulang? Inilah bahaya <strong>Spaghetti Code</strong> (kode monolitik).
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Box Monolitik */}
            <div className="rounded-xl border border-rose-200 bg-rose-50/40 p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-rose-800 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    Kode Monolitik (Tanpa Fungsi)
                  </span>
                  <span className="text-[11px] font-semibold text-rose-700 bg-rose-100 px-2 py-0.5 rounded">
                    Beresiko & Redundan
                  </span>
                </div>
                <p className="text-xs text-rose-900/80 mb-3">
                  Rumus diulang-ulang. Jika tarif PPN berubah dari 11% ke 12%, Anda harus mengedit puluhan baris kode manual!
                </p>
                <div className="bg-slate-900 text-slate-100 rounded-lg p-3 font-mono text-[11px] overflow-x-auto leading-relaxed border border-slate-800">
                  <pre>{`# Barang 1
harga1 = 20000; qty1 = 2
subtotal1 = harga1 * qty1
diskon1 = subtotal1 * 0.10 if subtotal1 > 100000 else 0
pajak1 = (subtotal1 - diskon1) * 0.11
total1 = (subtotal1 - diskon1) + pajak1

# Barang 2 (RUMUS DIULANG LAGI)
harga2 = 50000; qty2 = 3
subtotal2 = harga2 * qty2
diskon2 = subtotal2 * 0.10 if subtotal2 > 100000 else 0
pajak2 = (subtotal2 - diskon2) * 0.11
total2 = (subtotal2 - diskon2) + pajak2`}</pre>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-rose-200/80 text-[11px] text-rose-700 space-y-1">
                <div>✕ Melanggar prinsip DRY (Don't Repeat Yourself)</div>
                <div>✕ Sangat sulit diperbaiki jika terjadi bug</div>
                <div>✕ Tidak dapat diuji dengan unit test mandiri</div>
              </div>
            </div>

            {/* Box Modular */}
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-emerald-600" />
                    Kode Modular (Berbasis Fungsi)
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    Bersih & Optimal
                  </span>
                </div>
                <p className="text-xs text-emerald-900/80 mb-3">
                  Rumus ditulis <strong>satu kali saja</strong> dalam fungsi. Pemanggil cukup memberikan argumen yang berbeda.
                </p>
                <div className="bg-slate-900 text-slate-100 rounded-lg p-3 font-mono text-[11px] overflow-x-auto leading-relaxed border border-slate-800">
                  <pre>{`def hitung_total_item(harga, qty, tarif_pajak=0.11):
    subtotal = harga * qty
    diskon = subtotal * 0.10 if subtotal >= 100000 else 0
    pajak = (subtotal - diskon) * tarif_pajak
    return (subtotal - diskon) + pajak

# Digunakan berulang kali dengan bersih:
total1 = hitung_total_item(20000, 2)
total2 = hitung_total_item(50000, 3)`}</pre>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-emerald-200/80 text-[11px] text-emerald-700 space-y-1">
                <div>✓ Menerapkan prinsip DRY (Efisien & Hemat Baris)</div>
                <div>✓ Reusable: dapat dipanggil puluhan kali di file manapun</div>
                <div>✓ Single Point of Update: ganti tarif pajak cukup pada 1 baris</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Tab Content 2: Anatomi Fungsi & Return Value */}
      {selectedView === 'anatomi' && (
        <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-1">
              Anatomi Fungsi Python & Mekanisme Nilai Balik (Return)
            </h2>
            <p className="text-xs text-slate-600">
              Fungsi adalah blok kode terorganisir yang menerima masukan (*input/parameter*), memprosesnya, dan mengembalikan keluaran (*output/return value*).
            </p>
          </div>

          <div className="bg-slate-900 text-slate-100 rounded-xl p-5 font-mono text-xs sm:text-sm border border-slate-800">
            <div className="text-slate-400 mb-3 text-xs font-sans">
              # Perhatikan bagian-bagian penting di bawah ini:
            </div>
            <div className="space-y-1">
              <div>
                <span className="text-purple-400 font-bold">def</span>{' '}
                <span className="text-blue-400 font-bold">hitung_subtotal</span>
                <span className="text-slate-300">(</span>
                <span className="text-amber-300">harga_satuan</span>
                <span className="text-slate-300">, </span>
                <span className="text-amber-300">kuantitas</span>
                <span className="text-slate-300">):</span>
                <span className="text-slate-500 ml-4 font-sans text-xs">
                  ← Header Fungsi (Nama & Parameter)
                </span>
              </div>
              <div className="pl-6 text-slate-300">
                total = <span className="text-amber-300">harga_satuan</span> *{' '}
                <span className="text-amber-300">kuantitas</span>
                <span className="text-slate-500 ml-4 font-sans text-xs">
                  ← Badan Fungsi (Logika Komputasi)
                </span>
              </div>
              <div className="pl-6">
                <span className="text-purple-400 font-bold">return</span>{' '}
                <span className="text-emerald-400 font-bold">total</span>
                <span className="text-slate-500 ml-4 font-sans text-xs">
                  ← Nilai Balik (Mengirim hasil ke pemanggil)
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Code className="w-3.5 h-3.5 text-blue-600" />
                Parameter vs Argumen
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                <strong>Parameter</strong> adalah variabel penampung yang ditulis saat mendefinisikan fungsi (misal: <code className="bg-slate-200 px-1 rounded">harga_satuan</code>).<br />
                <strong>Argumen</strong> adalah nilai konkret yang dikirimkan saat fungsi dipanggil (misal: <code className="bg-slate-200 px-1 rounded">hitung_subtotal(15000, 3)</code>).
              </p>
            </div>

            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Play className="w-3.5 h-3.5 text-emerald-600" />
                Return vs Print (Kesalahan Umum Siswa)
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                <strong>print()</strong> hanya menampilkan teks ke layar monitor, nilainya tidak dapat diolah lagi.<br />
                <strong>return</strong> mengembalikan nilai kembali ke pemanggil sehingga hasilnya bisa ditampung ke variabel atau dihitung ke rumus berikutnya.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Tab Content 3: Dekomposisi Sistem Kasir */}
      {selectedView === 'alur' && (
        <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-1">
              Peta Dekomposisi: 4 Modul Sistem Kasir Otomatis
            </h2>
            <p className="text-xs text-slate-600">
              Dalam studi kasus ini, masalah kasir yang rumit dipecah menjadi 4 fungsi mandiri yang saling berkolaborasi secara runtut:
            </p>
          </div>

          {/* Interactive Flow Diagram */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 relative">
            <div className="p-4 rounded-lg bg-blue-50/70 border border-blue-200 text-center">
              <span className="text-[10px] font-bold text-blue-700 uppercase block mb-1">
                Modul 1
              </span>
              <h3 className="text-xs font-bold text-slate-900 mb-1">
                hitung_subtotal
              </h3>
              <p className="text-[11px] text-slate-600 mb-2">
                harga * kuantitas
              </p>
              <div className="text-[10px] bg-white text-blue-800 font-mono py-1 px-2 rounded border border-blue-100">
                Output: Subtotal (Rp)
              </div>
            </div>

            <div className="p-4 rounded-lg bg-amber-50/70 border border-amber-200 text-center">
              <span className="text-[10px] font-bold text-amber-700 uppercase block mb-1">
                Modul 2
              </span>
              <h3 className="text-xs font-bold text-slate-900 mb-1">
                hitung_diskon_kasir
              </h3>
              <p className="text-[11px] text-slate-600 mb-2">
                aturan belanja & member
              </p>
              <div className="text-[10px] bg-white text-amber-800 font-mono py-1 px-2 rounded border border-amber-100">
                Output: Diskon (Rp)
              </div>
            </div>

            <div className="p-4 rounded-lg bg-emerald-50/70 border border-emerald-200 text-center">
              <span className="text-[10px] font-bold text-emerald-700 uppercase block mb-1">
                Modul 3
              </span>
              <h3 className="text-xs font-bold text-slate-900 mb-1">
                hitung_pajak_dan_total
              </h3>
              <p className="text-[11px] text-slate-600 mb-2">
                PPN 11% & total bersih
              </p>
              <div className="text-[10px] bg-white text-emerald-800 font-mono py-1 px-2 rounded border border-emerald-100">
                Output: (pajak, total)
              </div>
            </div>

            <div className="p-4 rounded-lg bg-purple-50/70 border border-purple-200 text-center">
              <span className="text-[10px] font-bold text-purple-700 uppercase block mb-1">
                Modul 4
              </span>
              <h3 className="text-xs font-bold text-slate-900 mb-1">
                format_struk_transaksi
              </h3>
              <p className="text-[11px] text-slate-600 mb-2">
                komposisi f-string
              </p>
              <div className="text-[10px] bg-white text-purple-800 font-mono py-1 px-2 rounded border border-purple-100">
                Output: Teks Struk
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={onNavigateToExercises}
              className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <span>Lanjut ke Latihan Terstruktur</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </section>
      )}
    </div>
  );
};
