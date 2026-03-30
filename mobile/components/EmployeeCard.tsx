import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Colors from "@/constants/colors";
import { RoleBadge } from "@/components/ui/RoleBadge";

type Employee = {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  role: string;
  isActive: boolean;
};

type EmployeeCardProps = {
  employee: Employee;
  onPress: () => void;
  onDelete: () => void;
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const AVATAR_COLORS = [
  { bg: "#EEF2FF", text: "#4F46E5" },
  { bg: "#F0FDF4", text: "#16A34A" },
  { bg: "#EFF6FF", text: "#2563EB" },
  { bg: "#FDF4FF", text: "#9333EA" },
  { bg: "#FFF7ED", text: "#EA580C" },
  { bg: "#FFF1F2", text: "#E11D48" },
];

function getAvatarColor(name: string) {
  const idx = name.charCodeAt(0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
}

export function EmployeeCard({ employee, onPress, onDelete }: EmployeeCardProps) {
  const C = Colors.light;
  const initials = getInitials(employee.name);
  const avatarColor = getAvatarColor(employee.name);

  const handleDelete = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    onDelete();
  };

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: C.backgroundSecondary },
        pressed && styles.pressed,
      ]}
    >
      <View style={[styles.avatar, { backgroundColor: avatarColor.bg }]}>
        <Text style={[styles.initials, { color: avatarColor.text }]}>{initials}</Text>
      </View>

      <View style={styles.info}>
        <View style={styles.nameRow}>
          <Text style={[styles.name, { color: C.text }]} numberOfLines={1}>
            {employee.name}
          </Text>
          {!employee.isActive && (
            <View style={[styles.inactiveBadge, { backgroundColor: C.backgroundTertiary }]}>
              <Text style={[styles.inactiveText, { color: C.textMuted }]}>Inactive</Text>
            </View>
          )}
        </View>
        <Text style={[styles.email, { color: C.textSecondary }]} numberOfLines={1}>
          {employee.email}
        </Text>
        <View style={styles.roleRow}>
          <RoleBadge role={employee.role} />
        </View>
      </View>

      <View style={styles.actions}>
        <Pressable onPress={handleDelete} hitSlop={8} style={styles.deleteBtn}>
          <Feather name="trash-2" size={16} color={C.error} />
        </Pressable>
        <Feather name="chevron-right" size={18} color={C.textMuted} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1,
  },
  pressed: {
    opacity: 0.85,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  initials: {
    fontSize: 16,
    fontFamily: "Inter_700Bold",
  },
  info: {
    flex: 1,
    gap: 3,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  name: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    flex: 1,
  },
  email: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
  },
  roleRow: {
    marginTop: 4,
  },
  inactiveBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  inactiveText: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  deleteBtn: {
    padding: 6,
  },
});
