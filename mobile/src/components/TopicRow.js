import { View, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SHADOW, subjectStyle } from "../lib/theme";
import { T, IconBubble } from "./ui";

// Baris topik bergaya "habit": ikon mapel, judul, keterangan, lingkaran centang
export default function TopicRow({ item, done, note, onPress }) {
  const s = subjectStyle(item.subject);
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.row, pressed && { opacity: 0.85 }]}>
      <IconBubble name={s.icon} color={s.color} bg={s.soft} size={42} />
      <View style={{ flex: 1 }}>
        <T w="bold" size={15}>{item.topic}</T>
        <T size={12} color={COLORS.muted}>
          {note || `${item.subject} · ${item.level || "SD"} · ${item.minutes || 5} menit`}
        </T>
      </View>
      {done ? (
        <View style={[styles.check, { backgroundColor: COLORS.green, borderColor: COLORS.green }]}>
          <Ionicons name="checkmark" size={15} color="#fff" />
        </View>
      ) : (
        <View style={styles.check} />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 12,
    marginBottom: 10,
    ...SHADOW,
    shadowOpacity: 0.05,
  },
  check: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: COLORS.line,
    alignItems: "center",
    justifyContent: "center",
  },
});
