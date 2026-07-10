/**
 * Splits an array into chunks (batches) of the given size.
 * @param {Array<any>} items
 * @param {number} batchSize
 * @returns {Array<Array<any>>}
 */
function splitIntoBatches(items, batchSize) {
  const size = Number(batchSize) > 0 ? Number(batchSize) : 25;
  const batches = [];

  for (let i = 0; i < items.length; i += size) {
    batches.push(items.slice(i, i + size));
  }

  return batches;
}

module.exports = { splitIntoBatches };
