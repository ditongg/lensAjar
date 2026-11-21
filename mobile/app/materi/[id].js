import { useCallback, useEffect, useState } from "react";
import { View, Pressable, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { Screen, T, Card, Button, StateView, SourceBadge } from "../../src/components/ui";
import Mascot from "../../src/components/Mascot";
import { getContent } from "../../src/services/ApiService";
import { useAuth } from "../../src/lib/auth";
import { COLORS, subjectStyle } from "../../src/lib/theme";

// Urutan blok materi menurut gaya belajar (Personalisasi Jalur Belajar)
const ORDER = {
  visual: ["poin", "ringkasan", "aktivitas"],
  auditori: ["ringkasan", "poin", "aktivitas"],
  kinestetik: ["aktivitas", "poin", "ringkasan"],
  membaca: ["ringkasan", "poin", "aktivitas"],
};
const TIPS = {
  visual: "Coba gambar diagram kecil dari poin-poin penting.",
  auditori: "Bacakan ringkasannya keras-keras, lalu ceritakan ulang.",
  kinestetik: "Mulai dari praktik dulu, baru baca teorinya!",
  membaca: "Tulis ulang ringkasan dengan kata-katamu sendiri.",
};

export default function Materi() {
  const { id } = useLocalSearchParams();
  const { user, learning, recordCompletion } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  const load = useCallback(() => {
    setError("");
    setData(null);
    getContent(String(id))
      .then(setData)
      .catch((e) => setError(e.message || "Gagal memuat materi"));
  }, [id]);

  useEffect(load, [load]);

  const back = (
    <Pressable onPress={() => router.back()} style={styles.back} accessibilityLabel="Kembali">
      <Ionicons name="chevron-back" size={22} color={COLORS.text} />
    </Pressable>
  );

  if (error) return <Screen>{back}<StateView type="error" title="Materi tidak bisa dimuat" message={error} onRetry={load} /></Screen>;
  if (!data) return <Screen>{back}<StateView title="Memuat materi..." /></Screen>;

  const s = subjectStyle(data.subject);
  const style = user?.learningStyle || "visual";
  const best = learning.completions.filter((c) => c.moduleId === data.id).reduce((m, c) => Math.max(m, c.score), -1);
  const quiz = data.quiz || [];
  const allAnswered = quiz.length > 0 && quiz.every((_, i) => answers[i] !== undefined);

  const submit = () => {
    const score = quiz.filter((q, i) => answers[i] === q.answer).length;
    setResult({ score, total: quiz.length });
    recordCompletion({ moduleId: data.id, subject: data.subject, score, total: quiz.length });
  };
  const retry = () => {
    setAnswers({});
    setResult(null);
  };

  const blocks = {
    ringkasan: (
      <Card key="r" style={styles.block}>
        <Header icon="reader" color={s.color} title="Ringkasan" />
        <T style={{ lineHeight: 22 }}>{data.summary}</T>
      </Card>
    ),
    poin: data.keyPoints?.length ? (
      <Card key="p" style={styles.block}>
        <Header icon="bulb" color={s.color} title="Poin penting" />
        {data.keyPoints.map((p, i) => (
          <View key={i} style={styles.point}>
            <View style={[styles.num, { backgroundColor: s.soft }]}><T w="bold" size={12} color={s.color}>{i + 1}</T></View>
            <T style={{ flex: 1, lineHeight: 21 }}>{p}</T>
          </View>
        ))}
      </Card>
    ) : null,
    aktivitas: data.activity ? (
      <Card key="a" style={[styles.block, { backgroundColor: COLORS.peachSoft }]}>
        <Header icon="hand-left" color="#C2581F" title="Coba di sekitarmu" />
        <T style={{ lineHeight: 21 }}>{data.activity}</T>
      </Card>
    ) : null,
  };

  return (
    <Screen contentStyle={{ paddingBottom: 48 }}>
      {back}
      <SourceBadge source={data.source} />
      <LinearGradient colors={[s.color, `${s.color}AA`]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
        <View style={{ flex: 1, gap: 6 }}>
          <View style={styles.heroTag}><T w="bold" size={12} color="#fff">{data.subject} · {data.level}</T></View>
          <T w="black" size={24} color="#fff">{data.title || data.topic}</T>
          <T w="semibold" size={12} color="rgba(255,255,255,0.9)">
            ⏱ {data.minutes || 5} menit{best >= 0 ? `  ·  ⭐ terbaik ${best}/${quiz.length}` : ""}
          </T>
        </View>
        <Mascot size={78} />
      </LinearGradient>

      <View style={styles.tip}>
        <Ionicons name="sparkles" size={16} color={COLORS.primary} />
        <T size={13} style={{ flex: 1 }}><T w="bold" size={13}>Tips gaya {style}: </T>{TIPS[style]}</T>
      </View>

      {(ORDER[style] || ORDER.visual).map((k) => blocks[k])}

      {data.resources?.length > 0 && (
        <Card style={styles.block}>
          <Header icon="library" color={s.color} title="Sumber terbuka" />
          {data.resources.map((r, i) => {
            const item = typeof r === "string" ? { title: r, url: r.startsWith("http") ? r : null } : r;
            return (
              <Pressable key={i} disabled={!item.url} onPress={() => WebBrowser.openBrowserAsync(item.url)} style={styles.res}>
                <Ionicons name="open-outline" size={16} color={COLORS.primary} />
                <T w="semibold" color={item.url ? COLORS.primary : COLORS.text} style={{ flex: 1 }}>{item.title}</T>
              </Pressable>
            );
          })}
        </Card>
      )}

      {quiz.length > 0 && (
        <Card style={styles.block}>
          <Header icon="help-circle" color={s.color} title="Kuis singkat" />
          {quiz.map((q, qi) => (
            <View key={qi} style={{ marginBottom: 14 }}>
              <T w="bold" style={{ marginBottom: 8 }}>{qi + 1}. {q.q}</T>
              {q.options.map((opt, oi) => {
                const picked = answers[qi] === oi;
                const showCorrect = result && oi === q.answer;
                const showWrong = result && picked && oi !== q.answer;
                return (
                  <Pressable
                    key={oi}
                    disabled={!!result}
                    onPress={() => setAnswers((a) => ({ ...a, [qi]: oi }))}
                    style={[styles.opt, picked && styles.optPicked, showCorrect && styles.optCorrect, showWrong && styles.optWrong]}
                  >
                    <View style={[styles.radio, picked && { borderColor: COLORS.primary, backgroundColor: COLORS.primary }]} />
                    <T w="semibold" style={{ flex: 1 }}>{opt}</T>
                    {showCorrect && <Ionicons name="checkmark-circle" size={18} color={COLORS.green} />}
                    {showWrong && <Ionicons name="close-circle" size={18} color={COLORS.danger} />}
                  </Pressable>
                );
              })}
            </View>
          ))}

          {result ? (
            <View style={styles.result}>
              <Mascot size={64} mood={result.score === result.total ? "happy" : "wink"} />
              <View style={{ flex: 1 }}>
                <T w="black" size={18}>{result.score}/{result.total} benar</T>
                <T size={12} color={COLORS.muted}>
                  {result.score === result.total ? "Sempurna! Progres tersimpan 🎉" : "Progres tersimpan. Coba lagi supaya sempurna!"}
                </T>
              </View>
            </View>
          ) : null}

          {result ? (
            <View style={{ flexDirection: "row", gap: 10 }}>
              <Button title="Ulangi" variant="ghost" onPress={retry} style={{ flex: 1 }} />
              <Button title="Selesai" onPress={() => router.back()} style={{ flex: 1 }} />
            </View>
          ) : (
            <Button title={allAnswered ? "Kumpulkan jawaban" : "Jawab semua soal dulu"} disabled={!allAnswered} onPress={submit} />
          )}
        </Card>
      )}
    </Screen>
  );
}

function Header({ icon, color, title }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 10 }}>
      <Ionicons name={icon} size={18} color={color} />
      <T w="black" size={16}>{title}</T>
    </View>
  );
}

