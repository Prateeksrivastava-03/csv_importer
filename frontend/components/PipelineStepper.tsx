'use client';

import { AppStep } from '@/utils/types';

const STEPS: { key: AppStep; label: string; hint: string }[] = [
  { key: 'upload', label: 'Upload', hint: 'Drop a CSV' },
  { key: 'preview', label: 'Preview', hint: 'Check the rows' },
  { key: 'processing', label: 'AI Mapping', hint: 'Map to CRM fields' },
  { key: 'results', label: 'Results', hint: 'Review the import' },
];

function stepIndex(step: AppStep): number {
  return STEPS.findIndex((s) => s.key === step);
}

export default function PipelineStepper({ current }: { current: AppStep }) {
  const currentIdx = stepIndex(current);

  return (
    <div className="w-full overflow-x-auto data-scroll">
      <ol className="flex min-w-[560px] items-center gap-0 px-1 py-2">
        {STEPS.map((step, idx) => {
          const isDone = idx < currentIdx;
          const isActive = idx === currentIdx;

          return (
            <li key={step.key} className="flex flex-1 items-center last:flex-none">
              <div className="flex items-center gap-3">
                <div
                  className={[
                    'flex h-9 w-9 shrink-0 items-center justify-center rounded-full border font-mono-data text-xs transition-colors',
                    isDone
                      ? 'border-[var(--teal-700)] bg-[var(--teal-700)] text-white'
                      : isActive
                        ? 'border-[var(--teal-700)] bg-[var(--teal-100)] text-[var(--teal-900)]'
                        : 'border-[var(--line)] bg-white text-[var(--ink-soft)]',
                  ].join(' ')}
                >
                  {isDone ? '✓' : String(idx + 1).padStart(2, '0')}
                </div>
                <div className="flex flex-col leading-tight">
                  <span
                    className={[
                      'font-display text-sm font-semibold',
                      isActive || isDone ? 'text-[var(--ink)]' : 'text-[var(--ink-soft)]',
                    ].join(' ')}
                  >
                    {step.label}
                  </span>
                  <span className="text-xs text-[var(--ink-soft)]">{step.hint}</span>
                </div>
              </div>
              {idx < STEPS.length - 1 && (
                <div
                  className={[
                    'mx-3 h-px flex-1',
                    idx < currentIdx ? 'bg-[var(--teal-700)]' : 'bg-[var(--line)]',
                  ].join(' ')}
                />
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
