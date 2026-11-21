// Semua pemanggilan API microservice LensAjar ada di file ini.
// Alamat & API key diisi lewat .env:
//   EXPO_PUBLIC_API_URL=https://imut.stei.site/api
//   EXPO_PUBLIC_API_KEY=lensajar-demo-key
//
// Kalau server tidak terjangkau (offline / 5xx / timeout), fungsi data
// memakai katalog cadangan lokal dan menandai hasil dengan source:"offline"
// supaya aplikasi tidak crash dan tetap bisa didemokan.
import { recognizeLocal, findModule } from "../lib/catalog";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;
const API_KEY = process.env.EXPO_PUBLIC_API_KEY;
const TIMEOUT_MS = 8000;

let authToken = null;
export const setAuthToken = (t) => {
  authToken = t;
};

export class ApiError extends Error {
  constructor(message, status = 0, data = null) {
    super(message);
    this.name = "ApiError";
    this.status = status; // 0 = jaringan / timeout
    this.data = data;
  }
  get isNetwork() {
    return this.status === 0 || this.status >= 500;
  }
}

export async function request(path, { method = "GET", body, timeout = TIMEOUT_MS } = {}) {
  if (!BASE_URL) throw new ApiError("EXPO_PUBLIC_API_URL belum diisi di .env");

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  let res;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(API_KEY ? { "x-api-key": API_KEY } : {}),
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
  } catch (e) {
    const msg = e?.name === "AbortError" ? "Server terlalu lama merespons" : "Tidak bisa terhubung ke server";
    throw new ApiError(msg, 0);
  } finally {
    clearTimeout(timer);
  }

  if (res.status === 204) return null;
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new ApiError(data?.error || `Server error (${res.status})`, res.status, data);
  return data;
}

// ---------- Health ----------
export const checkHealth = () => request("/health", { timeout: 5000 });

// ---------- Auth (subdomain generic) ----------
export const login = (email, password) => request("/auth/login", { method: "POST", body: { email, password } });
export const register = (payload) => request("/auth/register", { method: "POST", body: payload });

// ---------- Pengenalan Objek: nama objek -> Topik Kandidat ----------
export async function scanObject(objectName) {
  try {
    const data = await request("/scan", { method: "POST", body: { object: objectName } });
    return { ...normalizeScan(data, objectName), source: "server" };
  } catch (e) {
    if (!(e instanceof ApiError) || !e.isNetwork) throw e;
    const local = recognizeLocal(objectName);
    if (!local) throw new ApiError(`Objek '${objectName}' belum dikenali (mode offline)`, 404);
    return { ...local, source: "offline", notice: e.message };
  }
}

// ---------- Kurikulum & Konten: materi satu topik ----------
export async function getContent(topic) {
  try {
    const data = await request(`/content/${encodeURIComponent(topic)}`);
    // Server boleh belum punya kuis -> lengkapi dari katalog bila ada
    const local = findModule(data?.id || data?.topic || topic);
    const serverQuizUsable = data?.quiz?.length && data.quiz.every((q) => q.answer !== undefined);
    return {
      ...(local || {}),
      ...data,
      title: data.title || data.topic,
      quiz: serverQuizUsable ? data.quiz : local?.quiz || [],
      source: "server",
    };
  } catch (e) {
    if (!(e instanceof ApiError) || !e.isNetwork) throw e;
    const local = findModule(topic);
    if (!local) throw new ApiError("Konten belum tersedia untuk topik ini", 404);
    return { ...local, topic: local.title, source: "offline", notice: e.message };
  }
}

// Kontrak server lama: candidate_topics berisi { subject, topic }
function normalizeScan(data, query) {
  const topics = (data?.candidate_topics || []).map((t) => {
    const m = findModule(t.id || t.topic);
    return { id: t.id || m?.id || t.topic, topic: t.topic, subject: t.subject, level: t.level || m?.level, minutes: t.minutes || m?.minutes };
  });
  const detected = data?.detected || { id: String(data?.object || query).toLowerCase(), name: data?.object || query, emoji: "🔎" };
  return { object: data?.object || query, detected, candidate_topics: topics };
}
