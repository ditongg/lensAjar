import { validateLogin, validateRegister, validateObjectName, isValid } from "../src/lib/validation";
import { addScan, addCompletion, toggleCollection, summarize, recommend } from "../src/lib/progress";
import { recognizeLocal } from "../src/lib/catalog";

const EMPTY = { scans: [], completions: [], collection: [] };

describe("validasi form", () => {
  test("login kosong / email salah", () => {
    expect(validateLogin({ email: "", password: "" })).toEqual({ email: "Email wajib diisi", password: "Kata sandi wajib diisi" });
    expect(validateLogin({ email: "abc", password: "x" }).email).toBe("Format email tidak valid");
    expect(isValid(validateLogin({ email: "a@b.id", password: "x" }))).toBe(true);
  });

  test("daftar: nama, panjang sandi, konfirmasi", () => {
    const e = validateRegister({ name: "A", email: "a@b.id", password: "123", confirm: "1234" });
    expect(Object.keys(e).sort()).toEqual(["confirm", "name", "password"]);
    expect(isValid(validateRegister({ name: "Ani", email: "a@b.id", password: "123456", confirm: "123456" }))).toBe(true);
  });

  test("nama objek", () => {
    expect(validateObjectName("  ")).not.toBe("");
    expect(validateObjectName("daun")).toBe("");
  });
});

describe("progres belajar", () => {
  const scan = recognizeLocal("apel");

  test("streak & target harian dari aktivitas", () => {
    const now = new Date(2026, 10, 21, 10);
    const yesterday = new Date(2026, 10, 20, 10);
    let s = addScan(EMPTY, scan, yesterday);
    s = addScan(s, scan, now);
    s = addCompletion(s, { moduleId: "gravitasi", subject: "Fisika", score: 2, total: 2 }, now);
    const sum = summarize(s, { dailyGoal: 3, now });
    expect(sum.streak).toBe(2);
    expect(sum.today).toEqual({ count: 2, goal: 3 });
    expect(sum.modulesCompleted).toBe(1);
    expect(sum.achievements.find((a) => a.id === "sempurna").unlocked).toBe(true);
  });

  test("koleksi bisa disimpan dan dihapus", () => {
    const s1 = toggleCollection(EMPTY, scan.detected);
    expect(s1.collection).toHaveLength(1);
    expect(toggleCollection(s1, scan.detected).collection).toHaveLength(0);
  });

  test("rekomendasi memprioritaskan topik dari objek yang baru dipindai", () => {
    const s = addScan(EMPTY, recognizeLocal("jam dinding"));
    const rec = recommend(s, 2);
    expect(rec.map((r) => r.id)).toEqual(["satuan-waktu", "sudut"]);
  });
});
