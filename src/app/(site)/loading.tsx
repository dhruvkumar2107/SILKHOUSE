export default function SiteLoading() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center bg-ink text-ivory">
      <div className="flex flex-col items-center gap-6">
        <span className="grid h-14 w-14 animate-pulse-soft place-items-center rounded-full border border-gold/50 font-accent text-gold">
          GS
        </span>
        <span className="text-[11px] uppercase tracking-[0.4em] text-gold-light/80">
          Weaving your experience…
        </span>
      </div>
    </div>
  );
}
