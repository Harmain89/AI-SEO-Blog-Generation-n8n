import { Op, fn, col } from 'sequelize';
import { Post } from '../models/index.js';

const PUBLIC_ATTRS = [
  'id', 'title', 'slug', 'excerpt', 'metaDescription', 'metaKeywords',
  'category', 'tags', 'featuredImage', 'imageAlt', 'author', 'sourceUrl',
  'readingTime', 'views', 'createdAt', 'updatedAt',
];

/** GET /api/posts?page&limit&category&q */
export async function listPosts(req, res, next) {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 9));
    const offset = (page - 1) * limit;

    const where = { status: 'published' };
    if (req.query.category) where.category = req.query.category;
    if (req.query.q) {
      const q = `%${req.query.q}%`;
      where[Op.or] = [
        { title: { [Op.like]: q } },
        { excerpt: { [Op.like]: q } },
        { metaKeywords: { [Op.like]: q } },
      ];
    }

    const { rows, count } = await Post.findAndCountAll({
      where,
      attributes: PUBLIC_ATTRS,
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });

    res.json({
      data: rows,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (err) {
    next(err);
  }
}

/** GET /api/posts/:slug  (increments views, returns full content) */
export async function getPostBySlug(req, res, next) {
  try {
    const post = await Post.findOne({
      where: { slug: req.params.slug, status: 'published' },
    });
    if (!post) return res.status(404).json({ error: 'Post not found.' });

    // fire-and-forget view increment
    post.increment('views').catch(() => {});

    res.json({ data: post });
  } catch (err) {
    next(err);
  }
}

/** GET /api/posts/:slug/related  (up to 3 in same category) */
export async function getRelatedPosts(req, res, next) {
  try {
    const post = await Post.findOne({
      where: { slug: req.params.slug },
      attributes: ['id', 'category'],
    });
    if (!post) return res.json({ data: [] });

    const related = await Post.findAll({
      where: {
        status: 'published',
        category: post.category,
        id: { [Op.ne]: post.id },
      },
      attributes: PUBLIC_ATTRS,
      order: [['createdAt', 'DESC']],
      limit: 3,
    });

    res.json({ data: related });
  } catch (err) {
    next(err);
  }
}

/** GET /api/categories  (distinct categories with counts) */
export async function listCategories(req, res, next) {
  try {
    const rows = await Post.findAll({
      where: { status: 'published' },
      attributes: ['category', [fn('COUNT', col('id')), 'count']],
      group: ['category'],
      order: [[fn('COUNT', col('id')), 'DESC']],
      raw: true,
    });
    res.json({ data: rows.map((r) => ({ category: r.category, count: Number(r.count) })) });
  } catch (err) {
    next(err);
  }
}
