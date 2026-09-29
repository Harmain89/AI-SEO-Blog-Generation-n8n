import { useState } from 'react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    if (email.trim()) setDone(true);
  };

  return (
    <section className="container">
      <div className="band">
        <div>
          <span className="eyebrow">Stay in the loop</span>
          <h2>The day’s best stories, delivered fresh.</h2>
          <p>One concise email. New trends across tech, business and culture — no noise.</p>
        </div>
        {done ? (
          <p style={{ color: 'var(--gold)', fontWeight: 600, margin: 0 }}>
            ✓ You’re subscribed. Watch your inbox!
          </p>
        ) : (
          <form className="band-form" onSubmit={submit}>
            <input
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-label="Email address"
            />
            <button type="submit" className="btn btn-primary">Subscribe</button>
          </form>
        )}
      </div>
    </section>
  );
}
