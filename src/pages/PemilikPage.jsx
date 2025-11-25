import React, { useEffect, useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { 
  DollarSign, Users, TrendingUp, Activity, Search, FileText, 
  Download, ChevronRight, Calendar, User, Stethoscope, Pill, X
} from 'lucide-react';
import Button from '../components/common/Button';

const PemilikPage = () => {
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'arsip'
  
  // --- STATE DATA ---
  const [stats, setStats] = useState({ income: 0, patients: 0, growth: 24.5 });
  const [dataChart, setDataChart] = useState([]);
  const [patients, setPatients] = useState([]);
  const [records, setRecords] = useState([]);
  
  // --- STATE UI ---
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null); // Untuk modal detail

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
        // 1. Data Transaksi (Untuk Omzet)
        const resTrx = await fetch('http://localhost:3032/transactions');
        const trx = await resTrx.json();
        const totalIncome = trx.reduce((acc, curr) => acc + curr.total, 0);
        
        // 2. Data Pasien (Master Data)
        const resP = await fetch('http://localhost:3032/patients');
        const p = await resP.json();
        
        // 3. Data Rekam Medis (History)
        const resRec = await fetch('http://localhost:3032/medical_records');
        const rec = await resRec.json();

        setStats(prev => ({ ...prev, income: totalIncome, patients: p.length }));
        setPatients(p);
        setRecords(rec);

        // Data Dummy Grafik (Bisa diganti logic real jika data transaksi banyak)
        setDataChart([
            { name: 'Senin', omzet: 1500000, pasien: 12 },
            { name: 'Selasa', omzet: 2300000, pasien: 18 },
            { name: 'Rabu', omzet: 1800000, pasien: 15 },
            { name: 'Kamis', omzet: 3200000, pasien: 25 },
            { name: 'Jumat', omzet: 2100000, pasien: 20 },
            { name: 'Sabtu', omzet: 4500000, pasien: 35 },
        ]);
    } catch (error) {
        console.error("Gagal ambil data", error);
    }
  };

  // --- FITUR DOWNLOAD CSV REAL (WOW FEATURE) ---
  const handleExport = () => {
    const headers = ["No RM,Nama,NIK,Alamat,Telepon"];
    const rows = patients.map(p => `${p.rm_code},${p.name},'${p.nik},${p.address},${p.phone}`);
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Laporan_Pasien_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    alert("✅ Laporan berhasil diunduh!");
  };

  // --- HELPER: CARI HISTORY PASIEN TERTENTU ---
  const getPatientHistory = (patientId) => {
    return records.filter(r => r.patientId === patientId).sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  // --- SUB-COMPONENT: DASHBOARD VIEW ---
  const DashboardView = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
        {/* STATS CARDS - SEKARANG BISA DIKLIK */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* CARD 1: OMZET */}
            <div 
                onClick={() => alert(`Detail Omzet:\nTotal Pendapatan Bersih: Rp ${stats.income.toLocaleString('id-ID')}`)}
                className="glass-card p-6 rounded-[2rem] flex items-center gap-4 relative overflow-hidden cursor-pointer hover:scale-[1.02] transition-transform group"
            >
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-500/20 rounded-full blur-xl group-hover:bg-emerald-500/30 transition-all"></div>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br from-green-400 to-emerald-600 text-white shadow-lg">
                    <DollarSign size={28} />
                </div>
                <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Omzet</p>
                    <h3 className="text-2xl font-black text-slate-800">Rp {stats.income.toLocaleString('id-ID')}</h3>
                </div>
            </div>

            {/* CARD 2: PASIEN (KLIK UNTUK KE ARSIP) */}
            <div 
                onClick={() => setActiveTab('arsip')} 
                className="glass-card p-6 rounded-[2rem] flex items-center gap-4 relative overflow-hidden cursor-pointer hover:scale-[1.02] transition-transform group"
            >
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-500/20 rounded-full blur-xl group-hover:bg-blue-500/30 transition-all"></div>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br from-blue-400 to-indigo-600 text-white shadow-lg">
                    <Users size={28} />
                </div>
                <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Pasien</p>
                    <h3 className="text-2xl font-black text-slate-800">{stats.patients} Orang</h3>
                    <p className="text-[10px] text-blue-500 font-bold mt-1">Klik untuk detail →</p>
                </div>
            </div>

            {/* CARD 3: GROWTH */}
            <div className="glass-card p-6 rounded-[2rem] flex items-center gap-4 relative overflow-hidden group">
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-purple-500/20 rounded-full blur-xl group-hover:bg-purple-500/30 transition-all"></div>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br from-purple-400 to-pink-600 text-white shadow-lg">
                    <TrendingUp size={28} />
                </div>
                <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Growth</p>
                    <h3 className="text-2xl font-black text-slate-800">+{stats.growth}%</h3>
                </div>
            </div>
        </div>

        {/* CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="glass-panel p-8 rounded-[2.5rem]">
                <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <Activity className="text-green-500"/> Tren Pendapatan
                </h3>
                <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={dataChart}>
                            <defs>
                                <linearGradient id="colorOmzet" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0"/>
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10}/>
                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} tickFormatter={(value) => `${value/1000}k`}/>
                            <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}}/>
                            <Area type="monotone" dataKey="omzet" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorOmzet)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
            <div className="glass-panel p-8 rounded-[2.5rem]">
                <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <Users className="text-blue-500"/> Kunjungan Pasien
                </h3>
                <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={dataChart}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0"/>
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10}/>
                            <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{borderRadius: '12px'}}/>
                            <Bar dataKey="pasien" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={40} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    </div>
  );

  // --- SUB-COMPONENT: ARSIP VIEW ---
  const ArsipView = () => {
    // Filter Pencarian
    const filteredPatients = patients.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.rm_code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="glass-panel p-8 rounded-[2.5rem] min-h-[600px] flex flex-col animate-in slide-in-from-right-8 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                    <h2 className="text-2xl font-black text-slate-800">Arsip Data Pasien</h2>
                    <p className="text-slate-500">Database lengkap rekam medis klinik.</p>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 flex items-center gap-2 flex-1 md:w-80 focus-within:ring-2 ring-blue-400 transition-all shadow-sm">
                        <Search size={18} className="text-slate-400"/>
                        <input 
                            type="text" 
                            placeholder="Cari Nama / No. RM..." 
                            className="bg-transparent outline-none w-full text-sm font-bold text-slate-700 placeholder-slate-400"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button onClick={handleExport} className="bg-slate-800 text-white hover:bg-slate-900 shadow-lg">
                        <Download size={18}/> Unduh Laporan
                    </Button>
                </div>
            </div>

            <div className="flex-1 overflow-hidden rounded-xl border border-slate-200 bg-white/50">
                <div className="overflow-y-auto h-full">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 sticky top-0 z-10">
                            <tr className="text-slate-500 font-bold uppercase text-xs border-b border-slate-200">
                                <th className="p-4">No. RM</th>
                                <th className="p-4">Nama Pasien</th>
                                <th className="p-4">NIK / KTP</th>
                                <th className="p-4">Tanggal Lahir</th>
                                <th className="p-4 text-center">Riwayat Kunjungan</th>
                                <th className="p-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredPatients.length === 0 ? (
                                <tr><td colSpan="6" className="p-8 text-center text-slate-400">Data tidak ditemukan.</td></tr>
                            ) : filteredPatients.map((patient) => {
                                const visitCount = getPatientHistory(patient.id).length;
                                return (
                                    <tr key={patient.id} className="hover:bg-blue-50/50 transition-colors group">
                                        <td className="p-4 font-mono font-bold text-blue-600">{patient.rm_code}</td>
                                        <td className="p-4 font-bold text-slate-700">{patient.name}</td>
                                        <td className="p-4 text-slate-500">{patient.nik}</td>
                                        <td className="p-4 text-slate-500">{patient.dob}</td>
                                        <td className="p-4 text-center">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${visitCount > 0 ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                                                {visitCount} Kali
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <button 
                                                onClick={() => setSelectedPatient(patient)}
                                                className="text-slate-400 hover:text-blue-600 font-bold text-xs flex items-center gap-1 ml-auto bg-white border border-slate-200 px-3 py-1.5 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all"
                                            >
                                                Buka File <ChevronRight size={14}/>
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
  };

  return (
    <div className="space-y-6">
        {/* HEADER TAB */}
        <div className="flex justify-between items-end">
            <div>
                <h1 className="text-3xl font-black text-slate-800">Owner Area</h1>
                <p className="text-slate-500 mt-1">Monitoring & Laporan Kinerja Klinik</p>
            </div>
            <div className="glass-panel p-1 rounded-xl flex gap-1">
                <button 
                    onClick={() => setActiveTab('dashboard')}
                    className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'dashboard' ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-100'}`}
                >
                    Ringkasan
                </button>
                <button 
                    onClick={() => setActiveTab('arsip')}
                    className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'arsip' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-100'}`}
                >
                    Arsip Pasien
                </button>
            </div>
        </div>

        {/* CONTENT SWITCHER */}
        {activeTab === 'dashboard' ? <DashboardView /> : <ArsipView />}

        {/* MODAL DETAIL PASIEN (EMR VIEWER) */}
        {selectedPatient && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
                <div className="glass-panel bg-white w-full max-w-4xl h-[85vh] rounded-[2.5rem] flex flex-col overflow-hidden shadow-2xl relative">
                    
                    {/* Modal Header */}
                    <div className="p-8 pb-6 border-b border-slate-100 flex justify-between items-start bg-white/80 backdrop-blur-md z-10">
                        <div className="flex gap-5">
                            <div className="w-20 h-20 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center">
                                <User size={40} className="text-blue-300"/>
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-slate-800">{selectedPatient.name}</h2>
                                <div className="flex gap-3 mt-2 text-sm font-medium text-slate-500">
                                    <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600 border border-slate-200">{selectedPatient.rm_code}</span>
                                    <span>{selectedPatient.dob}</span>
                                    <span>•</span>
                                    <span>{selectedPatient.phone}</span>
                                </div>
                                <p className="text-slate-400 text-sm mt-1">{selectedPatient.address}</p>
                            </div>
                        </div>
                        <button onClick={() => setSelectedPatient(null)} className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-full transition bg-white shadow-sm border border-slate-100"><X size={20}/></button>
                    </div>

                    {/* Modal Body: Timeline Rekam Medis */}
                    <div className="flex-1 overflow-y-auto p-8 bg-slate-50/50">
                        <h3 className="text-lg font-bold text-slate-700 mb-6 flex items-center gap-2">
                            <FileText className="text-blue-500"/> Riwayat Medis (Medical Record)
                        </h3>
                        
                        <div className="space-y-6 relative before:absolute before:left-4 before:top-2 before:h-full before:w-0.5 before:bg-slate-200">
                            {getPatientHistory(selectedPatient.id).length === 0 ? (
                                <div className="pl-10 text-slate-400 italic">Belum ada riwayat pemeriksaan.</div>
                            ) : (
                                getPatientHistory(selectedPatient.id).map((record) => (
                                    <div key={record.id} className="relative pl-10">
                                        {/* Dot Timeline */}
                                        <div className="absolute left-2 top-1 w-4 h-4 bg-blue-500 rounded-full border-4 border-blue-100 shadow-sm"></div>
                                        
                                        <div className="glass-card bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
                                            <div className="flex justify-between items-start mb-4 border-b border-slate-100 pb-3">
                                                <div>
                                                    <p className="text-sm font-bold text-blue-600 flex items-center gap-2">
                                                        <Calendar size={14}/> {record.date}
                                                    </p>
                                                    <p className="text-xs text-slate-400 mt-1">Ditangani oleh: {record.doctorName}</p>
                                                </div>
                                                {record.vitalSigns && (
                                                    <div className="flex gap-3 text-xs font-bold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg">
                                                        <span className="flex items-center gap-1"><Activity size={10} className="text-red-500"/> {record.vitalSigns.tensi}</span>
                                                        <span>|</span>
                                                        <span>{record.vitalSigns.suhu}°C</span>
                                                        <span>|</span>
                                                        <span>{record.vitalSigns.berat} Kg</span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <p className="text-xs font-bold text-slate-400 uppercase mb-1">Diagnosa</p>
                                                    <p className="text-slate-800 font-medium leading-relaxed">{record.diagnosis}</p>
                                                    <p className="text-sm text-slate-500 mt-2 italic">"{record.symptoms}"</p>
                                                </div>
                                                
                                                <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                                                    <p className="text-xs font-bold text-blue-400 uppercase mb-2 flex items-center gap-1">
                                                        <Pill size={12}/> Resep Obat
                                                    </p>
                                                    <ul className="space-y-1">
                                                        {record.prescription && record.prescription.map((rx, idx) => (
                                                            <li key={idx} className="text-sm text-slate-700 flex justify-between">
                                                                <span>• {rx.name}</span>
                                                                <span className="text-slate-400 text-xs">({rx.note})</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Modal Footer */}
                    <div className="p-6 border-t border-slate-200 bg-white flex justify-end">
                        <Button onClick={() => window.print()} variant="outline" className="mr-2">Cetak Rekam Medis</Button>
                        <Button onClick={() => setSelectedPatient(null)}>Tutup</Button>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

export default PemilikPage;