const styles = StyleSheet.create({
  back: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#fff", alignItems: "center", justifyContent: "center", marginBottom: 12 },
  hero: { flexDirection: "row", alignItems: "center", borderRadius: 26, padding: 18, gap: 10 },
  heroTag: { alignSelf: "flex-start", backgroundColor: "rgba(255,255,255,0.25)", borderRadius: 999, paddingHorizontal: 10, paddingVertical: 3 },
  tip: { flexDirection: "row", gap: 8, alignItems: "center", backgroundColor: COLORS.primarySoft, borderRadius: 16, padding: 12, marginVertical: 14 },
  block: { marginBottom: 12 },
  point: { flexDirection: "row", gap: 10, marginBottom: 10 },
  num: { width: 24, height: 24, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  res: { flexDirection: "row", alignItems: "center", gap: 8, paddingVertical: 6 },
  opt: { flexDirection: "row", alignItems: "center", gap: 10, borderWidth: 1.5, borderColor: COLORS.line, borderRadius: 14, padding: 12, marginBottom: 8 },
  optPicked: { borderColor: COLORS.primary, backgroundColor: COLORS.primarySoft },
  optCorrect: { borderColor: COLORS.green, backgroundColor: COLORS.greenSoft },
  optWrong: { borderColor: COLORS.danger, backgroundColor: COLORS.dangerSoft },
  radio: { width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor: COLORS.line },
  result: { flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: COLORS.bg, borderRadius: 18, padding: 12, marginBottom: 12 },
});
