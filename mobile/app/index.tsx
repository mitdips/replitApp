import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/context/AuthContext";
import Colors from "@/constants/colors";

export default function SplashIndexScreen() {
  const { user, isLoading } = useAuth();
  const insets = useSafeAreaInsets();
  const C = Colors.light;

  useEffect(() => {
    if (isLoading) return;
    const timer = setTimeout(() => {
      if (user) {
        router.replace("/(app)/dashboard");
      } else {
        router.replace("/login");
      }
    }, 800);
    return () => clearTimeout(timer);
  }, [user, isLoading]);

  return (
    <LinearGradient
      colors={["#4F46E5", "#6366F1", "#818CF8"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>👥</Text>
        </View>
        <Text style={styles.appName}>TeamSync</Text>
        <Text style={styles.tagline}>Employee Management</Text>
      </View>
      <ActivityIndicator color="rgba(255,255,255,0.7)" size="small" />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 32,
  },
  content: {
    alignItems: "center",
    gap: 8,
  },
  iconContainer: {
    width: 88,
    height: 88,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  icon: {
    fontSize: 40,
  },
  appName: {
    fontSize: 36,
    fontFamily: "Inter_700Bold",
    color: "#fff",
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 16,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.75)",
    letterSpacing: 0.5,
  },
});
