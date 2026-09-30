import React from 'react';
import { AppLogo } from './AppLogo';

interface PrintHeaderProps {
  title: string;
  subTitle?: string;
  nomorDokumen?: string;
}

export const PrintHeader: React.FC<PrintHeaderProps> = ({
  title,
  subTitle = 'Sistem Akuntabilitas Kinerja Instansi Pemerintah (SAKIP)',
  nomorDokumen,
}) => {
  const todayFormatted = new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date());

  return (
    <div className="print-only mb-6 border-b-2 border-slate-900 pb-4">
      {/* Official Government Letterhead (KOP SURAT) */}
      <div className="flex items-center justify-between gap-4 pb-2 border-b border-slate-400">
        <div className="w-20 h-20 shrink-0 flex items-center justify-center">
          <AppLogo size="lg" />
        </div>
        <div className="flex-1 text-center font-serif">
          <h2 className="text-sm font-bold tracking-wider uppercase text-slate-800">
            PEMERINTAH KABUPATEN LUWU UTARA
          </h2>
          <h1 className="text-lg font-extrabold uppercase text-slate-900 tracking-wide">
            DINAS TRANSMIGRASI DAN TENAGA KERJA
          </h1>
          <p className="text-[10px] text-slate-600 leading-tight">
            Kompleks Perkantoran Gabungan Dinas, Jl. Simpurusiang No. 27, Masamba 92961
          </p>
          <p className="text-[10px] text-slate-600 leading-tight">
            Email: sakip.transnakerlutra@gmail.com | Website: transnaker.luwuutarakab.go.id
          </p>
        </div>
        <div className="w-20 h-20 shrink-0 flex items-center justify-center">
          {/* SAKIP badge placeholder for visual symmetry */}
          <div className="border border-slate-300 rounded p-1 text-[9px] font-mono text-center text-slate-500">
            LAPAK<br />KINERJA<br />2026
          </div>
        </div>
      </div>

      {/* Document Title */}
      <div className="mt-4 text-center">
        <h3 className="text-base font-bold uppercase tracking-tight text-slate-900 underline">
          {title}
        </h3>
        <p className="text-xs text-slate-700 mt-0.5">{subTitle}</p>
        {nomorDokumen && (
          <p className="text-xs text-slate-500 font-mono mt-0.5">Nomor: {nomorDokumen}</p>
        )}
        <div className="text-[11px] text-slate-500 mt-1">
          Tanggal Cetak: {todayFormatted} Masamba, Luwu Utara
        </div>
      </div>
    </div>
  );
};

export const PrintSignature: React.FC<{ penanggungJawab?: string; nip?: string }> = ({
  penanggungJawab = 'Drs. H. Misbah, M.Si',
  nip = '19700315 199603 1 004',
}) => {
  const todayFormatted = new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date());

  return (
    <div className="print-only mt-12 pt-4 break-inside-avoid">
      <div className="flex justify-end">
        <div className="w-72 text-center text-xs">
          <p className="text-slate-700">Masamba, {todayFormatted}</p>
          <p className="font-semibold text-slate-900 mt-1">
            Kepala Dinas Transmigrasi dan Tenaga Kerja<br />Kabupaten Luwu Utara
          </p>
          <div className="h-20" /> {/* Space for signature & official stamp */}
          <p className="font-bold underline text-slate-900">{penanggungJawab}</p>
          <p className="text-slate-600">Pembina Utama Muda (IV/c)</p>
          <p className="text-slate-600 font-mono">NIP. {nip}</p>
        </div>
      </div>
    </div>
  );
};
