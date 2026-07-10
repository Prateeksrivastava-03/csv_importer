'use client';

const MESSAGES = [
  'Reading column headers…',
  'Matching fields to the CRM schema…',
  'Normalizing lead status values…',
  'Splitting extra emails and numbers into notes…',
  'Almost done…',
];

import { useEffect, useState } from 'react';

export default function ProgressIndicator({ totalRows }: { totalRows: number }) {
  const [messageIdx, setMessageIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIdx((idx) => (idx + 1) % MESSAGES.length);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex w-full flex-col items-center justify-center gap-6 rounded-2xl border border-[var(--line)] bg-white px-8 py-16 text-center shadow-soft">
      <div className="flex items-end gap-1.5">
        <span className="h-3 w-3 rounded-full bg-[var(--teal-700)] pulse-dot" style={{ animationDelay: '0ms' }} />
        <span className="h-3 w-3 rounded-full bg-[var(--teal-700)] pulse-dot" style={{ animationDelay: '150ms' }} />
        <span className="h-3 w-3 rounded-full bg-[var(--teal-700)] pulse-dot" style={{ animationDelay: '300ms' }} />
      </div>
      <div>
        <p className="font-display text-lg font-semibold text-[var(--ink)]">
          Mapping {totalRows.toLocaleString()} rows with AI
        </p>
        <p className="mt-1 font-mono-data text-sm text-[var(--ink-soft)]">{MESSAGES[messageIdx]}</p>
      </div>
    </div>
  );
}
