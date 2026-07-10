export type CsvRow = Record<string, string>;

export interface UploadResponse {
  success: boolean;
  filename: string;
  totalRows: number;
  headers: string[];
  rows: CsvRow[];
  message?: string;
}

export const CRM_FIELDS = [
  'created_at',
  'name',
  'email',
  'country_code',
  'mobile_without_country_code',
  'company',
  'city',
  'state',
  'country',
  'lead_owner',
  'crm_status',
  'crm_note',
  'data_source',
  'possession_time',
  'description',
] as const;

export type CrmField = (typeof CRM_FIELDS)[number];

export type CrmRecord = Record<CrmField, string>;

export interface ImportResponse {
  success: boolean;
  imported: number;
  skipped: number;
  records: CrmRecord[];
  message?: string;
}

export type AppStep = 'upload' | 'preview' | 'processing' | 'results';
