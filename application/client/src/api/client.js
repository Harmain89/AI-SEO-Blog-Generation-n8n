import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const ASSET_URL = import.meta.env.VITE_ASSET_URL || 'http://localhost:5000';

export const api = axios.create({ baseURL: API_URL, timeout: 15000 });

/** Resolve an image path from the API (/uploads/..) or pass through absolute URLs. */
export function resolveImage(src) {
  if (!src) return null;
  if (/^https?:\/\//i.test(src)) return src;
  return `${ASSET_URL}${src.startsWith('/') ? '' : '/'}${src}`;
}

export async function fetchPosts(params = {}) {
  const { data } = await api.get('/posts', { params });
  return data;
}

export async function fetchPost(slug) {
  const { data } = await api.get(`/posts/${slug}`);
  return data.data;
}

export async function fetchRelated(slug) {
  const { data } = await api.get(`/posts/${slug}/related`);
  return data.data;
}

export async function fetchCategories() {
  const { data } = await api.get('/categories');
  return data.data;
}
