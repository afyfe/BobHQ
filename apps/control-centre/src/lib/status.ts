export type StatusTone = "healthy" | "warning" | "danger" | "neutral" | "paused" | "running";

const statusToneMap: Record<string, StatusTone> = {
  healthy: "healthy",
  connected: "healthy",
  completed: "healthy",
  active: "healthy",
  "fully sourced": "healthy",
  indexed: "healthy",
  info: "running",
  warning: "warning",
  degraded: "warning",
  queued: "warning",
  partial: "warning",
  "partially sourced": "warning",
  failed: "danger",
  error: "danger",
  critical: "danger",
  "needs review": "danger",
  disconnected: "danger",
  disabled: "paused",
  paused: "paused",
  running: "running",
  syncing: "running",
  pending: "neutral",
  invited: "neutral",
};

export function getStatusTone(status: string): StatusTone {
  return statusToneMap[status.toLowerCase()] ?? "neutral";
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-GB").format(value);
}
