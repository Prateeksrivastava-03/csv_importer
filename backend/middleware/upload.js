const multer = require('multer');

// Store the uploaded CSV in memory - we only need it transiently to parse
const storage = multer.memoryStorage();

function fileFilter(req, file, cb) {
  // The .csv extension is the authoritative check - mimetypes reported by
  // browsers for CSV files are inconsistent (text/csv, application/vnd.ms-excel,
  // text/plain, application/octet-stream all show up in practice), so we
  // require the extension and use mimetype only to reject obviously wrong types.
  const isCsvExt = file.originalname.toLowerCase().endsWith('.csv');
  const isObviouslyWrongMime = /^(image|video|audio)\//.test(file.mimetype) || file.mimetype === 'application/pdf';

  if (isCsvExt && !isObviouslyWrongMime) {
    cb(null, true);
  } else {
    cb(new Error('Only .csv files are allowed'), false);
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 15 * 1024 * 1024, // 15MB max
  },
});

module.exports = upload;
