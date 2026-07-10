const { splitIntoBatches } = require('../utils/batchUtils');
const { mapBatchWithAI } = require('../services/openaiService');

/**
 * POST /import
 * Body: { rows: Array<Record<string, string>> }
 * Splits rows into batches, sends each batch to OpenAI for CRM field
 * mapping, and aggregates the results.
 */
async function handleImport(req, res, next) {
  try {
    const { rows } = req.body;

    if (!Array.isArray(rows) || rows.length === 0) {
      return res.status(400).json({ success: false, message: 'No rows provided for import' });
    }

    const batchSize = Number(process.env.BATCH_SIZE) || 25;
    const batches = splitIntoBatches(rows, batchSize);

    const allRecords = [];
    let totalSkipped = 0;

    for (let i = 0; i < batches.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      const { imported, skipped } = await mapBatchWithAI(batches[i]);
      allRecords.push(...imported);
      totalSkipped += skipped;
    }

    return res.json({
      success: true,
      imported: allRecords.length,
      skipped: totalSkipped,
      records: allRecords,
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = { handleImport };
