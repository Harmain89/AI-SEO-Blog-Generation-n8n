/**
 * Guards the ingest endpoint. The n8n workflow must send the shared
 * secret in the `X-Ingest-Token` header, matching INGEST_TOKEN in .env.
 */
export function requireIngestToken(req, res, next) {
  const expected = process.env.INGEST_TOKEN;
  const provided = req.get('X-Ingest-Token') || req.get('x-ingest-token');

  if (!expected) {
    return res.status(500).json({ error: 'Server misconfigured: INGEST_TOKEN is not set.' });
  }
  if (!provided || provided !== expected) {
    return res.status(401).json({ error: 'Unauthorized: invalid or missing ingest token.' });
  }
  return next();
}
