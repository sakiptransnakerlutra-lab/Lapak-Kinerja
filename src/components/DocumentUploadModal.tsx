import React, { useState } from 'react';
import { 
  X, 
  UploadCloud, 
  FileText, 
  FileSpreadsheet, 
  AlertCircle, 
  Check, 
  FileCheck
} from 'lucide-react';
import { SakipDocument, User, STRUKTUR_ORGANISASI_TRANSNAKER } from '../types';

interface DocumentUploadModalProps {
  currentUser: User | null;
  onClose: () => void;
  onSave: (doc: SakipDocument) => void;
}

export const DocumentUploadModal: React.FC<DocumentUploadModalProps> = ({
  currentUser,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState('');
  const [kategori, setKategori] = useState<SakipDocument['kategori']>('RENJA');
  const [tahun, setTahun] = useState(2024);
  const [bidang, setBidang] = useState(currentUser?.bidang || STRUKTUR_ORGANISASI_TRANSNAKER[0].nama);
  const [nomorSurat, setNomorSurat] = useState('');
  const [deskripsi, setDeskripsi] = useState('');

  // Selected file state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileDataUrl, setFileDataUrl] = useState<string>('');
  const [fileType, setFileType] = useState<'pdf' | 'xlsx' | 'docx'>('pdf');
  const [fileSizeStr, setFileSizeStr] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg('');
    const file = e.target.files?.[0];
    if (!file) return;

    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!['pdf', 'xlsx', 'xls', 'docx'].includes(extension || '')) {
      setErrorMsg('Format berkas harus berupa *.pdf atau *.xlsx / *.xls');
      return;
    }

    const type: 'pdf' | 'xlsx' | 'docx' = extension === 'pdf' ? 'pdf' : (extension?.startsWith('xls') ? 'xlsx' : 'docx');
    setFileType(type);
    setSelectedFile(file);

    // Human-readable size
    const sizeInMB = file.size / (1024 * 1024);
    if (sizeInMB < 1) {
      setFileSizeStr(`${Math.round(file.size / 1024)} KB`);
    } else {
      setFileSizeStr(`${sizeInMB.toFixed(1)} MB`);
    }

    // Default title if empty
    if (!title) {
      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' ');
      setTitle(cleanName);
    }

    // Read as DataURL for offline persistence & real downloads
    const reader = new FileReader();
    reader.onload = () => {
      setFileDataUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Harap masukkan judul dokumen SAKIP.');
      return;
    }
    if (!selectedFile && !fileDataUrl) {
      setErrorMsg('Silakan pilih berkas *.pdf atau *.xlsx yang akan diunggah.');
      return;
    }

    setIsSubmitting(true);

    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newDoc: SakipDocument = {
      id: 'doc-' + Date.now(),
      title: title.trim(),
      kategori,
      tahun: Number(tahun),
      bidang,
      fileName: selectedFile?.name || `${title.replace(/\s+/g, '_')}.${fileType}`,
      fileType,
      fileSize: fileSizeStr || '1.2 MB',
      fileDataUrl: fileDataUrl || undefined,
      uploadedBy: currentUser?.name || 'Operator SAKIP',
      uploadedAt: formattedDate,
      deskripsi: deskripsi.trim(),
      statusVerifikasi: 'Terverifikasi',
      nomorSurat: nomorSurat.trim() || undefined,
      previewRows: fileType === 'xlsx' ? [
        ['No', 'Program / Kegiatan', 'Indikator Kinerja', 'Target', 'Realisasi', 'Capaian'],
        ['1', 'Pelayanan Ketenagakerjaan', 'Pencari kerja terlayani AK-1', '350', '320', '91.4%'],
        ['2', 'Pelatihan Berbasis Kompetensi', 'Peserta lulus sertifikasi BLK', '160', '144', '90.0%'],
        ['3', 'Pengawasan Hubungan Industrial', 'Perusahaan tertib norma kerja', '45', '42', '93.3%'],
        ['4', 'Pembinaan Kawasan Transmigrasi', 'Kelompok tani trans mandiri', '12', '10', '83.3%'],
      ] : undefined,
    };

    onSave(newDoc);
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600 border border-blue-200">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Unggah Dokumen Data Dukung SAKIP
              </h2>
              <p className="text-xs text-slate-500">
                Dinas Transmigrasi dan Tenaga Kerja Kab. Luwu Utara
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* File Picker / Drop Zone */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Pilih Berkas (*.xlsx, *.pdf) <span className="text-red-500">*</span>
            </label>
            <div className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl p-4 text-center cursor-pointer transition-colors bg-slate-50/50 hover:bg-blue-50/30 relative">
              <input
                type="file"
                accept=".pdf,.xlsx,.xls,.docx"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center justify-center">
                {selectedFile ? (
                  <div className="flex items-center gap-2 text-emerald-700 font-semibold text-xs">
                    {fileType === 'pdf' ? (
                      <FileText className="w-6 h-6 text-red-500" />
                    ) : (
                      <FileSpreadsheet className="w-6 h-6 text-emerald-600" />
                    )}
                    <div className="text-left">
                      <p className="truncate max-w-xs">{selectedFile.name}</p>
                      <p className="text-[11px] text-slate-500 font-normal font-mono">{fileSizeStr}</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <UploadCloud className="w-8 h-8 text-slate-400 mb-1" />
                    <p className="text-xs font-medium text-slate-700">
                      Klik untuk memilih berkas atau seret berkas ke sini
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Mendukung format Dokumen PDF (*.pdf) dan Spreadsheet Excel (*.xlsx, *.xls)
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nama / Judul Dokumen Kinerja <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Rencana Kerja (RENJA) Tahun 2024"
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-500 text-slate-900"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Kategori */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Kategori SAKIP
              </label>
              <select
                value={kategori}
                onChange={(e) => setKategori(e.target.value as SakipDocument['kategori'])}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-500 text-slate-900"
              >
                <option value="RENSTRA">RENSTRA (Rencana Strategis)</option>
                <option value="IKU">IKU (Indikator Kinerja Utama)</option>
                <option value="PK">PK (Perjanjian Kinerja)</option>
                <option value="RENJA">RENJA (Rencana Kerja Tahunan)</option>
                <option value="LKjIP">LKjIP (Laporan Kinerja)</option>
                <option value="RENAKSI">RENAKSI (Rencana Aksi)</option>
                <option value="MONEV">MONEV (Monitoring Evaluasi)</option>
                <option value="SOP">SOP & Kebijakan Teknis</option>
              </select>
            </div>

            {/* Tahun Anggaran */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tahun Anggaran
              </label>
              <select
                value={tahun}
                onChange={(e) => setTahun(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-500 text-slate-900 font-mono"
              >
                <option value={2026}>2026</option>
                <option value={2025}>2025</option>
                <option value={2024}>2024</option>
                <option value={2023}>2023</option>
                <option value={2022}>2022</option>
                <option value={2021}>2021</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Bidang */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Unit Pengunggah / Bidang
              </label>
              <select
                value={bidang}
                onChange={(e) => setBidang(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-500 text-slate-900"
              >
                {STRUKTUR_ORGANISASI_TRANSNAKER.map((unit) => (
                  <option key={unit.nama} value={unit.nama}>
                    {unit.singkatan} - {unit.nama}
                  </option>
                ))}
              </select>
            </div>

            {/* Nomor Dokumen / SK */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nomor Surat / SK (Opsional)
              </label>
              <input
                type="text"
                value={nomorSurat}
                onChange={(e) => setNomorSurat(e.target.value)}
                placeholder="Contoh: 560/082/DIS-TRANSNAKER/2024"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-500 text-slate-900 font-mono"
              />
            </div>
          </div>

          {/* Deskripsi */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Catatan / Deskripsi Singkat Dokumen
            </label>
            <textarea
              rows={2}
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              placeholder="Jelaskan ringkasan isi dokumen atau peruntukan data dukung..."
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-500 text-slate-900 resize-none"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <FileCheck className="w-4 h-4" />
              <span>Simpan & Arsipkan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
