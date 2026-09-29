# Trendwire — Automated SEO Tech Blog

A full-stack blog website that writes, illustrates, and publishes its own articles every day —
automatically. No human writes a single word.

---

## What is this?

**Trendwire** is an automated content marketing system for the tech niche. Every morning at 9 AM:

1. The system scans what is trending in the tech world — AI models, programming languages, cybersecurity incidents, startup news
2. It picks a headline and writes a **900–1,100 word journalist-quality article** in the style of TechRadar or Gizmodo
3. It generates a **professional AI-featured image** for the article
4. It finds **real stock photos** from Wikipedia Commons and Pexels and embeds them in the article body
5. Everything is **published automatically** to the blog website

You keep the server running. Everything else is automatic.

---

## What can you say about this on Upwork?

### Short version (for portfolio / profile):

> Built a fully automated SEO blog platform using n8n, OpenAI GPT-4o-mini, and a custom full-stack app (React + Node.js + MySQL). The system discovers trending tech topics daily via Google News RSS, generates journalist-quality articles in TechRadar/Gizmodo style, creates AI-featured images (gpt-image-1), sources real inline photos from Wikipedia Commons and Pexels, and publishes everything automatically — zero manual effort. Running cost: ~$1–1.50/month in API fees.

### Long version (for proposals):

> I designed and built an end-to-end automated content pipeline for a tech-niche SEO blog:
>
> **Automation layer (n8n — 12-node workflow):**
> - Monitors 7 live Google News RSS feeds: AI, Software Development, Cybersecurity, Developer Tools, Cloud Computing, and Tech Industry
> - Selects a fresh trending headline daily
> - Uses OpenAI GPT-4o-mini to generate a 900–1,100 word SEO-optimized article in the style of TechRadar or Gizmodo — hook lede, expert quote, benchmarks, competitive angles
> - Generates a professional featured image via OpenAI gpt-image-1 (medium quality)
> - Sources 2 additional inline images from Wikipedia Commons (free, no key) and Pexels API (free tier)
> - Publishes everything to the blog via a secure token-authenticated REST API
>
> **Full-stack website:**
> - React 18 + Vite frontend — fully custom editorial "magazine" design (no templates)
> - Node.js + Express REST API
> - MySQL + Sequelize ORM with auto-migrating schema
> - SEO-ready: dynamic sitemap.xml, react-helmet-async meta tags, semantic HTML
> - Features: paginated article grid, category filtering, full-text search, reading progress bar, social sharing, author card, related posts

### Skills / keywords to list on Upwork:

`n8n Automation` · `AI Content Generation` · `OpenAI API` · `Full-Stack Development` · `React.js` · `Node.js` · `MySQL` · `Sequelize ORM` · `REST API Design` · `SEO Optimization` · `Workflow Automation` · `Content Marketing Automation` · `GPT Integration` · `RSS Feed Processing` · `Custom Web Design`

---

## Architecture

```
 n8n (Docker, localhost:5678)
 ├── Daily Trigger (09:00 AM)
 ├── Pick Trending Topic Feed       picks 1 of 7 tech categories, builds RSS URL
 ├── Fetch Trending Headlines       reads Google News RSS (free, no API key)
 ├── Select Top Headline            picks a fresh headline from top 6 results
 ├── Write SEO Article              gpt-4o-mini: 900-1100w journalist-style JSON article
 ├── Parse Article JSON             extracts all fields, handles API response shapes
 ├── Fetch Inline Images            Wikipedia Commons (free) + Pexels API (free tier)
 ├── Inject Images Into Content     replaces <!--INLINE_IMAGE_N--> markers with <figure> HTML
 ├── Generate Featured Image        gpt-image-1 (quality: medium), topic-specific image
 ├── Image To Base64                converts binary image to base64 for API transport
 └── Publish to Blog                POST /api/ingest/posts  (X-Ingest-Token auth)
          │
          ▼
 Blog API (localhost:5000)
 ├── Token auth middleware
 ├── Decode + save image to /uploads/
 └── Post.create() → MySQL → GET /api/posts → React (localhost:5173)
```

The workflow never touches the database directly — it only talks to the blog through the secured ingest endpoint.

---

## Topic Categories

| Category | What it tracks |
|----------|----------------|
| Artificial Intelligence | GPT, Claude, Gemini, LLM releases, AI benchmarks |
| AI Agents & Tools | Automation tools, OpenAI/Anthropic developer products |
| Software Development | Programming languages, frameworks, React/Python/Rust/TypeScript |
| Developer Tools | GitHub, VS Code, Docker, DevOps, CI/CD pipelines |
| Cybersecurity | Data breaches, zero-days, ransomware, vulnerabilities |
| Tech Industry | Startups, acquisitions, funding rounds, big tech news |
| Cloud & Infrastructure | AWS, Azure, GCP, serverless, Kubernetes, edge computing |

