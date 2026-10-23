import { Pressable, StyleSheet, Text } from "react-native";

type Variant = "primary" | "secondary" | "danger";

type Props = {
  title: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
};

const palette = {
  primary: {
    bg: "rgba(15, 119, 95, 0.14)",
    border: "rgba(15, 119, 95, 0.35)",
    text: "#0f775f",
  },
  danger: {
    bg: "rgba(217, 83, 79, 0.14)",
    border: "rgba(217, 83, 79, 0.35)",
    text: "#b8332f",
  },
  secondary: {
    bg: "rgba(23, 56, 62, 0.06)",
    border: "rgba(23, 56, 62, 0.14)",
    text: "#5b6b68",
  },
};

export function DeliveryButton({
  title,
  onPress,
  variant = "primary",
  disabled = false,
}: Props) {
  const p = palette[variant];

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.boton,
        { backgroundColor: p.bg, borderColor: p.border },
        pressed && !disabled && { opacity: 0.7 },
        disabled && { opacity: 0.5 },
      ]}
    >
      <Text style={[styles.texto, { color: p.text }]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  boton: {
    height: 48,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  texto: {
    fontSize: 15,
    fontWeight: "700",
  },
});
