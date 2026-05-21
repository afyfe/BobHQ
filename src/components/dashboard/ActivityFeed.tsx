import type { Activity } from "../../data/mockDashboardData";
import StatusPill from "../ui/StatusPill";

type ActivityFeedProps = {
  items: Activity[];
};

export default function ActivityFeed({ items }: ActivityFeedProps) {
  return (
    <section className="panel">
      <div className="panel__header">
        <div>
          <h2>Recent Activity</h2>
          <p>Operational signals across tenants, connectors, and jobs.</p>
        </div>
      </div>
      <div className="activity-list">
        {items.map((item) => (
          <article className="activity-item" key={item.id}>
            <div>
              <h3>{item.title}</h3>
              <p>{item.detail}</p>
            </div>
            <div className="activity-item__meta">
              <StatusPill status={item.status} />
              <span>{item.time}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
