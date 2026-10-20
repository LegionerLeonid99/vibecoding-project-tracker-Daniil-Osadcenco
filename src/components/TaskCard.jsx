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

const TYPE_ICON = { feature: Sparkles, bug: Bug };

/**
 * Type badge. Icon + text label, so the type is never conveyed by colour
 * alone (WCAG 1.4.1).
 *
 * TODO M6 tag-style: swap the neutral classes below for the DESIGN.md
 * `type-feature` (#34D399) / `type-bug` (#FB7185) tints.
 */
function TypeBadge({ type }) {
  const Icon = TYPE_ICON[type] ?? Sparkles;
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-surface-border bg-surface-page/60 px-2 py-0.5 font-mono text-xs font-medium text-content-primary">
      <Icon aria-hidden="true" className="h-3.5 w-3.5 text-content-muted" strokeWidth={2} />
      {getTypeLabel(type)}
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
 * @param {{ task: import('../data/taskModel.js').Task }} props
 */
export default function TaskCard({ task }) {
  const titleId = `task-${task.id}-title`;
  const due = formatDate(task.dueDate);

  return (
    <li>
      {/* TODO M5 crud-modal: make the card a button that opens the edit modal. */}
      {/* TODO M8 due-tint: tint border / due chip by due state (DESIGN.md §2 due-* tokens). */}
      <article
        aria-labelledby={titleId}
        className="group rounded-xl border border-surface-border bg-surface-card p-4 hover:border-brand-primary/60 hover:shadow-glow-primary motion-safe:transition-[border-color,box-shadow] motion-safe:duration-200"
      >
        <div className="flex items-center justify-between gap-3">
          <TypeBadge type={task.type} />
          <span className="font-mono text-xs text-content-muted">
            <span className="sr-only">Task ID </span>
            {shortId(task.id)}
          </span>
        </div>

        <h4 id={titleId} className="mt-3 font-heading text-sm font-semibold leading-snug text-content-primary">
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
      </article>
    </li>
  );
}
