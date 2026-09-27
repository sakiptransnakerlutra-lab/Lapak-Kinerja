import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Trash2, 
  ShieldCheck, 
  Shield, 
  Mail, 
  Lock, 
  Building2, 
  CheckCircle2, 
  AlertCircle,
  X
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
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states for creating operator
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('operator123');
  const [bidang, setBidang] = useState<string>(STRUKTUR_ORGANISASI_TRANSNAKER[0].nama);
  const [nip, setNip] = useState('');
  const [role, setRole] = useState<'operator' | 'admin'>('operator');

  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const refreshList = () => {
    setUsers(StorageService.getAllUsers());
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!name || !email || !password) {
      setMessage({ text: 'Harap lengkapi semua bidang isian wajib.', type: 'error' });
      return;
    }

    const res = StorageService.createOperator({
      name,
      email,
      password,
      bidang,
      nip,
      role,
    });

    if (res.success) {
      setMessage({ text: res.message, type: 'success' });
      setName('');
      setEmail('');
      setPassword('operator123');
      setNip('');
      refreshList();
      setTimeout(() => {
        setIsModalOpen(false);
        setMessage(null);
      }, 1000);
    } else {
      setMessage({ text: res.message, type: 'error' });
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 uppercase tracking-wider">
            <Users className="w-4 h-4" />
            <span>Manajemen Akses & Hak Pengguna</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 mt-1">
            Daftar Akun Operator SAKIP Dinas Transnaker
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Admin dapat mendaftarkan operator bidang untuk menginput dan memperbarui data dukung SAKIP.
          </p>
        </div>

        <button
          onClick={() => {
            setMessage(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>Tambah Akun Operator</span>
        </button>
      </div>

      {/* Synchronized Organizational Structure Grid */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-blue-700" />
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Struktur Organisasi Terintegrasi Dinas Transmigrasi dan Tenaga Kerja Kabupaten Luwu Utara
            </h3>
          </div>
          <span className="text-[11px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-medium">
            5 Unit Kerja Resmi
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
                  <span className="text-slate-500">Operator Aktif:</span>
                  <span className={`font-bold ${operatorCount > 0 ? 'text-emerald-700' : 'text-amber-600'}`}>
                    {operatorCount} Personel
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 uppercase">
            Total Pengguna Terdaftar ({users.length})
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                <th className="py-3 px-4 border-r border-slate-200">Nama Pengguna & NIP</th>
                <th className="py-3 px-4 border-r border-slate-200">Email Kedinasan</th>
                <th className="py-3 px-4 border-r border-slate-200">Unit / Bidang Kerja</th>
                <th className="py-3 px-3 text-center border-r border-slate-200 w-28">Hak Akses</th>
                <th className="py-3 px-3 text-center border-r border-slate-200 w-28">Terdaftar</th>
                <th className="py-3 px-3 text-center w-20">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => {
                const isCurrent = currentUser?.id === u.id;
                return (
                  <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 border-r border-slate-200">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0 border border-slate-200">
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                            <span>{u.name}</span>
                            {isCurrent && (
                              <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.2 rounded font-mono">
                                (Anda)
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono">NIP: {u.nip || '-'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 border-r border-slate-200 font-mono text-slate-700">
                      {u.email}
                    </td>
                    <td className="py-3 px-4 border-r border-slate-200 text-slate-700">
                      {u.bidang}
                    </td>
                    <td className="py-3 px-3 text-center border-r border-slate-200">
                      <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                        u.role === 'admin'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      }`}>
                        {u.role === 'admin' ? (
                          <ShieldCheck className="w-3 h-3 text-amber-600" />
                        ) : (
                          <Shield className="w-3 h-3 text-emerald-600" />
                        )}
                        <span>{u.role === 'admin' ? 'Administrator' : 'Operator'}</span>
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center font-mono text-slate-500 border-r border-slate-200 text-[11px]">
                      {u.createdAt}
                    </td>
                    <td className="py-3 px-3 text-center">
                      {!isCurrent && (
                        <button
                          onClick={() => handleDeleteUser(u.id, u.name)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-slate-100 rounded transition-colors"
                          title="Hapus Akun Pengguna"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add Operator */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden border border-slate-200 text-xs">
            <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-blue-100 text-blue-700">
                  <UserPlus className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">
                  Buat Akun Operator Baru
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="p-5 space-y-3.5">
              {message && (
                <div className={`p-2.5 rounded-lg text-xs flex items-center gap-2 ${
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

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nama Lengkap Operator <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Hasriani, S.Kom"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Email Kedinasan <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@luwuutarakab.go.id"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    NIP (Nomor Induk Pegawai)
                  </label>
                  <input
                    type="text"
                    value={nip}
                    onChange={(e) => setNip(e.target.value)}
                    placeholder="1992xxxx xxxxx"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-900 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Unit / Bidang Kerja
                  </label>
                  <select
                    value={bidang}
                    onChange={(e) => setBidang(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-slate-900"
                  >
                    {STRUKTUR_ORGANISASI_TRANSNAKER.map((unit) => (
                      <option key={unit.nama} value={unit.nama}>
                        {unit.nama}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Peran (Role)
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-slate-900 font-semibold"
                  >
                    <option value="operator">Operator (Input & Edit Data)</option>
                    <option value="admin">Administrator (Kelola Penuh)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Kata Sandi Awal <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-900 font-mono"
                />
              </div>

              <div className="pt-2 border-t border-slate-100 flex justify-end gap-2">
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
                  Buat Akun Pengguna
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
