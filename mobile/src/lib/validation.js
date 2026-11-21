const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Mengembalikan objek error per field; kosong = valid.
export function validateLogin({ email, password }) {
  const e = {};
  if (!email?.trim()) e.email = "Email wajib diisi";
  else if (!EMAIL_RE.test(email.trim())) e.email = "Format email tidak valid";
  if (!password) e.password = "Kata sandi wajib diisi";
  return e;
}

export function validateRegister({ name, email, password, confirm }) {
  const e = validateLogin({ email, password });
  if (!name?.trim()) e.name = "Nama wajib diisi";
  else if (name.trim().length < 2) e.name = "Nama minimal 2 karakter";
  if (password && password.length < 6) e.password = "Kata sandi minimal 6 karakter";
  if (confirm !== password) e.confirm = "Konfirmasi kata sandi tidak sama";
  return e;
}

export function validateObjectName(value) {
  const v = (value || "").trim();
  if (!v) return "Tulis nama objek dulu, mis. 'daun' atau 'roda sepeda'";
  if (v.length > 40) return "Nama objek terlalu panjang (maks. 40 karakter)";
  return "";
}

export const isValid = (errors) => Object.keys(errors).length === 0;
