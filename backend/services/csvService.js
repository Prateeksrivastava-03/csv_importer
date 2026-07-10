const csvParser = require('csv-parser');
const streamifier = require('streamifier');

/**
 * Parses a CSV file buffer into an array of row objects.
 * Keeps original headers exactly as they appear in the file so the AI
 * can see the raw column names and intelligently map them.
 * @param {Buffer} buffer
 * @returns {Promise<{ headers: string[], rows: Record<string, string>[] }>}
 */
function parseCsvBuffer(buffer) {
  return new Promise((resolve, reject) => {
    const rows = [];
    let headers = [];

    streamifier
      .createReadStream(buffer)
      .pipe(csvParser())
      .on('headers', (h) => {
        headers = h;
      })
      .on('data', (row) => {
        rows.push(row);
      })
      .on('end', () => {
        resolve({ headers, rows });
      })
      .on('error', (err) => {
        reject(err);
      });
  });
}

module.exports = { parseCsvBuffer };
