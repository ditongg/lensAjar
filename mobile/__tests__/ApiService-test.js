process.env.EXPO_PUBLIC_API_URL = "https://imut.stei.site/api";
process.env.EXPO_PUBLIC_API_KEY = "lensajar-demo-key";

const Api = require("../src/services/ApiService");

const ok = (data, status = 200) => Promise.resolve({ ok: true, status, json: async () => data });
const fail = (status, data) => Promise.resolve({ ok: false, status, json: async () => data });

describe("ApiService (LensAjar API)", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    Api.setAuthToken(null);
  });

  test("checkHealth memanggil GET /health", async () => {
    fetch.mockReturnValue(ok({ status: "ok" }));
    await expect(Api.checkHealth()).resolves.toEqual({ status: "ok" });
    expect(fetch.mock.calls[0][0]).toBe("https://imut.stei.site/api/health");
    expect(fetch.mock.calls[0][1].method).toBe("GET");
  });

  test("scanObject mengirim POST {object} dengan x-api-key dan Bearer token", async () => {
    Api.setAuthToken("tok123");
    fetch.mockReturnValue(ok({ object: "apple", candidate_topics: [{ subject: "Biologi", topic: "Fotosintesis" }] }));
    const res = await Api.scanObject("apple");
    const [url, opt] = fetch.mock.calls[0];
    expect(url).toBe("https://imut.stei.site/api/scan");
    expect(opt.method).toBe("POST");
    expect(opt.headers["x-api-key"]).toBe("lensajar-demo-key");
    expect(opt.headers.Authorization).toBe("Bearer tok123");
    expect(JSON.parse(opt.body)).toEqual({ object: "apple" });
    expect(res.source).toBe("server");
    expect(res.candidate_topics[0].id).toBe("fotosintesis");
  });

  test("scanObject memakai data offline saat server 502", async () => {
    fetch.mockReturnValue(fail(502, null));
    const res = await Api.scanObject("roda sepeda");
    expect(res.source).toBe("offline");
    expect(res.detected.id).toBe("roda-sepeda");
    expect(res.candidate_topics.map((t) => t.id)).toEqual(["gerak-rotasi", "lingkaran"]);
  });

  test("scanObject memakai data offline saat jaringan putus", async () => {
    fetch.mockRejectedValue(new TypeError("Network request failed"));
    const res = await Api.scanObject("daun");
    expect(res.source).toBe("offline");
  });

  test("objek tak dikenal saat offline -> error yang jelas", async () => {
    fetch.mockRejectedValue(new TypeError("Network request failed"));
    await expect(Api.scanObject("xyz")).rejects.toThrow("belum dikenali");
  });

  test("error 404 dari server diteruskan (bukan fallback)", async () => {
    fetch.mockReturnValue(fail(404, { error: "No content found for topic 'x'" }));
    await expect(Api.getContent("x")).rejects.toThrow("No content found for topic 'x'");
  });

  test("login meneruskan pesan 401 dari server", async () => {
    fetch.mockReturnValue(fail(401, { error: "Email atau kata sandi salah" }));
    await expect(Api.login("a@b.co", "x")).rejects.toMatchObject({ status: 401, message: "Email atau kata sandi salah" });
  });
});
