# LensAjar — Core Microservice

Microservice inti untuk LensAjar: menerima hasil pemindaian objek lalu
mengembalikan topik belajar lintas mata pelajaran yang relevan, serta
konten pembelajaran yang dipersonalisasi untuk tiap topik.

## Arsitektur singkat

```
Client (mobile app)
      |
      v
Cloudflare Tunnel (imut.stei.site/api/*)
      |
      v
Docker container "lensajar-core" (port 80, di STB)
```

Service ini merepresentasikan bounded context **Core Subdomain** dari
model DDD LensAjar: menerima input objek hasil scan, lalu memetakannya
ke kandidat topik lintas pelajaran, dan menyediakan konten belajar yang
dipersonalisasi per topik.

## Menjalankan

```bash
docker compose up -d --build
```

Service akan listen di port 80 pada host (STB).

## Autentikasi

Semua endpoint selain `/api/health` membutuhkan header:

```
x-api-key: lensajar-demo-key
```

(Nilai `API_KEY` bisa diganti lewat environment variable di `docker-compose.yml`.)

## Endpoints

### `GET /api/health`
Health check, tanpa autentikasi.

**Response**
```json
{ "status": "ok", "service": "lensajar-core", "time": "2026-11-21T09:00:00.000Z" }
```

### `POST /api/scan`
Mengirim nama objek hasil deteksi, menerima kandidat topik lintas pelajaran.

**Headers**: `x-api-key: lensajar-demo-key`

**Body**
```json
{ "object": "apple" }
```

**Response**
```json
{
  "object": "apple",
  "candidate_topics": [
    { "subject": "Biologi", "topic": "Fotosintesis & struktur buah" },
    { "subject": "Matematika", "topic": "Pecahan & pembagian (potong apel)" },
    { "subject": "Bahasa Inggris", "topic": "Vocabulary: fruits" }
  ]
}
```

### `GET /api/content/:topic`
Mengambil konten belajar yang dipersonalisasi untuk sebuah topik.

**Headers**: `x-api-key: lensajar-demo-key`

**Contoh**
```
GET /api/content/Fotosintesis%20%26%20struktur%20buah
```

**Response**
```json
{
  "topic": "Fotosintesis & struktur buah",
  "summary": "Materi tentang bagaimana tumbuhan menghasilkan makanan lewat fotosintesis, dikaitkan dengan struktur buah seperti apel.",
  "level": "SMP",
  "resources": ["video:fotosintesis-dasar", "quiz:struktur-buah-01"]
}
```

## Akses publik

Service ini diekspos lewat Cloudflare Tunnel (tanpa open port) pada:

```
https://imut.stei.site/api/
```

## Deployment

- Dijalankan sebagai container Docker di STB kelompok.
- Resource dibatasi: `mem_limit: 256m`, `cpus: 0.5`.
- `restart: unless-stopped` agar otomatis jalan lagi jika STB restart.
