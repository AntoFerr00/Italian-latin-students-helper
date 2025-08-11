// controllers/textController.js
const Text = require('../models/Text');
const { getAIEvaluation } = require('../services/aiService');

// Get all texts to display on a selection screen
exports.getAllTexts = async (req, res) => {
  try {
    const texts = await Text.find({}, 'title author genre'); // Only send necessary info
    res.status(200).json(texts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching texts', error });
  }
};

// Get a single, full text for the translation workspace
exports.getTextById = async (req, res) => {
  try {
    const text = await Text.findById(req.params.id);
    if (!text) {
      return res.status(404).json({ message: 'Text not found' });
    }
    res.status(200).json(text);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching text', error });
  }
};

// Evaluate a student's final translation
exports.evaluateTranslation = async (req, res) => {
    try {
        const text = await Text.findById(req.params.id);
        if (!text) {
            return res.status(404).json({ message: 'Text not found' });
        }

        const { studentTranslation } = req.body;
        const expertTranslation = text.analysis.expertTranslation;

        const feedback = await getAIEvaluation(studentTranslation, expertTranslation);

        res.status(200).json({ feedback });

    } catch (error) {
        res.status(500).json({ message: 'Error during evaluation', error });
    }
};