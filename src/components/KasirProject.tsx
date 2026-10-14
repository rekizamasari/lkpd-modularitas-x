import React, { useState } from 'react';
import { KASIR_MODULES, INTEGRATION_FULL_PROGRAM } from '../data/lkpdData';
import { TestResult } from '../types/lkpd';
import { executePythonCode, gradeStudentFunction } from '../utils/pythonRunner';
import {
  ShoppingCart,
  Play,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  Receipt,
  Plus,
  Trash2,
  ChevronRight,
  Terminal,
  Check
} from 'lucide-react';

interface KasirProjectProps {
  moduleCodes: Record<number, string>;
  onModuleCodeChange: (step: number, code: string) => void;
  passedModules: Record<number, boolean>;
  onModulePassChange: (step: number, passed: boolean) => void;
  isTeacherMode: boolean;
  onNavigateToRubrik: () => void;
}

export const KasirProject: React.FC<KasirProjectProps> = ({
  moduleCodes,
  onModuleCodeChange,
  passedModules,
  onModulePassChange,
  isTeacherMode,
  onNavigateToRubrik,
}) => {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [testResults, setTestResults] = useState<Record<number, TestResult[]>>({});
  const [consoleOutput, setConsoleOutput] = useState<{ stdout: string; error?: string } | null>(null);

  // Live POS Simulator State
  const [cashierName, setCashierName] = useState('Budi Santoso');
  const [isMember, setIsMember] = useState(true);
  const [cartItems, setCartItems] = useState<Array<{ id: number; nama: string; harga: number; qty: number }>>([
    { id: 1, nama: 'Buku Tulis Hardcover', harga: 15000, qty: 4 },
    { id: 2, nama: 'Flashdisk 32GB Koding', harga: 65000, qty: 1 },
    { id: 3, nama: 'Pulpen Gel AI', harga: 5000, qty: 2 },
  ]);
  const [generatedReceipt, setGeneratedReceipt] = useState<string | null>(null);
  const [posError, setPosError] = useState<string | null>(null);

  const currentModule = KASIR_MODULES.find((m) => m.step === activeStep);
  const currentCode = currentModule
    ? moduleCodes[currentModule.step] ?? currentModule.starterCode
    : '';

  const handleRunScript = () => {
    if (!currentModule) return;
    const result = executePythonCode(currentCode);
    setConsoleOutput({
      stdout: result.stdout || (result.success ? '(Kode berhasil dijalankan tanpa error)' : ''),
      error: result.error,
    });
  };

  const handleGradeModule = () => {
    if (!currentModule) return;
    const grade = gradeStudentFunction(currentCode, currentModule.functionName, currentModule.testCases);
    setTestResults((prev) => ({
      ...prev,
      [currentModule.step]: grade.results,
    }));
    onModulePassChange(currentModule.step, grade.passedAll);

    const failed = grade.results.find((r) => r.error);
    if (failed && failed.error) {
      setConsoleOutput({ stdout: '', error: failed.error });
    }
  };

  const handleResetModule = () => {
    if (!currentModule) return;
    if (confirm(`Kembalikan kode ${currentModule.title} ke template awal?`)) {
      onModuleCodeChange(currentModule.step, currentModule.starterCode);
      setConsoleOutput(null);
      setTestResults((prev) => ({ ...prev, [currentModule.step]: [] }));
      onModulePassChange(currentModule.step, false);
    }
  };

  const handleLoadSolution = () => {
    if (!currentModule) return;
    onModuleCodeChange(currentModule.step, currentModule.solutionCode);
  };

  // Live Simulation Handler: compiles all 4 modules together into the full orchestrator
  const handleRunSimulation = () => {
    setPosError(null);
    setGeneratedReceipt(null);

    // Build complete python code by assembling the student's 4 functions
    const mod1 = moduleCodes[1] || KASIR_MODULES[0].starterCode;
    const mod2 = moduleCodes[2] || KASIR_MODULES[1].starterCode;
    const mod3 = moduleCodes[3] || KASIR_MODULES[2].starterCode;
    const mod4 = moduleCodes[4] || KASIR_MODULES[3].starterCode;

    const cartJson = JSON.stringify(
      cartItems.map((item) => ({ nama: item.nama, harga: item.harga, jumlah: item.qty }))
    );

    const simulationScript = `
${mod1}
${mod2}
${mod3}
${mod4}

# Orchestrator
daftar_belanja = ${cartJson}
nama_kasir = "${cashierName}"
is_member = ${isMember ? 'True' : 'False'}

subtotal_keseluruhan = 0
for item in daftar_belanja:
    subtotal_item = hitung_subtotal(item['harga'], item['jumlah'])
    subtotal_keseluruhan += subtotal_item

diskon = hitung_diskon_kasir(subtotal_keseluruhan, is_member)
pajak, total_akhir = hitung_pajak_dan_total(subtotal_keseluruhan, diskon)
struk = format_struk_transaksi(nama_kasir, subtotal_keseluruhan, diskon, pajak, total_akhir)
print(struk)
`;

    const run = executePythonCode(simulationScript);
    if (!run.success) {
      setPosError(
        run.error ||
          'Terjadi kesalahan saat memproses modul gabungan. Pastikan Modul 1 sampai Modul 4 telah lengkap dan lolos uji kasus.'
      );
    } else {
      setGeneratedReceipt(run.stdout || 'Transaksi berhasil diproses.');
    }
  };

  const addItemToCart = () => {
    setCartItems((prev) => [
      ...prev,
      {
        id: Date.now(),
        nama: 'Kabel Data Type-C',
        harga: 25000,
        qty: 1,
      },
    ]);
  };

  const removeItemFromCart = (id: number) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateCartItem = (id: number, field: 'harga' | 'qty', val: number) => {
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: val } : item))
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Studi Kasus Kasir */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ShoppingCart className="w-5 h-5 text-blue-600" />
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Studi Kasus Proyek Nyata
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Rancang Bangun Sistem Kasir Otomatis Berbasis Fungsi Python
            </h1>
            <p className="text-xs text-slate-600 mt-1 max-w-3xl leading-relaxed">
              Pecahkan masalah pembuatan sistem kasir ke dalam 4 modul fungsi independen. Uji setiap fungsi secara terisolasi, lalu integrasikan ke dalam mesin kasir terpadu.
            </p>
          </div>

          {/* Stepper Progress Bar */}
          <div className="flex items-center gap-1 sm:gap-2">
            {[1, 2, 3, 4, 5].map((s) => {
              const isPassed = s === 5 ? Object.values(passedModules).filter(Boolean).length === 4 : passedModules[s];
              const isActive = activeStep === s;
              return (
                <button
                  key={s}
                  onClick={() => {
                    setActiveStep(s);
                    setConsoleOutput(null);
                  }}
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition-all flex items-center justify-center ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xs'
                      : isPassed
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                  title={s === 5 ? 'Simulasi Kasir Live' : `Modul ${s}`}
                >
                  {s === 5 ? <Receipt className="w-4 h-4" /> : isPassed ? '✓' : s}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Jika Memilih Step 1-4 (Modul Fungsi) */}
      {currentModule && activeStep <= 4 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Kolom Kiri: Spesifikasi Fungsi (5 Kolom) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">
                  Tahap {currentModule.step} dari 4
                </span>
                {passedModules[currentModule.step] && (
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                    <Check className="w-3 h-3" /> Terverifikasi
                  </span>
                )}
              </div>

              <h2 className="text-base font-bold text-slate-900 mb-1">
                {currentModule.title}
              </h2>

              <div className="font-mono text-xs text-blue-700 bg-blue-50/70 p-2 rounded border border-blue-200 mb-3">
                {currentModule.functionSignature}
              </div>

              <p className="text-xs text-slate-700 whitespace-pre-wrap leading-relaxed mb-4">
                {currentModule.description}
              </p>

              {/* Tabel Parameter */}
              <div className="mb-4">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Parameter Masukan:
                </h3>
                <div className="space-y-1.5">
                  {currentModule.parameters.map((p, idx) => (
                    <div key={idx} className="p-2 rounded bg-slate-50 border border-slate-200 text-xs">
                      <div className="flex items-center justify-between font-mono text-[11px]">
                        <span className="font-bold text-slate-900">{p.name}</span>
                        <span className="text-slate-500 font-sans">{p.type}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-0.5">{p.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Nilai Balik (Return Value) */}
              <div className="p-3 rounded-lg bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-950 mb-4">
                <strong className="block text-emerald-900 font-bold mb-0.5">
                  Nilai Balik (Return Value):
                </strong>
                <span>{currentModule.returnValueDesc}</span>
              </div>

              {/* Contoh Panggilan */}
              <div className="p-2.5 rounded bg-slate-900 text-slate-200 font-mono text-[11px] overflow-x-auto">
                <span className="text-slate-400"># Contoh Panggilan:</span>
                <br />
                {currentModule.sampleCall}
              </div>

              {isTeacherMode && (
                <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={handleLoadSolution}
                    className="text-xs font-bold text-amber-800 bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded transition-colors"
                  >
                    Muat Solusi Modul {currentModule.step}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Kolom Kanan: Editor Kode Python & Autograder (7 Kolom) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-sm overflow-hidden flex flex-col">
              <div className="px-4 py-2.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                  <span className="font-mono text-slate-300">
                    kasir_modul_{currentModule.step}.py
                  </span>
                </div>
                <button
                  onClick={handleResetModule}
                  className="hover:text-slate-200 flex items-center gap-1 text-[11px]"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              </div>

              <div className="p-3">
                <textarea
                  value={currentCode}
                  onChange={(e) => onModuleCodeChange(currentModule.step, e.target.value)}
                  rows={12}
                  spellCheck={false}
                  className="w-full bg-transparent font-mono text-xs sm:text-sm text-slate-100 focus:outline-hidden leading-relaxed resize-y selection:bg-blue-600/40"
                />
              </div>

              <div className="px-4 py-2.5 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
                <button
                  onClick={handleRunScript}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-md transition-colors flex items-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5 text-blue-400" />
                  <span>Jalankan Kode</span>
                </button>

                <button
                  onClick={handleGradeModule}
                  className="px-4 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                  <span>Uji Unit Test Modul {currentModule.step}</span>
                </button>
              </div>
            </div>

            {/* Console Output */}
            {consoleOutput && (
              <div className="bg-slate-900 text-slate-200 rounded-xl border border-slate-800 p-4 font-mono text-xs shadow-xs">
                <div className="flex items-center gap-1.5 text-slate-400 mb-2 border-b border-slate-800 pb-1.5">
                  <Terminal className="w-3.5 h-3.5" />
                  <span className="font-semibold text-[11px]">Output Konsol</span>
                </div>
                {consoleOutput.error ? (
                  <div className="text-rose-400 whitespace-pre-wrap">{consoleOutput.error}</div>
                ) : (
                  <div className="text-emerald-300 whitespace-pre-wrap">{consoleOutput.stdout}</div>
                )}
              </div>
            )}

            {/* Hasil Autograder Unit Test */}
            {testResults[currentModule.step]?.length > 0 && (
              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-2.5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Hasil Verifikasi Kasus Uji:
                  </span>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded ${
                      passedModules[currentModule.step]
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {testResults[currentModule.step].filter((r) => r.passed).length} /{' '}
                    {testResults[currentModule.step].length} Lolos
                  </span>
                </div>

                <div className="space-y-2">
                  {testResults[currentModule.step].map((res, i) => (
                    <div
                      key={i}
                      className={`p-2.5 rounded-lg border text-xs flex items-start gap-2.5 ${
                        res.passed
                          ? 'bg-emerald-50/60 border-emerald-200 text-slate-800'
                          : 'bg-rose-50/60 border-rose-200 text-slate-800'
                      }`}
                    >
                      {res.passed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1 space-y-1">
                        <div className="font-semibold text-slate-900">{res.description}</div>
                        <div className="text-[11px] text-slate-600 font-mono">
                          Ekspektasi: <span className="text-blue-700">{res.expectedText}</span> · Hasil
                          Fungsi:{' '}
                          <span
                            className={
                              res.passed ? 'text-emerald-700 font-bold' : 'text-rose-700 font-bold'
                            }
                          >
                            {res.actualText}
                          </span>
                        </div>
                        {res.error && (
                          <div className="text-[11px] text-rose-600 bg-rose-100/70 p-1.5 rounded">
                            {res.error}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Navigasi Antar Modul */}
            <div className="flex justify-between items-center pt-2">
              <button
                disabled={activeStep === 1}
                onClick={() => {
                  setActiveStep((prev) => prev - 1);
                  setConsoleOutput(null);
                }}
                className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:pointer-events-none"
              >
                ← Modul Sebelumnya
              </button>

              <button
                onClick={() => {
                  setActiveStep((prev) => prev + 1);
                  setConsoleOutput(null);
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-1 shadow-xs"
              >
                <span>{activeStep === 4 ? 'Simulasi Kasir Live' : 'Modul Berikutnya'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 5: Integrasi & Simulasi Kasir Live */}
      {activeStep === 5 && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <h2 className="text-lg font-bold text-slate-900">
                Simulasi Kasir Live: Pengujian Integrasi 4 Modul
              </h2>
            </div>
            <p className="text-xs text-slate-600 mb-6 leading-relaxed">
              Di sini, keempat modul yang telah Anda selesaikan dijalankan bersamaan untuk memproses transaksi belanja nyata. Ubah barang belanjaan atau status pelanggan, lalu tekan <strong>Proses Transaksi Kasir</strong>.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Kolom Kiri: Pengaturan Transaksi Belanja (7 Kolom) */}
              <div className="lg:col-span-7 space-y-4">
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Nama Petugas Kasir:
                      </label>
                      <input
                        type="text"
                        value={cashierName}
                        onChange={(e) => setCashierName(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Status Pelanggan:
                      </label>
                      <button
                        type="button"
                        onClick={() => setIsMember(!isMember)}
                        className={`w-full px-3 py-1.5 text-xs font-semibold rounded-md border text-left transition-colors flex items-center justify-between ${
                          isMember
                            ? 'bg-amber-50 text-amber-900 border-amber-300'
                            : 'bg-white text-slate-700 border-slate-300'
                        }`}
                      >
                        <span>{isMember ? '⭐ Kartu Member Aktif (Diskon +5%)' : 'Pelanggan Reguler'}</span>
                        <span className="text-[10px] underline">Ubah</span>
                      </button>
                    </div>
                  </div>

                  {/* Daftar Keranjang Belanja */}
                  <div className="pt-2">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-800">
                        Item Keranjang Belanja:
                      </span>
                      <button
                        onClick={addItemToCart}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Tambah Barang</span>
                      </button>
                    </div>

                    <div className="space-y-2">
                      {cartItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-2 bg-white p-2.5 rounded-md border border-slate-200 text-xs"
                        >
                          <input
                            type="text"
                            value={item.nama}
                            onChange={(e) => {
                              const v = e.target.value;
                              setCartItems((prev) =>
                                prev.map((x) => (x.id === item.id ? { ...x, nama: v } : x))
                              );
                            }}
                            className="flex-1 px-2 py-1 bg-slate-50 border border-slate-200 rounded font-medium"
                          />
                          <div className="flex items-center gap-1">
                            <span className="text-slate-400 text-[11px]">Rp</span>
                            <input
                              type="number"
                              value={item.harga}
                              onChange={(e) =>
                                updateCartItem(item.id, 'harga', Number(e.target.value))
                              }
                              className="w-20 px-2 py-1 bg-slate-50 border border-slate-200 rounded font-mono tabular-nums text-right"
                            />
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-slate-400 text-[11px]">x</span>
                            <input
                              type="number"
                              min={1}
                              value={item.qty}
                              onChange={(e) =>
                                updateCartItem(item.id, 'qty', Number(e.target.value))
                              }
                              className="w-12 px-2 py-1 bg-slate-50 border border-slate-200 rounded font-mono tabular-nums text-center"
                            />
                          </div>
                          <button
                            onClick={() => removeItemFromCart(item.id)}
                            className="p-1 text-slate-400 hover:text-rose-600"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={handleRunSimulation}
                      className="w-full py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs"
                    >
                      <Receipt className="w-4 h-4" />
                      <span>Proses Transaksi Kasir (Jalankan 4 Modul)</span>
                    </button>
                  </div>
                </div>

                {isTeacherMode && (
                  <div className="p-4 rounded-lg bg-amber-50 border border-amber-200 text-xs">
                    <span className="font-bold text-amber-900 block mb-1">
                      Mode Guru: Program Lengkap Standar Industri
                    </span>
                    <p className="text-amber-800 mb-2">
                      Berikut kode orchestrator standar untuk demonstrasi di depan kelas.
                    </p>
                    <details className="cursor-pointer">
                      <summary className="font-semibold text-amber-900">
                        Lihat Program Lengkap Integrasi (.py)
                      </summary>
                      <pre className="mt-2 p-3 bg-slate-900 text-slate-100 rounded text-[11px] font-mono overflow-x-auto">
                        {INTEGRATION_FULL_PROGRAM}
                      </pre>
                    </details>
                  </div>
                )}
              </div>

              {/* Kolom Kanan: Tampilan Struk Kasir Nyata (5 Kolom) */}
              <div className="lg:col-span-5 flex flex-col items-center">
                <div className="w-full max-w-sm bg-white border border-slate-300 rounded-lg shadow-md p-6 font-mono text-xs text-slate-900 flex flex-col justify-between min-h-[360px] relative">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-repeating-linear-gradient" />
                  <div>
                    <div className="text-center pb-3 border-b border-dashed border-slate-300 mb-3">
                      <h3 className="font-extrabold text-sm tracking-wider">MINIMARKET CERDAS AI</h3>
                      <p className="text-[10px] text-slate-500 font-sans">
                        Jl. Pendidikan No. 10 · Kelas X AP
                      </p>
                    </div>

                    {posError ? (
                      <div className="p-3 bg-rose-50 border border-rose-200 rounded text-rose-700 text-xs font-sans">
                        <strong>Gagal Mencetak Struk:</strong>
                        <p className="mt-1">{posError}</p>
                      </div>
                    ) : generatedReceipt ? (
                      <div className="whitespace-pre-wrap leading-relaxed text-slate-800 bg-slate-50 p-3 rounded border border-slate-200 text-[11px]">
                        {generatedReceipt}
                      </div>
                    ) : (
                      <div className="py-12 text-center text-slate-400 font-sans text-xs">
                        <Receipt className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                        <span>Klik tombol "Proses Transaksi Kasir" untuk melihat hasil struk belanja yang dicetak oleh modul fungsi Anda.</span>
                      </div>
                    )}
                  </div>

                  <div className="text-center pt-3 border-t border-dashed border-slate-300 mt-4 text-[10px] text-slate-500 font-sans">
                    Terima Kasih Atas Kunjungan Anda
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-6 border-t border-slate-100">
              <button
                onClick={() => setActiveStep(4)}
                className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900"
              >
                ← Kembali ke Modul 4
              </button>

              <button
                onClick={onNavigateToRubrik}
                className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-1 shadow-xs"
              >
                <span>Lanjut ke Lembar Refleksi & Rubrik Penilaian</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
