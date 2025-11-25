import React, { useState, useEffect } from 'react';
import { UserPlus, Users, Calendar, Clock, ChevronRight, Stethoscope, Search, FileText } from 'lucide-react';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

const ResepsionisPage = () => {
  const [patients, setPatients] = useState([]);
  const [queue, setQueue] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form State
  const [newPatient, setNewPatient] = useState({
    name: '', nik: '', dob: '', address: '', phone: '', poli: 'Umum'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const resQ = await fetch('http://localhost:3032/queues');
      const dataQ = await resQ.json();
      setQueue(dataQ);
      
      const resP = await fetch('http://localhost:3032/patients');
      const dataP = await resP.json();
      setPatients(dataP);
    } catch (error) {
      console.error("Gagal ambil data", error);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    // 1. Generate No RM & ID
    const nextId = patients.length + 1;
    const rmCode = `RM-${String(nextId).padStart(3, '0')}`;
    const patientData = { id: `p${nextId}`, rm_code: rmCode, ...newPatient, history: [] };

    try {
      // 2. Simpan Pasien Baru
      await fetch('http://localhost:3032/patients', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(patientData)
      });

      // 3. Masukkan ke Antrian
      const queueData = {
        id: `q${Date.now()}`,
        patientId: patientData.id,
        patientName: patientData.name,
        poli: newPatient.poli,
        status: 'waiting_doctor', // Status awal
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'})
      };

      await fetch('http://localhost:3032/queues', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(queueData)
      });

      alert(`✅ Pendaftaran Berhasil!\nNo. Antrian: ${queueData.id}\nNo. RM: ${rmCode}`);
      setIsModalOpen(false);
      fetchData(); // Refresh data
      setNewPatient({ name: '', nik: '', dob: '', address: '', phone: '', poli: 'Umum' }); // Reset form

    } catch (error) {
      alert("Gagal mendaftar.");
    } finally {
      setLoading(false);
    }
  };

  // --- KOMPONEN KECIL: STAT CARD ---
  const StatCard = ({ title, count, subtitle, icon: Icon, color }) => (
    <div className="glass-card p-6 rounded-[2rem] relative overflow-hidden group">
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${color} opacity-10 rounded-bl-[4rem] transition-transform group-hover:scale-110`}></div>
      <div className="relative z-10">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br ${color} text-white shadow-lg mb-4`}>
          <Icon size={24} />
        </div>
        <h3 className="text-3xl font-extrabold text-slate-800 mb-1">{count}</h3>
        <p className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-1">{title}</p>
        <p className="text-xs text-slate-400 font-medium">{subtitle}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* 1. HEADER & ACTIONS */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Front Office</h1>
          <p className="text-slate-500 mt-1 font-medium">Kelola pendaftaran dan antrian pasien hari ini.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={fetchData}>Refresh Data</Button>
          <Button onClick={() => setIsModalOpen(true)} className="shadow-lg shadow-cyan-500/30">
            <UserPlus size={18} /> Pendaftaran Baru
          </Button>
        </div>
      </div>

      {/* 2. STATISTIK CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Pasien Menunggu" 
          count={queue.filter(q => q.status === 'waiting_doctor').length} 
          subtitle="Butuh penanganan dokter"
          icon={Clock} 
          color="from-orange-400 to-red-500" 
        />
        <StatCard 
          title="Total Hari Ini" 
          count={queue.length} 
          subtitle="Pasien terdaftar"
          icon={Users} 
          color="from-blue-400 to-indigo-500" 
        />
        <StatCard 
          title="Dokter Tersedia" 
          count="3" 
          subtitle="Poli Umum & Gigi"
          icon={Stethoscope} 
          color="from-emerald-400 to-teal-500" 
        />
      </div>

      {/* 3. TABEL ANTRIAN (GLASS TABLE) */}
      <div className="glass-panel rounded-[2.5rem] p-8 relative overflow-hidden">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span className="w-2 h-8 bg-cyan-500 rounded-full"></span> Antrian Poliklinik
          </h3>
          <div className="bg-white/50 border border-white p-2 rounded-xl flex items-center gap-2 w-64">
            <Search size={16} className="text-slate-400 ml-2"/>
            <input type="text" placeholder="Cari nama pasien..." className="bg-transparent outline-none text-sm w-full font-medium text-slate-600 placeholder-slate-400"/>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200/60">
                <th className="pb-4 pl-4">No. Antrian</th>
                <th className="pb-4">Waktu</th>
                <th className="pb-4">Nama Pasien</th>
                <th className="pb-4">Poliklinik</th>
                <th className="pb-4">Status Saat Ini</th>
                <th className="pb-4 text-right pr-4">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-sm font-medium text-slate-600">
              {queue.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-400 italic">Belum ada antrian hari ini.</td>
                </tr>
              ) : (
                queue.map((item, index) => (
                  <tr key={item.id} className="group hover:bg-white/40 transition-colors border-b border-slate-100 last:border-0">
                    <td className="py-4 pl-4">
                      <span className="font-mono font-bold text-slate-800 bg-white border border-slate-200 px-2 py-1 rounded-lg">
                        {item.id.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-4">{item.time}</td>
                    <td className="py-4 font-bold text-slate-800">{item.patientName}</td>
                    <td className="py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-600 border border-blue-100">
                        <Stethoscope size={12}/> {item.poli}
                      </span>
                    </td>
                    <td className="py-4">
                      {item.status === 'waiting_doctor' && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-yellow-50 text-yellow-600 border border-yellow-100">
                          <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-pulse"></span> Menunggu Dokter
                        </span>
                      )}
                      {item.status === 'in_consultation' && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-600 border border-purple-100">
                           Sedang Diperiksa
                        </span>
                      )}
                       {item.status === 'waiting_pharmacy' && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-cyan-50 text-cyan-600 border border-cyan-100">
                           Di Apotek
                        </span>
                      )}
                       {item.status === 'done' && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-50 text-green-600 border border-green-100">
                           Selesai
                        </span>
                      )}
                    </td>
                    <td className="py-4 text-right pr-4">
                      <button className="text-slate-400 hover:text-cyan-600 transition-colors p-2 hover:bg-cyan-50 rounded-lg">
                        <FileText size={18}/>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. MODAL FORM PENDAFTARAN */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="glass-panel w-full max-w-lg rounded-[2rem] p-8 shadow-2xl relative bg-white">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-red-500 transition-colors"
            >
              ✕
            </button>
            
            <h2 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-2">
              <UserPlus className="text-cyan-500"/> Pasien Baru
            </h2>

            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input label="Nama Lengkap" placeholder="Sesuai KTP" value={newPatient.name} onChange={e => setNewPatient({...newPatient, name: e.target.value})} required />
                <Input label="NIK / KTP" placeholder="16 Digit" value={newPatient.nik} onChange={e => setNewPatient({...newPatient, nik: e.target.value})} required />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <Input label="Tanggal Lahir" type="date" value={newPatient.dob} onChange={e => setNewPatient({...newPatient, dob: e.target.value})} required />
                <Input label="No. Telepon" placeholder="08..." value={newPatient.phone} onChange={e => setNewPatient({...newPatient, phone: e.target.value})} />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-bold text-slate-600 mb-2 ml-1">Pilih Poliklinik</label>
                <div className="grid grid-cols-2 gap-3">
                  {['Umum', 'Gigi', 'Anak', 'Kandungan'].map(poli => (
                    <button
                      type="button"
                      key={poli}
                      onClick={() => setNewPatient({...newPatient, poli})}
                      className={`py-3 rounded-xl text-sm font-bold border transition-all ${
                        newPatient.poli === poli 
                          ? 'bg-cyan-50 border-cyan-500 text-cyan-700 shadow-inner' 
                          : 'bg-white border-slate-200 text-slate-500 hover:border-cyan-300'
                      }`}
                    >
                      {poli}
                    </button>
                  ))}
                </div>
              </div>

              <Input label="Alamat Domisili" placeholder="Jl..." value={newPatient.address} onChange={e => setNewPatient({...newPatient, address: e.target.value})} />

              <div className="pt-4">
                <Button type="submit" isLoading={loading} className="w-full">Daftar & Cetak Antrian</Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default ResepsionisPage;