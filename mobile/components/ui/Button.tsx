import * as Haptics from "expo-haptics";
import React from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  Platform,
} from "react-native";
import Colors from "@/constants/colors";

type Variant = "primary" | "secondary" | "ghost" | "danger";

type ButtonProps = {
  onPress: () => void;
  label: string;
  variant?: Variant;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
};

export function Button({
  onPress,
  label,
  variant = "primary",
  loading = false,
  disabled = false,
  fullWidth = true,
}: ButtonProps) {
  const C = Colors.light;

  const bgColor = {
    primary: C.primary,
    secondary: C.backgroundSecondary,
    ghost: "transparent",
    danger: C.error,
  }[variant];

  const textColor = {
    primary: "#fff",
    secondary: C.text,
    ghost: C.primary,
    danger: "#fff",
  }[variant];

  const borderColor = {
    primary: "transparent",
    secondary: C.border,
    ghost: "transparent",
    danger: "transparent",
  }[variant];

  const handlePress = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        { backgroundColor: bgColor, borderColor, borderWidth: 1 },
        fullWidth && styles.fullWidth,
        (pressed || disabled || loading) && styles.pressed,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} size="small" />
      ) : (
        <Text style={[styles.label, { color: textColor }]}>{label}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  fullWidth: {
    width: "100%",
  },
  pressed: {
    opacity: 0.75,
  },
  label: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.2,
  },
});
