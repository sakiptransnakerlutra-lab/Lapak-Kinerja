# Panduan Memasang (Deploy / Embed) Aplikasi E-SAKIP & LKE pada Google Sites

Panduan ini berisi langkah-langkah lengkap untuk memasang dan menampilkan sistem **E-SAKIP & LKE Dinas Transmigrasi dan Tenaga Kerja Kabupaten Luwu Utara** ke dalam **Google Sites** ([sites.google.com](https://sites.google.com/)).

---

## URL Aplikasi yang Digunakan:
Gunakan salah satu dari URL berikut:
- **URL Aplikasi Utama (Production/Shared):**  
  `https://ais-pre-yljs53yeklsjvvpmsdbu3r-339035356527.asia-southeast1.run.app`
- **URL Google Apps Script Web App (Jika menggunakan GAS):**  
  `https://script.google.com/macros/s/[ID_DEPLOYMENT]/exec`
- **URL GitHub Pages (Jika menggunakan GitHub):**  
  `https://[username].github.io/[nama-repo]/`

---

## METODE 1: Sematkan Halaman Penuh (Full Page Embed) — *Sangat Disarankan*
Metode ini adalah cara paling rapi dan profesional di Google Sites karena aplikasi akan tampil 100% memenuhi satu halaman tanpa batas bingkai (*border*) yang terpotong.

### Langkah-langkah:
1. Buka [https://sites.google.com/](https://sites.google.com/) dan buka situs Google Sites Dinas Transnaker Anda.
2. Di panel sebelah kanan, klik menu tab **Halaman (Pages)**.
3. Arahkan kursor ke tombol tambah **(+)** di bagian bawah, lalu pilih ikon **Sematkan Halaman Penuh (Full page embed)**.
4. Beri nama halaman, misalnya: **`E-SAKIP & LKE 2026`** lalu klik **Selesai (Done)**.
5. Pada halaman yang baru dibuat, klik tombol biru **Tambahkan Sematan (Add embed)**.
6. Pilih tab **Berdasarkan URL (By URL)**.
7. Tempelkan (*paste*) URL aplikasi:  
   `https://ais-pre-yljs53yeklsjvvpmsdbu3r-339035356527.asia-southeast1.run.app`
8. Pilih opsi **Seluruh Halaman (Whole page)**, lalu klik **Sisipkan (Insert)**.
9. Aplikasi E-SAKIP & LKE akan langsung muncul memenuhi seluruh layar halaman Google Sites.

---

## METODE 2: Sematkan Kode Iframe (Embed Code) pada Halaman Tertentu
Gunakan metode ini jika Anda ingin menempatkan aplikasi di bawah teks sambutan Kepala Dinas, banner pengumuman, atau bagian tertentu dari halaman yang sudah ada.

### Langkah-langkah:
1. Buka halaman Google Sites yang ingin disisipkan aplikasi.
2. Di panel kanan, klik tab **Sisipkan (Insert)** > klik tombol **Sematkan (Embed)** (ikon `< >`).
3. Pilih tab **Sematkan Kode (Embed code)**.
4. Salin dan tempelkan kode HTML berikut:

```html
<iframe 
  src="https://ais-pre-yljs53yeklsjvvpmsdbu3r-339035356527.asia-southeast1.run.app" 
  style="width: 100%; height: 950px; border: none; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);" 
  allow="clipboard-read; clipboard-write; fullscreen">
</iframe>
```

5. Klik **Berikutnya (Next)**, lalu klik **Sisipkan (Insert)**.
6. Tarik titik biru di sudut bingkai agar lebar dan tingginya proporsional dan nyaman dilihat oleh pengguna.

---

## Langkah Terakhir: Publikasikan Situs (Publish)
1. Di pojok kanan atas Google Sites, klik tombol biru **Publikasikan (Publish)**.
2. Atur alamat web (Web address) Google Sites Anda.
3. Pada bagian *Siapa yang dapat melihat situs saya (Who can view my site)*:
   - Pilih **Publik (Public)** agar dapat diakses oleh evaluator provinsi, kemenpan-RB, atau publik.
   - Atau batasi **Hanya dalam organisasi** jika situs khusus untuk kalangan internal Pemkab Luwu Utara.
4. Klik **Publikasikan**.
5. Buka tautan situs yang dipublikasikan untuk menguji tampilan aplikasi dari komputer maupun smartphone.
