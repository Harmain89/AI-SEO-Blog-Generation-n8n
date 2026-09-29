/**
 * Convert a title into a URL-safe slug.
 *   "Apple's New M5 Chip!" -> "apples-new-m5-chip"
 */
export function slugify(text = '') {
  return String(text)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/\p{Diacritic}/gu, '')   // strip accents
    .replace(/[^a-z0-9\s-]/g, '')     // drop non-alphanumerics
    .trim()
    .replace(/[\s_]+/g, '-')          // spaces -> dashes
    .replace(/-+/g, '-')              // collapse dashes
    .replace(/^-|-$/g, '')            // trim leading/trailing dashes
    .slice(0, 80);
}

/**
 * Ensure the slug is unique in the table. If it already exists,
 * append a short numeric suffix: my-post -> my-post-2 -> my-post-3
 */
export async function uniqueSlug(Model, base) {
  const slug = slugify(base) || `post-${Date.now()}`;
  let candidate = slug;
  let n = 1;
  // eslint-disable-next-line no-await-in-loop
  while (await Model.findOne({ where: { slug: candidate }, attributes: ['id'] })) {
    n += 1;
    candidate = `${slug}-${n}`;
  }
  return candidate;
}
