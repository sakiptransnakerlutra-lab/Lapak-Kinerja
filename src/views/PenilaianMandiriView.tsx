import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Award, 
  Save, 
  Printer, 
  Download, 
  Edit3, 
  CheckCircle,
  HelpCircle,
  Sliders,
  X
} from 'lucide-react';
import { KomponenPenilaian, User } from '../types';
import { PrintHeader, PrintSignature } from '../components/PrintHeader';

interface PenilaianMandiriViewProps {
  data: KomponenPenilaian[];
  currentUser: User | null;
  onSaveData: (data: KomponenPenilaian[]) => void;
}

export const PenilaianMandiriView: React.FC<PenilaianMandiriViewProps> = ({
  data,
  currentUser,
  onSaveData,
}) => {
  const [list, setList] = useState<KomponenPenilaian[]>(data);
  const [editingSub, setEditingSub] = useState<{ kompId: string; subId: string } | null>(null);
  const [subScoreInput, setSubScoreInput] = useState<number>(80);
  const [subDescInput, setSubDescInput] = useState<string>('');
  const [hasChanges, setHasChanges] = useState(false);

  // Recalculate component score
  const updateSubScore = (kompId: string, subId: string, newScore: number, newKeterangan?: string) => {
    const updated = list.map(komp => {
      if (komp.id !== kompId) return komp;

      const updatedSubs = komp.subkomponen.map(sub => {
        if (sub.id !== subId) return sub;
        return {
          ...sub,
          nilai: newScore,
          keterangan: newKeterangan !== undefined ? newKeterangan : sub.keterangan,
        };
      });

      // Recalculate parent average score
      const totalWeight = updatedSubs.reduce((acc, s) => acc + s.bobot, 0);
      const weightedSum = updatedSubs.reduce((acc, s) => acc + (s.nilai * s.bobot), 0);
      const computedScore = totalWeight > 0 ? (weightedSum / totalWeight) : 0;
      const computedTertimbang = (computedScore * komp.bobot) / 100;

      return {
        ...komp,
        nilai: Math.round(computedScore * 100) / 100,
        nilaiTertimbang: Math.round(computedTertimbang * 100) / 100,
        subkomponen: updatedSubs,
      };
    });

    setList(updated);
    setHasChanges(true);
  };

  const handleSaveAll = () => {
    onSaveData(list);
    setHasChanges(false);
  };

  const totalNilai = list.reduce((acc, curr) => acc + curr.nilaiTertimbang, 0);
  const roundedTotal = Math.round(totalNilai * 100) / 100;

  // PermenPAN-RB 88 Predikat mapping
  let predikat = 'BB';
  let deskripsiPredikat = 'Sangat Baik (Akuntabilitas kinerja sudah baik, memiliki sistem yang dapat diandalkan)';
  let predikatBadgeColor = 'bg-blue-600 text-white';

  if (roundedTotal > 90) {
    predikat = 'AA';
    deskripsiPredikat = 'Memuaskan (Memimpin implementasi manajemen kinerja prima)';
    predikatBadgeColor = 'bg-emerald-600 text-white';
  } else if (roundedTotal > 80) {
    predikat = 'A';
    deskripsiPredikat = 'Memuaskan (Implementasi SAKIP sangat baik dan berkesinambungan)';
    predikatBadgeColor = 'bg-emerald-500 text-white';
  } else if (roundedTotal > 70) {
    predikat = 'BB';
    deskripsiPredikat = 'Sangat Baik (Sistem manajemen kinerja handal)';
    predikatBadgeColor = 'bg-blue-600 text-white';
  } else if (roundedTotal > 60) {
    predikat = 'B';
    deskripsiPredikat = 'Baik (Implementasi SAKIP cukup memadai)';
    predikatBadgeColor = 'bg-amber-500 text-white';
  } else if (roundedTotal > 50) {
    predikat = 'CC';
    deskripsiPredikat = 'Cukup (Perlu perbaikan mendasar pada cascading sasaran)';
    predikatBadgeColor = 'bg-amber-600 text-white';
  } else {
    predikat = 'C';
    deskripsiPredikat = 'Kurang';
    predikatBadgeColor = 'bg-red-600 text-white';
  }

  const exportCSV = () => {
    const headers = ['Kode,Komponen SAKIP,Bobot (%),Nilai Capaian,Nilai Tertimbang,Catatan Rekomendasi'];
    const rows = list.map(k => 
      `"${k.kode}","${k.nama}",${k.bobot},${k.nilai},${k.nilaiTertimbang},"${k.catatanRekomendasi}"`
    );
    rows.push(`"TOTAL","TOTAL NILAI EVALUASI SAKIP",100,${roundedTotal},${roundedTotal},"Predikat: ${predikat}"`);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Penilaian_Mandiri_SAKIP_Transnaker_Luwu_Utara_2024.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <PrintHeader 
        title="LEMBAR KERJA EVALUASI PENILAIAN MANDIRI SAKIP TAHUN 2024"
        subTitle="Berdasarkan PermenPAN-RB No. 88 / 89 · Dinas Transmigrasi dan Tenaga Kerja Kab. Luwu Utara"
      />

      {/* Top Banner & Grade */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider">
            <Award className="w-4 h-4" />
            <span>Hasil Evaluasi Mandiri Akuntabilitas Kinerja Instansi Pemerintah</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            Penilaian Mandiri SAKIP Dinas Transnaker Luwu Utara
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {deskripsiPredikat}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-center">
            <span className="text-[11px] text-slate-400 block font-medium">Nilai Akhir</span>
            <span className="text-2xl font-black font-mono tabular-nums text-slate-900">
              {roundedTotal}
            </span>
          </div>
          <div className={`px-5 py-2 rounded-xl text-center shadow-xs ${predikatBadgeColor}`}>
            <span className="text-[11px] text-white/80 block font-medium">Predikat</span>
            <span className="text-2xl font-black">{predikat}</span>
          </div>
        </div>
      </div>

      {/* Control bar */}
      <div className="no-print flex items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <div className="text-xs text-slate-500">
          Klik tombol <span className="font-semibold text-slate-700">Edit Skor</span> pada tiap subkomponen untuk memperbarui capaian evaluasi mandiri.
        </div>

        <div className="flex items-center gap-2">
          {hasChanges && (
            <button
              onClick={handleSaveAll}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-xs animate-pulse"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Simpan Perubahan</span>
            </button>
          )}

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
            <span>Cetak Lembar</span>
          </button>
        </div>
      </div>

      {/* Komponen Accordion / Cards */}
      <div className="space-y-4">
        {list.map((komp) => (
          <div key={komp.id} className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            {/* Component Header */}
            <div className="p-4 bg-slate-50/80 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-blue-600 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0">
                  {komp.kode}
                </span>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{komp.nama}</h3>
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span>Bobot Komponen: <strong>{komp.bobot}%</strong></span>
                    <span>·</span>
                    <span>Nilai Capaian: <strong className="font-mono text-slate-800">{komp.nilai}</strong></span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="text-right sm:text-right">
                  <span className="text-[11px] text-slate-400 block">Nilai Tertimbang</span>
                  <span className="text-base font-bold font-mono text-blue-600 tabular-nums">
                    {komp.nilaiTertimbang.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Subcomponents List */}
            <div className="p-4 divide-y divide-slate-100 text-xs">
              {komp.subkomponen.map((sub) => (
                <div key={sub.id} className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex-1">
                    <p className="font-semibold text-slate-800">{sub.nama}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{sub.keterangan}</p>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right font-mono">
                      <span className="text-slate-400 text-[10px] block">Bobot: {sub.bobot}%</span>
                      <span className="font-bold text-slate-900 text-xs tabular-nums">{sub.nilai} / 100</span>
                    </div>
                    <button
                      onClick={() => {
                        setEditingSub({ kompId: komp.id, subId: sub.id });
                        setSubScoreInput(sub.nilai);
                        setSubDescInput(sub.keterangan);
                      }}
                      className="no-print p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors"
                      title="Ubah Nilai Subkomponen"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Recommendation Footer */}
            {komp.catatanRekomendasi && (
              <div className="p-3 bg-blue-50/40 border-t border-slate-100 text-xs text-slate-600 flex items-start gap-2">
                <HelpCircle className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-700">Rekomendasi Tindak Lanjut: </span>
                  {komp.catatanRekomendasi}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <PrintSignature />

      {/* Modal Edit Subcomponent Score */}
      {editingSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden border border-slate-200">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="text-sm font-bold text-slate-900">
                Perbarui Nilai Subkomponen Evaluasi
              </h3>
              <button
                onClick={() => setEditingSub(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Skor Penilaian Mandiri (0 - 100)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="0.5"
                    value={subScoreInput}
                    onChange={(e) => setSubScoreInput(Number(e.target.value))}
                    className="flex-1 accent-blue-600"
                  />
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.5"
                    value={subScoreInput}
                    onChange={(e) => setSubScoreInput(Number(e.target.value))}
                    className="w-20 px-2 py-1 border border-slate-300 rounded font-mono font-bold text-center text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Catatan Keterangan Pemenuhan Kriteria
                </label>
                <textarea
                  rows={3}
                  value={subDescInput}
                  onChange={(e) => setSubDescInput(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-900 resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingSub(null)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={() => {
                    updateSubScore(editingSub.kompId, editingSub.subId, subScoreInput, subDescInput);
                    setEditingSub(null);
                  }}
                  className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold"
                >
                  Terapkan Skor
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
