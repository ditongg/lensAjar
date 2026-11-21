import { useState } from "react";
import { View, Text, TextInput, Pressable, ActivityIndicator, ScrollView, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, FONTS, GRADIENTS, SHADOW } from "../lib/theme";
import Mascot from "./Mascot";

export function T({ w = "regular", size = 14, color = COLORS.text, style, ...p }) {
  return <Text {...p} style={[{ fontFamily: FONTS[w], fontSize: size, color }, style]} />;
}

// Latar lavender lembut + area aman + scroll
export function Screen({ children, scroll = true, contentStyle, edges = ["top"] }) {
  const Body = scroll ? ScrollView : View;
  return (
    <LinearGradient colors={GRADIENTS.haze} style={{ flex: 1 }}>
      <SafeAreaView edges={edges} style={{ flex: 1 }}>
        <Body
          style={{ flex: 1 }}
          contentContainerStyle={scroll ? [styles.screen, contentStyle] : undefined}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {scroll ? children : <View style={[styles.screen, { flex: 1 }, contentStyle]}>{children}</View>}
        </Body>
      </SafeAreaView>
    </LinearGradient>
  );
}

export function Card({ children, style, onPress }) {
  if (!onPress) return <View style={[styles.card, style]}>{children}</View>;
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && { opacity: 0.85 }, style]}>
      {children}
    </Pressable>
  );
}

export function Button({ title, onPress, loading, variant = "primary", icon, style, disabled }) {
  const ghost = variant === "ghost";
  const danger = variant === "danger";
  return (
    <Pressable
      onPress={onPress}
      disabled={loading || disabled}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.btn,
        ghost && styles.btnGhost,
        danger && styles.btnDanger,
        (pressed || disabled) && { opacity: 0.7 },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={ghost || danger ? COLORS.primary : "#fff"} />
      ) : (
        <>
          {icon && <Ionicons name={icon} size={18} color={ghost ? COLORS.primary : danger ? COLORS.danger : "#fff"} />}
          <T w="bold" size={15} color={ghost ? COLORS.primary : danger ? COLORS.danger : "#fff"}>
            {title}
          </T>
        </>
      )}
    </Pressable>
  );
}

export function TextField({ label, error, icon, secure, ...p }) {
  const [hidden, setHidden] = useState(!!secure);
  const [focus, setFocus] = useState(false);
  return (
    <View style={{ marginBottom: 14 }}>
      {label && <T w="semibold" size={13} color={COLORS.muted} style={{ marginBottom: 6 }}>{label}</T>}
      <View style={[styles.field, focus && { borderColor: COLORS.primary }, error && { borderColor: COLORS.danger }]}>
        {icon && <Ionicons name={icon} size={18} color={COLORS.muted} />}
        <TextInput
          {...p}
          secureTextEntry={hidden}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          placeholderTextColor="#B5B2C9"
          style={styles.input}
        />
        {secure && (
          <Pressable onPress={() => setHidden((h) => !h)} hitSlop={10} accessibilityLabel="Tampilkan kata sandi">
            <Ionicons name={hidden ? "eye-off" : "eye"} size={18} color={COLORS.muted} />
          </Pressable>
        )}
      </View>
      {error ? <T size={12} color={COLORS.danger} style={{ marginTop: 4 }}>{error}</T> : null}
    </View>
  );
}

export function Chip({ label, icon, color = COLORS.primary, active, onPress }) {
  return (
    <Pressable onPress={onPress} style={[styles.chip, active && { backgroundColor: color, borderColor: color }]}>
      {icon && (
        <View style={[styles.chipIcon, { backgroundColor: active ? "rgba(255,255,255,0.25)" : `${color}22` }]}>
          {typeof icon === "string" && icon.length <= 2 ? (
            <Text style={{ fontSize: 12 }}>{icon}</Text>
          ) : (
            <Ionicons name={icon} size={12} color={active ? "#fff" : color} />
          )}
        </View>
      )}
      <T w="semibold" size={13} color={active ? "#fff" : COLORS.text}>{label}</T>
    </Pressable>
  );
}

