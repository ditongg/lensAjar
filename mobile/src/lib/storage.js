import AsyncStorage from "@react-native-async-storage/async-storage";

// Penyimpanan lokal: token sesi, profil, dan data belajar per pengguna.
const KEYS = {
  session: "lensajar.session", // { token, user, mode }
  accounts: "lensajar.accounts", // akun mode lokal (saat server belum ada)
  learning: (uid) => `lensajar.learning.${uid}`, // { scans, completions, collection }
};

async function getJSON(key, fallback) {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}
const setJSON = (key, value) => AsyncStorage.setItem(key, JSON.stringify(value));

export const getSession = () => getJSON(KEYS.session, null);
export const saveSession = (s) => setJSON(KEYS.session, s);
export const clearSession = () => AsyncStorage.removeItem(KEYS.session);

export const getAccounts = () => getJSON(KEYS.accounts, {});
export const saveAccounts = (a) => setJSON(KEYS.accounts, a);

export const EMPTY_LEARNING = { scans: [], completions: [], collection: [] };
export const getLearning = (uid) => getJSON(KEYS.learning(uid), EMPTY_LEARNING);
export const saveLearning = (uid, data) => setJSON(KEYS.learning(uid), data);
