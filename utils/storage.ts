import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Metrics } from "./readiness";

export type DailyLog = {
    id: string; // YYYY-MM-DD
    date: string; // YYYY-MM-DD
    metrics: Metrics;
};

const KEY = "peakready.logs.v1";

export async function getLogs(): Promise<DailyLog[]> {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return [];
    try {
        return JSON.parse(raw) as DailyLog[];
    } catch {
        return [];
    }
}

export async function saveLog(log: DailyLog): Promise<void> {
    const logs = await getLogs();
    const next = [log, ...logs.filter((l) => l.id !== log.id)];
    await AsyncStorage.setItem(KEY, JSON.stringify(next));
}

export async function deleteLog(id: string): Promise<void> {
    const logs = await getLogs();
    const next = logs.filter((l) => l.id !== id);
    await AsyncStorage.setItem(KEY, JSON.stringify(next));
}

export function todayId(): string {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
}
