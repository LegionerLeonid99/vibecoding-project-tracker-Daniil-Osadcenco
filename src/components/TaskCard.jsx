import { Bug, CalendarClock, CalendarOff, Sparkles, UserRound } from 'lucide-react';
import { getTypeLabel, parseISODate, shortId } from '../data/taskModel.js';

// en-GB → "24 Oct", matching the "5 Oct 2024" style of the Stick reference.
const DAY_MONTH = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short' });
const DAY_MONTH_YEAR = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

function formatDate(iso) {
  const date = parseISODate(iso);
  if (!date) return null;
  const fmt = date.getFullYear() === new Date().getFullYear() ? DAY_MONTH : DAY_MONTH_YEAR;
  return fmt.format(date);
}

const TYPE_CONFIG = {
  feature: {
    Icon: Sparkles,
    badgeClass: 'border-type-feature/30 bg-type-feature/10 text-type-feature',
    iconClass: 'text-type-feature',
  },
  bug: {
    Icon: Bug,
    badgeClass: 'border-type-bug/30 bg-type-bug/10 text-type-bug',
    iconClass: 'text-type-bug',
  },
};

/**
 * Type badge (M6 `tag-style`).
 * Uses DESIGN.md §2 `type-feature` (#34D399) & `type-bug` (#FB7185).
 * Distinct icon + text label ensures WCAG 1.4.1 (not color alone).
 */
function TypeBadge({ type }) {
  const config = TYPE_CONFIG[type] ?? TYPE_CONFIG.feature;
  const Icon = config.Icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 font-mono text-xs font-medium ${config.badgeClass}`}
    >
      <Icon aria-hidden="true" className={`h-3.5 w-3.5 ${config.iconClass}`} strokeWidth={2} />
      <span>{getTypeLabel(type)}</span>
    </span>
  );
}

/**
 * One task card — DESIGN.md §4: slate-900 surface, 1px slate-700 border,
 * subtle cyan border glow on hover, no heavy drop shadows.
 *
 * Anatomy follows the Stick reference: badge row → title + description →
 * divider → meta footer (owner · due date).
 *
 * Clicking the card opens the edit modal (M5 `crud-modal`).
 *
 * @param {{
 *   task: import('../data/taskModel.js').Task,
 *   onEdit?: (task: import('../data/taskModel.js').Task) => void,
 * }} props
 */
export default function TaskCard({ task, onEdit }) {
  const titleId = `task-${task.id}-title`;
  const due = formatDate(task.dueDate);

  return (
    <li>
      {/* TODO M8 due-tint: tint border / due chip by due state (DESIGN.md §2 due-* tokens). */}
      <button
        type="button"
        onClick={() => onEdit?.(task)}
        aria-haspopup="dialog"
        className="w-full text-left group block rounded-xl border border-surface-border bg-surface-card p-4 hover:border-brand-primary/60 hover:shadow-glow-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary motion-safe:transition-[border-color,box-shadow] motion-safe:duration-200 cursor-pointer"
      >
        <div className="flex items-center justify-between gap-3">
          <TypeBadge type={task.type} />
          <span className="font-mono text-xs text-content-muted">
            <span className="sr-only">Task ID </span>
            {shortId(task.id)}
          </span>
        </div>

        <h4 id={titleId} className="mt-3 font-heading text-sm font-semibold leading-snug text-content-primary group-hover:text-brand-primary transition-colors">
          {task.title}
        </h4>

        {task.description && (
          <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-content-muted">{task.description}</p>
        )}

        <dl className="mt-4 flex items-center justify-between gap-3 border-t border-surface-border pt-3 text-xs">
          {/* TODO M7 task-owner: replace with avatar badge + "Hand off to…" dropdown. */}
          <div className="flex min-w-0 items-center gap-1.5 text-content-muted">
            <dt className="shrink-0">
              <UserRound aria-hidden="true" className="h-3.5 w-3.5" />
              <span className="sr-only">Assignee</span>
            </dt>
            <dd className="truncate">{task.assignee}</dd>
          </div>

          <div className="flex shrink-0 items-center gap-1.5 font-mono text-content-muted">
            <dt>
              {due ? (
                <CalendarClock aria-hidden="true" className="h-3.5 w-3.5" />
              ) : (
                <CalendarOff aria-hidden="true" className="h-3.5 w-3.5" />
              )}
              <span className="sr-only">Due date</span>
            </dt>
            <dd>{due ? <time dateTime={task.dueDate}>{due}</time> : 'No date'}</dd>
          </div>
        </dl>
      </button>
    </li>
  );
}
