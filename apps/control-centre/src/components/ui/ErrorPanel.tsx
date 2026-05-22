type ErrorPanelProps = {
  message: string;
};

export default function ErrorPanel({ message }: ErrorPanelProps) {
  return (
    <section className="state-panel state-panel--error">
      <strong>Unable to load control data</strong>
      <p>{message}</p>
    </section>
  );
}
