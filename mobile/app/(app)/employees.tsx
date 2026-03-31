import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Platform,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  deleteEmployee,
  getListEmployeesQueryKey,
  getGetDashboardStatsQueryKey,
  useListEmployees,
} from "@/lib/employees";
import { useQueryClient } from "@tanstack/react-query";
import { EmployeeCard } from "@/components/EmployeeCard";
import Colors from "@/constants/colors";

export default function EmployeesScreen() {
  const C = Colors.light;
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");

  const { data, isLoading, refetch, isRefetching } = useListEmployees();
  const employees = data?.employees ?? [];

  const filtered = employees.filter(
    (e) =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.email.toLowerCase().includes(search.toLowerCase()) ||
      e.role.toLowerCase().includes(search.toLowerCase()),
  );

  const topInset = Platform.OS === "web" ? 67 : insets.top;

  const handleDelete = (id: string, name: string) => {
    Alert.alert("Remove Employee", `Are you sure you want to remove ${name}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteEmployee(id);
            queryClient.invalidateQueries({
              queryKey: getListEmployeesQueryKey(),
            });
            queryClient.invalidateQueries({
              queryKey: getGetDashboardStatsQueryKey(),
            });
            if (Platform.OS !== "web") {
              Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Success,
              );
            }
          } catch {
            Alert.alert(
              "Error",
              "Failed to remove employee. Please try again.",
            );
          }
        },
      },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: C.background }]}>
      <View style={[styles.header, { paddingTop: topInset + 16 }]}>
        <View style={styles.titleRow}>
          <Text style={[styles.title, { color: C.text }]}>Employees</Text>
          <Pressable
            onPress={() => router.push("/(app)/employee/add")}
            style={({ pressed }) => [
              styles.addBtn,
              { backgroundColor: C.primary, opacity: pressed ? 0.85 : 1 },
            ]}
          >
            <Feather name="plus" size={20} color="#fff" />
          </Pressable>
        </View>

        <View
          style={[
            styles.searchBox,
            { backgroundColor: C.backgroundSecondary, borderColor: C.border },
          ]}
        >
          <Feather name="search" size={16} color={C.textMuted} />
          <TextInput
            style={[
              styles.searchInput,
              { color: C.text, fontFamily: "Inter_400Regular" },
            ]}
            placeholder="Search by name, email, or role..."
            placeholderTextColor={C.textMuted}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <Pressable onPress={() => setSearch("")}>
              <Feather name="x" size={16} color={C.textMuted} />
            </Pressable>
          )}
        </View>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={C.primary} />
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={[
            styles.list,
            { paddingBottom: tabBarHeight + 20 },
          ]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={!!isRefetching}
              onRefresh={refetch}
              tintColor={C.primary}
            />
          }
          scrollEnabled={filtered.length > 0}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <View
                style={[styles.emptyIcon, { backgroundColor: C.tintLight }]}
              >
                <Feather name="users" size={32} color={C.primary} />
              </View>
              <Text style={[styles.emptyTitle, { color: C.text }]}>
                {search ? "No results found" : "No employees yet"}
              </Text>
              <Text style={[styles.emptySubtitle, { color: C.textSecondary }]}>
                {search
                  ? "Try a different search term"
                  : "Tap the + button to add your first employee"}
              </Text>
            </View>
          )}
          renderItem={({ item }) => (
            <EmployeeCard
              employee={item}
              onPress={() =>
                router.push({
                  pathname: "/(app)/employee/[id]",
                  params: { id: item.id.toString() },
                })
              }
              onDelete={() => handleDelete(item.id, item.name)}
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    gap: 12,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 28,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.5,
  },
  addBtn: {
    width: 44,
    height: 44,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    height: "100%",
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  list: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    paddingTop: 80,
    gap: 12,
  },
  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: "Inter_600SemiBold",
  },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    maxWidth: 260,
    lineHeight: 20,
  },
});
