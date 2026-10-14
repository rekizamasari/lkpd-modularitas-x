import { Exercise, KasirModule, RubricCriteria } from '../types/lkpd';

export const LKPD_METADATA = {
  mataPelajaran: 'Koding dan Kecerdasan Artifisial',
  kelasSemester: 'X (Sepuluh) / Genap',
  fase: 'Fase E (Kurikulum Merdeka)',
  elemen: 'Algoritma dan Pemrograman (AP)',
  topikUtama: 'Modularitas Pemrograman dengan Python (Fungsi, Parameter, dan Nilai Balik)',
  alokasiWaktu: '3 JP (3 x 45 Menit)',
  capaianPembelajaran:
    'Peserta didik mampu menerapkan praktik baik pemrograman modular untuk memecahkan persoalan komputasional yang kompleks, mengoptimalkan keterbacaan serta efisiensi kode melalui perancangan fungsi berparameter dan bernilai balik.',
  tujuanPembelajaran: [
    'Menjelaskan konsep modularitas dan dekomposisi masalah dalam pemrograman prosedural.',
    'Membedakan konsep fungsi dengan nilai balik (return value) dan prosedur tanpa nilai balik.',
    'Merancang dan mengimplementasikan fungsi dengan parameter posisi maupun parameter bawaan (default parameter).',
    'Menganalisis dan mengoptimalkan kode monolitik (spaghetti code) menjadi kode modular berbasis prinsip DRY (Don\'t Repeat Yourself).',
    'Membangun sistem kasir otomatis bertahap secara terstruktur melalui pemecahan modul berbasis fungsi.'
  ],
  petunjukBelajar: [
    'Bacalah stimulus dan peta konsep modularitas dengan saksama.',
    'Kerjakan setiap latihan terstruktur pada editor kode Python yang disediakan.',
    'Gunakan tombol "Jalankan Kode" untuk menguji logika dan "Uji Solusi (Autograder)" untuk memverifikasi kesesuaian kasus uji.',
    'Selesaikan 4 modul sistem kasir otomatis secara bertahap hingga seluruh unit test berstatus hijau.',
    'Isi bagian refleksi diri dan cetak lembar kerja untuk diverifikasi oleh Guru Pengampu.'
  ]
};

