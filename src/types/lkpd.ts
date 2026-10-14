export interface StudentIdentity {
  nama: string; // Nama Ketua / Kontak Utama
  kelas: string;
  kelompok: string;
  tanggal: string;
  namaSekolah: string;
  anggota: string[]; // Daftar nama lengkap seluruh anggota kelompok
  isRegistered: boolean; // Flag penanda registrasi awal kelompok telah disimpan
}

export interface GroupSubmission {
  id: string; // ID unik kelompok
  identity: StudentIdentity;
  studentCodes: Record<string, string>;
  moduleCodes: Record<number, string>;
  passedExercises: Record<string, boolean>;
  passedModules: Record<number, boolean>;
  reflectionAnswers: Record<string, string>;
  rubricScores: Record<string, number>;
  teacherFeedback: string;
  teacherName: string;
  updatedAt: string;
}

export interface TestCase {
  description: string;
  inputArgs: any[];
  expectedReturn?: any;
  customValidator?: (result: any, stdout: string) => boolean;
  expectedText?: string;
}

export interface TestResult {
  passed: boolean;
  description: string;
  expectedText: string;
  actualText: string;
  error?: string;
}

export interface Exercise {
  id: string;
  title: string;
  subtitle: string;
  level: 'Dasar' | 'Menengah' | 'Tantangan';
  problemStatement: string;
  guidance: string[];
  starterCode: string;
  solutionCode: string;
  explanation: string;
  optimizationConcept: string;
  testCases: TestCase[];
}

export interface ParameterInfo {
  name: string;
  type: string;
  description: string;
  defaultValue?: string;
}

export interface KasirModule {
  step: number;
  id: string;
  title: string;
  functionName: string;
  functionSignature: string;
  shortDesc: string;
  description: string;
  parameters: ParameterInfo[];
  returnValueDesc: string;
  starterCode: string;
  solutionCode: string;
  sampleCall: string;
  testCases: TestCase[];
}

export interface RubricCriteria {
  id: string;
  title: string;
  weight: number; // in percentage e.g. 25
  descriptors: {
    level4: string; // Sangat Mahir (4)
    level3: string; // Mahir (3)
    level2: string; // Cukup (2)
    level1: string; // Perlu Bimbingan (1)
  };
}

export interface TeacherNotes {
  feedback: string;
  verified: boolean;
  teacherName: string;
}
