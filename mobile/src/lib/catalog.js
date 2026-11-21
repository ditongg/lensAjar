// Katalog cadangan (offline) yang meniru kontrak microservice LensAjar.
// Dipakai ApiService saat server tidak terjangkau, agar aplikasi tetap
// bisa didemokan dan tidak crash.
//  - OBJECTS  : Konteks Pengenalan & Interaksi Objek (Objek -> Topik Kandidat)
//  - MODULES  : Konteks Kurikulum & Konten Pembelajaran (Modul + kuis)

export const OBJECTS = [
  { id: "daun", name: "Daun", emoji: "🍃", aliases: ["leaf", "dedaunan"], topics: ["fotosintesis", "pola-simetri"] },
  { id: "roda-sepeda", name: "Roda Sepeda", emoji: "🚲", aliases: ["roda", "sepeda", "wheel", "bicycle"], topics: ["gerak-rotasi", "lingkaran"] },
  { id: "jendela", name: "Jendela", emoji: "🪟", aliases: ["window", "kaca"], topics: ["cahaya-pembiasan", "bangun-datar"] },
  { id: "uang-kertas", name: "Uang Kertas", emoji: "💵", aliases: ["uang", "money", "rupiah"], topics: ["nilai-uang", "pecahan-desimal"] },
  { id: "apel", name: "Apel", emoji: "🍎", aliases: ["apple", "buah"], topics: ["gizi-seimbang", "gravitasi", "pecahan-desimal"] },
  { id: "buku", name: "Buku", emoji: "📖", aliases: ["book"], topics: ["ide-pokok", "bangun-ruang"] },
  { id: "gelas-air", name: "Gelas Air", emoji: "🥛", aliases: ["gelas", "air", "glass", "cup", "water"], topics: ["wujud-zat", "volume"] },
  { id: "jam-dinding", name: "Jam Dinding", emoji: "🕰️", aliases: ["jam", "clock"], topics: ["satuan-waktu", "sudut"] },
  { id: "bola", name: "Bola", emoji: "⚽", aliases: ["ball"], topics: ["bangun-ruang", "gaya-gerak"] },
  { id: "lampu", name: "Lampu", emoji: "💡", aliases: ["lamp", "bohlam", "bulb"], topics: ["rangkaian-listrik"] },
];

const M = (id, title, subject, level, minutes, summary, keyPoints, activity, quiz) => ({
  id, title, subject, level, minutes, summary, keyPoints, activity, quiz,
  resources: [{ title: `Wikipedia: ${title}`, url: `https://id.wikipedia.org/w/index.php?search=${encodeURIComponent(title)}` }],
});

