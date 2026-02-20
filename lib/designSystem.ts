export type ReadinessZone = "GREEN" | "YELLOW" | "RED";

export const designTokens = {
  spacing: {
    pageX: "px-6",
    pageTop: "pt-6",
    sectionGap: "gap-4",
  },
  typography: {
    hero: "text-3xl font-bold text-white",
    title: "text-xl font-semibold text-white",
    body: "text-base text-white/80",
    caption: "text-sm text-white/60",
  },
  components: {
    glassCard: "rounded-3xl border border-line bg-glass p-4",
    pill: "rounded-full border px-3 py-1",
    buttonPrimary:
      "items-center rounded-2xl border border-neon-cyan/40 bg-neon-cyan/20 px-5 py-4",
    buttonSecondary:
      "items-center rounded-2xl border border-white/20 bg-white/5 px-5 py-4",
  },
} as const;

export function zoneFromScore(score: number): ReadinessZone {
  if (score >= 70) return "GREEN";
  if (score >= 40) return "YELLOW";
  return "RED";
}

export function zoneLabel(zone: ReadinessZone): string {
  if (zone === "GREEN") return "Peak Ready";
  if (zone === "YELLOW") return "Manage Load";
  return "Recovery Focus";
}

export function zoneEmoji(zone: ReadinessZone): string {
  if (zone === "GREEN") return "🔥";
  if (zone === "YELLOW") return "⚡";
  return "🧊";
}

export function zonePillClass(zone: ReadinessZone): string {
  if (zone === "GREEN") return "border-neon-lime/50 bg-neon-lime/20 text-neon-lime";
  if (zone === "YELLOW") return "border-neon-amber/50 bg-neon-amber/20 text-neon-amber";
  return "border-neon-rose/50 bg-neon-rose/20 text-neon-rose";
}

export function zoneTextClass(zone: ReadinessZone): string {
  if (zone === "GREEN") return "text-neon-lime";
  if (zone === "YELLOW") return "text-neon-amber";
  return "text-neon-rose";
}

export function quickInsight(score: number | null): string {
  if (score === null) {
    return "No metrics logged today. Add a quick check-in to generate your readiness signal.";
  }
  if (score >= 70) {
    return "Central nervous system and tissue load look balanced. Green light for quality work.";
  }
  if (score >= 40) {
    return "Moderate fatigue detected. Keep intensity controlled and bias recovery between sessions.";
  }
  return "Recovery debt is high. Prioritize sleep, hydration, and lower training load today.";
}
