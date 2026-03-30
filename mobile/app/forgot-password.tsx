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
import { forgotPassword as forgotPasswordApi } from "@workspace/api-client-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import Colors from "@/constants/colors";

export default function ForgotPasswordScreen() {
  const C = Colors.light;
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleReset = async () => {
    if (!email.trim()) {
      setError("Email is required");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Enter a valid email");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await forgotPasswordApi({ email: email.trim() });
      setSent(true);
    } catch {
      Alert.alert("Error", "Something went wrong. Please try again.");
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

          {!sent ? (
            <>
              <View style={styles.header}>
                <Text style={[styles.title, { color: C.text }]}>Reset Password</Text>
                <Text style={[styles.subtitle, { color: C.textSecondary }]}>
                  We'll send you a reset link to your email address.
                </Text>
              </View>

              <View style={styles.form}>
                <Input
                  label="Email"
                  icon="mail"
                  placeholder="you@company.com"
                  value={email}
                  onChangeText={setEmail}
                  error={error}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  autoComplete="email"
                />
                <Button label="Send Reset Link" onPress={handleReset} loading={loading} />
              </View>
            </>
          ) : (
            <View style={styles.successCard}>
              <View style={[styles.successIcon, { backgroundColor: C.successLight }]}>
                <Text style={{ fontSize: 32 }}>✉️</Text>
              </View>
              <Text style={[styles.title, { color: C.text, textAlign: "center" }]}>
                Check your inbox
              </Text>
              <Text style={[styles.subtitle, { color: C.textSecondary, textAlign: "center" }]}>
                If an account exists for {email}, you'll receive a password reset link shortly.
              </Text>
              <Button label="Back to Login" onPress={() => router.replace("/login")} />
            </View>
          )}
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
    lineHeight: 22,
  },
  form: { gap: 16 },
  successCard: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
});
