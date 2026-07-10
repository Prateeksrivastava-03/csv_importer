const ALLOWED_CRM_STATUS = [
  'GOOD_LEAD_FOLLOW_UP',
  'DID_NOT_CONNECT',
  'BAD_LEAD',
  'SALE_DONE',
];

const ALLOWED_DATA_SOURCE = [
  'leads_on_demand',
  'meridian_tower',
  'eden_park',
  'varah_swamy',
  'sarjapur_plots',
];

const CRM_FIELDS = [
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
];

/**
 * Ensures a record only contains the allowed CRM fields, filling
 * missing ones with empty strings, and normalizes crm_status /
 * data_source against the allowed enum values.
 * @param {Record<string, any>} record
 * @returns {Record<string, string>}
 */
function normalizeRecord(record) {
  const normalized = {};

  CRM_FIELDS.forEach((field) => {
    const value = record?.[field];
    normalized[field] = value === undefined || value === null ? '' : String(value).trim();
  });

  if (normalized.crm_status && !ALLOWED_CRM_STATUS.includes(normalized.crm_status)) {
    normalized.crm_status = '';
  }

  if (normalized.data_source && !ALLOWED_DATA_SOURCE.includes(normalized.data_source)) {
    normalized.data_source = '';
  }

  // Validate created_at is usable by `new Date(created_at)`; if not, blank it out
  if (normalized.created_at) {
    const parsed = new Date(normalized.created_at);
    if (Number.isNaN(parsed.getTime())) {
      normalized.created_at = '';
    }
  }

  return normalized;
}

/**
 * A record is only valid if it has an email OR a mobile number.
 * @param {Record<string, string>} record
 * @returns {boolean}
 */
function isValidRecord(record) {
  const hasEmail = Boolean(record.email && record.email.includes('@'));
  const hasMobile = Boolean(
    record.mobile_without_country_code && record.mobile_without_country_code.replace(/\D/g, '').length >= 6
  );
  return hasEmail || hasMobile;
}

module.exports = {
  ALLOWED_CRM_STATUS,
  ALLOWED_DATA_SOURCE,
  CRM_FIELDS,
  normalizeRecord,
  isValidRecord,
};
