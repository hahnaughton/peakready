import type { Session } from "@supabase/supabase-js";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { supabase } from "../lib/supabase";

export default function RootLayout() {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoadingSession, setIsLoadingSession] = useState(true);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!isMounted) return;
      setSession(data.session);
      setIsLoadingSession(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (isLoadingSession) return;

    const inAuthGroup = (segments[0] as string | undefined) === "(auth)";
    if (!session && !inAuthGroup) {
      router.replace("/(auth)/sign-in" as never);
      return;
    }
    if (session && inAuthGroup) {
      router.replace("/" as never);
    }
  }, [isLoadingSession, router, segments, session]);

  if (isLoadingSession) {
    return (
      <View className="flex-1 items-center justify-center bg-bg">
        <ActivityIndicator color="#22D3EE" />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#060913" },
      }}
    >
      <Stack.Screen name="(auth)" />
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,
          title: "Readiness OS",
          headerStyle: { backgroundColor: "#060913" },
          headerTintColor: "#E2E8F0",
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="log"
        options={{
          headerShown: true,
          title: "Log Today",
          headerStyle: { backgroundColor: "#060913" },
          headerTintColor: "#E2E8F0",
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="history"
        options={{
          headerShown: true,
          title: "Timeline",
          headerStyle: { backgroundColor: "#060913" },
          headerTintColor: "#E2E8F0",
          headerShadowVisible: false,
        }}
      />
    </Stack>
  );
}