export const EXERCISES: Exercise[] = [
  {
    id: 'latihan-1',
    title: 'Latihan 1: Anatomi Fungsi & Nilai Balik',
    subtitle: 'Membuat fungsi konversi diskon nominal belanja',
    level: 'Dasar',
    problemStatement:
      'Toko Buku Cendekia ingin menghitung besaran potongan harga (nominal diskon) dari suatu buku. Buatlah sebuah fungsi bernama `hitung_diskon_nominal(harga_asli, persen_diskon)` yang menerima 2 parameter dan mengembalikan (return) nilai nominal potongan harga dalam bilangan bulat (integer).',
    guidance: [
      'Gunakan kata kunci def hitung_diskon_nominal(harga_asli, persen_diskon):',
      'Rumus potongan harga: harga_asli * (persen_diskon / 100)',
      'Gunakan int() atau round() lalu kembalikan dengan kata kunci return, bukan print().'
    ],
    starterCode: `# Latihan 1: Anatomi Fungsi & Return Value
def hitung_diskon_nominal(harga_asli, persen_diskon):
    # Tulis kode perhitungan di sini
    pass

# Contoh uji coba manual:
# print(hitung_diskon_nominal(50000, 10)) # Harusnya menghasilkan 5000
`,
    solutionCode: `def hitung_diskon_nominal(harga_asli, persen_diskon):
    nominal_diskon = harga_asli * (persen_diskon / 100)
    return int(nominal_diskon)
`,
    explanation:
      'Fungsi ini adalah contoh "fruitful function" di mana nilai dikembalikan ke pemanggil menggunakan kata kunci `return`. Dengan mengembalikan nilai (bukan hanya mencetak print), hasil perhitungan diskon dapat digunakan kembali dalam kalkulasi harga total atau laporan keuangan.',
    optimizationConcept:
      'Menghindari Hardcoded Value: Dengan menjadikannya parameter, fungsi ini dapat menghitung diskon berapapun tanpa perlu mengubah baris kode fungsi di masa mendatang.',
    testCases: [
      {
        description: 'Buku Rp 50.000 dengan diskon 10%',
        inputArgs: [50000, 10],
        expectedReturn: 5000,
        expectedText: '5000'
      },
      {
        description: 'Tas Rp 120.000 dengan diskon 25%',
        inputArgs: [120000, 25],
        expectedReturn: 30000,
        expectedText: '30000'
      },
      {
        description: 'Pensil Rp 5.000 tanpa diskon (0%)',
        inputArgs: [5000, 0],
        expectedReturn: 0,
        expectedText: '0'
      }
    ]
  },
  {
    id: 'latihan-2',
    title: 'Latihan 2: Optimasi Kode & Prinsip DRY (Don\'t Repeat Yourself)',
    subtitle: 'Refactoring perhitungan ongkos kirim ekspedisi',
    level: 'Menengah',
    problemStatement:
      'Perhatikan kode monolitik di bawah yang berulang-ulang menghitung ongkir tiap paket secara manual. Lakukan *refactoring* dengan membuat sebuah fungsi modular `hitung_ongkir(berat_kg, tarif_per_kg=10000)` dengan ketentuan: berat dibulatkan ke atas minimal 1 kg (jika berat < 1 kg, dihitung 1 kg). Kembalikan total tarif ongkir.',
    guidance: [
      'Gunakan default parameter tarif_per_kg = 10000.',
      'Cek kondisi jika berat_kg < 1, jadikan berat efektif = 1, jika tidak gunakan berat_kg.',
      'Kembalikan berat_efektif * tarif_per_kg.'
    ],
    starterCode: `# KODE LAMA SEBELUM OPTIMASI (REDUNDAN):
# paket1 = 0.5; ongkir1 = 1 * 10000
# paket2 = 3.2; ongkir2 = 3.2 * 10000
# paket3 = 0.2; ongkir3 = 1 * 10000

# TUGAS: Buat fungsi modular hemat baris di bawah ini:
def hitung_ongkir(berat_kg, tarif_per_kg=10000):
    # Lengkapi fungsi ini
    pass
`,
    solutionCode: `def hitung_ongkir(berat_kg, tarif_per_kg=10000):
    berat_efektif = berat_kg
    if berat_kg < 1:
        berat_efektif = 1
    return int(berat_efektif * tarif_per_kg)
`,
    explanation:
      'Dengan membungkus logika pengecekan minimal 1 kg ke dalam fungsi `hitung_ongkir`, kita mengeliminasi potensi kesalahan manusia (*human error*) akibat menyalin rumus berkali-kali di berbagai bagian program.',
    optimizationConcept:
      'Prinsip Single Responsibility: Perubahan aturan ongkos kirim cukup dilakukan pada 1 baris di dalam fungsi ini tanpa merusak bagian program lain.',
    testCases: [
      {
        description: 'Paket ringan 0.5 kg (dihitung minimal 1 kg tarif default)',
        inputArgs: [0.5, 10000],
        expectedReturn: 10000,
        expectedText: '10000'
      },
      {
        description: 'Paket sedang 4 kg tarif default (10.000/kg)',
        inputArgs: [4, 10000],
        expectedReturn: 40000,
        expectedText: '40000'
      },
      {
        description: 'Paket 2.5 kg dengan tarif ekspres khusus 15.000/kg',
        inputArgs: [2.5, 15000],
        expectedReturn: 37500,
        expectedText: '37500'
      }
    ]
  },
  {
    id: 'latihan-3',
    title: 'Latihan 3: Fungsi Validasi Input & Keamanan Data',
    subtitle: 'Mencegah data anomali sebelum diproses komputasi',
    level: 'Tantangan',
    problemStatement:
      'Sistem kasir sering mengalami error saat kasir tidak sengaja memasukkan jumlah barang negatif atau angka nol. Buatlah fungsi `validasi_kuantitas(jumlah, batas_maksimal=100)` yang mengembalikan nilai boolean `True` jika jumlah berada di antara 1 hingga batas_maksimal (inklusif), atau `False` jika tidak valid.',
    guidance: [
      'Gunakan perbandingan 1 <= jumlah <= batas_maksimal',
      'Kembalikan True jika valid, False jika tidak valid',
      'Fungsi ini akan kita pakai sebagai modul penjaga pintu input di sistem kasir.'
    ],
    starterCode: `# Latihan 3: Fungsi Validator Logika
def validasi_kuantitas(jumlah, batas_maksimal=100):
    # Kembalikan True jika 1 <= jumlah <= batas_maksimal, selain itu False
    pass
`,
    solutionCode: `def validasi_kuantitas(jumlah, batas_maksimal=100):
    if 1 <= jumlah <= batas_maksimal:
        return True
    return False
`,
    explanation:
      'Fungsi predikat (*predicate function*) adalah fungsi yang mengembalikan nilai Boolean (True/False). Sangat penting dalam AI dan Rekayasa Perangkat Lunak untuk sanitasi input sebelum model atau database menerima data korup.',
    optimizationConcept:
      'Defensive Programming: Memisahkan logika validasi ke fungsi tersendiri mempermudah penulisan automated test secara independen.',
    testCases: [
      {
        description: 'Jumlah normal (5 barang, batas 100) -> Valid',
        inputArgs: [5, 100],
        expectedReturn: true,
        expectedText: 'True'
      },
      {
        description: 'Jumlah tidak valid: 0 barang -> Tidak Valid',
        inputArgs: [0, 100],
        expectedReturn: false,
        expectedText: 'False'
      },
      {
        description: 'Jumlah negatif (-3) -> Tidak Valid',
        inputArgs: [-3, 100],
        expectedReturn: false,
        expectedText: 'False'
      },
      {
        description: 'Melebihi batas maksimal: 150 barang (batas 100) -> Tidak Valid',
        inputArgs: [150, 100],
        expectedReturn: false,
        expectedText: 'False'
      }
    ]
  }
];

