export type UserRole = 'admin' | 'operator';

export type UnitKerjaTransnaker =
  | 'Sekretariat Dinas'
  | 'Bidang Pemberdayaan Tenaga Kerja'
  | 'Bidang Hubungan Industrial'
  | 'Bidang Penyiapan dan Pembangunan Kawasan Transmigrasi'
  | 'Bidang Pengembangan Kawasan Transmigrasi';

export interface StrukturOrganisasiInfo {
  id: string;
  kode: string;
  nama: UnitKerjaTransnaker;
  namaPendek: string;
  singkatan: string;
  tugasPokok: string;
  pejabatPlt?: string;
  nipPejabat?: string;
  jumlahProgram: number;
}

export const STRUKTUR_ORGANISASI_TRANSNAKER: StrukturOrganisasiInfo[] = [
  {
    id: 'sekretariat',
    kode: 'SEKR',
    nama: 'Sekretariat Dinas',
    namaPendek: 'Sekretariat',
    singkatan: 'Sekretariat',
    tugasPokok: 'Pengkoordinasian perencanaan, keuangan, kepegawaian, perlengkapan umum, serta penyusunan pelaporan SAKIP dinas.',
    pejabatPlt: 'Sekretaris Dinas Transnaker',
    jumlahProgram: 2,
  },
  {
    id: 'pemberdayaan-tk',
    kode: 'BID-PTK',
    nama: 'Bidang Pemberdayaan Tenaga Kerja',
    namaPendek: 'Bidang Pemberdayaan TK',
    singkatan: 'Bidang Pemberdayaan TK',
    tugasPokok: 'Penyelenggaraan pelatihan kompetensi kerja, peningkatan produktivitas, standardisasi BNSP, dan pelayanan penempatan tenaga kerja (AK-1).',
    pejabatPlt: 'Kepala Bidang Pemberdayaan Tenaga Kerja',
    jumlahProgram: 2,
  },
  {
    id: 'hubungan-industrial',
    kode: 'BID-HI',
    nama: 'Bidang Hubungan Industrial',
    namaPendek: 'Bidang Hubungan Industrial',
    singkatan: 'Bidang HI',
    tugasPokok: 'Pembinaan syarat kerja, fasilitasi Perjanjian Kerja Bersama (PKB), perlindungan jaminan sosial (BPJS TK), dan penyelesaian perselisihan hubungan industrial.',
    pejabatPlt: 'Kepala Bidang Hubungan Industrial',
    jumlahProgram: 2,
  },
  {
    id: 'penyiapan-trans',
    kode: 'BID-PPKT',
    nama: 'Bidang Penyiapan dan Pembangunan Kawasan Transmigrasi',
    namaPendek: 'Bidang Penyiapan & Pembangunan Kawasan',
    singkatan: 'Bidang Penyiapan Kawasan',
    tugasPokok: 'Perencanaan teknis tata ruang kawasan transmigrasi, penyiapan lokasi permukiman, pembangunan sarana dan prasarana fisik permukiman baru.',
    pejabatPlt: 'Kepala Bidang Penyiapan dan Pembangunan Kawasan',
    jumlahProgram: 2,
  },
  {
    id: 'pengembangan-trans',
    kode: 'BID-PKT',
    nama: 'Bidang Pengembangan Kawasan Transmigrasi',
    namaPendek: 'Bidang Pengembangan Kawasan',
    singkatan: 'Bidang Pengembangan Kawasan',
    tugasPokok: 'Pemberdayaan sosial ekonomi warga transmigrasi, penguatan kelembagaan usaha tani, peningkatan pendapatan, dan kemandirian kawasan transmigrasi.',
    pejabatPlt: 'Kepala Bidang Pengembangan Kawasan Transmigrasi',
    jumlahProgram: 2,
  },
];

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  bidang: UnitKerjaTransnaker | string;
  nip?: string;
  avatarUrl?: string;
  createdAt: string;
}

export type ActiveMenu = 
  | 'dashboard-ikp'
  | 'dashboard-ikk'
  | 'dashboard-monitoring'
  | 'evaluasi-mandiri'
  | 'lke-penjelasan'
  | 'lke-rekap'
  | 'lke-data'
  | 'lke-kkepd'
  | 'lke-juknis'
  | 'lke-kke-penjelasan'
  | 'dokumen-sakip'
  | 'user-management';

export interface IKPItem {
  id: string;
  kode: string;
  sasaranProgram: string;
  indikator: string;
  satuan: string;
  targetTahunan: number;
  targetTW1: number;
  realisasiTW1: number;
  targetTW2: number;
  realisasiTW2: number;
  targetTW3: number;
  realisasiTW3: number;
  targetTW4: number;
  realisasiTW4: number;
  capaianAkhir: number;
  status: 'Tercapai' | 'Perlu Perhatian' | 'Belum Tercapai';
  penanggungJawab: string;
  keterangan: string;
  tahun: number;
}

export interface IKKItem {
  id: string;
  kode: string;
  program: string;
  kegiatan: string;
  indikatorKegiatan: string;
  satuan: string;
  bidang: UnitKerjaTransnaker;
  target: number;
  realisasi: number;
  persenCapaian: number;
  anggaran: number;
  realisasiAnggaran: number;
  penanggungJawab: string;
  tahun: number;
}

export interface KomponenPenilaian {
  id: string;
  kode: string;
  nama: string;
  bobot: number;
  nilai: number;
  nilaiTertimbang: number;
  subkomponen: {
    id: string;
    nama: string;
    bobot: number;
    nilai: number;
    keterangan: string;
  }[];
  catatanRekomendasi: string;
}

export interface LKEItem {
  id: string;
  komponen: string;
  subkomponen: string;
  kriteria: string;
  parameter: string;
  bobot: number;
  nilai: number; // 0 - 100
  nilaiAkhir: number;
  statusDukung: 'Lengkap' | 'Belum Lengkap' | 'Perlu Perbaikan';
  dokumenTerkait: string[];
  linkEvidence?: string;
  tautanDokumenId?: string;
  catatanEvaluator: string;
}

export interface KKEPDItem {
  id: string;
  kode: string;
  aspek: string;
  indikator: string;
  pertanyaan: string;
  kriteriaA: string;
  kriteriaB: string;
  kriteriaC: string;
  pilihan: 'A' | 'B' | 'C' | 'D' | 'E';
  skor: number;
  dataDukungDiunggah: string;
  tautanDokumenId?: string;
  linkEvidence?: string;
  catatanTimSAKIP: string;
  rekomendasiPerbaikan: string;
}

export interface SakipDocument {
  id: string;
  title: string;
  kategori: 'RENSTRA' | 'IKU' | 'PK' | 'RENJA' | 'LKjIP' | 'RENAKSI' | 'MONEV' | 'SOP' | 'LAINNYA';
  tahun: number;
  bidang: string;
  fileName: string;
  fileType: 'pdf' | 'xlsx' | 'docx';
  fileSize: string;
  fileDataUrl?: string; // base64 or object url for preview/download
  previewRows?: string[][]; // For spreadsheet viewer preview
  uploadedBy: string;
  uploadedAt: string;
  deskripsi: string;
  statusVerifikasi: 'Terverifikasi' | 'Menunggu Review' | 'Perlu Revisi';
  nomorSurat?: string;
}
