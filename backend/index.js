require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const sharp = require('sharp');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const mysql = require('mysql2/promise');

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
const ADMIN_BOOTSTRAP_USERNAME = (process.env.ADMIN_USERNAME || 'admin').trim();
const ADMIN_BOOTSTRAP_PASSWORD = process.env.ADMIN_PASSWORD || '';
const ADMIN_BOOTSTRAP_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || '';
const ADMIN_TOKEN_EXPIRES = process.env.ADMIN_TOKEN_EXPIRES || '12h';
const JWT_SECRET = process.env.JWT_SECRET || crypto.randomBytes(48).toString('hex');

if (!process.env.JWT_SECRET) {
    console.warn(
        'JWT_SECRET is not set. Using a temporary secret for this runtime. Set JWT_SECRET in .env for stable sessions.'
    );
}

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

const parseMySqlConfig = () => {
    const mysqlUrl = process.env.MYSQL_URL;

    if (mysqlUrl) {
        const url = new URL(mysqlUrl);
        return {
            host: url.hostname,
            port: Number(url.port || 3306),
            user: decodeURIComponent(url.username || process.env.MYSQL_USER || 'root'),
            password: decodeURIComponent(url.password || process.env.MYSQL_PASSWORD || ''),
            database: decodeURIComponent(url.pathname.replace(/^\//, '') || process.env.MYSQL_DATABASE || 'limitless_art')
        };
    }

    return {
        host: process.env.MYSQL_HOST || '127.0.0.1',
        port: Number(process.env.MYSQL_PORT || 3306),
        user: process.env.MYSQL_USER || 'root',
        password: process.env.MYSQL_PASSWORD || '',
        database: process.env.MYSQL_DATABASE || 'limitless_art'
    };
};

const mysqlConfig = parseMySqlConfig();
let pool;

const escapeIdentifier = (identifier) => `\`${String(identifier).replace(/`/g, '``')}\``;
const CONTENT_QUERY_MAX_LIMIT = 500;
const SALT_ROUNDS = 12;

const parseJson = (value) => {
    if (value == null || value === '') {
        return null;
    }

    try {
        return JSON.parse(value);
    } catch (_error) {
        return null;
    }
};

const toJson = (value) => JSON.stringify(value ?? null);
const toPublicAdminUser = (row) => ({
    id: String(row.id),
    username: row.username
});

const buildRandomPassword = () => crypto.randomBytes(18).toString('base64url');

const createAdminToken = (adminUser) =>
    jwt.sign(
        {
            sub: String(adminUser.id),
            username: adminUser.username,
            role: 'admin'
        },
        JWT_SECRET,
        { expiresIn: ADMIN_TOKEN_EXPIRES }
    );

const getBearerToken = (authorizationHeader = '') => {
    if (!authorizationHeader.toLowerCase().startsWith('bearer ')) {
        return '';
    }
    return authorizationHeader.slice(7).trim();
};

const requireAdminAuth = (req, res, next) => {
    const token = getBearerToken(req.headers.authorization || '');
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const payload = jwt.verify(token, JWT_SECRET);
        req.admin = payload;
        return next();
    } catch (_error) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
};

const toIsoDateTime = (value) => {
    if (!value) {
        return null;
    }

    if (value instanceof Date) {
        return value.toISOString();
    }

    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
};

const mapContentRow = (row) => ({
    _id: String(row.id),
    title: row.title,
    type: row.type,
    data: parseJson(row.data_json),
    createdAt: toIsoDateTime(row.created_at)
});

