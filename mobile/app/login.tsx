import { router } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
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
import { auth } from "@/lib/firebase";

export default function LoginScreen() {
  const C = Colors.light;
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs: { email?: string; password?: string } = {};
    if (!email.trim()) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = "Enter a valid email";
    if (!password) errs.password = "Password is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      router.replace("/(app)/dashboard");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Invalid email or password.";
      Alert.alert("Login Failed", msg);
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
          <View style={styles.header}>
            <View style={[styles.logoBox, { backgroundColor: C.tintLight }]}>
              <Text style={styles.logoText}>👥</Text>
            </View>
            <Text style={[styles.title, { color: C.text }]}>Welcome back</Text>
            <Text style={[styles.subtitle, { color: C.textSecondary }]}>
              Sign in to your account
            </Text>
          </View>

          <View style={styles.form}>
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
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              error={errors.password}
              isPassword
              autoComplete="password"
            />

            <Pressable onPress={() => router.push("/forgot-password")} style={styles.forgotBtn}>
              <Text style={[styles.forgotText, { color: C.primary }]}>
                Forgot password?
              </Text>
            </Pressable>

            <Button label="Sign In" onPress={handleLogin} loading={loading} />
          </View>

          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: C.textSecondary }]}>
              Don't have an account?{" "}
            </Text>
            <Pressable onPress={() => router.push("/signup")}>
              <Text style={[styles.footerLink, { color: C.primary }]}>Sign up</Text>
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
    gap: 32,
  },
  header: {
    alignItems: "center",
    gap: 12,
  },
  logoBox: {
    width: 72,
    height: 72,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  logoText: { fontSize: 32 },
  title: {
    fontSize: 28,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
  },
  form: {
    gap: 16,
  },
  forgotBtn: {
    alignSelf: "flex-end",
    marginTop: -4,
    marginBottom: 4,
  },
  forgotText: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
  },
  footerLink: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
  },
});
