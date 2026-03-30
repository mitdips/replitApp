import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  useGetDashboardStats,
  useListEmployees,
} from "@workspace/api-client-react";
import { StatCard } from "@/components/ui/StatCard";
import { RoleBadge } from "@/components/ui/RoleBadge";
import { useAuth } from "@/context/AuthContext";
import Colors from "@/constants/colors";

export default function DashboardScreen() {
  const C = Colors.light;
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const { user } = useAuth();

  const statsQuery = useGetDashboardStats();
  const employeesQuery = useListEmployees();

  const stats = statsQuery.data;
  const recentEmployees = employeesQuery.data?.employees.slice(-3).reverse() ?? [];

  const isLoading = statsQuery.isLoading || employeesQuery.isLoading;
  const refetch = () => {
    statsQuery.refetch();
    employeesQuery.refetch();
  };

  const topInset = Platform.OS === "web" ? 67 : insets.top;

  const firstName = user?.name?.split(" ")[0] ?? "there";

  return (
    <ScrollView
      style={{ backgroundColor: C.background }}
      contentContainerStyle={[
        styles.scroll,
        { paddingTop: topInset + 8, paddingBottom: tabBarHeight + 16 },
      ]}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={!!isLoading} onRefresh={refetch} tintColor={C.primary} />
      }
    >
      <LinearGradient
        colors={["#4F46E5", "#6366F1"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerCard}
      >
        <View>
          <Text style={styles.greeting}>Good day,</Text>
          <Text style={styles.name}>{firstName} 👋</Text>
        </View>
        <View style={styles.headerIcon}>
          <Feather name="bar-chart-2" size={28} color="rgba(255,255,255,0.9)" />
        </View>
      </LinearGradient>

      <Text style={[styles.sectionTitle, { color: C.textSecondary }]}>Overview</Text>

      {isLoading && !stats ? (
        <View style={styles.loadingRow}>
          <ActivityIndicator color={C.primary} />
        </View>
      ) : (
        <View style={styles.statsRow}>
          <StatCard
            label="Total Staff"
            value={stats?.totalEmployees ?? 0}
            icon="users"
            color={C.primary}
            bgColor={C.tintLight}
          />
          <StatCard
            label="Active"
            value={stats?.activeEmployees ?? 0}
            icon="user-check"
            color={C.success}
            bgColor={C.successLight}
          />
        </View>
      )}

      <View style={styles.statsRow}>
        <StatCard
          label="New This Week"
          value={stats?.recentlyAdded ?? 0}
          icon="user-plus"
          color={C.warning}
          bgColor={C.warningLight}
        />
        <StatCard
          label="Inactive"
          value={
            (stats?.totalEmployees ?? 0) - (stats?.activeEmployees ?? 0)
          }
          icon="user-x"
          color={C.error}
          bgColor={C.errorLight}
        />
      </View>

      {recentEmployees.length > 0 && (
        <>
          <Text style={[styles.sectionTitle, { color: C.textSecondary }]}>
            Recent Additions
          </Text>
          <View style={styles.recentList}>
            {recentEmployees.map((emp) => (
              <View
                key={emp.id}
                style={[styles.recentItem, { backgroundColor: C.backgroundSecondary }]}
              >
                <View style={[styles.recentAvatar, { backgroundColor: C.tintLight }]}>
                  <Text style={[styles.recentInitials, { color: C.primary }]}>
                    {emp.name.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <View style={styles.recentInfo}>
                  <Text style={[styles.recentName, { color: C.text }]}>{emp.name}</Text>
                  <Text style={[styles.recentEmail, { color: C.textSecondary }]} numberOfLines={1}>
                    {emp.email}
                  </Text>
                </View>
                <RoleBadge role={emp.role} />
              </View>
            ))}
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: 20,
    gap: 16,
  },
  headerCard: {
    borderRadius: 20,
    padding: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  greeting: {
    fontSize: 14,
    color: "rgba(255,255,255,0.75)",
    fontFamily: "Inter_400Regular",
  },
  name: {
    fontSize: 24,
    color: "#fff",
    fontFamily: "Inter_700Bold",
    marginTop: 2,
  },
  headerIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: -8,
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
  },
  loadingRow: {
    height: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  recentList: {
    gap: 10,
  },
  recentItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 14,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  recentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  recentInitials: {
    fontSize: 15,
    fontFamily: "Inter_700Bold",
  },
  recentInfo: {
    flex: 1,
  },
  recentName: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
  },
  recentEmail: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    marginTop: 1,
  },
});
