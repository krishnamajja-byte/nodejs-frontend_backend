const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb://mongo:27017/goalsdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ Connected to MongoDB"))
.catch(err => console.error("❌ MongoDB connection error:", err));

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
    res.json(goal);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/goals', async (req, res) => {
  try {
    const goals = await Goal.find();
    res.json(goals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));

