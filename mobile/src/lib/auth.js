import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import * as Api from "../services/ApiService";
import * as Store from "./storage";
import { addCompletion, addScan, toggleCollection } from "./progress";

// Context autentikasi + data belajar pengguna.
// Login dicoba ke microservice (POST /auth/login). Jika endpoint belum
// tersedia / server mati, aplikasi memakai "mode lokal": akun disimpan di HP.
const AuthContext = createContext(null);

// Hash ringan untuk akun mode lokal (demo, bukan keamanan produksi)
const localHash = (s) => {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
  return `h${(h >>> 0).toString(36)}`;
};

const serverUnavailable = (e) => e instanceof Api.ApiError && (e.isNetwork || e.status === 404 || e.status === 405);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null); // { token, user, mode }
  const [learning, setLearning] = useState(Store.EMPTY_LEARNING);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      const s = await Store.getSession();
      if (s?.user) {
        Api.setAuthToken(s.token);
        setSession(s);
        setLearning(await Store.getLearning(s.user.id));
      }
      setReady(true);
    })();
  }, []);

  const start = async (s) => {
    Api.setAuthToken(s.token);
    await Store.saveSession(s);
    setSession(s);
    setLearning(await Store.getLearning(s.user.id));
  };

  const signIn = useCallback(async (email, password) => {
    const mail = email.trim().toLowerCase();
    try {
      const res = await Api.login(mail, password);
      return start({ token: res.token, user: res.user, mode: "server" });
    } catch (e) {
      if (!serverUnavailable(e)) throw e;
      const accounts = await Store.getAccounts();
      const acc = accounts[mail];
      if (!acc || acc.hash !== localHash(password)) {
        throw new Error(acc ? "Email atau kata sandi salah" : "Akun belum terdaftar di HP ini. Daftar dulu ya!");
      }
      return start({ token: null, user: acc.user, mode: "lokal" });
    }
  }, []);

  const signUp = useCallback(async ({ name, email, password, grade }) => {
    const mail = email.trim().toLowerCase();
    const payload = { name: name.trim(), email: mail, password, grade };
    try {
      const res = await Api.register(payload);
      return start({ token: res.token, user: res.user, mode: "server" });
    } catch (e) {
      if (!serverUnavailable(e)) throw e;
      const accounts = await Store.getAccounts();
      if (accounts[mail]) throw new Error("Email sudah terdaftar di HP ini");
      const user = { id: `lokal-${Date.now()}`, name: payload.name, email: mail, grade, learningStyle: "visual", dailyGoal: 3 };
      await Store.saveAccounts({ ...accounts, [mail]: { hash: localHash(password), user } });
      return start({ token: null, user, mode: "lokal" });
    }
  }, []);

  const signOut = useCallback(async () => {
    Api.setAuthToken(null);
    await Store.clearSession();
    setSession(null);
    setLearning(Store.EMPTY_LEARNING);
  }, []);

  const updateUser = useCallback(
    async (patch) => {
      if (!session) return;
      const next = { ...session, user: { ...session.user, ...patch } };
      await Store.saveSession(next);
      if (next.mode === "lokal") {
        const accounts = await Store.getAccounts();
        const acc = accounts[next.user.email];
        if (acc) await Store.saveAccounts({ ...accounts, [next.user.email]: { ...acc, user: next.user } });
      }
      setSession(next);
    },
    [session]
  );

  // Perbarui state belajar + simpan
  const mutate = useCallback(
    (fn) => {
      setLearning((cur) => {
        const next = fn(cur);
        if (session?.user) Store.saveLearning(session.user.id, next);
        return next;
      });
    },
    [session]
  );

  const value = useMemo(
    () => ({
      ready,
      user: session?.user || null,
      mode: session?.mode,
      learning,
      signIn,
      signUp,
      signOut,
      updateUser,
      recordScan: (scan) => mutate((s) => addScan(s, scan)),
      recordCompletion: (c) => mutate((s) => addCompletion(s, c)),
      toggleSaved: (obj) => mutate((s) => toggleCollection(s, obj)),
    }),
    [ready, session, learning, signIn, signUp, signOut, updateUser, mutate]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