const ensureBootstrapAdmin = async () => {
    const [existingRows] = await pool.execute(
        'SELECT id, username FROM admin_users WHERE username = ? LIMIT 1',
        [ADMIN_BOOTSTRAP_USERNAME]
    );

    if (existingRows.length > 0) {
        return;
    }

    let passwordHash = ADMIN_BOOTSTRAP_PASSWORD_HASH.trim();
    let generatedPassword = '';

    if (!passwordHash) {
        const bootstrapPassword = ADMIN_BOOTSTRAP_PASSWORD || buildRandomPassword();
        passwordHash = await bcrypt.hash(bootstrapPassword, SALT_ROUNDS);

        if (!ADMIN_BOOTSTRAP_PASSWORD) {
            generatedPassword = bootstrapPassword;
        }
    }

    await pool.execute(
        'INSERT INTO admin_users (username, password_hash, is_active) VALUES (?, ?, 1)',
        [ADMIN_BOOTSTRAP_USERNAME, passwordHash]
    );

    console.log(`Admin user initialized: ${ADMIN_BOOTSTRAP_USERNAME}`);
    if (generatedPassword) {
        console.log(`Generated admin password: ${generatedPassword}`);
        console.log('Set ADMIN_PASSWORD in backend/.env to use a fixed secure password.');
    }
};

