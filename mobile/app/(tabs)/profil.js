import { useEffect, useState } from "react";
import { View, Pressable, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { Screen, T, Card, Button, SectionTitle } from "../../src/components/ui";
import { useAuth } from "../../src/lib/auth";
import { checkHealth } from "../../src/services/ApiService";
import { COLORS, GRADIENTS } from "../../src/lib/theme";

// Profil Gaya Belajar Siswa (sub-subdomain Personalisasi)
const STYLES = [
  { id: "visual", label: "Visual", icon: "eye", desc: "Suka gambar & diagram" },
  { id: "auditori", label: "Auditori", icon: "musical-notes", desc: "Suka mendengar & bercerita" },
  { id: "kinestetik", label: "Kinestetik", icon: "hand-left", desc: "Suka praktik langsung" },
  { id: "membaca", label: "Membaca", icon: "document-text", desc: "Suka membaca & mencatat" },
];

export default function Profil() {
  const { user, mode, updateUser, signOut } = useAuth();
  const [server, setServer] = useState("cek");

  const ping = () => {
    setServer("cek");
    checkHealth().then(() => setServer("online")).catch(() => setServer("offline"));
  };
  useEffect(ping, []);

  const goal = user?.dailyGoal || 3;
  const serverInfo = {
    cek: { label: "Mengecek server...", color: COLORS.muted, icon: "time" },
    online: { label: "Server LensAjar online", color: COLORS.green, icon: "cloud-done" },
    offline: { label: "Server tidak terjangkau (data offline)", color: COLORS.danger, icon: "cloud-offline" },
  }[server];

  return (
    <Screen>
      <View style={{ alignItems: "center", marginBottom: 18 }}>
        <LinearGradient colors={GRADIENTS.header} style={styles.avatar}>
          <T w="black" size={34} color="#fff">{user?.name?.charAt(0).toUpperCase() || "?"}</T>
        </LinearGradient>
        <T w="black" size={22} style={{ marginTop: 10 }}>{user?.name}</T>
        <T color={COLORS.muted}>{user?.email}</T>
        <View style={{ flexDirection: "row", gap: 8, marginTop: 8 }}>
          <View style={styles.tag}><T w="bold" size={12} color={COLORS.primaryDark}>Siswa {user?.grade}</T></View>
          <View style={[styles.tag, { backgroundColor: mode === "server" ? COLORS.greenSoft : COLORS.peachSoft }]}>
            <T w="bold" size={12} color={mode === "server" ? COLORS.green : "#C2581F"}>{mode === "server" ? "Akun server" : "Akun lokal"}</T>
          </View>
        </View>
      </View>

      <SectionTitle>Gaya belajarku</SectionTitle>
      <View style={styles.grid}>
        {STYLES.map((s) => {
          const active = (user?.learningStyle || "visual") === s.id;
          return (
            <Pressable key={s.id} onPress={() => updateUser({ learningStyle: s.id })} style={[styles.style, active && styles.styleActive]}>
              <Ionicons name={s.icon} size={20} color={active ? "#fff" : COLORS.primary} />
              <T w="bold" color={active ? "#fff" : COLORS.text}>{s.label}</T>
              <T size={11} color={active ? "rgba(255,255,255,0.85)" : COLORS.muted}>{s.desc}</T>
            </Pressable>
          );
        })}
      </View>

      <SectionTitle>Target harian</SectionTitle>
      <Card style={styles.goal}>
        <Pressable style={styles.step} onPress={() => updateUser({ dailyGoal: Math.max(1, goal - 1) })} accessibilityLabel="Kurangi target">
          <Ionicons name="remove" size={20} color={COLORS.primary} />
        </Pressable>
        <View style={{ alignItems: "center" }}>
          <T w="black" size={28}>{goal}</T>
          <T size={12} color={COLORS.muted}>aktivitas per hari</T>
        </View>
        <Pressable style={styles.step} onPress={() => updateUser({ dailyGoal: Math.min(10, goal + 1) })} accessibilityLabel="Tambah target">
          <Ionicons name="add" size={20} color={COLORS.primary} />
        </Pressable>
      </Card>

      <SectionTitle>Koneksi</SectionTitle>
      <Card onPress={ping} style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <Ionicons name={serverInfo.icon} size={20} color={serverInfo.color} />
        <T w="semibold" style={{ flex: 1 }}>{serverInfo.label}</T>
        <Ionicons name="refresh" size={18} color={COLORS.muted} />
      </Card>

      <Button title="Keluar" variant="danger" icon="log-out-outline" onPress={signOut} style={{ marginTop: 24 }} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  avatar: { width: 88, height: 88, borderRadius: 44, alignItems: "center", justifyContent: "center" },
  tag: { backgroundColor: COLORS.primarySoft, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  style: { width: "48%", flexGrow: 1, backgroundColor: "#fff", borderRadius: 20, padding: 14, gap: 4, borderWidth: 1.5, borderColor: COLORS.line },
  styleActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  goal: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  step: { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.primarySoft, alignItems: "center", justifyContent: "center" },
});
