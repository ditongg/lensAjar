import { useMemo } from "react";
import { View, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { Screen, T, Card, Bar, Segments, SectionTitle } from "../../src/components/ui";
import Mascot from "../../src/components/Mascot";
import { useAuth } from "../../src/lib/auth";
import { summarize } from "../../src/lib/progress";
import { COLORS, subjectStyle } from "../../src/lib/theme";

// Pelacakan Progres & Evaluasi: streak, minggu ini, mapel, pencapaian
export default function Progres() {
  const { user, learning } = useAuth();
  const sum = useMemo(() => summarize(learning, { dailyGoal: user?.dailyGoal || 3 }), [learning, user]);
  const activeDays = sum.week.filter((d) => d.active).length;

  return (
    <Screen>
      <T w="black" size={24} style={{ marginBottom: 14 }}>Progres Belajarku</T>

      <Card style={{ alignItems: "center", paddingVertical: 20 }}>
        <LinearGradient colors={["#FFE1D2", "#FFF6F1"]} style={styles.flameBg}>
          <Mascot size={96} mood={sum.streak > 0 ? "happy" : "wink"} />
          <View style={styles.flame}>
            <T size={18}>🔥</T>
          </View>
        </LinearGradient>
        <T w="black" size={20} style={{ marginTop: 10 }}>{sum.streak} Hari Beruntun</T>
        <T color={COLORS.muted}>{sum.streak ? "Pertahankan semangatmu!" : "Mulai streak dengan satu scan hari ini"}</T>

        <View style={styles.week}>
          {sum.week.map((d) => (
            <View key={d.label} style={{ alignItems: "center", gap: 6, flex: 1 }}>
              <T size={11} color={COLORS.muted} w="semibold">{d.label}</T>
              <View style={[styles.day, d.active && styles.dayActive, d.isToday && styles.dayToday, d.future && { opacity: 0.4 }]}>
                {d.active ? <Ionicons name="checkmark" size={14} color="#fff" /> : <T size={11} color={COLORS.muted}>{d.date}</T>}
              </View>
            </View>
          ))}
        </View>
        <T size={12} color={COLORS.muted} style={{ marginTop: 12 }}>{activeDays} dari 7 hari aktif minggu ini</T>
      </Card>

      <View style={{ flexDirection: "row", gap: 12, marginTop: 14 }}>
        <Card style={{ flex: 1 }}>
          <T w="bold">Target harian</T>
          <T size={12} color={COLORS.muted}>scan + modul</T>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginTop: 12 }}>
            <Segments value={sum.today.count} total={sum.today.goal} color={COLORS.primary} track={COLORS.line} />
          </View>
          <T w="black" size={22} style={{ marginTop: 8 }}>
            {Math.min(sum.today.count, sum.today.goal)}<T color={COLORS.muted} size={14}>/{sum.today.goal}</T>
          </T>
        </Card>
        <Card style={{ flex: 1 }}>
          <T w="bold">Rata-rata kuis</T>
          <T size={12} color={COLORS.muted}>semua percobaan</T>
          <View style={styles.ring}>
            <T w="black" size={20} color={COLORS.green}>{sum.quizAverage ?? "–"}{sum.quizAverage != null ? "%" : ""}</T>
          </View>
        </Card>
      </View>

      <SectionTitle>Per mata pelajaran</SectionTitle>
      <Card style={{ gap: 14 }}>
        {sum.bySubject.map((s) => {
          const st = subjectStyle(s.subject);
          return (
            <View key={s.subject} style={{ gap: 6 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                  <Ionicons name={st.icon} size={16} color={st.color} />
                  <T w="semibold">{s.subject}</T>
                </View>
                <View style={[styles.count, { backgroundColor: st.soft }]}>
                  <T w="bold" size={12} color={st.color}>{s.done}/{s.total}</T>
                </View>
              </View>
              <Bar value={s.done} total={s.total} color={st.color} />
            </View>
          );
        })}
      </Card>

      <SectionTitle>Pencapaian</SectionTitle>
      <View style={styles.badges}>
        {sum.achievements.map((a) => (
          <Card key={a.id} style={[styles.badge, !a.unlocked && { opacity: 0.45 }]}>
            <View style={[styles.badgeIcon, { backgroundColor: a.unlocked ? COLORS.peachSoft : COLORS.line }]}>
              <Ionicons name={a.icon} size={20} color={a.unlocked ? COLORS.peach : COLORS.muted} />
            </View>
            <T w="bold" size={13} style={{ textAlign: "center" }}>{a.title}</T>
            <T size={11} color={COLORS.muted} style={{ textAlign: "center" }}>{a.desc}</T>
          </Card>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flameBg: { borderRadius: 80, padding: 14 },
  flame: { position: "absolute", right: 0, bottom: 6, backgroundColor: "#fff", borderRadius: 16, width: 32, height: 32, alignItems: "center", justifyContent: "center" },
  week: { flexDirection: "row", marginTop: 18, width: "100%" },
  day: { width: 30, height: 30, borderRadius: 15, backgroundColor: COLORS.bg, alignItems: "center", justifyContent: "center" },
  dayActive: { backgroundColor: COLORS.pink },
  dayToday: { borderWidth: 2, borderColor: COLORS.pink },
  ring: { width: 74, height: 74, borderRadius: 37, borderWidth: 7, borderColor: COLORS.greenSoft, alignItems: "center", justifyContent: "center", alignSelf: "center", marginTop: 10 },
  count: { borderRadius: 999, paddingHorizontal: 8, paddingVertical: 2 },
  badges: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  badge: { width: "31%", flexGrow: 1, alignItems: "center", gap: 4, padding: 12 },
  badgeIcon: { width: 42, height: 42, borderRadius: 21, alignItems: "center", justifyContent: "center", marginBottom: 2 },
});
