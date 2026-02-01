const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const logger = require('./logger');  // Import logger

const app = express();
const PORT = 80;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Morgan setup to log HTTP requests into Winston
const stream = {
  write: (message) => logger.info(message.trim())
};
app.use(morgan('combined', { stream }));

// MongoDB connection
mongoose.connect('mongodb://mongodb:27017/goalsdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => logger.info("✅ Connected to MongoDB"))
.catch(err => logger.error("❌ MongoDB connection error: " + err));

// Schema & Model
const GoalSchema = new mongoose.Schema({
  text: { type: String, required: true }
});
const Goal = mongoose.model('Goal', GoalSchema);

// Routes
app.post('/api/goals', async (req, res) => {
  try {
    const goal = new Goal({ text: req.body.text });
    await goal.save();
    logger.info(`New goal added: ${goal.text}`);
    res.json(goal);
  } catch (err) {
    logger.error("Error saving goal: " + err.message);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/goals', async (req, res) => {
  try {
    const goals = await Goal.find();
    logger.info("Fetched all goals");
    res.json(goals);
  } catch (err) {
    logger.error("Error fetching goals: " + err.message);
    res.status(500).json({ error: err.message });
  }
});

// Start server
app.listen(PORT, () => logger.info(`🚀 Backend running on port ${PORT}`));
