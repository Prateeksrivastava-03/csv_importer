'use client';

import { CRM_FIELDS, CrmRecord } from '@/utils/types';

interface ResultsTableProps {
  records: CrmRecord[];
  imported: number;
  skipped: number;
  onStartOver: () => void;
}

function SummaryCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: 'teal' | 'coral' | 'ink';
}) {
  const toneClasses =
    tone === 'teal'
      ? 'bg-[var(--teal-100)] text-[var(--teal-900)]'
      : tone === 'coral'
        ? 'bg-[var(--coral-100)] text-[#8a2c17]'
        : 'bg-[var(--paper)] text-[var(--ink)]';

  return (
    <div className={['rounded-2xl px-5 py-4', toneClasses].join(' ')}>
      <p className="font-mono-data text-xs uppercase tracking-wide opacity-70">{label}</p>
      <p className="font-display text-3xl font-bold">{value.toLocaleString()}</p>
    </div>
  );
}

export default function ResultsTable({ records, imported, skipped, onStartOver }: ResultsTableProps) {
  const total = imported + skipped;

  return (
    <div className="flex w-full flex-col gap-5">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <SummaryCard label="Total imported" value={imported} tone="teal" />
        <SummaryCard label="Total skipped" value={skipped} tone="coral" />
        <SummaryCard label="Total processed" value={total} tone="ink" />
      </div>

      <div className="w-full overflow-hidden rounded-2xl border border-[var(--line)] bg-white shadow-soft">
        <div className="flex items-center justify-between border-b border-[var(--line)] px-5 py-4">
          <p className="font-display text-sm font-semibold text-[var(--ink)]">Successfully parsed records</p>
          <button
            onClick={onStartOver}
            className="rounded-xl border border-[var(--line)] px-4 py-2 font-display text-xs font-semibold text-[var(--ink-soft)] hover:bg-[var(--paper)]"
          >
            Import another CSV
          </button>
        </div>

        {records.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <p className="font-display text-sm font-semibold text-[var(--ink)]">No records were imported</p>
            <p className="mt-1 text-sm text-[var(--ink-soft)]">
              Every row was skipped because it had neither an email nor a mobile number.
            </p>
          </div>
        ) : (
          <div className="data-scroll max-h-[480px] w-full overflow-auto">
            <table className="w-full min-w-max border-collapse text-left text-sm">
              <thead>
                <tr>
                  {CRM_FIELDS.map((field) => (
                    <th
                      key={field}
                      className="sticky-th whitespace-nowrap border-b border-[var(--line)] bg-[var(--paper)] px-4 py-2.5 font-mono-data text-xs font-medium uppercase tracking-wide text-[var(--ink-soft)]"
                    >
                      {field}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {records.map((record, idx) => (
                  <tr key={idx} className="odd:bg-white even:bg-[var(--paper)]/50 hover:bg-[var(--teal-100)]/50">
                    {CRM_FIELDS.map((field) => (
                      <td
                        key={field}
                        className="whitespace-nowrap border-b border-[var(--line)] px-4 py-2.5 text-[var(--ink)]"
                      >
                        {field === 'crm_status' && record[field] ? (
                          <span className="rounded-full bg-[var(--teal-100)] px-2.5 py-1 font-mono-data text-xs text-[var(--teal-900)]">
                            {record[field]}
                          </span>
                        ) : (
                          record[field] || <span className="text-[var(--ink-soft)]">—</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
