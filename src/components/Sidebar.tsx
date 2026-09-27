import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Target, 
  Activity, 
  ClipboardCheck, 
  FileSpreadsheet, 
  BookOpen, 
  FileText, 
  ShieldCheck, 
  Users, 
  ChevronDown, 
  ChevronRight, 
  Layers, 
  FolderLock,
  LogOut,
  X
} from 'lucide-react';
import { ActiveMenu, User } from '../types';
import { AppLogo } from './AppLogo';

interface SidebarProps {
  activeMenu: ActiveMenu;
  onSelectMenu: (menu: ActiveMenu) => void;
  currentUser: User | null;
  onLogout: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeMenu,
  onSelectMenu,
  currentUser,
  onLogout,
  mobileOpen,
  onCloseMobile,
}) => {
  // Collapsible states
  const [dashboardOpen, setDashboardOpen] = useState(true);
  const [evaluasiOpen, setEvaluasiOpen] = useState(true);
  const [lkeSubOpen, setLkeSubOpen] = useState(true);

  const handleMenuClick = (menu: ActiveMenu) => {
    onSelectMenu(menu);
    onCloseMobile();
  };

  const isLkeActive = [
    'lke-penjelasan',
    'lke-rekap',
    'lke-data',
    'lke-kkepd',
    'lke-juknis',
    'lke-kke-penjelasan'
  ].includes(activeMenu);

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-slate-900 text-slate-100 flex flex-col border-r border-slate-800 transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header / Brand */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="shrink-0 flex items-center justify-center">
              <AppLogo size="md" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-bold tracking-tight text-white font-sans">
                  LAPAK KINERJA
                </span>
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  SAKIP
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium truncate max-w-[170px]" title="Dinas Transnaker Luwu Utara">
                Dinas Transnaker Luwu Utara
              </p>
            </div>
          </div>
          <button 
            onClick={onCloseMobile}
            className="p-1.5 text-slate-400 hover:text-white rounded-md lg:hidden"
            title="Tutup Menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5 scrollbar-thin scrollbar-thumb-slate-800">
          {/* Section: Menu Utama */}
          <div className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Menu Navigasi
          </div>

          {/* 1. Menu Dashboard & Submenu */}
          <div>
            <button
              onClick={() => setDashboardOpen(!dashboardOpen)}
              className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg text-slate-200 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <LayoutDashboard className="w-4 h-4 text-blue-400" />
                <span>Dashboard</span>
              </div>
              {dashboardOpen ? (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-slate-400" />
              )}
            </button>

            {dashboardOpen && (
              <div className="mt-1 ml-4 pl-3 border-l border-slate-800 space-y-1">
                <button
                  onClick={() => handleMenuClick('dashboard-ikp')}
                  className={`w-full flex items-center gap-2.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    activeMenu === 'dashboard-ikp'
                      ? 'bg-blue-600/20 text-blue-300 font-semibold border-l-2 border-blue-500'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                  }`}
                >
                  <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
                  <span>Capaian IKP</span>
                </button>
                <button
                  onClick={() => handleMenuClick('dashboard-ikk')}
                  className={`w-full flex items-center gap-2.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    activeMenu === 'dashboard-ikk'
                      ? 'bg-blue-600/20 text-blue-300 font-semibold border-l-2 border-blue-500'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                  }`}
                >
                  <Target className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Capaian IKK</span>
                </button>
                <button
                  onClick={() => handleMenuClick('dashboard-monitoring')}
                  className={`w-full flex items-center gap-2.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    activeMenu === 'dashboard-monitoring'
                      ? 'bg-blue-600/20 text-blue-300 font-semibold border-l-2 border-blue-500'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                  }`}
                >
                  <Activity className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Monitoring</span>
                </button>
              </div>
            )}
          </div>

          {/* 2. Menu Evaluasi Kinerja */}
          <div>
            <button
              onClick={() => setEvaluasiOpen(!evaluasiOpen)}
              className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg text-slate-200 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <ClipboardCheck className="w-4 h-4 text-emerald-400" />
                <span>Evaluasi Kinerja</span>
              </div>
              {evaluasiOpen ? (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-slate-400" />
              )}
            </button>

            {evaluasiOpen && (
              <div className="mt-1 ml-4 pl-3 border-l border-slate-800 space-y-1">
                {/* Penilaian Mandiri */}
                <button
                  onClick={() => handleMenuClick('evaluasi-mandiri')}
                  className={`w-full flex items-center gap-2.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    activeMenu === 'evaluasi-mandiri'
                      ? 'bg-blue-600/20 text-blue-300 font-semibold border-l-2 border-blue-500'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>Penilaian Mandiri</span>
                </button>

                {/* Data LKE Submenu */}
                <div>
                  <button
                    onClick={() => setLkeSubOpen(!lkeSubOpen)}
                    className="w-full flex items-center justify-between px-3 py-1.5 text-xs font-medium rounded-md text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Layers className="w-3.5 h-3.5 text-violet-400" />
                      <span>Data LKE</span>
                    </div>
                    {lkeSubOpen ? (
                      <ChevronDown className="w-3 h-3 text-slate-400" />
                    ) : (
                      <ChevronRight className="w-3 h-3 text-slate-400" />
                    )}
                  </button>

                  {/* Sub-Submenu Data LKE */}
                  {lkeSubOpen && (
                    <div className="ml-4 mt-0.5 space-y-0.5 border-l border-slate-800 pl-2">
                      <button
                        onClick={() => handleMenuClick('lke-penjelasan')}
                        className={`w-full text-left px-2 py-1 text-[11px] rounded transition-colors truncate ${
                          activeMenu === 'lke-penjelasan'
                            ? 'text-blue-300 font-semibold bg-blue-600/20'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                        title="Penjelasan Penilaian"
                      >
                        · Penjelasan Penilaian
                      </button>
                      <button
                        onClick={() => handleMenuClick('lke-rekap')}
                        className={`w-full text-left px-2 py-1 text-[11px] rounded transition-colors truncate ${
                          activeMenu === 'lke-rekap'
                            ? 'text-blue-300 font-semibold bg-blue-600/20'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                        title="Rekap LKE"
                      >
                        · Rekap LKE
                      </button>
                      <button
                        onClick={() => handleMenuClick('lke-data')}
                        className={`w-full text-left px-2 py-1 text-[11px] rounded transition-colors truncate ${
                          activeMenu === 'lke-data'
                            ? 'text-blue-300 font-semibold bg-blue-600/20'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                        title="Data LKE"
                      >
                        · Data LKE
                      </button>
                      <button
                        onClick={() => handleMenuClick('lke-kkepd')}
                        className={`w-full text-left px-2 py-1 text-[11px] rounded transition-colors truncate ${
                          activeMenu === 'lke-kkepd'
                            ? 'text-blue-300 font-semibold bg-blue-600/20'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                        title="Kertas Kerja Evaluasi Perangkat Daerah (KKE PD)"
                      >
                        · KKE PD
                      </button>
                      <button
                        onClick={() => handleMenuClick('lke-juknis')}
                        className={`w-full text-left px-2 py-1 text-[11px] rounded transition-colors truncate ${
                          activeMenu === 'lke-juknis'
                            ? 'text-blue-300 font-semibold bg-blue-600/20'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                        title="KKE PD Juknis"
                      >
                        · KKE PD Juknis
                      </button>
                      <button
                        onClick={() => handleMenuClick('lke-kke-penjelasan')}
                        className={`w-full text-left px-2 py-1 text-[11px] rounded transition-colors truncate ${
                          activeMenu === 'lke-kke-penjelasan'
                            ? 'text-blue-300 font-semibold bg-blue-600/20'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                        title="KKE PD Penjelasan"
                      >
                        · KKE PD Penjelasan
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 3. Menu Dokumen SAKIP */}
          <div>
            <button
              onClick={() => handleMenuClick('dokumen-sakip')}
              className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeMenu === 'dokumen-sakip'
                  ? 'bg-blue-600 text-white font-semibold shadow-xs'
                  : 'text-slate-200 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <FileSpreadsheet className="w-4 h-4 text-sky-400" />
                <span>Dokumen SAKIP</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                XLSX/PDF
              </span>
            </button>
          </div>

          {/* 4. Fitur Pengguna / Admin Management */}
          {currentUser?.role === 'admin' && (
            <div className="pt-2">
              <div className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Pengaturan Sistem
              </div>
              <button
                onClick={() => handleMenuClick('user-management')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeMenu === 'user-management'
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'text-slate-200 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Users className="w-4 h-4 text-indigo-400" />
                <span>Kelola Operator</span>
              </button>
            </div>
          )}
        </div>

        {/* User Card & Logout Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/50">
          <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-slate-900 border border-slate-800/80">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-blue-950 text-blue-300 flex items-center justify-center font-bold text-xs shrink-0 border border-blue-800">
                {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-white truncate">
                  {currentUser?.name || 'Tamu'}
                </div>
                <div className="text-[10px] text-slate-400 truncate flex items-center gap-1">
                  <span className={`inline-block w-1.5 h-1.5 rounded-full shrink-0 ${currentUser?.role === 'admin' ? 'bg-amber-400' : 'bg-emerald-400'}`} />
                  <span className="truncate">{currentUser?.role === 'admin' ? 'Administrator' : currentUser?.bidang || 'Operator Dinas'}</span>
                </div>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded transition-colors"
              title="Keluar / Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
