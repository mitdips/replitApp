import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Colors from "@/constants/colors";

type EmployeeStatusProps = {
  isActive: boolean;
  compact?: boolean;
};

export function EmployeeStatus({
  isActive,
  compact = false,
}: EmployeeStatusProps) {
  const C = Colors.light;

  return (
    <View
      style={[
        styles.statusBadge,
        compact && styles.compactBadge,
        {
          backgroundColor: isActive
            ? C.successLight
            : C.backgroundTertiary,
        },
      ]}
    >
      <View
        style={[
          styles.statusDot,
          compact && styles.compactDot,
          {
            backgroundColor: isActive ? C.success : C.textMuted,
          },
        ]}
      />
      <Text
        style={[
          styles.statusText,
          compact && styles.compactText,
          { color: isActive ? C.success : C.textMuted },
        ]}
      >
        {isActive ? "Active" : "Inactive"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  compactBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 999,
  },
  compactDot: {
    width: 6,
    height: 6,
  },
  statusText: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
  },
  compactText: {
    fontSize: 11,
  },
});
