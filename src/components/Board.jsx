import { useMemo } from 'react';
import { STAGES, groupTasksByStatus } from '../data/taskModel.js';
import Column from './Column.jsx';

/**
 * The four-column Kanban board (PRD §7 order: To Do → In Progress → Review → Done).
 *
 * Desktop-first (PRD §12). Below ~1024px the grid scrolls horizontally; the
 * scroll container is focusable and labelled so keyboard users can scroll it
 * too (WCAG 2.1.1).
 *
 * @param {{ tasks: import('../data/taskModel.js').Task[] }} props
 */
export default function Board({ tasks }) {
  const groups = useMemo(() => groupTasksByStatus(tasks), [tasks]);

  return (
    <div
      id="board"
      role="region"
      aria-label="Kanban board columns"
      tabIndex={0}
      className="-mx-2 overflow-x-auto rounded-2xl px-2 pb-4"
    >
      <div className="grid min-w-[64rem] grid-cols-4 gap-5">
        {STAGES.map((stage) => (
          <Column key={stage.id} stage={stage} tasks={groups[stage.id]} />
        ))}
      </div>
    </div>
  );
}
