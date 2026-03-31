import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import Colors from "@/constants/colors";
import { registerUser } from "@/lib/registerUser";

export default function SignupScreen() {
  const C = Colors.light;
  const insets = useSafeAreaInsets();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "Name is required";
    if (!email.trim()) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = "Enter a valid email";
    if (!password) errs.password = "Password is required";
    else if (password.length < 6)
      errs.password = "Password must be at least 6 characters";
    if (password !== confirmPassword)
      errs.confirmPassword = "Passwords do not match";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSignup = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const result = await registerUser({
        displayName: name,
        email,
        password,
        confirmPassword,
      });

      if (!result.success) {
        Alert.alert("Signup Failed", result.error);
        return;
      }

      router.replace("/(app)/dashboard");
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Signup failed. Please try again.";
      Alert.alert("Signup Failed", msg);
    } finally {
      setLoading(false);
    }
  };

  const topInset = Platform.OS === "web" ? 67 : insets.top;
  const bottomInset = Platform.OS === "web" ? 34 : insets.bottom;

  return (
    <View style={[styles.container, { backgroundColor: C.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scroll,
            { paddingTop: topInset + 20, paddingBottom: bottomInset + 24 },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Text style={[styles.backText, { color: C.primary }]}>← Back</Text>
          </Pressable>

          <View style={styles.header}>
            <Text style={[styles.title, { color: C.text }]}>
              Create account
            </Text>
            <Text style={[styles.subtitle, { color: C.textSecondary }]}>
              Join your team today
            </Text>
          </View>

          <View style={styles.form}>
            <Input
              label="Full Name"
              icon="user"
              placeholder="Jane Smith"
              value={name}
              onChangeText={setName}
              error={errors.name}
              autoCapitalize="words"
              autoComplete="name"
            />
            <Input
              label="Email"
              icon="mail"
              placeholder="you@company.com"
              value={email}
              onChangeText={setEmail}
              error={errors.email}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
            />
            <Input
              label="Password"
              icon="lock"
              placeholder="Min. 6 characters"
              value={password}
              onChangeText={setPassword}
              error={errors.password}
              isPassword
            />
            <Input
              label="Confirm Password"
              icon="lock"
              placeholder="Repeat password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              error={errors.confirmPassword}
              isPassword
            />

            <Button
              label="Create Account"
              onPress={handleSignup}
              loading={loading}
            />
          </View>

          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: C.textSecondary }]}>
              Already have an account?{" "}
            </Text>
            <Pressable onPress={() => router.push("/login")}>
              <Text style={[styles.footerLink, { color: C.primary }]}>
                Sign in
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 24,
    gap: 28,
  },
  backBtn: { alignSelf: "flex-start" },
  backText: { fontSize: 15, fontFamily: "Inter_500Medium" },
  header: { gap: 8 },
  title: {
    fontSize: 28,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
  },
  form: { gap: 16 },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  footerText: { fontSize: 14, fontFamily: "Inter_400Regular" },
  footerLink: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
});
