export type Metrics = {
    sleep: number;       // hours
    intensity: number;   // 1–10
    soreness: number;    // 1–10
};

export function calculateReadiness({
    sleep,
    intensity,
    soreness,
}: Metrics): number {
    // Normalize sleep to 0–100
    const sleepScore = Math.min((sleep / 8) * 100, 100);

    // Intensity reduces readiness
    const intensityPenalty = intensity * 5;

    // Soreness reduces readiness
    const sorenessPenalty = soreness * 4;

    const rawScore = sleepScore - intensityPenalty - sorenessPenalty;

    return Math.max(0, Math.min(100, Math.round(rawScore)));
}
