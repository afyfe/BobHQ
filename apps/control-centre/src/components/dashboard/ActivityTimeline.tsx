import type { TimelineEvent } from "../../types/dashboard";
import StatusPill from "../ui/StatusPill";

type ActivityTimelineProps = {
  events: TimelineEvent[];
};

export default function ActivityTimeline({ events }: ActivityTimelineProps) {
  return (
    <section className="panel">
      <div className="panel__header">
        <div>
          <h2>Recent Activity</h2>
          <p>Live operational timeline across ingestion, auth, answers, and worker jobs.</p>
        </div>
      </div>
      <div className="timeline">
        {events.map((event) => (
          <article className="timeline-item" key={event.id}>
            <div className="timeline-item__marker" aria-hidden="true" />
            <div className="timeline-item__content">
              <div>
                <span>{event.time}</span>
                <strong>{event.eventType}</strong>
              </div>
              <h3>{event.tenant}</h3>
              <p>{event.description}</p>
            </div>
            <StatusPill status={event.status} />
          </article>
        ))}
      </div>
    </section>
  );
}
