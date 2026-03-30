const primary = "#4F46E5";
const primaryLight = "#6366F1";
const primaryDark = "#3730A3";

export default {
  light: {
    text: "#111827",
    textSecondary: "#6B7280",
    textMuted: "#9CA3AF",
    background: "#F9FAFB",
    backgroundSecondary: "#FFFFFF",
    backgroundTertiary: "#F3F4F6",
    tint: primary,
    tintLight: "#EEF2FF",
    primary,
    primaryLight,
    primaryDark,
    tabIconDefault: "#9CA3AF",
    tabIconSelected: primary,
    border: "#E5E7EB",
    borderLight: "#F3F4F6",
    error: "#EF4444",
    errorLight: "#FEF2F2",
    success: "#10B981",
    successLight: "#ECFDF5",
    warning: "#F59E0B",
    warningLight: "#FFFBEB",
    cardShadow: "#000",
    overlay: "rgba(0,0,0,0.5)",
    roles: {
      Admin: { bg: "#EEF2FF", text: "#4F46E5" },
      Manager: { bg: "#F0FDF4", text: "#16A34A" },
      Developer: { bg: "#EFF6FF", text: "#2563EB" },
      Designer: { bg: "#FDF4FF", text: "#9333EA" },
      Analyst: { bg: "#FFF7ED", text: "#EA580C" },
      HR: { bg: "#FFF1F2", text: "#E11D48" },
      Other: { bg: "#F9FAFB", text: "#6B7280" },
    },
  },
};

export type ColorScheme = typeof import("./colors").default;
