import React, { useState } from 'react';
import { EXERCISES } from '../data/lkpdData';
import { TestResult } from '../types/lkpd';
import { executePythonCode, gradeStudentFunction } from '../utils/pythonRunner';
import {
  Play,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  Sparkles,
  Terminal,
  Check,
  ChevronRight,
  BookOpen
} from 'lucide-react';

interface StructuredExercisesProps {
  studentCodes: Record<string, string>;
  onCodeChange: (exerciseId: string, newCode: string) => void;
  passedExercises: Record<string, boolean>;
  onPassChange: (exerciseId: string, passed: boolean) => void;
  isTeacherMode: boolean;
  onNavigateToKasir: () => void;
}

export const StructuredExercises: React.FC<StructuredExercisesProps> = ({
  studentCodes,
  onCodeChange,
  passedExercises,
  onPassChange,
  isTeacherMode,
  onNavigateToKasir,
}) => {
  const [activeExerciseIndex, setActiveExerciseIndex] = useState(0);
  const [consoleOutput, setConsoleOutput] = useState<{ stdout: string; error?: string } | null>(null);
  const [testResults, setTestResults] = useState<Record<string, TestResult[]>>({});
  const [showHint, setShowHint] = useState<Record<string, boolean>>({});

  const currentExercise = EXERCISES[activeExerciseIndex];
  const currentCode = studentCodes[currentExercise.id] ?? currentExercise.starterCode;

  // Run the code as a normal script
  const handleRunScript = () => {
    const result = executePythonCode(currentCode);
    setConsoleOutput({
      stdout: result.stdout || (result.success ? '(Kode berhasil dijalankan tanpa output print)' : ''),
      error: result.error,
    });
  };

  // Run autograder test cases
  const handleGrade = () => {
    // Extract target function name from first test
    const targetFnMatch = currentCode.match(/def\s+([a-zA-Z0-9_]+)\s*\(/);
    const fnName = targetFnMatch ? targetFnMatch[1] : '';

    const grade = gradeStudentFunction(currentCode, fnName, currentExercise.testCases);
    setTestResults((prev) => ({
      ...prev,
      [currentExercise.id]: grade.results,
    }));

    onPassChange(currentExercise.id, grade.passedAll);

    // If there's an error, also output to console
    const failedWithErr = grade.results.find((r) => r.error);
    if (failedWithErr && failedWithErr.error) {
      setConsoleOutput({
        stdout: '',
        error: failedWithErr.error,
      });
    }
  };

  const handleResetCode = () => {
    if (confirm('Kembalikan kode latihan ini ke template awal?')) {
      onCodeChange(currentExercise.id, currentExercise.starterCode);
      setConsoleOutput(null);
      setTestResults((prev) => ({ ...prev, [currentExercise.id]: [] }));
      onPassChange(currentExercise.id, false);
    }
  };

  const handleLoadSolution = () => {
    onCodeChange(currentExercise.id, currentExercise.solutionCode);
  };

  const currentResults = testResults[currentExercise.id] || [];
  const isCurrentPassed = passedExercises[currentExercise.id] || false;

  return (
    <div className="space-y-6">
      {/* Exercise Selector Segmented Tabs */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {EXERCISES.map((ex, idx) => {
            const isPassed = passedExercises[ex.id];
            const isActive = idx === activeExerciseIndex;
            return (
              <button
                key={ex.id}
                onClick={() => {
                  setActiveExerciseIndex(idx);
                  setConsoleOutput(null);
                }}
                className={`px-3 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {isPassed ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-slate-300" />
                )}
                <span>{ex.title.split(':')[0]}</span>
              </button>
            );
          })}
        </div>

        <div className="text-xs font-medium text-slate-500">
          Tingkat: <span className="font-bold text-slate-800">{currentExercise.level}</span>
        </div>
      </div>

      {/* Main Exercise Layout: Split 2 Columns (Deskripsi & Editor) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Problem Statement & Guide (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">
                {currentExercise.subtitle}
              </span>
              {isCurrentPassed && (
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                  <Check className="w-3 h-3" /> Lulus Tes
                </span>
              )}
            </div>

            <h2 className="text-base font-bold text-slate-900 mb-2">
              {currentExercise.title}
            </h2>

            <p className="text-xs text-slate-700 leading-relaxed mb-4">
              {currentExercise.problemStatement}
            </p>

            {/* Petunjuk Langkah */}
            <div className="bg-slate-50 rounded-lg p-3.5 border border-slate-200 mb-4">
              <h3 className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                Panduan Pengerjaan:
              </h3>
              <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-4">
                {currentExercise.guidance.map((g, i) => (
                  <li key={i}>{g}</li>
                ))}
              </ul>
            </div>

            {/* Konsep Optimasi */}
            <div className="bg-blue-50/70 rounded-lg p-3 border border-blue-200 text-xs text-blue-900">
              <strong className="flex items-center gap-1 text-blue-800 mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                Fokus Optimasi Kode:
              </strong>
              <p>{currentExercise.optimizationConcept}</p>
            </div>

            {/* Toggle Hint */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() =>
                  setShowHint((prev) => ({
                    ...prev,
                    [currentExercise.id]: !prev[currentExercise.id],
                  }))
                }
                className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1"
              >
                <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
                <span>{showHint[currentExercise.id] ? 'Sembunyikan Petunjuk' : 'Butuh Bantuan / Hint?'}</span>
              </button>

              {isTeacherMode && (
                <button
                  onClick={handleLoadSolution}
                  className="text-xs font-bold text-amber-800 bg-amber-100 hover:bg-amber-200 px-2.5 py-1 rounded transition-colors"
                >
                  Muat Kunci Guru
                </button>
              )}
            </div>

            {showHint[currentExercise.id] && (
              <div className="mt-3 p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-900 leading-relaxed">
                {currentExercise.explanation}
              </div>
            )}
          </div>
        </div>

        {/* Right: Code Editor & Test Cases (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-sm overflow-hidden flex flex-col">
            {/* Editor Toolbar */}
            <div className="px-4 py-2.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                <span className="font-mono text-slate-300">python · solution.py</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleResetCode}
                  title="Kembalikan ke template"
                  className="hover:text-slate-200 p-1 transition-colors flex items-center gap-1 text-[11px]"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              </div>
            </div>

            {/* Code Textarea */}
            <div className="relative p-3">
              <textarea
                value={currentCode}
                onChange={(e) => onCodeChange(currentExercise.id, e.target.value)}
                rows={11}
                spellCheck={false}
                className="w-full bg-transparent font-mono text-xs sm:text-sm text-slate-100 focus:outline-hidden leading-relaxed resize-y selection:bg-blue-600/40"
              />
            </div>

            {/* Editor Action Buttons */}
            <div className="px-4 py-2.5 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
              <button
                onClick={handleRunScript}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-md transition-colors flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 text-blue-400" />
                <span>Jalankan Kode</span>
              </button>

              <button
                onClick={handleGrade}
                className="px-4 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                <span>Uji Solusi (Autograder)</span>
              </button>
            </div>
          </div>

          {/* Console Output (jika ada output print / error) */}
          {consoleOutput && (
            <div className="bg-slate-900 text-slate-200 rounded-xl border border-slate-800 p-4 font-mono text-xs shadow-xs">
              <div className="flex items-center gap-1.5 text-slate-400 mb-2 border-b border-slate-800 pb-1.5">
                <Terminal className="w-3.5 h-3.5" />
                <span className="font-semibold text-[11px]">Output Konsol / Terminal</span>
              </div>
              {consoleOutput.error ? (
                <div className="text-rose-400 whitespace-pre-wrap leading-relaxed">
                  {consoleOutput.error}
                </div>
              ) : (
                <div className="text-emerald-300 whitespace-pre-wrap leading-relaxed">
                  {consoleOutput.stdout}
                </div>
              )}
            </div>
          )}

          {/* Autograder Test Cases Card */}
          {currentResults.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-2.5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Hasil Unit Test Kasus Uji:
                </span>
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded ${
                    isCurrentPassed
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {currentResults.filter((r) => r.passed).length} / {currentResults.length} Lolos
                </span>
              </div>

              <div className="space-y-2">
                {currentResults.map((res, i) => (
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
                        Ekspektasi: <span className="text-blue-700">{res.expectedText}</span> · Hasil Siswa:{' '}
                        <span className={res.passed ? 'text-emerald-700 font-bold' : 'text-rose-700 font-bold'}>
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

          {/* Navigasi Soal Berikutnya / Ke Kasir */}
          <div className="flex justify-between items-center pt-2">
            <button
              disabled={activeExerciseIndex === 0}
              onClick={() => {
                setActiveExerciseIndex((prev) => prev - 1);
                setConsoleOutput(null);
              }}
              className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:pointer-events-none"
            >
              ← Soal Sebelumnya
            </button>

            {activeExerciseIndex < EXERCISES.length - 1 ? (
              <button
                onClick={() => {
                  setActiveExerciseIndex((prev) => prev + 1);
                  setConsoleOutput(null);
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-1 shadow-xs"
              >
                <span>Soal Berikutnya</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={onNavigateToKasir}
                className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex items-center gap-1 shadow-xs"
              >
                <span>Lanjut ke Proyek Kasir Otomatis</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
