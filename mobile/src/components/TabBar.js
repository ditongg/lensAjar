import { View, Pressable, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SHADOW } from "../lib/theme";
import { T } from "./ui";

const ICONS = {
  index: "home",
  scan: "scan",
  progres: "stats-chart",
  koleksi: "albums",
  profil: "person",
};

// Tab bar melayang: kapsul putih, tab aktif diberi pil lavender.
// Expo Router (SDK 58) memberi `emitter` + `navigateToTab`;
// React Navigation lama memberi `navigation`. Dukung keduanya.
export default function TabBar({ state, descriptors, navigation, emitter, navigateToTab }) {
  const insets = useSafeAreaInsets();
  const emit = (e) => (emitter ?? navigation)?.emit?.(e) ?? { defaultPrevented: false };
  const go = (route) => (navigateToTab ? navigateToTab(route.key) : navigation?.navigate(route.name));
  return (
    <View style={[styles.wrap, { bottom: Math.max(insets.bottom, 12) }]}>
      {state.routes.map((route, i) => {
        const focused = state.index === i;
        const { options } = descriptors[route.key];
        const label = options.title ?? route.name;
        const icon = ICONS[route.name] || "ellipse";
        const onPress = () => {
          const e = emit({ type: "tabPress", target: route.key, canPreventDefault: true });
          if (!focused && !e?.defaultPrevented) go(route);
        };
        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            accessibilityRole="tab"
            accessibilityState={{ selected: focused }}
            accessibilityLabel={label}
            style={[styles.item, focused && styles.active]}
          >
            <Ionicons name={focused ? icon : `${icon}-outline`} size={21} color={focused ? COLORS.text : COLORS.muted} />
            <T w={focused ? "bold" : "semibold"} size={11} color={focused ? COLORS.text : COLORS.muted}>{label}</T>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    left: 16,
    right: 16,
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 28,
    padding: 6,
    ...SHADOW,
    shadowOpacity: 0.14,
  },
  item: { flex: 1, alignItems: "center", justifyContent: "center", paddingVertical: 8, borderRadius: 22, gap: 2 },
  active: { backgroundColor: COLORS.primarySoft },
});
