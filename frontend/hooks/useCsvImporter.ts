'use client';

import { useCallback, useState } from 'react';
import { parseCsvFile } from '@/utils/csv';
import { importCsvRows } from '@/services/api';
import { AppStep, CrmRecord, CsvRow } from '@/utils/types';

interface ImporterState {
  step: AppStep;
  filename: string;
  headers: string[];
  rows: CsvRow[];
  records: CrmRecord[];
  imported: number;
  skipped: number;
  error: string | null;
}

const initialState: ImporterState = {
  step: 'upload',
  filename: '',
  headers: [],
  rows: [],
  records: [],
  imported: 0,
  skipped: 0,
  error: null,
};

export function useCsvImporter() {
  const [state, setState] = useState<ImporterState>(initialState);

  const handleFileSelected = useCallback(async (file: File) => {
    setState((prev) => ({ ...prev, error: null }));

    try {
      const { headers, rows } = await parseCsvFile(file);

      if (!headers.length || !rows.length) {
        setState((prev) => ({ ...prev, error: 'This CSV appears to be empty or invalid.' }));
        return;
      }

      setState((prev) => ({
        ...prev,
        step: 'preview',
        filename: file.name,
        headers,
        rows,
        error: null,
      }));
    } catch (err) {
      setState((prev) => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Failed to parse CSV file.',
      }));
    }
  }, []);

  const confirmImport = useCallback(async () => {
    setState((prev) => ({ ...prev, step: 'processing', error: null }));

    try {
      const result = await importCsvRows(state.rows);
      setState((prev) => ({
        ...prev,
        step: 'results',
        records: result.records,
        imported: result.imported,
        skipped: result.skipped,
      }));
    } catch (err) {
      setState((prev) => ({
        ...prev,
        step: 'preview',
        error: err instanceof Error ? err.message : 'Failed to import CSV records.',
      }));
    }
  }, [state.rows]);

  const reset = useCallback(() => {
    setState(initialState);
  }, []);

  return { state, handleFileSelected, confirmImport, reset };
}
