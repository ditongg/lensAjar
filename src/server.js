const express = require("express");
const app = express();
app.use(express.json({ limit: "5mb" }));

const PORT = process.env.PORT || 80;
const API_KEY = process.env.API_KEY || "lensajar-demo-key";

// --- very small in-memory "domain data" for Tugas 2 demo purposes ---
// In the real DDD model this would live behind the Object Recognition
// and Content Personalization bounded contexts / their own services.
const OBJECT_TO_TOPICS = {
  apple: [
    { subject: "Biologi", topic: "Fotosintesis & struktur buah" },
    { subject: "Matematika", topic: "Pecahan & pembagian (potong apel)" },
    { subject: "Bahasa Inggris", topic: "Vocabulary: fruits" }
  ],
  book: [
    { subject: "Bahasa Indonesia", topic: "Struktur teks naratif" },
    { subject: "Sejarah", topic: "Sejarah percetakan & penyebaran ilmu" }
  ],
  plant: [
    { subject: "Biologi", topic: "Fotosintesis & siklus hidup tumbuhan" },
    { subject: "Geografi", topic: "Ekosistem & habitat" }
  ]
};

const CONTENT_LIBRARY = {
  "Fotosintesis & struktur buah": {
    summary:
      "Materi tentang bagaimana tumbuhan menghasilkan makanan lewat fotosintesis, dikaitkan dengan struktur buah seperti apel.",
    level: "SMP",
    resources: ["video:fotosintesis-dasar", "quiz:struktur-buah-01"]
  },
  "Pecahan & pembagian (potong apel)": {
    summary: "Belajar konsep pecahan menggunakan ilustrasi memotong apel menjadi beberapa bagian.",
    level: "SD",
    resources: ["video:pecahan-visual", "latihan:potong-buah-01"]
  }
};

// --- simple API key check (per Tugas 2/3 registry: auth method = API key) ---
function requireApiKey(req, res, next) {
  const key = req.header("x-api-key");
  if (!key || key !== API_KEY) {
    return res.status(401).json({ error: "Unauthorized: missing or invalid x-api-key header" });
  }
  next();
}

// Health check — used by Cloudflare Tunnel / uptime checks, no auth needed
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "lensajar-core", time: new Date().toISOString() });
});

// POST /api/scan
// Body: { "object": "apple" }
// In production this is where the Object Recognition sub-subdomain
// would run an actual vision model on an uploaded image.
app.post("/api/scan", requireApiKey, (req, res) => {
  const objectName = (req.body.object || "").toLowerCase().trim();

  if (!objectName) {
    return res.status(400).json({ error: "Field 'object' is required" });
  }

  const topics = OBJECT_TO_TOPICS[objectName];
  if (!topics) {
    return res.status(404).json({
      error: `No learning topics mapped yet for object '${objectName}'`,
      known_objects: Object.keys(OBJECT_TO_TOPICS)
    });
  }

  res.json({ object: objectName, candidate_topics: topics });
});

// GET /api/content/:topic
// Returns personalized learning content for a given topic name.
app.get("/api/content/:topic", requireApiKey, (req, res) => {
  const topic = decodeURIComponent(req.params.topic);
  const content = CONTENT_LIBRARY[topic];

  if (!content) {
    return res.status(404).json({ error: `No content found for topic '${topic}'` });
  }

  res.json({ topic, ...content });
});

app.listen(PORT, () => {
  console.log(`LensAjar core service listening on port ${PORT}`);
});
