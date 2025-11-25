import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard,
  Users,
  Stethoscope,
  Pill,
  CreditCard,
  BarChart3,
  Settings,
  FileText,
  Calendar,
  Package,
  AlertTriangle
} from 'lucide-react';
import { clsx } from 'clsx';

const Sidebar = ({ userRole }) => {
  const navigation = {
    resepsionis: [
      { name: 'Dashboard', href: '/resepsionis', icon: LayoutDashboard },
      { name: 'Pendaftaran', href: '/resepsionis/pendaftaran', icon: Users },
      { name: 'Antrian', href: '/resepsionis/antrian', icon: Users },
      { name: 'Janji Temu', href: '/resepsionis/janji-temu', icon: Users },
    ],

    dokter: [
      { name: 'Dashboard', href: '/dokter', icon: LayoutDashboard },
      { name: 'Antrian Pasien', href: '/dokter/antrian', icon: Users },
      { name: 'Rekam Medis', href: '/dokter/rekam-medis', icon: FileText },
      { name: 'Resep Obat', href: '/dokter/resep', icon: Pill },
      { name: 'Jadwal Praktek', href: '/dokter/jadwal', icon: Calendar },
    ],

    apotek: [
      { name: 'Dashboard', href: '/apotek', icon: LayoutDashboard },
      { name: 'Resep Masuk', href: '/apotek/resep-masuk', icon: Pill },
      { name: 'Inventory', href: '/apotek/inventory', icon: Package },
      { name: 'Stok Obat', href: '/apotek/stok', icon: AlertTriangle },
    ],

    kasir: [
      { name: 'Dashboard', href: '/kasir', icon: LayoutDashboard },
      { name: 'Tagihan', href: '/kasir/tagihan', icon: CreditCard },
      { name: 'Pembayaran', href: '/kasir/pembayaran', icon: CreditCard },
      { name: 'Laporan', href: '/kasir/laporan', icon: BarChart3 },
    ],

    pemilik: [
      { name: 'Dashboard', href: '/pemilik', icon: LayoutDashboard },
      { name: 'Laporan', href: '/pemilik/laporan', icon: BarChart3 },
      { name: 'Pengaturan', href: '/pemilik/pengaturan', icon: Settings },
    ]
  };

  const menuItems = navigation[userRole] || [];

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full">
      <div className="p-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-medical-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">KS</span>
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Klinik Sentosa</h1>
            <p className="text-sm text-gray-500 capitalize">{userRole}</p>
          </div>
        </div>
      </div>

      <nav className="px-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                clsx(
                  'group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200',
                  {
                    'bg-primary-50 text-primary-700 border-r-2 border-primary-600': isActive,
                    'text-gray-600 hover:bg-gray-50 hover:text-gray-900': !isActive
                  }
                )
              }
            >
              <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
              {item.name}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
