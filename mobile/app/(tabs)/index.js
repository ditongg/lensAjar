import { useMemo } from "react";
import { View, ScrollView, Pressable, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { T, Card, Segments, SectionTitle, StateView } from "../../src/components/ui";
import Mascot from "../../src/components/Mascot";
import TopicRow from "../../src/components/TopicRow";
import { useAuth } from "../../src/lib/auth";
import { summarize, recommend } from "../../src/lib/progress";
import { findModule, toTopic } from "../../src/lib/catalog";
import { COLORS, GRADIENTS, SHADOW } from "../../src/lib/theme";

// Beranda: sapaan, statistik, progres hari ini, topik untuk kamu
export default function Beranda() {
  const insets = useSafeAreaInsets();
  const { user, learning } = useAuth();
  const sum = useMemo(() => summarize(learning, { dailyGoal: user?.dailyGoal || 3 }), [learning, user]);

  // Topik hari ini = yang sudah selesai hari ini + rekomendasi berikutnya
  const topics = useMemo(() => {
    const doneToday = [...sum.doneToday].map(findModule).filter(Boolean).map((m) => ({ ...toTopic(m), done: true }));
    const rec = recommend(learning, Math.max(3, 5 - doneToday.length)).map((t) => ({ ...t, done: false }));
    return [...doneToday, ...rec].slice(0, 5);
  }, [learning, sum]);

  const left = Math.max(0, sum.today.goal - sum.today.count);
  const next = topics.find((t) => !t.done);
  const firstName = (user?.name || "Teman").split(" ")[0];

  const stats = [
    { label: "Objek", value: sum.scansTotal, unit: "dipindai", emoji: "🔍", bg: "#EFEAFF" },
    { label: "Modul", value: sum.modulesCompleted, unit: `dari ${sum.modulesTotal}`, emoji: "📚", bg: "#FFE9DD" },
    { label: "Streak", value: sum.streak, unit: "hari", emoji: "🔥", bg: "#E3F7EE" },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        <LinearGradient colors={GRADIENTS.header} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.header, { paddingTop: insets.top + 12 }]}>
          <View style={styles.iconRow}>
            <Pressable style={styles.roundBtn} onPress={() => router.push("/profil")} accessibilityLabel="Menu">
              <Ionicons name="menu" size={20} color={COLORS.text} />
            </Pressable>
            <Pressable style={styles.roundBtn} onPress={() => router.push("/progres")} accessibilityLabel="Notifikasi">
              <Ionicons name="notifications-outline" size={19} color={COLORS.text} />
              {left > 0 && <View style={styles.dot} />}
            </Pressable>
            <Pressable style={styles.roundBtn} onPress={() => router.push("/scan")} accessibilityLabel="Cari objek">
              <Ionicons name="search" size={19} color={COLORS.text} />
            </Pressable>
          </View>

          <View style={styles.greetRow}>
            <View style={{ flex: 1 }}>
              <T w="black" size={26} color="#fff">Hai, {firstName}!</T>
              <T w="semibold" color="rgba(255,255,255,0.92)">Siap belajar hari ini?</T>
            </View>
            <View style={{ alignItems: "center" }}>
              <View style={styles.speech}>
                <T w="bold" size={11} color={COLORS.primaryDark}>Mulai dari benda kecil!</T>
              </View>
              <Mascot size={86} />
            </View>
          </View>
        </LinearGradient>

        <View style={{ paddingHorizontal: 20 }}>
          <View style={styles.stats}>
            {stats.map((s) => (
              <View key={s.label} style={styles.stat}>
                <View style={[styles.statIcon, { backgroundColor: s.bg }]}>
                  <T size={18}>{s.emoji}</T>
                </View>
                <T w="semibold" size={12} color={COLORS.muted}>{s.label}</T>
                <T w="black" size={24}>{s.value}</T>
                <T size={11} color={COLORS.muted}>{s.unit}</T>
              </View>
            ))}
          </View>

          <LinearGradient colors={GRADIENTS.card} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.progress}>
            <Mascot size={72} mood={left === 0 ? "wink" : "happy"} />
            <View style={{ flex: 1, gap: 8 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <T w="bold" color="#fff">Progres hari ini</T>
                <T w="bold" color="#fff">{Math.min(sum.today.count, sum.today.goal)}/{sum.today.goal}</T>
              </View>
              <Segments value={sum.today.count} total={sum.today.goal} />
              <View style={{ flexDirection: "row", gap: 6, flexWrap: "wrap" }}>
                <View style={styles.pill}>
                  <T w="semibold" size={11} color="#fff">{left ? `${left} aktivitas lagi` : "Target tercapai 🎉"}</T>
                </View>
                {next && (
                  <View style={[styles.pill, { backgroundColor: "#fff" }]}>
                    <T w="semibold" size={11} color={COLORS.primaryDark} numberOfLines={1}>Berikutnya: {next.topic}</T>
                  </View>
                )}
              </View>
            </View>
          </LinearGradient>

          <SectionTitle
            right={
              <Pressable onPress={() => router.push("/scan")} style={styles.plus} accessibilityLabel="Scan objek">
                <Ionicons name="add" size={18} color="#fff" />
              </Pressable>
            }
          >
            Topik untuk kamu
          </SectionTitle>

          {topics.length === 0 ? (
            <StateView type="empty" title="Semua modul selesai!" message="Hebat! Coba pindai benda baru untuk mengulang." />
          ) : (
            topics.map((t) => (
              <TopicRow
                key={t.id}
                item={t}
                done={t.done}
                note={t.done ? `${t.subject} · selesai hari ini` : t.reason}
                onPress={() => router.push(`/materi/${t.id}`)}
              />
            ))
          )}

          {learning.scans.length > 0 && (
            <>
              <SectionTitle>Terakhir dipindai</SectionTitle>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
                {learning.scans.slice(0, 8).map((s, i) => (
                  <Card key={`${s.objectId}-${i}`} style={styles.recent} onPress={() => router.push({ pathname: "/scan", params: { q: s.name } })}>
                    <T size={26}>{s.emoji}</T>
                    <T w="bold" size={12} numberOfLines={1}>{s.name}</T>
                  </Card>
                ))}
              </ScrollView>
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 20, paddingBottom: 64, borderBottomLeftRadius: 32, borderBottomRightRadius: 32 },
  iconRow: { flexDirection: "row", gap: 10 },
  roundBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: "rgba(255,255,255,0.85)", alignItems: "center", justifyContent: "center" },
  dot: { position: "absolute", top: 9, right: 10, width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.pink, borderWidth: 1.5, borderColor: "#fff" },
  greetRow: { flexDirection: "row", alignItems: "flex-end", marginTop: 14 },
  speech: { backgroundColor: "#fff", borderRadius: 14, paddingHorizontal: 10, paddingVertical: 5, marginBottom: 4 },
  stats: { flexDirection: "row", gap: 10, marginTop: -46 },
  stat: { flex: 1, backgroundColor: "#fff", borderRadius: 22, padding: 12, alignItems: "center", ...SHADOW },
  statIcon: { width: 38, height: 38, borderRadius: 13, alignItems: "center", justifyContent: "center", marginBottom: 6 },
  progress: { flexDirection: "row", alignItems: "center", gap: 12, borderRadius: 26, padding: 14, marginTop: 16, ...SHADOW, shadowOpacity: 0.2 },
  pill: { backgroundColor: "rgba(255,255,255,0.22)", borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4, maxWidth: 190 },
  plus: { width: 30, height: 30, borderRadius: 15, backgroundColor: COLORS.text, alignItems: "center", justifyContent: "center" },
  recent: { width: 92, alignItems: "center", gap: 4, padding: 12 },
});
