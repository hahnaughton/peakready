import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import type { Metrics } from "../utils/readiness";
import { GlassCard } from "../components/GlassCard";
import { MetricChip } from "../components/MetricChip";
import { designTokens } from "../lib/designSystem";
import { upsertDailyLog } from "../data/logs";

const SLEEP_CHOICES = ["5", "6", "7", "8", "9"];
const INTENSITY_CHOICES = ["2", "4", "6", "8", "10"];
const SORENESS_CHOICES = ["1", "3", "5", "7", "9"];

export default function LogWorkout() {
  const router = useRouter();
  const [sleep, setSleep] = useState("8");
  const [intensity, setIntensity] = useState("5");
  const [soreness, setSoreness] = useState("3");

  async function onSave() {
    const metrics: Metrics = {
      sleep: Number(sleep),
      intensity: Number(intensity),
      soreness: Number(soreness),
    };

    if (
      !Number.isFinite(metrics.sleep) ||
      !Number.isFinite(metrics.intensity) ||
      !Number.isFinite(metrics.soreness)
    ) {
      Alert.alert("Invalid input", "Please enter numbers for all fields.");
      return;
    }

    if (metrics.sleep < 0 || metrics.sleep > 24) {
      Alert.alert("Invalid sleep", "Sleep must be between 0 and 24 hours.");
      return;
    }
    if (metrics.intensity < 1 || metrics.intensity > 10) {
      Alert.alert("Invalid intensity", "Workout intensity must be between 1 and 10.");
      return;
    }
    if (metrics.soreness < 1 || metrics.soreness > 10) {
      Alert.alert("Invalid soreness", "Muscle soreness must be between 1 and 10.");
      return;
    }

    try {
      await upsertDailyLog(metrics);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to save log.";
      Alert.alert("Save failed", message);
      return;
    }

    router.back();
  }

  return (
    <View className="flex-1 bg-bg" style={styles.screen}>
      <View className={`flex-1 gap-4 ${designTokens.spacing.pageX} ${designTokens.spacing.pageTop}`} style={styles.container}>
        <View className="gap-1">
          <Text className={designTokens.typography.caption} style={styles.caption}>
            Daily Input
          </Text>
          <Text className={designTokens.typography.title} style={styles.title}>
            Log Today
          </Text>
        </View>

        <GlassCard glow="violet" className="gap-4" style={styles.card}>
          <View className="gap-2" style={styles.section}>
            <Text className="font-medium text-white" style={styles.label}>
              Sleep (0–24 hours)
            </Text>
            <TextInput
              value={sleep}
              onChangeText={setSleep}
              keyboardType="numeric"
              className="rounded-xl border border-white/20 bg-panel px-4 py-3 text-white"
              placeholder="8"
              placeholderTextColor="rgba(255,255,255,0.45)"
              style={styles.input}
            />
            <View className="flex-row flex-wrap gap-2" style={styles.chipRow}>
              {SLEEP_CHOICES.map((choice) => (
                <MetricChip
                  key={choice}
                  label={`${choice}h`}
                  selected={sleep === choice}
                  onPress={() => setSleep(choice)}
                />
              ))}
            </View>
          </View>

          <View className="gap-2" style={styles.section}>
            <Text className="font-medium text-white" style={styles.label}>
              Workout intensity (1-10)
            </Text>
            <TextInput
              value={intensity}
              onChangeText={setIntensity}
              keyboardType="numeric"
              className="rounded-xl border border-white/20 bg-panel px-4 py-3 text-white"
              placeholder="5"
              placeholderTextColor="rgba(255,255,255,0.45)"
              style={styles.input}
            />
            <View className="flex-row flex-wrap gap-2" style={styles.chipRow}>
              {INTENSITY_CHOICES.map((choice) => (
                <MetricChip
                  key={choice}
                  label={choice}
                  selected={intensity === choice}
                  onPress={() => setIntensity(choice)}
                />
              ))}
            </View>
          </View>

          <View className="gap-2" style={styles.sectionLast}>
            <Text className="font-medium text-white" style={styles.label}>
              Muscle soreness (1-10)
            </Text>
            <TextInput
              value={soreness}
              onChangeText={setSoreness}
              keyboardType="numeric"
              className="rounded-xl border border-white/20 bg-panel px-4 py-3 text-white"
              placeholder="3"
              placeholderTextColor="rgba(255,255,255,0.45)"
              style={styles.input}
            />
            <View className="flex-row flex-wrap gap-2" style={styles.chipRow}>
              {SORENESS_CHOICES.map((choice) => (
                <MetricChip
                  key={choice}
                  label={choice}
                  selected={soreness === choice}
                  onPress={() => setSoreness(choice)}
                />
              ))}
            </View>
          </View>
        </GlassCard>

        <Pressable onPress={onSave} className={designTokens.components.buttonPrimary} style={styles.primaryButton}>
          <Text className="text-base font-semibold text-neon-cyan" style={styles.primaryButtonText}>
            Save Check-In
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: "#060913" },
  container: { gap: 14, paddingHorizontal: 24, paddingTop: 24 },
  caption: { color: "rgba(255,255,255,0.7)" },
  title: { color: "#FFFFFF", fontSize: 24, fontWeight: "700" },
  card: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(167,139,250,0.35)",
    backgroundColor: "#10182A",
    padding: 14,
    gap: 14,
  },
  label: { color: "rgba(255,255,255,0.9)", marginBottom: 2 },
  section: {
    paddingBottom: 2,
    marginBottom: 8,
  },
  sectionLast: {
    paddingBottom: 2,
    marginBottom: 2,
  },
  input: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
    backgroundColor: "rgba(255,255,255,0.08)",
    color: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    marginTop: 2,
  },
  primaryButton: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(34,211,238,0.55)",
    backgroundColor: "rgba(34,211,238,0.2)",
    alignItems: "center",
    paddingVertical: 14,
    marginTop: 2,
  },
  primaryButtonText: { color: "#22D3EE", fontWeight: "700", fontSize: 16 },
});
