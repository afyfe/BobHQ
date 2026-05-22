import type { AttentionAlert } from "../../types/dashboard";

type AttentionRequiredProps = {
  alerts: AttentionAlert[];
};

export default function AttentionRequired({ alerts }: AttentionRequiredProps) {
  return (
    <section className="panel panel--attention">
      <div className="panel__header">
        <div>
          <h2>Attention Required</h2>
          <p>Operational issues that need judgement, not generic admin busywork.</p>
        </div>
        <span className="panel-count">{alerts.length}</span>
      </div>
      <div className="attention-list">
        {alerts.map((alert) => (
          <article className={`attention-item attention-item--${alert.severity}`} key={alert.id}>
            <div className="attention-item__severity">{alert.severity}</div>
            <div>
              <h3>{alert.title}</h3>
              <p>{alert.description}</p>
              <span>{alert.tenant} / {alert.timestamp}</span>
            </div>
            <strong>{alert.suggestedAction}</strong>
          </article>
        ))}
      </div>
    </section>
  );
}
