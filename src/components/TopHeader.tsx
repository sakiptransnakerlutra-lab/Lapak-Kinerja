import React from 'react';
import { 
  Menu as MenuIcon, 
  Search, 
  Printer, 
  Shield, 
  UserCheck, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { ActiveMenu, User } from '../types';

interface TopHeaderProps {
  activeMenu: ActiveMenu;
  currentUser: User | null;
  onOpenMobile: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onRoleSwitch?: (role: 'admin' | 'operator') => void;
  onPrint?: () => void;
}

const MENU_TITLES: Record<ActiveMenu, { parent: string; title: string }> = {
  'dashboard-ikp': { parent: 'Dashboard', title: 'Capaian Indikator Kinerja Program (IKP)' },
  'dashboard-ikk': { parent: 'Dashboard', title: 'Capaian Indikator Kinerja Kegiatan (IKK)' },
  'dashboard-monitoring': { parent: 'Dashboard', title: 'Monitoring & Evaluasi Akuntabilitas Kinerja' },
  'evaluasi-mandiri': { parent: 'Evaluasi Kinerja', title: 'Penilaian Mandiri SAKIP (PermenPAN-RB)' },
  'lke-penjelasan': { parent: 'Data LKE', title: 'Penjelasan Penilaian LKE SAKIP' },
  'lke-rekap': { parent: 'Data LKE', title: 'Rekapitulasi Lembar Kerja Evaluasi (LKE)' },
  'lke-data': { parent: 'Data LKE', title: 'Data Rincian Komponen LKE' },
  'lke-kkepd': { parent: 'Data LKE', title: 'Kertas Kerja Evaluasi Perangkat Daerah (KKE PD)' },
  'lke-juknis': { parent: 'Data LKE', title: 'Petunjuk Teknis (Juknis) KKE PD' },
  'lke-kke-penjelasan': { parent: 'Data LKE', title: 'Penjelasan Parameter KKE PD' },
  'dokumen-sakip': { parent: 'Arsip Kinerja', title: 'Dokumen SAKIP (Data Dukung .xlsx & .pdf)' },
  'user-management': { parent: 'Pengaturan Sistem', title: 'Manajemen Akun Operator Dinas' },
};

export const TopHeader: React.FC<TopHeaderProps> = ({
  activeMenu,
  currentUser,
  onOpenMobile,
  searchQuery,
  onSearchChange,
  onRoleSwitch,
  onPrint,
}) => {
  const currentNav = MENU_TITLES[activeMenu] || { parent: 'Menu', title: 'Dashboard' };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
      {/* Left: Mobile Toggle & Breadcrumbs */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onOpenMobile}
          className="p-2 -ml-2 text-slate-600 hover:text-slate-900 rounded-lg lg:hidden hover:bg-slate-100"
          title="Buka Navigasi"
        >
          <MenuIcon className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <nav className="flex items-center gap-1.5 text-xs text-slate-400">
            <span>{currentNav.parent}</span>
            <span>/</span>
            <span className="text-slate-600 font-medium truncate">{currentNav.title}</span>
          </nav>
          <h1 className="text-base sm:text-lg font-bold text-slate-900 truncate">
            {currentNav.title}
          </h1>
        </div>
      </div>

      {/* Right: Quick Search + Fast Role Switcher + Print Button */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Search Bar */}
        <div className="relative hidden md:block w-52 lg:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari data, IKP, dokumen..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500 focus:bg-white text-slate-800 placeholder-slate-400 transition-colors"
          />
        </div>

        {/* Quick Role Switcher for instant testing */}
        {onRoleSwitch && (
          <div className="hidden sm:flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
            <button
              onClick={() => onRoleSwitch('admin')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors flex items-center gap-1.5 ${
                currentUser?.role === 'admin'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Ganti ke peran Admin (Akses Penuh: Hapus, Edit, Buat Akun)"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>
            <button
              onClick={() => onRoleSwitch('operator')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors flex items-center gap-1.5 ${
                currentUser?.role === 'operator'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Ganti ke peran Operator (Melihat, Menginput & Mengedit data)"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Operator</span>
            </button>
          </div>
        )}

        {/* Print Button */}
        {onPrint && (
          <button
            onClick={onPrint}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-colors shadow-2xs"
            title="Cetak format resmi"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Cetak</span>
          </button>
        )}
      </div>
    </header>
  );
};
