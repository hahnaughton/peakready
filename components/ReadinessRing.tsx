import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Defs, LinearGradient, Stop } from "react-native-svg";
import { zoneFromScore } from "../lib/designSystem";

type ReadinessRingProps = {
  score: number | null;
  size?: number;
};

export function ReadinessRing({ score, size = 188 }: ReadinessRingProps) {
  const value = score ?? 0;
  const hasScore = score !== null;
  const normalized = Math.max(0, Math.min(100, value));
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = circumference - (normalized / 100) * circumference;
  const zone = zoneFromScore(normalized);
  const ringColor = zone === "GREEN" ? "#84CC16" : zone === "YELLOW" ? "#FBBF24" : "#FB7185";

  return (
    <View style={[styles.ringWrap, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        <Defs>
          <LinearGradient id="ringGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={ringColor} stopOpacity={1} />
            <Stop offset="100%" stopColor="#22D3EE" stopOpacity={0.85} />
          </LinearGradient>
        </Defs>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255,255,255,0.15)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {hasScore ? (
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="url(#ringGlow)"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeLinecap="round"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={progress}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        ) : null}
      </Svg>

      {hasScore ? (
        <View style={[styles.centerContent, { width: size, height: size }]}>
          <View style={styles.centerInner}>
            <Text style={styles.centerLabel}>Readiness</Text>
            <Text style={styles.centerScore}>{normalized}</Text>
          </View>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  ringWrap: {
    alignItems: "center",
    justifyContent: "center",
  },
  centerContent: {
    position: "absolute",
    left: 0,
    top: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  centerInner: {
    alignItems: "center",
    justifyContent: "center",
  },
  centerLabel: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 1.2,
    color: "rgba(255,255,255,0.6)",
    textTransform: "uppercase",
    marginBottom: 6,
  },
  centerScore: {
    fontSize: 48,
    fontWeight: "800",
    color: "#FFFFFF",
    lineHeight: 52,
    includeFontPadding: false,
  },
});
