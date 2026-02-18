import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "PeakReady" }} />
      <Stack.Screen name="log" options={{ title: "Log Workout" }} />
      <Stack.Screen name="history" options={{ title: "History" }} />
    </Stack>
  );
}
