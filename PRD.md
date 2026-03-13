Tentu, ini adalah **Product Requirements Document (PRD)** yang dirancang khusus untuk pengembangan aplikasi **Coordinate Checker** menggunakan **SolidStart**. Dokumen ini disusun agar mudah dipahami oleh tim pengembang maupun asisten AI seperti Antigravity.

---

# Product Requirements Document (PRD): Coordinate Checker PWA

**Versi:** 1.0

**Status:** Draft / Siap Eksekusi

**Teknologi Utama:** SolidStart, IndexedDB, Tailwind CSS

---

## 1. Ringkasan Proyek

**Coordinate Checker** adalah aplikasi web berbasis PWA (Progressive Web App) sederhana yang memungkinkan pengguna memantau koordinat GPS (Latitude & Longitude) mereka secara *real-time* melalui perangkat mobile. Aplikasi ini fokus pada fungsionalitas cepat untuk melihat posisi saat ini dan menyimpan titik koordinat tertentu ke penyimpanan lokal perangkat tanpa memerlukan server eksternal.

## 2. Tujuan Utama

* Memberikan visualisasi koordinat GPS yang akurat dan *real-time*.
* Menyediakan fitur penyimpanan titik koordinat secara lokal (offline-first).
* Menghasilkan aplikasi yang ringan, cepat, dan dapat diinstal di handphone (PWA).

## 3. Fitur Utama (Core Features)

### A. Real-time Coordinate Tracking

* Aplikasi meminta izin lokasi saat dibuka.
* Menampilkan **Latitude**, **Longitude**, dan **Accuracy** (dalam meter) secara dinamis.
* Update data secara otomatis setiap kali perangkat berpindah posisi menggunakan Geolocation API.

### B. "Save Current Coordinate"

* Tombol aksi cepat untuk menyimpan posisi saat ini.
* Setiap data yang disimpan akan mencatat: Latitude, Longitude, Timestamp, dan label (opsional).

### C. Saved History List

* Daftar koordinat yang telah disimpan.
* Fitur untuk menghapus data lama atau menyalin koordinat ke *clipboard*.

### D. PWA Capabilities

* Dapat diinstal ke *homescreen* (Add to Home Screen).
* Dapat diakses secara offline (Service Workers).

---

## 4. Spesifikasi Teknis & Stack

| Komponen | Teknologi |
| --- | --- |
| **Framework** | **SolidStart** (Solid.js) |
| **Styling** | Tailwind CSS (Modern & Minimalist) |
| **Database** | **IndexedDB** (via `Dexie.js` atau Native) – *No external DB required*. |
| **Icons** | Lucide React / Phosphor Icons |
| **API** | Browser Geolocation API |

---

## 5. Skema Data (Database Ringan)

Data akan disimpan di dalam **IndexedDB** pada browser pengguna.

**Store: `coordinates**`

* `id`: Auto-increment integer (Primary Key)
* `latitude`: Float
* `longitude`: Float
* `accuracy`: Float
* `timestamp`: ISO String / Date
* `label`: String (Default: "Point [timestamp]")

---

## 6. Alur Pengguna (User Journey)

1. **Akses:** User membuka URL aplikasi di browser HP.
2. **Izin:** User memberikan izin akses lokasi (GPS).
3. **Monitoring:** User melihat angka koordinat yang terus berubah secara *real-time* di layar utama.
4. **Penyimpanan:** User menekan tombol **"Simpan Posisi"**. Muncul notifikasi "Koordinat tersimpan".
5. **Review:** User menggulir layar ke bawah (atau ke tab History) untuk melihat daftar koordinat yang sudah disimpan sebelumnya.

---

## 7. Desain Antarmuka (UI/UX) - Guidance

* **Tema:** Dark/Light mode support (utamakan Dark Mode untuk hemat baterai saat di lapangan).
* **Header:** Judul "Coordinate Checker" dengan status koneksi GPS (Active/Inactive).
* **Hero Section:** Teks besar yang menampilkan angka Latitude & Longitude agar mudah dibaca di bawah sinar matahari.
* **Floating Action Button (FAB):** Tombol "Save" yang mencolok di bagian bawah tengah.
* **List Section:** Kartu-kartu sederhana untuk menampilkan riwayat koordinat yang tersimpan.

---

## 8. Kriteria Penerimaan (Acceptance Criteria)

* [ ] Aplikasi berhasil mendeteksi lokasi dalam waktu kurang dari 5 detik setelah izin diberikan.
* [ ] Data koordinat terupdate secara otomatis tanpa perlu *refresh* halaman.
* [ ] Data yang disimpan tetap ada meskipun browser ditutup atau HP direstart (Persistent Storage).
* [ ] Manifest PWA berfungsi sehingga muncul opsi "Install App" di Android/iOS.

---
