import { View, Text, TextInput, Pressable, Alert } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { saveLog, todayId } from "../utils/storage";
import type { Metrics } from "../utils/readiness";

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

        const id = todayId();

        await saveLog({
            id,
            date: id,
            metrics,
        });

        router.replace("/");
    }

    return (
        <View style={{ flex: 1, padding: 24, gap: 12 }}>
            <Text style={{ fontSize: 18, fontWeight: "700" }}>
                Enter today’s metrics
            </Text>

            <Text>Sleep hours</Text>
            <TextInput
                value={sleep}
                onChangeText={setSleep}
                keyboardType="numeric"
                style={{ borderWidth: 1, padding: 12, borderRadius: 10 }}
            />

            <Text>Workout intensity (1–10)</Text>
            <TextInput
                value={intensity}
                onChangeText={setIntensity}
                keyboardType="numeric"
                style={{ borderWidth: 1, padding: 12, borderRadius: 10 }}
            />

            <Text>Muscle soreness (1–10)</Text>
            <TextInput
                value={soreness}
                onChangeText={setSoreness}
                keyboardType="numeric"
                style={{ borderWidth: 1, padding: 12, borderRadius: 10 }}
            />

            <Pressable
                onPress={onSave}
                style={{
                    marginTop: 12,
                    padding: 16,
                    borderRadius: 12,
                    backgroundColor: "black",
                    alignItems: "center",
                }}
            >
                <Text style={{ color: "white", fontWeight: "700" }}>Save</Text>
            </Pressable>
        </View>
    );
}
