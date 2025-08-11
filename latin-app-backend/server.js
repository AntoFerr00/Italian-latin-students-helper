// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const textRoutes = require('./routes/textRoutes');

const app = express();

// Middleware
app.use(cors()); // Allow requests from your React frontend
app.use(express.json()); // To parse JSON request bodies

// Routes
app.use('/api/texts', textRoutes);

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error('Could not connect to MongoDB', err));