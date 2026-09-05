import type { SeriesStatus } from "../types";

const statuses: Array<{
  value: SeriesStatus;
  label: string;
}> = [
  { value: "READING", label: "Reading" },
  { value: "PLAN_TO_READ", label: "Plan to Read" },
  { value: "ON_HOLD", label: "On Hold" },
  { value: "DROPPED", label: "Dropped" },
  { value: "COMPLETED", label: "Completed" },
];

interface StatusFilterProps {
  value?: SeriesStatus;
  onChange: (status?: SeriesStatus) => void;
}

export function StatusFilter({ value, onChange }: StatusFilterProps) {
  return (
    <nav className="status-filter" aria-label="Filter series">
      <button
        type="button"
        className={!value ? "active" : ""}
        onClick={() => onChange(undefined)}
      >
        All
      </button>

      {statuses.map((status) => (
        <button
          key={status.value}
          type="button"
          className={value === status.value ? "active" : ""}
          onClick={() => onChange(status.value)}
        >
          {status.label}
        </button>
      ))}
    </nav>
  );
}
