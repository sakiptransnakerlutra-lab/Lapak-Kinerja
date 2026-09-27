import React, { useState } from 'react';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Download, 
  Printer, 
  Coins, 
  Target, 
  Percent,
  CheckCircle2,
  X
} from 'lucide-react';
import { IKKItem, User, STRUKTUR_ORGANISASI_TRANSNAKER, UnitKerjaTransnaker } from '../types';
import { PrintHeader, PrintSignature } from '../components/PrintHeader';

interface DashboardIKKViewProps {
  items: IKKItem[];
  currentUser: User | null;
  searchQuery: string;
  onSaveItem: (item: IKKItem) => void;
  onDeleteItem: (id: string) => void;
}

export const DashboardIKKView: React.FC<DashboardIKKViewProps> = ({
  items,
  currentUser,
  searchQuery,
  onSaveItem,
  onDeleteItem,
}) => {
  const [selectedBidang, setSelectedBidang] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<number>(2024);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<IKKItem | null>(null);

  const [formData, setFormData] = useState<Partial<IKKItem>>({
    kode: 'IKK-01',
    program: '',
    kegiatan: '',
    indikatorKegiatan: '',
    satuan: 'Kegiatan',
    bidang: STRUKTUR_ORGANISASI_TRANSNAKER[0].nama,
    target: 100,
    realisasi: 90,
    anggaran: 100000000,
    realisasiAnggaran: 85000000,
    penanggungJawab: '',
    tahun: 2024,
  });

  const isAdmin = currentUser?.role === 'admin';

  const filteredItems = items.filter(item => {
    const matchYear = item.tahun === selectedYear;
    const matchBidang = selectedBidang === 'all' || item.bidang === selectedBidang;
    const matchSearch = searchQuery === '' ||
      item.kode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.program.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.kegiatan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.indikatorKegiatan.toLowerCase().includes(searchQuery.toLowerCase());
    return matchYear && matchBidang && matchSearch;
  });

  // Totals
  const totalAnggaran = filteredItems.reduce((acc, curr) => acc + curr.anggaran, 0);
  const totalRealisasiAnggaran = filteredItems.reduce((acc, curr) => acc + curr.realisasiAnggaran, 0);
  const avgSerapan = totalAnggaran > 0 ? Math.round((totalRealisasiAnggaran / totalAnggaran) * 100) : 0;
  const avgCapaianFisik = filteredItems.length > 0 
    ? Math.round(filteredItems.reduce((acc, curr) => acc + curr.persenCapaian, 0) / filteredItems.length)
    : 0;

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      id: 'ikk-' + Date.now(),
      kode: `IKK-0${items.length + 1}`,
      program: '',
      kegiatan: '',
      indikatorKegiatan: '',
      satuan: 'Orang',
      bidang: STRUKTUR_ORGANISASI_TRANSNAKER[0].nama,
      target: 100,
      realisasi: 0,
      persenCapaian: 0,
      anggaran: 150000000,
      realisasiAnggaran: 0,
      penanggungJawab: currentUser?.name || 'Kasie / Penanggung Jawab',
      tahun: selectedYear,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: IKKItem) => {
    setEditingItem(item);
    setFormData(item);
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const t = Number(formData.target) || 1;
    const r = Number(formData.realisasi) || 0;
    const computedPersen = Math.round((r / t) * 1000) / 10;

    const itemToSave: IKKItem = {
      id: editingItem ? editingItem.id : ('ikk-' + Date.now()),
      kode: formData.kode || 'IKK-XX',
      program: formData.program || '',
      kegiatan: formData.kegiatan || '',
      indikatorKegiatan: formData.indikatorKegiatan || '',
      satuan: formData.satuan || 'Orang',
      bidang: formData.bidang as any || 'Sekretariat',
      target: Number(formData.target) || 0,
      realisasi: Number(formData.realisasi) || 0,
      persenCapaian: computedPersen,
      anggaran: Number(formData.anggaran) || 0,
      realisasiAnggaran: Number(formData.realisasiAnggaran) || 0,
      penanggungJawab: formData.penanggungJawab || '',
      tahun: Number(formData.tahun) || selectedYear,
    };

    onSaveItem(itemToSave);
    setIsModalOpen(false);
  };

  const exportCSV = () => {
    const headers = ['Kode,Bidang,Program,Kegiatan,Indikator Kegiatan,Satuan,Target,Realisasi,Capaian (%),Pagu Anggaran,Realisasi Anggaran,Penanggung Jawab'];
    const rows = filteredItems.map(i => 
      `"${i.kode}","${i.bidang}","${i.program}","${i.kegiatan}","${i.indikatorKegiatan}","${i.satuan}",${i.target},${i.realisasi},${i.persenCapaian},${i.anggaran},${i.realisasiAnggaran},"${i.penanggungJawab}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Capaian_IKK_Transnaker_Luwu_Utara_${selectedYear}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Printable Letterhead */}
      <PrintHeader 
        title={`LAPORAN CAPAIAN INDIKATOR KINERJA KEGIATAN (IKK) TAHUN ${selectedYear}`}
        subTitle="Dinas Transmigrasi dan Tenaga Kerja Kabupaten Luwu Utara"
      />

      {/* Top Filter Bar */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex flex-wrap items-center gap-2">
          {/* Year */}
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

          {/* Bidang */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <span className="font-semibold">Bidang:</span>
            <select
              value={selectedBidang}
              onChange={(e) => setSelectedBidang(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-hidden focus:border-blue-500 font-medium"
            >
              <option value="all">Semua Unit Kerja (5 Bidang / Sekretariat)</option>
              {STRUKTUR_ORGANISASI_TRANSNAKER.map((unit) => (
                <option key={unit.nama} value={unit.nama}>
                  {unit.singkatan} - {unit.nama}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Ekspor CSV</span>
          </button>
          
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Cetak</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah IKK</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="no-print grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium block">Total Kegiatan Operasional</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">{filteredItems.length}</span>
            <span className="text-xs text-slate-400">Subkegiatan DPA</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium block">Rata-rata Capaian Fisik</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-bold font-mono tabular-nums text-blue-600">{avgCapaianFisik}%</span>
            <span className="text-xs text-emerald-600 font-medium">Output Fisik</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium block">Total Pagu Anggaran</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-lg font-bold font-mono tabular-nums text-slate-900">{formatRupiah(totalAnggaran)}</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium block">Serapan Anggaran</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-bold font-mono tabular-nums text-emerald-600">{avgSerapan}%</span>
            <span className="text-xs text-slate-500">{formatRupiah(totalRealisasiAnggaran)}</span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Daftar Indikator Kinerja Kegiatan (IKK)
            </h2>
            <p className="text-xs text-slate-500">
              Perkembangan output kegiatan dan realisasi keuangan APBD Kab. Luwu Utara
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                <th className="py-3 px-3 w-16 text-center border-r border-slate-200">Kode</th>
                <th className="py-3 px-4 min-w-[200px] border-r border-slate-200">Program & Kegiatan</th>
                <th className="py-3 px-4 min-w-[220px] border-r border-slate-200">Indikator Kegiatan</th>
                <th className="py-3 px-3 text-center border-r border-slate-200">Bidang</th>
                <th className="py-3 px-3 text-right border-r border-slate-200">Target</th>
                <th className="py-3 px-3 text-right border-r border-slate-200">Realisasi</th>
                <th className="py-3 px-3 text-right border-r border-slate-200">Capaian (%)</th>
                <th className="py-3 px-3 text-right border-r border-slate-200">Pagu Anggaran</th>
                <th className="py-3 px-3 text-right border-r border-slate-200">Serapan</th>
                <th className="no-print py-3 px-3 text-center w-20">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-slate-400 text-xs">
                    Tidak ada data IKK yang cocok dengan kriteria.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3 text-center font-mono font-semibold text-slate-600 border-r border-slate-200">
                      {item.kode}
                    </td>
                    <td className="py-3 px-4 border-r border-slate-200">
                      <div className="font-semibold text-slate-900">{item.kegiatan}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{item.program}</div>
                    </td>
                    <td className="py-3 px-4 border-r border-slate-200">
                      <div className="text-slate-800 font-medium">{item.indikatorKegiatan}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">PJ: {item.penanggungJawab}</div>
                    </td>
                    <td className="py-3 px-3 text-center text-[11px] text-slate-700 border-r border-slate-200">
                      <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 font-medium text-slate-800 text-[10px]">
                        {STRUKTUR_ORGANISASI_TRANSNAKER.find((u) => u.nama === item.bidang)?.singkatan || item.bidang}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-800 border-r border-slate-200">
                      {item.target} {item.satuan}
                    </td>
                    <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-800 border-r border-slate-200">
                      {item.realisasi} {item.satuan}
                    </td>
                    <td className="py-3 px-3 text-right font-mono tabular-nums font-bold text-blue-600 border-r border-slate-200">
                      {item.persenCapaian}%
                    </td>
                    <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-700 border-r border-slate-200 whitespace-nowrap">
                      {formatRupiah(item.anggaran)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono tabular-nums border-r border-slate-200 whitespace-nowrap">
                      <span className="font-semibold text-emerald-700">
                        {item.anggaran > 0 ? Math.round((item.realisasiAnggaran / item.anggaran) * 100) : 0}%
                      </span>
                    </td>
                    <td className="no-print py-3 px-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="p-1 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded"
                          title="Edit Data IKK"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        {isAdmin && (
                          <button
                            onClick={() => {
                              if (confirm(`Hapus data IKK ${item.kode}?`)) {
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

      <PrintSignature />

      {/* Modal Add/Edit IKK */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
            <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="text-sm font-bold text-slate-900">
                {editingItem ? 'Edit Indikator Kinerja Kegiatan' : 'Tambah Indikator Kinerja Kegiatan Baru'}
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
                  <label className="block font-semibold text-slate-700 mb-1">Kode IKK</label>
                  <input
                    type="text"
                    required
                    value={formData.kode}
                    onChange={(e) => setFormData({ ...formData, kode: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Bidang / Unit Kerja</label>
                  <select
                    value={formData.bidang}
                    onChange={(e) => setFormData({ ...formData, bidang: e.target.value as any })}
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
                <label className="block font-semibold text-slate-700 mb-1">Program</label>
                <input
                  type="text"
                  required
                  value={formData.program}
                  onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                  placeholder="Nama Program APBD"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Kegiatan / Subkegiatan</label>
                <input
                  type="text"
                  required
                  value={formData.kegiatan}
                  onChange={(e) => setFormData({ ...formData, kegiatan: e.target.value })}
                  placeholder="Nama Kegiatan DPA"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Indikator Kinerja Kegiatan</label>
                <input
                  type="text"
                  required
                  value={formData.indikatorKegiatan}
                  onChange={(e) => setFormData({ ...formData, indikatorKegiatan: e.target.value })}
                  placeholder="Tolok ukur keberhasilan kegiatan"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-900"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Satuan</label>
                  <input
                    type="text"
                    value={formData.satuan}
                    onChange={(e) => setFormData({ ...formData, satuan: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Target</label>
                  <input
                    type="number"
                    value={formData.target}
                    onChange={(e) => setFormData({ ...formData, target: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Realisasi</label>
                  <input
                    type="number"
                    value={formData.realisasi}
                    onChange={(e) => setFormData({ ...formData, realisasi: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-900 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Pagu Anggaran (Rp)</label>
                  <input
                    type="number"
                    value={formData.anggaran}
                    onChange={(e) => setFormData({ ...formData, anggaran: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Realisasi Anggaran (Rp)</label>
                  <input
                    type="number"
                    value={formData.realisasiAnggaran}
                    onChange={(e) => setFormData({ ...formData, realisasiAnggaran: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-900 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Penanggung Jawab / Pejabat Teknis</label>
                <input
                  type="text"
                  value={formData.penanggungJawab}
                  onChange={(e) => setFormData({ ...formData, penanggungJawab: e.target.value })}
                  placeholder="Kasi / Pejabat Fungsional"
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
                  Simpan Data IKK
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
