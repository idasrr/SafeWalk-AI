# SafeWalk AI — Next.js App

Aplikasi keamanan perjalanan malam berbasis AI dengan fitur deteksi kata kunci, tombol SOS otomatis, dan prediksi risiko.

## Struktur Project

```
safewalk-ai/
├── app/
│   ├── layout.js          # Root layout
│   ├── globals.css        # Global styles + animasi
│   ├── page.js            # Splash screen (/)
│   ├── register/
│   │   └── page.js        # Halaman registrasi 3-step (/register)
│   └── dashboard/
│       └── page.js        # Dashboard utama (/dashboard)
├── components/
│   ├── SOSModal.js        # Modal SOS dengan countdown
│   ├── KeywordListener.js # Web Speech API listener
│   └── riskPredictor.js   # Logika prediksi risiko
├── package.json
├── next.config.mjs
├── tailwind.config.js
└── postcss.config.js
```

## Cara Menjalankan Lokal

```bash
# 1. Install dependencies
npm install

# 2. Jalankan dev server
npm run dev
```

Buka browser ke **http://localhost:3000**

> Gunakan browser Chrome/Edge untuk fitur Web Speech API (deteksi kata kunci).

## Deploy ke Vercel

### Cara 1 — Lewat GitHub (Recommended)

```bash
# Push ke GitHub
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/USERNAME/safewalk-ai.git
git push -u origin main
```

Lalu buka **https://vercel.com** → "Add New Project" → Import repo → Deploy.

### Cara 2 — Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Untuk production
vercel --prod
```

## Fitur

| Fitur | Keterangan |
|---|---|
| 🎤 Deteksi Kata Kunci | Web Speech API, bahasa Indonesia, berjalan di background |
| 🚨 Tombol SOS | Countdown 5 detik → auto-call + WhatsApp |
| 📍 GPS Tracking | Lokasi real-time via browser Geolocation API |
| 🔮 Prediksi Risiko | Berdasarkan jam, kondisi jalan, pencahayaan, cuaca |
| 👥 Manajemen Kontak | Simpan kontak keluarga & penjaga keamanan |
| 📱 Mobile-first | Desain responsif, max-width 448px |

## Catatan Penting

- Fitur **deteksi suara** hanya bekerja di **Chrome/Edge** (Web Speech API)
- Izin **mikrofon** dan **lokasi** harus diizinkan oleh pengguna
- Data disimpan di **localStorage** browser (tidak perlu backend)
- Tombol SOS menggunakan `tel:` untuk panggilan dan `wa.me` untuk WhatsApp
