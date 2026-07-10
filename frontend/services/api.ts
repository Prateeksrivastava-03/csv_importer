import { CsvRow, ImportResponse, UploadResponse } from '@/utils/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

/**
 * Uploads the raw CSV file to the backend /upload endpoint so it can be
 * parsed server-side too (kept in sync with the client-side preview).
 */
export async function uploadCsv(file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API_BASE_URL}/upload`, {
    method: 'POST',
    body: formData,
  });

  const data: UploadResponse = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data.message || 'Failed to upload CSV');
  }

  return data;
}

/**
 * Sends the confirmed rows to the backend /import endpoint, which
 * batches them to OpenAI for CRM field mapping.
 */
export async function importCsvRows(rows: CsvRow[]): Promise<ImportResponse> {
  const res = await fetch(`${API_BASE_URL}/import`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rows }),
  });

  const data: ImportResponse = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data.message || 'Failed to import CSV records');
  }

  return data;
}
