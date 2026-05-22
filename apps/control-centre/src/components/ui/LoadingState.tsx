type LoadingStateProps = {
  label: string;
};

export default function LoadingState({ label }: LoadingStateProps) {
  return (
    <section className="state-panel state-panel--loading">
      <span className="state-panel__dot" aria-hidden="true" />
      <strong>{label}</strong>
    </section>
  );
}
