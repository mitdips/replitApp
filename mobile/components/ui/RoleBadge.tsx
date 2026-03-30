import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Colors from "@/constants/colors";

type RoleBadgeProps = {
  role: string;
};

const ROLE_COLORS = Colors.light.roles as Record<string, { bg: string; text: string }>;

export function RoleBadge({ role }: RoleBadgeProps) {
  const colors = ROLE_COLORS[role] ?? ROLE_COLORS["Other"];

  return (
    <View style={[styles.badge, { backgroundColor: colors.bg }]}>
      <Text style={[styles.label, { color: colors.text }]}>{role}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  label: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.2,
  },
});
