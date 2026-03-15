require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const sharp = require('sharp');

const app = express();
app.use(express.json({ limit: '25mb' }));
app.use(cors());

const uploadsRootDir = path.join(__dirname, 'uploads');
const siteUploadsDir = path.join(uploadsRootDir, 'site-content');
fs.mkdirSync(siteUploadsDir, { recursive: true });
app.use('/uploads', express.static(uploadsRootDir, { maxAge: '30d', immutable: true }));

const WEB_IMAGE_MAX_WIDTH = Number(process.env.UPLOAD_MAX_WIDTH || 1920);
const WEB_IMAGE_MAX_HEIGHT = Number(process.env.UPLOAD_MAX_HEIGHT || 1920);
const WEBP_QUALITY = Number(process.env.UPLOAD_WEBP_QUALITY || 82);

const buildSafeImageBaseName = (originalName = 'image') => {
    const safeName = originalName
        .replace(/\s+/g, '-')
        .replace(/[^a-zA-Z0-9._-]/g, '')
        .toLowerCase();
    const extension = path.extname(safeName);
    const baseName = path.basename(safeName, extension) || 'image';
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    return `${baseName}-${uniqueSuffix}`;
};

const imageUpload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 12 * 1024 * 1024
    },
    fileFilter: (_req, file, callback) => {
        if (!file.mimetype || !file.mimetype.startsWith('image/')) {
            callback(new Error('Only image files are allowed'));
            return;
        }

        callback(null, true);
    }
});

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

// Stores editable page content for sections like Home page.
const siteContentSchema = new mongoose.Schema(
    {
        key: { type: String, required: true, unique: true, index: true },
        data: mongoose.Schema.Types.Mixed
    },
    {
        timestamps: true
    }
);

const SiteContent = mongoose.model('SiteContent', siteContentSchema);

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

// Fetch saved site content by key (example key: "home-page")
app.get('/api/site-content/:key', async (req, res) => {
    try {
        const entry = await SiteContent.findOne({ key: req.params.key });
        if (!entry) {
            return res.status(404).json({ error: 'Site content not found' });
        }

        return res.json({
            key: entry.key,
            data: entry.data,
            updatedAt: entry.updatedAt
        });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

// Upsert site content by key
app.put('/api/site-content/:key', async (req, res) => {
    try {
        if (!req.body || typeof req.body.data === 'undefined') {
            return res.status(400).json({ error: 'Missing data field in request body' });
        }

        const updated = await SiteContent.findOneAndUpdate(
            { key: req.params.key },
            { key: req.params.key, data: req.body.data },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        return res.json({
            key: updated.key,
            data: updated.data,
            updatedAt: updated.updatedAt
        });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

// Upload an image file and return a public URL for storing in site content
app.post('/api/uploads/image', (req, res) => {
    imageUpload.single('image')(req, res, async (error) => {
        if (error) {
            return res.status(400).json({ error: error.message || 'Image upload failed' });
        }

        if (!req.file) {
            return res.status(400).json({ error: 'No image file received' });
        }

        try {
            const fileBase = buildSafeImageBaseName(req.file.originalname);
            const fileName = `${fileBase}.webp`;
            const outputPath = path.join(siteUploadsDir, fileName);

            await sharp(req.file.buffer)
                .rotate()
                .resize({
                    width: WEB_IMAGE_MAX_WIDTH,
                    height: WEB_IMAGE_MAX_HEIGHT,
                    fit: 'inside',
                    withoutEnlargement: true
                })
                .webp({
                    quality: WEBP_QUALITY,
                    effort: 5
                })
                .toFile(outputPath);

            const stats = fs.statSync(outputPath);
            const publicPath = `/uploads/site-content/${fileName}`;
            const absoluteUrl = `${req.protocol}://${req.get('host')}${publicPath}`;

            return res.status(201).json({
                url: absoluteUrl,
                path: publicPath,
                filename: fileName,
                format: 'webp',
                originalSizeBytes: req.file.size,
                optimizedSizeBytes: stats.size
            });
        } catch (processingError) {
            return res.status(400).json({
                error: 'Image processing failed. Please use a valid image file.'
            });
        }
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
});
