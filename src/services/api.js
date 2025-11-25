const API_BASE = '/api';

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Terjadi kesalahan');
  }
  return response.json();
};

export const apiService = {
  /** =======================
   * PASIEN
   * =======================*/
  getPasien: () => fetch(`${API_BASE}/pasien`).then(handleResponse),
  getPasienById: (id) => fetch(`${API_BASE}/pasien/${id}`).then(handleResponse),
  createPasien: (data) => 
    fetch(`${API_BASE}/pasien`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(handleResponse),
  updatePasien: (id, data) =>
    fetch(`${API_BASE}/pasien/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(handleResponse),

  /** =======================
   * ANTRIAN
   * =======================*/
  getAntrian: () => fetch(`${API_BASE}/antrian`).then(handleResponse),
  getAntrianByStatus: (status) => fetch(`${API_BASE}/antrian?status=${status}`).then(handleResponse),
  createAntrian: (data) =>
    fetch(`${API_BASE}/antrian`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(handleResponse),
  updateAntrian: (id, data) =>
    fetch(`${API_BASE}/antrian/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(handleResponse),
  deleteAntrian: (id) =>
    fetch(`${API_BASE}/antrian/${id}`, {
      method: 'DELETE'
    }).then(handleResponse),

  /** =======================
   * REKAM MEDIS
   * =======================*/
  getRekamMedis: () => fetch(`${API_BASE}/rekamMedis`).then(handleResponse),
  getRekamMedisByPasien: (pasienId) => 
    fetch(`${API_BASE}/rekamMedis?pasienId=${pasienId}`).then(handleResponse),
  createRekamMedis: (data) =>
    fetch(`${API_BASE}/rekamMedis`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(handleResponse),

  /** =======================
   * RESEP
   * =======================*/
  getResep: () => fetch(`${API_BASE}/resep`).then(handleResponse),
  getResepByStatus: (status) => fetch(`${API_BASE}/resep?status=${status}`).then(handleResponse),
  createResep: (data) =>
    fetch(`${API_BASE}/resep`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(handleResponse),
  updateResep: (id, data) =>
    fetch(`${API_BASE}/resep/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(handleResponse),

  /** =======================
   * OBAT (Apotek)
   * =======================*/
  getObat: () => fetch(`${API_BASE}/obat`).then(handleResponse),

  // Tambahan kode obat (sudah digabung)
  createObat: (data) =>
    fetch(`${API_BASE}/obat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(handleResponse),

  getObatByStokRendah: () =>
    fetch(`${API_BASE}/obat?stok_lte=20`).then(handleResponse),

  updateObat: (id, data) =>
    fetch(`${API_BASE}/obat/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(handleResponse),

  /** =======================
   * TRANSAKSI (Kasir)
   * =======================*/
  getTransaksi: () => fetch(`${API_BASE}/transaksi`).then(handleResponse),

  createTransaksi: (data) =>
    fetch(`${API_BASE}/transaksi`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(handleResponse),

  /** =======================
   * LAPORAN
   * =======================*/
  getLaporan: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetch(`${API_BASE}/laporan?${query}`).then(handleResponse);
  },

  /** =======================
   * UTILITY
   * =======================*/
  generateNoRegistrasi: async () => {
    const pasien = await fetch(`${API_BASE}/pasien`).then(handleResponse);
    const nextNumber = pasien.length + 1;
    return `REG${String(nextNumber).padStart(3, '0')}`;
  },

  generateNoAntrian: async () => {
    const antrian = await fetch(`${API_BASE}/antrian`).then(handleResponse);
    const nextNumber = antrian.length + 1;
    return `A${String(nextNumber).padStart(3, '0')}`;
  }
};
