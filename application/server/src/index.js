import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';

import { connectDatabase } from './config/database.js';
import { sequelize, Post } from './models/index.js';
import postRoutes from './routes/post.routes.js';
import ingestRoutes from './routes/ingest.routes.js';
import { notFound, errorHandler } from './middleware/error.js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// ── Middleware ─────────────────────────────────────────────
app.use(cors({ origin: [CLIENT_URL], credentials: true }));
app.use(express.json({ limit: '25mb' })); // large enough for base64 images from n8n
app.use(express.urlencoded({ extended: true, limit: '25mb' }));
app.use(morgan('dev'));

// Serve generated featured images
app.use('/uploads', express.static(path.resolve(__dirname, '../uploads')));

// ── Health ─────────────────────────────────────────────────
app.get('/health', (req, res) => res.json({ status: 'ok', service: 'seo-blog-api' }));

// ── API routes ─────────────────────────────────────────────
app.use('/api', postRoutes);
app.use('/api', ingestRoutes);

// ── SEO sitemap ────────────────────────────────────────────
app.get('/sitemap.xml', async (req, res, next) => {
  try {
    const posts = await Post.findAll({
      where: { status: 'published' },
      attributes: ['slug', 'updatedAt'],
      order: [['updatedAt', 'DESC']],
    });
    const base = CLIENT_URL.replace(/\/$/, '');
    const urls = posts
      .map(
        (p) =>
          `  <url><loc>${base}/blog/${p.slug}</loc><lastmod>${new Date(
            p.updatedAt
          ).toISOString()}</lastmod></url>`
      )
      .join('\n');
    res.header('Content-Type', 'application/xml');
    res.send(
      `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${base}/</loc></url>\n${urls}\n</urlset>`
    );
  } catch (err) {
    next(err);
  }
});

// ── Fallbacks ──────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ── Boot ───────────────────────────────────────────────────
async function start() {
  try {
    await connectDatabase();
    console.log('✓ MySQL connected:', process.env.DB_NAME);
    await sequelize.sync({ alter: true });
    console.log('✓ Tables synced');
    app.listen(PORT, () => {
      console.log(`✓ SEO Blog API running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('✗ Failed to start server:', err.message);
    process.exit(1);
  }
}

start();
