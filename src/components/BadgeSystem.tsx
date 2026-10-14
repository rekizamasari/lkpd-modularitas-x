import React from 'react';
import {
  Award,
  Sparkles,
  Zap,
  ShieldCheck,
  Cpu,
  Layers,
  Lock,
  CheckCircle2,
} from 'lucide-react';

export interface BadgeItem {
  id: string;
  title: string;
  category: 'Latihan' | 'Kasir' | 'Master';
  description: string;
  requirement: string;
  icon: React.ElementType;
  isUnlocked: boolean;
  accentColor: string;
  glowColor: string;
}

interface BadgeSystemProps {
  passedExercises: Record<string, boolean>;
  passedModules: Record<number, boolean>;
}

export const BadgeSystem: React.FC<BadgeSystemProps> = ({
  passedExercises,
  passedModules,
}) => {
  const isEx1Passed = !!passedExercises['latihan-1'];
  const isEx2Passed = !!passedExercises['latihan-2'];
  const isEx3Passed = !!passedExercises['latihan-3'];

  const isMod1Passed = !!passedModules[1];
  const isMod2Passed = !!passedModules[2];
  const isMod3Passed = !!passedModules[3];
  const isMod4Passed = !!passedModules[4];

  const allExercisesPassed = isEx1Passed && isEx2Passed && isEx3Passed;
  const allKasirPassed = isMod1Passed && isMod2Passed && isMod3Passed && isMod4Passed;
  const allCompleted = allExercisesPassed && allKasirPassed;

  const badges: BadgeItem[] = [
    {
      id: 'rookie-coder',
      title: 'Langkah Pertama',
      category: 'Latihan',
      description: 'Berhasil membuat fungsi berparameter dengan return value pertama.',
      requirement: 'Lolos Latihan 1 (Anatomi Fungsi)',
      icon: Zap,
      isUnlocked: isEx1Passed,
      accentColor: 'text-blue-600 bg-blue-50 border-blue-200',
      glowColor: 'ring-blue-400/30',
    },
    {
      id: 'refactor-champion',
      title: 'Juara Optimasi DRY',
      category: 'Latihan',
      description: 'Menghilangkan kode redundan dan menerapkan parameter bawaan (default).',
      requirement: 'Lolos Latihan 2 (Refactoring DRY)',
      icon: Layers,
      isUnlocked: isEx2Passed,
      accentColor: 'text-indigo-600 bg-indigo-50 border-indigo-200',
      glowColor: 'ring-indigo-400/30',
    },
    {
      id: 'debugging-hero',
      title: 'Debugging Hero',
      category: 'Latihan',
      description: 'Menguasai fungsi predikat dan validasi defensif terhadap anomali data.',
      requirement: 'Lolos Latihan 3 (Validasi Input)',
      icon: ShieldCheck,
      isUnlocked: isEx3Passed,
      accentColor: 'text-rose-600 bg-rose-50 border-rose-200',
      glowColor: 'ring-rose-400/30',
    },
    {
      id: 'cashier-architect',
      title: 'Arsitek Kasir',
      category: 'Kasir',
      description: 'Mendekomposisi logika dasar subtotal dan aturan diskon berjenjang.',
      requirement: 'Lolos Kasir Modul 1 & 2',
      icon: Cpu,
      isUnlocked: isMod1Passed && isMod2Passed,
      accentColor: 'text-amber-600 bg-amber-50 border-amber-200',
      glowColor: 'ring-amber-400/30',
    },
    {
      id: 'tuple-specialist',
      title: 'Spesialis Tuple Return',
      category: 'Kasir',
      description: 'Mampu mengembalikan multi-output (pajak PPN & total) dalam satu fungsi.',
      requirement: 'Lolos Kasir Modul 3 & 4',
      icon: Sparkles,
      isUnlocked: isMod3Passed && isMod4Passed,
      accentColor: 'text-emerald-600 bg-emerald-50 border-emerald-200',
      glowColor: 'ring-emerald-400/30',
    },
    {
      id: 'modular-master',
      title: 'Modular Master',
      category: 'Master',
      description: 'Menyelesaikan seluruh modul dan berhasil menjalankan simulasi kasir otomatis 100%.',
      requirement: 'Lolos Semua 7 Tugas Unit Test',
      icon: Award,
      isUnlocked: allCompleted,
      accentColor: 'text-purple-600 bg-purple-50 border-purple-200',
      glowColor: 'ring-purple-400/40',
    },
  ];

  const unlockedCount = badges.filter((b) => b.isUnlocked).length;

  return (
    <div className="mt-4 pt-4 border-t border-slate-200/80">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-500" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Medali Pencapaian Siswa
          </h3>
          <span className="text-slate-400 text-xs">·</span>
          <span className="text-xs text-slate-500 font-medium">
            Badge System
          </span>
        </div>
        <div className="text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200 tabular-nums">
          {unlockedCount} dari {badges.length} Medali Terbuka
        </div>
      </div>

      {/* Grid Medali */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {badges.map((badge) => {
          const Icon = badge.icon;
          return (
            <div
              key={badge.id}
              className={`relative p-3 rounded-xl border transition-all duration-300 flex flex-col items-center text-center justify-between min-h-[110px] ${
                badge.isUnlocked
                  ? `${badge.accentColor} shadow-xs ring-1 ${badge.glowColor}`
                  : 'bg-slate-50/60 border-slate-200 text-slate-400 opacity-60 hover:opacity-90'
              }`}
              title={badge.isUnlocked ? `${badge.title}: ${badge.description}` : `Terkunci: ${badge.requirement}`}
            >
              {/* Status Icon */}
              <div className="relative mb-1.5">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-transform ${
                    badge.isUnlocked
                      ? 'bg-white shadow-xs scale-105'
                      : 'bg-slate-200 text-slate-400'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                {badge.isUnlocked ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 bg-white rounded-full absolute -top-1 -right-1" />
                ) : (
                  <Lock className="w-3 h-3 text-slate-400 bg-white rounded-full p-0.5 absolute -top-1 -right-1" />
                )}
              </div>

              {/* Title & Desc */}
              <div className="w-full">
                <h4
                  className={`text-[11px] font-bold leading-tight truncate ${
                    badge.isUnlocked ? 'text-slate-900' : 'text-slate-500'
                  }`}
                >
                  {badge.title}
                </h4>
                <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5 leading-tight">
                  {badge.isUnlocked ? 'Medali Diraih ✓' : badge.requirement}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
