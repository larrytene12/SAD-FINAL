import React, { useState, useEffect } from 'react';
import { Stethoscope, User, Clock, Activity, Pill, CheckCircle, Plus, Trash2, AlertCircle, ChevronRight, Thermometer, Weight } from 'lucide-react';
import Button from '../components/common/Button';

const DokterPage = () => {
  // Ambil data user login untuk nama dokter
  const currentUser = JSON.parse(localStorage.getItem('clinicUser')) || {};
  
  const [queue, setQueue] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [activePatient, setActivePatient] = useState(null);
  const [loading, setLoading] = useState(false);

  const [medicalData, setMedicalData] = useState({
    tensi: '', suhu: '', berat: '', symptoms: '', diagnosis: '', notes: ''
  });
  
  const [currentPrescription, setCurrentPrescription] = useState([]);
  const [selectedMed, setSelectedMed] = useState('');
  const [medQty, setMedQty] = useState(1);
  const [medNote, setMedNote] = useState('3x1 Sesudah Makan');

  // AUTO REFRESH
  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
        // Filter poli dokter (Opsional, jika mau semua pasien hapus bagian if)
        let url = 'http://localhost:3032/queues?status=waiting_doctor';
        if (currentUser.role === 'dokter' && currentUser.poli) {
            url += `&poli=${currentUser.poli}`;
        }
        const resQ = await fetch(url);
        setQueue(await resQ.json());
        
        const resM = await fetch('http://localhost:3032/medicines');
        setMedicines(await resM.json());
    } catch (e) { console.error(e); }
  };

  const handleStartConsult = async (patient) => {
    if (activePatient && !window.confirm("Ganti pasien?")) return;
    setActivePatient(patient);
    setMedicalData({ tensi: '', suhu: '', berat: '', symptoms: '', diagnosis: '', notes: '' });
    setCurrentPrescription([]);
    
    // Ubah status jadi sedang diperiksa
    await fetch(`http://localhost:3032/queues/${patient.id}`, {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ status: 'in_consultation' })
    });
    fetchData(); 
  };

  const addMedicine = () => {
    if (!selectedMed) return;
    const medData = medicines.find(m => m.id === selectedMed);
    setCurrentPrescription([...currentPrescription, {
      id: Date.now(), medId: medData.id, name: medData.name,
      qty: parseInt(medQty), note: medNote, price: medData.price 
    }]);
    setMedQty(1);
  };

  // --- INI BAGIAN PERBAIKAN LOGIKA KONEKSI ---
  const handleSubmit = async () => {
    if (!medicalData.diagnosis) return alert("Diagnosa wajib diisi!");
    setLoading(true);

    try {
      // 1. Simpan Rekam Medis
      const recordPayload = {
        id: `mr-${Date.now()}`,
        patientId: activePatient.patientId,
        patientName: activePatient.patientName,
        doctorName: currentUser.fullName || "Dokter Jaga",
        date: new Date().toISOString().split('T')[0],
        vitalSigns: { ...medicalData }, // Simpan TTV
        diagnosis: medicalData.diagnosis,
        symptoms: medicalData.symptoms,
        prescription: currentPrescription
      };
      
      await fetch('http://localhost:3032/medical_records', {
        method: 'POST', headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(recordPayload)
      });

      // 2. KIRIM RESEP KE APOTEK (WAJIB ADA ISI)
      if (currentPrescription.length > 0) {
        const prescriptionPayload = {
            id: `rx-${Date.now()}`,
            queueId: activePatient.id, // ID Antrian (Penting untuk update status nanti)
            patientName: activePatient.patientName,
            items: currentPrescription,
            status: 'waiting_prep' // KUNCI: Status ini yang dibaca Apotek
        };

        console.log("Mengirim Resep:", prescriptionPayload); // Cek Console (F12) jika error

        await fetch('http://localhost:3032/prescriptions', {
            method: 'POST', headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(prescriptionPayload)
        });
      }

      // 3. Update Status Antrian
      // Kalau ada obat -> ke Apotek ('waiting_pharmacy')
      // Kalau tidak ada -> langsung Kasir ('waiting_payment')
      const nextStatus = currentPrescription.length > 0 ? 'waiting_pharmacy' : 'waiting_payment';
      
      await fetch(`http://localhost:3032/queues/${activePatient.id}`, {
        method: 'PATCH', headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ status: nextStatus })
      });

      alert("✅ Data Terkirim ke Apotek/Kasir!");
      setActivePatient(null);
      fetchData();

    } catch (error) {
      console.error(error);
      alert("Gagal koneksi ke server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-100px)] gap-6 animate-in fade-in duration-500">
      {/* KIRI: ANTRIAN */}
      <div className="w-full md:w-1/3 flex flex-col gap-4">
        <div className="glass-panel p-6 rounded-[2rem] bg-white/60 h-full flex flex-col">
            <h2 className="text-xl font-black text-slate-800 flex items-center gap-2 mb-4"><Clock className="text-emerald-500"/> Antrian Pasien</h2>
            <div className="space-y-3 overflow-y-auto flex-1 pr-2">
                {queue.length === 0 ? <div className="text-center py-10 text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl">Kosong</div> : queue.map(q => (
                    <div key={q.id} onClick={() => !activePatient && handleStartConsult(q)} className={`p-4 rounded-2xl border cursor-pointer transition-all ${activePatient?.id === q.id ? 'bg-emerald-50 border-emerald-500 shadow-md' : 'bg-white hover:border-emerald-300'}`}>
                        <div className="flex justify-between"><div><span className="text-xs font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded">{q.id.toUpperCase()}</span><h3 className="font-bold text-slate-800 mt-1">{q.patientName}</h3><p className="text-xs text-slate-500">{q.poli}</p></div>{activePatient?.id === q.id ? <Activity size={20} className="text-emerald-500 animate-pulse"/> : <ChevronRight size={20} className="text-slate-300"/>}</div>
                    </div>
                ))}
            </div>
        </div>
      </div>

      {/* KANAN: WORKSPACE */}
      <div className="flex-1 glass-panel rounded-[2.5rem] p-8 relative overflow-hidden flex flex-col">
        {!activePatient ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400"><Stethoscope size={64} className="text-slate-200 mb-4"/><p>Pilih pasien untuk mulai memeriksa.</p></div>
        ) : (
            <div className="flex-1 flex flex-col overflow-hidden">
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-200"><div><h2 className="text-2xl font-black text-slate-800">{activePatient.patientName}</h2><p className="text-sm text-slate-500">Pemeriksaan Umum</p></div><div className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold animate-pulse">● Live Consultation</div></div>
                <div className="flex-1 overflow-y-auto pr-4 space-y-6">
                    {/* TTV */}
                    <div className="grid grid-cols-3 gap-4"><div className="bg-blue-50 p-3 rounded-xl border border-blue-100"><label className="text-xs font-bold text-blue-600 flex items-center gap-1 mb-1"><Activity size={12}/> Tensi</label><input type="text" className="w-full bg-transparent font-bold text-slate-700 outline-none" value={medicalData.tensi} onChange={e=>setMedicalData({...medicalData, tensi: e.target.value})} /></div><div className="bg-red-50 p-3 rounded-xl border border-red-100"><label className="text-xs font-bold text-red-600 flex items-center gap-1 mb-1"><Thermometer size={12}/> Suhu</label><input type="number" className="w-full bg-transparent font-bold text-slate-700 outline-none" value={medicalData.suhu} onChange={e=>setMedicalData({...medicalData, suhu: e.target.value})} /></div><div className="bg-orange-50 p-3 rounded-xl border border-orange-100"><label className="text-xs font-bold text-orange-600 flex items-center gap-1 mb-1"><Weight size={12}/> Berat</label><input type="number" className="w-full bg-transparent font-bold text-slate-700 outline-none" value={medicalData.berat} onChange={e=>setMedicalData({...medicalData, berat: e.target.value})} /></div></div>
                    {/* SOAP */}
                    <div className="space-y-4"><textarea className="w-full glass-input rounded-xl p-3 h-24" placeholder="Keluhan (Anamnesa)..." value={medicalData.symptoms} onChange={e=>setMedicalData({...medicalData, symptoms: e.target.value})}></textarea><textarea className="w-full glass-input rounded-xl p-3 h-24" placeholder="Diagnosa..." value={medicalData.diagnosis} onChange={e=>setMedicalData({...medicalData, diagnosis: e.target.value})}></textarea></div>
                    {/* RESEP */}
                    <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200"><h3 className="font-bold text-slate-700 mb-3 flex items-center gap-2"><Pill size={16}/> Resep Obat</h3><div className="flex gap-2 mb-3"><select className="flex-1 glass-input p-2 rounded-lg text-sm" value={selectedMed} onChange={e=>setSelectedMed(e.target.value)}><option value="">Pilih Obat</option>{medicines.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}</select><input type="number" className="w-16 glass-input p-2 rounded-lg text-sm" value={medQty} onChange={e=>setMedQty(e.target.value)} /><input type="text" className="flex-1 glass-input p-2 rounded-lg text-sm" placeholder="Dosis" value={medNote} onChange={e=>setMedNote(e.target.value)} /><button onClick={addMedicine} className="bg-emerald-500 text-white p-2 rounded-lg"><Plus size={20}/></button></div>
                        <div className="space-y-1">{currentPrescription.map((item, idx) => (<div key={idx} className="flex justify-between text-sm bg-white p-2 rounded border border-slate-100"><span>{item.name} (x{item.qty}) - {item.note}</span><span className="text-red-500 cursor-pointer" onClick={()=>setCurrentPrescription(currentPrescription.filter(x=>x.id!==item.id))}>Hapus</span></div>))}</div>
                    </div>
                </div>
                <div className="pt-4 mt-4 border-t border-slate-200 text-right"><Button onClick={handleSubmit} isLoading={loading} className="bg-emerald-600 w-full">Simpan & Kirim ke Apotek</Button></div>
            </div>
        )}
      </div>
    </div>
  );
};
export default DokterPage;