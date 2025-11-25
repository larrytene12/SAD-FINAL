import React from 'react';
import { useParams } from 'react-router-dom';
import Card from '../components/common/Card';
import { 
  Users, 
  Stethoscope, 
  Pill, 
  DollarSign,
  TrendingUp,
  Calendar
} from 'lucide-react';

const DashboardPage = () => {
  const { role } = useParams();

  const stats = {
    resepsionis: [
      { label: 'Pasien Hari Ini', value: '24', icon: Users, change: '+12%' },
      { label: 'Antrian Aktif', value: '8', icon: Users, change: '+2' },
      { label: 'Janji Temu', value: '15', icon: Calendar, change: '+5' },
      { label: 'Pendaftaran Baru', value: '6', icon: TrendingUp, change: '+3' },
    ],
    dokter: [
      { label: 'Pasien Diperiksa', value: '12', icon: Users, change: '+3' },
      { label: 'Rekam Medis', value: '18', icon: Stethoscope, change: '+8%' },
      { label: 'Resep Ditulis', value: '14', icon: Pill, change: '+4' },
      { label: 'Rata-rata Waktu', value: '15m', icon: Calendar, change: '-2m' },
    ],
    apotek: [
      { label: 'Resep Masuk', value: '22', icon: Pill, change: '+6' },
      { label: 'Resep Diproses', value: '8', icon: Pill, change: '+3' },
      { label: 'Stok Obat Rendah', value: '5', icon: Pill, change: '-2' },
      { label: 'Obat Terjual', value: '45', icon: TrendingUp, change: '+12%' },
    ],
    kasir: [
      { label: 'Transaksi Hari Ini', value: '28', icon: DollarSign, change: '+15%' },
      { label: 'Pendapatan', value: 'Rp 8.5M', icon: TrendingUp, change: '+12%' },
      { label: 'Tagihan Tertunda', value: '3', icon: DollarSign, change: '-1' },
      { label: 'Rata-rata Bill', value: 'Rp 300K', icon: DollarSign, change: '+5%' },
    ],
    pemilik: [
      { label: 'Total Pendapatan', value: 'Rp 125M', icon: DollarSign, change: '+18%' },
      { label: 'Pasien Bulan Ini', value: '450', icon: Users, change: '+25%' },
      { label: 'Efisiensi', value: '92%', icon: TrendingUp, change: '+3%' },
      { label: 'Kepuasan Pasien', value: '94%', icon: Users, change: '+2%' },
    ]
  };

  const roleStats = stats[role] || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Dashboard {role?.charAt(0).toUpperCase() + role?.slice(1)}
        </h1>
        <p className="text-gray-600 mt-1">
          Selamat datang di sistem manajemen Klinik Sentosa
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {roleStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="fade-in" hover>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <p className={`text-sm mt-1 ${
                    stat.change.startsWith('+') ? 'text-green-600' : 
                    stat.change.startsWith('-') ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {stat.change} dari kemarin
                  </p>
                </div>
                <div className="p-3 bg-primary-50 rounded-lg">
                  <Icon className="h-6 w-6 text-primary-600" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity */}
      <Card>
        <Card.Header>
          <Card.Title>Aktivitas Terbaru</Card.Title>
        </Card.Header>
        <Card.Content>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div>
                  <p className="font-medium text-gray-900">Pendaftaran pasien baru</p>
                  <p className="text-sm text-gray-500">Budi Santoso - Umum</p>
                </div>
              </div>
              <span className="text-sm text-gray-500">10:30 AM</span>
            </div>
            
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div>
                  <p className="font-medium text-gray-900">Pemeriksaan selesai</p>
                  <p className="text-sm text-gray-500">Dr. Ahmad - Sari Dewi</p>
                </div>
              </div>
              <span className="text-sm text-gray-500">09:45 AM</span>
            </div>
            
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <div>
                  <p className="font-medium text-gray-900">Resep diproses</p>
                  <p className="text-sm text-gray-500">Paracetamol, Amoxicillin</p>
                </div>
              </div>
              <span className="text-sm text-gray-500">09:15 AM</span>
            </div>
          </div>
        </Card.Content>
      </Card>
    </div>
  );
};

export default DashboardPage;