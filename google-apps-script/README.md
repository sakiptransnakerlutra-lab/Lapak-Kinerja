# Panduan Pemasangan Web App di Google Apps Script (GAS)

Dokumen ini menjelaskan cara memasang aplikasi **E-SAKIP & LKE DINAS TRANSMIGRASI DAN TENAGA KERJA KABUPATEN LUWU UTARA** ke dalam **Google Apps Script** (`script.google.com`).

---

## Langkah-Langkah Pemasangan:

### 1. Buat Proyek Google Apps Script Baru
1. Buka browser dan kunjungi: [https://script.google.com/](https://script.google.com/)
2. Pastikan login dengan akun Google resmi Dinas: `sakip.transnakerlutra@gmail.com` (atau akun admin).
3. Klik tombol **"+ Proyek Baru"** (New Project) di kiri atas.
4. Ubah nama proyek (klik pada *Untitled project*) menjadi:
   **`E-SAKIP & LKE TRANSNAKER LUWU UTARA`**

---

### 2. Salin Kode `Code.gs`
1. Di panel file sebelah kiri, klik file bawaan **`Code.gs`**.
2. Hapus seluruh teks bawaan yang ada di editor.
3. Buka file `Code.gs` yang disediakan, lalu **Salin (Copy)** dan **Tempel (Paste)** seluruh isinya ke editor `Code.gs`.
4. Tekan **Ctrl + S** (atau ikon disket) untuk menyimpan.

---

### 3. Buat File `index.html`
1. Di panel file sebelah kiri, klik tanda tambah **`+`** di samping tulisan **Files**.
2. Pilih opsi **HTML**.
3. Beri nama file: **`index`** (secara otomatis menjadi `index.html`).
4. Hapus template bawaan, lalu **Salin (Copy)** dan **Tempel (Paste)** seluruh isi file `index.html` yang disediakan.
5. Tekan **Ctrl + S** untuk menyimpan.

---

### 4. Terapkan Sebagai Web App (Deploy)
1. Di pojok kanan atas, klik tombol biru **Terapkan (Deploy)** > pilih **Penerapan Baru (New deployment)**.
2. Di samping kiri tulisan *Pilih jenis (Select type)*, klik ikon gerigi ⚙️ dan pilih **Aplikasi Web (Web app)**.
3. Isi kolom konfigurasi berikut:
   - **Deskripsi (Description)**: `E-SAKIP & LKE SAKIP Transnaker Luwu Utara v1.0`
   - **Jalankan sebagai (Execute as)**: `Saya (email Anda)`
   - **Yang memiliki akses (Who has access)**: `Siapa saja (Anyone)` (atau `Hanya dalam organisasi` jika menggunakan Google Workspace Pemkab Luwu Utara).
4. Klik tombol **Terapkan (Deploy)**.
5. Jika muncul jendela permintaan izin akses (*Authorization Required*):
   - Klik **Tinjau Izin (Review Permissions)**.
   - Pilih akun Google Anda.
   - Jika muncul peringatan *"Google hasn't verified this app"*, klik **Lanjutan (Advanced)** di bawah > lalu klik **Buka E-SAKIP & LKE (tidak aman)**.
   - Klik **Izinkan (Allow)**.
6. Salin **URL Aplikasi Web** yang diberikan (formatnya: `https://script.google.com/macros/s/.../exec`).

---

## Fitur yang Didukung pada Versi Google Apps Script:
- ✅ **Akses Langsung**: Dapat dibuka oleh pimpinan, evaluator, dan operator dari HP maupun Laptop tanpa instalasi aplikasi tambahan.
- ✅ **Submenu Lengkap**: Penjelasan Penilaian, Rekap LKE, Data LKE (60 kriteria resmi), KKE PD, Juknis, dan Penjelasan Parameter.
- ✅ **Pengeditan Komponen & Aspek**: Kolom Komponen/Sub Komponen/Kriteria pada Data LKE serta Aspek Evaluasi dan Pertanyaan & Indikator Uji pada KKE PD dapat diedit secara langsung.
- ✅ **Logo Resmi Luwu Utara**: Tampilan logo Kabupaten Luwu Utara beresolusi tinggi dan proporsi asli.
- ✅ **Ekspor Excel & Cetak Dokumen**: Mendukung cetak format resmi dan unduh dokumen evidence.
