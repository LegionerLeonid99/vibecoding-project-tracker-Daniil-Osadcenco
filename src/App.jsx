import { useMemo, useState } from 'react';
import AppHeader from './components/AppHeader.jsx';
import Board from './components/Board.jsx';
import TaskModal from './components/TaskModal.jsx';
import Toast from './components/Toast.jsx';
import { useLocalStorage } from './hooks/useLocalStorage.js';
import { SEED_TASKS, STORAGE_KEYS, createTask, normalizeTask, normalizeTasks } from './data/taskModel.js';

/**
 * Vibecoding Project Tracker — starter scaffold.
 *
 * This file connects state, storage, and the board.
 *
 * Where to start (build sequence in Phase 3):
 *   - M4  data-model    : render the four columns and the task cards.
 *   - M5  crud-modal    : add the "+" button modal and the edit-on-click modal (DONE).
 *   - M6  tag-style     : feature vs. bug color coding (uses DESIGN.md §2 colors) (DONE).
 *   - M7  task-owner    : assignee badge + "Hand off to..." dropdown (DONE).
 *   - M8  due-tint      : color cards by due date (uses DESIGN.md §2 due-state colors).
 *   - M9  context       : a curated Context briefing field on the modal.
 *   - M10 copy-prompt   : a "Copy as Prompt Context" button that serializes the task + context.
 *   - M11 anchors       : the Anchor Board above the Kanban.
 *   - M12 secret-sauce  : the one open-ended thing that makes your tracker yours.
 *
 * Search the file for `TODO M<n>` to find the right hook for each milestone.
 */

// Re-exported so existing imports from './App.jsx' keep working.
export { STAGES, TEAM } from './data/taskModel.js';
export { useLocalStorage } from './hooks/useLocalStorage.js';

export default function App() {
  // Persisted task list, seeded with mock tasks on first load.
  const [storedTasks, setTasks] = useLocalStorage(STORAGE_KEYS.tasks, SEED_TASKS);

  // Modal state for M5 crud-modal
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    mode: 'create', // 'create' | 'edit'
    task: null,
    initialStatus: 'todo',
  });

  // Never trust storage blindly — coerce every record into a valid Task.
  const tasks = useMemo(() => normalizeTasks(storedTasks), [storedTasks]);

  const stats = useMemo(() => {
    const done = tasks.filter((t) => t.status === 'done').length;
    return { total: tasks.length, open: tasks.length - done, done };
  }, [tasks]);

  // CRUD Handlers (M5 `crud-modal`)
  const handleOpenCreate = (initialStatus = 'todo') => {
    setModalConfig({
      isOpen: true,
      mode: 'create',
      task: null,
      initialStatus,
    });
  };

  const handleOpenEdit = (task) => {
    setModalConfig({
      isOpen: true,
      mode: 'edit',
      task,
      initialStatus: task.status,
    });
  };

  const handleCloseModal = () => {
    setModalConfig((prev) => ({ ...prev, isOpen: false }));
  };

  const handleSaveTask = (taskData) => {
    if (modalConfig.mode === 'create') {
      const newTask = createTask(taskData);
      setTasks((prev) => [newTask, ...(Array.isArray(prev) ? prev : [])]);
    } else if (modalConfig.mode === 'edit' && modalConfig.task) {
      setTasks((prev) =>
        (Array.isArray(prev) ? prev : []).map((t) =>
          t.id === modalConfig.task.id ? normalizeTask({ ...t, ...taskData }) : t
        )
      );
    }
  };

  // Toast notification state (M7 `task-owner`)
  const [toastMessage, setToastMessage] = useState(null);

  const handleDeleteTask = (taskId) => {
    setTasks((prev) => (Array.isArray(prev) ? prev : []).filter((t) => t.id !== taskId));
  };

  // Handoff Handler (M7 `task-owner`)
  const handleHandoffTask = (taskId, newAssignee) => {
    setTasks((prev) =>
      (Array.isArray(prev) ? prev : []).map((t) =>
        t.id === taskId ? normalizeTask({ ...t, assignee: newAssignee }) : t
      )
    );
    // DESIGN.md §5 exact microcopy: "Task handed off to {name}."
    setToastMessage(`Task handed off to ${newAssignee}.`);
  };

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

      <AppHeader onNewTask={() => handleOpenCreate('todo')} />

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

          <Board
            tasks={tasks}
            onEditTask={handleOpenEdit}
            onAddTask={(stageId) => handleOpenCreate(stageId)}
            onHandoffTask={handleHandoffTask}
          />
        </section>
      </main>

      {/* M5 CRUD Modal */}
      <TaskModal
        isOpen={modalConfig.isOpen}
        mode={modalConfig.mode}
        initialTask={modalConfig.task}
        initialStatus={modalConfig.initialStatus}
        onClose={handleCloseModal}
        onSave={handleSaveTask}
        onDelete={handleDeleteTask}
      />

      {/* M7 Handoff Toast */}
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
    </div>
  );
}
