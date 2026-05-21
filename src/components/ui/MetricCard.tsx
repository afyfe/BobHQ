import { formatNumber } from "../../lib/status";

type MetricCardProps = {
  label: string;
  value: string | number;
  delta?: string;
};

export default function MetricCard({ label, value, delta }: MetricCardProps) {
  const displayValue = typeof value === "number" ? formatNumber(value) : value;

  return (
    <article className="metric-card">
      <p className="metric-card__label">{label}</p>
      <strong className="metric-card__value">{displayValue}</strong>
      {delta ? <span className="metric-card__delta">{delta}</span> : null}
    </article>
  );
}
