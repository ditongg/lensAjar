// Konteks Profil & Progres Pengguna (sisi aplikasi).
// Fungsi murni: menerima state belajar, mengembalikan state/ringkasan baru.
import { MODULES, OBJECTS, toTopic } from "./catalog";
import { SUBJECTS } from "./theme";

const DAY = 86_400_000;
export const dayKey = (d = new Date()) => {
  const x = new Date(d);
  return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, "0")}-${String(x.getDate()).padStart(2, "0")}`;
};

export function addScan(state, scan, now = new Date()) {
  const entry = { objectId: scan.detected.id, name: scan.detected.name, emoji: scan.detected.emoji, at: now.toISOString() };
  return { ...state, scans: [entry, ...state.scans].slice(0, 50) };
}

// Event "MateriDiselesaikan"
export function addCompletion(state, { moduleId, subject, score, total }, now = new Date()) {
  const entry = { moduleId, subject, score, total, at: now.toISOString() };
  return { ...state, completions: [entry, ...state.completions] };
}

export function toggleCollection(state, object) {
  const exists = state.collection.some((c) => c.id === object.id);
  const collection = exists
    ? state.collection.filter((c) => c.id !== object.id)
    : [{ id: object.id, name: object.name, emoji: object.emoji, at: new Date().toISOString() }, ...state.collection];
  return { ...state, collection };
}

export function summarize(state, { dailyGoal = 3, now = new Date() } = {}) {
  const activity = new Map();
  for (const r of [...state.scans, ...state.completions]) {
    const k = dayKey(r.at);
    activity.set(k, (activity.get(k) || 0) + 1);
  }

  // Streak: hari berturut-turut ada aktivitas (hari ini boleh belum)
  let streak = 0;
  let cursor = now.getTime();
  if (!activity.has(dayKey(now))) cursor -= DAY;
  while (activity.has(dayKey(new Date(cursor)))) {
    streak++;
    cursor -= DAY;
  }

  // Minggu berjalan Senin–Minggu
  const dow = (now.getDay() + 6) % 7;
  const week = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"].map((label, i) => {
    const d = new Date(now.getTime() + (i - dow) * DAY);
    return { label, date: d.getDate(), active: activity.has(dayKey(d)), isToday: i === dow, future: i > dow };
  });

  const doneIds = new Set(state.completions.map((c) => c.moduleId));
  const todayKey = dayKey(now);
  const doneToday = new Set(state.completions.filter((c) => dayKey(c.at) === todayKey).map((c) => c.moduleId));

  const bySubject = Object.keys(SUBJECTS).map((subject) => {
    const mods = MODULES.filter((m) => m.subject === subject);
    return { subject, done: mods.filter((m) => doneIds.has(m.id)).length, total: mods.length };
  }).filter((s) => s.total > 0);

  const quizAverage = state.completions.length
    ? Math.round((state.completions.reduce((a, c) => a + c.score / c.total, 0) / state.completions.length) * 100)
    : null;

  return {
    streak,
    week,
    today: { count: activity.get(todayKey) || 0, goal: dailyGoal },
    scansTotal: state.scans.length,
    modulesCompleted: doneIds.size,
    modulesTotal: MODULES.length,
    collectionCount: state.collection.length,
    quizAverage,
    bySubject,
    doneIds,
    doneToday,
    achievements: [
      { id: "scan", title: "Penjelajah", desc: "Pindai objek pertama", icon: "scan", unlocked: state.scans.length >= 1 },
      { id: "rajin", title: "Rajin Belajar", desc: "Selesaikan 3 modul", icon: "school", unlocked: doneIds.size >= 3 },
      { id: "api", title: "Api Semangat", desc: "Streak 3 hari", icon: "flame", unlocked: streak >= 3 },
      { id: "kolektor", title: "Kolektor", desc: "Simpan 5 objek", icon: "albums", unlocked: state.collection.length >= 5 },
      { id: "sempurna", title: "Nilai Sempurna", desc: "Kuis benar semua", icon: "star", unlocked: state.completions.some((c) => c.score === c.total) },
    ],
  };
}

// Rekomendasi adaptif sederhana: topik dari objek yang baru dipindai dulu,
// lalu topik dari mapel yang paling jarang dipelajari.
export function recommend(state, limit = 3) {
  const done = new Set(state.completions.map((c) => c.moduleId));
  const recent = state.scans.slice(0, 5).map((s) => s.objectId);
  const fromScans = MODULES.filter((m) => !done.has(m.id) && recent.some((id) => objectHasTopic(id, m.id)));
  const counts = {};
  state.completions.forEach((c) => (counts[c.subject] = (counts[c.subject] || 0) + 1));
  const rest = MODULES.filter((m) => !done.has(m.id) && !fromScans.includes(m))
    .sort((a, b) => (counts[a.subject] || 0) - (counts[b.subject] || 0));
  return [...fromScans, ...rest].slice(0, limit).map((m) => ({
    ...toTopic(m),
    reason: fromScans.includes(m) ? "Dari objek yang kamu pindai" : `Coba mapel ${m.subject}`,
  }));
}

const objectHasTopic = (objectId, moduleId) => !!OBJECTS.find((o) => o.id === objectId)?.topics.includes(moduleId);
