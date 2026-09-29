import dotenv from 'dotenv';
import { connectDatabase } from '../config/database.js';
import { sequelize, Post } from '../models/index.js';
import { slugify } from '../utils/slugify.js';
import { readingTime } from '../utils/readingTime.js';

dotenv.config();

/**
 * A handful of realistic sample articles so the site looks alive before the
 * n8n workflow starts publishing. Images use Unsplash source URLs (external)
 * so no local files are needed for the seed.
 */
const SAMPLES = [
  {
    title: 'The Quiet Revolution: How On-Device AI Is Reshaping Everyday Apps',
    category: 'Technology',
    author: 'SEO Desk',
    imageAlt: 'A smartphone glowing with abstract neural network lines',
    featuredImage:
      'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1200&q=80',
    metaDescription:
      'On-device AI is moving intelligence from the cloud to your pocket. Here is what that shift means for privacy, speed, and the apps you use every day.',
    tags: ['AI', 'Mobile', 'Privacy', 'Machine Learning'],
    excerpt:
      'Intelligence is quietly moving from distant data centers into the palm of your hand — and it changes everything about speed and privacy.',
    content: `<p>For a decade, "AI" meant sending your data to a server farm and waiting for an answer. That model is fading. A new generation of compact models now runs directly on phones, laptops, and even earbuds.</p>
<h2>Why on-device matters</h2>
<p>Running models locally means your data never leaves the device. That is a profound privacy win, and it also removes the network round-trip that made older assistants feel sluggish.</p>
<h3>Speed you can feel</h3>
<p>Autocomplete, live translation, and photo editing now respond instantly because there is no cloud in the loop. Latency drops from hundreds of milliseconds to near zero.</p>
<h2>What comes next</h2>
<p>Expect app developers to lean into features that were impractical before: fully offline assistants, private journaling tools, and cameras that understand a scene as you frame it.</p>`,
  },
  {
    title: 'Why Small Businesses Are Winning the Cloud Cost War in 2026',
    category: 'IT',
    author: 'SEO Desk',
    imageAlt: 'Server racks bathed in blue light inside a modern data center',
    featuredImage:
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
    metaDescription:
      'Cloud bills used to punish small teams. New pricing models and smarter tooling are flipping the script in 2026.',
    tags: ['Cloud', 'DevOps', 'Cost Optimization', 'SMB'],
    excerpt:
      'For years the cloud rewarded scale. In 2026, lean teams are quietly outmaneuvering giants on cost per feature.',
    content: `<p>Cloud spending has long been a source of dread for small IT teams. Runaway bills and confusing invoices were the norm. That is changing fast.</p>
<h2>The tooling caught up</h2>
<p>Cost-observability platforms now flag idle resources automatically, and serverless pricing means teams pay only for the milliseconds they actually use.</p>
<h3>Practical wins</h3>
<p>Right-sizing databases, adopting spot capacity for batch jobs, and setting hard budget alerts routinely cut bills by a third — without touching product velocity.</p>
<h2>The takeaway</h2>
<p>Discipline, not scale, is the new advantage. A five-person team with good habits can now run leaner than an enterprise on autopilot.</p>`,
  },
  {
    title: 'Streaming Wars 2.0: The Bundle Is Back, and It Is Smarter',
    category: 'Entertainment',
    author: 'SEO Desk',
    imageAlt: 'A cozy living room with a large TV showing a streaming menu',
    featuredImage:
      'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?auto=format&fit=crop&w=1200&q=80',
    metaDescription:
      'After years of fragmentation, streaming services are bundling again — but the 2026 version is built on data, not guesswork.',
    tags: ['Streaming', 'Media', 'Entertainment', 'Subscriptions'],
    excerpt:
      'The cable bundle we all fled is returning in streaming form — only this time the algorithms decide what belongs together.',
    content: `<p>Remember cutting the cord to escape bloated cable bundles? The industry has come full circle, and the reunion is surprisingly clever.</p>
<h2>Bundles, reimagined</h2>
<p>Instead of forcing 200 channels on everyone, platforms now assemble personalized bundles around what households actually watch — sports, kids' content, or prestige drama.</p>
<h3>Why now</h3>
<p>Subscriber churn became unsustainable. Bundling reduces cancellations and gives smaller services a lifeline through partnerships.</p>
<h2>What viewers gain</h2>
<p>Lower combined prices and a single interface. The trade-off is more data sharing — the currency that powers these tailored packages.</p>`,
  },
  {
    title: 'The Underdog Playbook: How Data Turned a Mid-Table Club Into Contenders',
    category: 'Sports',
    author: 'SEO Desk',
    imageAlt: 'A football stadium at night with floodlights and a full crowd',
    featuredImage:
      'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=1200&q=80',
    metaDescription:
      'Analytics are no longer a novelty in sport. One club shows how disciplined data work can beat a bigger budget.',
    tags: ['Sports', 'Analytics', 'Football', 'Strategy'],
    excerpt:
      'Money still talks in sport — but a smart data department is proving it can shout louder than a transfer budget.',
    content: `<p>Big budgets buy stars. But a growing number of clubs are proving that disciplined analytics can close the gap with the giants.</p>
<h2>Finding value others miss</h2>
<p>By modeling under-scouted leagues, the recruitment team signed undervalued players whose numbers screamed potential long before the highlight reels caught up.</p>
<h3>Coaching with numbers</h3>
<p>Set-piece routines, pressing triggers, and substitution timing are now shaped by match data, squeezing extra points from tight games.</p>
<h2>The lesson</h2>
<p>You cannot always outspend rivals, but you can out-think them. Information, applied consistently, is the great equalizer.</p>`,
  },
  {
    title: 'Green by Design: The Startups Making Manufacturing Carbon-Negative',
    category: 'Business',
    author: 'SEO Desk',
    imageAlt: 'A modern factory with solar panels and green rooftops',
    featuredImage:
      'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=1200&q=80',
    metaDescription:
      'A wave of startups is proving that factories can remove more carbon than they emit — and still turn a profit.',
    tags: ['Business', 'Sustainability', 'Manufacturing', 'Climate'],
    excerpt:
      'Carbon-negative is no longer a marketing slogan. A cohort of startups is baking it into how factories are built.',
    content: `<p>"Carbon neutral" was yesterday's ambition. A bold group of manufacturers now aims to pull more carbon out of the air than they put in.</p>
<h2>Rethinking the inputs</h2>
<p>By swapping traditional cement and steel for captured-carbon composites, these firms turn their supply chain into a carbon sink.</p>
<h3>The business case</h3>
<p>Carbon credits, premium pricing, and resilient supply chains make the green route profitable, not just principled.</p>
<h2>Scaling the model</h2>
<p>The challenge now is volume. Early adopters are licensing their processes so the approach can spread across the industry.</p>`,
  },
];

async function run() {
  try {
    await connectDatabase();
    await sequelize.sync({ alter: true });

    for (const s of SAMPLES) {
      const slug = slugify(s.title);
      const [post, created] = await Post.findOrCreate({
        where: { slug },
        defaults: {
          ...s,
          slug,
          metaKeywords: s.tags.join(', '),
          readingTime: readingTime(s.content),
          status: 'published',
        },
      });
      console.log(created ? `+ created: ${post.title}` : `= exists:  ${post.title}`);
    }

    console.log('✓ Seed complete');
    process.exit(0);
  } catch (err) {
    console.error('✗ Seed failed:', err.message);
    process.exit(1);
  }
}

run();
