// routes/textRoutes.js
const express = require('express');
const router = express.Router();
const textController = require('../controllers/textController');

// GET all available Latin texts
router.get('/', textController.getAllTexts);

// GET a single text by its ID
router.get('/:id', textController.getTextById);

// POST a new translation for evaluation
router.post('/:id/evaluate', textController.evaluateTranslation);

module.exports = router;