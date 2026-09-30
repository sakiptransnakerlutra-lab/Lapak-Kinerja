import React from 'react';
import { 
  Activity, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  FileCheck, 
  Printer, 
  Calendar,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  Building2,
  TrendingUp,
  FileText
} from 'lucide-react';
import { IKPItem, IKKItem, SakipDocument, KomponenPenilaian, STRUKTUR_ORGANISASI_TRANSNAKER } from '../types';
import { PrintHeader, PrintSignature } from '../components/PrintHeader';

interface DashboardMonitoringViewProps {
  ikpList: IKPItem[];
  ikkList: IKKItem[];
  documents: SakipDocument[];
  penilaianList: KomponenPenilaian[];
  onNavigateMenu: (menu: any) => void;
}

export const DashboardMonitoringView: React.FC<DashboardMonitoringViewProps> = ({
  ikpList,
  ikkList,
  documents,
  penilaianList,
  onNavigateMenu,
}) => {
  // Compute SAKIP total score
  const totalScore = penilaianList.reduce((acc, curr) => acc + curr.nilaiTertimbang, 0);
  const formattedScore = Math.round(totalScore * 100) / 100;

  let predikat = 'BB';
  let predikatColor = 'text-blue-600 bg-blue-50 border-blue-200';
  if (formattedScore >= 90) { predikat = 'AA'; predikatColor = 'text-emerald-700 bg-emerald-50 border-emerald-300'; }
  else if (formattedScore >= 80) { predikat = 'A'; predikatColor = 'text-emerald-600 bg-emerald-50 border-emerald-200'; }
  else if (formattedScore >= 70) { predikat = 'BB'; predikatColor = 'text-blue-600 bg-blue-50 border-blue-200'; }
  else if (formattedScore >= 60) { predikat = 'B'; predikatColor = 'text-amber-600 bg-amber-50 border-amber-200'; }
  else { predikat = 'CC'; predikatColor = 'text-red-600 bg-red-50 border-red-200'; }

  // Milestones
  const milestones = [
    { title: 'Penyusunan Perjanjian Kinerja (PK) 2026', status: 'Selesai', date: '10 Januari 2026', docId: 'doc-pk' },
    { title: 'Penyusunan Dokumen RENJA & RKT 2026', status: 'Selesai', date: '18 Februari 2026', docId: 'doc-renja' },
    { title: 'Penyusunan LKjIP Tahun Anggaran 2025', status: 'Selesai', date: '28 Februari 2026', docId: 'doc-lkjip' },
    { title: 'Monitoring & Evaluasi Kinerja Triwulan I', status: 'Selesai', date: '15 April 2026', docId: null },
    { title: 'Monitoring & Evaluasi Kinerja Triwulan II', status: 'Selesai', date: '15 Juli 2026', docId: 'doc-monev' },
    { title: 'Monitoring & Evaluasi Kinerja Triwulan III', status: 'Dalam Proses', date: '15 Oktober 2026', docId: null },
    { title: 'Evaluasi Akuntabilitas Kinerja oleh Inspektorat', status: 'Terjadwal', date: 'November 2026', docId: null },
  ];

  // Document categories completion
  const requiredCategories = ['RENSTRA', 'IKU', 'PK', 'RENJA', 'LKjIP', 'RENAKSI', 'MONEV', 'SOP'];
  const uploadedCategories = new Set(documents.map(d => d.kategori));

  return (
    <div className="space-y-6">
      <PrintHeader 
        title="LEMBAR MONITORING DAN EVALUASI AKUNTABILITAS KINERJA"
        subTitle="Dinas Transmigrasi dan Tenaga Kerja Kabupaten Luwu Utara"
      />

      {/* Top Banner / Scorecard */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-2xl p-6 text-white shadow-md relative overflow-hidden border border-slate-800">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-500/30">
              <ShieldCheck className="w-4 h-4" />
              <span>Status Kesiapan Evaluasi SAKIP 2026</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Dinas Transmigrasi dan Tenaga Kerja Kab. Luwu Utara
            </h2>
            <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
              Integrasi seluruh data dukung perencanaan, pengukuran, pelaporan, dan evaluasi internal dalam satu pintu LAPAK KINERJA.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-800/80 p-4 rounded-xl border border-slate-700/80 shrink-0">
            <div className="text-center">
              <span className="text-[11px] text-slate-400 block font-medium">Nilai Mandiri</span>
              <span className="text-3xl font-extrabold font-mono text-emerald-400 tabular-nums">
                {formattedScore}
              </span>
              <span className="text-[10px] text-slate-400 block">dari 100.00</span>
            </div>
            <div className="h-10 w-px bg-slate-700" />
            <div className="text-center">
              <span className="text-[11px] text-slate-400 block font-medium">Predikat</span>
              <span className={`text-2xl font-black px-2.5 py-0.5 rounded-lg border ${predikatColor}`}>
                {predikat}
              </span>
              <span className="text-[10px] text-slate-400 block mt-1">Sangat Baik</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: 5 SAKIP Components Progress */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Progres Capaian 5 Komponen Evaluasi SAKIP
            </h3>
            <p className="text-xs text-slate-500">
              Sesuai bobot evaluasi PermenPAN-RB No. 88 / No. 89
            </p>
          </div>
          <button
            onClick={() => onNavigateMenu('evaluasi-mandiri')}
            className="no-print text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <span>Lihat Rincian Penilaian</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {penilaianList.map((komp) => {
            const pct = Math.round((komp.nilaiTertimbang / komp.bobot) * 100);
            return (
              <div key={komp.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-700">{komp.nama}</span>
                  <span className="font-mono text-slate-400 text-[11px]">{komp.bobot}%</span>
                </div>
                <div className="text-lg font-bold font-mono text-slate-900 tabular-nums">
                  {komp.nilaiTertimbang.toFixed(2)}
                </div>
                <div className="mt-2 w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="bg-blue-600 h-1.5 rounded-full" 
                    style={{ width: `${Math.min(pct, 100)}%` }} 
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                  <span>Skor: {komp.nilai}</span>
                  <span>{pct}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Synchronized 5 Units Readiness & Evidence Matrix */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-700" />
              <h3 className="text-sm font-bold text-slate-900">
                Pemantauan Capaian Kinerja & Eviden Per Unit Kerja
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Sinkronisasi data dukung pada 5 unit kerja resmi Dinas Transmigrasi dan Tenaga Kerja Kabupaten Luwu Utara
            </p>
          </div>
          <span className="text-[11px] bg-blue-50 text-blue-800 border border-blue-200 px-2.5 py-1 rounded-full font-medium w-fit">
            5 Bidang / Sekretariat
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
          {STRUKTUR_ORGANISASI_TRANSNAKER.map((unit) => {
            const unitIkk = ikkList.filter((i) => i.bidang === unit.nama);
            const unitDocs = documents.filter((d) => d.bidang === unit.nama);
            const avgFisik = unitIkk.length > 0
              ? Math.round(unitIkk.reduce((acc, curr) => acc + curr.persenCapaian, 0) / unitIkk.length)
              : 0;
            const totalAngg = unitIkk.reduce((acc, curr) => acc + curr.anggaran, 0);
            const totalReal = unitIkk.reduce((acc, curr) => acc + curr.realisasiAnggaran, 0);
            const serapan = totalAngg > 0 ? Math.round((totalReal / totalAngg) * 100) : 0;

            return (
              <div
                key={unit.nama}
                className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/90 flex flex-col justify-between hover:border-blue-300 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] mb-1.5">
                    <span className="font-mono font-bold text-blue-700">{unit.kode}</span>
                    <span className="bg-white border border-slate-200 text-slate-700 font-semibold px-1.5 py-0.5 rounded text-[10px]">
                      {unit.singkatan}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs mb-2 leading-tight">
                    {unit.nama}
                  </h4>
                  
                  <div className="space-y-1.5 text-[11px] pt-1 border-t border-slate-200/60">
                    <div className="flex justify-between items-center text-slate-600">
                      <span>Capaian Output:</span>
                      <span className="font-bold font-mono text-blue-700">{avgFisik}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-1 overflow-hidden">
                      <div className="bg-blue-600 h-1 rounded-full" style={{ width: `${Math.min(avgFisik, 100)}%` }} />
                    </div>

                    <div className="flex justify-between items-center text-slate-600 pt-1">
                      <span>Serapan Anggaran:</span>
                      <span className="font-bold font-mono text-emerald-700">{serapan}%</span>
                    </div>

                    <div className="flex justify-between items-center text-slate-600 pt-0.5">
                      <span>Subkegiatan DPA:</span>
                      <span className="font-mono font-semibold text-slate-800">{unitIkk.length} Indikator</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2.5 mt-2.5 border-t border-slate-200 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 flex items-center gap-1">
                    <FileText className="w-3 h-3 text-slate-400" />
                    <span>Berkas SAKIP:</span>
                  </span>
                  <span className="font-bold font-mono px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px]">
                    {unitDocs.length} Dokumen
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Checklist Kelengkapan Dokumen SAKIP */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Kelengkapan 8 Dokumen Wajib SAKIP
              </h3>
              <p className="text-xs text-slate-500">
                Pemenuhan eviden data dukung LKE Pemerintah Daerah
              </p>
            </div>
            <button
              onClick={() => onNavigateMenu('dokumen-sakip')}
              className="no-print text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <span>Arsip Berkas</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {requiredCategories.map((cat) => {
              const isUploaded = uploadedCategories.has(cat as any);
              const docCount = documents.filter(d => d.kategori === cat).length;
              return (
                <div key={cat} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200/60 text-xs">
                  <div className="flex items-center gap-2.5">
                    {isUploaded ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                    )}
                    <div>
                      <span className="font-semibold text-slate-800">{cat}</span>
                      <span className="text-slate-400 text-[11px] ml-2 font-mono">
                        {docCount} berkas terunggah
                      </span>
                    </div>
                  </div>
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                    isUploaded 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {isUploaded ? 'Tersedia' : 'Belum Lengkap'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Timeline Tahapan SAKIP */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Jadwal & Agenda Siklus SAKIP 2026
              </h3>
              <p className="text-xs text-slate-500">
                Tahapan penyusunan, monitoring, dan evaluasi berkala
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {milestones.map((m, idx) => (
              <div key={idx} className="flex items-start gap-3 text-xs">
                <div className="mt-0.5">
                  {m.status === 'Selesai' ? (
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-[10px]">
                      ✓
                    </div>
                  ) : m.status === 'Dalam Proses' ? (
                    <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center">
                      <Clock className="w-3 h-3 animate-spin" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-[10px]">
                      {idx + 1}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-slate-800">{m.title}</span>
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                      m.status === 'Selesai' 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                        : m.status === 'Dalam Proses'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {m.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1 font-mono">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    <span>{m.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <PrintSignature />
    </div>
  );
};
