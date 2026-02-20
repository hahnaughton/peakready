import { Link } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { GlassCard } from "../../components/GlassCard";
import { supabase } from "../../lib/supabase";

export default function SignUpScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSignUp() {
    if (!email || !password) {
      Alert.alert("Missing fields", "Enter your email and password.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
    });
    setLoading(false);

    if (error) {
      Alert.alert("Sign up failed", error.message);
      return;
    }

    Alert.alert("Check your inbox", "Confirm your email, then sign in.");
  }

  return (
    <View className="flex-1 bg-bg" style={styles.screen}>
      <View className="flex-1 gap-4 px-6 pt-6" style={styles.container}>
        <View className="gap-1">
          <Text className="text-sm text-white/70" style={styles.caption}>
            Readiness OS
          </Text>
          <Text className="text-xl font-semibold text-white" style={styles.title}>
            Create Account
          </Text>
        </View>

        <GlassCard glow="violet" className="gap-3" style={styles.card}>
          <Text className="text-sm text-white/70" style={styles.label}>
            Email
          </Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white"
            placeholder="athlete@peakready.app"
            placeholderTextColor="rgba(255,255,255,0.45)"
            style={styles.input}
          />

          <Text className="text-sm text-white/70" style={styles.label}>
            Password
          </Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white"
            placeholder="Minimum 6 characters"
            placeholderTextColor="rgba(255,255,255,0.45)"
            style={styles.input}
          />
        </GlassCard>

        <Pressable
          onPress={onSignUp}
          disabled={loading}
          className="items-center rounded-2xl border border-neon-cyan/40 bg-neon-cyan/20 px-5 py-4"
          style={styles.primaryButton}
        >
          <Text className="text-base font-semibold text-neon-cyan" style={styles.primaryButtonText}>
            {loading ? "Creating..." : "Create Account"}
          </Text>
        </Pressable>

        <Link href="/(auth)/sign-in" asChild>
          <Pressable className="mt-4 items-center" style={styles.linkWrap}>
            <Text className="text-white/70" style={styles.linkText}>
              Already have an account? <Text className="font-semibold text-cyan-300">Sign in</Text>
            </Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: "#060913" },
  container: { gap: 16, paddingHorizontal: 24, paddingTop: 24 },
  caption: { color: "rgba(255,255,255,0.7)" },
  title: { color: "#FFFFFF", fontSize: 24, fontWeight: "700" },
  card: {
    padding: 16,
    borderRadius: 24,
    backgroundColor: "#10182A",
    borderColor: "rgba(167,139,250,0.35)",
    borderWidth: 1,
    gap: 8,
  },
  label: { color: "rgba(255,255,255,0.8)" },
  input: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    backgroundColor: "rgba(255,255,255,0.08)",
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: "#FFFFFF",
  },
  primaryButton: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(34,211,238,0.5)",
    backgroundColor: "rgba(34,211,238,0.2)",
    alignItems: "center",
    paddingVertical: 14,
  },
  primaryButtonText: { color: "#22D3EE", fontWeight: "700" },
  linkWrap: { marginTop: 12, alignItems: "center" },
  linkText: { color: "rgba(255,255,255,0.75)" },
});
