import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";
import { calculateReadiness } from "../utils/readiness";
import { GlassCard } from "../components/GlassCard";
import { designTokens, zoneFromScore } from "../lib/designSystem";
import { deleteLogByDate, fetchLogs } from "../data/logs";

type Row = {
  date: string;
  score: number;
};

export default function History() {
  const [rows, setRows] = useState<Row[]>([]);

  const load = useCallback(async () => {
    try {
      const logs = await fetchLogs();
      const next: Row[] = logs.map((l) => ({
        date: l.logDate,
        score: calculateReadiness(l.metrics),
      }));
      setRows(next);
    } catch {
      setRows([]);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  async function onDelete(date: string) {
    try {
      await deleteLogByDate(date);
      await load();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to delete log.";
      Alert.alert("Delete failed", message);
    }
  }

  return (
    <View className="flex-1 bg-bg" style={styles.screen}>
      <View className={`flex-1 ${designTokens.spacing.pageX} ${designTokens.spacing.pageTop}`} style={styles.container}>
        <View className="mb-4 gap-1">
          <Text className={designTokens.typography.caption} style={styles.caption}>
            Past Performance
          </Text>
          <Text className={designTokens.typography.title} style={styles.title}>
            Readiness Timeline
          </Text>
        </View>

        <ScrollView contentContainerClassName="gap-3 pb-10">
          {rows.length === 0 ? (
            <GlassCard className="items-center py-8" style={styles.emptyCard}>
              <Text className="text-white/75" style={styles.emptyText}>
                No logs yet. Track your first session to start the timeline.
              </Text>
            </GlassCard>
          ) : (
            rows.map((r) => {
              const zone = zoneFromScore(r.score);
              const zoneAccent = zone === "GREEN" ? "#84CC16" : zone === "YELLOW" ? "#FBBF24" : "#FB7185";

              return (
                <GlassCard key={r.date} className="gap-3" style={styles.rowCard}>
                  <View style={styles.rowHeader}>
                    <View className="h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-panel" style={styles.logBadge}>
                      <Text className="text-xs font-semibold text-white/70" style={styles.logBadgeText}>
                        LOG
                      </Text>
                    </View>

                    <View style={styles.headerText}>
                      <Text className="text-base font-semibold text-white" style={styles.rowDate}>
                        {r.date}
                      </Text>
                      <Text className="text-sm text-white/60" style={styles.rowSubtext}>
                        Daily readiness snapshot recorded
                      </Text>
                    </View>

                    <View
                      style={[
                        styles.scorePill,
                        { borderColor: `${zoneAccent}99`, backgroundColor: `${zoneAccent}26` },
                      ]}
                    >
                      <Text style={[styles.scoreText, { color: zoneAccent }]}>{r.score}</Text>
                    </View>
                  </View>

                  <View style={styles.rowFooter}>
                    <Pressable
                      onPress={() =>
                        Alert.alert("Delete log?", `Remove ${r.date}?`, [
                          { text: "Cancel", style: "cancel" },
                          {
                            text: "Delete",
                            style: "destructive",
                            onPress: () => onDelete(r.date),
                          },
                        ])
                      }
                      style={styles.deleteButton}
                    >
                      <Text style={styles.deleteText}>Delete</Text>
                    </Pressable>
                  </View>
                </GlassCard>
              );
            })
          )}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: "#060913" },
  container: { paddingHorizontal: 24, paddingTop: 24 },
  caption: { color: "rgba(255,255,255,0.7)" },
  title: { color: "#FFFFFF", fontSize: 24, fontWeight: "700" },
  emptyCard: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  emptyText: { color: "rgba(255,255,255,0.8)" },
  rowCard: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.22)",
    backgroundColor: "#10182A",
    padding: 14,
  },
  rowHeader: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 10,
  },
  logBadge: {
    borderColor: "rgba(255,255,255,0.25)",
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  logBadgeText: { color: "rgba(255,255,255,0.82)" },
  headerText: {
    flex: 1,
    rowGap: 2,
  },
  rowDate: { color: "#FFFFFF", fontWeight: "700", fontSize: 15 },
  rowSubtext: { color: "rgba(255,255,255,0.68)", fontSize: 13 },
  scorePill: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  scoreText: {
    fontWeight: "700",
    fontSize: 14,
  },
  rowFooter: {
    marginTop: 6,
    alignItems: "flex-end",
  },
  deleteButton: {
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#EF4444",
    backgroundColor: "transparent",
    paddingHorizontal: 14,
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteText: {
    color: "#EF4444",
    fontWeight: "700",
    fontSize: 13,
  },
});
