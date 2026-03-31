import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  updateEmployee,
  deleteEmployee,
  getListEmployeesQueryKey,
  getGetDashboardStatsQueryKey,
  getGetEmployeeQueryKey,
  useGetEmployee,
} from "@/lib/employees";
import { useQueryClient } from "@tanstack/react-query";
import { EmployeeStatus } from "@/components/EmployeeStatus";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { SelectInput } from "@/components/ui/SelectInput";
import { RoleBadge } from "@/components/ui/RoleBadge";
import Colors from "@/constants/colors";

const ROLES = [
  "Admin",
  "Manager",
  "Developer",
  "Designer",
  "Analyst",
  "HR",
  "Other",
];
const DEPARTMENTS = [
  "Software Development",
  "IT Infrastructure",
  "Cybersecurity",
  "Data & Analytics",
  "Quality Assurance (QA)",
  "Project / Product Management",
  "IT Support / Helpdesk",
  "Database Management",
  "Mobile Applications",
];

export default function EmployeeDetailScreen() {
  const C = Colors.light;
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const queryClient = useQueryClient();

  const employeeId = id ?? "";
  const { data, isLoading } = useGetEmployee(employeeId);
  const employee = data?.employee;

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [department, setDepartment] = useState("");
  const [role, setRole] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (employee) {
      setName(employee.name);
      setEmail(employee.email);
      setPhone(employee.phone ?? "");
      setDepartment(employee.department ?? "");
      setRole(employee.role);
      setIsActive(employee.isActive);
    }
  }, [employee]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "Name is required";
    if (!email.trim()) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = "Invalid email";
    if (!department.trim()) errs.department = "Department is required";
    if (!role) errs.role = "Select a role";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      await updateEmployee(employeeId, {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        department: department.trim(),
        role,
        isActive,
      });
      queryClient.invalidateQueries({ queryKey: getListEmployeesQueryKey() });
      queryClient.invalidateQueries({
        queryKey: getGetDashboardStatsQueryKey(),
      });
      queryClient.invalidateQueries({
        queryKey: getGetEmployeeQueryKey(employeeId),
      });
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      setEditing(false);
    } catch {
      Alert.alert("Error", "Failed to update employee. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    Alert.alert("Remove Employee", "This action cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteEmployee(employeeId);
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
            router.back();
          } catch {
            Alert.alert("Error", "Failed to delete employee.");
          }
        },
      },
    ]);
  };

  const topInset = Platform.OS === "web" ? 67 : insets.top;
  const bottomInset = Platform.OS === "web" ? 34 : insets.bottom;

  if (isLoading || !employee) {
    return (
      <View style={[styles.loading, { backgroundColor: C.background }]}>
        <ActivityIndicator size="large" color={C.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: C.background }]}>
      <View style={[styles.header, { paddingTop: topInset + 12 }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color={C.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: C.text }]}>
          {editing ? "Edit Employee" : "Employee"}
        </Text>
        <Pressable
          onPress={() => {
            if (editing) {
              setEditing(false);
            } else {
              setEditing(true);
            }
          }}
          style={styles.editBtn}
        >
          <Feather
            name={editing ? "x" : "edit-2"}
            size={20}
            color={C.primary}
          />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: bottomInset + 32 },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {!editing ? (
          <View style={styles.viewMode}>
            <View
              style={[
                styles.profileHeader,
                {
                  backgroundColor: C.backgroundSecondary,
                  borderWidth: 1,
                  borderColor: C.border,
                },
              ]}
            >
              <View
                style={[
                  styles.bigAvatar,
                  {
                    backgroundColor: C.tintLight,
                    flexDirection: "row",
                  },
                ]}
              >
                <Text style={[styles.bigInitials, { color: C.primary }]}>
                  {employee.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)}
                </Text>
              </View>
              <Text style={[styles.empName, { color: C.text }]}>
                {employee.name}
              </Text>
              <Text style={[styles.empEmail, { color: C.textSecondary }]}>
                {employee.email}
              </Text>
              <View style={[styles.roleRow]}>
                <RoleBadge role={employee.role} />
              </View>

              <View style={styles.statusBadge}>
                <EmployeeStatus isActive={employee.isActive} />
              </View>
            </View>

            <View
              style={[
                styles.detailCard,
                {
                  backgroundColor: C.backgroundSecondary,
                  borderWidth: 1,
                  borderColor: C.border,
                },
              ]}
            >
              {employee.phone ? (
                <View style={styles.detailRow}>
                  <Feather name="phone" size={16} color={C.textMuted} />
                  <Text style={[styles.detailText, { color: C.text }]}>
                    {employee.phone}
                  </Text>
                </View>
              ) : null}
              <View style={styles.detailRow}>
                <Feather name="briefcase" size={16} color={C.textMuted} />
                <Text style={[styles.detailText, { color: C.text }]}>
                  {employee.department || "No department"}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Feather name="calendar" size={16} color={C.textMuted} />
                <Text style={[styles.detailText, { color: C.text }]}>
                  Joined{" "}
                  {employee.createdAt
                    ? new Date(employee.createdAt).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "N/A"}
                </Text>
              </View>
            </View>

            <Button
              label="Delete Employee"
              onPress={handleDelete}
              variant="danger"
            />
          </View>
        ) : (
          <View style={styles.editForm}>
            <Input
              label="Full Name"
              icon="user"
              placeholder="Jane Smith"
              value={name}
              onChangeText={setName}
              error={errors.name}
              autoCapitalize="words"
            />
            <Input
              label="Email"
              icon="mail"
              placeholder="jane@company.com"
              value={email}
              onChangeText={setEmail}
              error={errors.email}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <Input
              label="Phone (optional)"
              icon="phone"
              placeholder="+1 (555) 000-0000"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
            <SelectInput
              label="Department"
              icon="briefcase"
              placeholder="Select department"
              value={department}
              onSelect={(value) => {
                setDepartment(value);
                setErrors((current) => ({ ...current, department: "" }));
              }}
              error={errors.department}
              options={DEPARTMENTS}
            />

            <View style={styles.roleWrapper}>
              <Text style={[styles.roleLabel, { color: C.textSecondary }]}>
                Role
              </Text>
              <View style={styles.rolesGrid}>
                {ROLES.map((r) => {
                  const selected = role === r;
                  const ROLE_COLORS = C.roles as Record<
                    string,
                    { bg: string; text: string }
                  >;
                  const colors = ROLE_COLORS[r] ?? ROLE_COLORS["Other"];
                  return (
                    <Pressable
                      key={r}
                      onPress={() => setRole(r)}
                      style={[
                        styles.roleChip,
                        {
                          backgroundColor: selected
                            ? colors.bg
                            : C.backgroundSecondary,
                          borderColor: selected ? colors.text : C.border,
                          borderWidth: selected ? 1.5 : 1,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.roleChipText,
                          { color: selected ? colors.text : C.textSecondary },
                        ]}
                      >
                        {r}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <View
              style={[
                styles.switchRow,
                { backgroundColor: C.backgroundSecondary },
              ]}
            >
              <View style={{ flex: 1 }}>
                <Text style={[styles.switchLabel, { color: C.text }]}>
                  Active
                </Text>
                <Text style={[styles.switchSub, { color: C.textSecondary }]}>
                  {isActive
                    ? "Employee is currently active"
                    : "Employee is currently inactive"}
                </Text>
              </View>
              <Switch
                value={isActive}
                onValueChange={setIsActive}
                trackColor={{ true: C.primary, false: C.border }}
              />
            </View>

            <Button
              label="Save Changes"
              onPress={handleSave}
              loading={saving}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 17,
    fontFamily: "Inter_600SemiBold",
  },
  editBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 8,
    gap: 16,
  },
  viewMode: { gap: 16 },
  profileHeader: {
    alignItems: "center",
    padding: 24,
    borderRadius: 20,
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  bigAvatar: {
    width: 72,
    height: 72,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  bigInitials: {
    fontSize: 26,
    fontFamily: "Inter_700Bold",
  },
  empName: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
  },
  empEmail: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
  },
  empMeta: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    marginTop: 4,
  },
  statusBadge: {
    position: "absolute",
    right: 10,
    top: 10,
    zIndex: 2,
  },
  detailCard: {
    borderRadius: 16,
    padding: 16,
    gap: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  detailText: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
  },
  editForm: { gap: 20 },
  roleWrapper: { gap: 8 },
  roleLabel: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
  },
  rolesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  roleChip: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 100,
  },
  roleChipText: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 14,
    gap: 12,
  },
  switchLabel: {
    fontSize: 15,
    fontFamily: "Inter_500Medium",
  },
  switchSub: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    marginTop: 2,
  },
  roleRow: {
    marginTop: 4,
  },
});
