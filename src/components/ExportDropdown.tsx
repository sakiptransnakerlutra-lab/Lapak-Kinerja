import React, { useState, useRef, useEffect } from 'react';
import { 
  FileSpreadsheet, 
  FileText, 
  Download, 
  ChevronDown, 
  Check, 
  Sparkles 
} from 'lucide-react';

interface ExportDropdownProps {
  label?: string;
  itemCount: number;
  onExportExcel: () => void;
  onExportCSV: () => void;
  dataName?: string; // e.g. "IKP (Program)" or "IKK (Kegiatan)"
}

export const ExportDropdown: React.FC<ExportDropdownProps> = ({
  label = 'Ekspor Data',
  itemCount,
  onExportExcel,
  onExportCSV,
  dataName = 'Indikator',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleExcelClick = () => {
    onExportExcel();
    setIsOpen(false);
    setDownloadSuccess('Excel (.xlsx)');
    setTimeout(() => setDownloadSuccess(null), 3500);
  };

  const handleCSVClick = () => {
    onExportCSV();
    setIsOpen(false);
    setDownloadSuccess('CSV (.csv)');
    setTimeout(() => setDownloadSuccess(null), 3500);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 hover:border-emerald-400 rounded-lg shadow-2xs transition-all cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-emerald-400/50"
        title="Pilih format unduhan Excel atau CSV"
      >
        <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
        <span>{label}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-emerald-600 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Success Notification Toast */}
      {downloadSuccess && (
        <div className="absolute top-full mt-2 right-0 z-50 flex items-center gap-2 px-3 py-2 bg-emerald-900 text-white text-xs rounded-lg shadow-lg border border-emerald-700 animate-in fade-in slide-in-from-top-1 whitespace-nowrap">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Berhasil mengunduh <strong>{downloadSuccess}</strong></span>
        </div>
      )}

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 z-50 p-2 text-left animate-in fade-in zoom-in-95">
          {/* Header */}
          <div className="px-3 py-2 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-700 tracking-wide uppercase">
                Ekspor Laporan SAKIP
              </span>
              <span className="text-[10px] font-medium bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-full">
                {itemCount} baris
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Pilih format berkas untuk pelaporan {dataName}
            </p>
          </div>

          {/* Options */}
          <div className="py-1 space-y-1">
            {/* Excel (.xlsx) Option */}
            <button
              type="button"
              onClick={handleExcelClick}
              className="w-full flex items-start gap-2.5 p-2 rounded-lg hover:bg-emerald-50/70 border border-transparent hover:border-emerald-200 text-left transition-colors cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <FileSpreadsheet className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-800 group-hover:text-emerald-900">
                    Microsoft Excel (.xlsx)
                  </span>
                  <span className="text-[9px] font-semibold bg-emerald-600 text-white px-1.5 py-0.2 rounded">
                    Resmi
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                  Dengan kop surat Pemkab, ringkasan & kolom rapi
                </p>
              </div>
            </button>

            {/* CSV (.csv) Option */}
            <button
              type="button"
              onClick={handleCSVClick}
              className="w-full flex items-start gap-2.5 p-2 rounded-lg hover:bg-blue-50/70 border border-transparent hover:border-blue-200 text-left transition-colors cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <FileText className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-800 group-hover:text-blue-900">
                    Comma Separated (.csv)
                  </span>
                  <span className="text-[9px] font-semibold bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded border border-blue-200">
                    UTF-8 BOM
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                  Format tabel universal untuk analisis atau impor
                </p>
              </div>
            </button>
          </div>

          {/* Footer note */}
          <div className="px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-100 mt-1 flex items-center gap-1.5 text-[10px] text-slate-500">
            <Sparkles className="w-3 h-3 text-amber-500 shrink-0" />
            <span>Format sesuai standar pelaporan PermenPAN-RB No 88</span>
          </div>
        </div>
      )}
    </div>
  );
};
