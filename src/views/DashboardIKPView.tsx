import React, { useState } from 'react';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Download, 
  Printer, 
  TrendingUp, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  FileSpreadsheet,
  X
} from 'lucide-react';
import { IKPItem, User, STRUKTUR_ORGANISASI_TRANSNAKER } from '../types';
import { PrintHeader, PrintSignature } from '../components/PrintHeader';
import { ExportDropdown } from '../components/ExportDropdown';
import { exportIKPToExcel, exportIKPToCSV } from '../utils/exportUtils';

interface DashboardIKPViewProps {
  items: IKPItem[];
  currentUser: User | null;
  searchQuery: string;
  onSaveItem: (item: IKPItem) => void;
  onDeleteItem: (id: string) => void;
}

export const DashboardIKPView: React.FC<DashboardIKPViewProps> = ({
  items,
  currentUser,
  searchQuery,
  onSaveItem,
  onDeleteItem,
}) => {
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<IKPItem | null>(null);

  // Form states
  const [formData, setFormData] = useState<Partial<IKPItem>>({
    kode: 'IKP-0',
    sasaranProgram: '',
    indikator: '',
    satuan: '%',
    targetTahunan: 100,
    targetTW1: 25,
    realisasiTW1: 0,
    targetTW2: 50,
    realisasiTW2: 0,
    targetTW3: 75,
    realisasiTW3: 0,
    targetTW4: 100,
    realisasiTW4: 0,
    status: 'Tercapai',
    penanggungJawab: '',
    keterangan: '',
    tahun: 2026,
  });

  const isAdmin = currentUser?.role === 'admin';

  // Filter items
  const filteredItems = items.filter(item => {
    const matchYear = item.tahun === selectedYear;
    const matchStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchSearch = searchQuery === '' || 
      item.kode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.indikator.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sasaranProgram.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.penanggungJawab.toLowerCase().includes(searchQuery.toLowerCase());
    return matchYear && matchStatus && matchSearch;
  });

  // Calculate summary metrics
  const totalIKP = filteredItems.length;
  const tercapaiCount = filteredItems.filter(i => i.status === 'Tercapai').length;
  const avgCapaian = totalIKP > 0
    ? Math.round(filteredItems.reduce((acc, curr) => acc + curr.capaianAkhir, 0) / totalIKP)
    : 0;

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      id: 'ikp-' + Date.now(),
      kode: `IKP-0${items.length + 1}`,
      sasaranProgram: '',
      indikator: '',
      satuan: '%',
      targetTahunan: 100,
      targetTW1: 25,
      realisasiTW1: 0,
      targetTW2: 50,
      realisasiTW2: 0,
      targetTW3: 75,
      realisasiTW3: 0,
      targetTW4: 100,
      realisasiTW4: 0,
      capaianAkhir: 0,
      status: 'Tercapai',
      penanggungJawab: currentUser?.bidang || STRUKTUR_ORGANISASI_TRANSNAKER[0].nama,
      keterangan: '',
      tahun: selectedYear,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: IKPItem) => {
    setEditingItem(item);
    setFormData(item);
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const target = Number(formData.targetTahunan) || 1;
    const realisasi3 = Number(formData.realisasiTW3) || 0;
    const computedCapaian = Math.round((realisasi3 / target) * 1000) / 10;
    
    let computedStatus: IKPItem['status'] = 'Tercapai';
    if (computedCapaian < 70) computedStatus = 'Belum Tercapai';
    else if (computedCapaian < 85) computedStatus = 'Perlu Perhatian';

    const itemToSave: IKPItem = {
      id: editingItem ? editingItem.id : ('ikp-' + Date.now()),
      kode: formData.kode || 'IKP-XX',
      sasaranProgram: formData.sasaranProgram || '',
      indikator: formData.indikator || '',
      satuan: formData.satuan || '%',
      targetTahunan: Number(formData.targetTahunan) || 0,
      targetTW1: Number(formData.targetTW1) || 0,
      realisasiTW1: Number(formData.realisasiTW1) || 0,
      targetTW2: Number(formData.targetTW2) || 0,
      realisasiTW2: Number(formData.realisasiTW2) || 0,
      targetTW3: Number(formData.targetTW3) || 0,
      realisasiTW3: Number(formData.realisasiTW3) || 0,
      targetTW4: Number(formData.targetTW4) || 0,
      realisasiTW4: Number(formData.realisasiTW4) || 0,
      capaianAkhir: computedCapaian > 0 ? computedCapaian : (formData.capaianAkhir || 0),
      status: formData.status || computedStatus,
      penanggungJawab: formData.penanggungJawab || '',
      keterangan: formData.keterangan || '',
      tahun: Number(formData.tahun) || selectedYear,
    };

    onSaveItem(itemToSave);
    setIsModalOpen(false);
  };

  const handleExportExcel = () => {
    exportIKPToExcel(filteredItems, {
      year: selectedYear,
      statusFilter,
      searchQuery,
    });
  };

  const handleExportCSV = () => {
    exportIKPToCSV(filteredItems, {
      year: selectedYear,
      statusFilter,
      searchQuery,
    });
  };

  return (
    <div className="space-y-6">
      {/* Printable Header */}
      <PrintHeader 
        title={`LAPORAN CAPAIAN INDIKATOR KINERJA PROGRAM (IKP) TAHUN ${selectedYear}`}
        subTitle="Dinas Transmigrasi dan Tenaga Kerja Kabupaten Luwu Utara"
      />

      {/* Top Controls: Filter & Actions */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex flex-wrap items-center gap-2">
          {/* Year selector */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <span className="font-semibold">Tahun:</span>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono font-medium focus:outline-hidden focus:border-blue-500"
            >
              <option value={2026}>2026</option>
              <option value={2025}>2025</option>
              <option value={2024}>2024</option>
              <option value={2023}>2023</option>
            </select>
          </div>

          {/* Status selector */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <span className="font-semibold">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-hidden focus:border-blue-500"
            >
              <option value="all">Semua Status</option>
              <option value="Tercapai">Tercapai</option>
              <option value="Perlu Perhatian">Perlu Perhatian</option>
              <option value="Belum Tercapai">Belum Tercapai</option>
            </select>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <ExportDropdown
            label="Ekspor IKP"
            itemCount={filteredItems.length}
            onExportExcel={handleExportExcel}
            onExportCSV={handleExportCSV}
            dataName="IKP (Program)"
          />
          
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Cetak</span>
          </button>

          {/* Add button (Accessible by both Admin and Operator) */}
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah IKP</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="no-print grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium block">Total Indikator Program</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">{totalIKP}</span>
            <span className="text-xs text-slate-400">Sasaran Renstra</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium block">Rata-rata Capaian Akhir</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-bold font-mono tabular-nums text-blue-600">{avgCapaian}%</span>
            <span className="text-xs text-emerald-600 font-medium">Target Berjalan</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium block">Tingkat Keberhasilan</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-bold font-mono tabular-nums text-emerald-600">{tercapaiCount} dari {totalIKP}</span>
            <span className="text-xs text-slate-500">Status Tercapai</span>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Matriks Capaian Indikator Kinerja Program (IKP)
            </h2>
            <p className="text-xs text-slate-500">
              Evaluasi target versus realisasi triwulanan Tahun Anggaran {selectedYear}
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                <th className="py-3 px-3 w-16 text-center border-r border-slate-200">Kode</th>
                <th className="py-3 px-4 min-w-[200px] border-r border-slate-200">Sasaran Program & Indikator</th>
                <th className="py-3 px-2 text-center w-16 border-r border-slate-200">Satuan</th>
                <th className="py-3 px-3 text-right border-r border-slate-200">Target</th>
                <th className="py-3 px-2.5 text-right border-r border-slate-200">TW I</th>
                <th className="py-3 px-2.5 text-right border-r border-slate-200">TW II</th>
                <th className="py-3 px-2.5 text-right border-r border-slate-200">TW III</th>
                <th className="py-3 px-2.5 text-right border-r border-slate-200">TW IV</th>
                <th className="py-3 px-3 text-right border-r border-slate-200">Capaian (%)</th>
                <th className="py-3 px-3 text-center border-r border-slate-200">Status</th>
                <th className="py-3 px-4 min-w-[150px] border-r border-slate-200">Penanggung Jawab</th>
                <th className="no-print py-3 px-3 text-center w-20">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={12} className="py-8 text-center text-slate-400 text-xs">
                    Tidak ada data IKP yang cocok dengan filter.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3 text-center font-mono font-semibold text-slate-600 border-r border-slate-200">
                      {item.kode}
                    </td>
                    <td className="py-3 px-4 border-r border-slate-200">
                      <div className="font-semibold text-slate-900">{item.indikator}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{item.sasaranProgram}</div>
                      {item.keterangan && (
                        <div className="text-[10px] text-slate-400 italic mt-1">{item.keterangan}</div>
                      )}
                    </td>
                    <td className="py-3 px-2 text-center text-slate-600 border-r border-slate-200">
                      {item.satuan}
                    </td>
                    <td className="py-3 px-3 text-right font-mono tabular-nums font-semibold text-slate-800 border-r border-slate-200">
                      {item.targetTahunan}
                    </td>
                    <td className="py-3 px-2.5 text-right font-mono tabular-nums text-slate-600 border-r border-slate-200">
                      {item.realisasiTW1}
                    </td>
                    <td className="py-3 px-2.5 text-right font-mono tabular-nums text-slate-600 border-r border-slate-200">
                      {item.realisasiTW2}
                    </td>
                    <td className="py-3 px-2.5 text-right font-mono tabular-nums text-slate-600 border-r border-slate-200">
                      {item.realisasiTW3}
                    </td>
                    <td className="py-3 px-2.5 text-right font-mono tabular-nums text-slate-600 border-r border-slate-200">
                      {item.realisasiTW4 > 0 ? item.realisasiTW4 : '-'}
                    </td>
                    <td className="py-3 px-3 text-right font-mono tabular-nums font-bold text-blue-600 border-r border-slate-200">
                      {item.capaianAkhir}%
                    </td>
                    <td className="py-3 px-3 text-center border-r border-slate-200">
                      <span className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                        item.status === 'Tercapai' 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                          : item.status === 'Perlu Perhatian'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-red-50 text-red-700 border border-red-200'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 border-r border-slate-200 text-[11px]">
                      {item.penanggungJawab}
                    </td>
                    <td className="no-print py-3 px-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="p-1 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded"
                          title="Edit Data IKP"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        {isAdmin && (
                          <button
                            onClick={() => {
                              if (confirm(`Hapus data IKP ${item.kode}?`)) {
                                onDeleteItem(item.id);
                              }
                            }}
                            className="p-1 text-slate-500 hover:text-red-600 hover:bg-slate-100 rounded"
                            title="Hapus Data (Khusus Admin)"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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

      {/* Official Signature on Print */}
      <PrintSignature />

      {/* Modal Add / Edit IKP */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
            <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="text-sm font-bold text-slate-900">
                {editingItem ? 'Edit Data Indikator Kinerja Program' : 'Tambah Indikator Kinerja Program Baru'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Kode IKP</label>
                  <input
                    type="text"
                    required
                    value={formData.kode}
                    onChange={(e) => setFormData({ ...formData, kode: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tahun Anggaran</label>
                  <input
                    type="number"
                    required
                    value={formData.tahun}
                    onChange={(e) => setFormData({ ...formData, tahun: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-900 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Sasaran Program</label>
                <input
                  type="text"
                  required
                  value={formData.sasaranProgram}
                  onChange={(e) => setFormData({ ...formData, sasaranProgram: e.target.value })}
                  placeholder="Contoh: Meningkatnya Kualitas dan Penyerapan Tenaga Kerja"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Indikator Kinerja Program (IKP)</label>
                <input
                  type="text"
                  required
                  value={formData.indikator}
                  onChange={(e) => setFormData({ ...formData, indikator: e.target.value })}
                  placeholder="Contoh: Persentase Tenaga Kerja Terlatih yang Terserap"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Satuan Pengukuran</label>
                  <input
                    type="text"
                    value={formData.satuan}
                    onChange={(e) => setFormData({ ...formData, satuan: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Target Tahunan</label>
                  <input
                    type="number"
                    step="any"
                    value={formData.targetTahunan}
                    onChange={(e) => setFormData({ ...formData, targetTahunan: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-900 font-mono"
                  />
                </div>
              </div>

              {/* Triwulan Realisasi */}
              <div className="border border-slate-200 rounded-xl p-3 bg-slate-50 space-y-2">
                <span className="font-bold text-slate-800 block">Realisasi per Triwulan</span>
                <div className="grid grid-cols-4 gap-2">
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-0.5">Realisasi TW I</label>
                    <input
                      type="number"
                      step="any"
                      value={formData.realisasiTW1}
                      onChange={(e) => setFormData({ ...formData, realisasiTW1: Number(e.target.value) })}
                      className="w-full px-2 py-1 border border-slate-300 rounded bg-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-0.5">Realisasi TW II</label>
                    <input
                      type="number"
                      step="any"
                      value={formData.realisasiTW2}
                      onChange={(e) => setFormData({ ...formData, realisasiTW2: Number(e.target.value) })}
                      className="w-full px-2 py-1 border border-slate-300 rounded bg-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-0.5">Realisasi TW III</label>
                    <input
                      type="number"
                      step="any"
                      value={formData.realisasiTW3}
                      onChange={(e) => setFormData({ ...formData, realisasiTW3: Number(e.target.value) })}
                      className="w-full px-2 py-1 border border-slate-300 rounded bg-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-0.5">Realisasi TW IV</label>
                    <input
                      type="number"
                      step="any"
                      value={formData.realisasiTW4}
                      onChange={(e) => setFormData({ ...formData, realisasiTW4: Number(e.target.value) })}
                      className="w-full px-2 py-1 border border-slate-300 rounded bg-white font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Status Kinerja</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as IKPItem['status'] })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-900"
                  >
                    <option value="Tercapai">Tercapai</option>
                    <option value="Perlu Perhatian">Perlu Perhatian</option>
                    <option value="Belum Tercapai">Belum Tercapai</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Unit Penanggung Jawab</label>
                  <select
                    value={formData.penanggungJawab}
                    onChange={(e) => setFormData({ ...formData, penanggungJawab: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-900"
                  >
                    {STRUKTUR_ORGANISASI_TRANSNAKER.map((unit) => (
                      <option key={unit.nama} value={unit.nama}>
                        {unit.singkatan} - {unit.nama}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Keterangan / Analisis Realisasi</label>
                <textarea
                  rows={2}
                  value={formData.keterangan}
                  onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })}
                  placeholder="Catatan penyebab capaian atau hambatan pelaksanaan kegiatan..."
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-900"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold"
                >
                  Simpan Data IKP
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
