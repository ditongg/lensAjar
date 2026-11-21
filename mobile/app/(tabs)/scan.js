import { useEffect, useState } from "react";
import { View, ScrollView, TextInput, Pressable, KeyboardAvoidingView, Platform, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { T, Card, Chip, StateView, SourceBadge } from "../../src/components/ui";
import Mascot from "../../src/components/Mascot";
import TopicRow from "../../src/components/TopicRow";
import { scanObject } from "../../src/services/ApiService";
import { useAuth } from "../../src/lib/auth";
import { validateObjectName } from "../../src/lib/validation";
import { OBJECTS } from "../../src/lib/catalog";
import { COLORS, FONTS, GRADIENTS, SHADOW } from "../../src/lib/theme";

// Scan Objek: ketik nama benda (kamera menyusul) -> Topik Kandidat
export default function Scan() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const { learning, recordScan, toggleSaved } = useAuth();
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | loading | error | done
  const [error, setError] = useState("");
  const [hint, setHint] = useState("");

  const run = async (value) => {
    const msg = validateObjectName(value);
    if (msg) {
      setError(msg);
      setStatus("error");
      return;
    }
    setText(value);
    setStatus("loading");
    setError("");
    try {
      const res = await scanObject(value.trim());
      setResult(res);
      setStatus("done");
      recordScan(res);
    } catch (e) {
      setError(e.message || "Gagal mengenali objek");
      setStatus("error");
    }
  };

  useEffect(() => {
    if (params.q) run(String(params.q));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.q]);

  const saved = result && learning.collection.some((c) => c.id === result.detected.id);
  const reset = () => {
    setResult(null);
    setStatus("idle");
    setText("");
  };

  return (
    <LinearGradient colors={GRADIENTS.haze} style={{ flex: 1 }}>
      <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
          <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            {status === "idle" && (
              <View style={styles.hello}>
                <View style={styles.floaters}>
                  <T size={30} style={{ transform: [{ rotate: "-12deg" }] }}>🚲</T>
                  <T size={34} style={{ marginTop: -18 }}>📖</T>
                  <T size={28} style={{ transform: [{ rotate: "10deg" }] }}>🍎</T>
                </View>
                <View style={styles.glow}>
                  <Mascot size={130} />
                </View>
                <T w="black" size={26} style={{ textAlign: "center", marginTop: 16 }}>Halo! Mau belajar{"\n"}dari benda apa?</T>
                <T color={COLORS.muted} style={{ textAlign: "center", marginTop: 6 }}>
                  Teman kecilmu untuk belajar{"\n"}dari sekitar rumah dan sekolah
                </T>
              </View>
            )}

            {status === "loading" && <StateView title={`Mengenali "${text}"...`} />}

            {status === "error" && (
              <StateView type="error" title="Belum berhasil" message={error} onRetry={text ? () => run(text) : undefined} />
            )}

            {status === "done" && result && (
              <View>
                <SourceBadge source={result.source} />
                <Card style={styles.detected}>
                  <View style={styles.emojiBox}>
                    <T size={38}>{result.detected.emoji}</T>
                  </View>
                  <View style={{ flex: 1 }}>
                    <T size={12} color={COLORS.muted}>Objek dikenali</T>
                    <T w="black" size={22}>{result.detected.name}</T>
                    <T size={12} color={COLORS.primary} w="semibold">{result.candidate_topics.length} topik lintas mapel</T>
                  </View>
                  <Pressable onPress={() => toggleSaved(result.detected)} style={[styles.save, saved && { backgroundColor: COLORS.primary }]} accessibilityLabel="Simpan ke koleksi">
                    <Ionicons name={saved ? "bookmark" : "bookmark-outline"} size={20} color={saved ? "#fff" : COLORS.primary} />
                  </Pressable>
                </Card>

                <T w="black" size={17} style={{ marginTop: 20, marginBottom: 12 }}>Pilih topik belajar</T>
                {result.candidate_topics.length === 0 ? (
                  <StateView type="empty" message="Belum ada topik untuk objek ini." />
                ) : (
                  result.candidate_topics.map((t) => (
                    <TopicRow key={t.id} item={t} done={learning.completions.some((c) => c.moduleId === t.id)} onPress={() => router.push(`/materi/${t.id}`)} />
                  ))
                )}
                <Pressable onPress={reset} style={{ alignSelf: "center", padding: 12 }}>
                  <T w="bold" color={COLORS.primary}>Pindai benda lain</T>
                </Pressable>
              </View>
            )}
          </ScrollView>

          <View style={[styles.composerWrap, { paddingBottom: Math.max(insets.bottom, 12) + 74 }]}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingHorizontal: 20 }} keyboardShouldPersistTaps="handled">
              {OBJECTS.map((o) => (
                <Chip key={o.id} label={o.name} icon={o.emoji} onPress={() => run(o.name)} />
              ))}
            </ScrollView>
            <View style={styles.composer}>
              <TextInput
                value={text}
                onChangeText={(v) => {
                  setText(v);
                  setHint("");
                }}
                placeholder="Ketik nama benda, mis. roda sepeda"
                placeholderTextColor="#B5B2C9"
                style={styles.input}
                returnKeyType="search"
                onSubmitEditing={() => run(text)}
                autoCapitalize="none"
              />
              <View style={styles.composerRow}>
                <Pressable style={styles.tool} onPress={() => setHint("Scan kamera akan hadir di versi berikutnya 📷")} accessibilityLabel="Kamera">
                  <Ionicons name="camera-outline" size={18} color={COLORS.muted} />
                </Pressable>
                <Pressable style={styles.tool} onPress={() => setHint("Unggah foto akan hadir di versi berikutnya 🖼️")} accessibilityLabel="Galeri">
                  <Ionicons name="image-outline" size={18} color={COLORS.muted} />
                </Pressable>
                <T size={11} color={COLORS.muted} style={{ flex: 1 }} numberOfLines={1}>{hint}</T>
                <Pressable style={styles.send} onPress={() => run(text)} accessibilityLabel="Kenali objek">
                  <Ionicons name="arrow-up" size={20} color="#fff" />
                </Pressable>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  body: { padding: 20, paddingBottom: 20, flexGrow: 1, justifyContent: "center" },
  hello: { alignItems: "center", paddingVertical: 20 },
  floaters: { flexDirection: "row", gap: 18, marginBottom: 4 },
  glow: { backgroundColor: "rgba(255,159,107,0.15)", borderRadius: 100, padding: 18 },
  detected: { flexDirection: "row", alignItems: "center", gap: 14 },
  emojiBox: { width: 64, height: 64, borderRadius: 20, backgroundColor: COLORS.peachSoft, alignItems: "center", justifyContent: "center" },
  save: { width: 42, height: 42, borderRadius: 21, backgroundColor: COLORS.primarySoft, alignItems: "center", justifyContent: "center" },
  composerWrap: { gap: 10, paddingTop: 8 },
  composer: { marginHorizontal: 20, backgroundColor: "#fff", borderRadius: 22, padding: 12, borderWidth: 1.5, borderColor: "#DCD4FF", ...SHADOW },
  input: { fontFamily: FONTS.semibold, fontSize: 15, color: COLORS.text, paddingVertical: 6, paddingHorizontal: 4 },
  composerRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 6 },
  tool: { width: 34, height: 34, borderRadius: 17, backgroundColor: COLORS.bg, alignItems: "center", justifyContent: "center" },
  send: { width: 38, height: 38, borderRadius: 19, backgroundColor: COLORS.text, alignItems: "center", justifyContent: "center" },
});
