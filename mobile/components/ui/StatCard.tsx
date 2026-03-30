import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Colors from "@/constants/colors";

type StatCardProps = {
  label: string;
  value: number | string;
  icon: keyof typeof Feather.glyphMap;
  color?: string;
  bgColor?: string;
};

export function StatCard({ label, value, icon, color, bgColor }: StatCardProps) {
  const C = Colors.light;
  const iconColor = color ?? C.primary;
  const iconBg = bgColor ?? C.tintLight;

  return (
    <View style={[styles.card, { backgroundColor: C.backgroundSecondary }]}>
      <View style={[styles.iconContainer, { backgroundColor: iconBg }]}>
        <Feather name={icon} size={22} color={iconColor} />
      </View>
      <Text style={[styles.value, { color: C.text }]}>{value}</Text>
      <Text style={[styles.label, { color: C.textSecondary }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  value: {
    fontSize: 28,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.5,
  },
  label: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
  },
});
