// Tema visual LensAjar: lavender lembut + aksen peach, kartu putih membulat.
export const COLORS = {
  primary: "#7B6CF6",
  primaryDark: "#5B4BD8",
  primarySoft: "#EFEAFF",
  peach: "#FF9F6B",
  peachSoft: "#FFE9DD",
  pink: "#FF6F91",
  green: "#2EBD85",
  greenSoft: "#E3F7EE",
  yellow: "#FFC542",
  bg: "#F7F5FE",
  card: "#FFFFFF",
  text: "#24223A",
  muted: "#8E8BA6",
  line: "#ECE9F6",
  danger: "#E6506E",
  dangerSoft: "#FDE8EC",
};

export const GRADIENTS = {
  header: ["#8C7CFA", "#B49BF5", "#FFD3C2"],
  card: ["#8C7CFA", "#6E5CF0"],
  haze: ["#E9E3FF", "#F7F5FE", "#FFF1EA"],
  peach: ["#FFB28A", "#FF8D6B"],
};

export const FONTS = {
  regular: "Nunito_400Regular",
  semibold: "Nunito_600SemiBold",
  bold: "Nunito_700Bold",
  black: "Nunito_800ExtraBold",
};

export const SHADOW = {
  shadowColor: "#5B4BD8",
  shadowOpacity: 0.08,
  shadowRadius: 14,
  shadowOffset: { width: 0, height: 6 },
  elevation: 3,
};

export const SUBJECTS = {
  Biologi: { color: "#2EBD85", soft: "#E3F7EE", icon: "leaf" },
  Fisika: { color: "#7B6CF6", soft: "#EFEAFF", icon: "planet" },
  Matematika: { color: "#FF8D6B", soft: "#FFE9DD", icon: "calculator" },
  Kimia: { color: "#1FA5E0", soft: "#E1F3FC", icon: "flask" },
  "Bahasa Indonesia": { color: "#E6506E", soft: "#FDE8EC", icon: "book" },
  IPS: { color: "#E0A100", soft: "#FFF5D9", icon: "earth" },
};

export const subjectStyle = (s) => SUBJECTS[s] || { color: COLORS.primary, soft: COLORS.primarySoft, icon: "book" };
