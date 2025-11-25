import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Stethoscope, Pill, Calculator, 
  LogOut, Menu, Bell, Search, Activity, Lock 
} from 'lucide-react';
import Button from '../common/Button';

const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('clinicUser') || '{}');

  // Daftar Menu dengan Izin Akses (allowedRoles)
  // 'pemilik' kita masukkan di SEMUA menu agar dia jadi akun "Dewa"
  const menus = [
    { name: 'Dashboard Owner', path: '/owner/dashboard', allowedRoles: ['pemilik'], icon: Activity },
    { name: 'Resepsionis', path: '/reception/dashboard', allowedRoles: ['resepsionis', 'pemilik'], icon: Users },
    { name: 'Dokter & Medis', path: '/doctor/dashboard', allowedRoles: ['dokter', 'pemilik'], icon: Stethoscope },
    { name: 'Apotek & Obat', path: '/pharmacy/dashboard', allowedRoles: ['apotek', 'pemilik'], icon: Pill },
    { name: 'Kasir & Billing', path: '/cashier/dashboard', allowedRoles: ['kasir', 'pemilik'], icon: Calculator },
  ];

  const handleLogout = () => {
    if(window.confirm('Keluar dari sistem klinik?')) {
      localStorage.removeItem('clinicUser');
      navigate('/');
    }
  };

  const handleMenuClick = (menu) => {
    // Cek apakah user punya akses?
    if (menu.allowedRoles.includes(user.role)) {
        navigate(menu.path);
    } else {
        // Efek visual jika akses ditolak (biar terlihat canggih)
        alert(`⛔ AKSES DITOLAK\n\nAnda login sebagai: ${user.role.toUpperCase()}\nHalaman ini khusus untuk: ${menu.allowedRoles[0].toUpperCase()}`);
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#f0f9ff]">
      {/* BACKGROUND DEKORASI */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-cyan-100/50 to-transparent pointer-events-none"></div>

      {/* SIDEBAR (GLASSMORPHISM) */}
      <aside className="w-72 hidden md:flex flex-col m-4 rounded-[2rem] glass-panel shadow-2xl z-20 relative overflow-hidden border border-white/60">
        
        {/* Header Sidebar */}
        <div className="p-8 pb-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-cyan-500/30">
            <span className="font-bold text-xl">S</span>
          </div>
          <div>
            <h1 className="font-extrabold text-slate-800 tracking-tight leading-none">SENTOSA</h1>
            <p className="text-[10px] font-bold text-cyan-600 uppercase tracking-widest mt-1">Health System</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-2 py-4 overflow-y-auto">
          {menus.map((menu) => {
            const isActive = location.pathname.includes(menu.path.split('/')[1]);
            const isAllowed = menu.allowedRoles.includes(user.role);
            
            return (
              <button
                key={menu.path}
                onClick={() => handleMenuClick(menu)}
                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                  isActive 
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/25' 
                    : isAllowed 
                        ? 'text-slate-600 hover:bg-white/60 hover:text-cyan-600'
                        : 'text-slate-400 opacity-60 cursor-not-allowed hover:bg-slate-100/50'
                }`}
              >
                <div className="flex items-center gap-3">
                    <menu.icon size={20} className={isActive ? 'text-white' : isAllowed ? 'text-slate-400 group-hover:text-cyan-500' : 'text-slate-300'} />
                    <span className="font-bold text-sm tracking-wide">{menu.name}</span>
                </div>
                
                {/* Indikator Gembok jika tidak punya akses */}
                {!isAllowed && <Lock size={14} className="text-slate-300"/>}
                
                {isActive && <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white/30 rounded-l-full"></div>}
              </button>
            )
          })}
        </nav>

        {/* User Profile Footer */}
        <div className="p-4 m-4 mt-0 bg-white/40 rounded-2xl border border-white/50 backdrop-blur-md">
            <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-slate-200 to-slate-100 border-2 border-white shadow-sm overflow-hidden">
                    <img src={`https://ui-avatars.com/api/?name=${user.fullName}&background=random`} alt="Avatar" />
                </div>
                <div className="overflow-hidden text-left">
                    <p className="text-sm font-bold text-slate-800 truncate">{user.fullName}</p>
                    <p className="text-[10px] uppercase font-bold text-cyan-600 tracking-wider bg-cyan-50 px-2 py-0.5 rounded-full w-fit border border-cyan-100">
                        {user.role}
                    </p>
                </div>
            </div>
            <button onClick={handleLogout} className="w-full py-2 text-xs font-bold text-red-500 hover:bg-red-50 rounded-lg transition flex items-center justify-center gap-2 border border-transparent hover:border-red-100">
                <LogOut size={14}/> Sign Out
            </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Header Topbar */}
        <header className="h-20 px-8 flex items-center justify-between z-10">
            <div className="md:hidden">
                <Button variant="ghost"><Menu/></Button> 
            </div>
            
            <div className="hidden md:flex items-center gap-2 bg-white/60 px-4 py-2.5 rounded-2xl border border-white/60 w-96 focus-within:ring-2 ring-cyan-400/50 transition-all shadow-sm">
                <Search size={18} className="text-slate-400"/>
                <input type="text" placeholder="Cari pasien (RM), obat, atau dokter..." className="bg-transparent outline-none text-sm w-full text-slate-700 placeholder-slate-400"/>
            </div>

            <div className="flex items-center gap-4">
                <button className="relative p-2.5 bg-white/60 rounded-xl hover:bg-white transition border border-white/60 shadow-sm text-slate-500 hover:text-cyan-600">
                    <Bell size={20}/>
                    <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>
            </div>
        </header>

        <div className="flex-1 overflow-y-auto px-4 md:px-8 pb-8 scroll-smooth">
            <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;