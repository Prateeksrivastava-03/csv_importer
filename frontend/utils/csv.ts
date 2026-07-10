import Papa from 'papaparse';
import { CsvRow } from './types';

export interface ParsedCsv {
  headers: string[];
  rows: CsvRow[];
}

/**
 * Parses a File object client-side using PapaParse so we can render
 * an instant preview table before ever hitting the backend.
 */
export function parseCsvFile(file: File): Promise<ParsedCsv> {
  return new Promise((resolve, reject) => {
    Papa.parse<CsvRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const headers = results.meta.fields || [];
        const rows = results.data.filter((row) =>
          Object.values(row).some((value) => value && String(value).trim() !== '')
        );
        resolve({ headers, rows });
      },
      error: (error) => reject(error),
    });
  });
}

export function isCsvFile(file: File): boolean {
  return file.name.toLowerCase().endsWith('.csv') || file.type === 'text/csv';
}
