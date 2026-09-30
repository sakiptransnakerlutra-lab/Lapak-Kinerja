import React, { useState } from 'react';
import { 
  FileText, 
  Layers, 
  HelpCircle, 
  BookOpen, 
  CheckCircle2, 
  AlertCircle, 
  Printer, 
  Download, 
  Edit3, 
  FileSpreadsheet, 
  Check, 
  ChevronRight,
  ExternalLink,
  Shield,
  X,
  Link as LinkIcon,
  FolderOpen,
  Upload,
  UploadCloud,
  Eye,
  Trash2,
  Sparkles,
  Paperclip
} from 'lucide-react';
import { ActiveMenu, LKEItem, KKEPDItem, SakipDocument, User } from '../types';
import { PrintHeader, PrintSignature } from '../components/PrintHeader';
import { ExportDropdown } from '../components/ExportDropdown';
import { 
  exportLKEToExcel, 
  exportLKEToCSV,
  exportKKEPDToExcel,
  exportKKEPDToCSV
} from '../utils/exportUtils';

interface DataLKEViewProps {
  activeSubMenu: ActiveMenu;
  onSelectSubMenu: (menu: ActiveMenu) => void;
  lkeItems: LKEItem[];
  kkePdItems: KKEPDItem[];
  documents: SakipDocument[];
  currentUser: User | null;
  searchQuery: string;
  onSaveLKE: (item: LKEItem) => void;
  onSaveKKEPD: (item: KKEPDItem) => void;
  onViewDocPreview?: (doc: SakipDocument) => void;
}

