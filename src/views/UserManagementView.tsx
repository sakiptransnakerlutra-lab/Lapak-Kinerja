import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Trash2, 
  Edit3,
  ShieldCheck, 
  Shield, 
  Mail, 
  Lock, 
  Building2, 
  CheckCircle2, 
  AlertCircle,
  X,
  Eye,
  EyeOff,
  Copy,
  Check,
  KeyRound,
  Search,
  Filter,
  RefreshCw,
  Sparkles,
  ShieldAlert,
  User as UserIcon
} from 'lucide-react';
import { User, STRUKTUR_ORGANISASI_TRANSNAKER } from '../types';
import { StorageService } from '../services/storage';

interface UserManagementViewProps {
  currentUser: User | null;
  onRefreshUsers?: () => void;
}

export const UserManagementView: React.FC<UserManagementViewProps> = ({
  currentUser,
}) => {
  const [users, setUsers] = useState<User[]>(() => StorageService.getAllUsers());
  
  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBidang, setSelectedBidang] = useState<string>('all');
  
  // Password visibility controls
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});
  const [showAllPasswords, setShowAllPasswords] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Modal states (Add & Edit)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Form states
  const [formUserId, setFormUserId] = useState('');
  const [formPassword, setFormPassword] = useState('operator123');
  const [formShowPassword, setFormShowPassword] = useState(true);
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formBidang, setFormBidang] = useState<string>(STRUKTUR_ORGANISASI_TRANSNAKER[0].nama);
  const [formNip, setFormNip] = useState('');
  const [formRole, setFormRole] = useState<'operator' | 'admin'>('operator');

  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const refreshList = () => {
    setUsers(StorageService.getAllUsers());
  };

  const togglePasswordVisibility = (userId: string) => {
    setVisiblePasswords(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleOpenAdd = () => {
    setEditingUser(null);
    setFormUserId(`op_${Date.now().toString().slice(-4)}`);
    setFormPassword('operator123');
    setFormShowPassword(true);
    setFormName('');
    setFormEmail('');
    setFormBidang(STRUKTUR_ORGANISASI_TRANSNAKER[0].nama);
    setFormNip('');
    setFormRole('operator');
    setMessage(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user: User) => {
    setEditingUser(user);
    setFormUserId(user.userId || user.email.split('@')[0]);
    setFormPassword(user.password || 'operator123');
    setFormShowPassword(true);
    setFormName(user.name);
    setFormEmail(user.email);
    setFormBidang(user.bidang);
    setFormNip(user.nip || '');
    setFormRole(user.role);
    setMessage(null);
    setIsModalOpen(true);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    const cleanUserId = formUserId.trim().toLowerCase().replace(/\s+/g, '_');
    const cleanPassword = formPassword.trim();
    const cleanName = formName.trim();
    const cleanEmail = formEmail.trim().toLowerCase();

    if (!cleanUserId || !cleanPassword || !cleanName || !cleanEmail) {
      setMessage({ text: 'Harap lengkapi User ID, Kata Sandi, Nama Lengkap, dan Email.', type: 'error' });
      return;
    }

    if (editingUser) {
      // Update existing user
      const res = StorageService.updateOperator({
        id: editingUser.id,
        userId: cleanUserId,
        password: cleanPassword,
        name: cleanName,
        email: cleanEmail,
        bidang: formBidang,
        nip: formNip.trim(),
        role: formRole,
      });

      if (res.success) {
        setMessage({ text: res.message, type: 'success' });
        refreshList();
        setTimeout(() => {
          setIsModalOpen(false);
          setMessage(null);
        }, 800);
      } else {
        setMessage({ text: res.message, type: 'error' });
      }
    } else {
      // Create new user
      const res = StorageService.createOperator({
        userId: cleanUserId,
        password: cleanPassword,
        name: cleanName,
        email: cleanEmail,
        bidang: formBidang,
        nip: formNip.trim(),
        role: formRole,
      });

      if (res.success) {
        setMessage({ text: res.message, type: 'success' });
        refreshList();
        setTimeout(() => {
          setIsModalOpen(false);
          setMessage(null);
        }, 800);
      } else {
        setMessage({ text: res.message, type: 'error' });
      }
    }
  };

  const handleDeleteUser = (userId: string, userName: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus akun operator "${userName}"?`)) {
      const res = StorageService.deleteUser(userId);
      if (res.success) {
        refreshList();
      } else {
        alert(res.message);
      }
    }
  };

  // Filtered users
  const filteredUsers = users.filter((u) => {
    const matchBidang = selectedBidang === 'all' || u.bidang === selectedBidang;
    const q = searchQuery.toLowerCase();
    const matchSearch = 
      searchQuery === '' ||
      u.name.toLowerCase().includes(q) ||
      u.userId.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.nip && u.nip.toLowerCase().includes(q)) ||
      u.bidang.toLowerCase().includes(q);

    return matchBidang && matchSearch;
  });

  if (currentUser?.role !== 'admin') {
    return (
      <div className="bg-white p-8 rounded-xl border border-red-200 text-center max-w-lg mx-auto my-12 shadow-2xs">
        <div className="w-14 h-14 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
          <ShieldAlert className="w-7 h-7" />
        </div>
        <h3 className="text-base font-bold text-slate-900 mb-1">
          Akses Ditolak - Khusus Administrator
        </h3>
        <p className="text-xs text-slate-600 mb-2 leading-relaxed">
          Fitur <strong>Kelola Operator</strong> hanya dapat diakses oleh akun dengan hak akses <strong>Administrator SAKIP</strong> Dinas Transmigrasi dan Tenaga Kerja.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 uppercase tracking-wider">
            <Users className="w-4 h-4" />
            <span>Manajemen Akses & Akun Operator</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 mt-1">
            Kelola Akun Operator Dinas Transnaker
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Admin memegang otoritas penuh untuk menambahkan, mengedit, melihat User ID, serta menetapkan kata sandi operator bidang.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={refreshList}
            className="p-2 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            title="Muat Ulang Data Pengguna"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          
          <button
            type="button"
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors shrink-0 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Tambah Operator Baru</span>
          </button>
        </div>
      </div>

      {/* Structure Card Grid */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-blue-700" />
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Sebaran Operator 5 Unit Kerja Dinas Transnaker Luwu Utara
            </h3>
          </div>
          <span className="text-[11px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-semibold">
            {users.length} Akun Terdaftar
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
          {STRUKTUR_ORGANISASI_TRANSNAKER.map((unit) => {
            const operatorCount = users.filter((u) => u.bidang === unit.nama).length;
            return (
              <div
                key={unit.nama}
                className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] text-blue-700 font-bold mb-1">
                    <span>{unit.kode}</span>
                    <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded text-[10px]">
                      {unit.singkatan}
                    </span>
                  </div>
                  <h4 className="font-semibold text-slate-900 text-xs mb-1 leading-snug">
                    {unit.nama}
                  </h4>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mb-2">
                    {unit.tugasPokok}
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">Operator:</span>
                  <span className={`font-bold ${operatorCount > 0 ? 'text-emerald-700' : 'text-amber-600'}`}>
                    {operatorCount} Personel
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        
        {/* Table Filters & Password Controls */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
          <div className="flex flex-wrap items-center gap-2 flex-1">
            {/* Search Input */}
            <div className="relative min-w-[220px]">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama, User ID, email, NIP..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-500"
              />
            </div>

            {/* Filter Unit Kerja */}
            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={selectedBidang}
                onChange={(e) => setSelectedBidang(e.target.value)}
                className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs focus:outline-hidden focus:border-blue-500 font-medium"
              >
                <option value="all">Semua Unit Kerja</option>
                {STRUKTUR_ORGANISASI_TRANSNAKER.map((unit) => (
                  <option key={unit.nama} value={unit.nama}>
                    {unit.singkatan} - {unit.nama}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Toggle All Passwords View */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setShowAllPasswords(!showAllPasswords)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                showAllPasswords
                  ? 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
              }`}
            >
              {showAllPasswords ? (
                <>
                  <EyeOff className="w-3.5 h-3.5 text-amber-600" />
                  <span>Sembunyikan Semua Password</span>
                </>
              ) : (
                <>
                  <Eye className="w-3.5 h-3.5 text-slate-500" />
                  <span>Tampilkan Semua Password</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100/80 text-slate-700 font-semibold border-b border-slate-200">
                <th className="py-3 px-4 border-r border-slate-200 min-w-[200px]">Nama Operator & NIP</th>
                <th className="py-3 px-3 border-r border-slate-200 w-36 bg-blue-50/50 text-blue-900">
                  <div className="flex items-center gap-1">
                    <UserIcon className="w-3.5 h-3.5 text-blue-600" />
                    <span>User ID (Login)</span>
                  </div>
                </th>
                <th className="py-3 px-3 border-r border-slate-200 w-44 bg-amber-50/40 text-amber-900">
                  <div className="flex items-center gap-1">
                    <KeyRound className="w-3.5 h-3.5 text-amber-600" />
                    <span>Kata Sandi (Password)</span>
                  </div>
                </th>
                <th className="py-3 px-4 border-r border-slate-200 min-w-[180px]">Email Kedinasan</th>
                <th className="py-3 px-4 border-r border-slate-200 min-w-[200px]">Unit / Bidang Kerja</th>
                <th className="py-3 px-3 text-center border-r border-slate-200 w-28">Hak Akses</th>
                <th className="py-3 px-3 text-center w-24">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    Tidak ada akun pengguna yang sesuai dengan pencarian atau filter.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const isCurrent = currentUser?.id === u.id;
                  const isPasswordVisible = showAllPasswords || Boolean(visiblePasswords[u.id]);
                  const rawPassword = u.password || 'operator123';

                  return (
                    <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Name & NIP */}
                      <td className="py-3 px-4 border-r border-slate-200">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs shrink-0 border border-blue-200">
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                              <span>{u.name}</span>
                              {isCurrent && (
                                <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.2 rounded font-mono font-medium">
                                  (Anda)
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400 font-mono">
                              NIP: {u.nip && u.nip !== '-' ? u.nip : 'Belum diisi'}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* User ID (Login) */}
                      <td className="py-3 px-3 border-r border-slate-200 bg-blue-50/20">
                        <div className="flex items-center justify-between gap-1.5">
                          <span className="font-mono font-bold text-blue-900 bg-blue-100/70 px-2 py-0.5 rounded text-xs">
                            {u.userId}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopy(u.userId, `uid-${u.id}`)}
                            className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors cursor-pointer"
                            title="Salin User ID"
                          >
                            {copiedId === `uid-${u.id}` ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Password */}
                      <td className="py-3 px-3 border-r border-slate-200 bg-amber-50/15">
                        <div className="flex items-center justify-between gap-1">
                          <div className="font-mono text-xs font-bold text-slate-800 tracking-wider">
                            {isPasswordVisible ? (
                              <span className="text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded">
                                {rawPassword}
                              </span>
                            ) : (
                              <span className="text-slate-400 select-none">
                                ••••••••••
                              </span>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-0.5">
                            {/* Toggle single view */}
                            <button
                              type="button"
                              onClick={() => togglePasswordVisibility(u.id)}
                              className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                              title={isPasswordVisible ? 'Sembunyikan Password' : 'Lihat Password'}
                            >
                              {isPasswordVisible ? (
                                <EyeOff className="w-3.5 h-3.5 text-slate-600" />
                              ) : (
                                <Eye className="w-3.5 h-3.5" />
                              )}
                            </button>

                            {/* Copy password */}
                            <button
                              type="button"
                              onClick={() => handleCopy(rawPassword, `pass-${u.id}`)}
                              className="p-1 text-slate-400 hover:text-amber-700 hover:bg-amber-50 rounded transition-colors cursor-pointer"
                              title="Salin Kata Sandi"
                            >
                              {copiedId === `pass-${u.id}` ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="py-3 px-4 border-r border-slate-200 font-mono text-slate-700">
                        {u.email}
                      </td>

                      {/* Bidang Kerja */}
                      <td className="py-3 px-4 border-r border-slate-200 text-slate-800 font-medium">
                        {u.bidang}
                      </td>

                      {/* Role */}
                      <td className="py-3 px-3 text-center border-r border-slate-200">
                        <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
                          u.role === 'admin'
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                        }`}>
                          {u.role === 'admin' ? (
                            <ShieldCheck className="w-3 h-3 text-amber-700" />
                          ) : (
                            <Shield className="w-3 h-3 text-emerald-700" />
                          )}
                          <span>{u.role === 'admin' ? 'Admin' : 'Operator'}</span>
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(u)}
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors cursor-pointer"
                            title="Edit User ID & Kata Sandi Operator"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          {!isCurrent && (
                            <button
                              type="button"
                              onClick={() => handleDeleteUser(u.id, u.name)}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                              title="Hapus Akun Pengguna"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info note */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>
              Operator dapat login menggunakan <strong>User ID</strong> atau <strong>Email Kedinasan</strong> disertai kata sandi yang telah ditetapkan.
            </span>
          </div>
          <div className="font-mono text-slate-400">
            Total {filteredUsers.length} dari {users.length} operator
          </div>
        </div>
      </div>

      {/* Modal: Add or Edit Operator */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden border border-slate-200 text-xs animate-in fade-in zoom-in-95">
            <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-100 text-blue-700">
                  {editingUser ? <Edit3 className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {editingUser ? 'Edit Kredensial & Data Operator' : 'Tambah Akun Operator Baru'}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {editingUser ? `Perbarui User ID & Password untuk "${editingUser.name}"` : 'Tentukan User ID dan Password yang akan digunakan oleh operator.'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="p-5 space-y-4">
              {message && (
                <div className={`p-3 rounded-lg text-xs flex items-center gap-2 ${
                  message.type === 'success' 
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}>
                  {message.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  )}
                  <span>{message.text}</span>
                </div>
              )}

              {/* User ID & Password in Highlighted Box */}
              <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200/80 space-y-3">
                <div className="text-[11px] font-bold text-blue-900 uppercase tracking-wide flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-blue-600" />
                  <span>Kredensial Akses Login Operator</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* User ID */}
                  <div>
                    <label className="block font-semibold text-slate-800 mb-1">
                      User ID Login <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formUserId}
                      onChange={(e) => setFormUserId(e.target.value.toLowerCase().replace(/\s+/g, '_'))}
                      placeholder="Contoh: op_ptk atau hasriani"
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-900 font-mono font-bold text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                    <span className="text-[10px] text-slate-500 mt-0.5 block">Huruf kecil, angka, atau garis bawah</span>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block font-semibold text-slate-800 mb-1 flex items-center justify-between">
                      <span>Kata Sandi (Password) <span className="text-red-500">*</span></span>
                      <button
                        type="button"
                        onClick={() => setFormShowPassword(!formShowPassword)}
                        className="text-[10px] text-blue-600 hover:underline cursor-pointer"
                      >
                        {formShowPassword ? 'Sembunyikan' : 'Tampilkan'}
                      </button>
                    </label>
                    <div className="relative">
                      <input
                        type={formShowPassword ? 'text' : 'password'}
                        required
                        value={formPassword}
                        onChange={(e) => setFormPassword(e.target.value)}
                        placeholder="Minimal 6 karakter"
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-900 font-mono font-bold text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                    <span className="text-[10px] text-slate-500 mt-0.5 block">Akan ditampilkan kepada Admin untuk diserahkan ke operator</span>
                  </div>
                </div>
              </div>

              {/* Full Name & NIP */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Nama Lengkap Operator <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Contoh: Hasriani, S.Kom"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    NIP Pegawai (Opsional)
                  </label>
                  <input
                    type="text"
                    value={formNip}
                    onChange={(e) => setFormNip(e.target.value)}
                    placeholder="1992xxxx xxxxx"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-900 font-mono"
                  />
                </div>
              </div>

              {/* Email Kedinasan */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Email Kedinasan <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="nama@luwuutarakab.go.id"
                    className="w-full pl-9 pr-3 py-1.5 border border-slate-300 rounded-lg text-slate-900 font-mono"
                  />
                </div>
              </div>

              {/* Unit Kerja & Peran */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Unit / Bidang Kerja
                  </label>
                  <select
                    value={formBidang}
                    onChange={(e) => setFormBidang(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-slate-900 font-medium"
                  >
                    {STRUKTUR_ORGANISASI_TRANSNAKER.map((unit) => (
                      <option key={unit.nama} value={unit.nama}>
                        {unit.singkatan} - {unit.nama}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Hak Akses (Role)
                  </label>
                  <select
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-slate-900 font-semibold"
                  >
                    <option value="operator">Operator (Input & Edit Data)</option>
                    <option value="admin">Administrator (Kelola Penuh)</option>
                  </select>
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-bold shadow-xs cursor-pointer"
                >
                  {editingUser ? 'Simpan Perubahan' : 'Buat Akun Operator'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