export const MODULES = [
  M("fotosintesis", "Fotosintesis", "Biologi", "SD", 6,
    "Daun menangkap cahaya matahari dengan klorofil, lalu mengubah air dan karbon dioksida menjadi glukosa dan oksigen.",
    ["Klorofil = zat hijau daun penangkap cahaya.", "Bahan: air + CO₂ + cahaya.", "Hasil: glukosa dan oksigen."],
    "Tutup sebagian daun dengan aluminium foil selama 3 hari, lalu bandingkan warnanya.",
    [{ q: "Zat hijau daun disebut…", options: ["Klorofil", "Glukosa", "Stomata", "Oksigen"], answer: 0 },
     { q: "Gas yang dilepas saat fotosintesis?", options: ["CO₂", "Nitrogen", "Oksigen", "Hidrogen"], answer: 2 }]),
  M("pola-simetri", "Pola & Simetri", "Matematika", "SD", 5,
    "Jika daun dilipat tepat di tulang tengahnya, kedua sisinya hampir sama. Garis lipatan itu disebut sumbu simetri.",
    ["Sumbu simetri membagi bangun jadi dua bagian sama.", "Pola = susunan yang berulang teratur."],
    "Lipat beberapa daun di tulang tengahnya. Mana yang paling simetris?",
    [{ q: "Garis yang membagi bangun jadi dua bagian sama…", options: ["Diagonal", "Sumbu simetri", "Jari-jari", "Sisi"], answer: 1 },
     { q: "Jumlah sumbu simetri persegi?", options: ["1", "2", "4", "0"], answer: 2 }]),
  M("gerak-rotasi", "Gerak & Rotasi", "Fisika", "SMP", 7,
    "Roda sepeda berputar pada porosnya (gerak rotasi). Satu putaran penuh membuat sepeda maju sejauh keliling roda.",
    ["Rotasi: benda berputar pada porosnya.", "1 putaran = maju sejauh keliling roda.", "rpm = rotasi per menit."],
    "Tandai ban dengan kapur, dorong sepeda satu putaran, ukur jaraknya.",
    [{ q: "Satu putaran, sepeda maju sejauh…", options: ["Jari-jari", "Diameter", "Keliling roda", "Luas roda"], answer: 2 },
     { q: "rpm berarti…", options: ["Rotasi per menit", "Roda per meter", "Rata-rata per menit", "Rotasi per meter"], answer: 0 }]),
  M("lingkaran", "Keliling & Luas Lingkaran", "Matematika", "SD", 6,
    "Roda, piring, dan jam berbentuk lingkaran. Keliling K = π × d dan luas L = π × r², dengan π ≈ 22/7.",
    ["d = 2 × r", "K = π × d", "L = π × r²"],
    "Ukur diameter roda sepeda lalu hitung kelilingnya.",
    [{ q: "Roda d = 70 cm, kelilingnya (π=22/7)…", options: ["110 cm", "220 cm", "154 cm", "440 cm"], answer: 1 },
     { q: "Rumus luas lingkaran…", options: ["π × d", "2πr", "π × r²", "r × r"], answer: 2 }]),
  M("cahaya-pembiasan", "Cahaya & Pembiasan", "Fisika", "SMP", 6,
    "Cahaya berbelok ketika melewati dua medium berbeda, misalnya udara ke kaca atau air. Ini disebut pembiasan.",
    ["Kaca bening meneruskan cahaya.", "Pensil di gelas air tampak patah karena pembiasan."],
    "Masukkan pensil ke gelas berisi air dan amati dari samping.",
    [{ q: "Pensil di air tampak patah karena…", options: ["Pemantulan", "Pembiasan", "Penguapan", "Gravitasi"], answer: 1 },
     { q: "Benda yang meneruskan cahaya disebut…", options: ["Opak", "Bening", "Buram", "Gelap"], answer: 1 }]),
  M("bangun-datar", "Bangun Datar", "Matematika", "SD", 5,
    "Jendela biasanya berbentuk persegi panjang dengan luas L = p × l dan keliling K = 2 × (p + l).",
    ["Persegi panjang: L = p × l", "Setiap sudutnya 90°."],
    "Ukur jendela kamarmu dan hitung luas kacanya.",
    [{ q: "Jendela 120 × 80 cm, luasnya…", options: ["200 cm²", "400 cm²", "9.600 cm²", "960 cm²"], answer: 2 },
     { q: "Sudut persegi panjang besarnya…", options: ["45°", "60°", "90°", "180°"], answer: 2 }]),
  M("nilai-uang", "Uang & Ekonomi", "IPS", "SD", 5,
    "Uang adalah alat tukar yang sah. Rupiah diedarkan Bank Indonesia dan punya ciri keaslian seperti tanda air.",
    ["Fungsi uang: alat tukar, satuan hitung, penyimpan nilai.", "Cek keaslian: dilihat, diraba, diterawang."],
    "Terawang uang kertas ke arah cahaya, temukan tanda airnya.",
    [{ q: "Yang mengedarkan Rupiah…", options: ["Kemenkeu", "Bank Indonesia", "OJK", "Bank swasta"], answer: 1 },
     { q: "Cara cek keaslian 3D…", options: ["Lipat, cium, bakar", "Lihat, raba, terawang", "Hitung, timbang, foto", "Sobek, simpan, tukar"], answer: 1 }]),
  M("pecahan-desimal", "Pecahan & Desimal", "Matematika", "SD", 6,
    "Apel yang dipotong 4 sama besar: tiap potong ¼ atau 0,25. Pecahan dan desimal adalah dua cara menulis bagian.",
    ["½ = 0,5 dan ¼ = 0,25", "Rp500 adalah ½ dari Rp1.000"],
    "Potong buah jadi 2, 4, lalu 8 bagian dan tulis pecahannya.",
    [{ q: "¾ dalam desimal…", options: ["0,34", "0,75", "0,43", "7,5"], answer: 1 },
     { q: "Rp250 adalah … dari Rp1.000", options: ["½", "⅓", "¼", "⅕"], answer: 2 }]),
  M("gizi-seimbang", "Gizi Seimbang", "Biologi", "SD", 5,
    "Buah mengandung vitamin, serat, dan air. Isi Piringku: setengah piring sayur dan buah, setengah makanan pokok dan lauk.",
    ["Karbohidrat = energi, protein = pembangun.", "Vitamin & mineral menjaga daya tahan."],
    "Catat makananmu hari ini dan kelompokkan.",
    [{ q: "Sumber energi utama…", options: ["Vitamin", "Karbohidrat", "Mineral", "Air"], answer: 1 },
     { q: "Setengah piring sebaiknya…", options: ["Nasi", "Daging", "Sayur & buah", "Gorengan"], answer: 2 }]),
  M("gravitasi", "Gaya Gravitasi", "Fisika", "SMP", 6,
    "Apel jatuh karena ditarik gravitasi bumi. Berat = massa × percepatan gravitasi (≈ 9,8 m/s²).",
    ["Gravitasi menarik benda ke pusat bumi.", "W = m × g"],
    "Jatuhkan bola dan kertas remas bersamaan. Mana yang duluan?",
    [{ q: "Massa 2 kg, beratnya (g=10)…", options: ["2 N", "12 N", "20 N", "200 N"], answer: 2 },
     { q: "Ilmuwan kisah apel jatuh…", options: ["Einstein", "Newton", "Galileo", "Archimedes"], answer: 1 }]),
  M("ide-pokok", "Ide Pokok Bacaan", "Bahasa Indonesia", "SD", 5,
    "Setiap paragraf punya satu ide pokok, biasanya di kalimat pertama (deduktif) atau terakhir (induktif).",
    ["Ide pokok = gagasan utama.", "Kalimat penjelas mendukung ide pokok."],
    "Baca satu paragraf buku, tulis ide pokoknya dalam satu kalimat.",
    [{ q: "Ide pokok di awal disebut…", options: ["Induktif", "Deduktif", "Campuran", "Naratif"], answer: 1 },
     { q: "Kalimat pendukung ide pokok…", options: ["Utama", "Penjelas", "Tanya", "Perintah"], answer: 1 }]),
  M("bangun-ruang", "Bangun Ruang", "Matematika", "SD", 6,
    "Buku berbentuk balok (V = p × l × t), bola sepak berbentuk bola (V = 4/3 × π × r³).",
    ["Balok: V = p × l × t", "Kubus: V = s³"],
    "Ukur buku pelajaranmu dan hitung volumenya.",
    [{ q: "Buku 20×15×2 cm, volumenya…", options: ["37 cm³", "300 cm³", "600 cm³", "6.000 cm³"], answer: 2 },
     { q: "Bola sepak termasuk…", options: ["Tabung", "Kerucut", "Bola", "Prisma"], answer: 2 }]),
  M("wujud-zat", "Wujud Zat", "Kimia", "SD", 5,
    "Air bisa membeku jadi es (padat) atau menguap jadi uap (gas). Embun di luar gelas dingin adalah pengembunan.",
    ["Padat, cair, gas.", "Gas → cair = mengembun."],
    "Isi gelas dengan es dan amati sisi luarnya setelah 5 menit.",
    [{ q: "Gas menjadi cair disebut…", options: ["Menguap", "Mengembun", "Membeku", "Menyublim"], answer: 1 },
     { q: "Es mencair berubah dari…", options: ["Cair→padat", "Padat→cair", "Gas→cair", "Cair→gas"], answer: 1 }]),
  M("volume", "Volume & Liter", "Matematika", "SD", 4,
    "Gelas dan botol punya volume. 1 liter = 1.000 mL = 1 dm³.",
    ["1 L = 1.000 mL", "Gelas biasa ± 250 mL"],
    "Hitung berapa gelas untuk mengisi botol 1,5 liter.",
    [{ q: "2,5 liter = …", options: ["25 mL", "250 mL", "2.500 mL", "25.000 mL"], answer: 2 },
     { q: "Gelas 250 mL untuk 1 liter…", options: ["2", "4", "5", "10"], answer: 1 }]),
  M("satuan-waktu", "Satuan Waktu", "Matematika", "SD", 4,
    "Jam dinding punya jarum jam, menit, dan detik. 1 jam = 60 menit, 1 menit = 60 detik.",
    ["1 hari = 24 jam", "Pukul 15.00 = 3 sore"],
    "Catat jam berangkat dan pulang sekolah, hitung lamanya.",
    [{ q: "2 jam 30 menit = …", options: ["130 menit", "150 menit", "230 menit", "90 menit"], answer: 1 },
     { q: "Pukul 19.00 = pukul…", options: ["7 pagi", "9 malam", "7 malam", "5 sore"], answer: 2 }]),
  M("sudut", "Mengenal Sudut", "Matematika", "SD", 5,
    "Jarum jam membentuk sudut. Pukul 3.00 = siku-siku (90°), pukul 6.00 = sudut lurus (180°).",
    ["Lancip < 90° < tumpul", "Tiap angka jam berjarak 30°"],
    "Gambar jam pukul 2, 3, dan 5. Tentukan jenis sudutnya.",
    [{ q: "Sudut jarum pukul 3.00…", options: ["30°", "60°", "90°", "180°"], answer: 2 },
     { q: "Sudut 90°–180° disebut…", options: ["Lancip", "Siku-siku", "Tumpul", "Refleks"], answer: 2 }]),
  M("gaya-gerak", "Gaya & Gerak", "Fisika", "SD", 5,
    "Bola yang ditendang bergerak karena gaya dorong. Gaya gesek membuat bola melambat lalu berhenti.",
    ["Gaya = tarikan atau dorongan.", "Gaya bisa mengubah arah, kecepatan, bentuk."],
    "Gelindingkan bola di keramik lalu di rumput. Mana yang berhenti lebih cepat?",
    [{ q: "Gaya yang memperlambat bola di rumput…", options: ["Magnet", "Gesek", "Pegas", "Listrik"], answer: 1 },
     { q: "Gaya TIDAK mengubah…", options: ["Arah", "Kecepatan", "Bentuk", "Warna"], answer: 3 }]),
  M("rangkaian-listrik", "Rangkaian Listrik", "Fisika", "SMP", 7,
    "Lampu menyala jika arus mengalir dalam rangkaian tertutup. Lampu rumah dipasang paralel.",
    ["Seri: satu padam, semua padam.", "Paralel: lainnya tetap menyala."],
    "Bersama pendamping, susun baterai, kabel, dan lampu senter kecil.",
    [{ q: "Lampu rumah dipasang…", options: ["Seri", "Paralel", "Terbuka", "Tunggal"], answer: 1 },
     { q: "Arus mengalir pada rangkaian…", options: ["Terbuka", "Tertutup", "Putus", "Kosong"], answer: 1 }]),
];

const norm = (s) => String(s || "").toLowerCase().replace(/[^a-z0-9 -]/g, "").replace(/\s+/g, " ").trim();

export function findModule(key) {
  const k = norm(key);
  return MODULES.find((m) => m.id === k || norm(m.title) === k) || null;
}

export function findObject(id) {
  return OBJECTS.find((o) => o.id === id) || null;
}

// Meniru POST /scan: nama objek -> Topik Kandidat lintas mapel
export function recognizeLocal(label) {
  const q = norm(label);
  if (!q) return null;
  const match = (o) => o.id === q.replace(/ /g, "-") || norm(o.name) === q || o.aliases.includes(q);
  const loose = (o) => q.includes(norm(o.name)) || o.aliases.some((a) => q.includes(a));
  const obj = OBJECTS.find(match) || OBJECTS.find(loose);
  if (!obj) return null;
  return {
    object: label,
    detected: { id: obj.id, name: obj.name, emoji: obj.emoji },
    candidate_topics: obj.topics.map(findModule).filter(Boolean).map(toTopic),
  };
}

export const toTopic = (m) => ({ id: m.id, topic: m.title, subject: m.subject, level: m.level, minutes: m.minutes });
