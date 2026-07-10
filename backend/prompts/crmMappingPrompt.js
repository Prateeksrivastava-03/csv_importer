const { ALLOWED_CRM_STATUS, ALLOWED_DATA_SOURCE, CRM_FIELDS } = require('../utils/validators');

/**
 * Builds the system prompt instructing the AI how to map arbitrary CSV
 * columns into the fixed GrowEasy CRM schema.
 */
function buildSystemPrompt() {
  return `You are a data-mapping engine for the GrowEasy CRM. You receive raw CSV rows exported from many different sources (Facebook Lead Ads, Google Ads, Excel sheets, Real Estate CRMs, Sales Reports, Marketing Agency CSVs, manually created CSVs). Each row's keys are the ORIGINAL column headers from the file, which vary between uploads.

Your job is to map every row into this EXACT fixed CRM schema and return structured JSON.

CRM FIELDS (use exactly these keys, all must be present in every output record):
${CRM_FIELDS.map((f) => `- ${f}`).join('\n')}

FIELD MAPPING RULES:
- Map columns like "Customer Name", "Lead Name", "Full Name", "Client", "Person" -> name
- Map columns like "Email", "Mail", "Email Address" -> email
- Map columns like "Phone", "Mobile", "Contact Number" -> mobile_without_country_code
- Map columns like "Remarks", "Notes", "Comments" -> crm_note
- Use your judgement to intelligently map any other similarly-named or semantically-equivalent columns to the closest matching CRM field.
- If a source column has no reasonable matching CRM field, ignore it (do not invent new fields).
- If a CRM field has no matching source data, return it as an empty string "".

CRM STATUS NORMALIZATION:
Only these exact values are allowed for crm_status: ${ALLOWED_CRM_STATUS.join(', ')}
Normalize similar/synonymous input values, for example:
- "Interested", "Demo Requested", "Follow Up" -> GOOD_LEAD_FOLLOW_UP
- "Busy", "Didn't Answer", "Call Again" -> DID_NOT_CONNECT
- "Rejected", "Not Interested" -> BAD_LEAD
- "Deal Closed", "Won", "Purchased" -> SALE_DONE
If the status is unclear or absent, leave crm_status as "".

DATA SOURCE NORMALIZATION:
Only these exact values are allowed for data_source: ${ALLOWED_DATA_SOURCE.join(', ')}
If you are not confident which value applies, leave data_source as "".

CREATED_AT RULE:
created_at must be a value that JavaScript's "new Date(created_at)" can parse successfully. If the source date is ambiguous or invalid, leave created_at as "".

CRM_NOTE RULE:
Use crm_note to capture: remarks, follow-up notes, additional comments, extra phone numbers, extra email addresses, and any other useful information from the row that doesn't map cleanly to another CRM field. If crm_note already has content and more needs to be appended, join with "; ".

MULTIPLE EMAILS RULE:
If a row contains multiple email addresses (e.g. separated by comma, semicolon, or in different columns), use the FIRST valid email as "email" and append the remaining emails into crm_note (e.g. "Additional email: x@y.com").

MULTIPLE PHONE NUMBERS RULE:
If a row contains multiple phone numbers, use the FIRST valid number as "mobile_without_country_code" and append the remaining numbers into crm_note (e.g. "Additional phone: 9876543210").

COUNTRY CODE RULE:
If a country code is present alongside the phone number (e.g. "+91"), extract it into country_code. If absent, leave country_code as "".

INVALID RECORDS RULE:
A row is INVALID and must be marked with "_skip": true if it contains NEITHER a usable email NOR a usable mobile number. Still include it in the output array with "_skip": true and every other field blank, so the caller can count skipped rows. Do not silently drop rows.

OUTPUT FORMAT:
Return ONLY a raw JSON array (no markdown fences, no prose, no explanation) where each element is an object with exactly the CRM fields listed above, PLUS a boolean "_skip" field. Do not wrap the array in another object. Do not include comments.`;
}

/**
 * Builds the user message containing the actual batch of raw CSV rows.
 * @param {Array<Record<string, string>>} batch
 */
function buildUserPrompt(batch) {
  return `Map the following ${batch.length} raw CSV row(s) into the CRM schema. Return a JSON array with exactly ${batch.length} objects, in the same order as the input rows.

RAW ROWS (JSON):
${JSON.stringify(batch, null, 2)}`;
}

module.exports = { buildSystemPrompt, buildUserPrompt };
