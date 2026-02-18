import { View, Text, ScrollView, Pressable, Alert } from "react-native";
import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";
import { getLogs, deleteLog } from "../utils/storage";
import { calculateReadiness } from "../utils/readiness";

type Row = {
    id: string;
    date: string;
    score: number;
};

export default function History() {
    const [rows, setRows] = useState<Row[]>([]);

    const load = useCallback(async () => {
        const logs = await getLogs();
        const next: Row[] = logs.map((l) => ({
            id: l.id,
            date: l.date,
            score: calculateReadiness(l.metrics),
        }));
        setRows(next);
    }, []);

    useFocusEffect(
        useCallback(() => {
            load();
        }, [load])
    );

    async function onDelete(id: string, date: string) {
        await deleteLog(id);
        await load();
    }

    return (
        <View style={{ flex: 1, padding: 24 }}>
            <Text style={{ fontSize: 18, fontWeight: "700" }}>History</Text>

            <ScrollView style={{ marginTop: 12 }}>
                {rows.length === 0 ? (
                    <Text>No logs yet.</Text>
                ) : (
                    rows.map((r) => (
                        <View
                            key={r.id}
                            style={{
                                padding: 14,
                                borderWidth: 1,
                                borderRadius: 12,
                                marginBottom: 10,
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                                gap: 12,
                            }}
                        >
                            <View style={{ flex: 1 }}>
                                <Text style={{ fontWeight: "700" }}>{r.date}</Text>
                                <Text>Readiness: {r.score}</Text>
                            </View>

                            <Pressable
                                onPress={() =>
                                    Alert.alert("Delete log?", `Remove ${r.date}?`, [
                                        { text: "Cancel", style: "cancel" },
                                        {
                                            text: "Delete",
                                            style: "destructive",
                                            onPress: () => onDelete(r.id, r.date),
                                        },
                                    ])
                                }
                                style={{
                                    paddingVertical: 10,
                                    paddingHorizontal: 12,
                                    borderRadius: 10,
                                    borderWidth: 1,
                                }}
                            >
                                <Text style={{ fontWeight: "700" }}>Delete</Text>
                            </Pressable>
                        </View>
                    ))
                )}
            </ScrollView>
        </View>
    );
}
