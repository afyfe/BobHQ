import { getStatusTone } from "../../lib/status";

type StatusPillProps = {
  status: string;
};

export default function StatusPill({ status }: StatusPillProps) {
  return <span className={`status-pill status-pill--${getStatusTone(status)}`}>{status}</span>;
}
