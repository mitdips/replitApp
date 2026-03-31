import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  createEmployee,
  getListEmployeesQueryKey,
  getGetDashboardStatsQueryKey,
} from "@/lib/employees";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { SelectInput } from "@/components/ui/SelectInput";
import Colors from "@/constants/colors";

const ROLES = ["Admin", "Manager", "Developer", "Designer", "Analyst", "HR", "Other"];
const DEPARTMENTS = [
  "Software Development",
  "IT Infrastructure",
  "Cybersecurity",
  "Data & Analytics",
  "Quality Assurance (QA)",
  "Project / Product Management",
  "IT Support / Helpdesk",
  "Database Management",
];

export default function AddEmployeeScreen() {
  const C = Colors.light;
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [department, setDepartment] = useState("");
  const [role, setRole] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "Name is required";
    if (!email.trim()) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = "Enter a valid email";
    if (!department.trim()) errs.department = "Department is required";
    if (!role) errs.role = "Please select a role";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await createEmployee({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        department: department.trim(),
        role,
      });
      queryClient.invalidateQueries({ queryKey: getListEmployeesQueryKey() });
      queryClient.invalidateQueries({ queryKey: getGetDashboardStatsQueryKey() });
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      router.back();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to add employee";
      Alert.alert("Error", msg.includes("unique") ? "Email already in use" : msg);
    } finally {
      setLoading(false);
    }
  };

  const topInset = Platform.OS === "web" ? 67 : insets.top;
  const bottomInset = Platform.OS === "web" ? 34 : insets.bottom;

  return (
    <View style={[styles.container, { backgroundColor: C.background }]}>
      <View style={[styles.header, { paddingTop: topInset + 12 }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="x" size={22} color={C.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: C.text }]}>Add Employee</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: bottomInset + 24 },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.form}>
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
            <Text style={[styles.roleLabel, { color: C.textSecondary }]}>Role</Text>
            <View style={styles.rolesGrid}>
              {ROLES.map((r) => {
                const selected = role === r;
                const ROLE_COLORS = C.roles as Record<string, { bg: string; text: string }>;
                const colors = ROLE_COLORS[r] ?? ROLE_COLORS["Other"];
                return (
                  <Pressable
                    key={r}
                    onPress={() => {
                      setRole(r);
                      setErrors((e) => ({ ...e, role: "" }));
                    }}
                    style={[
                      styles.roleChip,
                      {
                        backgroundColor: selected ? colors.bg : C.backgroundSecondary,
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
            {errors.role ? (
              <Text style={[styles.roleError, { color: C.error }]}>{errors.role}</Text>
            ) : null}
          </View>

          <Button label="Add Employee" onPress={handleSave} loading={loading} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
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
  scroll: {
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  form: { gap: 20 },
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
  roleError: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
});
