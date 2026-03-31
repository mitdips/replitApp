import { Feather } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Colors from "@/constants/colors";

type SelectInputProps = {
  label?: string;
  icon?: keyof typeof Feather.glyphMap;
  error?: string;
  placeholder?: string;
  value?: string;
  options: string[];
  onSelect: (value: string) => void;
};

export function SelectInput({
  label,
  icon,
  error,
  placeholder = "Select an option",
  value,
  options,
  onSelect,
}: SelectInputProps) {
  const C = Colors.light;
  const [open, setOpen] = useState(false);

  const selectedLabel = useMemo(() => {
    if (!value) {
      return placeholder;
    }

    return value;
  }, [placeholder, value]);

  return (
    <View style={styles.wrapper}>
      {label ? <Text style={[styles.label, { color: C.textSecondary }]}>{label}</Text> : null}
      <Pressable
        onPress={() => setOpen((current) => !current)}
        style={[
          styles.container,
          {
            borderColor: error ? C.error : open ? C.primary : C.border,
            backgroundColor: C.backgroundSecondary,
          },
        ]}
      >
        {icon ? (
          <Feather
            name={icon}
            size={18}
            color={open ? C.primary : C.textMuted}
            style={styles.icon}
          />
        ) : null}
        <Text
          style={[
            styles.value,
            {
              color: value ? C.text : C.textMuted,
              fontFamily: "Inter_400Regular",
            },
          ]}
          numberOfLines={1}
        >
          {selectedLabel}
        </Text>
        <Feather
          name={open ? "chevron-up" : "chevron-down"}
          size={18}
          color={C.textMuted}
        />
      </Pressable>

      {open ? (
        <View
          style={[
            styles.dropdown,
            {
              backgroundColor: C.backgroundSecondary,
              borderColor: C.border,
            },
          ]}
        >
          {options.map((option) => {
            const selected = option === value;

            return (
              <Pressable
                key={option}
                onPress={() => {
                  onSelect(option);
                  setOpen(false);
                }}
                style={[
                  styles.option,
                  selected && { backgroundColor: C.tintLight },
                ]}
              >
                <Text
                  style={[
                    styles.optionText,
                    {
                      color: selected ? C.primary : C.text,
                      fontFamily: selected ? "Inter_600SemiBold" : "Inter_400Regular",
                    },
                  ]}
                >
                  {option}
                </Text>
                {selected ? <Feather name="check" size={16} color={C.primary} /> : null}
              </Pressable>
            );
          })}
        </View>
      ) : null}

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
    minHeight: 52,
  },
  icon: {
    marginRight: 10,
  },
  value: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 15,
  },
  dropdown: {
    borderWidth: 1,
    borderRadius: 12,
    overflow: "hidden",
  },
  option: {
    minHeight: 48,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  optionText: {
    flex: 1,
    fontSize: 14,
  },
  error: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
});
