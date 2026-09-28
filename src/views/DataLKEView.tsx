import React, { useState } from 'react';
import { 
  FileText, 
  Layers, 
  HelpCircle, 
  BookOpen, 
  CheckCircle2, 
  AlertCircle, 
  Printer, 
  Download, 
  Edit3, 
  FileSpreadsheet, 
  Check, 
  ChevronRight,
  ExternalLink,
  Shield,
  X,
  Link as LinkIcon,
  FolderOpen
} from 'lucide-react';
import { ActiveMenu, LKEItem, KKEPDItem, SakipDocument, User } from '../types';
import { PrintHeader, PrintSignature } from '../components/PrintHeader';

interface DataLKEViewProps {
  activeSubMenu: ActiveMenu;
  onSelectSubMenu: (menu: ActiveMenu) => void;
  lkeItems: LKEItem[];
  kkePdItems: KKEPDItem[];
  documents: SakipDocument[];
  currentUser: User | null;
  searchQuery: string;
  onSaveLKE: (item: LKEItem) => void;
  onSaveKKEPD: (item: KKEPDItem) => void;
  onViewDocPreview?: (doc: SakipDocument) => void;
}

export const DataLKEView: React.FC<DataLKEViewProps> = ({
  activeSubMenu,
  onSelectSubMenu,
  lkeItems,
  kkePdItems,
  documents,
  currentUser,
  searchQuery,
  onSaveLKE,
  onSaveKKEPD,
  onViewDocPreview,
}) => {
  // Modal for editing KKE PD
  const [editingKKE, setEditingKKE] = useState<KKEPDItem | null>(null);
  const [kkePilihan, setKkePilihan] = useState<'A' | 'B' | 'C' | 'D' | 'E'>('A');
  const [kkeCatatan, setKkeCatatan] = useState('');
  const [kkeRekomendasi, setKkeRekomendasi] = useState('');
  const [kkeLinkEvidence, setKkeLinkEvidence] = useState('');
  const [kkeTautanDokumenId, setKkeTautanDokumenId] = useState('');

  // Modal for editing LKE
  const [editingLKE, setEditingLKE] = useState<LKEItem | null>(null);
  const [lkeNilai, setLkeNilai] = useState<number>(80);
  const [lkeStatusDukung, setLkeStatusDukung] = useState<LKEItem['statusDukung']>('Lengkap');
  const [lkeCatatan, setLkeCatatan] = useState('');
  const [lkeLinkEvidence, setLkeLinkEvidence] = useState('');
  const [lkeTautanDokumenId, setLkeTautanDokumenId] = useState('');

  const isAdmin = currentUser?.role === 'admin';

  // Helper to find linked SakipDocument by ID or keyword
  const findLinkedDoc = (docId?: string, keywords: string[] = []): SakipDocument | undefined => {
    if (docId) {
      const match = documents.find((d) => d.id === docId);
      if (match) return match;
    }
    for (const kw of keywords) {
      const match = documents.find(
        (d) =>
          d.title.toLowerCase().includes(kw.toLowerCase()) ||
          kw.toLowerCase().includes(d.kategori.toLowerCase())
      );
      if (match) return match;
    }
    return undefined;
  };

  // Sub-navigation tab list
  const tabs: { id: ActiveMenu; label: string }[] = [
    { id: 'lke-penjelasan', label: 'Penjelasan Penilaian' },
    { id: 'lke-rekap', label: 'Rekap LKE' },
    { id: 'lke-data', label: 'Data LKE' },
    { id: 'lke-kkepd', label: 'KKE PD' },
    { id: 'lke-juknis', label: 'KKE PD Juknis' },
    { id: 'lke-kke-penjelasan', label: 'KKE PD Penjelasan' },
  ];

  const handleKKEEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingKKE) return;

    let computedSkor = 90;
    if (kkePilihan === 'A') computedSkor = 90;
    else if (kkePilihan === 'B') computedSkor = 80;
    else if (kkePilihan === 'C') computedSkor = 65;
    else if (kkePilihan === 'D') computedSkor = 50;
    else computedSkor = 30;

    const updated: KKEPDItem = {
      ...editingKKE,
      pilihan: kkePilihan,
      skor: computedSkor,
      catatanTimSAKIP: kkeCatatan,
      rekomendasiPerbaikan: kkeRekomendasi,
      linkEvidence: kkeLinkEvidence.trim() || undefined,
      tautanDokumenId: kkeTautanDokumenId.trim() || undefined,
    };

    onSaveKKEPD(updated);
    setEditingKKE(null);
  };

  const handleLKEEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLKE) return;

    const computedAkhir = Math.round(((lkeNilai * editingLKE.bobot) / 100) * 100) / 100;
    const updated: LKEItem = {
      ...editingLKE,
      nilai: lkeNilai,
      nilaiAkhir: computedAkhir,
      statusDukung: lkeStatusDukung,
      catatanEvaluator: lkeCatatan,
      linkEvidence: lkeLinkEvidence.trim() || undefined,
      tautanDokumenId: lkeTautanDokumenId.trim() || undefined,
    };

    onSaveLKE(updated);
    setEditingLKE(null);
  };

  return (
    <div className="space-y-6">
      {/* Sub-menu Tabs Switcher */}
      <div className="no-print bg-white p-2 rounded-xl border border-slate-200 shadow-2xs overflow-x-auto flex items-center gap-1 scrollbar-none">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onSelectSubMenu(tab.id)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              activeSubMenu === tab.id
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 1. PENJELASAN PENILAIAN */}
      {activeSubMenu === 'lke-penjelasan' && (
        <div className="space-y-4">
          <PrintHeader 
            title="PEDOMAN & PENJELASAN PENILAIAN LKE SAKIP"
            subTitle="Berdasarkan PermenPAN-RB No. 88 & 89 Tahun 2021 · Dinas Transmigrasi dan Tenaga Kerja Kab. Luwu Utara"
          />

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-5 text-xs text-slate-700 leading-relaxed">
            <div>
              <h2 className="text-base font-bold text-slate-900 mb-1">
                A. Dasar Hukum dan Kerangka Evaluasi
              </h2>
              <p>
                Evaluasi Akuntabilitas Kinerja Instansi Pemerintah pada Dinas Transmigrasi dan Tenaga Kerja Kabupaten Luwu Utara dilaksanakan berpedoman pada:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-slate-600">
                <li>Peraturan Pemerintah No. 8 Tahun 2006 tentang Pelaporan Keuangan dan Kinerja Instansi Pemerintah.</li>
                <li>Peraturan Presiden No. 29 Tahun 2014 tentang Sistem Akuntabilitas Kinerja Instansi Pemerintah (SAKIP).</li>
                <li>Peraturan Menteri PAN-RB No. 88 Tahun 2021 tentang Evaluasi Akuntabilitas Kinerja Instansi Pemerintah.</li>
                <li>Peraturan Menteri PAN-RB No. 89 Tahun 2021 tentang Penjenjangan Kinerja (Cascading).</li>
                <li>Peraturan Bupati Luwu Utara tentang Petunjuk Pelaksanaan Evaluasi SAKIP Perangkat Daerah.</li>
              </ul>
            </div>

            <div className="pt-3 border-t border-slate-100">
              <h2 className="text-base font-bold text-slate-900 mb-2">
                B. 5 Komponen Utama Penilaian SAKIP
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="font-bold text-blue-600 font-mono">1. Perencanaan Kinerja (Bobot 30%)</span>
                  <p className="text-[11px] text-slate-600 mt-1">
                    Menilai kualitas Renstra, keselarasan sasaran dengan RPJMD, penetapan IKU, dan Perjanjian Kinerja (PK) berjenjang.
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="font-bold text-blue-600 font-mono">2. Pengukuran Kinerja (Bobot 30%)</span>
                  <p className="text-[11px] text-slate-600 mt-1">
                    Menilai keandalan data capaian berkala, manual indikator kerja, dan pemanfaatan data kinerja dalam pengambilan kebijakan.
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="font-bold text-blue-600 font-mono">3. Pelaporan Kinerja (Bobot 15%)</span>
                  <p className="text-[11px] text-slate-600 mt-1">
                    Menilai kualitas LKjIP, kelengkapan analisis efisiensi penggunaan anggaran, serta ketepatan waktu penyampaian.
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="font-bold text-blue-600 font-mono">4. Evaluasi Internal (Bobot 10%)</span>
                  <p className="text-[11px] text-slate-600 mt-1">
                    Menilai pelaksanaan monev berkala oleh pimpinan unit kerja serta tingkat tindak lanjut rekomendasi hasil evaluasi.
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="font-bold text-blue-600 font-mono">5. Capaian Kinerja (Bobot 15%)</span>
                  <p className="text-[11px] text-slate-600 mt-1">
                    Menilai capaian target IKU ketenagakerjaan dan ketransmigrasian serta inovasi pelayanan publik dinas.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100">
              <h2 className="text-base font-bold text-slate-900 mb-2">
                C. Kategori Predikat dan Nilai Akuntabilitas
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-slate-200">
                  <thead className="bg-slate-100 font-semibold text-slate-800">
                    <tr>
                      <th className="py-2 px-3 border border-slate-200">Nilai Angka</th>
                      <th className="py-2 px-3 border border-slate-200">Predikat</th>
                      <th className="py-2 px-3 border border-slate-200">Interpretasi Akuntabilitas Kinerja</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    <tr>
                      <td className="py-1.5 px-3 border border-slate-200 font-mono font-bold">&gt; 90 - 100</td>
                      <td className="py-1.5 px-3 border border-slate-200 font-bold text-emerald-700">AA</td>
                      <td className="py-1.5 px-3 border border-slate-200">Sangat Memuaskan / Leading (Manajemen kinerja prima berkelanjutan)</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 px-3 border border-slate-200 font-mono font-bold">&gt; 80 - 90</td>
                      <td className="py-1.5 px-3 border border-slate-200 font-bold text-emerald-600">A</td>
                      <td className="py-1.5 px-3 border border-slate-200">Memuaskan (Sistem akuntabilitas handal dan berkinerja tinggi)</td>
                    </tr>
                    <tr className="bg-blue-50/50">
                      <td className="py-1.5 px-3 border border-slate-200 font-mono font-bold">&gt; 70 - 80</td>
                      <td className="py-1.5 px-3 border border-slate-200 font-bold text-blue-700">BB (Posisi Transnaker)</td>
                      <td className="py-1.5 px-3 border border-slate-200">Sangat Baik (Akuntabilitas kinerja sudah baik, memiliki sistem yang dapat diandalkan)</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 px-3 border border-slate-200 font-mono font-bold">&gt; 60 - 70</td>
                      <td className="py-1.5 px-3 border border-slate-200 font-bold text-amber-600">B</td>
                      <td className="py-1.5 px-3 border border-slate-200">Baik (Akuntabilitas kinerja sudah cukup baik namun perlu perbaikan)</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 px-3 border border-slate-200 font-mono font-bold">&gt; 50 - 60</td>
                      <td className="py-1.5 px-3 border border-slate-200 font-bold text-amber-700">CC</td>
                      <td className="py-1.5 px-3 border border-slate-200">Cukup (Perlu perbaikan mendasar pada perumusan sasaran dan pengukuran)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <PrintSignature />
        </div>
      )}

      {/* 2. REKAP LKE */}
      {activeSubMenu === 'lke-rekap' && (
        <div className="space-y-4">
          <PrintHeader 
            title="REKAPITULASI LEMBAR KERJA EVALUASI (LKE) SAKIP"
            subTitle="Dinas Transmigrasi dan Tenaga Kerja Kabupaten Luwu Utara"
          />

          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Matriks Rekapitulasi Capaian Evaluasi per Komponen
                </h3>
                <p className="text-xs text-slate-500">
                  Ringkasan nilai evaluasi mandiri dan pemenuhan eviden data dukung
                </p>
              </div>
              <button
                onClick={() => window.print()}
                className="no-print flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak Rekap</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                    <th className="py-3 px-3 text-center w-12 border-r border-slate-200">No</th>
                    <th className="py-3 px-4 border-r border-slate-200">Komponen Evaluasi SAKIP</th>
                    <th className="py-3 px-3 text-center border-r border-slate-200">Bobot (%)</th>
                    <th className="py-3 px-3 text-center border-r border-slate-200">Nilai Capaian</th>
                    <th className="py-3 px-3 text-center border-r border-slate-200">Nilai Tertimbang</th>
                    <th className="py-3 px-4">Status Pemenuhan Dokumen Pendukung</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-2.5 px-3 text-center font-mono text-slate-500 border-r border-slate-200">1</td>
                    <td className="py-2.5 px-4 font-semibold text-slate-900 border-r border-slate-200">Perencanaan Kinerja</td>
                    <td className="py-2.5 px-3 text-center font-mono border-r border-slate-200">30%</td>
                    <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-800 border-r border-slate-200">82.50</td>
                    <td className="py-2.5 px-3 text-center font-mono font-bold text-blue-600 border-r border-slate-200">24.75</td>
                    <td className="py-2.5 px-4 text-emerald-700 font-medium">✓ Renstra, IKU, dan PK 2024 Lengkap Terunggah</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 text-center font-mono text-slate-500 border-r border-slate-200">2</td>
                    <td className="py-2.5 px-4 font-semibold text-slate-900 border-r border-slate-200">Pengukuran Kinerja</td>
                    <td className="py-2.5 px-3 text-center font-mono border-r border-slate-200">30%</td>
                    <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-800 border-r border-slate-200">79.00</td>
                    <td className="py-2.5 px-3 text-center font-mono font-bold text-blue-600 border-r border-slate-200">23.70</td>
                    <td className="py-2.5 px-4 text-emerald-700 font-medium">✓ Manual IKU dan Formulir Kendali Triwulanan Lengkap</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 text-center font-mono text-slate-500 border-r border-slate-200">3</td>
                    <td className="py-2.5 px-4 font-semibold text-slate-900 border-r border-slate-200">Pelaporan Kinerja</td>
                    <td className="py-2.5 px-3 text-center font-mono border-r border-slate-200">15%</td>
                    <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-800 border-r border-slate-200">81.00</td>
                    <td className="py-2.5 px-3 text-center font-mono font-bold text-blue-600 border-r border-slate-200">12.15</td>
                    <td className="py-2.5 px-4 text-emerald-700 font-medium">✓ LKjIP Tahun 2023 Terarsip dan Telah Direviu</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 text-center font-mono text-slate-500 border-r border-slate-200">4</td>
                    <td className="py-2.5 px-4 font-semibold text-slate-900 border-r border-slate-200">Evaluasi Internal</td>
                    <td className="py-2.5 px-3 text-center font-mono border-r border-slate-200">10%</td>
                    <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-800 border-r border-slate-200">76.50</td>
                    <td className="py-2.5 px-3 text-center font-mono font-bold text-blue-600 border-r border-slate-200">7.65</td>
                    <td className="py-2.5 px-4 text-amber-700 font-medium">⚠ Notulensi Monev TW II Perlu Melampirkan Lembar RTL</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 text-center font-mono text-slate-500 border-r border-slate-200">5</td>
                    <td className="py-2.5 px-4 font-semibold text-slate-900 border-r border-slate-200">Capaian Kinerja</td>
                    <td className="py-2.5 px-3 text-center font-mono border-r border-slate-200">15%</td>
                    <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-800 border-r border-slate-200">82.00</td>
                    <td className="py-2.5 px-3 text-center font-mono font-bold text-blue-600 border-r border-slate-200">12.30</td>
                    <td className="py-2.5 px-4 text-emerald-700 font-medium">✓ Realisasi Output BLK dan Mediasi HI Mencapai Target</td>
                  </tr>
                  <tr className="bg-slate-100 font-bold">
                    <td colSpan={2} className="py-3 px-4 text-slate-900 border-r border-slate-200 uppercase">
                      Total Capaian Nilai SAKIP 2024
                    </td>
                    <td className="py-3 px-3 text-center font-mono border-r border-slate-200">100%</td>
                    <td className="py-3 px-3 text-center font-mono text-slate-900 border-r border-slate-200">-</td>
                    <td className="py-3 px-3 text-center font-mono text-blue-700 text-sm border-r border-slate-200">80.50</td>
                    <td className="py-3 px-4 text-emerald-800">
                      PREDIKAT: <span className="bg-emerald-600 text-white px-2 py-0.5 rounded ml-1">A (MEMUASKAN)</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <PrintSignature />
        </div>
      )}

      {/* 3. DATA LKE (Rincian butir LKE) */}
      {activeSubMenu === 'lke-data' && (
        <div className="space-y-4">
          <PrintHeader 
            title="DATA RINCIAN LEMBAR KERJA EVALUASI (LKE) SAKIP"
            subTitle="Dinas Transmigrasi dan Tenaga Kerja Kabupaten Luwu Utara"
          />

          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Daftar Parameter dan Indikator Uji LKE
                </h3>
                <p className="text-xs text-slate-500">
                  Pengujian kelengkapan dokumen dukung dan penilaian evaluator
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                    <th className="py-3 px-3 border-r border-slate-200 w-36">Komponen</th>
                    <th className="py-3 px-4 border-r border-slate-200 min-w-[200px]">Kriteria & Parameter</th>
                    <th className="py-3 px-2 text-center border-r border-slate-200 w-14">Bobot</th>
                    <th className="py-3 px-2 text-center border-r border-slate-200 w-14">Skor</th>
                    <th className="py-3 px-2 text-center border-r border-slate-200 w-14">Nilai</th>
                    <th className="py-3 px-3 border-r border-slate-200 w-28 text-center">Status Eviden</th>
                    <th className="py-3 px-3 border-r border-slate-200 min-w-[200px] text-blue-900 bg-blue-50/50">Link Evidence</th>
                    <th className="py-3 px-4 border-r border-slate-200 min-w-[170px]">Catatan Evaluasi</th>
                    <th className="no-print py-3 px-3 text-center w-16">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {lkeItems.filter(item => {
                    if (!searchQuery) return true;
                    const q = searchQuery.toLowerCase();
                    return (
                      item.komponen.toLowerCase().includes(q) ||
                      item.subkomponen.toLowerCase().includes(q) ||
                      item.kriteria.toLowerCase().includes(q) ||
                      item.parameter.toLowerCase().includes(q) ||
                      (item.linkEvidence && item.linkEvidence.toLowerCase().includes(q)) ||
                      item.dokumenTerkait.some(d => d.toLowerCase().includes(q))
                    );
                  }).map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/70">
                      <td className="py-3 px-3 border-r border-slate-200">
                        <span className="font-bold text-slate-900 block">{item.komponen}</span>
                        <span className="text-[11px] text-slate-500">{item.subkomponen}</span>
                      </td>
                      <td className="py-3 px-4 border-r border-slate-200">
                        <div className="font-semibold text-slate-800">{item.kriteria}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">{item.parameter}</div>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {item.dokumenTerkait.map((doc, i) => (
                            <span key={i} className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded border border-slate-200">
                              {doc}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-2 text-center font-mono text-slate-600 border-r border-slate-200">
                        {item.bobot}%
                      </td>
                      <td className="py-3 px-2 text-center font-mono font-bold text-slate-800 border-r border-slate-200">
                        {item.nilai}
                      </td>
                      <td className="py-3 px-2 text-center font-mono font-bold text-blue-600 border-r border-slate-200">
                        {item.nilaiAkhir.toFixed(2)}
                      </td>
                      <td className="py-3 px-3 text-center border-r border-slate-200">
                        <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          item.statusDukung === 'Lengkap' 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {item.statusDukung}
                        </span>
                      </td>
                      {/* Kolom Link Evidence */}
                      <td className="py-3 px-3 border-r border-slate-200 bg-blue-50/20">
                        {(() => {
                          const linkedDoc = findLinkedDoc(item.tautanDokumenId, item.dokumenTerkait);
                          const hasExternal = Boolean(item.linkEvidence);

                          if (!linkedDoc && !hasExternal) {
                            return (
                              <div className="flex items-center gap-1.5">
                                <span className="text-[11px] text-slate-400 italic">Belum ada link</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingLKE(item);
                                    setLkeNilai(item.nilai);
                                    setLkeStatusDukung(item.statusDukung);
                                    setLkeCatatan(item.catatanEvaluator);
                                    setLkeLinkEvidence(item.linkEvidence || '');
                                    setLkeTautanDokumenId(item.tautanDokumenId || '');
                                  }}
                                  className="text-[10px] text-blue-600 hover:text-blue-800 font-semibold hover:underline"
                                  title="Tambah Link Evidence"
                                >
                                  + Tautkan
                                </button>
                              </div>
                            );
                          }

                          return (
                            <div className="space-y-1.5">
                              {/* Internal Document Button for Instant Preview */}
                              {linkedDoc && (
                                <button
                                  type="button"
                                  onClick={() => onViewDocPreview && onViewDocPreview(linkedDoc)}
                                  className="w-full flex items-center justify-between gap-1.5 px-2 py-1 bg-white hover:bg-blue-50 text-blue-700 border border-blue-200 hover:border-blue-400 rounded-md text-[11px] font-medium shadow-2xs transition-all text-left cursor-pointer group"
                                  title={`Buka & Preview: ${linkedDoc.title}`}
                                >
                                  <div className="flex items-center gap-1.5 min-w-0">
                                    <FileText className="w-3.5 h-3.5 text-blue-600 shrink-0 group-hover:scale-110 transition-transform" />
                                    <span className="truncate max-w-[115px] font-semibold">{linkedDoc.fileName}</span>
                                  </div>
                                  <span className="text-[9px] uppercase px-1 py-0.2 rounded bg-blue-100 text-blue-800 font-bold shrink-0">
                                    {linkedDoc.fileType}
                                  </span>
                                </button>
                              )}

                              {/* External Link or Cloud Drive */}
                              {hasExternal && (
                                <a
                                  href={item.linkEvidence}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="w-full flex items-center justify-between gap-1.5 px-2 py-1 bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-200 hover:border-emerald-400 rounded-md text-[11px] font-medium shadow-2xs transition-all group"
                                  title={`Buka Tautan: ${item.linkEvidence}`}
                                >
                                  <div className="flex items-center gap-1.5 min-w-0">
                                    <ExternalLink className="w-3.5 h-3.5 text-emerald-600 shrink-0 group-hover:scale-110 transition-transform" />
                                    <span className="truncate max-w-[120px] font-medium">
                                      {item.linkEvidence!.includes('drive.google.com')
                                        ? 'Google Drive'
                                        : item.linkEvidence!.replace(/^https?:\/\//, '').split('/')[0]}
                                    </span>
                                  </div>
                                  <span className="text-[9px] text-emerald-700 font-semibold shrink-0">Buka ↗</span>
                                </a>
                              )}
                            </div>
                          );
                        })()}
                      </td>
                      <td className="py-3 px-4 border-r border-slate-200 text-slate-600 text-[11px]">
                        {item.catatanEvaluator}
                      </td>
                      <td className="no-print py-3 px-3 text-center">
                        <button
                          onClick={() => {
                            setEditingLKE(item);
                            setLkeNilai(item.nilai);
                            setLkeStatusDukung(item.statusDukung);
                            setLkeCatatan(item.catatanEvaluator);
                            setLkeLinkEvidence(item.linkEvidence || '');
                            setLkeTautanDokumenId(item.tautanDokumenId || '');
                          }}
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded"
                          title="Perbarui Penilaian & Link Evidence LKE"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <PrintSignature />
        </div>
      )}

      {/* 4. KERTAS KERJA EVALUASI PERANGKAT DAERAH (KKE PD) */}
      {activeSubMenu === 'lke-kkepd' && (
        <div className="space-y-4">
          <PrintHeader 
            title="KERTAS KERJA EVALUASI PERANGKAT DAERAH (KKE PD)"
            subTitle="Dinas Transmigrasi dan Tenaga Kerja Kabupaten Luwu Utara"
          />

          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Instrumen KKE PD (Penilaian Pemenuhan Kriteria)
                </h3>
                <p className="text-xs text-slate-500">
                  Formulir kendali evaluasi mandiri perangkat daerah beserta bukti tautan data dukung
                </p>
              </div>
              <button
                onClick={() => window.print()}
                className="no-print flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
              >
                <Printer className="w-3.5 h-3.5 text-slate-500" />
                <span>Cetak KKE PD</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                    <th className="py-3 px-3 w-16 text-center border-r border-slate-200">Kode</th>
                    <th className="py-3 px-3 border-r border-slate-200 w-32">Aspek Evaluasi</th>
                    <th className="py-3 px-4 border-r border-slate-200 min-w-[220px]">Pertanyaan & Indikator Uji</th>
                    <th className="py-3 px-2 text-center border-r border-slate-200 w-12">Pilihan</th>
                    <th className="py-3 px-2.5 text-center border-r border-slate-200 w-16">Skor</th>
                    <th className="py-3 px-4 border-r border-slate-200 min-w-[180px]">Data Dukung Diunggah</th>
                    <th className="py-3 px-4 border-r border-slate-200 min-w-[180px]">Catatan / Rekomendasi SAKIP</th>
                    <th className="no-print py-3 px-3 text-center w-16">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {kkePdItems.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/70">
                      <td className="py-3 px-3 text-center font-mono font-semibold text-slate-600 border-r border-slate-200">
                        {item.kode}
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-800 border-r border-slate-200">
                        {item.aspek}
                      </td>
                      <td className="py-3 px-4 border-r border-slate-200">
                        <div className="font-semibold text-slate-900">{item.indikator}</div>
                        <div className="text-[11px] text-slate-600 mt-1">{item.pertanyaan}</div>
                      </td>
                      <td className="py-3 px-2 text-center font-bold text-blue-600 border-r border-slate-200 text-sm">
                        {item.pilihan}
                      </td>
                      <td className="py-3 px-2.5 text-center font-mono font-bold text-slate-800 border-r border-slate-200">
                        {item.skor}
                      </td>
                      <td className="py-3 px-4 border-r border-slate-200">
                        <div className="text-slate-800 font-medium flex items-center gap-1.5 mb-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{item.dataDukungDiunggah}</span>
                        </div>
                        {/* Link Evidence Interactive Buttons */}
                        {(() => {
                          const linkedDoc = findLinkedDoc(item.tautanDokumenId);
                          const hasExternal = Boolean(item.linkEvidence);

                          if (!linkedDoc && !hasExternal) {
                            return null;
                          }

                          return (
                            <div className="flex flex-col gap-1 mt-1">
                              {linkedDoc && (
                                <button
                                  type="button"
                                  onClick={() => onViewDocPreview && onViewDocPreview(linkedDoc)}
                                  className="inline-flex items-center justify-between gap-1.5 px-2 py-1 bg-blue-50/80 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded text-[11px] font-medium transition-colors cursor-pointer group text-left max-w-fit"
                                  title={`Preview Dokumen: ${linkedDoc.title}`}
                                >
                                  <div className="flex items-center gap-1.5 min-w-0">
                                    <FileText className="w-3 h-3 text-blue-600 shrink-0" />
                                    <span className="truncate max-w-[130px] font-semibold">{linkedDoc.fileName}</span>
                                  </div>
                                  <span className="text-[9px] uppercase px-1 py-0.2 rounded bg-blue-100 text-blue-800 font-bold shrink-0">
                                    {linkedDoc.fileType}
                                  </span>
                                </button>
                              )}
                              {hasExternal && (
                                <a
                                  href={item.linkEvidence}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 px-2 py-1 bg-emerald-50/80 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded text-[11px] font-medium transition-colors max-w-fit"
                                  title={`Buka Link Evidence: ${item.linkEvidence}`}
                                >
                                  <ExternalLink className="w-3 h-3 text-emerald-600 shrink-0" />
                                  <span className="truncate max-w-[140px]">
                                    {item.linkEvidence!.includes('drive.google.com')
                                      ? 'Google Drive'
                                      : item.linkEvidence!.replace(/^https?:\/\//, '').split('/')[0]}
                                  </span>
                                  <span className="text-[9px] text-emerald-700 font-semibold">↗</span>
                                </a>
                              )}
                            </div>
                          );
                        })()}
                      </td>
                      <td className="py-3 px-4 border-r border-slate-200 text-slate-600 text-[11px]">
                        <div><strong>Catatan:</strong> {item.catatanTimSAKIP}</div>
                        <div className="text-blue-700 mt-1"><strong>Rekomendasi:</strong> {item.rekomendasiPerbaikan}</div>
                      </td>
                      <td className="no-print py-3 px-3 text-center">
                        <button
                          onClick={() => {
                            setEditingKKE(item);
                            setKkePilihan(item.pilihan);
                            setKkeCatatan(item.catatanTimSAKIP);
                            setKkeRekomendasi(item.rekomendasiPerbaikan);
                            setKkeLinkEvidence(item.linkEvidence || '');
                            setKkeTautanDokumenId(item.tautanDokumenId || '');
                          }}
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded"
                          title="Input / Edit KKE PD & Link Evidence"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <PrintSignature />
        </div>
      )}

      {/* 5. KKE PD JUKNIS (Petunjuk Teknis) */}
      {activeSubMenu === 'lke-juknis' && (
        <div className="space-y-4">
          <PrintHeader 
            title="PETUNJUK TEKNIS (JUKNIS) PENGISIAN KKE PD SAKIP"
            subTitle="Dinas Transmigrasi dan Tenaga Kerja Kabupaten Luwu Utara"
          />

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4 text-xs text-slate-700 leading-relaxed">
            <h2 className="text-base font-bold text-slate-900">
              Petunjuk Operasional Pengisian Instrumen KKE PD
            </h2>
            <ol className="list-decimal pl-5 space-y-2.5">
              <li>
                <strong>Identifikasi Aspek Penilaian:</strong> Setiap Pejabat Administrator (Sekretaris, Kepala Bidang Tenaga Kerja & HI, Kepala Bidang Transmigrasi, Kepala UPTD BLK) bertanggung jawab melengkapi eviden sesuai tugas dan fungsi masing-masing.
              </li>
              <li>
                <strong>Pemilihan Kategori Jawaban (A, B, C, D, E):</strong>
                <ul className="list-disc pl-5 mt-1 space-y-1 text-slate-600">
                  <li><strong>A (Skor 90 - 100):</strong> Kriteria terpenuhi 100%, didukung dokumen resmi sah yang telah ditandatangani dan berlaku.</li>
                  <li><strong>B (Skor 75 - 89):</strong> Kriteria terpenuhi sebagian besar (≥80%) dengan eviden memadai.</li>
                  <li><strong>C (Skor 60 - 74):</strong> Kriteria terpenuhi sebagian (≥60%) namun bukti pendukung belum optimal.</li>
                  <li><strong>D (Skor 40 - 59):</strong> Pemenuhan kriteria masih bersifat formalitas tanpa analisis berkala.</li>
                  <li><strong>E (Skor 0 - 39):</strong> Belum terdapat data dukung atau belum dilaksanakan.</li>
                </ul>
              </li>
              <li>
                <strong>Pengunggahan Data Dukung:</strong> Setiap jawaban wajib dilampirkan berkas dokumen digital (*.pdf atau *.xlsx) pada menu <em>Dokumen SAKIP</em> dan dikaitkan pada butir KKE PD terkait.
              </li>
              <li>
                <strong>Verifikasi Tim SAKIP Kabupaten:</strong> Tim verifikator Inspektorat Daerah dan Subbag Program Dinas akan memeriksa keabsahan bukti dukung sebelum nilai akhir dikunci.
              </li>
            </ol>
          </div>

          <PrintSignature />
        </div>
      )}

      {/* 6. KKE PD PENJELASAN */}
      {activeSubMenu === 'lke-kke-penjelasan' && (
        <div className="space-y-4">
          <PrintHeader 
            title="PENJELASAN PARAMETER DAN INDIKATOR KKE PD"
            subTitle="Dinas Transmigrasi dan Tenaga Kerja Kabupaten Luwu Utara"
          />

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4 text-xs text-slate-700 leading-relaxed">
            <h2 className="text-base font-bold text-slate-900">
              Rincian Parameter Pengujian Kertas Kerja Evaluasi Perangkat Daerah
            </h2>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                <h4 className="font-bold text-blue-700">1. Parameter Keselarasan Sasaran Strategis</h4>
                <p className="mt-1 text-slate-600">
                  Memastikan bahwa sasaran strategis pada Dinas Transnaker telah selaras dengan Tujuan dan Sasaran RPJMD Kabupaten Luwu Utara 2021-2026, khususnya pada indikator penurunan angka pengangguran terbuka dan peningkatan produktivitas transmigran.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                <h4 className="font-bold text-blue-700">2. Parameter Manual Indikator Kinerja Utama (IKU)</h4>
                <p className="mt-1 text-slate-600">
                  Memastikan setiap indikator memiliki lembar manual indikator yang memuat: nama indikator, definisi operasional, formula perhitungan matematis, sumber data resmi, unit penanggung jawab pengumpul data, dan polaritas indikator (Maximize atau Minimize).
                </p>
              </div>

              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                <h4 className="font-bold text-blue-700">3. Parameter Analisis Efisiensi Sumber Daya dalam LKjIP</h4>
                <p className="mt-1 text-slate-600">
                  LKjIP tidak hanya memuat persentase realisasi fisik, namun harus memuat analisis efisiensi keuangan: membandingkan anggaran yang digunakan dengan target output yang tercapai, serta menguraikan efisiensi biaya yang berhasil dihemat.
                </p>
              </div>
            </div>
          </div>

          <PrintSignature />
        </div>
      )}

      {/* Modal Edit KKE PD */}
      {editingKKE && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden border border-slate-200 text-xs">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="text-sm font-bold text-slate-900">
                Input Penilaian KKE PD: {editingKKE.kode}
              </h3>
              <button
                onClick={() => setEditingKKE(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleKKEEditSubmit} className="p-5 space-y-4">
              <div>
                <span className="font-semibold text-slate-700 block">Indikator:</span>
                <p className="text-slate-900 font-medium">{editingKKE.indikator}</p>
                <p className="text-[11px] text-slate-500 mt-1">{editingKKE.pertanyaan}</p>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Pilihan Pemenuhan Kriteria
                </label>
                <div className="space-y-1.5">
                  <label className="flex items-start gap-2 p-2 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                    <input
                      type="radio"
                      name="pilihan"
                      value="A"
                      checked={kkePilihan === 'A'}
                      onChange={() => setKkePilihan('A')}
                      className="mt-0.5 accent-blue-600"
                    />
                    <div>
                      <span className="font-bold text-blue-700">Pilihan A (Skor 90)</span>
                      <p className="text-[11px] text-slate-500">{editingKKE.kriteriaA}</p>
                    </div>
                  </label>
                  <label className="flex items-start gap-2 p-2 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                    <input
                      type="radio"
                      name="pilihan"
                      value="B"
                      checked={kkePilihan === 'B'}
                      onChange={() => setKkePilihan('B')}
                      className="mt-0.5 accent-blue-600"
                    />
                    <div>
                      <span className="font-bold text-blue-700">Pilihan B (Skor 80)</span>
                      <p className="text-[11px] text-slate-500">{editingKKE.kriteriaB}</p>
                    </div>
                  </label>
                  <label className="flex items-start gap-2 p-2 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                    <input
                      type="radio"
                      name="pilihan"
                      value="C"
                      checked={kkePilihan === 'C'}
                      onChange={() => setKkePilihan('C')}
                      className="mt-0.5 accent-blue-600"
                    />
                    <div>
                      <span className="font-bold text-blue-700">Pilihan C (Skor 65)</span>
                      <p className="text-[11px] text-slate-500">{editingKKE.kriteriaC}</p>
                    </div>
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Catatan Tim SAKIP</label>
                <textarea
                  rows={2}
                  value={kkeCatatan}
                  onChange={(e) => setKkeCatatan(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-900 resize-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Rekomendasi Tindak Lanjut</label>
                <textarea
                  rows={2}
                  value={kkeRekomendasi}
                  onChange={(e) => setKkeRekomendasi(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-900 resize-none"
                />
              </div>

              {/* Tautan Dokumen SAKIP Internal */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Pilih Dokumen SAKIP Internal (Opsional)</span>
                  <span className="text-[10px] text-slate-500 font-normal">Akan terhubung ke viewer berkas</span>
                </label>
                <select
                  value={kkeTautanDokumenId}
                  onChange={(e) => setKkeTautanDokumenId(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-900 text-xs"
                >
                  <option value="">-- Pilih dari Berkas Dokumen SAKIP --</option>
                  {documents.map((doc) => (
                    <option key={doc.id} value={doc.id}>
                      [{doc.kategori}] {doc.title} ({doc.fileName})
                    </option>
                  ))}
                </select>
              </div>

              {/* Link Evidence External */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Link Evidence / URL Bukti Digital</span>
                  <span className="text-[10px] text-slate-500 font-normal">Google Drive, Cloud Storage, atau Web</span>
                </label>
                <div className="relative">
                  <input
                    type="url"
                    placeholder="https://drive.google.com/... atau https://..."
                    value={kkeLinkEvidence}
                    onChange={(e) => setKkeLinkEvidence(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 border border-slate-300 rounded-lg text-slate-900 font-mono text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <LinkIcon className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingKKE(null)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold"
                >
                  Simpan KKE PD
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Edit LKE Item */}
      {editingLKE && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden border border-slate-200 text-xs">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="text-sm font-bold text-slate-900">
                Update Parameter & Link Evidence LKE
              </h3>
              <button
                onClick={() => setEditingLKE(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleLKEEditSubmit} className="p-5 space-y-4">
              <div>
                <span className="font-semibold text-slate-700 block">Kriteria:</span>
                <p className="text-slate-900 font-medium">{editingLKE.kriteria}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">{editingLKE.parameter}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Nilai Skor (0 - 100)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={lkeNilai}
                    onChange={(e) => setLkeNilai(Number(e.target.value))}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-900 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Status Dokumen Eviden
                  </label>
                  <select
                    value={lkeStatusDukung}
                    onChange={(e) => setLkeStatusDukung(e.target.value as any)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-900"
                  >
                    <option value="Lengkap">Lengkap</option>
                    <option value="Perlu Perbaikan">Perlu Perbaikan</option>
                    <option value="Belum Lengkap">Belum Lengkap</option>
                  </select>
                </div>
              </div>

              {/* Tautan Dokumen SAKIP Internal */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Pilih Dokumen SAKIP Internal (Opsional)</span>
                  <span className="text-[10px] text-slate-500 font-normal">Dapat dipratinjau langsung di aplikasi</span>
                </label>
                <select
                  value={lkeTautanDokumenId}
                  onChange={(e) => setLkeTautanDokumenId(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-900 text-xs"
                >
                  <option value="">-- Pilih dari Berkas Dokumen SAKIP --</option>
                  {documents.map((doc) => (
                    <option key={doc.id} value={doc.id}>
                      [{doc.kategori}] {doc.title} ({doc.fileName})
                    </option>
                  ))}
                </select>
              </div>

              {/* Link Evidence External / URL */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Link Evidence (URL / Tautan Bukti Digital)</span>
                  <span className="text-[10px] text-slate-500 font-normal">Google Drive, Cloud Storage, atau Website</span>
                </label>
                <div className="relative">
                  <input
                    type="url"
                    placeholder="https://drive.google.com/... atau https://transnaker.luwuutarakab.go.id/..."
                    value={lkeLinkEvidence}
                    onChange={(e) => setLkeLinkEvidence(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 border border-slate-300 rounded-lg text-slate-900 font-mono text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <LinkIcon className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Catatan Evaluator
                </label>
                <textarea
                  rows={2}
                  value={lkeCatatan}
                  onChange={(e) => setLkeCatatan(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-900 resize-none"
                />
              </div>

              <div className="pt-2 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingLKE(null)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold"
                >
                  Simpan Perubahan LKE
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
