import * as XLSX from 'xlsx';
import { IKPItem, IKKItem } from '../types';

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
