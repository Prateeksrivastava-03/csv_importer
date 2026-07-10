const { parseCsvBuffer } = require('../services/csvService');

/**
 * POST /upload
 * Accepts a CSV file, parses it, and returns headers + rows so the
 * frontend can render a preview table. Does NOT call the AI.
 */
async function handleUpload(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No CSV file uploaded' });
    }

    const { headers, rows } = await parseCsvBuffer(req.file.buffer);

    if (!headers.length) {
      return res.status(400).json({ success: false, message: 'CSV file appears to be empty or invalid' });
    }

    return res.json({
      success: true,
      filename: req.file.originalname,
      totalRows: rows.length,
      headers,
      rows,
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = { handleUpload };
