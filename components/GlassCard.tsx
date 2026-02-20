import { View, type ViewProps } from "react-native";

type GlowTone = "cyan" | "violet" | "none";

type GlassCardProps = ViewProps & {
  className?: string;
  glow?: GlowTone;
};

function glowClassForTone(glow: GlowTone): string {
  if (glow === "cyan") return "border-neon-cyan/35";
  if (glow === "violet") return "border-neon-violet/35";
  return "border-line";
}

export function GlassCard({ className = "", glow = "none", ...rest }: GlassCardProps) {
  return (
    <View
      className={`rounded-3xl border bg-glass p-4 shadow-glass ${glowClassForTone(glow)} ${className}`}
      {...rest}
    />
  );
}
