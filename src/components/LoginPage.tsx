import React, { useState } from 'react';
import { 
  Lock, 
  Mail, 
  User, 
  Briefcase, 
  ArrowRight, 
  ShieldCheck, 
  KeyRound, 
  AlertCircle, 
  CheckCircle2, 
  Building2,
  FileCheck
} from 'lucide-react';
import { StorageService } from '../services/storage';
import { User as UserType, STRUKTUR_ORGANISASI_TRANSNAKER } from '../types';
import { AppLogo } from './AppLogo';
import kantorImg from '../assets/images/kantor_transnaker_lutra_1790478338052.jpg';

interface LoginPageProps {
  onLoginSuccess: (user: UserType) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regBidang, setRegBidang] = useState<string>(STRUKTUR_ORGANISASI_TRANSNAKER[0].nama);
  const [regNip, setRegNip] = useState('');
  const [regRole, setRegRole] = useState<'operator' | 'admin'>('operator');

  // Status feedback
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    setTimeout(() => {
      const res = StorageService.login(loginEmail, loginPassword);
      setLoading(false);
      if (res.success && res.user) {
        onLoginSuccess(res.user);
      } else {
        setErrorMsg(res.message);
      }
    }, 300);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!regName || !regEmail || !regPassword) {
      setErrorMsg('Harap lengkapi nama, email, dan kata sandi.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const res = StorageService.register({
        name: regName,
        email: regEmail,
        password: regPassword,
        bidang: regBidang,
        nip: regNip,
        role: regRole,
      });
      setLoading(false);
      if (res.success && res.user) {
        setSuccessMsg(res.message + ' Silakan masuk atau dialihkan otomatis...');
        setTimeout(() => {
          onLoginSuccess(res.user!);
        }, 800);
      } else {
        setErrorMsg(res.message);
      }
    }, 400);
  };

  // Quick Demo Logins
  const fillDemoAdmin = () => {
    setLoginEmail('sakip.transnakerlutra@gmail.com');
    setLoginPassword('admin123');
    setErrorMsg('');
  };

  const fillDemoOperator = () => {
    setLoginEmail('operator.transnaker@luwuutarakab.go.id');
    setLoginPassword('operator123');
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center relative overflow-hidden font-sans">
      {/* Background with slight overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={kantorImg} 
          alt="Kantor Dinas Transmigrasi dan Tenaga Kerja Luwu Utara" 
          className="w-full h-full object-cover opacity-20 filter blur-xs"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/85 to-slate-950/70" />
      </div>

      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Branding & Overview */}
          <div className="lg:col-span-6 space-y-6 text-slate-100">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
              <Building2 className="w-3.5 h-3.5" />
              <span>Pemerintah Kabupaten Luwu Utara</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-slate-900 border border-slate-800 p-1 shadow-lg shrink-0 flex items-center justify-center">
                <AppLogo size="lg" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                  LAPAK KINERJA
                </h1>
                <p className="text-xs sm:text-sm text-blue-300 font-medium">
                  Dinas Transmigrasi dan Tenaga Kerja Kabupaten Luwu Utara
                </p>
              </div>
            </div>

            <div className="border-l-2 border-blue-500 pl-4 py-1 text-slate-300 text-xs sm:text-sm leading-relaxed">
              <strong>“Layanan Pemantauan dan Akses Data Dukung Evaluasi Akuntabilitas Kinerja”</strong>
              <p className="mt-1 text-slate-400 text-xs">
                Aplikasi Pengelolaan Sistem Akuntabilitas Kinerja Instansi Pemerintah (SAKIP) yang terintegrasi untuk menyimpan, mengelola, mencari, dan mengarsipkan data dukung kinerja dinas.
              </p>
            </div>

            {/* SAKIP Highlight Badges */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 backdrop-blur-xs">
                <div className="flex items-center gap-2 text-blue-400 text-xs font-semibold">
                  <FileCheck className="w-4 h-4" />
                  <span>Data LKE & KKE PD</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Instrumen evaluasi mandiri berbasis PermenPAN-RB No 88/89.
                </p>
              </div>
              <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 backdrop-blur-xs">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Arsip Dokumen SAKIP</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Akses cepat unduh & cetak Renstra, IKU, PK, LKjIP, dan Monev.
                </p>
              </div>
            </div>

            {/* 5 Synchronized Units of Dinas Transnaker Luwu Utara */}
            <div className="pt-2">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-blue-400" />
                <span>Unit Kerja Terintegrasi (5 Bidang / Sekretariat)</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {STRUKTUR_ORGANISASI_TRANSNAKER.map((unit) => (
                  <div key={unit.nama} className="p-2 rounded-lg bg-slate-900/60 border border-slate-800/80 text-slate-300">
                    <span className="font-semibold text-blue-300 block text-[11px]">{unit.singkatan}</span>
                    <span className="text-[11px] text-slate-400 leading-tight block">{unit.nama}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Auth Card */}
          <div className="lg:col-span-6">
            <div className="bg-slate-900/95 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
              {/* Tabs Switcher */}
              <div className="flex items-center p-1 bg-slate-950 rounded-xl mb-6 border border-slate-800">
                <button
                  type="button"
                  onClick={() => { setActiveTab('login'); setErrorMsg(''); setSuccessMsg(''); }}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                    activeTab === 'login'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Masuk (Login)
                </button>
                <button
                  type="button"
                  onClick={() => { setActiveTab('register'); setErrorMsg(''); setSuccessMsg(''); }}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                    activeTab === 'register'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Daftar Akun Baru
                </button>
              </div>

              {/* Alerts */}
              {errorMsg && (
                <div className="mb-4 p-3 rounded-lg bg-red-950/60 border border-red-800/80 text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                  <span>{errorMsg}</span>
                </div>
              )}
              {successMsg && (
                <div className="mb-4 p-3 rounded-lg bg-emerald-950/60 border border-emerald-800/80 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* Login Form */}
              {activeTab === 'login' && (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Email Kedinasan
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type="email"
                        required
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="contoh: sakip.transnakerlutra@gmail.com"
                        className="w-full pl-9 pr-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Kata Sandi (Password)
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type="password"
                        required
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="Masukkan kata sandi"
                        className="w-full pl-9 pr-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Memproses...' : 'Masuk ke Sistem'}
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  {/* Fast One-Click Demo Logins */}
                  <div className="pt-4 border-t border-slate-800">
                    <p className="text-[11px] text-slate-400 mb-2 font-medium">
                      Akses Cepat Pengujian Akun:
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={fillDemoAdmin}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-left text-[11px] transition-colors"
                      >
                        <div className="font-semibold text-amber-400">Admin SAKIP</div>
                        <div className="text-slate-400 text-[10px] truncate">sakip.transnakerlutra...</div>
                      </button>
                      <button
                        type="button"
                        onClick={fillDemoOperator}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-left text-[11px] transition-colors"
                      >
                        <div className="font-semibold text-emerald-400">Operator Dinas</div>
                        <div className="text-slate-400 text-[10px] truncate">operator.transnaker...</div>
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {/* Register Form */}
              {activeTab === 'register' && (
                <form onSubmit={handleRegister} className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Nama Lengkap & Gelar
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type="text"
                        required
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        placeholder="Contoh: Andi Suryani, S.STP"
                        className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Email Dinas
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                          type="email"
                          required
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                          placeholder="email@luwuutarakab.go.id"
                          className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        NIP (Opsional)
                      </label>
                      <input
                        type="text"
                        value={regNip}
                        onChange={(e) => setRegNip(e.target.value)}
                        placeholder="1990xxxx xxxxx"
                        className="w-full px-3 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500 font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Unit Kerja / Bidang
                      </label>
                      <select
                        value={regBidang}
                        onChange={(e) => setRegBidang(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-hidden focus:border-blue-500"
                      >
                        {STRUKTUR_ORGANISASI_TRANSNAKER.map((unit) => (
                          <option key={unit.nama} value={unit.nama}>
                            {unit.nama}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Peran (Hak Akses)
                      </label>
                      <select
                        value={regRole}
                        onChange={(e) => setRegRole(e.target.value as 'operator' | 'admin')}
                        className="w-full px-2.5 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-hidden focus:border-blue-500 font-semibold"
                      >
                        <option value="operator">Operator (Input & Edit)</option>
                        <option value="admin">Administrator (Kelola Penuh & Hapus)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Kata Sandi
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type="password"
                        required
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="Minimal 6 karakter"
                        className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-3 py-2 px-4 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Mendaftarkan Akun...' : 'Daftarkan Akun Pengguna'}
                    <ShieldCheck className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer info */}
      <footer className="relative z-10 py-3 text-center text-slate-500 text-[11px] border-t border-slate-900 bg-slate-950">
        &copy; {new Date().getFullYear()} Dinas Transmigrasi dan Tenaga Kerja Kabupaten Luwu Utara · LAPAK KINERJA SAKIP
      </footer>
    </div>
  );
};
