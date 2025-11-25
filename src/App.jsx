import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// --- IMPORT PAGES ---
import LoginPage from './pages/LoginPage';
import DashboardLayout from './components/layout/DashboardLayout';
import ResepsionisPage from './pages/ResepsionisPage';
import DokterPage from './pages/DokterPage';
import ApotekPage from './pages/ApotekPage';
import KasirPage from './pages/KasirPage';
import PemilikPage from './pages/PemilikPage'; // Pastikan sudah dibuat

// --- PROTECTED ROUTE ---
const ProtectedRoute = ({ children, allowedRoles }) => {
  const user = JSON.parse(localStorage.getItem('clinicUser'));
  
  if (!user) return <Navigate to="/" replace />;

  // Cek apakah role user ada di daftar yang diizinkan
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Jika user mencoba akses URL langsung tapi tidak punya hak
    return <div className="flex h-screen items-center justify-center text-slate-500">
        Akses Ditolak. Anda tidak memiliki izin.
    </div>;
  }

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />

        <Route element={<DashboardLayout />}>
          
          {/* SEMUA RUTE KITA TAMBAHKAN 'pemilik' DI allowedRoles */}
          
          <Route 
            path="/reception/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['resepsionis', 'pemilik']}>
                <ResepsionisPage />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/doctor/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['dokter', 'pemilik']}>
                <DokterPage />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/pharmacy/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['apotek', 'pemilik']}>
                <ApotekPage />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/cashier/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['kasir', 'pemilik']}>
                <KasirPage />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/owner/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['pemilik']}>
                <PemilikPage />
              </ProtectedRoute>
            } 
          />

        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;