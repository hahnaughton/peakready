import { Pressable, StyleSheet, Text, View } from "react-native";
import { Link, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { calculateReadiness } from "../utils/readiness";
import { ReadinessRing } from "../components/ReadinessRing";
import {
  quickInsight,
  zoneEmoji,
  zoneFromScore,
  zoneLabel,
} from "../lib/designSystem";
import { fetchLogs, todayId } from "../data/logs";
import { supabase } from "../lib/supabase";

export default function Home() {
  const [score, setScore] = useState<number | null>(null);

  const loadToday = useCallback(async () => {
    try {
      const logs = await fetchLogs();
      const today = todayId();
      const todaysLog = logs.find((l) => l.logDate === today);

      if (!todaysLog) {
        setScore(null);
        return;
      }

      const s = calculateReadiness(todaysLog.metrics);
      setScore(s);
    } catch {
      setScore(null);
    }
  }, []);

  async function onSignOut() {
    await supabase.auth.signOut();
  }

  useFocusEffect(
    useCallback(() => {
      loadToday();
    }, [loadToday])
  );

  const displayScore = score ?? 0;
  const hasScore = score !== null;
  const zone = zoneFromScore(displayScore);
  const insight = quickInsight(score);
  const zoneAccent = zone === "GREEN" ? "#84CC16" : zone === "YELLOW" ? "#FBBF24" : "#FB7185";

  return (
    <View style={styles.screen}>
      <View style={styles.container}>
        <View style={styles.headerWrap}>
          <Text style={styles.caption}>PeakReady 2.0</Text>
          <Text style={styles.title}>Readiness OS</Text>
        </View>

        <View style={styles.primaryCard}>
          <ReadinessRing score={score} />
          <View style={styles.zonePillWrap}>
            <View
              style={[
                styles.zonePill,
                hasScore
                  ? { borderColor: `${zoneAccent}99`, backgroundColor: `${zoneAccent}26` }
                  : { borderColor: "rgba(255,255,255,0.24)", backgroundColor: "rgba(255,255,255,0.1)" },
              ]}
            >
              <Text style={[styles.zonePillText, hasScore ? { color: zoneAccent } : { color: "#E2E8F0" }]}>
                {hasScore ? `${zoneEmoji(zone)} ${zoneLabel(zone)}` : "No score yet"}
              </Text>
            </View>
          </View>
          <Text style={styles.insightText}>{insight}</Text>
        </View>

        <View style={styles.secondaryCard}>
          <Text style={styles.quickLabel}>Quick Insight</Text>
          <Text style={styles.quickBody}>
            {score === null
              ? "Your dashboard is waiting for today’s check-in."
              : "Use your score to guide intensity and recovery choices."}
          </Text>
        </View>

        <Link href="/log" asChild>
          <Pressable style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Log Today</Text>
          </Pressable>
        </Link>

        <Link href="/history" asChild>
          <Pressable style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>View Timeline</Text>
          </Pressable>
        </Link>

        <Pressable onPress={onSignOut} style={styles.signOutButton}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#060913" },
  container: { flex: 1, paddingHorizontal: 24, paddingTop: 24, gap: 16 },
  headerWrap: { gap: 4 },
  caption: { color: "rgba(255,255,255,0.72)", fontSize: 13 },
  title: { color: "#FFFFFF", fontSize: 31, fontWeight: "700" },
  primaryCard: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(34,211,238,0.4)",
    backgroundColor: "#10182A",
    alignItems: "center",
    paddingTop: 24,
    paddingHorizontal: 14,
    paddingBottom: 20,
    gap: 18,
  },
  zonePillWrap: {
    marginTop: 4,
    alignItems: "center",
  },
  zonePill: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  zonePillText: { fontWeight: "700", fontSize: 15 },
  insightText: {
    color: "rgba(255,255,255,0.84)",
    textAlign: "center",
    paddingHorizontal: 12,
    lineHeight: 22,
    fontSize: 14,
  },
  secondaryCard: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    backgroundColor: "rgba(255,255,255,0.08)",
    padding: 14,
    gap: 8,
  },
  quickLabel: { color: "rgba(255,255,255,0.68)", fontSize: 12, letterSpacing: 0.7, textTransform: "uppercase" },
  quickBody: { color: "rgba(255,255,255,0.93)", fontSize: 16, lineHeight: 22 },
  primaryButton: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(34,211,238,0.55)",
    backgroundColor: "rgba(34,211,238,0.2)",
    alignItems: "center",
    paddingVertical: 14,
  },
  primaryButtonText: { color: "#22D3EE", fontWeight: "700", fontSize: 16 },
  secondaryButton: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    paddingVertical: 14,
  },
  secondaryButtonText: { color: "rgba(255,255,255,0.95)", fontWeight: "700", fontSize: 16 },
  signOutButton: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    backgroundColor: "rgba(255,255,255,0.07)",
    alignItems: "center",
    paddingVertical: 12,
  },
  signOutText: { color: "rgba(255,255,255,0.82)", fontWeight: "600" },
});
