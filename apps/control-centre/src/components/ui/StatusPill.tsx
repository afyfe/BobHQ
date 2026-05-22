import { getStatusTone } from "../../lib/status";

type StatusPillProps = {
  status: string;
};

export default function StatusPill({ status }: StatusPillProps) {
  const isLiveStatus = ["Active", "Running", "Syncing"].includes(status);

  return (
    <span className={`status-pill status-pill--${getStatusTone(status)}${isLiveStatus ? " status-pill--live" : ""}`}>
      {isLiveStatus ? <span className="status-pill__dot" aria-hidden="true" /> : null}
      {status}
    </span>
  );
}