const initDatabase = async () => {
    const bootstrapConnection = await mysql.createConnection({
        host: mysqlConfig.host,
        port: mysqlConfig.port,
        user: mysqlConfig.user,
        password: mysqlConfig.password,
        connectTimeout: 10000
    });

    await bootstrapConnection.query(
        `CREATE DATABASE IF NOT EXISTS ${escapeIdentifier(mysqlConfig.database)} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
    );
    await bootstrapConnection.end();

    pool = mysql.createPool({
        host: mysqlConfig.host,
        port: mysqlConfig.port,
        user: mysqlConfig.user,
        password: mysqlConfig.password,
        database: mysqlConfig.database,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        timezone: 'Z',
        charset: 'utf8mb4'
    });

    await pool.query(`
        CREATE TABLE IF NOT EXISTS content_entries (
            id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
            title VARCHAR(255) NULL,
            type VARCHAR(80) NOT NULL,
            data_json LONGTEXT NOT NULL,
            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            INDEX idx_content_type_created_at (type, created_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    await pool.query(`
        CREATE TABLE IF NOT EXISTS site_content (
            content_key VARCHAR(120) NOT NULL,
            data_json LONGTEXT NOT NULL,
            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (content_key)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    await pool.query(`
        CREATE TABLE IF NOT EXISTS admin_users (
            id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
            username VARCHAR(80) NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            is_active TINYINT(1) NOT NULL DEFAULT 1,
            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            UNIQUE KEY ux_admin_users_username (username)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    await ensureBootstrapAdmin();

    console.log(
        `Connected to MySQL at ${mysqlConfig.host}:${mysqlConfig.port}/${mysqlConfig.database}`
    );
};

app.post('/api/admin/login', async (req, res) => {
    try {
        const username = (req.body?.username || '').toString().trim();
        const password = (req.body?.password || '').toString();

        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        const [rows] = await pool.execute(
            'SELECT id, username, password_hash, is_active FROM admin_users WHERE username = ? LIMIT 1',
            [username]
        );

        if (!rows.length || !rows[0].is_active) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const adminUser = rows[0];
        const passwordMatches = await bcrypt.compare(password, adminUser.password_hash);
        if (!passwordMatches) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        return res.json({
            token: createAdminToken(adminUser),
            tokenType: 'Bearer',
            expiresIn: ADMIN_TOKEN_EXPIRES,
            user: toPublicAdminUser(adminUser)
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

app.get('/api/admin/me', requireAdminAuth, async (req, res) => {
    try {
        const adminId = Number(req.admin?.sub);
        if (!Number.isInteger(adminId) || adminId <= 0) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const [rows] = await pool.execute(
            'SELECT id, username, is_active FROM admin_users WHERE id = ? LIMIT 1',
            [adminId]
        );

        if (!rows.length || !rows[0].is_active) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        return res.json({ user: toPublicAdminUser(rows[0]) });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

app.post('/api/admin/logout', requireAdminAuth, (_req, res) => {
    return res.json({ message: 'Logged out' });
});

app.get('/api/health', async (_req, res) => {
    try {
        const [rows] = await pool.query('SELECT 1 AS ok');
        res.json({
            status: 'ok',
            database: rows?.[0]?.ok === 1 ? 'connected' : 'unknown',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            database: 'disconnected',
            error: error.message
        });
    }
});

// API endpoint to fetch data
app.get('/api/content', requireAdminAuth, async (req, res) => {
    try {
        const filters = [];
        const params = [];
        const requestedType = (req.query.type || '').toString().trim();
        const requestedLimitRaw = Number(req.query.limit || 0);

        if (requestedType) {
            filters.push('type = ?');
            params.push(requestedType);
        }

        const safeLimit = Number.isInteger(requestedLimitRaw) && requestedLimitRaw > 0
            ? Math.min(requestedLimitRaw, CONTENT_QUERY_MAX_LIMIT)
            : 0;

        const whereClause = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
        const limitClause = safeLimit ? ` LIMIT ${safeLimit}` : '';
        const sql = `SELECT id, title, type, data_json, created_at FROM content_entries ${whereClause} ORDER BY created_at DESC, id DESC${limitClause}`;
        const [rows] = filters.length ? await pool.execute(sql, params) : await pool.query(sql);

        res.json(rows.map(mapContentRow));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create new content (registration/contact/gallery/etc.)
app.post('/api/content', async (req, res) => {
    try {
        const title = typeof req.body?.title === 'string' ? req.body.title : null;
        const type = typeof req.body?.type === 'string' && req.body.type.trim() ? req.body.type.trim() : 'General';
        const data = Object.prototype.hasOwnProperty.call(req.body || {}, 'data') ? req.body.data : null;

        const [result] = await pool.execute(
            'INSERT INTO content_entries (title, type, data_json) VALUES (?, ?, ?)',
            [title, type, toJson(data)]
        );

        const [savedRows] = await pool.execute(
            'SELECT id, title, type, data_json, created_at FROM content_entries WHERE id = ? LIMIT 1',
            [result.insertId]
        );

        res.status(201).json(mapContentRow(savedRows[0]));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete a content row
app.delete('/api/content/:id', requireAdminAuth, async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({ error: 'Invalid content id' });
        }

        const [result] = await pool.execute('DELETE FROM content_entries WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Content not found' });
        }

        return res.json({ message: 'Deleted successfully' });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

// Fetch saved site content by key (example key: "home-page")
app.get('/api/site-content/:key', async (req, res) => {
    try {
        const [rows] = await pool.execute(
            'SELECT content_key, data_json, updated_at FROM site_content WHERE content_key = ? LIMIT 1',
            [req.params.key]
        );

        if (!rows.length) {
            return res.status(404).json({ error: 'Site content not found' });
        }

        const entry = rows[0];
        return res.json({
            key: entry.content_key,
            data: parseJson(entry.data_json),
            updatedAt: toIsoDateTime(entry.updated_at)
        });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

// Upsert site content by key
app.put('/api/site-content/:key', requireAdminAuth, async (req, res) => {
    try {
        if (!req.body || typeof req.body.data === 'undefined') {
            return res.status(400).json({ error: 'Missing data field in request body' });
        }

        await pool.execute(
            `INSERT INTO site_content (content_key, data_json)
             VALUES (?, ?)
             ON DUPLICATE KEY UPDATE data_json = VALUES(data_json), updated_at = CURRENT_TIMESTAMP`,
            [req.params.key, toJson(req.body.data)]
        );

        const [rows] = await pool.execute(
            'SELECT content_key, data_json, updated_at FROM site_content WHERE content_key = ? LIMIT 1',
            [req.params.key]
        );

        const updated = rows[0];
        return res.json({
            key: updated.content_key,
            data: parseJson(updated.data_json),
            updatedAt: toIsoDateTime(updated.updated_at)
        });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

// Upload an image file and return a public URL for storing in site content
app.post('/api/uploads/image', requireAdminAuth, (req, res) => {
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
        } catch (_processingError) {
            return res.status(400).json({
                error: 'Image processing failed. Please use a valid image file.'
            });
        }
    });
});

const PORT = Number(process.env.PORT || 5000);

const start = async () => {
    try {
        await initDatabase();

        app.listen(PORT, () => {
            console.log(`Backend server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

const shutdown = async () => {
    try {
        if (pool) {
            await pool.end();
        }
    } finally {
        process.exit(0);
    }
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

void start();
