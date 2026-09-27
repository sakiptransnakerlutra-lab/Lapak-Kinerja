import React, { useState } from 'react';
import { 
  FileText, 
  FileSpreadsheet, 
  Download, 
  Printer, 
  Trash2, 
  Eye, 
  UploadCloud, 
  CheckCircle2, 
  Clock, 
  Search, 
  Filter,
  Layers,
  FileCheck
} from 'lucide-react';
import { SakipDocument, User, STRUKTUR_ORGANISASI_TRANSNAKER } from '../types';
import { PrintHeader, PrintSignature } from '../components/PrintHeader';

interface DokumenSakipViewProps {
  documents: SakipDocument[];
  currentUser: User | null;
  searchQuery: string;
  onOpenUpload: () => void;
  onOpenPreview: (doc: SakipDocument) => void;
  onDownload: (doc: SakipDocument) => void;
  onDeleteDocument: (id: string) => void;
}

export const DokumenSakipView: React.FC<DokumenSakipViewProps> = ({
  documents,
  currentUser,
  searchQuery,
  onOpenUpload,
  onOpenPreview,
  onDownload,
  onDeleteDocument,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedBidang, setSelectedBidang] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');

  const isAdmin = currentUser?.role === 'admin';

  const categories = [
    'all',
    'RENSTRA',
    'IKU',
    'PK',
    'RENJA',
    'LKjIP',
    'RENAKSI',
    'MONEV',
    'SOP'
  ];

  const filteredDocs = documents.filter(doc => {
    const matchCategory = selectedCategory === 'all' || doc.kategori === selectedCategory;
    const matchYear = selectedYear === 'all' || doc.tahun.toString() === selectedYear;
    const matchBidang = selectedBidang === 'all' || doc.bidang === selectedBidang;
    const matchSearch = searchQuery === '' ||
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.bidang.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.nomorSurat && doc.nomorSurat.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCategory && matchYear && matchBidang && matchSearch;
  });

  const handlePrintReceipt = (doc: SakipDocument) => {
    onOpenPreview(doc);
    setTimeout(() => {
      window.print();
    }, 300);
  };

  return (
    <div className="space-y-6">
      <PrintHeader 
        title="REPOSITORI DATA DUKUNG & DOKUMEN RESMI SAKIP"
        subTitle="Dinas Transmigrasi dan Tenaga Kerja Kabupaten Luwu Utara"
      />

      {/* Top Banner */}
      <div className="no-print bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider">
            <FileSpreadsheet className="w-4 h-4" />
            <span>Bank Data & Bukti Fisik Akuntabilitas Kinerja</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 mt-1">
            Arsip Dokumen SAKIP (.xlsx & .pdf)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Menyimpan, mengelola, mencari, dan mengarsipkan dokumen kinerja secara terstruktur.
          </p>
        </div>

        <button
          onClick={onOpenUpload}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors shrink-0"
        >
          <UploadCloud className="w-4 h-4" />
          <span>Unggah Dokumen (*.xlsx / *.pdf)</span>
        </button>
      </div>

      {/* Filter Category & Year */}
      <div className="no-print bg-white p-3 rounded-xl border border-slate-200 shadow-2xs space-y-3">
        {/* Category Pills/Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          <span className="font-semibold text-slate-400 pl-1 pr-2">Kategori:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg font-medium transition-colors whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {cat === 'all' ? 'Semua Kategori' : cat}
            </button>
          ))}
        </div>

        {/* Second row: Bidang & Year filter & counts */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-medium">Unit Kerja:</span>
              <select
                value={selectedBidang}
                onChange={(e) => setSelectedBidang(e.target.value)}
                className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-hidden font-medium"
              >
                <option value="all">Semua Unit Kerja (5 Bidang / Sekretariat)</option>
                {STRUKTUR_ORGANISASI_TRANSNAKER.map((unit) => (
                  <option key={unit.nama} value={unit.nama}>
                    {unit.singkatan} - {unit.nama}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-medium">Tahun:</span>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono focus:outline-hidden"
              >
                <option value="all">Semua Tahun</option>
                <option value="2026">2026</option>
                <option value="2025">2025</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
                <option value="2021">2021</option>
              </select>
            </div>
          </div>

          <div className="text-slate-400 font-mono text-[11px]">
            Ditemukan <strong className="text-slate-800">{filteredDocs.length}</strong> dokumen
          </div>
        </div>
      </div>

      {/* Documents Table / Grid */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                <th className="py-3 px-3 text-center w-12 border-r border-slate-200">Tipe</th>
                <th className="py-3 px-4 min-w-[240px] border-r border-slate-200">Judul & Nama Berkas</th>
                <th className="py-3 px-3 border-r border-slate-200 text-center w-28">Kategori</th>
                <th className="py-3 px-3 border-r border-slate-200 w-16 text-center">Tahun</th>
                <th className="py-3 px-4 border-r border-slate-200 min-w-[150px]">Unit Pengunggah</th>
                <th className="py-3 px-3 border-r border-slate-200 text-center w-24">Ukuran</th>
                <th className="py-3 px-3 border-r border-slate-200 text-center w-28">Status</th>
                <th className="no-print py-3 px-4 text-center w-36">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDocs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 text-xs">
                    Tidak ada dokumen yang sesuai dengan pencarian atau filter yang dipilih.
                  </td>
                </tr>
              ) : (
                filteredDocs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* File Icon */}
                    <td className="py-3 px-3 text-center border-r border-slate-200">
                      {doc.fileType === 'pdf' ? (
                        <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 border border-red-200 flex items-center justify-center mx-auto">
                          <FileText className="w-4 h-4" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto">
                          <FileSpreadsheet className="w-4 h-4" />
                        </div>
                      )}
                    </td>

                    {/* Title & File Name */}
                    <td className="py-3 px-4 border-r border-slate-200">
                      <div className="font-bold text-slate-900 leading-snug">{doc.title}</div>
                      <div className="text-[11px] text-slate-500 font-mono flex items-center gap-1.5 mt-0.5">
                        <span>{doc.fileName}</span>
                        {doc.nomorSurat && (
                          <>
                            <span className="text-slate-300">·</span>
                            <span className="text-blue-700">{doc.nomorSurat}</span>
                          </>
                        )}
                      </div>
                      {doc.deskripsi && (
                        <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">{doc.deskripsi}</p>
                      )}
                    </td>

                    {/* Kategori */}
                    <td className="py-3 px-3 text-center border-r border-slate-200 font-semibold text-slate-700">
                      <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-[11px] font-mono">
                        {doc.kategori}
                      </span>
                    </td>

                    {/* Tahun */}
                    <td className="py-3 px-3 text-center font-mono font-semibold text-slate-800 border-r border-slate-200">
                      {doc.tahun}
                    </td>

                    {/* Unit */}
                    <td className="py-3 px-4 border-r border-slate-200 text-slate-600">
                      <div className="font-medium text-slate-800">{doc.bidang}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">{doc.uploadedAt}</div>
                    </td>

                    {/* File Size */}
                    <td className="py-3 px-3 text-center font-mono text-slate-500 border-r border-slate-200 text-[11px]">
                      {doc.fileSize}
                    </td>

                    {/* Verification Status */}
                    <td className="py-3 px-3 text-center border-r border-slate-200">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                        <span>{doc.statusVerifikasi}</span>
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="no-print py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {/* Preview */}
                        <button
                          onClick={() => onOpenPreview(doc)}
                          className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-md transition-colors"
                          title="Pratinjau Dokumen"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Download */}
                        <button
                          onClick={() => onDownload(doc)}
                          className="p-1.5 text-slate-600 hover:text-emerald-600 hover:bg-slate-100 rounded-md transition-colors"
                          title="Unduh Berkas (*.pdf / *.xlsx)"
                        >
                          <Download className="w-4 h-4" />
                        </button>

                        {/* Print */}
                        <button
                          onClick={() => handlePrintReceipt(doc)}
                          className="p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-md transition-colors"
                          title="Cetak Tanda Terima Dokumen"
                        >
                          <Printer className="w-4 h-4" />
                        </button>

                        {/* Delete (Admin only) */}
                        {isAdmin && (
                          <button
                            onClick={() => {
                              if (confirm(`Hapus dokumen "${doc.title}"?`)) {
                                onDeleteDocument(doc.id);
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-slate-100 rounded-md transition-colors"
                            title="Hapus Dokumen (Khusus Admin)"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <PrintSignature />
    </div>
  );
};
