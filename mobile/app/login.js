import { useState } from "react";
import { View, Pressable, KeyboardAvoidingView, Platform, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Screen, T, TextField, Button, Card } from "../src/components/ui";
import Mascot from "../src/components/Mascot";
import { useAuth } from "../src/lib/auth";
import { validateLogin, validateRegister, isValid } from "../src/lib/validation";
import { COLORS } from "../src/lib/theme";

// Masuk / Daftar dalam satu layar
export default function LoginScreen() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState("masuk");
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "", grade: "SD" });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);
  const daftar = mode === "daftar";

  const set = (k) => (v) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const submit = async () => {
    setFormError("");
    const errs = daftar ? validateRegister(form) : validateLogin(form);
    setErrors(errs);
    if (!isValid(errs)) return;
    setLoading(true);
    try {
      if (daftar) await signUp(form);
      else await signIn(form.email, form.password);
    } catch (e) {
      if (e?.data?.fields) setErrors(e.data.fields);
      setFormError(e.message || "Gagal masuk");
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (m) => {
    setMode(m);
    setErrors({});
    setFormError("");
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <Screen edges={["top", "bottom"]} contentStyle={{ paddingBottom: 40 }}>
        <View style={styles.hero}>
          <View style={styles.bubble}>
            <T w="bold" size={12} color={COLORS.primaryDark}>Ayo belajar dari sekitar! ✨</T>
          </View>
          <Mascot size={120} />
          <T w="black" size={30} style={{ marginTop: 10 }}>LensAjar</T>
          <T color={COLORS.muted} style={{ textAlign: "center", marginTop: 4 }}>
            Arahkan lensa ke benda di sekitarmu,{"\n"}temukan topik belajar lintas mapel.
          </T>
        </View>

        <Card style={{ padding: 20 }}>
          <View style={styles.switch}>
            {["masuk", "daftar"].map((m) => (
              <Pressable key={m} onPress={() => switchMode(m)} style={[styles.switchItem, mode === m && styles.switchActive]}>
                <T w="bold" color={mode === m ? COLORS.text : COLORS.muted}>{m === "masuk" ? "Masuk" : "Daftar"}</T>
              </Pressable>
            ))}
          </View>

          {daftar && (
            <TextField label="Nama" icon="person-outline" placeholder="Nama panggilanmu" value={form.name} onChangeText={set("name")} error={errors.name} autoCapitalize="words" />
          )}
          <TextField label="Email" icon="mail-outline" placeholder="nama@email.com" value={form.email} onChangeText={set("email")} error={errors.email} autoCapitalize="none" keyboardType="email-address" autoComplete="email" />
          <TextField label="Kata sandi" icon="lock-closed-outline" placeholder={daftar ? "Minimal 6 karakter" : "Kata sandi"} value={form.password} onChangeText={set("password")} error={errors.password} secure />
          {daftar && (
            <>
              <TextField label="Ulangi kata sandi" icon="lock-closed-outline" placeholder="Ketik ulang" value={form.confirm} onChangeText={set("confirm")} error={errors.confirm} secure />
              <T w="semibold" size={13} color={COLORS.muted} style={{ marginBottom: 6 }}>Jenjang</T>
              <View style={{ flexDirection: "row", gap: 10, marginBottom: 16 }}>
                {["SD", "SMP"].map((g) => (
                  <Pressable key={g} onPress={() => set("grade")(g)} style={[styles.grade, form.grade === g && styles.gradeActive]}>
                    <T w="bold" color={form.grade === g ? "#fff" : COLORS.text}>{g}</T>
                  </Pressable>
                ))}
              </View>
            </>
          )}

          {formError ? (
            <View style={styles.formError}>
              <T size={13} color={COLORS.danger}>{formError}</T>
            </View>
          ) : null}

          <LinearGradient colors={["#8C7CFA", "#6E5CF0"]} style={{ borderRadius: 999 }}>
            <Button title={daftar ? "Buat akun" : "Masuk"} onPress={submit} loading={loading} style={{ backgroundColor: "transparent" }} />
          </LinearGradient>
        </Card>
      </Screen>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: "center", marginTop: 20, marginBottom: 24 },
  bubble: { backgroundColor: "#fff", borderRadius: 16, paddingHorizontal: 12, paddingVertical: 6, marginBottom: 8 },
  switch: { flexDirection: "row", backgroundColor: COLORS.bg, borderRadius: 999, padding: 4, marginBottom: 18 },
  switchItem: { flex: 1, alignItems: "center", paddingVertical: 10, borderRadius: 999 },
  switchActive: { backgroundColor: "#fff" },
  grade: { flex: 1, alignItems: "center", paddingVertical: 11, borderRadius: 14, borderWidth: 1.5, borderColor: COLORS.line },
  gradeActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  formError: { backgroundColor: COLORS.dangerSoft, borderRadius: 12, padding: 10, marginBottom: 12 },
});
