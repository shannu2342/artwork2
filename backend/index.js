require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Default MongoDB URI or set it from `.env`
const DB_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/limitless_art';

mongoose.connect(DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("Connected to MongoDB successfully");
}).catch((err) => {
    console.error("MongoDB connection Error:", err);
});

// A simple schema describing an entity (Post, Gallery Image, Registration)
const contentSchema = new mongoose.Schema({
    title: String,
    type: String, // 'Workshop', 'Gallery', 'Registration'
    data: mongoose.Schema.Types.Mixed,
    createdAt: { type: Date, default: Date.now }
});

const Content = mongoose.model('Content', contentSchema);

// API endpoint to fetch data
app.get('/api/content', async (req, res) => {
    try {
        const contents = await Content.find().sort({ createdAt: -1 });
        res.json(contents);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create new post
app.post('/api/content', async (req, res) => {
    try {
        const newContent = new Content(req.body);
        const saved = await newContent.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete a post
app.delete('/api/content/:id', async (req, res) => {
    try {
        await Content.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
});
