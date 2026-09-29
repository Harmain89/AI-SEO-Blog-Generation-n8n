/**
 * Estimate reading time (in whole minutes) from HTML/markdown content.
 * Assumes ~200 words per minute; minimum of 1.
 */
export function readingTime(content = '') {
  const text = String(content).replace(/<[^>]*>/g, ' '); // strip tags
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
