const express = require('express');
const { handleImport } = require('../controllers/importController');

const router = express.Router();

// POST /import
router.post('/', handleImport);

module.exports = router;
