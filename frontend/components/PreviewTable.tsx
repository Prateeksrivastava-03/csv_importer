'use client';

import { CsvRow } from '@/utils/types';

interface PreviewTableProps {
  filename: string;
  headers: string[];
  rows: CsvRow[];
}

export default function PreviewTable({ filename, headers, rows }: PreviewTableProps) {
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-[var(--line)] bg-white shadow-soft">
      <div className="flex flex-col gap-1 border-b border-[var(--line)] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--teal-100)] text-[var(--teal-700)]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M6 2h9l5 5v13a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2z"
                stroke="currentColor"
                strokeWidth="1.6"
              />
              <path d="M14 2v5h5" stroke="currentColor" strokeWidth="1.6" />
            </svg>
          </span>
          <span className="font-display text-sm font-semibold text-[var(--ink)]">{filename}</span>
        </div>
        <span className="font-mono-data text-xs text-[var(--ink-soft)]">
          {rows.length.toLocaleString()} rows · {headers.length} columns
        </span>
      </div>

      <div className="data-scroll max-h-[420px] w-full overflow-auto">
        <table className="w-full min-w-max border-collapse text-left text-sm">
          <thead>
            <tr>
              {headers.map((header) => (
                <th
                  key={header}
                  className="sticky-th whitespace-nowrap border-b border-[var(--line)] bg-[var(--paper)] px-4 py-2.5 font-mono-data text-xs font-medium uppercase tracking-wide text-[var(--ink-soft)]"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={idx} className="odd:bg-white even:bg-[var(--paper)]/50 hover:bg-[var(--teal-100)]/50">
                {headers.map((header) => (
                  <td
                    key={header}
                    className="whitespace-nowrap border-b border-[var(--line)] px-4 py-2.5 text-[var(--ink)]"
                  >
                    {row[header] || <span className="text-[var(--ink-soft)]">—</span>}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