export function IconBubble({ name, emoji, color = COLORS.primary, bg, size = 40 }) {
  return (
    <View style={{ width: size, height: size, borderRadius: size * 0.32, backgroundColor: bg || `${color}1F`, alignItems: "center", justifyContent: "center" }}>
      {emoji ? <Text style={{ fontSize: size * 0.48 }}>{emoji}</Text> : <Ionicons name={name} size={size * 0.48} color={color} />}
    </View>
  );
}

// Progress bersegmen seperti pil
export function Segments({ value, total, color = COLORS.peach, track = "rgba(255,255,255,0.35)", height = 10 }) {
  const n = Math.max(total, 1);
  return (
    <View style={{ flexDirection: "row", gap: 5, flex: 1 }}>
      {Array.from({ length: n }).map((_, i) => (
        <View key={i} style={{ flex: 1, height, borderRadius: height, backgroundColor: i < value ? color : track }} />
      ))}
    </View>
  );
}

export function Bar({ value, total, color = COLORS.primary }) {
  const pct = total ? Math.min(100, (value / total) * 100) : 0;
  return (
    <View style={{ height: 8, borderRadius: 8, backgroundColor: COLORS.line, overflow: "hidden", flex: 1 }}>
      <View style={{ width: `${pct}%`, height: "100%", borderRadius: 8, backgroundColor: color }} />
    </View>
  );
}

// Tampilan kondisi: loading / error / kosong
export function StateView({ type = "loading", title, message, onRetry }) {
  if (type === "loading") {
    return (
      <View style={styles.state}>
        <ActivityIndicator color={COLORS.primary} size="large" />
        <T color={COLORS.muted}>{title || "Memuat..."}</T>
      </View>
    );
  }
  return (
    <View style={styles.state}>
      <Mascot size={78} mood={type === "error" ? "wink" : "happy"} />
      <T w="bold" size={16}>{title || (type === "error" ? "Ups, ada masalah" : "Belum ada data")}</T>
      {message ? <T color={COLORS.muted} style={{ textAlign: "center" }}>{message}</T> : null}
      {onRetry && <Button title="Coba lagi" variant="ghost" icon="refresh" onPress={onRetry} style={{ marginTop: 6, paddingHorizontal: 22 }} />}
    </View>
  );
}

export function SourceBadge({ source }) {
  if (source !== "offline") return null;
  return (
    <View style={styles.badge}>
      <Ionicons name="cloud-offline" size={13} color="#B26A00" />
      <T w="semibold" size={12} color="#B26A00">Server tidak terjangkau — memakai data offline</T>
    </View>
  );
}

export function SectionTitle({ children, right }) {
  return (
    <View style={styles.section}>
      <T w="black" size={17}>{children}</T>
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { padding: 20, paddingBottom: 120 },
  card: { backgroundColor: COLORS.card, borderRadius: 22, padding: 16, ...SHADOW },
  btn: {
    backgroundColor: COLORS.primary,
    borderRadius: 999,
    paddingVertical: 14,
    paddingHorizontal: 18,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  btnGhost: { backgroundColor: COLORS.primarySoft },
  btnDanger: { backgroundColor: COLORS.dangerSoft },
  field: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1.5,
    borderColor: COLORS.line,
    backgroundColor: "#FBFAFF",
    borderRadius: 16,
    paddingHorizontal: 14,
  },
  input: { flex: 1, paddingVertical: 13, fontFamily: FONTS.semibold, fontSize: 15, color: COLORS.text },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.line,
    backgroundColor: "#fff",
  },
  chipIcon: { width: 22, height: 22, borderRadius: 11, alignItems: "center", justifyContent: "center" },
  state: { alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 40, paddingHorizontal: 24 },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
    backgroundColor: "#FFF4DC",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 12,
  },
  section: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 22, marginBottom: 12 },
});