export const KASIR_MODULES: KasirModule[] = [
  {
    step: 1,
    id: 'kasir-modul-1',
    title: 'Modul 1: Kalkulasi Subtotal Barang',
    functionName: 'hitung_subtotal',
    functionSignature: 'hitung_subtotal(harga_satuan, kuantitas)',
    shortDesc: 'Menghitung total kotor per item belanja',
    description:
      'Modul pertama bertanggung jawab mengalikan harga satuan barang dengan jumlah barang yang dibeli. Modul ini harus memastikan bahwa jika kuantitas bernilai kurang dari atau sama dengan nol, subtotal yang dihasilkan adalah 0.',
    parameters: [
      {
        name: 'harga_satuan',
        type: 'int / float',
        description: 'Harga nominal per unit barang (misal: 15000)'
      },
      {
        name: 'kuantitas',
        type: 'int',
        description: 'Banyaknya barang yang dibeli (misal: 4)'
      }
    ],
    returnValueDesc: 'Bilangan bulat (int) total harga kotor barang (harga_satuan * kuantitas).',
    starterCode: `# MODUL 1: Menghitung Subtotal Item
def hitung_subtotal(harga_satuan, kuantitas):
    # Pastikan jika kuantitas <= 0, kembalikan 0
    # Hitung dan kembalikan harga_satuan * kuantitas
    pass
`,
    solutionCode: `def hitung_subtotal(harga_satuan, kuantitas):
    if kuantitas <= 0:
        return 0
    return int(harga_satuan * kuantitas)
`,
    sampleCall: 'hitung_subtotal(15000, 3) # Output: 45000',
    testCases: [
      {
        description: 'Beli 3 buku @ Rp 15.000',
        inputArgs: [15000, 3],
        expectedReturn: 45000,
        expectedText: '45000'
      },
      {
        description: 'Beli 10 pulpen @ Rp 2.500',
        inputArgs: [2500, 10],
        expectedReturn: 25000,
        expectedText: '25000'
      },
      {
        description: 'Kuantitas tidak valid / pembatalan (kuantitas 0)',
        inputArgs: [50000, 0],
        expectedReturn: 0,
        expectedText: '0'
      }
    ]
  },
  {
    step: 2,
    id: 'kasir-modul-2',
    title: 'Modul 2: Kebijakan Diskon Bertingkat & Member',
    functionName: 'hitung_diskon_kasir',
    functionSignature: 'hitung_diskon_kasir(subtotal, is_member)',
    shortDesc: 'Menentukan potongan harga berdasarkan ambang belanja dan kartu anggota',
    description:
      'Modul kedua menerapkan aturan bisnis toko:\n- Jika subtotal >= Rp 100.000, pembeli mendapatkan diskon belanja 10%.\n- Jika is_member bernilai True, pembeli mendapatkan diskon loyalitas tambahan sebesar 5%.\n- Total diskon maksimal dibatasi (*capped*) sebesar 20% dari subtotal.\n- Kembalikan nilai nominal diskon dalam bentuk bilangan bulat (int).',
    parameters: [
      {
        name: 'subtotal',
        type: 'int / float',
        description: 'Total belanja kotor sebelum diskon'
      },
      {
        name: 'is_member',
        type: 'bool',
        description: 'Status keanggotaan pelanggan (True / False)'
      }
    ],
    returnValueDesc: 'Bilangan bulat (int) nominal diskon yang berhak diperoleh pelanggan.',
    starterCode: `# MODUL 2: Kebijakan Diskon Toko
def hitung_diskon_kasir(subtotal, is_member):
    # Aturan 1: subtotal >= 100000 -> diskon 10%
    # Aturan 2: jika is_member == True -> tambah diskon 5%
    # Batas maksimal: total diskon tidak boleh melebihi 20% dari subtotal
    # Kembalikan nominal diskon (int)
    pass
`,
    solutionCode: `def hitung_diskon_kasir(subtotal, is_member):
    persen_diskon = 0.0
    if subtotal >= 100000:
        persen_diskon += 0.10
    if is_member:
        persen_diskon += 0.05
    if persen_diskon > 0.20:
        persen_diskon = 0.20
    nominal_diskon = subtotal * persen_diskon
    return int(nominal_diskon)
`,
    sampleCall: 'hitung_diskon_kasir(200000, True) # Output: 30000 (15% dari 200rb)',
    testCases: [
      {
        description: 'Belanja Rp 50.000, bukan member -> Diskon 0%',
        inputArgs: [50000, false],
        expectedReturn: 0,
        expectedText: '0'
      },
      {
        description: 'Belanja Rp 50.000, tapi memiliki Member -> Diskon 5% (Rp 2.500)',
        inputArgs: [50000, true],
        expectedReturn: 2500,
        expectedText: '2500'
      },
      {
        description: 'Belanja Rp 200.000, bukan member -> Diskon 10% (Rp 20.000)',
        inputArgs: [200000, false],
        expectedReturn: 20000,
        expectedText: '20000'
      },
      {
        description: 'Belanja Rp 200.000, dan Member -> Diskon 15% (Rp 30.000)',
        inputArgs: [200000, true],
        expectedReturn: 30000,
        expectedText: '30000'
      }
    ]
  },
  {
    step: 3,
    id: 'kasir-modul-3',
    title: 'Modul 3: Penghitungan PPN & Total Akhir',
    functionName: 'hitung_pajak_dan_total',
    functionSignature: 'hitung_pajak_dan_total(subtotal, diskon, tarif_pajak=0.11)',
    shortDesc: 'Menghitung DPP setelah diskon, PPN 11%, dan total pembayaran akhir',
    description:
      'Modul ketiga menghitung harga dasar setelah dipotong diskon, lalu mengenakan PPN (Pajak Pertambahan Nilai) dengan default tarif 11% (0.11).\nFungsi ini harus mengembalikan DUA nilai sekaligus (*tuple return*):\n1. Nilai pajak (int)\n2. Total akhir yang wajib dibayar (int)',
    parameters: [
      {
        name: 'subtotal',
        type: 'int',
        description: 'Total belanja kotor'
      },
      {
        name: 'diskon',
        type: 'int',
        description: 'Nominal potongan harga dari Modul 2'
      },
      {
        name: 'tarif_pajak',
        type: 'float',
        description: 'Persentase pajak PPN (nilai default = 0.11 atau 11%)',
        defaultValue: '0.11'
      }
    ],
    returnValueDesc: 'Tuple berisi dua elemen: (pajak_bulat, total_akhir_bulat).',
    starterCode: `# MODUL 3: Pajak & Total Bersih (Tuple Return)
def hitung_pajak_dan_total(subtotal, diskon, tarif_pajak=0.11):
    # 1. Hitung harga kena pajak = subtotal - diskon
    # 2. Hitung nominal pajak = harga_kena_pajak * tarif_pajak
    # 3. Hitung total akhir = harga_kena_pajak + nominal pajak
    # 4. Kembalikan dua nilai: return int(pajak), int(total_akhir)
    pass
`,
    solutionCode: `def hitung_pajak_dan_total(subtotal, diskon, tarif_pajak=0.11):
    dasar_pengenaan = subtotal - diskon
    pajak = dasar_pengenaan * tarif_pajak
    total_akhir = dasar_pengenaan + pajak
    return int(round(pajak)), int(round(total_akhir))
`,
    sampleCall: 'hitung_pajak_dan_total(100000, 10000) # Output: (9900, 99900)',
    testCases: [
      {
        description: 'Subtotal 100.000, Diskon 10.000, Pajak PPN 11%',
        inputArgs: [100000, 10000, 0.11],
        expectedReturn: [9900, 99900],
        expectedText: '(9900, 99900)'
      },
      {
        description: 'Subtotal 50.000, Diskon 0, Bebas Pajak (tarif_pajak=0.0)',
        inputArgs: [50000, 0, 0.0],
        expectedReturn: [0, 50000],
        expectedText: '(0, 50000)'
      },
      {
        description: 'Subtotal 200.000, Diskon 30.000, Pajak PPN 11%',
        inputArgs: [200000, 30000, 0.11],
        expectedReturn: [18700, 188700],
        expectedText: '(18700, 188700)'
      }
    ]
  },
  {
    step: 4,
    id: 'kasir-modul-4',
    title: 'Modul 4: Formatter Struk Transaksi Kasir',
    functionName: 'format_struk_transaksi',
    functionSignature: 'format_struk_transaksi(nama_kasir, subtotal, diskon, pajak, total_akhir)',
    shortDesc: 'Menyusun teks cetak struk belanja rapi dengan batas garis dan informasi lengkap',
    description:
      'Modul keempat menyatukan semua informasi pembayaran menjadi teks struk kasir profesional. Kembalikan sebuah string berformat multiline yang memuat nama kasir, subtotal, diskon, pajak, dan total bayar.',
    parameters: [
      { name: 'nama_kasir', type: 'str', description: 'Nama petugas kasir' },
      { name: 'subtotal', type: 'int', description: 'Total belanja sebelum diskon' },
      { name: 'diskon', type: 'int', description: 'Nominal potongan harga' },
      { name: 'pajak', type: 'int', description: 'Nominal PPN' },
      { name: 'total_akhir', type: 'int', description: 'Nominal akhir yang dibayar' }
    ],
    returnValueDesc: 'String teks struk belanja yang memuat rincian transaksi secara terstruktur.',
    starterCode: `# MODUL 4: Cetak Struk Belanja Kasir
def format_struk_transaksi(nama_kasir, subtotal, diskon, pajak, total_akhir):
    # Susun teks struk belanja menggunakan f-string multiline dan return hasil teks
    pass
`,
    solutionCode: `def format_struk_transaksi(nama_kasir, subtotal, diskon, pajak, total_akhir):
    struk = f"""==============================
        TOKO CERDAS AI
==============================
Kasir    : {nama_kasir}
Subtotal : Rp {subtotal}
Diskon   : Rp {diskon}
PPN (11%): Rp {pajak}
------------------------------
TOTAL    : Rp {total_akhir}
=============================="""
    return struk
`,
    sampleCall: 'format_struk_transaksi("Budi", 100000, 10000, 9900, 99900)',
    testCases: [
      {
        description: 'Memeriksa keberadaan nama kasir dan nilai total pada struk',
        inputArgs: ['Siti Aminah', 100000, 10000, 9900, 99900],
        customValidator: (actual: string) => {
          if (typeof actual !== 'string') return false;
          return (
            actual.includes('Siti Aminah') &&
            actual.includes('99900') &&
            actual.includes('Subtotal')
          );
        },
        expectedText: 'String teks memuat nama kasir "Siti Aminah" dan Total "99900"'
      }
    ]
  }
];

