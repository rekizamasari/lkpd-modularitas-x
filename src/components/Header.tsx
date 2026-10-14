import React from 'react';
import { Printer, GraduationCap, RotateCcw, ShieldCheck, Lock, Unlock } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  completedCount: number;
  totalTasks: number;
  isTeacherMode: boolean;
  isGroupDataFilled?: boolean;
  isCloudConnected?: boolean;
  registeredGroupsCount?: number;
  onRequestTeacherAuth: () => void;
  onExitTeacherMode: () => void;
  onPrint: () => void;
  onResetAll: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  completedCount,
  totalTasks,
  isTeacherMode,
  isGroupDataFilled = true,
  isCloudConnected = true,
  registeredGroupsCount = 0,
  onRequestTeacherAuth,
  onExitTeacherMode,
  onPrint,
  onResetAll,
}) => {
  const navItems = [
    { id: 'overview', label: 'Capaian & Konsep' },
    { id: 'exercises', label: 'Latihan Terstruktur' },
    { id: 'kasir', label: 'Proyek Kasir Otomatis' },
    { id: 'rubrik', label: 'Refleksi & Rubrik' },
  ];

  const percentage = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;
  const allPassed = completedCount >= totalTasks && totalTasks > 0;

  // Progress ring math
  const radius = 13;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-slate-900 whitespace-nowrap block">
                LKPD Modularitas Python
              </span>
              <span className="text-xs text-slate-500 whitespace-nowrap block">
                Koding & AI Kelas X · MAN 1 Cianjur
              </span>
            </div>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 sm:gap-2">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-3.5 py-2 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Actions */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Cloud Real-Time Sync Indicator */}
            <div
              className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
                isCloudConnected
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-amber-50 text-amber-800 border-amber-200'
              }`}
              title="Koneksi Cloud Firestore aktif: Setiap kelompok yang masuk otomatis terhubung ke HP/laptop guru"
            >
              <span className="relative flex h-2 w-2">
                {isCloudConnected && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                )}
                <span
                  className={`relative inline-flex rounded-full h-2 w-2 ${
                    isCloudConnected ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}
                ></span>
              </span>
              <span className="text-[11px] font-bold">
                {isCloudConnected ? 'Cloud Sync' : 'Menghubungkan...'}
              </span>
              {registeredGroupsCount > 0 && (
                <span className="text-[10px] bg-emerald-200/90 text-emerald-900 font-extrabold px-1.5 py-0.2 rounded-full">
                  {registeredGroupsCount} Kelompok
                </span>
              )}
            </div>

            {/* Circular Progress Ring in Header */}
            <div
              className="hidden lg:flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs"
              title={`Progres Pengerjaan: ${completedCount} dari ${totalTasks} tugas (${percentage}%)`}
            >
              <div className="relative w-8 h-8 flex items-center justify-center">
                <svg className="w-8 h-8 -rotate-90 transform" viewBox="0 0 36 36">
                  {/* Background Track */}
                  <circle
                    cx="18"
                    cy="18"
                    r={radius}
                    stroke="currentColor"
                    strokeWidth="3.5"
                    className="text-slate-200"
                    fill="none"
                  />
                  {/* Animated Progress Ring */}
                  <circle
                    cx="18"
                    cy="18"
                    r={radius}
                    stroke="currentColor"
                    strokeWidth="3.5"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className={`transition-all duration-500 ${
                      allPassed ? 'text-emerald-500' : 'text-blue-600'
                    }`}
                    fill="none"
                  />
                </svg>
                <span className="absolute text-[9px] font-extrabold text-slate-800 tabular-nums">
                  {percentage}%
                </span>
              </div>
              <div className="flex flex-col text-[11px] leading-tight">
                <span className="font-semibold text-slate-500">Tugas</span>
                <span className="font-bold text-slate-900 tabular-nums">
                  {completedCount}/{totalTasks}
                </span>
              </div>
            </div>

            {/* Mode Guru & Mode Siswa Selector with PIN Lock */}
            {isTeacherMode ? (
              <button
                onClick={onExitTeacherMode}
                title="Mode Guru Aktif. Klik untuk mengunci kembali ke Mode Siswa"
                className="px-2.5 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 shadow-xs"
              >
                <Unlock className="w-3.5 h-3.5 text-amber-700" />
                <span>Mode Guru (Aktif)</span>
                <span className="text-[10px] text-amber-800 underline font-normal ml-0.5">Kunci</span>
              </button>
            ) : (
              <button
                onClick={onRequestTeacherAuth}
                title="Buka Mode Guru Pengampu (Masuk dengan PIN)"
                className="px-2.5 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300 shadow-xs cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5 text-amber-700" />
                <span>Mode Guru (PIN)</span>
              </button>
            )}

            {/* Print Action: Opens Guaranteed Print Preview & Browser Print */}
            <button
              onClick={onPrint}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-xs flex items-center gap-1.5 whitespace-nowrap"
              title="Buka pratinjau dokumen cetak resmi dan kirim ke printer/PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak LKPD / PDF</span>
            </button>

            {/* Reset Action */}
            <button
              onClick={onResetAll}
              title="Reset Semua Isian Siswa"
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="md:hidden flex items-center gap-1 py-2 overflow-x-auto border-t border-slate-100">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap ${
                activeTab === item.id
                  ? 'bg-blue-50 text-blue-700 font-semibold border border-blue-200'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
