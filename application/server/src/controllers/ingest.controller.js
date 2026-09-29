import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Post } from '../models/index.js';
import { uniqueSlug } from '../utils/slugify.js';
import { readingTime } from '../utils/readingTime.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOADS_DIR = path.resolve(__dirname, '../../uploads');

const MIME_EXT = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/webp': 'webp',
};

async function writeBuffer(buffer, mime, slug) {
  const ext = MIME_EXT[(mime || 'image/png').toLowerCase()] || 'png';
  const filename = `${slug}-${Date.now()}.${ext}`;
  await fs.mkdir(UPLOADS_DIR, { recursive: true });
  await fs.writeFile(path.join(UPLOADS_DIR, filename), buffer);
  return `/uploads/${filename}`;
}

/**
 * Accept a base64 image (optionally a data URL) and write it to /uploads.
 * Returns the public path ("/uploads/<file>") or null when nothing supplied.
 */
async function saveBase64(imageBase64, mime, slug) {
  if (!imageBase64) return null;
  let data = imageBase64;
  let detectedMime = mime;

  const dataUrlMatch = /^data:(image\/[a-z+]+);base64,(.*)$/is.exec(imageBase64);
  if (dataUrlMatch) {
    detectedMime = detectedMime || dataUrlMatch[1];
    data = dataUrlMatch[2];
  }
  return writeBuffer(Buffer.from(data, 'base64'), detectedMime, slug);
}

/**
 * Download an image from a (possibly short-lived) URL and store it locally so
 * the blog keeps a permanent copy. Returns the public path, or null on failure.
 */
async function downloadImage(imageUrl, slug) {
  if (!imageUrl || !/^https?:\/\//i.test(imageUrl)) return null;
  const resp = await fetch(imageUrl);
  if (!resp.ok) throw new Error(`image fetch ${resp.status}`);
  const mime = resp.headers.get('content-type') || 'image/png';
  const buffer = Buffer.from(await resp.arrayBuffer());
  return writeBuffer(buffer, mime, slug);
}

/** POST /api/ingest/posts  (protected by X-Ingest-Token) */
export async function ingestPost(req, res, next) {
  try {
    const body = req.body || {};
    const {
      title,
      content,
      excerpt,
      metaDescription,
      metaKeywords,
      category,
      tags,
      author,
      sourceUrl,
      imageAlt,
      imageBase64,
      imageUrl,
      imageMime,
    } = body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Both "title" and "content" are required.' });
    }

    const slug = await uniqueSlug(Post, body.slug || title);

    // Prefer a supplied base64 image; otherwise download the given URL so we
    // keep a permanent local copy (DALL·E URLs expire after ~1 hour).
    let featuredImage = null;
    try {
      featuredImage = await saveBase64(imageBase64, imageMime, slug);
      if (!featuredImage && imageUrl) featuredImage = await downloadImage(imageUrl, slug);
    } catch (imgErr) {
      console.error('[ingest] image handling failed:', imgErr.message);
      // last resort: keep the remote URL so the post still has an image
      if (!featuredImage && imageUrl) featuredImage = imageUrl;
    }

    const normalizedTags = Array.isArray(tags)
      ? tags
      : typeof tags === 'string' && tags.trim()
        ? tags.split(',').map((t) => t.trim()).filter(Boolean)
        : [];

    const post = await Post.create({
      title: String(title).trim(),
      slug,
      content,
      excerpt: excerpt || String(content).replace(/<[^>]*>/g, ' ').trim().slice(0, 200),
      metaDescription: metaDescription || null,
      metaKeywords: Array.isArray(metaKeywords) ? metaKeywords.join(', ') : metaKeywords || null,
      category: category || 'General',
      tags: normalizedTags,
      featuredImage,
      imageAlt: imageAlt || title,
      author: author || 'SEO Desk',
      sourceUrl: sourceUrl || null,
      readingTime: readingTime(content),
      status: 'published',
    });

    res.status(201).json({
      message: 'Post created.',
      data: { id: post.id, slug: post.slug, featuredImage: post.featuredImage },
    });
  } catch (err) {
    next(err);
  }
}
