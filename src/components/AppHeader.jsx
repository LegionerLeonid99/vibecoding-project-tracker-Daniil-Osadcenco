import { HardDrive } from 'lucide-react';

/**
 * Top bar with the DESIGN.md §6 wordmark: bold Plus Jakarta Sans in
 * #F9FAFB with a glowing cyan status dot.
 */
export default function AppHeader() {
  return (
    <header className="border-b border-surface-border bg-surface-page/80 backdrop-blur">
      <div className="mx-auto flex max-w-[90rem] items-center justify-between gap-6 px-8 py-4">
        <div className="flex items-center gap-3">
          <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-brand-primary shadow-dot-primary" />
          <h1 className="font-heading text-xl font-extrabold tracking-tight text-content-primary">VibeTracker</h1>
          <p className="border-l border-surface-border pl-3 font-mono text-xs text-content-muted">
            by SOPRANO&apos;s crew
          </p>
        </div>

        <div className="flex items-center gap-4">
          <p className="flex items-center gap-2 font-mono text-xs text-content-muted">
            <HardDrive aria-hidden="true" className="h-3.5 w-3.5" />
            Saved locally in this browser
          </p>
          {/* TODO M5 crud-modal: "+ New Task" primary button (bg-brand-primary, text-surface-page, rounded-lg). */}
        </div>
      </div>
    </header>
  );
}
