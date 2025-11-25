# 🏥 Sistem Informasi Manajemen Klinik Sentosa (SIM-KS)

Dokumen ini berisi **flow (alur kerja)** aplikasi untuk memenuhi permintaan dosen agar repository memiliki dokumentasi yang jelas, tidak hanya berisi source code saja.



---

## 🔐 Kredensial Login (Untuk Demo)

Semua akun menggunakan password: **123**

| Role               | Username      | Tugas Utama                           |
| ------------------ | ------------- | ------------------------------------- |
| **Resepsionis**    | `resepsionis` | Pendaftaran pasien & antrian          |
| **Dokter**         | `dokter`      | Pemeriksaan pasien                    |
| **Apoteker**       | `apotek`      | Racik obat & cek stok                 |
| **Kasir**          | `kasir`       | Pembayaran & cetak invoice            |
| **Pemilik Klinik** | `owner`       | Dashboard laporan & arsip rekam medis |

> 

---

# 🎬 Alur Lengkap Sistem (User Flow)

Berikut flow sistem klinik dari awal sampai akhir.

---

## 1️⃣ Pendaftaran Pasien — *Resepsionis*

1. Login sebagai resepsionis.
2. Klik **Pendaftaran Baru**.
3. Masukkan data pasien (contoh: "Ibu Ani").
4. Klik **Daftar**.
5. Pasien masuk otomatis ke **antrian dokter**.

**Fitur:** Real-time queue tanpa refresh.

---

## 2️⃣ Pemeriksaan Medis — *Dokter*

1. Login sebagai dokter.
2. Pasien "Ibu Ani" muncul di antrian.
3. Klik untuk membuka halaman pemeriksaan.
4. Isi data:

   * Body Map
   * Vital Sign
   * Diagnosa (ICD-10 auto-complete)
   * Resep obat
5. Klik **Simpan & Kirim ke Apotek**.

**Fitur:** Body map interaktif, rekam medis lengkap, e-prescription.

---

## 3️⃣ Farmasi — *Apoteker*

1. Login sebagai apoteker.
2. Resep masuk otomatis melalui auto-polling.
3. Klik resep.
4. Cek stok obat.
5. Klik **Selesai Racik & Kirim ke Kasir**.

**Fitur:** Resep real-time tanpa refresh.

---

## 4️⃣ Pembayaran — *Kasir*

1. Login sebagai kasir.
2. Tagihan pasien muncul otomatis.
3. Klik invoice.
4. Biaya jasa dokter & obat dihitung otomatis.
5. Klik **Konfirmasi Pembayaran**.

(Opsional) Cetak struk pembayaran.

---

## 5️⃣ Laporan & Arsip — *Owner*

1. Login sebagai owner.
2. Dashboard menampilkan laporan omzet.
3. Buka Arsip Pasien.
4. Cari "Ibu Ani".
5. Buka file rekam medis.

**Fitur:** EMR viewer lengkap & laporan keuangan.

---

# 💻 Cara Menjalankan Aplikasi

Jalankan 2 terminal:

### Terminal 1 — Backend

```
npx json-server db.json --port 3032 --watch
```

### Terminal 2 — Frontend

```
npm run dev
```

---

Jika perlu, README ini bisa ditambahkan diagram, screenshot, atau ERD.