---

## Prerequisites

- **Node.js 18+**
- **MySQL** running locally — database `automated_seo_blog_db` must exist
- **n8n** running in Docker at `http://localhost:5678` with an **OpenAI credential** configured
- **OpenAI API key** (paid plan — gpt-4o-mini + gpt-image-1 access required)
- *(Optional)* **Pexels API key** — free at pexels.com/api — enables the second inline image per article

---

## Folder Layout

```
application/
  server/           Express + Sequelize API
    .env            gitignored — DB credentials + INGEST_TOKEN
    .env.example    template to copy from
    src/
    uploads/        saved images served at /uploads
  client/           React + Vite site
    .env            VITE_API_URL
    src/
docs/
  README.md         this file
prompts.txt         GPT prompt documentation
```

---

## Setup

### 1. Backend

```bash
cd application/server
cp .env.example .env          # edit DB_USER / DB_PASSWORD if needed
npm install
npm run seed                  # optional: 5 sample posts so the site is not empty
npm run dev                   # starts API at http://localhost:5000
```

**`.env` reference:**

| Key | Default | Purpose |
|-----|---------|---------|
| `PORT` | `5000` | API port |
| `DB_HOST` | `localhost` | MySQL host |
| `DB_PORT` | `3306` | MySQL port |
| `DB_NAME` | `automated_seo_blog_db` | Database name |
| `DB_USER` | `root` | MySQL user |
| `DB_PASSWORD` | *(empty)* | MySQL password |
| `CLIENT_URL` | `http://localhost:5173` | Allowed CORS origin |
| `INGEST_TOKEN` | *(set a secret value)* | Shared secret — must match the n8n "Publish to Blog" node header |

Sequelize creates the `posts` table automatically on first start.

**API endpoints:**

| Method | Route | Purpose |
|--------|-------|---------|
| GET | `/api/posts?page&limit&category&q` | Paginated list, category filter, full-text search |
| GET | `/api/posts/:slug` | Single post (increments view count) |
| GET | `/api/posts/:slug/related` | Up to 3 related posts in same category |
| GET | `/api/categories` | All categories with post counts |
| GET | `/sitemap.xml` | SEO sitemap, dynamically generated from DB |
| POST | `/api/ingest/posts` | **Protected** — n8n publishes here |

### 2. Frontend

```bash
cd application/client
cp .env.example .env          # VITE_API_URL=http://localhost:5000/api
npm install
npm run dev                   # opens http://localhost:5173
```

### 3. n8n Workflow

Open **http://localhost:5678/workflow/A3LPUlPO2j2vY3En**

**One-time checks before first run:**
- Both OpenAI nodes should auto-select your existing OpenAI credential
- `X-Ingest-Token` in the **Publish to Blog** node must equal `INGEST_TOKEN` in `server/.env`
- The blog API must be running before the workflow executes
- If n8n runs **natively** (not Docker): change the Publish URL from `host.docker.internal:5000` to `localhost:5000`
- **Pexels inline images (optional):** Open the **Fetch Inline Images** Code node, replace `'YOUR_PEXELS_API_KEY'` with your free key from pexels.com/api. Wikipedia Commons images work immediately with no key.

**Run:**
- **Manual test:** Click **Execute Workflow** (⚡) in n8n
- **Daily automatic:** Toggle the workflow **Active** (top-right switch)

---

## Cost

| Item | Model / Source | Per run | Per month (1/day) |
|------|---------------|---------|-------------------|
| Article text | `gpt-4o-mini` | ~$0.002 | ~$0.06 |
| Featured image | `gpt-image-1` quality: medium | ~$0.03–0.05 | ~$0.90–1.50 |
| Inline image 1 | Wikipedia Commons | Free | Free |
| Inline image 2 | Pexels API (free tier) | Free | Free |
| **Total** | | **~$0.03–0.05** | **~$1.00–1.60** |

To lower cost: set image quality to `low` in the Generate Featured Image node (~$0.01/run).

---

## Troubleshooting

| Symptom | Cause | Fix |
|---------|-------|-----|
| "service refused the connection" in Publish to Blog | API not running or wrong host | Start `npm run dev` in server/; use `host.docker.internal` for Docker n8n, `localhost` for native |
| `401 Unauthorized` from ingest | Token mismatch | `X-Ingest-Token` in n8n must equal `INGEST_TOKEN` in `server/.env` |
| `Unknown parameter: response_format` on image node | Wrong image model selected | Keep model as `gpt-image-1` — DALL-E models trigger this bug |
| "No JSON found in model output" | GPT returned non-JSON | Re-run the workflow; check OpenAI API quota |
| No posts on the site | Empty database | Run `npm run seed` or execute the workflow once |
| Inline images not appearing | Pexels key not configured | Replace `YOUR_PEXELS_API_KEY` in Fetch Inline Images node; Wikipedia images still work without it |
