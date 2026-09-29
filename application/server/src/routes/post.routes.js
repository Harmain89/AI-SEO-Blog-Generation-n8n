import { Router } from 'express';
import {
  listPosts,
  getPostBySlug,
  getRelatedPosts,
  listCategories,
} from '../controllers/post.controller.js';

const router = Router();

router.get('/categories', listCategories);
router.get('/posts', listPosts);
router.get('/posts/:slug', getPostBySlug);
router.get('/posts/:slug/related', getRelatedPosts);

export default router;
