// models/Text.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const textSchema = new Schema({
  title: { type: String, required: true },
  author: { type: String, default: 'Unknown' },
  genre: { type: String, required: true },
  content: { type: String, required: true },
  // Pre-define the analysis for evaluation
  analysis: {
    sentences: [String],
    verbs: [String],
    mainVerb: String,
    // --- ADD THIS OBJECT ---
    mainVerbAnalysis: {
      voice: String,   // e.g., 'Attivo'
      person: String,  // e.g., '3a'
      number: String   // e.g., 'Singolare'
    },
    expertTranslation: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Text', textSchema);