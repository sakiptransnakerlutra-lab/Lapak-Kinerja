import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Printer, 
  FileText, 
  FileSpreadsheet, 
  CheckCircle2, 
  Calendar, 
  User, 
  Shield, 
  Search,
  Maximize2
} from 'lucide-react';
import { SakipDocument } from '../types';
import { PrintHeader, PrintSignature } from './PrintHeader';

interface DocumentPreviewModalProps {
  document: SakipDocument | null;
  onClose: () => void;
  onDownload: (doc: SakipDocument) => void;
}

export const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({
  document,
  onClose,
  onDownload,
}) => {
  const [sheetSearch, setSheetSearch] = useState('');

  if (!document) return null;

  const isPdf = document.fileType === 'pdf';
  const isXlsx = document.fileType === 'xlsx';

  const handlePrint = () => {
    window.print();
  };

  // Filter preview rows for xlsx if available
  const filteredRows = document.previewRows ? document.previewRows.slice(1).filter(row => 
    row.some(cell => cell.toLowerCase().includes(sheetSearch.toLowerCase()))
  ) : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-xs">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3 min-w-0">
            <div className={`p-2.5 rounded-xl shrink-0 ${isPdf ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-emerald-50 text-emerald-600 border border-emerald-200'}`}>
              {isPdf ? <FileText className="w-5 h-5" /> : <FileSpreadsheet className="w-5 h-5" />}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  {document.kategori}
                </span>
                <span className="text-slate-300">·</span>
                <span className="text-xs font-mono uppercase bg-slate-200/80 px-1.5 py-0.5 rounded text-slate-700">
                  {document.fileType}
                </span>
                <span className="text-slate-300">·</span>
                <span className="text-xs text-slate-500 font-mono">
                  {document.fileSize}
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 truncate" title={document.title}>
                {document.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onDownload(document)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs"
              title="Unduh Berkas Asli"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Unduh</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg transition-colors"
              title="Cetak Lembar Dokumen"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Cetak</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
              title="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body / Viewer */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-100/70">
          
          {/* Printable Official Cover & Metadata (visible on print) */}
          <PrintHeader 
            title={document.title} 
            subTitle={`Dokumen Data Dukung SAKIP - Kategori ${document.kategori}`}
            nomorDokumen={document.nomorSurat}
          />

          {/* Metadata Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 mb-4 shadow-2xs">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-slate-400 text-[11px] block">Unit Pengunggah</span>
                <span className="font-semibold text-slate-800">{document.bidang}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[11px] block">Tahun Anggaran</span>
                <span className="font-semibold text-slate-800 font-mono">{document.tahun}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[11px] block">Tanggal Unggah</span>
                <span className="font-semibold text-slate-800">{document.uploadedAt}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[11px] block">Status Verifikasi</span>
                <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  {document.statusVerifikasi}
                </span>
              </div>
            </div>

            {document.deskripsi && (
              <p className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-600">
                <span className="font-medium text-slate-700">Keterangan:</span> {document.deskripsi}
              </p>
            )}
          </div>

          {/* Spreadsheet Viewer (.XLSX) */}
          {isXlsx && (
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="p-3 bg-emerald-900 text-white flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 font-semibold">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-300" />
                  <span>Pratinjau Lembar Kerja (Spreadsheet Viewer)</span>
                </div>
                <div className="relative w-48 sm:w-64">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-emerald-300" />
                  <input
                    type="text"
                    placeholder="Cari sel data..."
                    value={sheetSearch}
                    onChange={(e) => setSheetSearch(e.target.value)}
                    className="w-full pl-8 pr-2.5 py-1 text-xs bg-emerald-800/80 border border-emerald-700 rounded text-white placeholder-emerald-300 focus:outline-hidden"
                  />
                </div>
              </div>

              {document.previewRows && document.previewRows.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
                        <th className="py-2.5 px-3 border-r border-slate-200 w-12 text-center text-slate-400 font-mono">No</th>
                        {document.previewRows[0].map((col, idx) => (
                          <th key={idx} className="py-2.5 px-3 border-r border-slate-200 whitespace-nowrap">
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredRows.map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-2 px-3 border-r border-slate-200 text-center font-mono text-slate-400 text-[11px]">
                            {rIdx + 1}
                          </td>
                          {row.map((cell, cIdx) => (
                            <td key={cIdx} className="py-2 px-3 border-r border-slate-200 text-slate-700 whitespace-nowrap">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-8 text-center text-slate-500 text-xs">
                  Pratinjau tabel sedang dipersiapkan. Klik tombol "Unduh" untuk membuka berkas spreadsheet asli.
                </div>
              )}
            </div>
          )}

          {/* PDF Viewer (.PDF) */}
          {isPdf && (
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="p-3 bg-slate-900 text-white flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-400" />
                  <span className="font-semibold">{document.fileName}</span>
                </div>
                <div className="text-slate-400 font-mono text-[11px]">
                  Halaman 1 dari 1 (Dokumen Sah)
                </div>
              </div>

              {/* Real DataURL viewer if available, else high fidelity PDF paper preview */}
              {document.fileDataUrl && document.fileDataUrl.startsWith('data:application/pdf') ? (
                <iframe 
                  src={document.fileDataUrl} 
                  title={document.title}
                  className="w-full h-[550px] border-0"
                />
              ) : (
                <div className="p-8 sm:p-12 bg-slate-50 flex justify-center">
                  <div className="w-full max-w-2xl bg-white border border-slate-300 shadow-md p-8 sm:p-10 font-serif min-h-[480px] relative">
                    {/* Watermark */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none select-none">
                      <div className="text-6xl font-bold tracking-widest uppercase transform -rotate-45">
                        SAKIP LUTRA
                      </div>
                    </div>

                    <div className="border-b-2 border-slate-900 pb-3 text-center mb-6">
                      <h3 className="font-bold text-sm uppercase text-slate-900">
                        PEMERINTAH KABUPATEN LUWU UTARA
                      </h3>
                      <h2 className="font-extrabold text-base uppercase text-slate-900">
                        DINAS TRANSMIGRASI DAN TENAGA KERJA
                      </h2>
                      <p className="text-[10px] text-slate-600 font-sans">
                        Kompleks Gabungan Dinas Masamba · Dokumen Akuntabilitas Kinerja Instansi
                      </p>
                    </div>

                    <div className="text-center mb-6">
                      <h4 className="font-bold text-xs uppercase underline text-slate-900">
                        {document.title}
                      </h4>
                      {document.nomorSurat && (
                        <p className="text-[11px] font-sans text-slate-600 font-mono mt-0.5">
                          Nomor: {document.nomorSurat}
                        </p>
                      )}
                    </div>

                    <div className="text-xs text-slate-800 space-y-3 leading-relaxed font-sans">
                      <p>
                        Dokumen ini merupakan data dukung resmi dalam rangka Evaluasi Akuntabilitas Kinerja Instansi Pemerintah (SAKIP) Dinas Transmigrasi dan Tenaga Kerja Kabupaten Luwu Utara Tahun Anggaran {document.tahun}.
                      </p>
                      <p className="text-slate-600 text-[11px]">
                        <strong>Rincian Keterangan:</strong> {document.deskripsi || 'Arsip tersimpan aman pada repositori LAPAK KINERJA.'}
                      </p>
                      <div className="p-3 bg-blue-50/60 border border-blue-200 rounded text-blue-900 text-[11px]">
                        ✓ Dokumen telah diverifikasi kelengkapan bukti dukungnya oleh Tim SAKIP Kabupaten Luwu Utara dan siap diajukan dalam evaluasi Inspektorat Daerah.
                      </div>
                    </div>

                    <div className="mt-12 pt-6 flex justify-end font-sans">
                      <div className="text-center text-xs w-56">
                        <p className="text-slate-600 text-[11px]">Masamba, {document.uploadedAt.split(' ')[0]}</p>
                        <p className="font-semibold text-slate-900 mt-1">Pengelola SAKIP Dinas,</p>
                        <div className="h-14 flex items-center justify-center">
                          <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300">
                            TERVERIFIKASI DIGITAL
                          </span>
                        </div>
                        <p className="font-bold text-slate-900 underline text-xs">{document.uploadedBy}</p>
                        <p className="text-slate-500 text-[10px]">Tim Evaluasi Kinerja Transnaker</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Print Signature Footer */}
          <PrintSignature />
        </div>

        {/* Modal Footer */}
        <div className="p-3 sm:p-4 border-t border-slate-200 bg-white flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-blue-600" />
            <span>Dokumen Terenkripsi & Terarsip Resmi di LAPAK KINERJA</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 font-medium transition-colors"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