export const DataLKEView: React.FC<DataLKEViewProps> = ({
  activeSubMenu,
  onSelectSubMenu,
  lkeItems,
  kkePdItems,
  documents,
  currentUser,
  searchQuery,
  onSaveLKE,
  onSaveKKEPD,
  onViewDocPreview,
}) => {
  // Modal for editing KKE PD
  const [editingKKE, setEditingKKE] = useState<KKEPDItem | null>(null);
  const [kkeAspek, setKkeAspek] = useState('');
  const [kkeIndikator, setKkeIndikator] = useState('');
  const [kkePertanyaan, setKkePertanyaan] = useState('');
  const [kkeDataDukung, setKkeDataDukung] = useState('');
  const [kkePilihan, setKkePilihan] = useState<'A' | 'B' | 'C' | 'D' | 'E'>('A');
  const [kkeCatatan, setKkeCatatan] = useState('');
  const [kkeRekomendasi, setKkeRekomendasi] = useState('');
  const [kkeLinkEvidence, setKkeLinkEvidence] = useState('');
  const [kkeTautanDokumenId, setKkeTautanDokumenId] = useState('');
  const [kkeUploadedFileName, setKkeUploadedFileName] = useState<string | undefined>(undefined);
  const [kkeUploadedFileSize, setKkeUploadedFileSize] = useState<string | undefined>(undefined);
  const [kkeUploadedFileType, setKkeUploadedFileType] = useState<string | undefined>(undefined);
  const [kkeUploadedFileDataUrl, setKkeUploadedFileDataUrl] = useState<string | undefined>(undefined);

  // Modal for editing LKE
  const [editingLKE, setEditingLKE] = useState<LKEItem | null>(null);
  const [lkeKomponen, setLkeKomponen] = useState('');
  const [lkeSubkomponen, setLkeSubkomponen] = useState('');
  const [lkeKriteria, setLkeKriteria] = useState('');
  const [lkeParameter, setLkeParameter] = useState('');
  const [lkeBobot, setLkeBobot] = useState<number>(1.0);
  const [lkeUnitJawaban, setLkeUnitJawaban] = useState('');
  const [lkeUnitNilai, setLkeUnitNilai] = useState<number | undefined>(undefined);
  const [lkeNilai, setLkeNilai] = useState<number>(80);
  const [lkeStatusDukung, setLkeStatusDukung] = useState<LKEItem['statusDukung']>('Lengkap');
  const [lkeCatatan, setLkeCatatan] = useState('');
  const [lkeLinkEvidence, setLkeLinkEvidence] = useState('');
  const [lkeTautanDokumenId, setLkeTautanDokumenId] = useState('');
  const [lkeUploadedFileName, setLkeUploadedFileName] = useState<string | undefined>(undefined);
  const [lkeUploadedFileSize, setLkeUploadedFileSize] = useState<string | undefined>(undefined);
  const [lkeUploadedFileType, setLkeUploadedFileType] = useState<string | undefined>(undefined);
  const [lkeUploadedFileDataUrl, setLkeUploadedFileDataUrl] = useState<string | undefined>(undefined);

  // Dedicated Upload Dokumen Evidence Modals (Data LKE & KKE PD)
  const [uploadLKEModalOpen, setUploadLKEModalOpen] = useState(false);
  const [selectedLKEForUploadId, setSelectedLKEForUploadId] = useState<string>('');
  const [modalLKEFile, setModalLKEFile] = useState<File | null>(null);
  const [modalLKELink, setModalLKELink] = useState<string>('');
  const [modalLKETautanDocId, setModalLKETautanDocId] = useState<string>('');
  const [modalLKEStatus, setModalLKEStatus] = useState<'Lengkap' | 'Perlu Perbaikan' | 'Belum Lengkap'>('Lengkap');
  const [modalLKECatatan, setModalLKECatatan] = useState<string>('');

  const [uploadKKEModalOpen, setUploadKKEModalOpen] = useState(false);
  const [selectedKKEForUploadId, setSelectedKKEForUploadId] = useState<string>('');
  const [modalKKEFile, setModalKKEFile] = useState<File | null>(null);
  const [modalKKELink, setModalKKELink] = useState<string>('');
  const [modalKKETautanDocId, setModalKKETautanDocId] = useState<string>('');
  const [modalKKEPilihan, setModalKKEPilihan] = useState<'A' | 'B' | 'C' | 'D' | 'E'>('A');
  const [modalKKECatatan, setModalKKECatatan] = useState<string>('');
  const [modalKKERekomendasi, setModalKKERekomendasi] = useState<string>('');

  // Toast notification
  const [toastMsg, setToastMsg] = useState<{ text: string; type: 'success' | 'info' } | null>(null);

  const showToast = (text: string, type: 'success' | 'info' = 'success') => {
    setToastMsg({ text, type });
    setTimeout(() => setToastMsg(null), 3500);
  };

  const isAdmin = currentUser?.role === 'admin';

  // Helper to open LKE Edit Modal with full fields populated
  const openEditLKE = (item: LKEItem) => {
    setEditingLKE(item);
    setLkeKomponen(item.komponen || '');
    setLkeSubkomponen(item.subkomponen || '');
    setLkeKriteria(item.kriteria || '');
    setLkeParameter(item.parameter || '');
    setLkeBobot(item.bobot || 1.0);
    setLkeUnitJawaban(item.unitJawaban || '');
    setLkeUnitNilai(item.unitNilai);
    setLkeNilai(item.nilai || 0);
    setLkeStatusDukung(item.statusDukung || 'Lengkap');
    setLkeCatatan(item.catatanEvaluator || '');
    setLkeLinkEvidence(item.linkEvidence || '');
    setLkeTautanDokumenId(item.tautanDokumenId || '');
    setLkeUploadedFileName(item.uploadedFileName);
    setLkeUploadedFileSize(item.uploadedFileSize);
    setLkeUploadedFileType(item.uploadedFileType);
    setLkeUploadedFileDataUrl(item.uploadedFileDataUrl);
  };

  // Helper to open KKE PD Edit Modal with full fields populated
  const openEditKKE = (item: KKEPDItem) => {
    setEditingKKE(item);
    setKkeAspek(item.aspek || '');
    setKkeIndikator(item.indikator || '');
    setKkePertanyaan(item.pertanyaan || '');
    setKkeDataDukung(item.dataDukungDiunggah || '');
    setKkePilihan(item.pilihan || 'A');
    setKkeCatatan(item.catatanTimSAKIP || '');
    setKkeRekomendasi(item.rekomendasiPerbaikan || '');
    setKkeLinkEvidence(item.linkEvidence || '');
    setKkeTautanDokumenId(item.tautanDokumenId || '');
    setKkeUploadedFileName(item.uploadedFileName);
    setKkeUploadedFileSize(item.uploadedFileSize);
    setKkeUploadedFileType(item.uploadedFileType);
    setKkeUploadedFileDataUrl(item.uploadedFileDataUrl);
  };

  const filteredLKE = lkeItems.filter(item => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.komponen.toLowerCase().includes(q) ||
      item.subkomponen.toLowerCase().includes(q) ||
      item.kriteria.toLowerCase().includes(q) ||
      item.parameter.toLowerCase().includes(q) ||
      (item.linkEvidence && item.linkEvidence.toLowerCase().includes(q)) ||
      (item.uploadedFileName && item.uploadedFileName.toLowerCase().includes(q)) ||
      item.dokumenTerkait.some(d => d.toLowerCase().includes(q))
    );
  });

  // Helper to find linked SakipDocument by ID or keyword
  const findLinkedDoc = (docId?: string, keywords: string[] = []): SakipDocument | undefined => {
    if (docId) {
      const match = documents.find((d) => d.id === docId);
      if (match) return match;
    }
    for (const kw of keywords) {
      const match = documents.find(
        (d) =>
          d.title.toLowerCase().includes(kw.toLowerCase()) ||
          kw.toLowerCase().includes(d.kategori.toLowerCase())
      );
      if (match) return match;
    }
    return undefined;
  };

  // Direct File Upload for LKE Item
  const handleLKEFileUpload = (e: React.ChangeEvent<HTMLInputElement>, item: LKEItem) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const sizeStr = file.size > 1024 * 1024 
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.round(file.size / 1024)} KB`;

      const ext = file.name.split('.').pop()?.toLowerCase() || 'pdf';

      const updated: LKEItem = {
        ...item,
        uploadedFileName: file.name,
        uploadedFileSize: sizeStr,
        uploadedFileType: ext,
        uploadedFileDataUrl: dataUrl,
        uploadedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
        uploadedBy: currentUser?.name || 'Operator SAKIP',
        statusDukung: 'Lengkap',
      };

      onSaveLKE(updated);
      showToast(`Dokumen eviden "${file.name}" berhasil diunggah!`);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleRemoveLKEUploadedFile = (item: LKEItem) => {
    if (confirm(`Apakah Anda yakin ingin menghapus dokumen eviden "${item.uploadedFileName}"?`)) {
      const updated: LKEItem = {
        ...item,
        uploadedFileName: undefined,
        uploadedFileSize: undefined,
        uploadedFileType: undefined,
        uploadedFileDataUrl: undefined,
        uploadedAt: undefined,
        uploadedBy: undefined,
        statusDukung: item.linkEvidence || item.tautanDokumenId ? 'Lengkap' : 'Belum Lengkap',
      };
      onSaveLKE(updated);
      showToast('Dokumen eviden berhasil dihapus.', 'info');
    }
  };

  const handleDownloadLKEFile = (item: LKEItem) => {
    if (!item.uploadedFileName) return;
    const link = document.createElement('a');
    link.href = item.uploadedFileDataUrl || '#';
    link.download = item.uploadedFileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePreviewLKEFile = (item: LKEItem) => {
    if (!item.uploadedFileName) return;
    if (onViewDocPreview) {
      onViewDocPreview({
        id: `lke-upload-${item.id}`,
        title: item.kriteria,
        kategori: 'MONEV',
        tahun: 2026,
        bidang: 'Sekretariat Dinas',
        fileName: item.uploadedFileName,
        fileType: (item.uploadedFileType as any) || 'pdf',
        fileSize: item.uploadedFileSize || '1 MB',
        uploadedBy: item.uploadedBy || currentUser?.name || 'Operator SAKIP',
        uploadedAt: item.uploadedAt || new Date().toISOString().split('T')[0],
        deskripsi: `Dokumen eviden data dukung LKE: ${item.parameter}`,
        statusVerifikasi: 'Terverifikasi',
      });
    }
  };

  // Direct File Upload for KKE PD Item
  const handleKKEFileUpload = (e: React.ChangeEvent<HTMLInputElement>, item: KKEPDItem) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const sizeStr = file.size > 1024 * 1024 
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.round(file.size / 1024)} KB`;

      const ext = file.name.split('.').pop()?.toLowerCase() || 'pdf';

      const updated: KKEPDItem = {
        ...item,
        dataDukungDiunggah: file.name,
        uploadedFileName: file.name,
        uploadedFileSize: sizeStr,
        uploadedFileType: ext,
        uploadedFileDataUrl: dataUrl,
        uploadedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
        uploadedBy: currentUser?.name || 'Operator SAKIP',
      };

      onSaveKKEPD(updated);
      showToast(`Dokumen data dukung "${file.name}" berhasil diunggah untuk ${item.kode}!`);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleRemoveKKEUploadedFile = (item: KKEPDItem) => {
    if (confirm(`Apakah Anda yakin ingin menghapus dokumen eviden "${item.uploadedFileName || item.dataDukungDiunggah}"?`)) {
      const updated: KKEPDItem = {
        ...item,
        uploadedFileName: undefined,
        uploadedFileSize: undefined,
        uploadedFileType: undefined,
        uploadedFileDataUrl: undefined,
        uploadedAt: undefined,
        uploadedBy: undefined,
      };
      onSaveKKEPD(updated);
      showToast('Dokumen eviden berhasil dihapus.', 'info');
    }
  };

  const handleDownloadKKEFile = (item: KKEPDItem) => {
    const fileName = item.uploadedFileName || item.dataDukungDiunggah;
    if (!fileName) return;
    const link = document.createElement('a');
    link.href = item.uploadedFileDataUrl || '#';
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePreviewKKEFile = (item: KKEPDItem) => {
    const fileName = item.uploadedFileName || item.dataDukungDiunggah;
    if (!fileName) return;
    if (onViewDocPreview) {
      onViewDocPreview({
        id: `kke-upload-${item.id}`,
        title: item.indikator,
        kategori: 'MONEV',
        tahun: 2026,
        bidang: 'Sekretariat Dinas',
        fileName: fileName,
        fileType: (item.uploadedFileType as any) || 'pdf',
        fileSize: item.uploadedFileSize || '1.5 MB',
        uploadedBy: item.uploadedBy || currentUser?.name || 'Operator SAKIP',
        uploadedAt: item.uploadedAt || new Date().toISOString().split('T')[0],
        deskripsi: `Dokumen eviden data dukung KKE PD: ${item.pertanyaan}`,
        statusVerifikasi: 'Terverifikasi',
      });
    }
  };

  // Dedicated Openers & Submits for Upload Dokumen Evidence Modals
  const openUploadLKEModal = (item?: LKEItem) => {
    const target = item || lkeItems[0];
    if (!target) return;
    setSelectedLKEForUploadId(target.id);
    setModalLKEFile(null);
    setModalLKELink(target.linkEvidence || '');
    setModalLKETautanDocId(target.tautanDokumenId || '');
    setModalLKEStatus(target.statusDukung);
    setModalLKECatatan(target.catatanEvaluator || '');
    setUploadLKEModalOpen(true);
  };

  const handleUploadLKEOk = (e: React.FormEvent) => {
    e.preventDefault();
    const target = lkeItems.find(i => i.id === selectedLKEForUploadId);
    if (!target) return;

    if (modalLKEFile) {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        const sizeStr = modalLKEFile.size > 1024 * 1024 
          ? `${(modalLKEFile.size / (1024 * 1024)).toFixed(1)} MB`
          : `${Math.round(modalLKEFile.size / 1024)} KB`;
        const ext = modalLKEFile.name.split('.').pop()?.toLowerCase() || 'pdf';

        const updated: LKEItem = {
          ...target,
          uploadedFileName: modalLKEFile.name,
          uploadedFileSize: sizeStr,
          uploadedFileType: ext,
          uploadedFileDataUrl: dataUrl,
          uploadedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
          uploadedBy: currentUser?.name || 'Operator SAKIP',
          statusDukung: modalLKEStatus,
          linkEvidence: modalLKELink.trim() || undefined,
          tautanDokumenId: modalLKETautanDocId.trim() || undefined,
          catatanEvaluator: modalLKECatatan.trim() || target.catatanEvaluator,
        };

        onSaveLKE(updated);
        setUploadLKEModalOpen(false);
        showToast(`Dokumen evidence "${modalLKEFile.name}" berhasil diunggah untuk parameter ${target.parameter}!`);
      };
      reader.readAsDataURL(modalLKEFile);
    } else {
      const updated: LKEItem = {
        ...target,
        statusDukung: modalLKEStatus,
        linkEvidence: modalLKELink.trim() || undefined,
        tautanDokumenId: modalLKETautanDocId.trim() || undefined,
        catatanEvaluator: modalLKECatatan.trim() || target.catatanEvaluator,
      };
      onSaveLKE(updated);
      setUploadLKEModalOpen(false);
      showToast(`Data evidence parameter ${target.parameter} berhasil diperbarui!`);
    }
  };

  const openUploadKKEModal = (item?: KKEPDItem) => {
    const target = item || kkePdItems[0];
    if (!target) return;
    setSelectedKKEForUploadId(target.id);
    setModalKKEFile(null);
    setModalKKELink(target.linkEvidence || '');
    setModalKKETautanDocId(target.tautanDokumenId || '');
    setModalKKEPilihan(target.pilihan);
    setModalKKECatatan(target.catatanTimSAKIP || '');
    setModalKKERekomendasi(target.rekomendasiPerbaikan || '');
    setUploadKKEModalOpen(true);
  };

  const handleUploadKKEOk = (e: React.FormEvent) => {
    e.preventDefault();
    const target = kkePdItems.find(i => i.id === selectedKKEForUploadId);
    if (!target) return;

    let computedSkor = 90;
    if (modalKKEPilihan === 'A') computedSkor = 90;
    else if (modalKKEPilihan === 'B') computedSkor = 80;
    else if (modalKKEPilihan === 'C') computedSkor = 65;
    else if (modalKKEPilihan === 'D') computedSkor = 50;
    else computedSkor = 30;

    if (modalKKEFile) {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        const sizeStr = modalKKEFile.size > 1024 * 1024 
          ? `${(modalKKEFile.size / (1024 * 1024)).toFixed(1)} MB`
          : `${Math.round(modalKKEFile.size / 1024)} KB`;
        const ext = modalKKEFile.name.split('.').pop()?.toLowerCase() || 'pdf';

        const updated: KKEPDItem = {
          ...target,
          pilihan: modalKKEPilihan,
          skor: computedSkor,
          dataDukungDiunggah: modalKKEFile.name,
          uploadedFileName: modalKKEFile.name,
          uploadedFileSize: sizeStr,
          uploadedFileType: ext,
          uploadedFileDataUrl: dataUrl,
          uploadedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
          uploadedBy: currentUser?.name || 'Operator SAKIP',
          linkEvidence: modalKKELink.trim() || undefined,
          tautanDokumenId: modalKKETautanDocId.trim() || undefined,
          catatanTimSAKIP: modalKKECatatan.trim() || target.catatanTimSAKIP,
          rekomendasiPerbaikan: modalKKERekomendasi.trim() || target.rekomendasiPerbaikan,
        };

        onSaveKKEPD(updated);
        setUploadKKEModalOpen(false);
        showToast(`Dokumen evidence "${modalKKEFile.name}" berhasil diunggah untuk KKE PD ${target.kode}!`);
      };
      reader.readAsDataURL(modalKKEFile);
    } else {
      const updated: KKEPDItem = {
        ...target,
        pilihan: modalKKEPilihan,
        skor: computedSkor,
        linkEvidence: modalKKELink.trim() || undefined,
        tautanDokumenId: modalKKETautanDocId.trim() || undefined,
        catatanTimSAKIP: modalKKECatatan.trim() || target.catatanTimSAKIP,
        rekomendasiPerbaikan: modalKKERekomendasi.trim() || target.rekomendasiPerbaikan,
      };
      onSaveKKEPD(updated);
      setUploadKKEModalOpen(false);
      showToast(`Data evidence KKE PD ${target.kode} berhasil diperbarui!`);
    }
  };

  // Sub-navigation tab list
  const tabs: { id: ActiveMenu; label: string }[] = [
    { id: 'lke-penjelasan', label: 'Penjelasan Penilaian' },
    { id: 'lke-rekap', label: 'Rekap LKE' },
    { id: 'lke-data', label: 'Data LKE' },
    { id: 'lke-kkepd', label: 'KKE PD' },
    { id: 'lke-juknis', label: 'KKE PD Juknis' },
    { id: 'lke-kke-penjelasan', label: 'KKE PD Penjelasan' },
  ];

  const handleKKEEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingKKE) return;

    let computedSkor = 90;
    if (kkePilihan === 'A') computedSkor = 90;
    else if (kkePilihan === 'B') computedSkor = 80;
    else if (kkePilihan === 'C') computedSkor = 65;
    else if (kkePilihan === 'D') computedSkor = 50;
    else computedSkor = 30;

    const updated: KKEPDItem = {
      ...editingKKE,
      aspek: kkeAspek.trim() || editingKKE.aspek,
      indikator: kkeIndikator.trim() || editingKKE.indikator,
      pertanyaan: kkePertanyaan.trim() || editingKKE.pertanyaan,
      dataDukungDiunggah: kkeDataDukung.trim() || editingKKE.dataDukungDiunggah,
      pilihan: kkePilihan,
      skor: computedSkor,
      catatanTimSAKIP: kkeCatatan,
      rekomendasiPerbaikan: kkeRekomendasi,
      linkEvidence: kkeLinkEvidence.trim() || undefined,
      tautanDokumenId: kkeTautanDokumenId.trim() || undefined,
      uploadedFileName: kkeUploadedFileName,
      uploadedFileSize: kkeUploadedFileSize,
      uploadedFileType: kkeUploadedFileType,
      uploadedFileDataUrl: kkeUploadedFileDataUrl,
      uploadedAt: kkeUploadedFileName ? (editingKKE.uploadedAt || new Date().toISOString().replace('T', ' ').substring(0, 16)) : undefined,
      uploadedBy: kkeUploadedFileName ? (editingKKE.uploadedBy || currentUser?.name || 'Operator SAKIP') : undefined,
    };

    onSaveKKEPD(updated);
    setEditingKKE(null);
    showToast(`Data KKE PD ${updated.kode} (${updated.aspek}) berhasil diperbarui.`);
  };

  const handleLKEEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLKE) return;

    const bobotVal = Number(lkeBobot) > 0 ? Number(lkeBobot) : editingLKE.bobot;
    const computedAkhir = Math.round(((lkeNilai * bobotVal) / 100) * 100) / 100;
    const updated: LKEItem = {
      ...editingLKE,
      komponen: lkeKomponen.trim() || editingLKE.komponen,
      subkomponen: lkeSubkomponen.trim() || editingLKE.subkomponen,
      kriteria: lkeKriteria.trim() || editingLKE.kriteria,
      parameter: lkeParameter.trim() || editingLKE.parameter,
      bobot: bobotVal,
      unitJawaban: lkeUnitJawaban.trim() || editingLKE.unitJawaban,
      unitNilai: lkeUnitNilai !== undefined ? Number(lkeUnitNilai) : editingLKE.unitNilai,
      nilai: lkeNilai,
      nilaiAkhir: computedAkhir,
      statusDukung: lkeUploadedFileName ? 'Lengkap' : lkeStatusDukung,
      catatanEvaluator: lkeCatatan,
      linkEvidence: lkeLinkEvidence.trim() || undefined,
      tautanDokumenId: lkeTautanDokumenId.trim() || undefined,
      uploadedFileName: lkeUploadedFileName,
      uploadedFileSize: lkeUploadedFileSize,
      uploadedFileType: lkeUploadedFileType,
      uploadedFileDataUrl: lkeUploadedFileDataUrl,
      uploadedAt: lkeUploadedFileName ? (editingLKE.uploadedAt || new Date().toISOString().replace('T', ' ').substring(0, 16)) : undefined,
      uploadedBy: lkeUploadedFileName ? (editingLKE.uploadedBy || currentUser?.name || 'Operator SAKIP') : undefined,
    };

    onSaveLKE(updated);
    setEditingLKE(null);
    showToast(`Komponen/Kriteria LKE berhasil diperbarui.`);
  };

  return (
    <div className="space-y-6">
      {/* Sub-menu Tabs Switcher */}
      <div className="no-print bg-white p-2 rounded-xl border border-slate-200 shadow-2xs overflow-x-auto flex items-center gap-1 scrollbar-none">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onSelectSubMenu(tab.id)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              activeSubMenu === tab.id
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 1. PENJELASAN PENILAIAN */}
      {activeSubMenu === 'lke-penjelasan' && (
        <div className="space-y-4">
          <PrintHeader 
            title="PEDOMAN & PENJELASAN PENILAIAN LKE SAKIP"
            subTitle="Berdasarkan PermenPAN-RB No. 88 & 89 Tahun 2021 · Dinas Transmigrasi dan Tenaga Kerja Kab. Luwu Utara"
          />

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-5 text-xs text-slate-700 leading-relaxed">
            <div>
              <h2 className="text-base font-bold text-slate-900 mb-1">
                A. Dasar Hukum dan Kerangka Evaluasi
              </h2>
              <p>
                Evaluasi Akuntabilitas Kinerja Instansi Pemerintah pada Dinas Transmigrasi dan Tenaga Kerja Kabupaten Luwu Utara dilaksanakan berpedoman pada:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-slate-600">
                <li>Peraturan Pemerintah No. 8 Tahun 2006 tentang Pelaporan Keuangan dan Kinerja Instansi Pemerintah.</li>
                <li>Peraturan Presiden No. 29 Tahun 2014 tentang Sistem Akuntabilitas Kinerja Instansi Pemerintah (SAKIP).</li>
                <li>Peraturan Menteri PAN-RB No. 88 Tahun 2021 tentang Evaluasi Akuntabilitas Kinerja Instansi Pemerintah.</li>
                <li>Peraturan Menteri PAN-RB No. 89 Tahun 2021 tentang Penjenjangan Kinerja (Cascading).</li>
                <li>Peraturan Bupati Luwu Utara tentang Petunjuk Pelaksanaan Evaluasi SAKIP Perangkat Daerah.</li>
              </ul>
            </div>

            <div className="pt-3 border-t border-slate-100">
              <h2 className="text-base font-bold text-slate-900 mb-2">
                B. 5 Komponen Utama Penilaian SAKIP
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="font-bold text-blue-600 font-mono">1. Perencanaan Kinerja (Bobot 30%)</span>
                  <p className="text-[11px] text-slate-600 mt-1">
                    Menilai kualitas Renstra, keselarasan sasaran dengan RPJMD, penetapan IKU, dan Perjanjian Kinerja (PK) berjenjang.
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="font-bold text-blue-600 font-mono">2. Pengukuran Kinerja (Bobot 30%)</span>
                  <p className="text-[11px] text-slate-600 mt-1">
                    Menilai keandalan data capaian berkala, manual indikator kerja, dan pemanfaatan data kinerja dalam pengambilan kebijakan.
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="font-bold text-blue-600 font-mono">3. Pelaporan Kinerja (Bobot 15%)</span>
                  <p className="text-[11px] text-slate-600 mt-1">
                    Menilai kualitas LKjIP, kelengkapan analisis efisiensi penggunaan anggaran, serta ketepatan waktu penyampaian.
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="font-bold text-blue-600 font-mono">4. Evaluasi Internal (Bobot 10%)</span>
                  <p className="text-[11px] text-slate-600 mt-1">
                    Menilai pelaksanaan monev berkala oleh pimpinan unit kerja serta tingkat tindak lanjut rekomendasi hasil evaluasi.
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="font-bold text-blue-600 font-mono">5. Capaian Kinerja (Bobot 15%)</span>
                  <p className="text-[11px] text-slate-600 mt-1">
                    Menilai capaian target IKU ketenagakerjaan dan ketransmigrasian serta inovasi pelayanan publik dinas.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100">
              <h2 className="text-base font-bold text-slate-900 mb-2">
                C. Kategori Predikat dan Nilai Akuntabilitas
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-slate-200">
                  <thead className="bg-slate-100 font-semibold text-slate-800">
                    <tr>
                      <th className="py-2 px-3 border border-slate-200">Nilai Angka</th>
                      <th className="py-2 px-3 border border-slate-200">Predikat</th>
                      <th className="py-2 px-3 border border-slate-200">Interpretasi Akuntabilitas Kinerja</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    <tr>
                      <td className="py-1.5 px-3 border border-slate-200 font-mono font-bold">&gt; 90 - 100</td>
                      <td className="py-1.5 px-3 border border-slate-200 font-bold text-emerald-700">AA</td>
                      <td className="py-1.5 px-3 border border-slate-200">Sangat Memuaskan / Leading (Manajemen kinerja prima berkelanjutan)</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 px-3 border border-slate-200 font-mono font-bold">&gt; 80 - 90</td>
                      <td className="py-1.5 px-3 border border-slate-200 font-bold text-emerald-600">A</td>
                      <td className="py-1.5 px-3 border border-slate-200">Memuaskan (Sistem akuntabilitas handal dan berkinerja tinggi)</td>
                    </tr>
                    <tr className="bg-blue-50/50">
                      <td className="py-1.5 px-3 border border-slate-200 font-mono font-bold">&gt; 70 - 80</td>
                      <td className="py-1.5 px-3 border border-slate-200 font-bold text-blue-700">BB (Posisi Transnaker)</td>
                      <td className="py-1.5 px-3 border border-slate-200">Sangat Baik (Akuntabilitas kinerja sudah baik, memiliki sistem yang dapat diandalkan)</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 px-3 border border-slate-200 font-mono font-bold">&gt; 60 - 70</td>
                      <td className="py-1.5 px-3 border border-slate-200 font-bold text-amber-600">B</td>
                      <td className="py-1.5 px-3 border border-slate-200">Baik (Akuntabilitas kinerja sudah cukup baik namun perlu perbaikan)</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 px-3 border border-slate-200 font-mono font-bold">&gt; 50 - 60</td>
                      <td className="py-1.5 px-3 border border-slate-200 font-bold text-amber-700">CC</td>
                      <td className="py-1.5 px-3 border border-slate-200">Cukup (Perlu perbaikan mendasar pada perumusan sasaran dan pengukuran)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <PrintSignature />
        </div>
      )}

      {/* 2. REKAP LKE */}
      {activeSubMenu === 'lke-rekap' && (
        <div className="space-y-4">
          <PrintHeader 
            title="REKAPITULASI LEMBAR KERJA EVALUASI (LKE) SAKIP"
            subTitle="Dinas Transmigrasi dan Tenaga Kerja Kabupaten Luwu Utara"
          />

          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Matriks Rekapitulasi Capaian Evaluasi per Komponen
                </h3>
                <p className="text-xs text-slate-500">
                  Ringkasan nilai evaluasi mandiri dan pemenuhan eviden data dukung
                </p>
              </div>
              <div className="no-print flex items-center gap-2">
                <ExportDropdown
                  label="Ekspor ke Excel"
                  itemCount={lkeItems.length}
                  dataName="Rekap LKE"
                  onExportExcel={() => exportLKEToExcel(lkeItems, { year: 2026, searchQuery })}
                  onExportCSV={() => exportLKEToCSV(lkeItems, { year: 2026, searchQuery })}
                />
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 shadow-2xs transition-colors cursor-pointer"
                  title="Cetak Rekapitulasi LKE"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-500" />
                  <span>Cetak Rekap</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                    <th className="py-3 px-3 text-center w-12 border-r border-slate-200">No</th>
                    <th className="py-3 px-4 border-r border-slate-200">Komponen Evaluasi SAKIP</th>
                    <th className="py-3 px-3 text-center border-r border-slate-200">Bobot (%)</th>
                    <th className="py-3 px-3 text-center border-r border-slate-200">Nilai Capaian</th>
                    <th className="py-3 px-3 text-center border-r border-slate-200">Nilai Tertimbang</th>
                    <th className="py-3 px-4 border-r border-slate-200">Status Pemenuhan Dokumen Pendukung</th>
                    <th className="no-print py-3 px-3 text-center w-16">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[
                    {
                      no: 1,
                      nama: 'PERENCANAAN KINERJA',
                      bobot: '30,00%',
                      capaian: '83,00',
                      tertimbang: '24,90',
                      status: '✓ 25 Kriteria Terpenuhi (Predikat BB / A)',
                      statusClass: 'text-emerald-700 font-medium',
                      item: lkeItems.find(i => i.komponen === 'PERENCANAAN KINERJA')
                    },
                    {
                      no: 2,
                      nama: 'PENGUKURAN KINERJA',
                      bobot: '30,00%',
                      capaian: '65,00',
                      tertimbang: '19,50',
                      status: '✓ 20 Kriteria Terpenuhi (Predikat B / CC)',
                      statusClass: 'text-emerald-700 font-medium',
                      item: lkeItems.find(i => i.komponen === 'PENGUKURAN KINERJA')
                    },
                    {
                      no: 3,
                      nama: 'PELAPORAN KINERJA',
                      bobot: '15,00%',
                      capaian: '67,00',
                      tertimbang: '10,05',
                      status: '✓ 22 Kriteria Terpenuhi (Predikat BB / B / CC)',
                      statusClass: 'text-emerald-700 font-medium',
                      item: lkeItems.find(i => i.komponen === 'PELAPORAN KINERJA')
                    },
                    {
                      no: 4,
                      nama: 'EVALUASI AKUNTABILITAS KINERJA INTERNAL',
                      bobot: '25,00%',
                      capaian: '52,00',
                      tertimbang: '13,00',
                      status: '⚠ 13 Kriteria Terpenuhi (Predikat CC / C)',
                      statusClass: 'text-amber-700 font-medium',
                      item: lkeItems.find(i => i.komponen === 'EVALUASI AKUNTABILITAS KINERJA INTERNAL')
                    },
                  ].map((row) => (
                    <tr key={row.no} className="hover:bg-slate-50/70">
                      <td className="py-2.5 px-3 text-center font-mono text-slate-500 border-r border-slate-200">{row.no}</td>
                      <td className="py-2.5 px-4 font-semibold text-slate-900 border-r border-slate-200">{row.nama}</td>
                      <td className="py-2.5 px-3 text-center font-mono border-r border-slate-200">{row.bobot}</td>
                      <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-800 border-r border-slate-200">{row.capaian}</td>
                      <td className="py-2.5 px-3 text-center font-mono font-bold text-blue-600 border-r border-slate-200">{row.tertimbang}</td>
                      <td className={`py-2.5 px-4 border-r border-slate-200 ${row.statusClass}`}>{row.status}</td>

                      <td className="no-print py-2.5 px-3 text-center">
                        {row.item && (
                          <button
                            onClick={() => {
                              setEditingLKE(row.item!);
                              setLkeNilai(row.item!.nilai);
                              setLkeStatusDukung(row.item!.statusDukung);
                              setLkeCatatan(row.item!.catatanEvaluator);
                              setLkeLinkEvidence(row.item!.linkEvidence || '');
                              setLkeTautanDokumenId(row.item!.tautanDokumenId || '');
                              setLkeUploadedFileName(row.item!.uploadedFileName);
                              setLkeUploadedFileSize(row.item!.uploadedFileSize);
                              setLkeUploadedFileType(row.item!.uploadedFileType);
                              setLkeUploadedFileDataUrl(row.item!.uploadedFileDataUrl);
                            }}
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded cursor-pointer"
                            title="Edit Komponen LKE"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-slate-100 font-bold">
                    <td colSpan={2} className="py-3 px-4 text-slate-900 border-r border-slate-200 uppercase">
                      Total Capaian Nilai SAKIP (Hasil Evaluasi LKE)
                    </td>
                    <td className="py-3 px-3 text-center font-mono border-r border-slate-200">100,00%</td>
                    <td className="py-3 px-3 text-center font-mono text-slate-900 border-r border-slate-200">-</td>
                    <td className="py-3 px-3 text-center font-mono text-blue-700 text-sm border-r border-slate-200">67,45</td>
                    <td className="py-3 px-4 border-r border-slate-200 text-amber-800">
                      PREDIKAT: <span className="bg-amber-600 text-white px-2 py-0.5 rounded ml-1">B (BAIK)</span>
                    </td>
                    <td className="no-print py-3 px-3 text-center"></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <PrintSignature />
        </div>
      )}

      {/* 3. DATA LKE (Rincian butir LKE) */}
      {activeSubMenu === 'lke-data' && (
        <div className="space-y-4">
          <PrintHeader 
            title="DATA RINCIAN LEMBAR KERJA EVALUASI (LKE) SAKIP"
            subTitle="Dinas Transmigrasi dan Tenaga Kerja Kabupaten Luwu Utara"
          />

          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span>Daftar Parameter dan Indikator Uji LKE</span>
                  <span className="text-xs font-normal text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                    {filteredLKE.length} Parameter
                  </span>
                </h3>
                <p className="text-xs text-slate-500">
                  Pengujian kelengkapan dokumen dukung dan penilaian evaluator
                </p>
              </div>

              <div className="no-print flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => openUploadLKEModal(filteredLKE[0])}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-2xs transition-colors cursor-pointer"
                  title="Upload Dokumen Evidence untuk Parameter LKE"
                >
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>Upload Dokumen Evidence</span>
                </button>

                <ExportDropdown
                  label="Ekspor ke Excel"
                  itemCount={filteredLKE.length}
                  dataName="Data LKE"
                  onExportExcel={() => exportLKEToExcel(filteredLKE, { year: 2026, searchQuery })}
                  onExportCSV={() => exportLKEToCSV(filteredLKE, { year: 2026, searchQuery })}
                />
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 shadow-2xs transition-colors cursor-pointer"
                  title="Cetak Rincian LKE"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-500" />
                  <span>Cetak</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                    <th className="py-3 px-3 border-r border-slate-200 w-12 text-center">No</th>
                    <th className="py-3 px-4 border-r border-slate-200 min-w-[320px]">
                      <div className="flex items-center justify-between gap-1.5">
                        <span>Komponen / Sub Komponen / Kriteria</span>
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-700 bg-blue-100/90 px-2 py-0.5 rounded shadow-2xs border border-blue-200 shrink-0">
                          <Edit3 className="w-3 h-3 text-blue-600" />
                          <span>Dapat Diedit</span>
                        </span>
                      </div>
                    </th>
                    <th className="py-3 px-2 text-center border-r border-slate-200 w-16">Bobot</th>
                    <th className="py-3 px-2 text-center border-r border-slate-200 w-16 bg-blue-50/50">Unit/Satker Jawaban</th>
                    <th className="py-3 px-2 text-center border-r border-slate-200 w-16 bg-blue-50/50">Unit/Satker Nilai</th>
                    <th className="py-3 px-3 border-r border-slate-200 w-28 text-center">Status Eviden</th>
                    {/* Kolom Upload Dokumen Evidence */}
                    <th className="py-3 px-3 border-r border-slate-200 min-w-[220px] text-blue-900 bg-blue-50/60 font-bold">
                      <div className="flex items-center gap-1.5">
                        <Upload className="w-3.5 h-3.5 text-blue-600" />
                        <span>Upload Dokumen Evidence</span>
                      </div>
                    </th>
                    {/* Kolom Link Evidence */}
                    <th className="py-3 px-3 border-r border-slate-200 min-w-[170px] text-emerald-900 bg-emerald-50/40">
                      <div className="flex items-center gap-1.5">
                        <LinkIcon className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Link Evidence</span>
                      </div>
                    </th>
                    <th className="py-3 px-4 border-r border-slate-200 min-w-[160px]">Catatan Evaluasi</th>
                    <th className="no-print py-3 px-3 text-center w-20">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredLKE.map((item, index) => (
                    <tr key={item.id} className="hover:bg-slate-50/70">
                      <td className="py-3 px-3 text-center font-mono text-slate-500 border-r border-slate-200 font-bold">
                        {item.noUrut ?? (index + 1)}
                      </td>
                      <td 
                        className="py-3 px-4 border-r border-slate-200 cursor-pointer group hover:bg-blue-50/50 transition-colors relative"
                        onClick={() => openEditLKE(item)}
                        title="Klik untuk Edit Komponen, Sub Komponen, dan Kriteria Parameter"
                      >
                        <div className="flex items-center justify-between gap-1.5 flex-wrap">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-bold text-slate-900 text-xs">{item.komponen}</span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-mono font-semibold">
                              {item.kode || 'LKE'}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              openEditLKE(item);
                            }}
                            className="text-[11px] px-2 py-0.5 rounded bg-blue-50 group-hover:bg-blue-600 text-blue-700 group-hover:text-white font-semibold flex items-center gap-1 transition-all border border-blue-200 group-hover:border-blue-600 shadow-2xs cursor-pointer"
                            title="Edit Komponen, Sub Komponen & Kriteria"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>Edit</span>
                          </button>
                        </div>
                        <div className="text-[11px] text-blue-700 font-semibold mt-1">
                          {item.subkomponen}
                        </div>
                        {item.kriteria && item.kriteria !== item.subkomponen && (
                          <div className="text-[11px] text-indigo-900 font-medium mt-0.5">
                            <span className="text-slate-500 font-normal">Kriteria: </span>
                            {item.kriteria}
                          </div>
                        )}
                        <div className="text-xs text-slate-800 font-medium mt-1 leading-relaxed">
                          {item.parameter}
                        </div>
                        {item.dokumenTerkait && item.dokumenTerkait.length > 0 && (
                          <div className="mt-1.5 flex flex-wrap gap-1">
                            {item.dokumenTerkait.map((doc, i) => (
                              <span key={i} className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded border border-slate-200">
                                {doc}
                              </span>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-2 text-center font-mono text-slate-700 border-r border-slate-200 font-semibold">
                        {typeof item.bobot === 'number' ? item.bobot.toFixed(2).replace('.', ',') : item.bobot}
                      </td>
                      <td className="py-3 px-2 text-center font-mono font-bold text-slate-900 border-r border-slate-200 bg-blue-50/20">
                        <span className={`inline-block px-1.5 py-0.5 rounded text-xs ${
                          item.unitJawaban === 'A' ? 'bg-emerald-100 text-emerald-800' :
                          item.unitJawaban === 'BB' ? 'bg-blue-100 text-blue-800' :
                          item.unitJawaban === 'B' ? 'bg-amber-100 text-amber-800' :
                          item.unitJawaban === 'CC' ? 'bg-amber-100 text-amber-900' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {item.unitJawaban || '-'}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-center font-mono font-bold text-blue-700 border-r border-slate-200 bg-blue-50/20">
                        {item.unitNilai !== undefined ? item.unitNilai.toFixed(2).replace('.', ',') : item.nilaiAkhir.toFixed(2).replace('.', ',')}
                      </td>
                      <td className="py-3 px-3 text-center border-r border-slate-200">
                        <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          item.statusDukung === 'Lengkap' 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {item.statusDukung}
                        </span>
                      </td>

                      {/* Kolom Upload Dokumen Eviden */}
                      <td className="py-3 px-3 border-r border-slate-200 bg-blue-50/20">
                        {item.uploadedFileName ? (
                          <div className="p-2 bg-white rounded-lg border border-blue-200 shadow-2xs space-y-1.5">
                            <div className="flex items-start justify-between gap-1.5">
                              <div className="flex items-start gap-1.5 min-w-0">
                                <FileText className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                                <div className="min-w-0">
                                  <div className="font-semibold text-slate-900 text-xs truncate max-w-[130px]" title={item.uploadedFileName}>
                                    {item.uploadedFileName}
                                  </div>
                                  <div className="text-[10px] text-slate-400">
                                    {item.uploadedFileSize || 'Berkas'} · {item.uploadedAt?.split(' ')[0] || 'Tersimpan'}
                                  </div>
                                </div>
                              </div>
                              <span className="text-[9px] uppercase px-1 py-0.2 rounded bg-blue-100 text-blue-800 font-bold shrink-0">
                                {item.uploadedFileType || 'FILE'}
                              </span>
                            </div>

                            <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between gap-1">
                              <button
                                type="button"
                                onClick={() => handlePreviewLKEFile(item)}
                                className="flex items-center gap-1 text-[10px] font-semibold text-blue-600 hover:text-blue-800 cursor-pointer"
                                title="Lihat / Pratinjau Dokumen"
                              >
                                <Eye className="w-3 h-3" />
                                <span>Lihat</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDownloadLKEFile(item)}
                                className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600 hover:text-emerald-800 cursor-pointer"
                                title="Unduh Berkas"
                              >
                                <Download className="w-3 h-3" />
                                <span>Unduh</span>
                              </button>

                              <label
                                className="text-[10px] text-slate-500 hover:text-blue-600 cursor-pointer p-0.5"
                                title="Ganti File Dokumen"
                              >
                                <Edit3 className="w-3 h-3" />
                                <input
                                  type="file"
                                  accept=".pdf,.doc,.docx,.xls,.xlsx,.zip"
                                  className="hidden"
                                  onChange={(e) => handleLKEFileUpload(e, item)}
                                />
                              </label>

                              <button
                                type="button"
                                onClick={() => handleRemoveLKEUploadedFile(item)}
                                className="text-[10px] text-red-500 hover:text-red-700 p-0.5 cursor-pointer"
                                title="Hapus Dokumen Eviden"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <button
                              type="button"
                              onClick={() => openUploadLKEModal(item)}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 hover:text-blue-900 border border-blue-200 hover:border-blue-300 rounded-md text-[11px] font-bold cursor-pointer transition-colors shadow-2xs group"
                              title="Upload Dokumen Evidence untuk Parameter Ini"
                            >
                              <UploadCloud className="w-3.5 h-3.5 text-blue-600 group-hover:scale-110 transition-transform" />
                              <span>Upload Dokumen Evidence</span>
                            </button>
                            
                            {(() => {
                              const linked = findLinkedDoc(item.tautanDokumenId, item.dokumenTerkait);
                              if (linked) {
                                return (
                                  <button
                                    type="button"
                                    onClick={() => onViewDocPreview && onViewDocPreview(linked)}
                                    className="text-[10px] text-slate-500 hover:text-blue-600 truncate max-w-[170px] block cursor-pointer text-left"
                                    title={`Tersambung ke arsip: ${linked.title}`}
                                  >
                                    📄 {linked.fileName}
                                  </button>
                                );
                              }
                              return <div className="text-[10px] text-slate-400">PDF, Excel (.xlsx), Word, ZIP</div>;
                            })()}
                          </div>
                        )}
                      </td>

                      {/* Kolom Link Evidence */}
                      <td className="py-3 px-3 border-r border-slate-200 bg-emerald-50/15">
                        {(() => {
                          const linkedDoc = findLinkedDoc(item.tautanDokumenId, item.dokumenTerkait);
                          const hasExternal = Boolean(item.linkEvidence);

                          if (!linkedDoc && !hasExternal) {
                            return (
                              <div className="flex items-center gap-1.5">
                                <span className="text-[11px] text-slate-400 italic">Belum ada link</span>
                                <button
                                  type="button"
                                  onClick={() => openEditLKE(item)}
                                  className="text-[10px] text-blue-600 hover:text-blue-800 font-semibold hover:underline"
                                  title="Tambah Link Evidence"
                                >
                                  + Tautkan
                                </button>
                              </div>
                            );
                          }

                          return (
                            <div className="space-y-1.5">
                              {/* Internal Document Button for Instant Preview */}
                              {linkedDoc && (
                                <button
                                  type="button"
                                  onClick={() => onViewDocPreview && onViewDocPreview(linkedDoc)}
                                  className="w-full flex items-center justify-between gap-1.5 px-2 py-1 bg-white hover:bg-blue-50 text-blue-700 border border-blue-200 hover:border-blue-400 rounded-md text-[11px] font-medium shadow-2xs transition-all text-left cursor-pointer group"
                                  title={`Buka & Preview: ${linkedDoc.title}`}
                                >
                                  <div className="flex items-center gap-1.5 min-w-0">
                                    <FileText className="w-3.5 h-3.5 text-blue-600 shrink-0 group-hover:scale-110 transition-transform" />
                                    <span className="truncate max-w-[115px] font-semibold">{linkedDoc.fileName}</span>
                                  </div>
                                  <span className="text-[9px] uppercase px-1 py-0.2 rounded bg-blue-100 text-blue-800 font-bold shrink-0">
                                    {linkedDoc.fileType}
                                  </span>
                                </button>
                              )}

                              {/* External Link or Cloud Drive */}
                              {hasExternal && (
                                <a
                                  href={item.linkEvidence}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="w-full flex items-center justify-between gap-1.5 px-2 py-1 bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-200 hover:border-emerald-400 rounded-md text-[11px] font-medium shadow-2xs transition-all group"
                                  title={`Buka Tautan: ${item.linkEvidence}`}
                                >
                                  <div className="flex items-center gap-1.5 min-w-0">
                                    <ExternalLink className="w-3.5 h-3.5 text-emerald-600 shrink-0 group-hover:scale-110 transition-transform" />
                                    <span className="truncate max-w-[120px] font-medium">
                                      {item.linkEvidence!.includes('drive.google.com')
                                        ? 'Google Drive'
                                        : item.linkEvidence!.replace(/^https?:\/\//, '').split('/')[0]}
                                    </span>
                                  </div>
                                  <span className="text-[9px] text-emerald-700 font-semibold shrink-0">Buka ↗</span>
                                </a>
                              )}
                            </div>
                          );
                        })()}
                      </td>
                      <td className="py-3 px-4 border-r border-slate-200 text-slate-600 text-[11px]">
                        {item.catatanEvaluator}
                      </td>
                      <td className="no-print py-3 px-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            type="button"
                            onClick={() => openUploadLKEModal(item)}
                            className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors cursor-pointer"
                            title="Upload Dokumen Evidence untuk Parameter Ini"
                          >
                            <UploadCloud className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => openEditLKE(item)}
                            className="p-1.5 text-blue-600 hover:text-white hover:bg-blue-600 bg-blue-50 rounded transition-colors cursor-pointer border border-blue-200"
                            title="Edit Komponen, Sub Komponen, Kriteria & Parameter LKE"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <PrintSignature />
        </div>
      )}

      {/* 4. KERTAS KERJA EVALUASI PERANGKAT DAERAH (KKE PD) */}
      {activeSubMenu === 'lke-kkepd' && (
        <div className="space-y-4">
          <PrintHeader 
            title="KERTAS KERJA EVALUASI PERANGKAT DAERAH (KKE PD)"
            subTitle="Dinas Transmigrasi dan Tenaga Kerja Kabupaten Luwu Utara"
          />

          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span>Instrumen KKE PD (Penilaian Pemenuhan Kriteria)</span>
                  <span className="text-xs font-normal text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                    {kkePdItems.length} Indikator
                  </span>
                </h3>
                <p className="text-xs text-slate-500">
                  Formulir kendali evaluasi mandiri perangkat daerah beserta bukti tautan data dukung
                </p>
              </div>
              <div className="no-print flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => openUploadKKEModal(kkePdItems[0])}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-2xs transition-colors cursor-pointer"
                  title="Upload Dokumen Evidence untuk Instrumen KKE PD"
                >
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>Upload Dokumen Evidence</span>
                </button>

                <ExportDropdown
                  label="Ekspor ke Excel"
                  itemCount={kkePdItems.length}
                  dataName="KKE PD"
                  onExportExcel={() => exportKKEPDToExcel(kkePdItems)}
                  onExportCSV={() => exportKKEPDToCSV(kkePdItems)}
                />
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 shadow-2xs transition-colors cursor-pointer"
                  title="Cetak KKE PD"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-500" />
                  <span>Cetak KKE PD</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                    <th className="py-3 px-3 w-16 text-center border-r border-slate-200">Kode</th>
                    <th className="py-3 px-3 border-r border-slate-200 min-w-[160px]">
                      <div className="flex items-center justify-between gap-1">
                        <span>Aspek Evaluasi</span>
                        <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-blue-700 bg-blue-100/90 px-1.5 py-0.5 rounded shadow-2xs border border-blue-200 shrink-0">
                          <Edit3 className="w-2.5 h-2.5 text-blue-600" />
                          <span>Dapat Diedit</span>
                        </span>
                      </div>
                    </th>
                    <th className="py-3 px-4 border-r border-slate-200 min-w-[260px]">
                      <div className="flex items-center justify-between gap-1">
                        <span>Pertanyaan & Indikator Uji</span>
                        <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-blue-700 bg-blue-100/90 px-1.5 py-0.5 rounded shadow-2xs border border-blue-200 shrink-0">
                          <Edit3 className="w-2.5 h-2.5 text-blue-600" />
                          <span>Dapat Diedit</span>
                        </span>
                      </div>
                    </th>
                    <th className="py-3 px-2 text-center border-r border-slate-200 w-12">Pilihan</th>
                    <th className="py-3 px-2.5 text-center border-r border-slate-200 w-14">Skor</th>
                    <th className="py-3 px-3 border-r border-slate-200 min-w-[150px]">Kriteria Data Dukung</th>
                    {/* Kolom Upload Dokumen Evidence */}
                    <th className="py-3 px-3 border-r border-slate-200 min-w-[220px] text-blue-900 bg-blue-50/60 font-bold">
                      <div className="flex items-center gap-1.5">
                        <Upload className="w-3.5 h-3.5 text-blue-600" />
                        <span>Upload Dokumen Evidence</span>
                      </div>
                    </th>
                    {/* Kolom Link Evidence */}
                    <th className="py-3 px-3 border-r border-slate-200 min-w-[170px] text-emerald-900 bg-emerald-50/40">
                      <div className="flex items-center gap-1.5">
                        <LinkIcon className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Link Evidence</span>
                      </div>
                    </th>
                    <th className="py-3 px-4 border-r border-slate-200 min-w-[160px]">Catatan / Rekomendasi SAKIP</th>
                    <th className="no-print py-3 px-3 text-center w-20">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {kkePdItems.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/70">
                      <td className="py-3 px-3 text-center font-mono font-semibold text-slate-600 border-r border-slate-200">
                        {item.kode}
                      </td>
                      <td 
                        className="py-3 px-3 font-semibold text-slate-800 border-r border-slate-200 cursor-pointer group hover:bg-blue-50/50 transition-colors"
                        onClick={() => openEditKKE(item)}
                        title="Klik untuk Edit Aspek Evaluasi"
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-xs font-bold text-slate-900">{item.aspek}</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              openEditKKE(item);
                            }}
                            className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 group-hover:bg-blue-600 text-blue-700 group-hover:text-white font-semibold flex items-center gap-0.5 transition-all border border-blue-200 group-hover:border-blue-600 shadow-2xs cursor-pointer shrink-0"
                            title="Edit Aspek Evaluasi"
                          >
                            <Edit3 className="w-2.5 h-2.5" />
                            <span>Edit</span>
                          </button>
                        </div>
                      </td>
                      <td 
                        className="py-3 px-4 border-r border-slate-200 cursor-pointer group hover:bg-blue-50/50 transition-colors"
                        onClick={() => openEditKKE(item)}
                        title="Klik untuk Edit Pertanyaan & Indikator Uji"
                      >
                        <div className="flex items-start justify-between gap-1.5">
                          <div className="font-bold text-slate-900 text-xs leading-snug">{item.indikator}</div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              openEditKKE(item);
                            }}
                            className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 group-hover:bg-blue-600 text-blue-700 group-hover:text-white font-semibold flex items-center gap-0.5 transition-all border border-blue-200 group-hover:border-blue-600 shadow-2xs cursor-pointer shrink-0"
                            title="Edit Pertanyaan & Indikator Uji"
                          >
                            <Edit3 className="w-2.5 h-2.5" />
                            <span>Edit</span>
                          </button>
                        </div>
                        <div className="text-[11px] text-slate-600 mt-1 leading-relaxed">{item.pertanyaan}</div>
                      </td>
                      <td className="py-3 px-2 text-center font-bold text-blue-600 border-r border-slate-200 text-sm">
                        {item.pilihan}
                      </td>
                      <td className="py-3 px-2.5 text-center font-mono font-bold text-slate-800 border-r border-slate-200">
                        {item.skor}
                      </td>

                      {/* Kolom Kriteria Data Dukung */}
                      <td className="py-3 px-3 border-r border-slate-200">
                        <div className="flex items-start gap-1.5 text-slate-800">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="font-medium text-xs leading-relaxed">{item.dataDukungDiunggah}</span>
                        </div>
                      </td>

                      {/* Kolom Upload Dokumen Eviden */}
                      <td className="py-3 px-3 border-r border-slate-200 bg-blue-50/20">
                        {item.uploadedFileName ? (
                          <div className="p-2 bg-white rounded-lg border border-blue-200 shadow-2xs space-y-1.5">
                            <div className="flex items-start justify-between gap-1.5">
                              <div className="flex items-start gap-1.5 min-w-0">
                                <FileText className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                                <div className="min-w-0">
                                  <div className="font-semibold text-slate-900 text-xs truncate max-w-[130px]" title={item.uploadedFileName}>
                                    {item.uploadedFileName}
                                  </div>
                                  <div className="text-[10px] text-slate-400">
                                    {item.uploadedFileSize || 'Berkas'} · {item.uploadedAt?.split(' ')[0] || 'Tersimpan'}
                                  </div>
                                </div>
                              </div>
                              <span className="text-[9px] uppercase px-1 py-0.2 rounded bg-blue-100 text-blue-800 font-bold shrink-0">
                                {item.uploadedFileType || 'FILE'}
                              </span>
                            </div>

                            <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between gap-1">
                              <button
                                type="button"
                                onClick={() => handlePreviewKKEFile(item)}
                                className="flex items-center gap-1 text-[10px] font-semibold text-blue-600 hover:text-blue-800 cursor-pointer"
                                title="Lihat / Pratinjau Dokumen"
                              >
                                <Eye className="w-3 h-3" />
                                <span>Lihat</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDownloadKKEFile(item)}
                                className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600 hover:text-emerald-800 cursor-pointer"
                                title="Unduh Berkas"
                              >
                                <Download className="w-3 h-3" />
                                <span>Unduh</span>
                              </button>

                              <label
                                className="text-[10px] text-slate-500 hover:text-blue-600 cursor-pointer p-0.5"
                                title="Ganti File Dokumen"
                              >
                                <Edit3 className="w-3 h-3" />
                                <input
                                  type="file"
                                  accept=".pdf,.doc,.docx,.xls,.xlsx,.zip"
                                  className="hidden"
                                  onChange={(e) => handleKKEFileUpload(e, item)}
                                />
                              </label>

                              <button
                                type="button"
                                onClick={() => handleRemoveKKEUploadedFile(item)}
                                className="text-[10px] text-red-500 hover:text-red-700 p-0.5 cursor-pointer"
                                title="Hapus Dokumen Eviden"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <button
                              type="button"
                              onClick={() => openUploadKKEModal(item)}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 hover:text-blue-900 border border-blue-200 hover:border-blue-300 rounded-md text-[11px] font-bold cursor-pointer transition-colors shadow-2xs group"
                              title="Upload Dokumen Evidence untuk Butir KKE PD Ini"
                            >
                              <UploadCloud className="w-3.5 h-3.5 text-blue-600 group-hover:scale-110 transition-transform" />
                              <span>Upload Dokumen Evidence</span>
                            </button>
                            <div className="text-[10px] text-slate-400">PDF, Excel (.xlsx), Word, ZIP</div>
                          </div>
                        )}
                      </td>

                      {/* Kolom Link Evidence */}
                      <td className="py-3 px-3 border-r border-slate-200 bg-emerald-50/15">
                        {(() => {
                          const linkedDoc = findLinkedDoc(item.tautanDokumenId);
                          const hasExternal = Boolean(item.linkEvidence);

                          if (!linkedDoc && !hasExternal) {
                            return (
                              <div className="flex items-center gap-1.5">
                                <span className="text-[11px] text-slate-400 italic">Belum ada link</span>
                                <button
                                  type="button"
                                  onClick={() => openEditKKE(item)}
                                  className="text-[10px] text-blue-600 hover:text-blue-800 font-semibold hover:underline"
                                  title="Tambah Link Evidence"
                                >
                                  + Tautkan
                                </button>
                              </div>
                            );
                          }

                          return (
                            <div className="space-y-1.5">
                              {linkedDoc && (
                                <button
                                  type="button"
                                  onClick={() => onViewDocPreview && onViewDocPreview(linkedDoc)}
                                  className="inline-flex items-center justify-between gap-1.5 px-2 py-1 bg-blue-50/80 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded text-[11px] font-medium transition-colors cursor-pointer group text-left max-w-fit"
                                  title={`Preview Dokumen: ${linkedDoc.title}`}
                                >
                                  <div className="flex items-center gap-1.5 min-w-0">
                                    <FileText className="w-3 h-3 text-blue-600 shrink-0" />
                                    <span className="truncate max-w-[130px] font-semibold">{linkedDoc.fileName}</span>
                                  </div>
                                  <span className="text-[9px] uppercase px-1 py-0.2 rounded bg-blue-100 text-blue-800 font-bold shrink-0">
                                    {linkedDoc.fileType}
                                  </span>
                                </button>
                              )}
                              {hasExternal && (
                                <a
                                  href={item.linkEvidence}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 px-2 py-1 bg-emerald-50/80 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded text-[11px] font-medium transition-colors max-w-fit"
                                  title={`Buka Link Evidence: ${item.linkEvidence}`}
                                >
                                  <ExternalLink className="w-3 h-3 text-emerald-600 shrink-0" />
                                  <span className="truncate max-w-[140px]">
                                    {item.linkEvidence!.includes('drive.google.com')
                                      ? 'Google Drive'
                                      : item.linkEvidence!.replace(/^https?:\/\//, '').split('/')[0]}
                                  </span>
                                  <span className="text-[9px] text-emerald-700 font-semibold">↗</span>
                                </a>
                              )}
                            </div>
                          );
                        })()}
                      </td>

                      <td className="py-3 px-4 border-r border-slate-200 text-slate-600 text-[11px]">
                        <div><strong>Catatan:</strong> {item.catatanTimSAKIP}</div>
                        <div className="text-blue-700 mt-1"><strong>Rekomendasi:</strong> {item.rekomendasiPerbaikan}</div>
                      </td>
                      <td className="no-print py-3 px-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            type="button"
                            onClick={() => openUploadKKEModal(item)}
                            className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors cursor-pointer"
                            title="Upload Dokumen Evidence untuk KKE PD Ini"
                          >
                            <UploadCloud className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => openEditKKE(item)}
                            className="p-1.5 text-blue-600 hover:text-white hover:bg-blue-600 bg-blue-50 rounded transition-colors cursor-pointer border border-blue-200"
                            title="Edit Aspek Evaluasi, Pertanyaan & Indikator Uji KKE PD"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <PrintSignature />
        </div>
      )}

      {/* 5. KKE PD JUKNIS (Petunjuk Teknis) */}
      {activeSubMenu === 'lke-juknis' && (
        <div className="space-y-4">
          <PrintHeader 
            title="PETUNJUK TEKNIS (JUKNIS) PENGISIAN KKE PD SAKIP"
            subTitle="Dinas Transmigrasi dan Tenaga Kerja Kabupaten Luwu Utara"
          />

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4 text-xs text-slate-700 leading-relaxed">
            <h2 className="text-base font-bold text-slate-900">
              Petunjuk Operasional Pengisian Instrumen KKE PD
            </h2>
            <ol className="list-decimal pl-5 space-y-2.5">
              <li>
                <strong>Identifikasi Aspek Penilaian:</strong> Setiap Pejabat Administrator (Sekretaris, Kepala Bidang Tenaga Kerja & HI, Kepala Bidang Transmigrasi, Kepala UPTD BLK) bertanggung jawab melengkapi eviden sesuai tugas dan fungsi masing-masing.
              </li>
              <li>
                <strong>Pemilihan Kategori Jawaban (A, B, C, D, E):</strong>
                <ul className="list-disc pl-5 mt-1 space-y-1 text-slate-600">
                  <li><strong>A (Skor 90 - 100):</strong> Kriteria terpenuhi 100%, didukung dokumen resmi sah yang telah ditandatangani dan berlaku.</li>
                  <li><strong>B (Skor 75 - 89):</strong> Kriteria terpenuhi sebagian besar (≥80%) dengan eviden memadai.</li>
                  <li><strong>C (Skor 60 - 74):</strong> Kriteria terpenuhi sebagian (≥60%) namun bukti pendukung belum optimal.</li>
                  <li><strong>D (Skor 40 - 59):</strong> Pemenuhan kriteria masih bersifat formalitas tanpa analisis berkala.</li>
                  <li><strong>E (Skor 0 - 39):</strong> Belum terdapat data dukung atau belum dilaksanakan.</li>
                </ul>
              </li>
              <li>
                <strong>Pengunggahan Data Dukung:</strong> Setiap jawaban wajib dilampirkan berkas dokumen digital (*.pdf atau *.xlsx) pada menu <em>Dokumen SAKIP</em> dan dikaitkan pada butir KKE PD terkait.
              </li>
              <li>
                <strong>Verifikasi Tim SAKIP Kabupaten:</strong> Tim verifikator Inspektorat Daerah dan Subbag Program Dinas akan memeriksa keabsahan bukti dukung sebelum nilai akhir dikunci.
              </li>
            </ol>
          </div>

          <PrintSignature />
        </div>
      )}

      {/* 6. KKE PD PENJELASAN */}
      {activeSubMenu === 'lke-kke-penjelasan' && (
        <div className="space-y-4">
          <PrintHeader 
            title="PENJELASAN PARAMETER DAN INDIKATOR KKE PD"
            subTitle="Dinas Transmigrasi dan Tenaga Kerja Kabupaten Luwu Utara"
          />

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4 text-xs text-slate-700 leading-relaxed">
            <h2 className="text-base font-bold text-slate-900">
              Rincian Parameter Pengujian Kertas Kerja Evaluasi Perangkat Daerah
            </h2>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                <h4 className="font-bold text-blue-700">1. Parameter Keselarasan Sasaran Strategis</h4>
                <p className="mt-1 text-slate-600">
                  Memastikan bahwa sasaran strategis pada Dinas Transnaker telah selaras dengan Tujuan dan Sasaran RPJMD Kabupaten Luwu Utara 2021-2026, khususnya pada indikator penurunan angka pengangguran terbuka dan peningkatan produktivitas transmigran.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                <h4 className="font-bold text-blue-700">2. Parameter Manual Indikator Kinerja Utama (IKU)</h4>
                <p className="mt-1 text-slate-600">
                  Memastikan setiap indikator memiliki lembar manual indikator yang memuat: nama indikator, definisi operasional, formula perhitungan matematis, sumber data resmi, unit penanggung jawab pengumpul data, dan polaritas indikator (Maximize atau Minimize).
                </p>
              </div>

              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                <h4 className="font-bold text-blue-700">3. Parameter Analisis Efisiensi Sumber Daya dalam LKjIP</h4>
                <p className="mt-1 text-slate-600">
                  LKjIP tidak hanya memuat persentase realisasi fisik, namun harus memuat analisis efisiensi keuangan: membandingkan anggaran yang digunakan dengan target output yang tercapai, serta menguraikan efisiensi biaya yang berhasil dihemat.
                </p>
              </div>
            </div>
          </div>

          <PrintSignature />
        </div>
      )}

      {/* Modal Edit KKE PD */}
      {editingKKE && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden border border-slate-200 text-xs my-6">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-blue-700 to-indigo-800 text-white">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-white/10 rounded-lg">
                  <Edit3 className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    Edit Aspek Evaluasi, Pertanyaan & Indikator Uji
                  </h3>
                  <p className="text-[11px] text-blue-100">
                    Kertas Kerja Evaluasi (KKE PD) · Kode: {editingKKE.kode}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingKKE(null)}
                className="p-1.5 text-blue-100 hover:text-white hover:bg-white/10 rounded-lg cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleKKEEditSubmit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
              {/* Field Aspek, Indikator, Pertanyaan & Kriteria Data Dukung */}
              <div className="space-y-3 p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="font-bold text-slate-800 text-xs flex items-center justify-between">
                  <span>Aspek Evaluasi, Pertanyaan & Indikator Uji</span>
                  <span className="text-[10px] text-blue-600 font-semibold">Dapat diedit langsung</span>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Aspek Evaluasi
                  </label>
                  <input
                    type="text"
                    list="aspek-options"
                    value={kkeAspek}
                    onChange={(e) => setKkeAspek(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-900 bg-white font-semibold"
                    placeholder="Contoh: Perencanaan Kinerja"
                    required
                  />
                  <datalist id="aspek-options">
                    <option value="Perencanaan Kinerja" />
                    <option value="Pengukuran Kinerja" />
                    <option value="Pelaporan Kinerja" />
                    <option value="Evaluasi Akuntabilitas Kinerja Internal" />
                  </datalist>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Indikator Uji
                  </label>
                  <input
                    type="text"
                    value={kkeIndikator}
                    onChange={(e) => setKkeIndikator(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-900 bg-white font-medium"
                    placeholder="Contoh: Kesesuaian Tujuan dan Sasaran dengan Isu Strategis Daerah"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Pertanyaan Evaluasi
                  </label>
                  <textarea
                    rows={2}
                    value={kkePertanyaan}
                    onChange={(e) => setKkePertanyaan(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-900 bg-white resize-none"
                    placeholder="Contoh: Apakah tujuan dan sasaran pada Renstra telah merespon isu strategis daerah?"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Kriteria Data Dukung Diperlukan
                  </label>
                  <input
                    type="text"
                    value={kkeDataDukung}
                    onChange={(e) => setKkeDataDukung(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-900 bg-white"
                    placeholder="Contoh: Dokumen Renstra 2021-2026 Bab IV & Bab V"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Pilihan Pemenuhan Kriteria
                </label>
                <div className="space-y-1.5">
                  <label className="flex items-start gap-2 p-2 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                    <input
                      type="radio"
                      name="pilihan"
                      value="A"
                      checked={kkePilihan === 'A'}
                      onChange={() => setKkePilihan('A')}
                      className="mt-0.5 accent-blue-600"
                    />
                    <div>
                      <span className="font-bold text-blue-700">Pilihan A (Skor 90)</span>
                      <p className="text-[11px] text-slate-500">{editingKKE.kriteriaA}</p>
                    </div>
                  </label>
                  <label className="flex items-start gap-2 p-2 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                    <input
                      type="radio"
                      name="pilihan"
                      value="B"
                      checked={kkePilihan === 'B'}
                      onChange={() => setKkePilihan('B')}
                      className="mt-0.5 accent-blue-600"
                    />
                    <div>
                      <span className="font-bold text-blue-700">Pilihan B (Skor 80)</span>
                      <p className="text-[11px] text-slate-500">{editingKKE.kriteriaB}</p>
                    </div>
                  </label>
                  <label className="flex items-start gap-2 p-2 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                    <input
                      type="radio"
                      name="pilihan"
                      value="C"
                      checked={kkePilihan === 'C'}
                      onChange={() => setKkePilihan('C')}
                      className="mt-0.5 accent-blue-600"
                    />
                    <div>
                      <span className="font-bold text-blue-700">Pilihan C (Skor 65)</span>
                      <p className="text-[11px] text-slate-500">{editingKKE.kriteriaC}</p>
                    </div>
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Catatan Tim SAKIP</label>
                <textarea
                  rows={2}
                  value={kkeCatatan}
                  onChange={(e) => setKkeCatatan(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-900 resize-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Rekomendasi Tindak Lanjut</label>
                <textarea
                  rows={2}
                  value={kkeRekomendasi}
                  onChange={(e) => setKkeRekomendasi(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-900 resize-none"
                />
              </div>

              {/* Unggah Dokumen Eviden Langsung KKE PD */}
              <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-blue-950 text-xs flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5 text-blue-600" />
                    <span>Upload File Data Dukung (.pdf, .xlsx, .docx, .zip)</span>
                  </label>
                  {kkeUploadedFileName && (
                    <button
                      type="button"
                      onClick={() => {
                        setKkeUploadedFileName(undefined);
                        setKkeUploadedFileSize(undefined);
                        setKkeUploadedFileType(undefined);
                        setKkeUploadedFileDataUrl(undefined);
                      }}
                      className="text-[10px] text-red-600 hover:underline cursor-pointer"
                    >
                      Hapus Berkas
                    </button>
                  )}
                </div>

                {kkeUploadedFileName ? (
                  <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-blue-200 text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                      <div className="min-w-0">
                        <div className="font-semibold text-slate-900 truncate max-w-[240px]">{kkeUploadedFileName}</div>
                        <div className="text-[10px] text-slate-400">{kkeUploadedFileSize || 'Berkas Terlampir'}</div>
                      </div>
                    </div>
                    <label className="text-[10px] text-blue-600 font-semibold hover:underline cursor-pointer px-2 py-1 bg-blue-50 rounded">
                      Ganti
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.zip"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (!f) return;
                          const r = new FileReader();
                          r.onload = () => {
                            setKkeUploadedFileName(f.name);
                            setKkeUploadedFileSize(f.size > 1024*1024 ? `${(f.size/(1024*1024)).toFixed(1)} MB` : `${Math.round(f.size/1024)} KB`);
                            setKkeUploadedFileType(f.name.split('.').pop()?.toLowerCase() || 'pdf');
                            setKkeUploadedFileDataUrl(r.result as string);
                          };
                          r.readAsDataURL(f);
                        }}
                      />
                    </label>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center p-3.5 bg-white border-2 border-dashed border-blue-200 hover:border-blue-400 rounded-lg cursor-pointer transition-colors text-center group">
                    <Upload className="w-5 h-5 text-blue-500 mb-1 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-semibold text-slate-700">Pilih Berkas Dokumen Pendukung</span>
                    <span className="text-[10px] text-slate-400 mt-0.5">Format: PDF, Excel (.xlsx), Word (.docx), ZIP</span>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.zip"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (!f) return;
                        const r = new FileReader();
                        r.onload = () => {
                          setKkeUploadedFileName(f.name);
                          setKkeUploadedFileSize(f.size > 1024*1024 ? `${(f.size/(1024*1024)).toFixed(1)} MB` : `${Math.round(f.size/1024)} KB`);
                          setKkeUploadedFileType(f.name.split('.').pop()?.toLowerCase() || 'pdf');
                          setKkeUploadedFileDataUrl(r.result as string);
                        };
                        r.readAsDataURL(f);
                      }}
                    />
                  </label>
                )}
              </div>

              {/* Tautan Dokumen SAKIP Internal */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Pilih Dokumen SAKIP Internal (Opsional)</span>
                  <span className="text-[10px] text-slate-500 font-normal">Akan terhubung ke viewer berkas</span>
                </label>
                <select
                  value={kkeTautanDokumenId}
                  onChange={(e) => setKkeTautanDokumenId(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-900 text-xs"
                >
                  <option value="">-- Pilih dari Berkas Dokumen SAKIP --</option>
                  {documents.map((doc) => (
                    <option key={doc.id} value={doc.id}>
                      [{doc.kategori}] {doc.title} ({doc.fileName})
                    </option>
                  ))}
                </select>
              </div>

              {/* Link Evidence External */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Link Evidence / URL Bukti Digital</span>
                  <span className="text-[10px] text-slate-500 font-normal">Google Drive, Cloud Storage, atau Web</span>
                </label>
                <div className="relative">
                  <input
                    type="url"
                    placeholder="https://drive.google.com/... atau https://..."
                    value={kkeLinkEvidence}
                    onChange={(e) => setKkeLinkEvidence(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 border border-slate-300 rounded-lg text-slate-900 font-mono text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <LinkIcon className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingKKE(null)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold"
                >
                  Simpan KKE PD
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Edit LKE Item */}
      {editingLKE && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden border border-slate-200 text-xs my-6">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-blue-700 to-indigo-800 text-white">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-white/10 rounded-lg">
                  <Edit3 className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    Edit Komponen, Sub Komponen & Kriteria LKE
                  </h3>
                  <p className="text-[11px] text-blue-100">
                    Lembar Kerja Evaluasi SAKIP · Kode: {editingLKE.kode || 'LKE'} (No Urut: {editingLKE.noUrut || '-'})
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingLKE(null)}
                className="p-1.5 text-blue-100 hover:text-white hover:bg-white/10 rounded-lg cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleLKEEditSubmit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
              {/* Field Komponen, Sub Komponen, Kriteria & Parameter */}
              <div className="space-y-3 p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="font-bold text-slate-800 text-xs flex items-center justify-between">
                  <span>Data Komponen / Sub Komponen / Kriteria</span>
                  <span className="text-[10px] text-blue-600 font-semibold">Dapat diedit langsung</span>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Nama Komponen Utama
                  </label>
                  <input
                    type="text"
                    list="komponen-options"
                    value={lkeKomponen}
                    onChange={(e) => setLkeKomponen(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-900 font-semibold bg-white"
                    placeholder="Contoh: PERENCANAAN KINERJA"
                    required
                  />
                  <datalist id="komponen-options">
                    <option value="PERENCANAAN KINERJA" />
                    <option value="PENGUKURAN KINERJA" />
                    <option value="PELAPORAN KINERJA" />
                    <option value="EVALUASI AKUNTABILITAS KINERJA INTERNAL" />
                  </datalist>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Sub Komponen
                  </label>
                  <input
                    type="text"
                    value={lkeSubkomponen}
                    onChange={(e) => setLkeSubkomponen(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-900 bg-white"
                    placeholder="Contoh: 1.a Dokumen Perencanaan kinerja telah tersedia"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Kriteria Evaluasi
                  </label>
                  <input
                    type="text"
                    value={lkeKriteria}
                    onChange={(e) => setLkeKriteria(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-900 bg-white font-medium"
                    placeholder="Contoh: Pedoman Teknis Perencanaan Kinerja"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Parameter & Indikator Uji
                  </label>
                  <textarea
                    rows={2}
                    value={lkeParameter}
                    onChange={(e) => setLkeParameter(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-900 bg-white resize-none"
                    placeholder="Contoh: Terdapat pedoman teknis perencanaan kinerja."
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Bobot (%)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={lkeBobot}
                      onChange={(e) => setLkeBobot(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-slate-900 font-mono font-semibold bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Unit/Satker Jawaban
                    </label>
                    <input
                      type="text"
                      value={lkeUnitJawaban}
                      onChange={(e) => setLkeUnitJawaban(e.target.value)}
                      placeholder="BB, A, B, CC, C"
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-slate-900 font-bold bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Unit/Satker Nilai
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={lkeUnitNilai !== undefined ? lkeUnitNilai : ''}
                      onChange={(e) => setLkeUnitNilai(e.target.value ? Number(e.target.value) : undefined)}
                      placeholder="Nilai Satker"
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-slate-900 font-mono font-bold text-blue-700 bg-white"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Nilai Skor (0 - 100)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={lkeNilai}
                    onChange={(e) => setLkeNilai(Number(e.target.value))}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-900 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Status Dokumen Eviden
                  </label>
                  <select
                    value={lkeStatusDukung}
                    onChange={(e) => setLkeStatusDukung(e.target.value as any)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-900"
                  >
                    <option value="Lengkap">Lengkap</option>
                    <option value="Perlu Perbaikan">Perlu Perbaikan</option>
                    <option value="Belum Lengkap">Belum Lengkap</option>
                  </select>
                </div>
              </div>

              {/* Unggah Dokumen Eviden Langsung */}
              <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-blue-950 text-xs flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5 text-blue-600" />
                    <span>Upload File Dokumen Eviden (.pdf, .xlsx, .docx, .zip)</span>
                  </label>
                  {lkeUploadedFileName && (
                    <button
                      type="button"
                      onClick={() => {
                        setLkeUploadedFileName(undefined);
                        setLkeUploadedFileSize(undefined);
                        setLkeUploadedFileType(undefined);
                        setLkeUploadedFileDataUrl(undefined);
                      }}
                      className="text-[10px] text-red-600 hover:underline cursor-pointer"
                    >
                      Hapus Berkas
                    </button>
                  )}
                </div>

                {lkeUploadedFileName ? (
                  <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-blue-200 text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                      <div className="min-w-0">
                        <div className="font-semibold text-slate-900 truncate max-w-[240px]">{lkeUploadedFileName}</div>
                        <div className="text-[10px] text-slate-400">{lkeUploadedFileSize || 'Berkas Terlampir'}</div>
                      </div>
                    </div>
                    <label className="text-[10px] text-blue-600 font-semibold hover:underline cursor-pointer px-2 py-1 bg-blue-50 rounded">
                      Ganti
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.zip"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (!f) return;
                          const r = new FileReader();
                          r.onload = () => {
                            setLkeUploadedFileName(f.name);
                            setLkeUploadedFileSize(f.size > 1024*1024 ? `${(f.size/(1024*1024)).toFixed(1)} MB` : `${Math.round(f.size/1024)} KB`);
                            setLkeUploadedFileType(f.name.split('.').pop()?.toLowerCase() || 'pdf');
                            setLkeUploadedFileDataUrl(r.result as string);
                            setLkeStatusDukung('Lengkap');
                          };
                          r.readAsDataURL(f);
                        }}
                      />
                    </label>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center p-3.5 bg-white border-2 border-dashed border-blue-200 hover:border-blue-400 rounded-lg cursor-pointer transition-colors text-center group">
                    <Upload className="w-5 h-5 text-blue-500 mb-1 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-semibold text-slate-700">Pilih Berkas Dokumen Eviden</span>
                    <span className="text-[10px] text-slate-400 mt-0.5">Format: PDF, Excel (.xlsx), Word (.docx), ZIP (Maks 15MB)</span>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.zip"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (!f) return;
                        const r = new FileReader();
                        r.onload = () => {
                          setLkeUploadedFileName(f.name);
                          setLkeUploadedFileSize(f.size > 1024*1024 ? `${(f.size/(1024*1024)).toFixed(1)} MB` : `${Math.round(f.size/1024)} KB`);
                          setLkeUploadedFileType(f.name.split('.').pop()?.toLowerCase() || 'pdf');
                          setLkeUploadedFileDataUrl(r.result as string);
                          setLkeStatusDukung('Lengkap');
                        };
                        r.readAsDataURL(f);
                      }}
                    />
                  </label>
                )}
              </div>

              {/* Tautan Dokumen SAKIP Internal */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Pilih Dokumen SAKIP Internal (Opsional)</span>
                  <span className="text-[10px] text-slate-500 font-normal">Dapat dipratinjau langsung di aplikasi</span>
                </label>
                <select
                  value={lkeTautanDokumenId}
                  onChange={(e) => setLkeTautanDokumenId(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-900 text-xs"
                >
                  <option value="">-- Pilih dari Berkas Dokumen SAKIP --</option>
                  {documents.map((doc) => (
                    <option key={doc.id} value={doc.id}>
                      [{doc.kategori}] {doc.title} ({doc.fileName})
                    </option>
                  ))}
                </select>
              </div>

              {/* Link Evidence External / URL */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Link Evidence (URL / Tautan Bukti Digital)</span>
                  <span className="text-[10px] text-slate-500 font-normal">Google Drive, Cloud Storage, atau Website</span>
                </label>
                <div className="relative">
                  <input
                    type="url"
                    placeholder="https://drive.google.com/... atau https://transnaker.luwuutarakab.go.id/..."
                    value={lkeLinkEvidence}
                    onChange={(e) => setLkeLinkEvidence(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 border border-slate-300 rounded-lg text-slate-900 font-mono text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <LinkIcon className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Catatan Evaluator
                </label>
                <textarea
                  rows={2}
                  value={lkeCatatan}
                  onChange={(e) => setLkeCatatan(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-900 resize-none"
                />
              </div>

              <div className="pt-2 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingLKE(null)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold"
                >
                  Simpan Perubahan LKE
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Upload Dokumen Evidence Data LKE */}
      {uploadLKEModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden border border-slate-200 text-xs animate-in fade-in zoom-in-95 duration-150 my-6">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-blue-700 to-indigo-800 text-white">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-white/10 rounded-lg">
                  <UploadCloud className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold">
                    Upload Dokumen Evidence LKE SAKIP
                  </h3>
                  <p className="text-[11px] text-blue-100">
                    Daftar Parameter dan Indikator Uji LKE SAKIP 2026
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setUploadLKEModalOpen(false)}
                className="p-1.5 text-blue-100 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadLKEOk} className="p-5 space-y-4">
              {/* Target Parameter Selector */}
              <div>
                <label className="block font-bold text-slate-800 mb-1.5 flex items-center justify-between">
                  <span>Pilih Parameter / Indikator Uji LKE <span className="text-red-500">*</span></span>
                  <span className="text-[10px] text-slate-500 font-normal">Pilih butir yang akan dilampirkan eviden</span>
                </label>
                <select
                  value={selectedLKEForUploadId}
                  onChange={(e) => {
                    const found = lkeItems.find(i => i.id === e.target.value);
                    if (found) {
                      setSelectedLKEForUploadId(found.id);
                      setModalLKELink(found.linkEvidence || '');
                      setModalLKETautanDocId(found.tautanDokumenId || '');
                      setModalLKEStatus(found.statusDukung);
                      setModalLKECatatan(found.catatanEvaluator || '');
                    }
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 bg-white font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                >
                  {lkeItems.map((item) => (
                    <option key={item.id} value={item.id}>
                      [{item.komponen}] {item.kriteria} - {item.parameter}
                    </option>
                  ))}
                </select>

                {(() => {
                  const target = lkeItems.find(i => i.id === selectedLKEForUploadId);
                  if (!target) return null;
                  return (
                    <div className="mt-2 p-2.5 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-semibold text-slate-700">Komponen: {target.komponen} ({target.subkomponen})</span>
                        <span className="font-bold text-blue-700">Bobot: {target.bobot}% | Skor: {target.nilai}</span>
                      </div>
                      <div className="text-[11px] text-slate-600">
                        <strong>Dokumen Terkait Wajib:</strong> {target.dokumenTerkait.join(', ')}
                      </div>
                      {target.uploadedFileName && (
                        <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-semibold pt-1 border-t border-slate-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>Berkas saat ini: {target.uploadedFileName} ({target.uploadedFileSize || 'Ada'})</span>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>

              {/* Unggah Berkas Digital (File Upload) */}
              <div className="p-3.5 bg-blue-50/50 rounded-xl border border-blue-200 space-y-2.5">
                <label className="block font-bold text-blue-950 text-xs flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Upload className="w-4 h-4 text-blue-600" />
                    <span>Upload Berkas Evidence Fisik</span>
                  </span>
                  <span className="text-[10px] text-blue-600 font-normal">Format: PDF, XLSX, DOCX, ZIP (Maks 15 MB)</span>
                </label>

                {modalLKEFile ? (
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-300 shadow-2xs">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <FileText className="w-5 h-5 text-blue-600 shrink-0" />
                      <div className="min-w-0">
                        <div className="font-bold text-slate-900 truncate max-w-[320px]">{modalLKEFile.name}</div>
                        <div className="text-[10px] text-slate-400">
                          {modalLKEFile.size > 1024*1024 ? `${(modalLKEFile.size/(1024*1024)).toFixed(1)} MB` : `${Math.round(modalLKEFile.size/1024)} KB`} · Siap diunggah
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setModalLKEFile(null)}
                      className="px-2 py-1 text-[11px] text-red-600 hover:bg-red-50 rounded font-semibold transition-colors cursor-pointer"
                    >
                      Batal Pilih
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center p-5 bg-white border-2 border-dashed border-blue-300 hover:border-blue-500 rounded-xl cursor-pointer transition-all text-center group shadow-2xs">
                    <div className="p-2.5 bg-blue-50 rounded-full mb-2 group-hover:scale-110 transition-transform">
                      <UploadCloud className="w-6 h-6 text-blue-600" />
                    </div>
                    <span className="text-xs font-bold text-slate-800">Klik untuk Pilih Berkas atau Seret ke Sini</span>
                    <span className="text-[11px] text-slate-500 mt-0.5">Mendukung dokumen resmi: *.pdf, *.xlsx, *.xls, *.docx, *.zip</span>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.zip"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) {
                          setModalLKEFile(f);
                          setModalLKEStatus('Lengkap');
                        }
                      }}
                    />
                  </label>
                )}
              </div>

              {/* Status Pemenuhan Eviden */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Status Pemenuhan Eviden
                  </label>
                  <select
                    value={modalLKEStatus}
                    onChange={(e) => setModalLKEStatus(e.target.value as any)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-900 bg-white"
                  >
                    <option value="Lengkap">✓ Lengkap Terunggah</option>
                    <option value="Perlu Perbaikan">⚠ Perlu Perbaikan</option>
                    <option value="Belum Lengkap">✕ Belum Lengkap</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Tautkan ke Dokumen SAKIP Internal
                  </label>
                  <select
                    value={modalLKETautanDocId}
                    onChange={(e) => setModalLKETautanDocId(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-900 bg-white"
                  >
                    <option value="">-- Tanpa Tautan Arsip --</option>
                    {documents.map((doc) => (
                      <option key={doc.id} value={doc.id}>
                        [{doc.kategori}] {doc.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Link Evidence External */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Link Evidence Digital (URL External)</span>
                  <span className="text-[10px] text-slate-400 font-normal">Google Drive, Cloud Storage, atau Portal Pemkab</span>
                </label>
                <div className="relative">
                  <input
                    type="url"
                    placeholder="https://drive.google.com/... atau https://transnaker.luwuutarakab.go.id/..."
                    value={modalLKELink}
                    onChange={(e) => setModalLKELink(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded-lg text-slate-900 font-mono text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <LinkIcon className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                </div>
              </div>

              {/* Catatan Evaluator */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Catatan / Uraian Eviden
                </label>
                <textarea
                  rows={2}
                  value={modalLKECatatan}
                  onChange={(e) => setModalLKECatatan(e.target.value)}
                  placeholder="Contoh: Telah diverifikasi kesesuaian dokumen dengan target Renstra..."
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-900 resize-none text-xs"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">
                  Data otomatis tersinkronisasi ke rekapitulasi penilaian.
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setUploadLKEModalOpen(false)}
                    className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-semibold cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-bold shadow-xs cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Simpan & Upload Evidence</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Upload Dokumen Evidence KKE PD */}
      {uploadKKEModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden border border-slate-200 text-xs animate-in fade-in zoom-in-95 duration-150 my-6">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-blue-700 to-indigo-800 text-white">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-white/10 rounded-lg">
                  <UploadCloud className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold">
                    Upload Dokumen Evidence KKE PD
                  </h3>
                  <p className="text-[11px] text-blue-100">
                    Instrumen Kertas Kerja Evaluasi Perangkat Daerah SAKIP 2026
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setUploadKKEModalOpen(false)}
                className="p-1.5 text-blue-100 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadKKEOk} className="p-5 space-y-4">
              {/* Target KKE PD Selector */}
              <div>
                <label className="block font-bold text-slate-800 mb-1.5 flex items-center justify-between">
                  <span>Pilih Butir Instrumen KKE PD <span className="text-red-500">*</span></span>
                  <span className="text-[10px] text-slate-500 font-normal">Pilih indikator yang akan diunggah bukti dukung</span>
                </label>
                <select
                  value={selectedKKEForUploadId}
                  onChange={(e) => {
                    const found = kkePdItems.find(i => i.id === e.target.value);
                    if (found) {
                      setSelectedKKEForUploadId(found.id);
                      setModalKKELink(found.linkEvidence || '');
                      setModalKKETautanDocId(found.tautanDokumenId || '');
                      setModalKKEPilihan(found.pilihan);
                      setModalKKECatatan(found.catatanTimSAKIP || '');
                      setModalKKERekomendasi(found.rekomendasiPerbaikan || '');
                    }
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 bg-white font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                >
                  {kkePdItems.map((item) => (
                    <option key={item.id} value={item.id}>
                      [{item.kode}] {item.aspek} - {item.indikator}
                    </option>
                  ))}
                </select>

                {(() => {
                  const target = kkePdItems.find(i => i.id === selectedKKEForUploadId);
                  if (!target) return null;
                  return (
                    <div className="mt-2 p-2.5 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-semibold text-slate-700">Kode: {target.kode} | Aspek: {target.aspek}</span>
                        <span className="font-bold text-blue-700">Pilihan: {target.pilihan} (Skor: {target.skor})</span>
                      </div>
                      <div className="text-[11px] text-slate-600">
                        <strong>Pertanyaan Evaluasi:</strong> {target.pertanyaan}
                      </div>
                      <div className="text-[11px] text-slate-600">
                        <strong>Kriteria Data Dukung:</strong> {target.dataDukungDiunggah}
                      </div>
                      {target.uploadedFileName && (
                        <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-semibold pt-1 border-t border-slate-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>Berkas saat ini: {target.uploadedFileName} ({target.uploadedFileSize || 'Ada'})</span>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>

              {/* Unggah Berkas Physical Upload */}
              <div className="p-3.5 bg-blue-50/50 rounded-xl border border-blue-200 space-y-2.5">
                <label className="block font-bold text-blue-950 text-xs flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Upload className="w-4 h-4 text-blue-600" />
                    <span>Upload File Data Dukung KKE PD</span>
                  </span>
                  <span className="text-[10px] text-blue-600 font-normal">Format: PDF, Excel (.xlsx), Word, ZIP</span>
                </label>

                {modalKKEFile ? (
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-300 shadow-2xs">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <FileText className="w-5 h-5 text-blue-600 shrink-0" />
                      <div className="min-w-0">
                        <div className="font-bold text-slate-900 truncate max-w-[320px]">{modalKKEFile.name}</div>
                        <div className="text-[10px] text-slate-400">
                          {modalKKEFile.size > 1024*1024 ? `${(modalKKEFile.size/(1024*1024)).toFixed(1)} MB` : `${Math.round(modalKKEFile.size/1024)} KB`} · Siap diunggah
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setModalKKEFile(null)}
                      className="px-2 py-1 text-[11px] text-red-600 hover:bg-red-50 rounded font-semibold transition-colors cursor-pointer"
                    >
                      Batal Pilih
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center p-5 bg-white border-2 border-dashed border-blue-300 hover:border-blue-500 rounded-xl cursor-pointer transition-all text-center group shadow-2xs">
                    <div className="p-2.5 bg-blue-50 rounded-full mb-2 group-hover:scale-110 transition-transform">
                      <UploadCloud className="w-6 h-6 text-blue-600" />
                    </div>
                    <span className="text-xs font-bold text-slate-800">Klik untuk Pilih Berkas Data Dukung atau Seret ke Sini</span>
                    <span className="text-[11px] text-slate-500 mt-0.5">Format dokumen pendukung: PDF (*.pdf), Excel (*.xlsx), Word (*.docx), ZIP</span>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.zip"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) {
                          setModalKKEFile(f);
                        }
                      }}
                    />
                  </label>
                )}
              </div>

              {/* Pilihan Pemenuhan Kriteria (A, B, C, D, E) */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  Pilihan Pemenuhan Kriteria (Evaluasi Mandiri)
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {[
                    { val: 'A', skor: 90, label: 'A (90)' },
                    { val: 'B', skor: 80, label: 'B (80)' },
                    { val: 'C', skor: 65, label: 'C (65)' },
                    { val: 'D', skor: 50, label: 'D (50)' },
                    { val: 'E', skor: 30, label: 'E (30)' },
                  ].map((opt) => (
                    <label
                      key={opt.val}
                      className={`flex flex-col items-center p-2 rounded-lg border cursor-pointer transition-all text-center ${
                        modalKKEPilihan === opt.val
                          ? 'bg-blue-600 text-white border-blue-600 font-bold shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="modalKKEPilihan"
                        value={opt.val}
                        checked={modalKKEPilihan === opt.val}
                        onChange={() => setModalKKEPilihan(opt.val as any)}
                        className="hidden"
                      />
                      <span className="text-sm font-bold">{opt.val}</span>
                      <span className="text-[10px] opacity-80">Skor {opt.skor}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Link Evidence & Tautan Dokumen */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Tautkan ke Dokumen SAKIP
                  </label>
                  <select
                    value={modalKKETautanDocId}
                    onChange={(e) => setModalKKETautanDocId(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-900 bg-white"
                  >
                    <option value="">-- Tanpa Tautan Arsip --</option>
                    {documents.map((doc) => (
                      <option key={doc.id} value={doc.id}>
                        [{doc.kategori}] {doc.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Link Evidence Digital (Google Drive / Web)
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      placeholder="https://drive.google.com/..."
                      value={modalKKELink}
                      onChange={(e) => setModalKKELink(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 border border-slate-300 rounded-lg text-slate-900 font-mono text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                    <LinkIcon className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  </div>
                </div>
              </div>

              {/* Catatan & Rekomendasi */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Catatan Tim SAKIP
                  </label>
                  <textarea
                    rows={2}
                    value={modalKKECatatan}
                    onChange={(e) => setModalKKECatatan(e.target.value)}
                    placeholder="Catatan verifikasi eviden..."
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-900 resize-none text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Rekomendasi Tindak Lanjut
                  </label>
                  <textarea
                    rows={2}
                    value={modalKKERekomendasi}
                    onChange={(e) => setModalKKERekomendasi(e.target.value)}
                    placeholder="Rekomendasi peningkatan nilai..."
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-900 resize-none text-xs"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">
                  Data otomatis tersinkronisasi ke instrumen KKE PD.
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setUploadKKEModalOpen(false)}
                    className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-semibold cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-bold shadow-xs cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Simpan & Upload Evidence</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
