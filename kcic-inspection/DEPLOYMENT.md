# Deployment ke Vercel

Berikut adalah panduan lengkap untuk mendeploy aplikasi KCIC Inspection ke Vercel.

## Metode 1: Deployment melalui Vercel Dashboard (Rekomendasi)

1. **Push kode ke GitHub**
   - Pastikan semua file proyek sudah di-push ke repository GitHub
   - Proyek ini sudah siap dengan konfigurasi `vercel.json`

2. **Hubungkan dengan Vercel**
   - Buka [vercel.com](https://vercel.com) dan login
   - Klik "Add New..." → "Project"
   - Import repository GitHub Anda

3. **Konfigurasi Project**
   - Vercel akan otomatis mendeteksi ini sebagai proyek React/Vite
   - Pastikan pengaturan berikut:
     - **Framework Preset**: Vite
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`
     - **Install Command**: `npm install`

4. **Deploy**
   - Klik "Deploy"
   - Tunggu proses build dan deployment selesai
   - Aplikasi Anda akan live di URL yang diberikan Vercel

## Metode 2: Deployment dengan Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login ke Vercel**
   ```bash
   vercel login
   ```

3. **Deploy dari direktori proyek**
   ```bash
   cd kcic-inspection
   vercel
   ```

4. **Ikuti instruksi**
   - Pilih tim (jika ada)
   - Konfirmasi nama proyek
   - Pilih direktori (biarkan default)
   - Vercel akan otomatis mendeteksi pengaturan yang benar

## Konfigurasi Khusus

Proyek ini sudah dilengkapi dengan:
- `vercel.json` untuk konfigurasi deployment Vercel
- Konfigurasi routing untuk SPA (Single Page Application)
- Build otomatis dengan Vite

## Environment Variables

Jika aplikasi Anda memerlukan environment variables:
1. Di Vercel Dashboard, buka project settings
2. Pilih "Environment Variables"
3. Tambahkan variables yang diperlukan
4. Redeploy untuk menerapkan perubahan

## Custom Domain (Opsional)

1. Di Vercel Dashboard, buka project settings
2. Pilih "Domains"
3. Tambahkan custom domain Anda
4. Ikuti instruksi untuk konfigurasi DNS

## Troubleshooting

Jika mengalami masalah:
- Pastikan `npm run build` berjalan sukses di lokal
- Periksa log build di Vercel Dashboard
- Pastikan semua dependencies terinstall dengan benar
- Untuk masalah routing, pastikan `vercel.json` sudah dikonfigurasi dengan benar

## Preview Deployments

Setiap push ke branch baru akan otomatis membuat preview deployment:
- Push ke branch baru: `git push origin feature-branch`
- Vercel akan membuat URL preview untuk branch tersebut
- Bagus untuk testing sebelum merge ke main