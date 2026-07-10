const OpenAI = require('openai');
const { buildSystemPrompt, buildUserPrompt } = require('../prompts/crmMappingPrompt');
const { normalizeRecord, isValidRecord } = require('../utils/validators');

let client = null;

function getClient() {
  if (!process.env.OPENAI_API_KEY) {
    const err = new Error('OPENAI_API_KEY is not set. Add it to backend/.env');
    err.status = 500;
    throw err;
  }
  if (!client) {
    // OPENAI_BASE_URL lets this point at any OpenAI-compatible provider
    // (e.g. Groq: https://api.groq.com/openai/v1) instead of OpenAI itself.
    // Leave it unset to use OpenAI's default endpoint.
    const options = { apiKey: process.env.OPENAI_API_KEY };
    if (process.env.OPENAI_BASE_URL) {
      options.baseURL = process.env.OPENAI_BASE_URL;
    }
    client = new OpenAI(options);
  }
  return client;
}

/**
 * Strips accidental markdown code fences from a model response, if present.
 * @param {string} text
 */
function stripCodeFences(text) {
  return text
    .trim()
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim();
}

/**
 * Sends a single batch of raw CSV rows to OpenAI and returns the
 * normalized + validated CRM records for that batch.
 * @param {Array<Record<string, string>>} batch
 * @returns {Promise<{ imported: Array<Record<string,string>>, skipped: number }>}
 */
async function mapBatchWithAI(batch) {
  const openai = getClient();
  const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';

  const completion = await openai.chat.completions.create({
    model,
    temperature: 0,
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: buildSystemPrompt() },
      {
        role: 'user',
        content: `${buildUserPrompt(batch)}\n\nRespond with a single JSON object of the form {"records": [...]} where "records" is the array described above.`,
      },
    ],
  });

  const raw = completion.choices?.[0]?.message?.content || '{}';
  const cleaned = stripCodeFences(raw);

  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch (err) {
    const parseErr = new Error('Failed to parse AI response as JSON');
    parseErr.status = 502;
    throw parseErr;
  }

  const aiRecords = Array.isArray(parsed) ? parsed : parsed.records || [];

  const imported = [];
  let skipped = 0;

  aiRecords.forEach((raw_) => {
    const record = normalizeRecord(raw_);
    const markedSkip = raw_ && raw_._skip === true;

    if (markedSkip || !isValidRecord(record)) {
      skipped += 1;
      return;
    }

    imported.push(record);
  });

  return { imported, skipped };
}

module.exports = { mapBatchWithAI };
