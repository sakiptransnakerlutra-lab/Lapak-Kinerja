import * as XLSX from 'xlsx';
import { IKPItem, IKKItem, LKEItem, KKEPDItem, SakipDocument } from '../types';

/**
 * Format currency to Indonesian Rupiah string (e.g., Rp 150.000.000)
 */
export function formatRupiah(value: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Helper to download Blob file in browser
 */
function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Helper to trigger Excel download via SheetJS XLSX write
 */
function downloadWorkbook(wb: XLSX.WorkBook, filename: string) {
  XLSX.writeFile(wb, filename, { bookType: 'xlsx' });
}

// ==========================================
// 1. IKP EXPORT (Indikator Kinerja Program)
// ==========================================

export interface ExportIKPOptions {
  year: number;
  statusFilter?: string;
  searchQuery?: string;
}

/**
 * Export IKP data to native Excel (.xlsx) format
 */
export function exportIKPToExcel(items: IKPItem[], options: ExportIKPOptions): void {
  const { year, statusFilter } = options;
  const wb = XLSX.utils.book_new();

  const formattedDate = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  // Calculate statistics
  const total = items.length;
  const tercapai = items.filter((i) => i.status === 'Tercapai').length;
  const perluPerhatian = items.filter((i) => i.status === 'Perlu Perhatian').length;
  const belumTercapai = items.filter((i) => i.status === 'Belum Tercapai').length;
  const avgCapaian = total > 0 ? (items.reduce((acc, c) => acc + c.capaianAkhir, 0) / total).toFixed(2) : '0';

  // Build rows array of arrays (AOA)
  const rows: any[][] = [
    ['PEMERINTAH KABUPATEN LUWU UTARA'],
    ['DINAS TRANSMIGRASI DAN TENAGA KERJA'],
    [`LAPORAN CAPAIAN INDIKATOR KINERJA PROGRAM (IKP) TAHUN ANGGARAN ${year}`],
    [`Tanggal Unduh: ${formattedDate} | Status: ${statusFilter === 'all' || !statusFilter ? 'Semua Status' : statusFilter} | Total Indikator: ${total}`],
    [], // empty line
    [
      'No',
      'Kode IKP',
      'Sasaran Program',
      'Indikator Kinerja Program (IKP)',
      'Satuan',
      'Target Tahunan',
      'Target TW I',
      'Realisasi TW I',
      'Target TW II',
      'Realisasi TW II',
      'Target TW III',
      'Realisasi TW III',
      'Target TW IV',
      'Realisasi TW IV',
      '% Capaian Akhir',
      'Status Capaian',
      'Penanggung Jawab',
      'Keterangan / Tindak Lanjut',
    ],
  ];

  // Data rows
  items.forEach((item, index) => {
    rows.push([
      index + 1,
      item.kode,
      item.sasaranProgram,
      item.indikator,
      item.satuan,
      item.targetTahunan,
      item.targetTW1,
      item.realisasiTW1,
      item.targetTW2,
      item.realisasiTW2,
      item.targetTW3,
      item.realisasiTW3,
      item.targetTW4,
      item.realisasiTW4,
      Number(item.capaianAkhir.toFixed(2)),
      item.status,
      item.penanggungJawab,
      item.keterangan || '-',
    ]);
  });

  // Summary footer
  rows.push([]);
  rows.push(['RINGKASAN AKUNTABILITAS KINERJA PROGRAM (IKP)']);
  rows.push(['Rata-rata Capaian Akhir Dinas', `${avgCapaian}%`]);
  rows.push(['Total Indikator Program', total]);
  rows.push(['Indikator Tercapai (>= 100%)', `${tercapai} Indikator`]);
  rows.push(['Indikator Perlu Perhatian (80-99%)', `${perluPerhatian} Indikator`]);
  rows.push(['Indikator Belum Tercapai (< 80%)', `${belumTercapai} Indikator`]);

  const ws = XLSX.utils.aoa_to_sheet(rows);

  // Set column widths for readability
  ws['!cols'] = [
    { wch: 5 },  // No
    { wch: 12 }, // Kode
    { wch: 35 }, // Sasaran Program
    { wch: 45 }, // Indikator
    { wch: 12 }, // Satuan
    { wch: 15 }, // Target Tahunan
    { wch: 12 }, // Target TW1
    { wch: 14 }, // Realisasi TW1
    { wch: 12 }, // Target TW2
    { wch: 14 }, // Realisasi TW2
    { wch: 12 }, // Target TW3
    { wch: 14 }, // Realisasi TW3
    { wch: 12 }, // Target TW4
    { wch: 14 }, // Realisasi TW4
    { wch: 16 }, // Capaian Akhir
    { wch: 18 }, // Status
    { wch: 35 }, // Penanggung Jawab
    { wch: 35 }, // Keterangan
  ];

  XLSX.utils.book_append_sheet(wb, ws, `IKP_${year}`);
  const filename = `Laporan_Capaian_IKP_Transnaker_Luwu_Utara_${year}.xlsx`;
  downloadWorkbook(wb, filename);
}

/**
 * Export IKP data to CSV format with UTF-8 BOM
 */
export function exportIKPToCSV(items: IKPItem[], options: ExportIKPOptions): void {
  const { year } = options;

  const headers = [
    'No',
    'Kode IKP',
    'Sasaran Program',
    'Indikator Kinerja Program',
    'Satuan',
    'Target Tahunan',
    'Target TW1',
    'Realisasi TW1',
    'Target TW2',
    'Realisasi TW2',
    'Target TW3',
    'Realisasi TW3',
    'Target TW4',
    'Realisasi TW4',
    'Capaian Akhir (%)',
    'Status Capaian',
    'Penanggung Jawab',
    'Keterangan',
  ];

  const escapeCSV = (str: any) => {
    if (str === null || str === undefined) return '""';
    const s = String(str).replace(/"/g, '""');
    return `"${s}"`;
  };

  const lines: string[] = [
    `# PEMERINTAH KABUPATEN LUWU UTARA`,
    `# DINAS TRANSMIGRASI DAN TENAGA KERJA`,
    `# LAPORAN CAPAIAN INDIKATOR KINERJA PROGRAM (IKP) TAHUN ${year}`,
    headers.map(escapeCSV).join(','),
  ];

  items.forEach((item, index) => {
    const row = [
      index + 1,
      item.kode,
      item.sasaranProgram,
      item.indikator,
      item.satuan,
      item.targetTahunan,
      item.targetTW1,
      item.realisasiTW1,
      item.targetTW2,
      item.realisasiTW2,
      item.targetTW3,
      item.realisasiTW3,
      item.targetTW4,
      item.realisasiTW4,
      item.capaianAkhir,
      item.status,
      item.penanggungJawab,
      item.keterangan || '-',
    ];
    lines.push(row.map(escapeCSV).join(','));
  });

  const csvString = '\uFEFF' + lines.join('\r\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  downloadBlob(blob, `Laporan_Capaian_IKP_Transnaker_Luwu_Utara_${year}.csv`);
}

// ==========================================
// 2. IKK EXPORT (Indikator Kinerja Kegiatan)
// ==========================================

export interface ExportIKKOptions {
  year: number;
  bidangFilter?: string;
  searchQuery?: string;
}

/**
 * Export IKK data to native Excel (.xlsx) format
 */
export function exportIKKToExcel(items: IKKItem[], options: ExportIKKOptions): void {
  const { year, bidangFilter } = options;
  const wb = XLSX.utils.book_new();

  const formattedDate = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  // Calculate statistics
  const total = items.length;
  const totalPagu = items.reduce((acc, c) => acc + c.anggaran, 0);
  const totalRealisasi = items.reduce((acc, c) => acc + c.realisasiAnggaran, 0);
  const avgCapaian = total > 0 ? (items.reduce((acc, c) => acc + c.persenCapaian, 0) / total).toFixed(2) : '0';
  const serapanPersen = totalPagu > 0 ? ((totalRealisasi / totalPagu) * 100).toFixed(2) : '0';

  // Build rows array of arrays (AOA)
  const rows: any[][] = [
    ['PEMERINTAH KABUPATEN LUWU UTARA'],
    ['DINAS TRANSMIGRASI DAN TENAGA KERJA'],
    [`LAPORAN CAPAIAN INDIKATOR KINERJA KEGIATAN (IKK) TAHUN ANGGARAN ${year}`],
    [`Tanggal Unduh: ${formattedDate} | Bidang: ${bidangFilter === 'all' || !bidangFilter ? 'Semua Bidang' : bidangFilter} | Total Kegiatan: ${total}`],
    [], // empty line
    [
      'No',
      'Kode IKK',
      'Bidang / Unit Kerja',
      'Nama Program',
      'Nama Kegiatan',
      'Indikator Kinerja Kegiatan',
      'Satuan',
      'Target Fisik',
      'Realisasi Fisik',
      '% Capaian Fisik',
      'Pagu Anggaran (Rp)',
      'Realisasi Anggaran (Rp)',
      '% Realisasi Keuangan',
      'Sisa Anggaran (Rp)',
      'Penanggung Jawab / PPTK',
    ],
  ];

  // Data rows
  items.forEach((item, index) => {
    const sisa = Math.max(0, item.anggaran - item.realisasiAnggaran);
    const persenKeuangan = item.anggaran > 0 ? Number(((item.realisasiAnggaran / item.anggaran) * 100).toFixed(2)) : 0;

    rows.push([
      index + 1,
      item.kode,
      item.bidang,
      item.program,
      item.kegiatan,
      item.indikatorKegiatan,
      item.satuan,
      item.target,
      item.realisasi,
      Number(item.persenCapaian.toFixed(2)),
      item.anggaran,
      item.realisasiAnggaran,
      persenKeuangan,
      sisa,
      item.penanggungJawab,
    ]);
  });

  // Summary footer
  rows.push([]);
  rows.push(['REKAPITULASI KINERJA DAN KEUANGAN (IKK)']);
  rows.push(['Total Jumlah Kegiatan', total]);
  rows.push(['Rata-rata Capaian Fisik Kinerja', `${avgCapaian}%`]);
  rows.push(['Total Pagu Anggaran', totalPagu]);
  rows.push(['Total Realisasi Anggaran', totalRealisasi]);
  rows.push(['Persentase Serapan Keuangan', `${serapanPersen}%`]);
  rows.push(['Sisa Anggaran Belum Terealisasi', Math.max(0, totalPagu - totalRealisasi)]);

  const ws = XLSX.utils.aoa_to_sheet(rows);

  // Set column widths for comfortable viewing
  ws['!cols'] = [
    { wch: 5 },  // No
    { wch: 12 }, // Kode
    { wch: 35 }, // Bidang
    { wch: 35 }, // Program
    { wch: 40 }, // Kegiatan
    { wch: 45 }, // Indikator
    { wch: 12 }, // Satuan
    { wch: 14 }, // Target Fisik
    { wch: 14 }, // Realisasi Fisik
    { wch: 16 }, // % Capaian Fisik
    { wch: 20 }, // Pagu Anggaran
    { wch: 20 }, // Realisasi Anggaran
    { wch: 18 }, // % Keuangan
    { wch: 20 }, // Sisa Anggaran
    { wch: 35 }, // Penanggung Jawab
  ];

  XLSX.utils.book_append_sheet(wb, ws, `IKK_${year}`);
  const filename = `Laporan_Capaian_IKK_Transnaker_Luwu_Utara_${year}.xlsx`;
  downloadWorkbook(wb, filename);
}

/**
 * Export IKK data to CSV format with UTF-8 BOM
 */
export function exportIKKToCSV(items: IKKItem[], options: ExportIKKOptions): void {
  const { year } = options;

  const headers = [
    'No',
    'Kode IKK',
    'Bidang',
    'Program',
    'Kegiatan',
    'Indikator Kegiatan',
    'Satuan',
    'Target Fisik',
    'Realisasi Fisik',
    'Capaian Fisik (%)',
    'Pagu Anggaran (Rp)',
    'Realisasi Anggaran (Rp)',
    'Serapan Keuangan (%)',
    'Sisa Anggaran (Rp)',
    'Penanggung Jawab',
  ];

  const escapeCSV = (str: any) => {
    if (str === null || str === undefined) return '""';
    const s = String(str).replace(/"/g, '""');
    return `"${s}"`;
  };

  const lines: string[] = [
    `# PEMERINTAH KABUPATEN LUWU UTARA`,
    `# DINAS TRANSMIGRASI DAN TENAGA KERJA`,
    `# LAPORAN CAPAIAN INDIKATOR KINERJA KEGIATAN (IKK) TAHUN ${year}`,
    headers.map(escapeCSV).join(','),
  ];

  items.forEach((item, index) => {
    const sisa = Math.max(0, item.anggaran - item.realisasiAnggaran);
    const persenKeuangan = item.anggaran > 0 ? Number(((item.realisasiAnggaran / item.anggaran) * 100).toFixed(2)) : 0;

    const row = [
      index + 1,
      item.kode,
      item.bidang,
      item.program,
      item.kegiatan,
      item.indikatorKegiatan,
      item.satuan,
      item.target,
      item.realisasi,
      item.persenCapaian,
      item.anggaran,
      item.realisasiAnggaran,
      persenKeuangan,
      sisa,
      item.penanggungJawab,
    ];
    lines.push(row.map(escapeCSV).join(','));
  });

  const csvString = '\uFEFF' + lines.join('\r\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  downloadBlob(blob, `Laporan_Capaian_IKK_Transnaker_Luwu_Utara_${year}.csv`);
}

// ==========================================
// 3. LKE EXPORT (Lembar Kerja Evaluasi SAKIP)
// ==========================================

export interface ExportLKEOptions {
  year?: number;
  searchQuery?: string;
}

/**
 * Export Data LKE to native Excel (.xlsx) format
 */
export function exportLKEToExcel(items: LKEItem[], options?: ExportLKEOptions): void {
  const year = options?.year || 2024;
  const wb = XLSX.utils.book_new();

  const formattedDate = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const total = items.length;
  const lengkapCount = items.filter(i => i.statusDukung === 'Lengkap').length;
  const perluPerbaikanCount = items.filter(i => i.statusDukung === 'Perlu Perbaikan').length;
  const belumLengkapCount = items.filter(i => i.statusDukung === 'Belum Lengkap').length;
  const totalNilaiAkhir = items.reduce((acc, curr) => acc + curr.nilaiAkhir, 0);

  const rows: any[][] = [
    ['PEMERINTAH KABUPATEN LUWU UTARA'],
    ['DINAS TRANSMIGRASI DAN TENAGA KERJA'],
    [`DATA RINCIAN LEMBAR KERJA EVALUASI (LKE) SAKIP TAHUN ANGGARAN ${year}`],
    [`Tanggal Unduh: ${formattedDate} | Total Parameter: ${total} | Eviden Lengkap: ${lengkapCount} | Nilai Tertimbang: ${totalNilaiAkhir.toFixed(2)}`],
    [], // empty line
    [
      'No',
      'Komponen SAKIP',
      'Sub-Komponen',
      'Kriteria Evaluasi',
      'Parameter & Indikator Uji',
      'Bobot (%)',
      'Skor (0-100)',
      'Nilai Tertimbang',
      'Status Eviden',
      'Dokumen Wajib Terkait',
      'Dokumen Eviden Terunggah',
      'Format & Ukuran Berkas',
      'Waktu Unggah',
      'Pengunggah',
      'Tautan Link Evidence',
      'Catatan & Rekomendasi Evaluator',
    ],
  ];

  items.forEach((item, index) => {
    rows.push([
      index + 1,
      item.komponen,
      item.subkomponen,
      item.kriteria,
      item.parameter,
      item.bobot,
      item.nilai,
      Number(item.nilaiAkhir.toFixed(2)),
      item.statusDukung,
      item.dokumenTerkait.join('; '),
      item.uploadedFileName || '-',
      item.uploadedFileName ? `${item.uploadedFileType?.toUpperCase() || 'FILE'} (${item.uploadedFileSize || '-'})` : '-',
      item.uploadedAt || '-',
      item.uploadedBy || '-',
      item.linkEvidence || '-',
      item.catatanEvaluator || '-',
    ]);
  });

  // Summary footer
  rows.push([]);
  rows.push(['REKAPITULASI CAPAIAN LEMBAR KERJA EVALUASI (LKE) SAKIP']);
  rows.push(['Total Parameter Evaluasi', total]);
  rows.push(['Total Nilai Capaian LKE SAKIP', Number(totalNilaiAkhir.toFixed(2))]);
  rows.push(['Predikat Nilai Capaian', totalNilaiAkhir >= 80 ? 'A (Memuaskan)' : (totalNilaiAkhir >= 70 ? 'BB (Sangat Baik)' : 'B (Baik)')]);
  rows.push(['Parameter dengan Eviden Lengkap', `${lengkapCount} Butir`]);
  rows.push(['Parameter Perlu Perbaikan', `${perluPerbaikanCount} Butir`]);
  rows.push(['Parameter Belum Lengkap', `${belumLengkapCount} Butir`]);

  const ws = XLSX.utils.aoa_to_sheet(rows);

  ws['!cols'] = [
    { wch: 5 },  // No
    { wch: 22 }, // Komponen
    { wch: 24 }, // Subkomponen
    { wch: 35 }, // Kriteria
    { wch: 45 }, // Parameter
    { wch: 10 }, // Bobot
    { wch: 12 }, // Skor
    { wch: 15 }, // Nilai Akhir
    { wch: 16 }, // Status
    { wch: 32 }, // Dokumen Terkait
    { wch: 35 }, // Berkas Terunggah
    { wch: 18 }, // Format & Ukuran
    { wch: 18 }, // Waktu Unggah
    { wch: 20 }, // Pengunggah
    { wch: 35 }, // Link Evidence
    { wch: 40 }, // Catatan Evaluator
  ];

  XLSX.utils.book_append_sheet(wb, ws, `Data_LKE_${year}`);
  const filename = `Data_LKE_SAKIP_Transnaker_Luwu_Utara_${year}.xlsx`;
  downloadWorkbook(wb, filename);
}

/**
 * Export Data LKE to CSV format with UTF-8 BOM
 */
export function exportLKEToCSV(items: LKEItem[], options?: ExportLKEOptions): void {
  const year = options?.year || 2024;

  const headers = [
    'No',
    'Komponen',
    'Sub-Komponen',
    'Kriteria',
    'Parameter',
    'Bobot (%)',
    'Skor',
    'Nilai Tertimbang',
    'Status Eviden',
    'Dokumen Terkait',
    'Berkas Terunggah',
    'Ukuran Berkas',
    'Pengunggah',
    'Waktu Unggah',
    'Link Evidence',
    'Catatan Evaluasi',
  ];

  const escapeCSV = (str: any) => {
    if (str === null || str === undefined) return '""';
    const s = String(str).replace(/"/g, '""');
    return `"${s}"`;
  };

  const lines: string[] = [
    `# PEMERINTAH KABUPATEN LUWU UTARA`,
    `# DINAS TRANSMIGRASI DAN TENAGA KERJA`,
    `# DATA RINCIAN LEMBAR KERJA EVALUASI (LKE) SAKIP TAHUN ${year}`,
    headers.map(escapeCSV).join(','),
  ];

  items.forEach((item, index) => {
    const row = [
      index + 1,
      item.komponen,
      item.subkomponen,
      item.kriteria,
      item.parameter,
      item.bobot,
      item.nilai,
      item.nilaiAkhir.toFixed(2),
      item.statusDukung,
      item.dokumenTerkait.join('; '),
      item.uploadedFileName || '-',
      item.uploadedFileSize || '-',
      item.uploadedBy || '-',
      item.uploadedAt || '-',
      item.linkEvidence || '-',
      item.catatanEvaluator || '-',
    ];
    lines.push(row.map(escapeCSV).join(','));
  });

  const csvString = '\uFEFF' + lines.join('\r\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  downloadBlob(blob, `Data_LKE_SAKIP_Transnaker_Luwu_Utara_${year}.csv`);
}

// ==========================================
// 4. DOKUMEN SAKIP EXPORT (Bank Data & Berkas)
// ==========================================

export interface ExportDokumenSakipOptions {
  category?: string;
  year?: string;
  bidang?: string;
  searchQuery?: string;
}

/**
 * Export Daftar Dokumen SAKIP to native Excel (.xlsx) format
 */
export function exportDokumenSakipToExcel(docs: SakipDocument[], options?: ExportDokumenSakipOptions): void {
  const wb = XLSX.utils.book_new();

  const formattedDate = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const total = docs.length;
  const pdfCount = docs.filter(d => d.fileType === 'pdf').length;
  const xlsxCount = docs.filter(d => d.fileType === 'xlsx').length;
  const docxCount = docs.filter(d => d.fileType === 'docx').length;
  const verifiedCount = docs.filter(d => d.statusVerifikasi === 'Terverifikasi').length;

  const categoryLabel = options?.category && options.category !== 'all' ? options.category : 'Semua Kategori';
  const yearLabel = options?.year && options.year !== 'all' ? options.year : 'Semua Tahun';
  const bidangLabel = options?.bidang && options.bidang !== 'all' ? options.bidang : 'Semua Unit Kerja';

  const rows: any[][] = [
    ['PEMERINTAH KABUPATEN LUWU UTARA'],
    ['DINAS TRANSMIGRASI DAN TENAGA KERJA'],
    ['REPOSITORI DATA DUKUNG & DAFTAR DOKUMEN RESMI SAKIP'],
    [`Tanggal Unduh: ${formattedDate} | Kategori: ${categoryLabel} | Tahun: ${yearLabel} | Unit Kerja: ${bidangLabel} | Total Dokumen: ${total}`],
    [], // empty line
    [
      'No',
      'Judul Dokumen SAKIP',
      'Nomor Surat / SK Legalitas',
      'Kategori',
      'Tahun Anggaran',
      'Unit Pengunggah (Bidang / Sekretariat)',
      'Nama Berkas Digital',
      'Format Berkas',
      'Ukuran Berkas',
      'Pengunggah (Uploader)',
      'Tanggal Unggah',
      'Status Verifikasi',
      'Deskripsi / Catatan Dokumen',
    ],
  ];

  docs.forEach((doc, index) => {
    rows.push([
      index + 1,
      doc.title,
      doc.nomorSurat || '-',
      doc.kategori,
      doc.tahun,
      doc.bidang,
      doc.fileName,
      doc.fileType.toUpperCase(),
      doc.fileSize || '-',
      doc.uploadedBy,
      doc.uploadedAt,
      doc.statusVerifikasi || 'Terverifikasi',
      doc.deskripsi || '-',
    ]);
  });

  // Summary footer
  rows.push([]);
  rows.push(['RINGKASAN REPOSITORI DOKUMEN KINERJA SAKIP']);
  rows.push(['Total Dokumen Terdaftar', total]);
  rows.push(['Dokumen Format PDF (*.pdf)', `${pdfCount} Berkas`]);
  rows.push(['Dokumen Spreadsheet Excel (*.xlsx)', `${xlsxCount} Berkas`]);
  rows.push(['Dokumen Word (*.docx)', `${docxCount} Berkas`]);
  rows.push(['Dokumen Berstatus Terverifikasi', `${verifiedCount} Berkas`]);

  const ws = XLSX.utils.aoa_to_sheet(rows);

  ws['!cols'] = [
    { wch: 5 },  // No
    { wch: 45 }, // Judul Dokumen
    { wch: 25 }, // Nomor Surat
    { wch: 14 }, // Kategori
    { wch: 12 }, // Tahun
    { wch: 32 }, // Unit Pengunggah
    { wch: 40 }, // Nama Berkas
    { wch: 12 }, // Format
    { wch: 14 }, // Ukuran
    { wch: 20 }, // Pengunggah
    { wch: 15 }, // Tanggal Unggah
    { wch: 18 }, // Status Verifikasi
    { wch: 40 }, // Deskripsi
  ];

  XLSX.utils.book_append_sheet(wb, ws, 'Dokumen_SAKIP');
  const filename = `Daftar_Dokumen_SAKIP_Transnaker_Luwu_Utara.xlsx`;
  downloadWorkbook(wb, filename);
}

/**
 * Export Daftar Dokumen SAKIP to CSV format with UTF-8 BOM
 */
export function exportDokumenSakipToCSV(docs: SakipDocument[], options?: ExportDokumenSakipOptions): void {
  const headers = [
    'No',
    'Judul Dokumen',
    'Nomor Surat',
    'Kategori',
    'Tahun',
    'Unit Pengunggah',
    'Nama Berkas',
    'Format Berkas',
    'Ukuran Berkas',
    'Pengunggah',
    'Tanggal Unggah',
    'Status Verifikasi',
    'Deskripsi',
  ];

  const escapeCSV = (str: any) => {
    if (str === null || str === undefined) return '""';
    const s = String(str).replace(/"/g, '""');
    return `"${s}"`;
  };

  const lines: string[] = [
    `# PEMERINTAH KABUPATEN LUWU UTARA`,
    `# DINAS TRANSMIGRASI DAN TENAGA KERJA`,
    `# REPOSITORI DOKUMEN RESMI SAKIP`,
    headers.map(escapeCSV).join(','),
  ];

  docs.forEach((doc, index) => {
    const row = [
      index + 1,
      doc.title,
      doc.nomorSurat || '-',
      doc.kategori,
      doc.tahun,
      doc.bidang,
      doc.fileName,
      doc.fileType.toUpperCase(),
      doc.fileSize || '-',
      doc.uploadedBy,
      doc.uploadedAt,
      doc.statusVerifikasi || 'Terverifikasi',
      doc.deskripsi || '-',
    ];
    lines.push(row.map(escapeCSV).join(','));
  });

  const csvString = '\uFEFF' + lines.join('\r\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  downloadBlob(blob, `Daftar_Dokumen_SAKIP_Transnaker_Luwu_Utara.csv`);
}

// ==========================================
// 5. KKE PD EXPORT (Kertas Kerja Evaluasi PD)
// ==========================================

export function exportKKEPDToExcel(items: KKEPDItem[]): void {
  const wb = XLSX.utils.book_new();

  const formattedDate = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const total = items.length;
  const avgSkor = total > 0 ? (items.reduce((acc, c) => acc + c.skor, 0) / total).toFixed(2) : '0';

  const rows: any[][] = [
    ['PEMERINTAH KABUPATEN LUWU UTARA'],
    ['DINAS TRANSMIGRASI DAN TENAGA KERJA'],
    ['KERTAS KERJA EVALUASI PERANGKAT DAERAH (KKE PD) SAKIP 2024'],
    [`Tanggal Unduh: ${formattedDate} | Total Indikator: ${total} | Rata-rata Skor: ${avgSkor}`],
    [],
    [
      'No',
      'Kode',
      'Aspek Evaluasi',
      'Indikator Uji',
      'Pertanyaan Evaluasi',
      'Pilihan Nilai',
      'Skor',
      'Data Dukung Diunggah',
      'Berkas Dokumen Eviden',
      'Ukuran Berkas',
      'Link Evidence',
      'Catatan Tim SAKIP',
      'Rekomendasi Perbaikan',
    ],
  ];

  items.forEach((item, index) => {
    rows.push([
      index + 1,
      item.kode,
      item.aspek,
      item.indikator,
      item.pertanyaan,
      item.pilihan,
      item.skor,
      item.dataDukungDiunggah,
      item.uploadedFileName || '-',
      item.uploadedFileSize || '-',
      item.linkEvidence || '-',
      item.catatanTimSAKIP || '-',
      item.rekomendasiPerbaikan || '-',
    ]);
  });

  rows.push([]);
  rows.push(['RINGKASAN KERTAS KERJA EVALUASI PERANGKAT DAERAH']);
  rows.push(['Total Parameter Uji KKE PD', total]);
  rows.push(['Rata-rata Skor Capaian', Number(avgSkor)]);

  const ws = XLSX.utils.aoa_to_sheet(rows);

  ws['!cols'] = [
    { wch: 5 },  // No
    { wch: 14 }, // Kode
    { wch: 25 }, // Aspek
    { wch: 35 }, // Indikator
    { wch: 45 }, // Pertanyaan
    { wch: 10 }, // Pilihan
    { wch: 10 }, // Skor
    { wch: 35 }, // Data Dukung
    { wch: 35 }, // Berkas
    { wch: 15 }, // Ukuran
    { wch: 35 }, // Link Evidence
    { wch: 35 }, // Catatan
    { wch: 35 }, // Rekomendasi
  ];

  XLSX.utils.book_append_sheet(wb, ws, 'KKE_PD_2024');
  const filename = `KKE_PD_SAKIP_Transnaker_Luwu_Utara_2024.xlsx`;
  downloadWorkbook(wb, filename);
}

export function exportKKEPDToCSV(items: KKEPDItem[]): void {
  const headers = [
    'No',
    'Kode',
    'Aspek Evaluasi',
    'Indikator',
    'Pertanyaan',
    'Pilihan',
    'Skor',
    'Data Dukung',
    'Berkas Terunggah',
    'Link Evidence',
    'Catatan Tim SAKIP',
    'Rekomendasi Perbaikan',
  ];

  const escapeCSV = (str: any) => {
    if (str === null || str === undefined) return '""';
    const s = String(str).replace(/"/g, '""');
    return `"${s}"`;
  };

  const lines: string[] = [
    `# PEMERINTAH KABUPATEN LUWU UTARA`,
    `# DINAS TRANSMIGRASI DAN TENAGA KERJA`,
    `# KERTAS KERJA EVALUASI PERANGKAT DAERAH (KKE PD) SAKIP 2024`,
    headers.map(escapeCSV).join(','),
  ];

  items.forEach((item, index) => {
    const row = [
      index + 1,
      item.kode,
      item.aspek,
      item.indikator,
      item.pertanyaan,
      item.pilihan,
      item.skor,
      item.dataDukungDiunggah,
      item.uploadedFileName || '-',
      item.linkEvidence || '-',
      item.catatanTimSAKIP || '-',
      item.rekomendasiPerbaikan || '-',
    ];
    lines.push(row.map(escapeCSV).join(','));
  });

  const csvString = '\uFEFF' + lines.join('\r\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  downloadBlob(blob, `KKE_PD_SAKIP_Transnaker_Luwu_Utara_2024.csv`);
}


