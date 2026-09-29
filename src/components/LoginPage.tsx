import React, { useState } from 'react';
import { 
  Lock, 
  User, 
  ArrowRight, 
  ShieldCheck, 
  KeyRound, 
  AlertCircle, 
  CheckCircle2, 
  Building2,
  FileCheck,
  Eye,
  EyeOff
} from 'lucide-react';
import { StorageService } from '../services/storage';
import { User as UserType, STRUKTUR_ORGANISASI_TRANSNAKER } from '../types';
import { AppLogo } from './AppLogo';
import kantorImg from '../assets/images/kantor_transnaker_lutra_1790478338052.jpg';

interface LoginPageProps {
  onLoginSuccess: (user: UserType) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  // Login form state (supports either User ID or Email)
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
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
      const res = StorageService.login(loginIdentifier, loginPassword);
      setLoading(false);
      if (res.success && res.user) {
        setSuccessMsg('Login berhasil! Mengalihkan ke sistem...');
        setTimeout(() => {
          onLoginSuccess(res.user!);
        }, 400);
      } else {
        setErrorMsg(res.message);
      }
    }, 300);
  };

  // Quick Demo Logins for Testing
  const fillDemoAdmin = () => {
    setLoginIdentifier('admin');
    setLoginPassword('admin123');
    setErrorMsg('');
  };

  const fillDemoOperatorPTK = () => {
    setLoginIdentifier('op_ptk');
    setLoginPassword('operator123');
    setErrorMsg('');
  };

  const fillDemoOperatorSekr = () => {
    setLoginIdentifier('op_sekretariat');
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
              <div className="shrink-0 flex items-center justify-center">
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
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
                <div className="flex items-center gap-2 text-blue-400 font-bold mb-1">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Kepatuhan SAKIP</span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  PermenPAN-RB No 88 & 89 tentang evaluasi akuntabilitas kinerja instansi pemerintah.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
                <div className="flex items-center gap-2 text-emerald-400 font-bold mb-1">
                  <FileCheck className="w-4 h-4" />
                  <span>8 Dokumen Wajib</span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  Penyimpanan terpadu Renstra, IKU, Renja, Perjanjian Kinerja, LKjIP, Renaksi, Monev, SOP.
                </p>
              </div>
            </div>

            {/* Structure info pills */}
            <div className="pt-2">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                5 Bidang / Unit Kerja Terintegrasi:
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {STRUKTUR_ORGANISASI_TRANSNAKER.map((unit) => (
                  <div key={unit.nama} className="p-2 rounded-lg bg-slate-900/60 border border-slate-800 text-xs">
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
              
              {/* Header Title */}
              <div className="mb-5 pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">Masuk ke Sistem</h2>
                    <p className="text-xs text-slate-400">Gunakan User ID atau Email Kedinasan Anda</p>
                  </div>
                </div>
              </div>

              {/* Informative Notice: Admin-controlled account management */}
              <div className="mb-5 p-3 rounded-xl bg-blue-950/40 border border-blue-800/60 text-blue-200 text-xs flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 shrink-0 text-blue-400 mt-0.5" />
                <div className="leading-relaxed">
                  <strong className="block text-white font-semibold mb-0.5">Akses Akun Terpusat</strong>
                  Akun operator dibuat dan dikelola secara terpusat oleh <strong>Administrator SAKIP</strong>. Hubungi Admin dinas jika Anda memerlukan akses baru.
                </div>
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
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1 flex items-center justify-between">
                    <span>User ID / Email Kedinasan</span>
                    <span className="text-[10px] text-slate-400 font-normal">Contoh: admin atau op_ptk</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="text"
                      required
                      value={loginIdentifier}
                      onChange={(e) => setLoginIdentifier(e.target.value)}
                      placeholder="Masukkan User ID atau Email"
                      className="w-full pl-9 pr-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1 flex items-center justify-between">
                    <span>Kata Sandi (Password)</span>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer"
                    >
                      {showPassword ? (
                        <>
                          <EyeOff className="w-3 h-3" />
                          <span>Sembunyikan</span>
                        </>
                      ) : (
                        <>
                          <Eye className="w-3 h-3" />
                          <span>Tampilkan</span>
                        </>
                      )}
                    </button>
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Masukkan kata sandi"
                      className="w-full pl-9 pr-10 py-2 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-mono"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50 cursor-pointer shadow-md"
                >
                  {loading ? 'Memproses...' : 'Masuk ke Sistem LAPAK KINERJA'}
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* Fast One-Click Demo Logins */}
                <div className="pt-4 border-t border-slate-800">
                  <p className="text-[11px] text-slate-400 mb-2 font-medium">
                    Akses Cepat Pengujian Akun (Demo):
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={fillDemoAdmin}
                      className="px-2 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-left text-[11px] transition-colors cursor-pointer group"
                      title="User ID: admin | Password: admin123"
                    >
                      <div className="font-bold text-amber-400 group-hover:underline">Admin SAKIP</div>
                      <div className="text-slate-400 text-[10px] font-mono">ID: admin</div>
                    </button>
                    <button
                      type="button"
                      onClick={fillDemoOperatorPTK}
                      className="px-2 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-left text-[11px] transition-colors cursor-pointer group"
                      title="User ID: op_ptk | Password: operator123"
                    >
                      <div className="font-bold text-emerald-400 group-hover:underline">Op. Naker</div>
                      <div className="text-slate-400 text-[10px] font-mono">ID: op_ptk</div>
                    </button>
                    <button
                      type="button"
                      onClick={fillDemoOperatorSekr}
                      className="px-2 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-left text-[11px] transition-colors cursor-pointer group"
                      title="User ID: op_sekretariat | Password: operator123"
                    >
                      <div className="font-bold text-blue-400 group-hover:underline">Op. Program</div>
                      <div className="text-slate-400 text-[10px] font-mono">ID: op_sekretariat</div>
                    </button>
                  </div>
                </div>
              </form>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
