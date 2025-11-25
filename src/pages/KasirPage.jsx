import React, { useState, useEffect } from 'react';
import { Calculator, Printer, CheckCircle, CreditCard, DollarSign, User, FileText } from 'lucide-react';
import Button from '../components/common/Button';

const KasirPage = () => {
  const [queue, setQueue] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]); // Untuk ambil detail harga obat
  const [activeBill, setActiveBill] = useState(null);
  const [loading, setLoading] = useState(false);

  // KONSTANTA BIAYA
  const CONSULTATION_FEE = 150000;
  const ADMIN_FEE = 10000;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    // 1. Pasien status 'waiting_payment'
    const resQ = await fetch('http://localhost:3032/queues?status=waiting_payment');
    const dataQ = await resQ.json();
    setQueue(dataQ);

    // 2. Ambil data resep (status ready)
    const resRx = await fetch('http://localhost:3032/prescriptions?status=ready');
    const dataRx = await resRx.json();
    setPrescriptions(dataRx);
  };

  const selectPatient = (q) => {
    // Cari resep milik pasien ini
    const rx = prescriptions.find(r => r.queueId === q.id);
    
    // Hitung Total Obat
    const medicineTotal = rx ? rx.items.reduce((acc, item) => acc + (item.price * item.qty), 0) : 0;
    const grandTotal = medicineTotal + CONSULTATION_FEE + ADMIN_FEE;

    setActiveBill({
      queue: q,
      rx: rx,
      medicineTotal,
      grandTotal
    });
  };

  const handlePayment = async () => {
    if (!activeBill) return;
    setLoading(true);

    try {
      // 1. Simpan Transaksi ke 'transactions' (db.json)
      const transactionData = {
        id: `TRX-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        patientName: activeBill.queue.patientName,
        total: activeBill.grandTotal,
        items: activeBill.rx ? activeBill.rx.items : []
      };

      await fetch('http://localhost:3032/transactions', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(transactionData)
      });

      // 2. Selesaikan Antrian -> 'done'
      await fetch(`http://localhost:3032/queues/${activeBill.queue.id}`, {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ status: 'done' })
      });
      
      // 3. Update Resep -> 'paid'
      if (activeBill.rx) {
        await fetch(`http://localhost:3032/prescriptions/${activeBill.rx.id}`, {
          method: 'PATCH',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({ status: 'paid' })
        });
      }

      alert("✅ Pembayaran Berhasil! Transaksi disimpan.");
      setActiveBill(null);
      fetchData();

    } catch (error) {
      alert("Gagal memproses pembayaran.");
    } finally {
      setLoading(false);
    }
  };

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number);
  };

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-100px)] gap-6 animate-in zoom-in duration-500">
      
      {/* KIRI: ANTRIAN PEMBAYARAN */}
      <div className="w-full md:w-1/3 flex flex-col gap-4">
        <div className="glass-panel p-6 rounded-[2rem] bg-white/60">
            <h2 className="text-xl font-black text-slate-800 flex items-center gap-2 mb-4">
                <DollarSign className="text-emerald-500"/> Tagihan Masuk
            </h2>
            <div className="space-y-3">
                {queue.length === 0 ? (
                    <div className="text-center py-10 text-slate-400">Tidak ada tagihan.</div>
                ) : (
                    queue.map(q => (
                        <div 
                            key={q.id} 
                            onClick={() => selectPatient(q)}
                            className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                                activeBill?.queue.id === q.id 
                                ? 'bg-emerald-50 border-emerald-500 shadow-md' 
                                : 'bg-white border-slate-100 hover:border-emerald-300'
                            }`}
                        >
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="font-bold text-slate-800">{q.patientName}</h3>
                                    <p className="text-xs text-slate-500 mt-1">Poli {q.poli}</p>
                                </div>
                                <div className="bg-emerald-100 text-emerald-700 p-2 rounded-lg">
                                    <CreditCard size={18}/>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
      </div>

      {/* KANAN: INVOICE / STRUK */}
      <div className="flex-1 flex justify-center items-start overflow-y-auto">
        {!activeBill ? (
            <div className="text-center text-slate-400 mt-20">
                <Calculator size={64} className="mx-auto mb-4 text-slate-300"/>
                <p>Pilih pasien untuk melihat rincian tagihan.</p>
            </div>
        ) : (
            <div className="bg-white w-full max-w-md shadow-2xl rounded-3xl overflow-hidden border border-slate-200 relative">
                
                {/* Header Invoice */}
                <div className="bg-slate-800 p-6 text-white text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500"></div>
                    <h2 className="text-2xl font-black tracking-widest uppercase mb-1">INVOICE</h2>
                    <p className="text-xs text-slate-400">KLINIK SENTOSA DIGITAL</p>
                    <p className="text-xs text-slate-500 mt-4">{new Date().toLocaleString()}</p>
                </div>

                {/* Body Invoice */}
                <div className="p-8 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
                    
                    {/* Info Pasien */}
                    <div className="border-b-2 border-dashed border-slate-200 pb-6 mb-6">
                        <div className="flex justify-between mb-2">
                            <span className="text-slate-500 text-sm">Pasien</span>
                            <span className="font-bold text-slate-800">{activeBill.queue.patientName}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500 text-sm">ID Transaksi</span>
                            <span className="font-mono text-xs font-bold text-slate-600">TRX-{Date.now().toString().slice(-6)}</span>
                        </div>
                    </div>

                    {/* Rincian Item */}
                    <div className="space-y-3 mb-6">
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-600">Jasa Konsultasi Dokter</span>
                            <span className="font-bold text-slate-800">{formatRupiah(CONSULTATION_FEE)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-600">Biaya Admin</span>
                            <span className="font-bold text-slate-800">{formatRupiah(ADMIN_FEE)}</span>
                        </div>
                        
                        {/* List Obat */}
                        {activeBill.rx && activeBill.rx.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between text-sm pl-4 border-l-2 border-slate-200">
                                <span className="text-slate-500">{item.name} (x{item.qty})</span>
                                <span className="font-medium text-slate-700">{formatRupiah(item.price * item.qty)}</span>
                            </div>
                        ))}
                    </div>

                    {/* Total */}
                    <div className="border-t-2 border-slate-800 pt-4 flex justify-between items-center mb-8">
                        <span className="font-black text-xl text-slate-800">TOTAL</span>
                        <span className="font-black text-2xl text-emerald-600">{formatRupiah(activeBill.grandTotal)}</span>
                    </div>

                    {/* Actions */}
                    <Button onClick={handlePayment} isLoading={loading} className="w-full bg-slate-800 text-white hover:bg-slate-900 shadow-xl">
                        <CheckCircle size={18}/> Konfirmasi Pembayaran
                    </Button>
                    <button onClick={() => window.print()} className="w-full mt-3 py-3 text-slate-500 text-sm font-bold hover:text-slate-800 flex items-center justify-center gap-2">
                        <Printer size={16}/> Cetak Struk
                    </button>

                </div>
                
                {/* Efek Kertas Sobek di Bawah */}
                <div className="h-4 bg-slate-100 relative" style={{backgroundImage: 'radial-gradient(circle, transparent 50%, white 50%)', backgroundSize: '20px 20px', backgroundPosition: '0 10px'}}></div>
            </div>
        )}
      </div>

    </div>
  );
};

export default KasirPage;