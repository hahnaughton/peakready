import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#060913" },
        headerTintColor: "#E2E8F0",
        headerShadowVisible: false,
        contentStyle: { backgroundColor: "#060913" },
      }}
    >
      <Stack.Screen name="sign-in" options={{ title: "Sign In" }} />
      <Stack.Screen name="sign-up" options={{ title: "Create Account" }} />
    </Stack>
  );
}
