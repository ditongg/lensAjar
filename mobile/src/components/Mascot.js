import { View, StyleSheet } from "react-native";

// "Lensi" — maskot LensAjar: bola peach berkacamata lensa besar.
// Dibuat dari View saja (tanpa aset gambar) supaya ringan di Expo Go.
export default function Mascot({ size = 96, mood = "happy" }) {
  const s = size / 100;
  const px = (n) => n * s;
  return (
    <View style={{ width: px(100), height: px(100), alignItems: "center", justifyContent: "flex-end" }}>
      {/* telinga */}
      <View style={[styles.ear, { width: px(26), height: px(26), borderRadius: px(13), left: px(14), top: px(10) }]} />
      <View style={[styles.ear, { width: px(26), height: px(26), borderRadius: px(13), right: px(14), top: px(10) }]} />
      {/* badan */}
      <View style={[styles.body, { width: px(84), height: px(80), borderRadius: px(40) }]}>
        <View style={[styles.belly, { width: px(52), height: px(34), borderRadius: px(26), bottom: px(6) }]} />
        {/* kacamata lensa */}
        <View style={[styles.glasses, { top: px(18), gap: px(6) }]}>
          {[0, 1].map((i) => (
            <View key={i} style={[styles.lens, { width: px(26), height: px(26), borderRadius: px(13), borderWidth: px(3.5) }]}>
              <View style={[styles.eye, { width: px(8), height: mood === "wink" && i === 1 ? px(2.5) : px(9), borderRadius: px(5) }]} />
              <View style={[styles.shine, { width: px(4), height: px(4), borderRadius: px(2), top: px(4), right: px(5) }]} />
            </View>
          ))}
          <View style={[styles.bridge, { width: px(8), height: px(3.5), top: px(11), left: px(26) }]} />
        </View>
        {/* pipi + mulut */}
        <View style={[styles.cheek, { width: px(10), height: px(6), borderRadius: px(3), left: px(12), top: px(46) }]} />
        <View style={[styles.cheek, { width: px(10), height: px(6), borderRadius: px(3), right: px(12), top: px(46) }]} />
        <View style={[styles.mouth, { width: px(12), height: px(7), borderBottomLeftRadius: px(7), borderBottomRightRadius: px(7), top: px(47) }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  ear: { position: "absolute", backgroundColor: "#FF9F6B" },
  body: { backgroundColor: "#FFB07F", alignItems: "center", overflow: "hidden" },
  belly: { position: "absolute", backgroundColor: "#FFE4D2" },
  glasses: { position: "absolute", flexDirection: "row" },
  lens: { borderColor: "#5B4BD8", backgroundColor: "#FFFFFF", alignItems: "center", justifyContent: "center" },
  eye: { backgroundColor: "#24223A" },
  shine: { position: "absolute", backgroundColor: "#FFFFFF" },
  bridge: { position: "absolute", backgroundColor: "#5B4BD8" },
  cheek: { position: "absolute", backgroundColor: "#FF7D8E", opacity: 0.55 },
  mouth: { position: "absolute", backgroundColor: "#8A3B2E" },
});
