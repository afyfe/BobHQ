export type StatusTone = "healthy" | "warning" | "danger" | "neutral" | "paused" | "running";

const statusToneMap: Record<string, StatusTone> = {
  healthy: "healthy",
  connected: "healthy",
  completed: "healthy",
  active: "healthy",
  indexed: "healthy",
  warning: "warning",
  degraded: "warning",
  queued: "warning",
  partial: "warning",
  failed: "danger",
  error: "danger",
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
