import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { StudentInfoCard } from './components/StudentInfoCard';
import { ConceptExploration } from './components/ConceptExploration';
import { StructuredExercises } from './components/StructuredExercises';
import { KasirProject } from './components/KasirProject';
import { RubricSection } from './components/RubricSection';
import { PrintableWorksheet } from './components/PrintableWorksheet';
import { TeacherPinModal } from './components/TeacherPinModal';
import { ChangeTeacherPinModal } from './components/ChangeTeacherPinModal';
import { PrintPreviewModal } from './components/PrintPreviewModal';
import { GroupRegistrationModal } from './components/GroupRegistrationModal';
import { TeacherLockedModal } from './components/TeacherLockedModal';
import { TeacherGroupDashboard } from './components/TeacherGroupDashboard';
import { StudentIdentity, GroupSubmission } from './types/lkpd';
import { EXERCISES, KASIR_MODULES } from './data/lkpdData';
import { ShieldCheck, Lock, Eye, Users, ArrowRight, KeyRound } from 'lucide-react';
import {
  subscribeToGroups,
  saveGroupToFirestore,
  deleteGroupFromFirestore,
  subscribeToTeacherConfig,
  saveTeacherPinToFirestore,
  testConnection,
} from './firebase';

const createEmptyGroupSubmission = (id: string, groupIdentity: StudentIdentity): GroupSubmission => {
  const initialExCodes: Record<string, string> = {};
  EXERCISES.forEach((ex) => {
    initialExCodes[ex.id] = ex.starterCode;
  });
  const initialModCodes: Record<number, string> = {};
  KASIR_MODULES.forEach((m) => {
    initialModCodes[m.step] = m.starterCode;
  });

  return {
    id,
    identity: groupIdentity,
    studentCodes: initialExCodes,
    moduleCodes: initialModCodes,
    passedExercises: {},
    passedModules: {},
    reflectionAnswers: {},
    rubricScores: {
      'kriteria-1': 0,
      'kriteria-2': 0,
      'kriteria-3': 0,
      'kriteria-4': 0,
    },
    teacherFeedback: '',
    teacherName: '',
    updatedAt: new Date().toISOString(),
  };
};

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [isTeacherMode, setIsTeacherMode] = useState<boolean>(false);
  const [isTeacherPinModalOpen, setIsTeacherPinModalOpen] = useState<boolean>(false);
  const [isTeacherLockedModalOpen, setIsTeacherLockedModalOpen] = useState<boolean>(false);
  const [isChangePinModalOpen, setIsChangePinModalOpen] = useState<boolean>(false);
  const [teacherPin, setTeacherPin] = useState<string>(() => {
    return localStorage.getItem('lkpd_teacher_pin') || 'GURU-X-AI';
  });
  const [isPrintPreviewModalOpen, setIsPrintPreviewModalOpen] = useState<boolean>(false);
  const [printTargetGroup, setPrintTargetGroup] = useState<GroupSubmission | null>(null);

  const [isCloudConnected, setIsCloudConnected] = useState<boolean>(true);
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handlePinChanged = async (newPin: string) => {
    setTeacherPin(newPin);
    localStorage.setItem('lkpd_teacher_pin', newPin);
    try {
      await saveTeacherPinToFirestore(newPin);
    } catch (e) {
      console.warn('Failed saving PIN to Firestore:', e);
    }
  };

  // Group Submissions Roster State
  const [groups, setGroups] = useState<GroupSubmission[]>(() => {
    try {
      const saved = localStorage.getItem('lkpd_all_groups');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}

    // Fallback: check if existing registered identity exists in single-mode storage
    try {
      const savedId = localStorage.getItem('lkpd_student_identity');
      if (savedId) {
        const parsedId = JSON.parse(savedId);
        if (parsedId.isRegistered && parsedId.kelompok) {
          const savedEx = JSON.parse(localStorage.getItem('lkpd_exercise_codes') || '{}');
          const savedPassEx = JSON.parse(localStorage.getItem('lkpd_passed_exercises') || '{}');
          const savedMod = JSON.parse(localStorage.getItem('lkpd_kasir_modules') || '{}');
          const savedPassMod = JSON.parse(localStorage.getItem('lkpd_passed_modules') || '{}');
          const savedRef = JSON.parse(localStorage.getItem('lkpd_reflection_answers') || '{}');
          const savedRubric = JSON.parse(localStorage.getItem('lkpd_rubric_scores') || '{}');
          const savedFb = localStorage.getItem('lkpd_teacher_feedback') || '';
          const savedTeacher = localStorage.getItem('lkpd_teacher_name') || '';

          const exCodes: Record<string, string> = {};
          EXERCISES.forEach((ex) => {
            exCodes[ex.id] = savedEx[ex.id] || ex.starterCode;
          });

          const modCodes: Record<number, string> = {};
          KASIR_MODULES.forEach((m) => {
            modCodes[m.step] = savedMod[m.step] || m.starterCode;
          });

          return [
            {
              id: 'group-1',
              identity: parsedId,
              studentCodes: exCodes,
              moduleCodes: modCodes,
              passedExercises: savedPassEx,
              passedModules: savedPassMod,
              reflectionAnswers: savedRef,
              rubricScores: Object.keys(savedRubric).length > 0 ? savedRubric : { 'kriteria-1': 0, 'kriteria-2': 0, 'kriteria-3': 0, 'kriteria-4': 0 },
              teacherFeedback: savedFb,
              teacherName: savedTeacher,
              updatedAt: new Date().toISOString(),
            },
          ];
        }
      }
    } catch {}

    return [];
  });

  // Active Group ID
  const [activeGroupId, setActiveGroupId] = useState<string>(() => {
    const saved = localStorage.getItem('lkpd_active_group_id');
    if (saved) return saved;
    try {
      const savedGroups = localStorage.getItem('lkpd_all_groups');
      if (savedGroups) {
        const parsed = JSON.parse(savedGroups);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed[0].id;
      }
    } catch {}
    return 'group-1';
  });

  // Active Student Identity
  const [identity, setIdentity] = useState<StudentIdentity>(() => {
    try {
      const saved = localStorage.getItem('lkpd_student_identity');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.kelompok && parsed.anggota && parsed.anggota.length > 0) {
          return parsed;
        }
      }
    } catch {}
    return {
      nama: '',
      kelas: 'X',
      kelompok: '',
      tanggal: new Date().toISOString().split('T')[0],
      namaSekolah: 'MAN 1 Cianjur',
      anggota: [],
      isRegistered: false,
    };
  });

  // Periksa apakah data kelompok sudah lengkap diisi oleh siswa
  const isGroupDataFilled = Boolean(
    identity.isRegistered &&
    identity.kelompok &&
    identity.kelompok.trim().length > 0 &&
    identity.anggota &&
    identity.anggota.length > 0 &&
    identity.anggota.some((a) => a.trim().length > 0)
  );

  // Group Registration Modal: Wajib terbuka di awal jika data kelompok belum lengkap diisi
  const [isGroupModalOpen, setIsGroupModalOpen] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('lkpd_student_identity');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (
          parsed.isRegistered &&
          parsed.kelompok?.trim() &&
          parsed.anggota?.length > 0 &&
          parsed.anggota.some((a: string) => a.trim().length > 0)
        ) {
          return false;
        }
      }
    } catch {}
    return true;
  });
  const [modalTargetIdentity, setModalTargetIdentity] = useState<StudentIdentity>(identity);
  const [isAddingNewGroup, setIsAddingNewGroup] = useState<boolean>(false);

  // 1. Sinkronisasi Real-Time dengan Cloud Firestore
  useEffect(() => {
    testConnection().then((connected) => setIsCloudConnected(connected));

    // Berlangganan data seluruh kelompok di Firestore secara live
    const unsubscribeGroups = subscribeToGroups(
      (remoteGroups) => {
        setIsCloudConnected(true);
        if (remoteGroups && Array.isArray(remoteGroups)) {
          setGroups(remoteGroups);

          // Cek apakah perangkat ini memiliki kelompok tersimpan
          const myGroupId = localStorage.getItem('lkpd_my_group_id');
          if (myGroupId) {
            const found = remoteGroups.find((g) => g.id === myGroupId);
            if (found && !isTeacherMode) {
              setActiveGroupId(found.id);
              setIdentity(found.identity);
            }
          }
        }
      },
      (err) => {
        console.warn('Firestore subscription fallback:', err);
        setIsCloudConnected(false);
      }
    );

    // Berlangganan kunci/PIN guru yang tersinkronisasi
    const unsubscribePin = subscribeToTeacherConfig((remotePin) => {
      if (remotePin) {
        setTeacherPin(remotePin);
        localStorage.setItem('lkpd_teacher_pin', remotePin);
      }
    });

    return () => {
      unsubscribeGroups();
      unsubscribePin();
    };
  }, [isTeacherMode]);

  // Kunci Guru: Hanya kunci otomatis jika siswa di mode siswa belum mengisi kelompok DAN belum ada kelompok sama sekali di kelas
  useEffect(() => {
    if (!isGroupDataFilled && groups.length === 0 && isTeacherMode) {
      setIsTeacherMode(false);
    }
  }, [isGroupDataFilled, groups.length, isTeacherMode]);

  // Handler permintaan akses Mode Guru (selalu membuka verifikasi PIN Guru)
  const handleRequestTeacherAuth = () => {
    setIsTeacherPinModalOpen(true);
  };

  // Exercise Student Codes
  const [studentCodes, setStudentCodes] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem('lkpd_exercise_codes');
      if (saved) return JSON.parse(saved);
    } catch {}
    const initial: Record<string, string> = {};
    EXERCISES.forEach((ex) => {
      initial[ex.id] = ex.starterCode;
    });
    return initial;
  });

  // Passed Exercises Status
  const [passedExercises, setPassedExercises] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('lkpd_passed_exercises');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {};
  });

  // Kasir Module Codes
  const [moduleCodes, setModuleCodes] = useState<Record<number, string>>(() => {
    try {
      const saved = localStorage.getItem('lkpd_kasir_modules');
      if (saved) return JSON.parse(saved);
    } catch {}
    const initial: Record<number, string> = {};
    KASIR_MODULES.forEach((m) => {
      initial[m.step] = m.starterCode;
    });
    return initial;
  });

  // Passed Kasir Modules Status
  const [passedModules, setPassedModules] = useState<Record<number, boolean>>(() => {
    try {
      const saved = localStorage.getItem('lkpd_passed_modules');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {};
  });

  // Reflection Answers
  const [reflectionAnswers, setReflectionAnswers] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem('lkpd_reflection_answers');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {};
  });

  // Rubric Scores
  const [rubricScores, setRubricScores] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem('lkpd_rubric_scores');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      'kriteria-1': 0,
      'kriteria-2': 0,
      'kriteria-3': 0,
      'kriteria-4': 0,
    };
  });

  // Teacher Feedback & Signature
  const [teacherFeedback, setTeacherFeedback] = useState<string>(() => {
    return localStorage.getItem('lkpd_teacher_feedback') || '';
  });
  const [teacherName, setTeacherName] = useState<string>(() => {
    return localStorage.getItem('lkpd_teacher_name') || '';
  });

  // Synchronize Active Group changes back into the groups roster and localStorage
  useEffect(() => {
    if (!activeGroupId) return;
    setGroups((prev) => {
      const idx = prev.findIndex((g) => g.id === activeGroupId);
      if (idx === -1) return prev;
      const current = prev[idx];
      const updated: GroupSubmission = {
        ...current,
        identity,
        studentCodes,
        moduleCodes,
        passedExercises,
        passedModules,
        reflectionAnswers,
        rubricScores,
        teacherFeedback,
        teacherName,
        updatedAt: new Date().toISOString(),
      };
      const copy = [...prev];
      copy[idx] = updated;
      return copy;
    });
  }, [
    activeGroupId,
    identity,
    studentCodes,
    moduleCodes,
    passedExercises,
    passedModules,
    reflectionAnswers,
    rubricScores,
    teacherFeedback,
    teacherName,
  ]);

  // Persist to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('lkpd_all_groups', JSON.stringify(groups));
      localStorage.setItem('lkpd_active_group_id', activeGroupId);
      localStorage.setItem('lkpd_student_identity', JSON.stringify(identity));
      localStorage.setItem('lkpd_exercise_codes', JSON.stringify(studentCodes));
      localStorage.setItem('lkpd_passed_exercises', JSON.stringify(passedExercises));
      localStorage.setItem('lkpd_kasir_modules', JSON.stringify(moduleCodes));
      localStorage.setItem('lkpd_passed_modules', JSON.stringify(passedModules));
      localStorage.setItem('lkpd_reflection_answers', JSON.stringify(reflectionAnswers));
      localStorage.setItem('lkpd_rubric_scores', JSON.stringify(rubricScores));
      localStorage.setItem('lkpd_teacher_feedback', teacherFeedback);
      localStorage.setItem('lkpd_teacher_name', teacherName);
    } catch {}
  }, [
    groups,
    activeGroupId,
    identity,
    studentCodes,
    passedExercises,
    moduleCodes,
    passedModules,
    reflectionAnswers,
    rubricScores,
    teacherFeedback,
    teacherName,
  ]);

  // Debounced Auto-Save ke Cloud Firestore setiap kali ada pengerjaan atau penilaian
  useEffect(() => {
    if (!activeGroupId || !identity.isRegistered || !identity.kelompok) return;

    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
    }

    syncTimeoutRef.current = setTimeout(() => {
      const activeGroupData: GroupSubmission = {
        id: activeGroupId,
        identity,
        studentCodes,
        moduleCodes,
        passedExercises,
        passedModules,
        reflectionAnswers,
        rubricScores,
        teacherFeedback,
        teacherName,
        updatedAt: new Date().toISOString(),
      };
      saveGroupToFirestore(activeGroupData).catch((err) => {
        console.warn('Auto-save ke Firestore:', err);
      });
    }, 700);

    return () => {
      if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
    };
  }, [
    activeGroupId,
    identity,
    studentCodes,
    moduleCodes,
    passedExercises,
    passedModules,
    reflectionAnswers,
    rubricScores,
    teacherFeedback,
    teacherName,
  ]);

  // Overall Verification Score Tally for the currently active group
  const totalTasks = EXERCISES.length + KASIR_MODULES.length; // 3 + 4 = 7 tasks
  const completedCount =
    Object.values(passedExercises).filter(Boolean).length +
    Object.values(passedModules).filter(Boolean).length;

  // Handle switching active group (Teacher inspects another group)
  const handleSelectGroup = (groupId: string) => {
    const selected = groups.find((g) => g.id === groupId);
    if (!selected) return;

    setActiveGroupId(groupId);
    setIdentity(selected.identity);
    setStudentCodes(selected.studentCodes);
    setModuleCodes(selected.moduleCodes);
    setPassedExercises(selected.passedExercises || {});
    setPassedModules(selected.passedModules || {});
    setReflectionAnswers(selected.reflectionAnswers || {});
    setRubricScores(
      selected.rubricScores || {
        'kriteria-1': 0,
        'kriteria-2': 0,
        'kriteria-3': 0,
        'kriteria-4': 0,
      }
    );
    setTeacherFeedback(selected.teacherFeedback || '');
    setTeacherName(selected.teacherName || '');
  };

  // Guru Reset Pengerjaan Kelompok
  const handleResetGroupWork = async (groupId: string) => {
    const target = groups.find((g) => g.id === groupId);
    const nama = target?.identity.kelompok || 'kelompok ini';
    if (
      !confirm(
        `Reset seluruh pengerjaan ${nama}? Semua kode latihan, modul kasir, refleksi, dan nilai rubrik kelompok ini akan dikosongkan kembali di database cloud.`
      )
    ) {
      return;
    }

    const resetSub = createEmptyGroupSubmission(groupId, target ? target.identity : identity);
    try {
      await saveGroupToFirestore(resetSub);
    } catch (e) {
      console.warn('Reset Firestore error:', e);
    }
    setGroups((prev) => prev.map((g) => (g.id === groupId ? resetSub : g)));

    if (activeGroupId === groupId) {
      setStudentCodes(resetSub.studentCodes);
      setModuleCodes(resetSub.moduleCodes);
      setPassedExercises({});
      setPassedModules({});
      setReflectionAnswers({});
      setRubricScores({
        'kriteria-1': 0,
        'kriteria-2': 0,
        'kriteria-3': 0,
        'kriteria-4': 0,
      });
      setTeacherFeedback('');
    }
  };

  // Guru Hapus Kelompok
  const handleDeleteGroup = async (groupId: string) => {
    const target = groups.find((g) => g.id === groupId);
    const nama = target?.identity.kelompok || 'kelompok ini';
    if (!confirm(`Hapus ${nama} secara permanen dari daftar rekapitulasi kelas dan database cloud? Data tidak dapat dikembalikan.`)) {
      return;
    }

    try {
      await deleteGroupFromFirestore(groupId);
    } catch (e) {
      console.warn('Delete Firestore error:', e);
    }
    const remaining = groups.filter((g) => g.id !== groupId);
    setGroups(remaining);

    if (activeGroupId === groupId) {
      if (remaining.length > 0) {
        handleSelectGroup(remaining[0].id);
      } else {
        const emptyId: StudentIdentity = {
          nama: '',
          kelas: 'X',
          kelompok: '',
          tanggal: new Date().toISOString().split('T')[0],
          namaSekolah: 'MAN 1 Cianjur',
          anggota: [],
          isRegistered: false,
        };
        setActiveGroupId('');
        setIdentity(emptyId);
        setModalTargetIdentity(emptyId);
        setIsAddingNewGroup(false);
        setIsGroupModalOpen(true);
      }
    }
  };

  // Handle Save Group Registration (Either new group or updating active group)
  const handleSaveGroupRegistration = async (newIdentity: StudentIdentity) => {
    if (isAddingNewGroup || groups.length === 0 || !activeGroupId) {
      const cleanTs = Date.now();
      const randStr = Math.random().toString(36).substring(2, 6);
      const newId = `kelompok_${cleanTs}_${randStr}`;
      const newGroup = createEmptyGroupSubmission(newId, newIdentity);

      localStorage.setItem('lkpd_my_group_id', newId);
      try {
        await saveGroupToFirestore(newGroup);
      } catch (e) {
        console.warn('Simpan kelompok ke Firestore:', e);
      }

      setGroups((prev) => [newGroup, ...prev.filter((g) => g.id !== newId)]);
      setActiveGroupId(newId);
      setIdentity(newIdentity);
      setStudentCodes(newGroup.studentCodes);
      setModuleCodes(newGroup.moduleCodes);
      setPassedExercises({});
      setPassedModules({});
      setReflectionAnswers({});
      setRubricScores({
        'kriteria-1': 0,
        'kriteria-2': 0,
        'kriteria-3': 0,
        'kriteria-4': 0,
      });
      setTeacherFeedback('');
      setTeacherName('');
      setIsAddingNewGroup(false);
    } else {
      // Update identity of active group
      setIdentity(newIdentity);
      const updatedGroup: GroupSubmission = {
        id: activeGroupId,
        identity: newIdentity,
        studentCodes,
        moduleCodes,
        passedExercises,
        passedModules,
        reflectionAnswers,
        rubricScores,
        teacherFeedback,
        teacherName,
        updatedAt: new Date().toISOString(),
      };
      try {
        await saveGroupToFirestore(updatedGroup);
      } catch (e) {
        console.warn('Update identitas kelompok di Firestore:', e);
      }
      setGroups((prev) =>
        prev.map((g) => (g.id === activeGroupId ? updatedGroup : g))
      );
    }
    setIsGroupModalOpen(false);
  };

  // Load Sample Groups for immediate teacher demonstration & testing
  const handleLoadSampleGroups = async () => {
    const sample1Id = `group-${Date.now()}-1`;
    const sample2Id = `group-${Date.now()}-2`;
    const sample3Id = `group-${Date.now()}-3`;

    const sample1: GroupSubmission = {
      id: sample1Id,
      identity: {
        nama: 'Rian Ramadhan',
        kelas: 'X-1',
        kelompok: 'Kelompok 1 (Alpha Algorithm)',
        tanggal: new Date().toISOString().split('T')[0],
        namaSekolah: 'MAN 1 Cianjur',
        anggota: ['Rian Ramadhan', 'Siti Nurhaliza', 'Ahmad Fauzi', 'Nabila Zahra'],
        isRegistered: true,
      },
      studentCodes: {
        'latihan-1': EXERCISES[0].starterCode,
        'latihan-2': EXERCISES[1].solutionCode,
        'latihan-3': EXERCISES[2].solutionCode,
      },
      moduleCodes: {
        1: KASIR_MODULES[0].solutionCode,
        2: KASIR_MODULES[1].solutionCode,
        3: KASIR_MODULES[2].starterCode,
        4: KASIR_MODULES[3].starterCode,
      },
      passedExercises: { 'latihan-2': true, 'latihan-3': true },
      passedModules: { 1: true, 2: true },
      reflectionAnswers: {
        'refleksi-1': 'Modularitas mempermudah pembagian tugas antar anggota kelompok dan mempercepat deteksi bug.',
        'refleksi-2': 'Parameter memungkinkan fungsi dipakai berulang kali dengan input harga yang berbeda.',
      },
      rubricScores: { 'kriteria-1': 3, 'kriteria-2': 3, 'kriteria-3': 2, 'kriteria-4': 3 },
      teacherFeedback: 'Struktur kode baik, lanjutkan Modul 3 dan 4 untuk menyelesaikan sistem kasir.',
      teacherName: 'Drs. H. Maman Suherman, M.Pd.',
      updatedAt: new Date().toISOString(),
    };

    const sample2: GroupSubmission = {
      id: sample2Id,
      identity: {
        nama: 'Dimas Pratama',
        kelas: 'X-1',
        kelompok: 'Kelompok 2 (Beta Pythonic)',
        tanggal: new Date().toISOString().split('T')[0],
        namaSekolah: 'MAN 1 Cianjur',
        anggota: ['Dimas Pratama', 'Putri Ayu', 'Rizky Kurniawan'],
        isRegistered: true,
      },
      studentCodes: {
        'latihan-1': EXERCISES[0].solutionCode,
        'latihan-2': EXERCISES[1].solutionCode,
        'latihan-3': EXERCISES[2].solutionCode,
      },
      moduleCodes: {
        1: KASIR_MODULES[0].solutionCode,
        2: KASIR_MODULES[1].solutionCode,
        3: KASIR_MODULES[2].solutionCode,
        4: KASIR_MODULES[3].solutionCode,
      },
      passedExercises: { 'latihan-1': true, 'latihan-2': true, 'latihan-3': true },
      passedModules: { 1: true, 2: true, 3: true, 4: true },
      reflectionAnswers: {
        'refleksi-1': 'Sangat jelas perbedaannya, modular tidak ada kode duplikasi (DRY).',
        'refleksi-2': 'Return value mengirimkan hasil kalkulasi diskon ke modul total belanja.',
        'refleksi-3': 'Kami mengintegrasikan keempat modul kasir dan struk tercetak sempurna.',
      },
      rubricScores: { 'kriteria-1': 4, 'kriteria-2': 4, 'kriteria-3': 4, 'kriteria-4': 4 },
      teacherFeedback: 'Luar biasa! Pemahaman fungsi dan integrasi kasir sempurna. Sangat mandiri.',
      teacherName: 'Drs. H. Maman Suherman, M.Pd.',
      updatedAt: new Date().toISOString(),
    };

    const sample3: GroupSubmission = {
      id: sample3Id,
      identity: {
        nama: 'Fikri Haikal',
        kelas: 'X-1',
        kelompok: 'Kelompok 3 (Gamma Coders)',
        tanggal: new Date().toISOString().split('T')[0],
        namaSekolah: 'MAN 1 Cianjur',
        anggota: ['Fikri Haikal', 'Dewi Lestari', 'Farhan Maulana'],
        isRegistered: true,
      },
      studentCodes: {
        'latihan-1': EXERCISES[0].solutionCode,
        'latihan-2': EXERCISES[1].starterCode,
        'latihan-3': EXERCISES[2].starterCode,
      },
      moduleCodes: {
        1: KASIR_MODULES[0].starterCode,
        2: KASIR_MODULES[1].starterCode,
        3: KASIR_MODULES[2].starterCode,
        4: KASIR_MODULES[3].starterCode,
      },
      passedExercises: { 'latihan-1': true },
      passedModules: {},
      reflectionAnswers: {},
      rubricScores: { 'kriteria-1': 0, 'kriteria-2': 0, 'kriteria-3': 0, 'kriteria-4': 0 },
      teacherFeedback: '',
      teacherName: '',
      updatedAt: new Date().toISOString(),
    };

    const newGroups = [sample1, sample2, sample3];
    try {
      await Promise.all([
        saveGroupToFirestore(sample1),
        saveGroupToFirestore(sample2),
        saveGroupToFirestore(sample3),
      ]);
    } catch (e) {
      console.warn('Simpan sample groups ke Firestore:', e);
    }
    setGroups(newGroups);
    handleSelectGroup(sample1Id);
  };

  const handleResetAll = async () => {
    if (confirm('Apakah Anda yakin ingin mereset seluruh data, menghapus semua kelompok, dan mengosongkan kembali sistem?')) {
      try {
        await Promise.all(groups.map((g) => deleteGroupFromFirestore(g.id)));
      } catch (e) {
        console.warn('Gagal menghapus kelompok saat reset total:', e);
      }
      localStorage.clear();
      window.location.reload();
    }
  };

  // Determine which submission data is passed to PrintableWorksheet or PrintPreviewModal
  const previewData = printTargetGroup || {
    identity,
    studentCodes,
    moduleCodes,
    reflectionAnswers,
    rubricScores,
    teacherFeedback,
    teacherName,
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between">
      {/* Printable Sheet (Standard Browser Print Engine) */}
      <PrintableWorksheet
        identity={previewData.identity}
        studentCodes={previewData.studentCodes}
        moduleCodes={previewData.moduleCodes}
        reflectionAnswers={previewData.reflectionAnswers}
        rubricScores={previewData.rubricScores}
        teacherFeedback={previewData.teacherFeedback}
        teacherName={previewData.teacherName}
      />

      {/* Modal Onboarding: Registrasi Kelompok & Anggota Siswa (Wajib di awal untuk siswa) */}
      <GroupRegistrationModal
        isOpen={isGroupModalOpen && !isTeacherMode}
        initialIdentity={modalTargetIdentity}
        onSave={handleSaveGroupRegistration}
        canCancel={isGroupDataFilled}
        onClose={() => {
          if (isGroupDataFilled) {
            setIsGroupModalOpen(false);
          }
        }}
        onOpenTeacherPin={() => {
          setIsGroupModalOpen(false);
          setIsTeacherPinModalOpen(true);
        }}
      />

      {/* Modal Notifikasi Mode Guru Terkunci saat Data Kelompok Belum Diisi */}
      <TeacherLockedModal
        isOpen={isTeacherLockedModalOpen}
        onClose={() => setIsTeacherLockedModalOpen(false)}
        onOpenTeacherPin={() => setIsTeacherPinModalOpen(true)}
        onOpenGroupRegistration={() => {
          setModalTargetIdentity(identity);
          setIsAddingNewGroup(false);
          setIsGroupModalOpen(true);
        }}
      />

      {/* Interactive Modal Pratinjau Cetak Lengkap */}
      <PrintPreviewModal
        isOpen={isPrintPreviewModalOpen}
        onClose={() => {
          setIsPrintPreviewModalOpen(false);
          setPrintTargetGroup(null);
        }}
        identity={previewData.identity}
        studentCodes={previewData.studentCodes}
        moduleCodes={previewData.moduleCodes}
        reflectionAnswers={previewData.reflectionAnswers}
        rubricScores={previewData.rubricScores}
        teacherFeedback={previewData.teacherFeedback}
        teacherName={previewData.teacherName}
      />

      {/* Modal Autentikasi PIN Mode Guru */}
      <TeacherPinModal
        isOpen={isTeacherPinModalOpen}
        onClose={() => setIsTeacherPinModalOpen(false)}
        onSuccess={() => {
          setIsTeacherMode(true);
          setIsGroupModalOpen(false);
        }}
        savedPin={teacherPin}
        onOpenChangePin={() => setIsChangePinModalOpen(true)}
      />

      {/* Modal Ganti Kunci / PIN Pengampu Guru */}
      <ChangeTeacherPinModal
        isOpen={isChangePinModalOpen}
        onClose={() => setIsChangePinModalOpen(false)}
        currentSavedPin={teacherPin}
        onPinChanged={handlePinChanged}
        isAlreadyAuthenticated={isTeacherMode}
      />

      {/* Screen Interactive Container */}
      <div className="interactive-only flex-1 flex flex-col">
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          completedCount={completedCount}
          totalTasks={totalTasks}
          isTeacherMode={isTeacherMode}
          isGroupDataFilled={isGroupDataFilled}
          isCloudConnected={isCloudConnected}
          registeredGroupsCount={groups.length}
          onRequestTeacherAuth={handleRequestTeacherAuth}
          onExitTeacherMode={() => setIsTeacherMode(false)}
          onPrint={() => {
            setPrintTargetGroup(null);
            setIsPrintPreviewModalOpen(true);
          }}
          onResetAll={handleResetAll}
        />

        {/* Banner Penanda Mode Guru Terbuka */}
        {isTeacherMode ? (
          <div className="bg-amber-500 text-slate-950 px-4 py-2 border-b border-amber-600 no-print">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-semibold">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-slate-950 shrink-0" />
                <span>
                  <strong>Akses Penuh Pengampu Guru Aktif:</strong> Sedang meninjau{' '}
                  <strong className="underline text-slate-950">
                    {identity.kelompok || 'Kelompok Belum Dinamai'}
                  </strong>{' '}
                  ({identity.anggota?.length || 0} Anggota). Anda dapat memilih kelompok lain, mereset pengerjaan, atau menghapus kelompok di panel bawah.
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setIsChangePinModalOpen(true)}
                  className="text-xs bg-amber-600 hover:bg-amber-700 text-white px-2.5 py-1 rounded font-bold transition-colors flex items-center gap-1 shadow-xs"
                  title="Ganti Kunci / PIN Pengampu Guru"
                >
                  <KeyRound className="w-3 h-3" />
                  <span>Ganti Kunci Guru</span>
                </button>
                <button
                  onClick={() => setActiveTab('rubrik')}
                  className="text-xs bg-amber-700 hover:bg-amber-800 text-white px-2.5 py-1 rounded font-bold transition-colors"
                >
                  Beri Nilai & Catatan Guru →
                </button>
                <button
                  onClick={() => setIsTeacherMode(false)}
                  className="text-xs bg-slate-950 text-amber-300 px-2.5 py-1 rounded font-bold hover:bg-slate-900 transition-colors whitespace-nowrap"
                >
                  Kunci Kembali Mode Guru
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-blue-50/80 border-b border-blue-100 text-blue-900 px-4 py-1.5 no-print text-[11px]">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Lock className="w-3 h-3 text-blue-600" />
                <span>
                  <strong>Mode Siswa:</strong> Kerjakan seluruh latihan dan uji setiap modul kasir. Kunci jawaban dan asesmen rubrik dilindungi dengan PIN Guru.
                </span>
              </div>
              <button
                onClick={() => {
                  setPrintTargetGroup(null);
                  setIsPrintPreviewModalOpen(true);
                }}
                className="text-blue-700 hover:text-blue-900 font-bold underline flex items-center gap-1"
              >
                <Eye className="w-3 h-3" />
                <span>Pratinjau Lembar Cetak A4</span>
              </button>
            </div>
          </div>
        )}

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Panel Rekapitulasi Tiap Kelompok (Hanya tampil saat Mode Guru Aktif) */}
          {isTeacherMode && (
            <TeacherGroupDashboard
              groups={groups}
              activeGroupId={activeGroupId}
              isCloudConnected={isCloudConnected}
              onSelectGroup={handleSelectGroup}
              onResetGroupWork={handleResetGroupWork}
              onDeleteGroup={handleDeleteGroup}
              onAddNewGroup={() => {
                setModalTargetIdentity({
                  nama: '',
                  kelas: identity.kelas || 'X',
                  kelompok: `Kelompok ${groups.length + 1}`,
                  tanggal: new Date().toISOString().split('T')[0],
                  namaSekolah: identity.namaSekolah || 'MAN 1 Cianjur',
                  anggota: ['', '', ''],
                  isRegistered: false,
                });
                setIsAddingNewGroup(true);
                setIsGroupModalOpen(true);
              }}
              onPrintGroup={(targetGroup) => {
                setPrintTargetGroup(targetGroup);
                setIsPrintPreviewModalOpen(true);
              }}
              onLoadSampleGroups={handleLoadSampleGroups}
              onOpenChangePin={() => setIsChangePinModalOpen(true)}
            />
          )}

          {/* Banner Informasi Kelompok yang Sedang Aktif / Ditinjau */}
          {isTeacherMode && groups.length > 0 && (
            <div className="mb-4 bg-amber-50 border border-amber-300 rounded-xl p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 no-print">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-700 shrink-0" />
                <span className="text-xs text-amber-900">
                  Lembar kerja yang ditampilkan di bawah ini adalah milik: <strong>{identity.kelompok || 'Kelompok Aktif'}</strong>
                  {identity.anggota && identity.anggota.length > 0 ? ` (${identity.anggota.join(', ')})` : ''}
                </span>
              </div>
              <span className="text-[11px] font-bold text-amber-800 bg-amber-200/80 px-2 py-0.5 rounded-md shrink-0">
                Progres: {completedCount}/7 Modul Lulus
              </span>
            </div>
          )}

          {/* Identitas Siswa Card */}
          <StudentInfoCard
            identity={identity}
            onChange={(updated) => setIdentity((prev) => ({ ...prev, ...updated }))}
            passedTasks={completedCount}
            totalTasks={totalTasks}
            passedExercisesCount={Object.values(passedExercises).filter(Boolean).length}
            totalExercisesCount={EXERCISES.length}
            passedKasirCount={Object.values(passedModules).filter(Boolean).length}
            totalKasirCount={KASIR_MODULES.length}
            passedExercises={passedExercises}
            passedModules={passedModules}
            onOpenGroupModal={() => {
              setModalTargetIdentity(identity);
              setIsAddingNewGroup(false);
              setIsGroupModalOpen(true);
            }}
          />

          {/* Active Tab View */}
          {activeTab === 'overview' && (
            <ConceptExploration onNavigateToExercises={() => setActiveTab('exercises')} />
          )}

          {activeTab === 'exercises' && (
            <StructuredExercises
              studentCodes={studentCodes}
              onCodeChange={(id, code) => setStudentCodes((prev) => ({ ...prev, [id]: code }))}
              passedExercises={passedExercises}
              onPassChange={(id, passed) => setPassedExercises((prev) => ({ ...prev, [id]: passed }))}
              isTeacherMode={isTeacherMode}
              onNavigateToKasir={() => setActiveTab('kasir')}
            />
          )}

          {activeTab === 'kasir' && (
            <KasirProject
              moduleCodes={moduleCodes}
              onModuleCodeChange={(step, code) =>
                setModuleCodes((prev) => ({ ...prev, [step]: code }))
              }
              passedModules={passedModules}
              onModulePassChange={(step, passed) =>
                setPassedModules((prev) => ({ ...prev, [step]: passed }))
              }
              isTeacherMode={isTeacherMode}
              onNavigateToRubrik={() => setActiveTab('rubrik')}
            />
          )}

          {activeTab === 'rubrik' && (
            <RubricSection
              reflectionAnswers={reflectionAnswers}
              onReflectionChange={(id, text) =>
                setReflectionAnswers((prev) => ({ ...prev, [id]: text }))
              }
              rubricScores={rubricScores}
              onRubricScoreChange={(id, score) =>
                setRubricScores((prev) => ({ ...prev, [id]: score }))
              }
              teacherFeedback={teacherFeedback}
              onTeacherFeedbackChange={setTeacherFeedback}
              teacherName={teacherName}
              onTeacherNameChange={setTeacherName}
              isTeacherMode={isTeacherMode}
              isGroupDataFilled={isGroupDataFilled}
              onRequestTeacherAuth={handleRequestTeacherAuth}
              onPrint={() => {
                setPrintTargetGroup(null);
                setIsPrintPreviewModalOpen(true);
              }}
            />
          )}
        </main>

        {/* Quiet Clean Footer */}
        <footer className="no-print border-t border-slate-200 bg-white py-6 mt-12 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              Lembar Kerja Peserta Didik (LKPD) Koding dan Kecerdasan Artifisial · {identity.namaSekolah || 'MAN 1 Cianjur'}
            </div>
            <div className="flex items-center gap-3 text-slate-600">
              <span>Fase E · Kelas {identity.kelas}</span>
              <span aria-hidden="true">·</span>
              <span>Kurikulum Merdeka</span>
              <span aria-hidden="true">·</span>
              <button
                onClick={() => {
                  setPrintTargetGroup(null);
                  setIsPrintPreviewModalOpen(true);
                }}
                className="text-blue-600 hover:text-blue-800 font-semibold"
              >
                Pratinjau Cetak PDF
              </button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
