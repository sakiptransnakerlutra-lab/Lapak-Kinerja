import React, { useState, useEffect } from 'react';
import { ShieldAlert } from 'lucide-react';
import { StorageService } from './services/storage';
import { 
  User, 
  ActiveMenu, 
  IKPItem, 
  IKKItem, 
  KomponenPenilaian, 
  LKEItem, 
  KKEPDItem, 
  SakipDocument 
} from './types';
import { Sidebar } from './components/Sidebar';
import { TopHeader } from './components/TopHeader';
import { LoginPage } from './components/LoginPage';
import { DocumentPreviewModal } from './components/DocumentPreviewModal';
import { DocumentUploadModal } from './components/DocumentUploadModal';

import { DashboardIKPView } from './views/DashboardIKPView';
import { DashboardIKKView } from './views/DashboardIKKView';
import { DashboardMonitoringView } from './views/DashboardMonitoringView';
import { PenilaianMandiriView } from './views/PenilaianMandiriView';
import { DataLKEView } from './views/DataLKEView';
import { DokumenSakipView } from './views/DokumenSakipView';
import { UserManagementView } from './views/UserManagementView';

export default function App() {
  // Authentication State
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    StorageService.init();
    return StorageService.getCurrentUser();
  });

  // Navigation State
  const [activeMenu, setActiveMenu] = useState<ActiveMenu>('dashboard-ikp');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Main Data States
  const [ikpList, setIkpList] = useState<IKPItem[]>(() => StorageService.getIKP());
  const [ikkList, setIkkList] = useState<IKKItem[]>(() => StorageService.getIKK());
  const [penilaianList, setPenilaianList] = useState<KomponenPenilaian[]>(() => StorageService.getPenilaianMandiri());
  const [lkeList, setLkeList] = useState<LKEItem[]>(() => StorageService.getLKEItems());
  const [kkePdList, setKkePdList] = useState<KKEPDItem[]>(() => StorageService.getKKEPD());
  const [documents, setDocuments] = useState<SakipDocument[]>(() => StorageService.getDocuments());

  // Modal States
  const [previewDoc, setPreviewDoc] = useState<SakipDocument | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Guard user-management: only admin can access
  useEffect(() => {
    if (activeMenu === 'user-management' && currentUser?.role !== 'admin') {
      setActiveMenu('dashboard-ikp');
    }
  }, [activeMenu, currentUser]);

  // Sync state helpers
  const handleSaveIKP = (item: IKPItem) => {
    StorageService.saveIKP(item);
    setIkpList(StorageService.getIKP());
  };

  const handleDeleteIKP = (id: string) => {
    StorageService.deleteIKP(id);
    setIkpList(StorageService.getIKP());
  };

  const handleSaveIKK = (item: IKKItem) => {
    StorageService.saveIKK(item);
    setIkkList(StorageService.getIKK());
  };

  const handleDeleteIKK = (id: string) => {
    StorageService.deleteIKK(id);
    setIkkList(StorageService.getIKK());
  };

  const handleSavePenilaian = (updated: KomponenPenilaian[]) => {
    StorageService.savePenilaianMandiri(updated);
    setPenilaianList(updated);
  };

  const handleSaveLKE = (item: LKEItem) => {
    StorageService.saveLKEItem(item);
    setLkeList(StorageService.getLKEItems());
  };

  const handleSaveKKEPD = (item: KKEPDItem) => {
    StorageService.saveKKEPD(item);
    setKkePdList(StorageService.getKKEPD());
  };

  const handleSaveDocument = (doc: SakipDocument) => {
    StorageService.saveDocument(doc);
    setDocuments(StorageService.getDocuments());
    setIsUploadModalOpen(false);
  };

  const handleDeleteDocument = (id: string) => {
    StorageService.deleteDocument(id);
    setDocuments(StorageService.getDocuments());
  };

  // Real file download trigger
  const handleDownloadDocument = (doc: SakipDocument) => {
    if (doc.fileDataUrl) {
      const link = document.createElement('a');
      link.href = doc.fileDataUrl;
      link.download = doc.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // Generate clean downloadable file content
      let content = `DOKUMEN SAKIP - DINAS TRANSMIGRASI DAN TENAGA KERJA KABUPATEN LUWU UTARA\n`;
      content += `=========================================================================\n`;
      content += `Judul: ${doc.title}\n`;
      content += `Kategori: ${doc.kategori}\n`;
      content += `Tahun: ${doc.tahun}\n`;
      content += `Unit Kerja: ${doc.bidang}\n`;
      content += `Nomor Surat: ${doc.nomorSurat || '-'}\n`;
      content += `Pengunggah: ${doc.uploadedBy} (${doc.uploadedAt})\n`;
      content += `Status Verifikasi: ${doc.statusVerifikasi}\n`;
      content += `Keterangan: ${doc.deskripsi}\n\n`;

      if (doc.previewRows && doc.previewRows.length > 0) {
        content += `DATA MATRIKS:\n`;
        doc.previewRows.forEach(row => {
          content += row.join('\t') + '\n';
        });
      }

      const blob = new Blob([content], { type: doc.fileType === 'xlsx' ? 'text/csv;charset=utf-8;' : 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = doc.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  // Quick Role Toggle for testing Admin vs Operator privileges
  const handleRoleSwitch = (newRole: 'admin' | 'operator') => {
    if (!currentUser) return;
    const updated: User = {
      ...currentUser,
      role: newRole,
      bidang: newRole === 'admin' ? 'Sekretariat Dinas' : 'Bidang Pemberdayaan Tenaga Kerja',
    };
    StorageService.setCurrentUser(updated);
    setCurrentUser(updated);
  };

  const handleLogout = () => {
    StorageService.logout();
    setCurrentUser(null);
  };

  // If unauthenticated, show executive login/register page
  if (!currentUser) {
    return <LoginPage onLoginSuccess={(u) => setCurrentUser(u)} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Navy Sidebar */}
      <Sidebar
        activeMenu={activeMenu}
        onSelectMenu={(menu) => setActiveMenu(menu)}
        currentUser={currentUser}
        onLogout={handleLogout}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="lg:pl-72 flex flex-col flex-1 min-h-screen">
        {/* Top Header */}
        <TopHeader
          activeMenu={activeMenu}
          currentUser={currentUser}
          onOpenMobile={() => setMobileMenuOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onRoleSwitch={handleRoleSwitch}
          onPrint={() => window.print()}
        />

        {/* View Router */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeMenu === 'dashboard-ikp' && (
            <DashboardIKPView
              items={ikpList}
              currentUser={currentUser}
              searchQuery={searchQuery}
              onSaveItem={handleSaveIKP}
              onDeleteItem={handleDeleteIKP}
            />
          )}

          {activeMenu === 'dashboard-ikk' && (
            <DashboardIKKView
              items={ikkList}
              currentUser={currentUser}
              searchQuery={searchQuery}
              onSaveItem={handleSaveIKK}
              onDeleteItem={handleDeleteIKK}
            />
          )}

          {activeMenu === 'dashboard-monitoring' && (
            <DashboardMonitoringView
              ikpList={ikpList}
              ikkList={ikkList}
              documents={documents}
              penilaianList={penilaianList}
              onNavigateMenu={(menu) => setActiveMenu(menu)}
            />
          )}

          {activeMenu === 'evaluasi-mandiri' && (
            <PenilaianMandiriView
              data={penilaianList}
              currentUser={currentUser}
              onSaveData={handleSavePenilaian}
            />
          )}

          {[
            'lke-penjelasan',
            'lke-rekap',
            'lke-data',
            'lke-kkepd',
            'lke-juknis',
            'lke-kke-penjelasan'
          ].includes(activeMenu) && (
            <DataLKEView
              activeSubMenu={activeMenu}
              onSelectSubMenu={(menu) => setActiveMenu(menu)}
              lkeItems={lkeList}
              kkePdItems={kkePdList}
              documents={documents}
              currentUser={currentUser}
              searchQuery={searchQuery}
              onSaveLKE={handleSaveLKE}
              onSaveKKEPD={handleSaveKKEPD}
              onViewDocPreview={(doc) => setPreviewDoc(doc)}
            />
          )}

          {activeMenu === 'dokumen-sakip' && (
            <DokumenSakipView
              documents={documents}
              currentUser={currentUser}
              searchQuery={searchQuery}
              onOpenUpload={() => setIsUploadModalOpen(true)}
              onOpenPreview={(doc) => setPreviewDoc(doc)}
              onDownload={handleDownloadDocument}
              onDeleteDocument={handleDeleteDocument}
            />
          )}

          {activeMenu === 'user-management' && (
            currentUser?.role === 'admin' ? (
              <UserManagementView
                currentUser={currentUser}
              />
            ) : (
              <div className="bg-white p-8 rounded-xl border border-red-200 text-center max-w-lg mx-auto my-12 shadow-2xs">
                <div className="w-14 h-14 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
                  <ShieldAlert className="w-7 h-7" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-1">
                  Akses Terbatas Khusus Administrator
                </h3>
                <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                  Menu <strong>Kelola Operator</strong> hanya dapat diakses oleh akun dengan hak akses <strong>Administrator SAKIP</strong> Dinas Transmigrasi dan Tenaga Kerja.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveMenu('dashboard-ikp')}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold cursor-pointer shadow-xs"
                >
                  Kembali ke Dashboard IKP
                </button>
              </div>
            )
          )}
        </main>
      </div>

      {/* Global Modals */}
      {previewDoc && (
        <DocumentPreviewModal
          document={previewDoc}
          onClose={() => setPreviewDoc(null)}
          onDownload={handleDownloadDocument}
        />
      )}

      {isUploadModalOpen && (
        <DocumentUploadModal
          currentUser={currentUser}
          onClose={() => setIsUploadModalOpen(false)}
          onSave={handleSaveDocument}
        />
      )}
    </div>
  );
}
