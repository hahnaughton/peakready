import { View, Text, Pressable } from "react-native";
import { Link, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { calculateReadiness } from "../utils/readiness";
import { getLogs, todayId } from "../utils/storage";

function zoneFromScore(score: number) {
  if (score >= 70) return "GREEN";
  if (score >= 40) return "YELLOW";
  return "RED";
}

function borderColorForZone(zone: "GREEN" | "YELLOW" | "RED") {
  if (zone === "GREEN") return "green";
  if (zone === "YELLOW") return "goldenrod";
  return "crimson";
}

function emojiForZone(zone: "GREEN" | "YELLOW" | "RED") {
  if (zone === "GREEN") return "🔥";
  if (zone === "YELLOW") return "⚠️";
  return "🧊";
}

function tintForZone(zone: "GREEN" | "YELLOW" | "RED") {
  if (zone === "GREEN") return "rgba(0,128,0,0.08)";
  if (zone === "YELLOW") return "rgba(218,165,32,0.10)";
  return "rgba(220,20,60,0.08)";
}

export default function Home() {
  const [score, setScore] = useState<number | null>(null);

  const loadToday = useCallback(async () => {
    const logs = await getLogs();
    const today = todayId();
    const todaysLog = logs.find((l) => l.id === today);

    if (!todaysLog) {
      setScore(null);
      return;
    }

    const s = calculateReadiness(todaysLog.metrics);
    setScore(s);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadToday();
    }, [loadToday])
  );

  const displayScore = score ?? 0;
  const zone = score === null ? "YELLOW" : zoneFromScore(displayScore);
  const borderColor = borderColorForZone(zone);
  const tint = tintForZone(zone);
  const emoji = emojiForZone(zone);

  const statusText =
    score === null
      ? "Log today to get a score"
      : zone === "GREEN"
        ? "Peak ready"
        : zone === "YELLOW"
          ? "Moderate"
          : "Recover";

  return (
    <View style={{ flex: 1, padding: 24, gap: 16 }}>
      <Text style={{ fontSize: 28, fontWeight: "700" }}>Today</Text>

      <View
        style={{
          padding: 20,
          borderRadius: 16,
          borderWidth: 2,
          borderColor,
          backgroundColor: tint,
          shadowColor: "#000",
          shadowOpacity: 0.12,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: 6 },
          elevation: 3,
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: "600" }}>
          Readiness Score {emoji}
        </Text>

        <Text style={{ fontSize: 48, fontWeight: "800" }}>
          {score === null ? "--" : displayScore}
        </Text>

        <Text style={{ fontSize: 16 }}>{statusText}</Text>
      </View>

      <Link href="/log" asChild>
        <Pressable
          style={{
            padding: 16,
            borderRadius: 12,
            backgroundColor: "black",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "white", fontWeight: "700" }}>
            Log Workout
          </Text>
        </Pressable>
      </Link>

      <Link href="/history" asChild>
        <Pressable
          style={{
            padding: 16,
            borderRadius: 12,
            borderWidth: 1,
            alignItems: "center",
          }}
        >
          <Text style={{ fontWeight: "700" }}>View History</Text>
        </Pressable>
      </Link>
    </View>
  );
}
