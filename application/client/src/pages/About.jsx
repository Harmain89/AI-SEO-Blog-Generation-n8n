import Seo from '../components/Seo.jsx';

export default function About() {
  return (
    <>
      <Seo title="About" description="How Trendwire’s automated editorial pipeline works." />
      <div className="page-head container">
        <span className="eyebrow">About</span>
        <h1>An editorial desk that never sleeps.</h1>
      </div>
      <div className="prose container" style={{ marginTop: 24 }}>
        <p>
          <strong>Trendwire</strong> is a living publication. Every day, an automated pipeline scans
          what the world is talking about across technology, IT, entertainment, sports and business,
          then researches, writes and illustrates original stories around those trends.
        </p>
        <h2>How it works</h2>
        <p>
          A scheduled <strong>n8n</strong> workflow gathers trending headlines from public news
          feeds, hands the most relevant one to an AI writer that produces an original,
          SEO-structured article, and generates a bespoke featured image to match. The finished
          piece is delivered securely to this site’s API and published automatically.
        </p>
        <h2>Why it’s different</h2>
        <p>
          No stock templates, no filler. Each article is written fresh around a genuine, current
          trend — with clean structure, useful context, and a human-friendly reading experience.
        </p>
        <blockquote>Information, applied consistently, is the great equalizer.</blockquote>
        <p>
          Trendwire is a demonstration of how automation and AI can run a real, continuously updated
          content operation end to end.
        </p>
      </div>
    </>
  );
}
