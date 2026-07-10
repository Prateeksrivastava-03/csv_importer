'use client';

interface ConfirmImportBarProps {
  totalRows: number;
  onConfirm: () => void;
  onReset: () => void;
}

export default function ConfirmImportBar({ totalRows, onConfirm, onReset }: ConfirmImportBarProps) {
  return (
    <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-[var(--line)] bg-white px-5 py-4 shadow-soft sm:flex-row sm:items-center">
      <div>
        <p className="font-display text-sm font-semibold text-[var(--ink)]">Ready to import</p>
        <p className="text-sm text-[var(--ink-soft)]">
          {totalRows.toLocaleString()} rows will be sent to AI for CRM field mapping.
        </p>
      </div>
      <div className="flex w-full gap-3 sm:w-auto">
        <button
          onClick={onReset}
          className="flex-1 rounded-xl border border-[var(--line)] bg-white px-4 py-2.5 font-display text-sm font-semibold text-[var(--ink-soft)] transition-colors hover:bg-[var(--paper)] sm:flex-none"
        >
          Choose different file
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 rounded-xl bg-[var(--teal-700)] px-5 py-2.5 font-display text-sm font-semibold text-white shadow-soft transition-colors hover:bg-[var(--teal-900)] sm:flex-none"
        >
          Confirm import
        </button>
      </div>
    </div>
  );
}
