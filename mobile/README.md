# LensAjar Mobile

Aplikasi React Native (Expo) untuk Tugas Besar II3140 PWAM × II3160 TST.
LensAjar mengubah benda di sekitar siswa (daun, roda sepeda, jam dinding, …)
menjadi pintu masuk belajar lintas mapel: **satu objek, banyak topik**.

## Menjalankan (Expo Go)

```bash
npm install
npx expo start
```

Pindai QR dengan aplikasi **Expo Go**. Semua library yang dipakai sudah ada di Expo Go.

Unit test:

```bash
npm test
```

## Konfigurasi `.env`

```
EXPO_PUBLIC_API_URL=https://imut.stei.site/api   # microservice LensAjar (STB)
EXPO_PUBLIC_API_KEY=lensajar-demo-key
```

## Struktur

```
lensajar-mobile-fresh/
├── app/                      layar (Expo Router: satu file = satu rute)
│   ├── _layout.js            Stack utama + penjaga login (Stack.Protected)
│   ├── login.js              Masuk / Daftar + validasi form
│   ├── (tabs)/
│   │   ├── _layout.js        tab bar melayang
│   │   ├── index.js          Beranda: sapaan, statistik, progres hari ini, topik
│   │   ├── scan.js           Scan Objek -> Topik Kandidat
│   │   ├── progres.js        Streak, minggu ini, per mapel, pencapaian
│   │   ├── koleksi.js        Koleksi Belajar (objek tersimpan)
│   │   └── profil.js         Gaya belajar, target harian, status server, keluar
│   └── materi/[id].js        Detail materi (dipersonalisasi) + kuis
├── src/
│   ├── services/ApiService.js  semua pemanggilan API (timeout, token, fallback)
│   ├── lib/
│   │   ├── auth.js           AuthContext: login/daftar, sesi, data belajar
│   │   ├── storage.js        penyimpanan token & data (AsyncStorage)
│   │   ├── validation.js     validasi form
│   │   ├── progress.js       streak, ringkasan, rekomendasi (fungsi murni)
│   │   ├── catalog.js        katalog objek & modul cadangan (offline)
│   │   └── theme.js          warna, font Nunito, bayangan
│   └── components/           ui.js, Mascot.js, TabBar.js, TopicRow.js
└── __tests__/                unit test Jest
```

## Pemetaan ke DDD (makalah Tugas 1)

| Bounded context / subdomain | Di aplikasi |
|---|---|
| Pengenalan & Interaksi Objek (core) | `scan.js`, `ApiService.scanObject` → `POST /scan`, koleksi |
| Kurikulum & Konten (supporting) | `materi/[id].js`, `ApiService.getContent` → `GET /content/:topic` |
| Personalisasi Jalur Belajar (core) | gaya belajar di Profil mengatur urutan blok materi + tips; rekomendasi di Beranda |
| Pelacakan Progres & Evaluasi (supporting) | kuis → event *MateriDiselesaikan* → `progress.js` (streak, pencapaian) |
| Autentikasi & Profil (generic) | `login.js`, `lib/auth.js` → `POST /auth/login`, `/auth/register` |

## Login & mode lokal

Aplikasi mencoba `POST /auth/login` / `/auth/register` ke microservice dan menyimpan
JWT (`Authorization: Bearer`). Jika endpoint belum ada atau server mati, akun dibuat
**di HP (mode lokal)** supaya alur login tetap bisa didemokan. Label "Akun lokal / Akun
server" terlihat di Profil.

## Penanganan kondisi

- **Loading**: indikator di Scan dan Materi.
- **Error**: pesan jelas + tombol "Coba lagi"; request diberi timeout 8 detik.
- **Kosong**: Koleksi kosong, semua modul selesai.
- **Server mati**: `scanObject`/`getContent` memakai katalog cadangan dan
  menampilkan badge "Server tidak terjangkau — memakai data offline".

## Catatan

- Scan kamera belum aktif (tombol kamera menampilkan "segera hadir"); objek dipilih
  lewat teks/chip. Model pengenalan gambar bisa dipasang nanti tanpa mengubah kontrak
  `POST /scan`.
- Integrasi API ≥ 2 kelompok lain dijadwalkan di milestone berikutnya (M15).