export const INTEGRATION_FULL_PROGRAM = `# =========================================================
# PROGRAM LENGKAP: SISTEM KASIR OTOMATIS MODULAR BERBASIS PYTHON
# Mata Pelajaran: Koding dan Kecerdasan Artifisial (Kelas X)
# =========================================================

# --- MODUL 1: KALKULASI SUBTOTAL PER ITEM ---
def hitung_subtotal(harga_satuan, kuantitas):
    if kuantitas <= 0:
        return 0
    return int(harga_satuan * kuantitas)

# --- MODUL 2: KEBIJAKAN DISKON TOKO ---
def hitung_diskon_kasir(subtotal, is_member):
    persen_diskon = 0.0
    if subtotal >= 100000:
        persen_diskon += 0.10
    if is_member:
        persen_diskon += 0.05
    if persen_diskon > 0.20:
        persen_diskon = 0.20
    return int(subtotal * persen_diskon)

# --- MODUL 3: PAJAK PPN & TOTAL AKHIR ---
def hitung_pajak_dan_total(subtotal, diskon, tarif_pajak=0.11):
    dasar = subtotal - diskon
    pajak = dasar * tarif_pajak
    total_akhir = dasar + pajak
    return int(round(pajak)), int(round(total_akhir))

# --- MODUL 4: FORMAT STRUK TRANSAKSI ---
def format_struk_transaksi(nama_kasir, subtotal, diskon, pajak, total_akhir):
    struk = f"""==============================
        TOKO CERDAS AI
==============================
Kasir    : {nama_kasir}
Subtotal : Rp {subtotal}
Diskon   : Rp {diskon}
PPN (11%): Rp {pajak}
------------------------------
TOTAL    : Rp {total_akhir}
=============================="""
    return struk

# --- PROGRAM UTAMA (ORCHESTRATOR) ---
def proses_transaksi(nama_kasir, daftar_belanja, is_member):
    subtotal_keseluruhan = 0
    for item in daftar_belanja:
        # Panggil Modul 1 untuk tiap barang
        subtotal_item = hitung_subtotal(item['harga'], item['jumlah'])
        subtotal_keseluruhan += subtotal_item

    # Panggil Modul 2
    diskon = hitung_diskon_kasir(subtotal_keseluruhan, is_member)

    # Panggil Modul 3
    pajak, total_akhir = hitung_pajak_dan_total(subtotal_keseluruhan, diskon)

    # Panggil Modul 4
    struk = format_struk_transaksi(nama_kasir, subtotal_keseluruhan, diskon, pajak, total_akhir)
    print(struk)
    return total_akhir

# Uji Coba Transaksi Pelanggan:
keranjang = [
    {'nama': 'Buku Tulis A5', 'harga': 6000, 'jumlah': 10}, # 60.000
    {'nama': 'Flashdisk 32GB', 'harga': 65000, 'jumlah': 2}  # 130.000
] # Total subtotal: 190.000

proses_transaksi('Rian Ramadhan', keranjang, is_member=True)
`;

