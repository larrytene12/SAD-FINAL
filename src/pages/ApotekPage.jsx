import React, { useState, useEffect } from 'react';
import { Pill, Package, CheckCircle, Clock, AlertTriangle, ArrowRight, Box, Plus } from 'lucide-react';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

const ApotekPage = () => {
  const [activeTab, setActiveTab] = useState('resep');
  const [prescriptions, setPrescriptions] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [activeRx, setActiveRx] = useState(null);
  const [loading, setLoading] = useState(false);
  const [newMed, setNewMed] = useState({ code: '', name: '', stock: 0, price: 0, unit: 'Strip', category: 'Obat Bebas' });

  // --- AUTO REFRESH ---
  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 3000); // Polling data setiap 3 detik
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
        // MENGAMBIL DATA DARI DOKTER (Status 'waiting_prep')
        const resRx = await fetch('http://localhost:3032/prescriptions?status=waiting_prep');
        const dataRx = await resRx.json();
        setPrescriptions(dataRx);

        const resMed = await fetch('http://localhost:3032/medicines');
        setMedicines(await resMed.json());
    } catch (e) { console.error(e); }
  };

  const handleProcess = async () => {
    if (!activeRx) return;
    setLoading(true);
    try {
      // 1. Update Resep jadi READY
      await fetch(`http://localhost:3032/prescriptions/${activeRx.id}`, { method: 'PATCH', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ status: 'ready' }) });
      
      // 2. Kirim Pasien ke Kasir
      await fetch(`http://localhost:3032/queues/${activeRx.queueId}`, { method: 'PATCH', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ status: 'waiting_payment' }) });
      
      alert("✅ Selesai! Dikirim ke Kasir."); setActiveRx(null); fetchData();
    } catch (e) { alert("Error"); } finally { setLoading(false); }
  };

  // ... Bagian Add Medicine dan Return UI SAMA SEPERTI SEBELUMNYA ...
  // Agar hemat tempat, saya fokuskan di logika atas. 
  // Bagian return di bawah ini standar:

  const handleAddMedicine = async (e) => {
    e.preventDefault();
    await fetch('http://localhost:3032/medicines', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ id: `m${Date.now()}`, ...newMed }) });
    alert("Obat Ditambahkan"); fetchData();
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] gap-6 animate-in fade-in duration-500">
      <div className="flex gap-4 bg-white/40 p-1 rounded-xl w-fit backdrop-blur-sm border border-white/50"><button onClick={() => setActiveTab('resep')} className={`px-6 py-2 rounded-lg text-sm font-bold ${activeTab==='resep' ? 'bg-blue-600 text-white' : 'text-slate-600'}`}>Resep Masuk</button><button onClick={() => setActiveTab('inventory')} className={`px-6 py-2 rounded-lg text-sm font-bold ${activeTab==='inventory' ? 'bg-blue-600 text-white' : 'text-slate-600'}`}>Stok Obat</button></div>

      {activeTab === 'resep' ? (
        <div className="flex flex-1 gap-6">
            <div className="w-1/3 glass-panel p-6 rounded-[2rem] flex flex-col">
                <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2"><Clock size={20}/> Antrian Resep</h3>
                <div className="space-y-3 overflow-y-auto flex-1">
                    {prescriptions.length === 0 && <div className="text-center text-slate-400 mt-10">Kosong</div>}
                    {prescriptions.map(rx => (<div key={rx.id} onClick={() => setActiveRx(rx)} className={`p-4 rounded-xl border cursor-pointer ${activeRx?.id===rx.id ? 'bg-blue-50 border-blue-500' : 'bg-white'}`}><h4 className="font-bold">{rx.patientName}</h4><p className="text-xs text-slate-500">{rx.items.length} Item</p></div>))}
                </div>
            </div>
            <div className="flex-1 glass-panel p-8 rounded-[2rem] relative flex flex-col">
                {!activeRx ? <div className="m-auto text-slate-400">Pilih resep</div> : (
                    <>
                        <h2 className="text-2xl font-black text-slate-800 mb-6">{activeRx.patientName}</h2>
                        <div className="flex-1 overflow-y-auto">
                            <table className="w-full text-sm text-left"><thead className="bg-slate-100 text-slate-500 font-bold uppercase"><tr><th className="p-3">Obat</th><th className="p-3">Qty</th><th className="p-3">Stok</th></tr></thead><tbody>{activeRx.items.map((item, i) => {const stok = medicines.find(m=>m.id === item.medId)?.stock || 0; return (<tr key={i} className="border-b"><td className="p-3 font-bold">{item.name}</td><td className="p-3">{item.qty}</td><td className={`p-3 font-bold ${stok < item.qty ? 'text-red-500' : 'text-green-600'}`}>{stok}</td></tr>)})}</tbody></table>
                        </div>
                        <div className="mt-4 flex justify-end"><Button onClick={handleProcess} isLoading={loading}>Selesai & Kirim ke Kasir</Button></div>
                    </>
                )}
            </div>
        </div>
      ) : (
        <div className="flex flex-1 gap-6"><div className="flex-1 glass-panel p-6 rounded-[2rem]"><h3 className="font-bold mb-4">Stok</h3><div className="overflow-y-auto"><table className="w-full text-sm"><thead className="sticky top-0 bg-white"><tr className="text-slate-500 font-bold border-b"><th className="p-3">Nama</th><th className="p-3">Stok</th></tr></thead><tbody>{medicines.map(m => (<tr key={m.id}><td className="p-3">{m.name}</td><td className="p-3 font-bold">{m.stock}</td></tr>))}</tbody></table></div></div><div className="w-1/3 glass-panel p-6 rounded-[2rem] h-fit"><h3 className="font-bold mb-4">Tambah Obat</h3><form onSubmit={handleAddMedicine} className="space-y-3"><Input label="Kode" value={newMed.code} onChange={e=>setNewMed({...newMed, code:e.target.value})}/><Input label="Nama" value={newMed.name} onChange={e=>setNewMed({...newMed, name:e.target.value})}/><Input label="Stok" type="number" value={newMed.stock} onChange={e=>setNewMed({...newMed, stock:parseInt(e.target.value)})}/><Input label="Harga" type="number" value={newMed.price} onChange={e=>setNewMed({...newMed, price:parseInt(e.target.value)})}/><Button type="submit" className="w-full">Simpan</Button></form></div></div>
      )}
    </div>
  );
};
export default ApotekPage;