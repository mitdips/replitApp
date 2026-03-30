import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from "react-native";
import Colors from "@/constants/colors";

type InputProps = TextInputProps & {
  label?: string;
  icon?: keyof typeof Feather.glyphMap;
  error?: string;
  isPassword?: boolean;
};

export function Input({ label, icon, error, isPassword, style, ...rest }: InputProps) {
  const C = Colors.light;
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.wrapper}>
      {label ? <Text style={[styles.label, { color: C.textSecondary }]}>{label}</Text> : null}
      <View
        style={[
          styles.container,
          {
            borderColor: error ? C.error : focused ? C.primary : C.border,
            backgroundColor: C.backgroundSecondary,
          },
        ]}
      >
        {icon ? (
          <Feather
            name={icon}
            size={18}
            color={focused ? C.primary : C.textMuted}
            style={styles.icon}
          />
        ) : null}
        <TextInput
          {...rest}
          secureTextEntry={isPassword && !showPassword}
          onFocus={(e) => {
            setFocused(true);
            rest.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            rest.onBlur?.(e);
          }}
          style={[
            styles.input,
            { color: C.text, fontFamily: "Inter_400Regular" },
            style,
          ]}
          placeholderTextColor={C.textMuted}
        />
        {isPassword ? (
          <Pressable onPress={() => setShowPassword((v) => !v)} style={styles.eyeBtn}>
            <Feather
              name={showPassword ? "eye-off" : "eye"}
              size={18}
              color={C.textMuted}
            />
          </Pressable>
        ) : null}
      </View>
      {error ? <Text style={[styles.error, { color: C.error }]}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    letterSpacing: 0.1,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 52,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    height: "100%",
  },
  eyeBtn: {
    padding: 4,
    marginLeft: 8,
  },
  error: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
});
