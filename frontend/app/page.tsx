'use client';

import FileUpload from '@/components/FileUpload';
import PreviewTable from '@/components/PreviewTable';
import ConfirmImportBar from '@/components/ConfirmImportBar';
import ProgressIndicator from '@/components/ProgressIndicator';
import ResultsTable from '@/components/ResultsTable';
import PipelineStepper from '@/components/PipelineStepper';
import { useCsvImporter } from '@/hooks/useCsvImporter';

export default function Home() {
  const { state, handleFileSelected, confirmImport, reset } = useCsvImporter();

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-2">
        <span className="w-fit rounded-full bg-[var(--teal-100)] px-3 py-1 font-mono-data text-xs text-[var(--teal-900)]">
          GrowEasy CRM
        </span>
        <h1 className="font-display text-3xl font-bold text-[var(--ink)] sm:text-4xl">AI-Powered CSV Importer</h1>
        <p className="max-w-2xl text-sm text-[var(--ink-soft)] sm:text-base">
          Upload a lead export from anywhere — Facebook, Google Ads, Excel, or your own spreadsheet — and let AI map
          every column into the GrowEasy CRM format automatically.
        </p>
      </header>

      <PipelineStepper current={state.step} />

      {state.step === 'upload' && <FileUpload onFileSelected={handleFileSelected} error={state.error} />}

      {state.step === 'preview' && (
        <div className="flex flex-col gap-5">
          {state.error && (
            <p className="rounded-lg bg-[var(--coral-100)] px-3 py-2 text-sm text-[#8a2c17]">{state.error}</p>
          )}
          <PreviewTable filename={state.filename} headers={state.headers} rows={state.rows} />
          <ConfirmImportBar totalRows={state.rows.length} onConfirm={confirmImport} onReset={reset} />
        </div>
      )}

      {state.step === 'processing' && <ProgressIndicator totalRows={state.rows.length} />}

      {state.step === 'results' && (
        <ResultsTable records={state.records} imported={state.imported} skipped={state.skipped} onStartOver={reset} />
      )}

      <footer className="mt-auto pt-6 text-center font-mono-data text-xs text-[var(--ink-soft)]">
        Nothing is sent to AI until you confirm the import.
      </footer>
    </main>
  );
}
