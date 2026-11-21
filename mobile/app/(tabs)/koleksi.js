import { View, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Screen, T, Card, StateView, Button } from "../../src/components/ui";
import { useAuth } from "../../src/lib/auth";
import { findObject, findModule } from "../../src/lib/catalog";
import { COLORS, subjectStyle } from "../../src/lib/theme";

// Koleksi Belajar: objek yang disimpan, bisa diulang tanpa scan ulang
export default function Koleksi() {
  const { learning, toggleSaved } = useAuth();
  const items = learning.collection;

  return (
    <Screen>
      <T w="black" size={24}>Koleksi Belajar</T>
      <T color={COLORS.muted} style={{ marginBottom: 16 }}>{items.length} objek tersimpan</T>

      {items.length === 0 ? (
        <Card>
          <StateView type="empty" title="Koleksi masih kosong" message="Pindai benda lalu tekan ikon 🔖 untuk menyimpannya di sini." />
          <Button title="Mulai scan" icon="scan" onPress={() => router.push("/scan")} />
        </Card>
      ) : (
        items.map((o) => {
          const topics = (findObject(o.id)?.topics || []).map(findModule).filter(Boolean);
          return (
            <Card key={o.id} style={{ marginBottom: 12 }}>
              <View style={styles.head}>
                <View style={styles.emoji}>
                  <T size={28}>{o.emoji}</T>
                </View>
                <View style={{ flex: 1 }}>
                  <T w="black" size={17}>{o.name}</T>
                  <T size={12} color={COLORS.muted}>Disimpan {new Date(o.at).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}</T>
                </View>
                <Pressable onPress={() => toggleSaved(o)} hitSlop={10} accessibilityLabel={`Hapus ${o.name} dari koleksi`}>
                  <Ionicons name="bookmark" size={22} color={COLORS.primary} />
                </Pressable>
              </View>
              <View style={styles.topics}>
                {topics.map((m) => {
                  const s = subjectStyle(m.subject);
                  return (
                    <Pressable key={m.id} onPress={() => router.push(`/materi/${m.id}`)} style={[styles.topic, { backgroundColor: s.soft }]}>
                      <Ionicons name={s.icon} size={13} color={s.color} />
                      <T w="semibold" size={12} color={s.color}>{m.title}</T>
                    </Pressable>
                  );
                })}
              </View>
            </Card>
          );
        })
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  head: { flexDirection: "row", alignItems: "center", gap: 12 },
  emoji: { width: 52, height: 52, borderRadius: 16, backgroundColor: COLORS.peachSoft, alignItems: "center", justifyContent: "center" },
  topics: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 12 },
  topic: { flexDirection: "row", alignItems: "center", gap: 5, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 },
});