export const RUBRIC_CRITERIA: RubricCriteria[] = [
  {
    id: 'kriteria-1',
    title: 'Dekomposisi Masalah & Desain Fungsi',
    weight: 25,
    descriptors: {
      level4:
        'Sangat Mahir (4): Mampu mengidentifikasi sub-masalah dengan sangat tepat dan merancang 4 modul fungsi independen yang memiliki tanggung jawab tunggal (Single Responsibility Principle).',
      level3:
        'Mahir (3): Mampu memecah masalah menjadi modul fungsi yang terpisah, meskipun batas tanggung jawab antarmodul sedikit tumpang tindih.',
      level2:
        'Cukup (2): Membagi fungsi tetapi masih ada logika utama yang dicampur aduk dalam satu fungsi monolitik besar.',
      level1:
        'Perlu Bimbingan (1): Tidak menerapkan dekomposisi fungsi; seluruh alur ditulis dalam satu blok kode linier tanpa fungsi.'
    }
  },
  {
    id: 'kriteria-2',
    title: 'Penggunaan Parameter & Return Value',
    weight: 25,
    descriptors: {
      level4:
        'Sangat Mahir (4): Menggunakan parameter posisi dan default parameter secara tepat; selalu mengembalikan nilai menggunakan "return" (bukan sekadar print) sehingga output dapat dikomposisikan oleh modul lain.',
      level3:
        'Mahir (3): Memahami parameter dan return value, namun sesekali masih mencetak langsung dengan print di dalam fungsi kalkulasi.',
      level2:
        'Cukup (2): Membuat fungsi dengan parameter tetapi lupa menyertakan nilai balik (return value) sehingga pemanggil menerima None.',
      level1:
        'Perlu Bimbingan (1): Tidak memahami perbedaan parameter dan argumen; menggunakan variabel global secara sembarangan di dalam fungsi.'
    }
  },
  {
    id: 'kriteria-3',
    title: 'Optimasi Kode & Prinsip DRY (Don\'t Repeat Yourself)',
    weight: 25,
    descriptors: {
      level4:
        'Sangat Mahir (4): Kode sangat efisien, ringkas, tidak ada perulangan rumus kalkulasi yang tidak perlu, serta penamaan identifier (variabel/fungsi) sangat representatif dan berstandar PEP 8.',
      level3:
        'Mahir (3): Menerapkan prinsip DRY pada sebagian besar kode, penamaan fungsi cukup jelas meski ada beberapa baris redundan.',
      level2:
        'Cukup (2): Terdapat duplikasi rumus logika kalkulasi di beberapa tempat; penamaan variabel kurang intuitif (misal: a, b, x).',
      level1:
        'Perlu Bimbingan (1): Kode sangat berantakan, banyak copy-paste baris kode, dan sulit dibaca/dipelihara.'
    }
  },
  {
    id: 'kriteria-4',
    title: 'Ketepatan Output & Kelulusan Kasus Uji',
    weight: 25,
    descriptors: {
      level4:
        'Sangat Mahir (4): Seluruh unit test pada Latihan 1-3 dan Kasir Modul 1-4 lulus 100% (semua centang hijau), termasuk kasus nilai batas (edge cases).',
      level3:
        'Mahir (3): Lulus 75% - 99% kasus uji; hanya ada kesalahan kecil pada pembulatan atau format penulisan teks struk.',
      level2:
        'Cukup (2): Lulus 50% - 74% kasus uji; logika dasar benar tetapi terdapat bug pada pengkondisian diskon atau kuantitas nol.',
      level1:
        'Perlu Bimbingan (1): Lulus kurang dari 50% kasus uji atau kode mengalami error kompilasi/runtime syntax.'
    }
  }
];

export const REFLECTION_QUESTIONS = [
  {
    id: 'refleksi-1',
    question: 'Apa perbedaan mendasar antara fungsi yang menggunakan kata kunci "return" dengan fungsi yang hanya menjalankan perintah "print()"? Mengapa sistem kasir membutuhkan "return"?'
  },
  {
    id: 'refleksi-2',
    question: 'Bagaimana modularitas fungsi membantu tim pengembang perangkat lunak atau programmer AI ketika terjadi perubahan aturan bisnis (misalnya tarif PPN naik dari 11% menjadi 12%)?'
  },
  {
    id: 'refleksi-3',
    question: 'Tantangan terbesar apa yang Anda hadapi saat merancang fungsi kalkulasi diskon bertingkat, dan bagaimana Anda mengatasinya?'
  }
];
