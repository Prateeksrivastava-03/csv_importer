const express = require('express');
const upload = require('../middleware/upload');
const { handleUpload } = require('../controllers/uploadController');

const router = express.Router();

// POST /upload
router.post('/', upload.single('file'), handleUpload);

module.exports = router;
