import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/context/AuthContext";
import Colors from "@/constants/colors";

type SettingRowProps = {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  value?: string;
  onPress?: () => void;
  danger?: boolean;
};

function SettingRow({ icon, label, value, onPress, danger }: SettingRowProps) {
  const C = Colors.light;
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        { backgroundColor: C.backgroundSecondary, opacity: pressed ? 0.8 : 1 },
      ]}
    >
      <View
        style={[
          styles.rowIcon,
          { backgroundColor: danger ? C.errorLight : C.tintLight },
        ]}
      >
        <Feather name={icon} size={16} color={danger ? C.error : C.primary} />
      </View>
      <Text style={[styles.rowLabel, { color: danger ? C.error : C.text }]}>
        {label}
      </Text>
      {value ? (
        <Text style={[styles.rowValue, { color: C.textSecondary }]}>
          {value}
        </Text>
      ) : null}
      {!danger && (
        <Feather name="chevron-right" size={16} color={C.textMuted} />
      )}
    </Pressable>
  );
}

export default function SettingsScreen() {
  const C = Colors.light;
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const { user, logout } = useAuth();

  const topInset = Platform.OS === "web" ? 67 : insets.top;

  const handleLogout = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Sign Out", style: "destructive", onPress: logout },
    ]);
  };

  const initials =
    user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) ?? "?";

  return (
    <ScrollView
      style={{ backgroundColor: C.background }}
      contentContainerStyle={[
        styles.scroll,
        { paddingTop: topInset + 16, paddingBottom: tabBarHeight + 20 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.pageTitle, { color: C.text }]}>Settings</Text>

      <LinearGradient
        colors={["#4F46E5", "#6366F1"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.profileCard}
      >
        <View style={styles.avatarLarge}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.profileName}>{user?.name ?? "—"}</Text>
          <Text style={styles.profileEmail}>{user?.email ?? "—"}</Text>
        </View>
      </LinearGradient>

      <Text style={[styles.sectionLabel, { color: C.textMuted }]}>Account</Text>
      <View style={styles.section}>
        <SettingRow icon="user" label="Name" value={user?.name} />
        <View style={[styles.divider, { backgroundColor: C.borderLight }]} />
        <SettingRow icon="mail" label="Email" value={user?.email} />
      </View>

      <Text style={[styles.sectionLabel, { color: C.textMuted }]}>App</Text>
      <View style={styles.section}>
        <SettingRow icon="info" label="Version" value="1.0.0" />
      </View>

      <Text style={[styles.sectionLabel, { color: C.textMuted }]}>Actions</Text>
      <View style={styles.section}>
        <SettingRow
          icon="log-out"
          label="Sign Out"
          onPress={handleLogout}
          danger
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: 20,
    gap: 12,
  },
  pageTitle: {
    fontSize: 28,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  profileCard: {
    borderRadius: 20,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  avatarLarge: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 20,
    fontFamily: "Inter_700Bold",
    color: "#fff",
  },
  profileName: {
    fontSize: 18,
    fontFamily: "Inter_700Bold",
    color: "#fff",
  },
  profileEmail: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.8)",
    marginTop: 2,
  },
  sectionLabel: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginTop: 4,
    marginLeft: 4,
  },
  section: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  rowIcon: {
    width: 32,
    height: 32,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  rowLabel: {
    flex: 1,
    fontSize: 15,
    fontFamily: "Inter_500Medium",
  },
  rowValue: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    maxWidth: 140,
    textAlign: "right",
  },
  divider: {
    height: 1,
    marginLeft: 60,
  },
});
