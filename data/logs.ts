import { supabase } from "../lib/supabase";
import type { Metrics } from "../utils/readiness";

const DAILY_LOGS_TABLE = "daily_logs";

type DailyLogRow = {
  log_date: string;
  sleep: number;
  intensity: number;
  soreness: number;
};

export type DailyLog = {
  logDate: string;
  metrics: Metrics;
};

export function todayId(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

async function requireUserId(): Promise<string> {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw error;
  }
  if (!user) {
    throw new Error("No authenticated user.");
  }
  return user.id;
}

export async function upsertDailyLog(metrics: Metrics, logDate = todayId()): Promise<void> {
  const userId = await requireUserId();
  const { error } = await supabase.from(DAILY_LOGS_TABLE).upsert(
    {
      user_id: userId,
      log_date: logDate,
      sleep: metrics.sleep,
      intensity: metrics.intensity,
      soreness: metrics.soreness,
    },
    { onConflict: "user_id,log_date" }
  );

  if (error) {
    throw error;
  }
}

export async function fetchLogs(): Promise<DailyLog[]> {
  const userId = await requireUserId();
  const { data, error } = await supabase
    .from(DAILY_LOGS_TABLE)
    .select("log_date,sleep,intensity,soreness")
    .eq("user_id", userId)
    .order("log_date", { ascending: false });

  if (error) {
    throw error;
  }

  return (data as DailyLogRow[] | null)?.map((row) => ({
    logDate: row.log_date,
    metrics: {
      sleep: row.sleep,
      intensity: row.intensity,
      soreness: row.soreness,
    },
  })) ?? [];
}

export async function deleteLogByDate(logDate: string): Promise<void> {
  const userId = await requireUserId();
  const { error } = await supabase
    .from(DAILY_LOGS_TABLE)
    .delete()
    .eq("user_id", userId)
    .eq("log_date", logDate);

  if (error) {
    throw error;
  }
}
