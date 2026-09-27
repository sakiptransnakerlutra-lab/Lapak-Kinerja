import { 
  User, 
  IKPItem, 
  IKKItem, 
  KomponenPenilaian, 
  LKEItem, 
  KKEPDItem, 
  SakipDocument 
} from '../types';
import { 
  INITIAL_USERS, 
  INITIAL_IKP, 
  INITIAL_IKK, 
  INITIAL_KOMPONEN_PENILAIAN, 
  INITIAL_LKE_ITEMS, 
  INITIAL_KKE_PD, 
  INITIAL_DOCUMENTS 
} from './initialData';

const KEYS = {
  CURRENT_USER: 'lapak_kinerja_current_user',
  USERS: 'lapak_kinerja_users',
  IKP: 'lapak_kinerja_ikp',
  IKK: 'lapak_kinerja_ikk',
  PENILAIAN: 'lapak_kinerja_penilaian',
  LKE: 'lapak_kinerja_lke',
  KKE_PD: 'lapak_kinerja_kke_pd',
  DOCUMENTS: 'lapak_kinerja_documents',
};

// Helper: safe JSON parse
function getItem<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw) as T;
  } catch (e) {
    console.error(`Error reading ${key} from storage:`, e);
    return defaultValue;
  }
}

function setItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error saving ${key} to storage:`, e);
  }
}

export const StorageService = {
  // Auth & User Management
  init(): void {
    if (!localStorage.getItem(KEYS.USERS)) {
      setItem(KEYS.USERS, INITIAL_USERS);
    }
    if (!localStorage.getItem(KEYS.IKP)) {
      setItem(KEYS.IKP, INITIAL_IKP);
    }
    if (!localStorage.getItem(KEYS.IKK)) {
      setItem(KEYS.IKK, INITIAL_IKK);
    }
    if (!localStorage.getItem(KEYS.PENILAIAN)) {
      setItem(KEYS.PENILAIAN, INITIAL_KOMPONEN_PENILAIAN);
    }
    if (!localStorage.getItem(KEYS.LKE)) {
      setItem(KEYS.LKE, INITIAL_LKE_ITEMS);
    }
    if (!localStorage.getItem(KEYS.KKE_PD)) {
      setItem(KEYS.KKE_PD, INITIAL_KKE_PD);
    }
    if (!localStorage.getItem(KEYS.DOCUMENTS)) {
      setItem(KEYS.DOCUMENTS, INITIAL_DOCUMENTS);
    }
  },

  getCurrentUser(): User | null {
    return getItem<User | null>(KEYS.CURRENT_USER, null);
  },

  setCurrentUser(user: User | null): void {
    setItem(KEYS.CURRENT_USER, user);
  },

  login(email: string, password: string): { success: boolean; message: string; user?: User } {
    this.init();
    const users = getItem<any[]>(KEYS.USERS, INITIAL_USERS);
    const normalizedEmail = email.trim().toLowerCase();
    const user = users.find(u => u.email.toLowerCase() === normalizedEmail);

    if (!user) {
      return { success: false, message: 'Email tidak terdaftar pada sistem LAPAK KINERJA.' };
    }

    if (user.passwordHash !== password) {
      return { success: false, message: 'Kata sandi tidak sesuai. Silakan coba kembali.' };
    }

    const authUser: User = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      bidang: user.bidang,
      nip: user.nip,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt,
    };

    this.setCurrentUser(authUser);
    return { success: true, message: 'Login berhasil!', user: authUser };
  },

  register(data: { name: string; email: string; password: string; bidang: string; nip?: string; role?: 'admin' | 'operator' }): { success: boolean; message: string; user?: User } {
    this.init();
    const users = getItem<any[]>(KEYS.USERS, INITIAL_USERS);
    const normalizedEmail = data.email.trim().toLowerCase();

    if (users.some(u => u.email.toLowerCase() === normalizedEmail)) {
      return { success: false, message: 'Email ini sudah terdaftar. Silakan gunakan email lain atau login.' };
    }

    const newUser = {
      id: 'user-' + Date.now(),
      name: data.name.trim(),
      email: normalizedEmail,
      passwordHash: data.password,
      role: data.role || 'operator',
      bidang: data.bidang || 'Sekretariat Dinas',
      nip: data.nip || '-',
      createdAt: new Date().toISOString().split('T')[0],
    };

    users.push(newUser);
    setItem(KEYS.USERS, users);

    const authUser: User = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      bidang: newUser.bidang,
      nip: newUser.nip,
      createdAt: newUser.createdAt,
    };

    this.setCurrentUser(authUser);
    return { success: true, message: 'Pendaftaran akun berhasil!', user: authUser };
  },

  logout(): void {
    localStorage.removeItem(KEYS.CURRENT_USER);
  },

  getAllUsers(): User[] {
    this.init();
    const users = getItem<any[]>(KEYS.USERS, INITIAL_USERS);
    return users.map(({ passwordHash, ...rest }) => rest);
  },

  createOperator(data: { name: string; email: string; password: string; bidang: string; nip?: string; role: 'admin' | 'operator' }): { success: boolean; message: string } {
    this.init();
    const users = getItem<any[]>(KEYS.USERS, INITIAL_USERS);
    if (users.some(u => u.email.toLowerCase() === data.email.trim().toLowerCase())) {
      return { success: false, message: 'Email sudah terdaftar.' };
    }

    const newUser = {
      id: 'user-' + Date.now(),
      name: data.name,
      email: data.email.trim().toLowerCase(),
      passwordHash: data.password || 'operator123',
      role: data.role,
      bidang: data.bidang,
      nip: data.nip || '-',
      createdAt: new Date().toISOString().split('T')[0],
    };

    users.push(newUser);
    setItem(KEYS.USERS, users);
    return { success: true, message: `Akun ${data.role === 'admin' ? 'Administrator' : 'Operator'} berhasil dibuat.` };
  },

  deleteUser(userId: string): { success: boolean; message: string } {
    const users = getItem<any[]>(KEYS.USERS, INITIAL_USERS);
    const currentUser = this.getCurrentUser();
    if (currentUser?.id === userId) {
      return { success: false, message: 'Tidak dapat menghapus akun yang sedang digunakan.' };
    }
    const filtered = users.filter(u => u.id !== userId);
    setItem(KEYS.USERS, filtered);
    return { success: true, message: 'Pengguna berhasil dihapus.' };
  },

  // IKP
  getIKP(): IKPItem[] {
    this.init();
    return getItem<IKPItem[]>(KEYS.IKP, INITIAL_IKP);
  },

  saveIKP(item: IKPItem): void {
    const list = this.getIKP();
    const idx = list.findIndex(i => i.id === item.id);
    if (idx >= 0) {
      list[idx] = item;
    } else {
      list.unshift(item);
    }
    setItem(KEYS.IKP, list);
  },

  deleteIKP(id: string): void {
    const list = this.getIKP().filter(i => i.id !== id);
    setItem(KEYS.IKP, list);
  },

  // IKK
  getIKK(): IKKItem[] {
    this.init();
    return getItem<IKKItem[]>(KEYS.IKK, INITIAL_IKK);
  },

  saveIKK(item: IKKItem): void {
    const list = this.getIKK();
    const idx = list.findIndex(i => i.id === item.id);
    if (idx >= 0) {
      list[idx] = item;
    } else {
      list.unshift(item);
    }
    setItem(KEYS.IKK, list);
  },

  deleteIKK(id: string): void {
    const list = this.getIKK().filter(i => i.id !== id);
    setItem(KEYS.IKK, list);
  },

  // Penilaian Mandiri
  getPenilaianMandiri(): KomponenPenilaian[] {
    this.init();
    return getItem<KomponenPenilaian[]>(KEYS.PENILAIAN, INITIAL_KOMPONEN_PENILAIAN);
  },

  savePenilaianMandiri(data: KomponenPenilaian[]): void {
    setItem(KEYS.PENILAIAN, data);
  },

  // LKE
  getLKEItems(): LKEItem[] {
    this.init();
    return getItem<LKEItem[]>(KEYS.LKE, INITIAL_LKE_ITEMS);
  },

  saveLKEItem(item: LKEItem): void {
    const list = this.getLKEItems();
    const idx = list.findIndex(i => i.id === item.id);
    if (idx >= 0) {
      list[idx] = item;
    } else {
      list.unshift(item);
    }
    setItem(KEYS.LKE, list);
  },

  deleteLKEItem(id: string): void {
    const list = this.getLKEItems().filter(i => i.id !== id);
    setItem(KEYS.LKE, list);
  },

  // KKE PD
  getKKEPD(): KKEPDItem[] {
    this.init();
    return getItem<KKEPDItem[]>(KEYS.KKE_PD, INITIAL_KKE_PD);
  },

  saveKKEPD(item: KKEPDItem): void {
    const list = this.getKKEPD();
    const idx = list.findIndex(i => i.id === item.id);
    if (idx >= 0) {
      list[idx] = item;
    } else {
      list.unshift(item);
    }
    setItem(KEYS.KKE_PD, list);
  },

  deleteKKEPD(id: string): void {
    const list = this.getKKEPD().filter(i => i.id !== id);
    setItem(KEYS.KKE_PD, list);
  },

  // Dokumen SAKIP
  getDocuments(): SakipDocument[] {
    this.init();
    return getItem<SakipDocument[]>(KEYS.DOCUMENTS, INITIAL_DOCUMENTS);
  },

  saveDocument(doc: SakipDocument): void {
    const list = this.getDocuments();
    const idx = list.findIndex(d => d.id === doc.id);
    if (idx >= 0) {
      list[idx] = doc;
    } else {
      list.unshift(doc);
    }
    setItem(KEYS.DOCUMENTS, list);
  },

  deleteDocument(id: string): void {
    const list = this.getDocuments().filter(d => d.id !== id);
    setItem(KEYS.DOCUMENTS, list);
  },

  // Reset to default data if needed
  resetDefaultData(): void {
    localStorage.setItem(KEYS.IKP, JSON.stringify(INITIAL_IKP));
    localStorage.setItem(KEYS.IKK, JSON.stringify(INITIAL_IKK));
    localStorage.setItem(KEYS.PENILAIAN, JSON.stringify(INITIAL_KOMPONEN_PENILAIAN));
    localStorage.setItem(KEYS.LKE, JSON.stringify(INITIAL_LKE_ITEMS));
    localStorage.setItem(KEYS.KKE_PD, JSON.stringify(INITIAL_KKE_PD));
    localStorage.setItem(KEYS.DOCUMENTS, JSON.stringify(INITIAL_DOCUMENTS));
  }
};
