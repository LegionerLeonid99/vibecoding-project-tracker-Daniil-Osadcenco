import { useEffect, useRef, useState } from 'react';
import {
  Bug,
  CalendarClock,
  CalendarOff,
  Check,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import {
  TEAM_MEMBERS,
  getTeamMember,
  getTypeLabel,
  parseISODate,
  shortId,
} from '../data/taskModel.js';

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
 * Assignee badge with "Hand off to..." dropdown (M7 `task-owner`).
 *
 * Provides an avatar badge with initials, teammate handle/name,
 * and a one-click dropdown to hand off the task to any teammate from PRD §8.
 *
 * @param {{
 *   task: import('../data/taskModel.js').Task,
 *   onHandoff?: (taskId: string, newAssignee: string) => void,
 * }} props
 */
function AssigneeBadge({ task, onHandoff }) {
  const [isOpen, setIsOpen] = useState(false);
  const member = getTeamMember(task.assignee);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        e.preventDefault();
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label={`Assigned to ${task.assignee}. Click to hand off.`}
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen((prev) => !prev);
        }}
        className="flex items-center gap-1.5 rounded-lg border border-surface-border bg-surface-page/70 px-2 py-1 text-xs text-content-primary hover:border-brand-accent/60 hover:bg-surface-page transition-colors focus-visible:outline-2 focus-visible:outline-brand-primary"
      >
        <span
          aria-hidden="true"
          className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-brand-accent/20 font-mono text-[9px] font-bold text-brand-accent"
        >
          {member ? member.initials : '??'}
        </span>
        <span className="truncate max-w-[6.5rem] font-mono text-[11px] text-content-primary">
          {member ? member.handle || member.name : task.assignee}
        </span>
        <ChevronDown aria-hidden="true" className="h-3 w-3 text-content-muted" />
      </button>

      {isOpen && (
        <div
          role="menu"
          aria-label="Hand off task"
          className="absolute left-0 bottom-full mb-1.5 z-30 min-w-[13rem] rounded-xl border border-surface-border bg-surface-card p-1.5 shadow-2xl text-xs motion-safe:transition-all"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-content-muted border-b border-surface-border mb-1">
            Hand off to...
          </div>
          {TEAM_MEMBERS.map((tm) => {
            const isCurrent = tm.name === task.assignee;
            return (
              <button
                key={tm.name}
                type="button"
                role="menuitem"
                onClick={() => {
                  if (!isCurrent && onHandoff) {
                    onHandoff(task.id, tm.name);
                  }
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between gap-2 px-2 py-1.5 rounded-lg text-left transition-colors font-mono ${
                  isCurrent
                    ? 'bg-brand-primary/10 text-brand-primary font-medium'
                    : 'text-content-primary hover:bg-surface-page'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-surface-page border border-surface-border text-[10px] font-bold text-content-primary">
                    {tm.initials}
                  </span>
                  <div className="flex flex-col">
                    <span className="text-xs text-content-primary">{tm.name}</span>
                    <span className="text-[10px] text-content-muted">{tm.handle}</span>
                  </div>
                </div>
                {isCurrent && <Check aria-hidden="true" className="h-3.5 w-3.5 text-brand-primary" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
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
 * Assignee badge has "Hand off to..." dropdown (M7 `task-owner`).
 *
 * @param {{
 *   task: import('../data/taskModel.js').Task,
 *   onEdit?: (task: import('../data/taskModel.js').Task) => void,
 *   onHandoff?: (taskId: string, newAssignee: string) => void,
 * }} props
 */
export default function TaskCard({ task, onEdit, onHandoff }) {
  const titleId = `task-${task.id}-title`;
  const due = formatDate(task.dueDate);

  return (
    <li>
      {/* TODO M8 due-tint: tint border / due chip by due state (DESIGN.md §2 due-* tokens). */}
      <article
        aria-labelledby={titleId}
        onClick={() => onEdit?.(task)}
        className="group relative block rounded-xl border border-surface-border bg-surface-card p-4 hover:border-brand-primary/60 hover:shadow-glow-primary focus-within:border-brand-primary focus-within:shadow-glow-primary motion-safe:transition-[border-color,box-shadow] motion-safe:duration-200 cursor-pointer"
      >
        <div className="flex items-center justify-between gap-3">
          <TypeBadge type={task.type} />
          <span className="font-mono text-xs text-content-muted">
            <span className="sr-only">Task ID </span>
            {shortId(task.id)}
          </span>
        </div>

        <h4 id={titleId} className="mt-3">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.(task);
            }}
            className="text-left font-heading text-sm font-semibold leading-snug text-content-primary group-hover:text-brand-primary transition-colors focus-visible:outline-2 focus-visible:outline-brand-primary rounded"
          >
            {task.title}
          </button>
        </h4>

        {task.description && (
          <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-content-muted">{task.description}</p>
        )}

        <div className="mt-4 flex items-center justify-between gap-3 border-t border-surface-border pt-3 text-xs">
          {/* M7 task-owner: Assignee badge + "Hand off to..." dropdown */}
          <AssigneeBadge task={task} onHandoff={onHandoff} />

          <div className="flex shrink-0 items-center gap-1.5 font-mono text-content-muted">
            {due ? (
              <CalendarClock aria-hidden="true" className="h-3.5 w-3.5" />
            ) : (
              <CalendarOff aria-hidden="true" className="h-3.5 w-3.5" />
            )}
            <span className="sr-only">Due date: </span>
            <span>{due ? <time dateTime={task.dueDate}>{due}</time> : 'No date'}</span>
          </div>
        </div>
      </article>
    </li>
  );
}
