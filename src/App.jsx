import { useMemo } from 'react';
import AppHeader from './components/AppHeader.jsx';
import Board from './components/Board.jsx';
import { useLocalStorage } from './hooks/useLocalStorage.js';
import { SEED_TASKS, STORAGE_KEYS, normalizeTasks } from './data/taskModel.js';

/**
 * Vibecoding Project Tracker — starter scaffold.
 *
 * This file is intentionally almost empty. The boilerplate (Vite, React,
 * Tailwind) is configured for you, plus a few shared constants and a
 * localStorage helper. Everything visible on screen, you build.
 *
 * Where to start (build sequence in Phase 3):
 *   - M4  data-model    : render the four columns and the task cards below.
 *   - M5  crud-modal    : add the "+" button modal and the edit-on-click modal.
 *   - M6  tag-style     : feature vs. bug color coding (uses DESIGN.md §2 colors).
 *   - M7  task-owner    : assignee badge + "Hand off to..." dropdown.
 *   - M8  due-tint      : color cards by due date (uses DESIGN.md §2 due-state colors).
 *   - M9  context       : a curated Context briefing field on the modal.
 *   - M10 copy-prompt   : a "Copy as Prompt Context" button that serializes the task + context.
 *   - M11 anchors       : the Anchor Board above the Kanban.
 *   - M12 secret-sauce  : the one open-ended thing that makes your tracker yours.
 *
 * Search the file for `TODO M<n>` to find the right hook for each milestone.
 *
 * M4 layout:
 *   src/data/taskModel.js      — locked Task / Anchor model (PRD §5), STAGES, TEAM, seeds, selectors
 *   src/hooks/useLocalStorage.js
 *   src/components/AppHeader.jsx, Board.jsx, Column.jsx, TaskCard.jsx
 */

// Re-exported so existing imports from './App.jsx' keep working.
export { STAGES, TEAM } from './data/taskModel.js';
export { useLocalStorage } from './hooks/useLocalStorage.js';

export default function App() {
  // M4 data-model: persisted task list, seeded with 4 mock tasks on first load.
  // setTasks is the single write path M5 (crud-modal) and M7 (handoff) will use.
  // eslint-disable-next-line no-unused-vars
  const [storedTasks, setTasks] = useLocalStorage(STORAGE_KEYS.tasks, SEED_TASKS);

  // Never trust storage blindly — coerce every record into a valid Task.
  const tasks = useMemo(() => normalizeTasks(storedTasks), [storedTasks]);

  const stats = useMemo(() => {
    const done = tasks.filter((t) => t.status === 'done').length;
    return { total: tasks.length, open: tasks.length - done, done };
  }, [tasks]);

  // TODO M5 crud-modal:
  //   const [editing, setEditing] = useState(null);
  //
  // TODO M11 anchors:
  //   const [anchors, setAnchors] = useLocalStorage(STORAGE_KEYS.anchors, DEFAULT_ANCHORS);

  return (
    <div className="min-h-screen bg-surface-page">
      {/* WCAG 2.4.1 Bypass Blocks */}
      <a
        href="#board"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-brand-primary focus:px-4 focus:py-2 focus:font-semibold focus:text-surface-page"
      >
        Skip to board
      </a>

      <AppHeader />

      <main className="mx-auto max-w-[90rem] px-8 py-8">
        {/* TODO M11 anchors: render the Anchor Board (Presentation / Demo / Report / Documentation) above the board. */}

        <section aria-labelledby="board-heading">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-brand-primary">Command center</p>
              <h2 id="board-heading" className="mt-1 font-heading text-2xl font-semibold tracking-tight text-content-primary">
                Project board
              </h2>
              <p className="mt-1 text-sm text-content-muted">Project tracking for vibecoders.</p>
            </div>

            <dl className="flex items-center gap-2 font-mono text-xs">
              {[
                ['Total', stats.total],
                ['Open', stats.open],
                ['Done', stats.done],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-center gap-2 rounded-lg border border-surface-border bg-surface-card px-3 py-1.5"
                >
                  <dt className="uppercase tracking-wider text-content-muted">{label}</dt>
                  <dd className="font-medium text-content-primary">{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <Board tasks={tasks} />
        </section>
      </main>
    </div>
  );
}
