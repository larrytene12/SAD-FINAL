import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stethoscope, Activity, Lock, User } from 'lucide-react';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Fetch ke db.json users
      const res = await fetch(`http://localhost:3032/users?username=${formData.username}&password=${formData.password}`);
      const users = await res.json();

      if (users.length > 0) {
        const user = users[0];
        
        // Simpan sesi
        localStorage.setItem('clinicUser', JSON.stringify(user));
        
        // Routing cerdas berdasarkan Role
        switch(user.role) {
            case 'pemilik': navigate('/owner/dashboard'); break;
            case 'resepsionis': navigate('/reception/dashboard'); break;
            case 'dokter': navigate('/doctor/dashboard'); break;
            case 'apotek': navigate('/pharmacy/dashboard'); break;
            case 'kasir': navigate('/cashier/dashboard'); break;
            default: navigate('/');
        }
      } else {
        setError("Username atau Password tidak ditemukan dalam database Klinik Sentosa.");
      }
    } catch (err) {
      setError("Gagal terhubung ke server database.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      
      {/* Dekorasi Background Medis */}
      <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-cyan-400/20 rounded-full blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-blue-500/20 rounded-full blur-[100px] animate-pulse"></div>

      <div className="glass-panel w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 rounded-[2.5rem] overflow-hidden shadow-2xl relative z-10 min-h-[600px]">
        
        {/* KIRI: Visualisasi & Branding */}
        <div className="hidden md:flex flex-col justify-center p-12 bg-gradient-to-br from-cyan-600 to-blue-700 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/medical-icons.png')] opacity-10"></div>
            
            <div className="relative z-10">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8 border border-white/30 shadow-lg">
                    <Activity size={40} className="text-white"/>
                </div>
                <h1 className="text-4xl font-extrabold mb-4 leading-tight">Sistem Informasi <br/>Klinik Sentosa</h1>
                <p className="text-blue-100 text-lg leading-relaxed mb-8">
                    Solusi manajemen kesehatan modern yang terintegrasi, efisien, dan profesional.
                </p>
                <div className="flex gap-3 text-sm font-medium bg-white/10 w-fit px-4 py-2 rounded-full border border-white/20">
                    <span className="flex items-center gap-1">✨ Terintegrasi</span>
                    <span className="w-1 h-1 bg-white rounded-full self-center"></span>
                    <span className="flex items-center gap-1">🛡️ Aman</span>
                    <span className="w-1 h-1 bg-white rounded-full self-center"></span>
                    <span className="flex items-center gap-1">🚀 Cepat</span>
                </div>
            </div>
        </div>

        {/* KANAN: Form Login */}
        <div className="p-10 md:p-14 flex flex-col justify-center bg-white/40">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-slate-800">Selamat Datang</h2>
                <p className="text-slate-500 mt-2">Silakan masuk menggunakan akun staf Anda.</p>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-medium flex items-center gap-2 animate-bounce">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div> {error}
                </div>
            )}

            <form onSubmit={handleLogin} className="space-y-2">
                <Input 
                    label="Username ID" 
                    placeholder="Contoh: dokter" 
                    icon={User}
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                />
                
                <Input 
                    label="Password" 
                    type="password" 
                    placeholder="••••••" 
                    icon={Lock}
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                />

                <div className="pt-4">
                    <Button type="submit" isLoading={loading} className="w-full shadow-cyan-500/20">
                         Masuk Portal <Stethoscope size={18}/>
                    </Button>
                </div>
            </form>

            <div className="mt-8 text-center">
                <p className="text-xs text-slate-400">
                    &copy; 2025 Klinik Sentosa Digital System v1.0
                </p>
            </div>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;