import { Pressable, StyleSheet, Text } from "react-native";

type MetricChipProps = {
  label: string;
  selected?: boolean;
  onPress: () => void;
};

export function MetricChip({ label, selected = false, onPress }: MetricChipProps) {
  return (
    <Pressable
      onPress={onPress}
      className={`rounded-full border px-4 py-2 ${
        selected ? "border-neon-cyan/60 bg-neon-cyan/20" : "border-white/20 bg-white/5"
      }`}
      style={[styles.baseChip, selected ? styles.selectedChip : styles.idleChip]}
    >
      <Text className={`font-medium ${selected ? "text-neon-cyan" : "text-white/80"}`} style={[styles.baseText, selected ? styles.selectedText : styles.idleText]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  baseChip: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
    minWidth: 56,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start",
  },
  idleChip: {
    borderColor: "rgba(255,255,255,0.28)",
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  selectedChip: {
    borderColor: "rgba(34,211,238,0.65)",
    backgroundColor: "rgba(34,211,238,0.22)",
  },
  baseText: {
    fontWeight: "600",
  },
  idleText: {
    color: "rgba(255,255,255,0.9)",
  },
  selectedText: {
    color: "#22D3EE",
  },
});
