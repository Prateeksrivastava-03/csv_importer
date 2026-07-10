'use client';

import { useCallback, useRef, useState } from 'react';
import { isCsvFile } from '@/utils/csv';

interface FileUploadProps {
  onFileSelected: (file: File) => void;
  error?: string | null;
}

export default function FileUpload({ onFileSelected, error }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return;
      const file = files[0];
      if (!isCsvFile(file)) return;
      onFileSelected(file);
    },
    [onFileSelected]
  );

  return (
    <div className="w-full">
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click();
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        className={[
          'group relative flex w-full cursor-pointer flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed px-8 py-16 text-center transition-all',
          isDragging
            ? 'border-[var(--teal-700)] bg-[var(--teal-100)]'
            : 'border-[var(--line)] bg-white hover:border-[var(--teal-500)] hover:bg-[var(--teal-100)]/40',
        ].join(' ')}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".csv,text/csv"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />

        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--teal-100)] text-[var(--teal-700)] transition-transform group-hover:scale-105">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12 16V4M12 4L7 9M12 4L17 9"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div>
          <p className="font-display text-lg font-semibold text-[var(--ink)]">
            Drop your CSV here, or <span className="text-[var(--teal-700)] underline">browse files</span>
          </p>
          <p className="mt-1 text-sm text-[var(--ink-soft)]">
            Facebook, Google Ads, Excel, real-estate CRM exports — any layout works.
          </p>
        </div>

        <span className="rounded-full border border-[var(--line)] bg-[var(--paper)] px-3 py-1 font-mono-data text-xs text-[var(--ink-soft)]">
          .csv only · max 15MB
        </span>
      </div>

      {error && (
        <p className="mt-3 flex items-center gap-2 rounded-lg bg-[var(--coral-100)] px-3 py-2 text-sm text-[#8a2c17]">
          <span className="font-mono-data">!</span> {error}
        </p>
      )}
    </div>
  );
}
