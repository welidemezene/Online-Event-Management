import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useEvents } from '../context/EventContext';
import { useAuth } from '../context/AuthContext';
import EventCard from '../components/EventCard';
import './HomePage.css';

const CATEGORIES = [
  { key: 'tech',     label: '💻 Tech',     color: '#818cf8' },
  { key: 'music',    label: '🎵 Music',    color: '#f472b6' },
  { key: 'sports',   label: '🏆 Sports',   color: '#34d399' },
  { key: 'art',      label: '🎨 Art',      color: '#fb923c' },
  { key: 'business', label: '💼 Business', color: '#facc15' },
];

const HOW_IT_WORKS = [
  { step: '01', icon: '🔍', title: 'Browse Events', desc: 'Explore hundreds of curated tech, music, sports, and business events happening across Addis Ababa.' },
  { step: '02', icon: '🎟️', title: 'Book a Ticket', desc: 'Reserve your spot in seconds. Free events are instant — paid events go through our secure checkout.' },
  { step: '03', icon: '✅', title: 'Attend & Enjoy', desc: 'Show your QR code at the entrance, get checked in, and enjoy the experience!' },
];

export default function HomePage() {
  const { events, loading, bookEvent } = useEvents();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterDone, setNewsletterDone] = useState(false);

  const upcoming = events
    .filter(e => new Date(e.date) > new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const featured = upcoming[0];
  const rest = upcoming.slice(1, 7);

  const stats = [
    { value: `${events.length}+`,  label: 'Events Listed' },
    { value: `${events.reduce((s, e) => s + e.currentBookings, 0)}+`, label: 'Tickets Booked' },
    { value: '5',    label: 'Categories' },
    { value: '100%', label: 'Real-time Sync' },
  ];

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (newsletterEmail) setNewsletterDone(true);
  };

  return (
    <div className="home-page">

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-orbs">
          <div className="orb orb-1" />
          <div className="orb orb-2" />
          <div className="orb orb-3" />
        </div>
        <div className="container hero-content">
          <div className="hero-badge animate-fade-up">
            <span className="badge-dot" />
            🚀 Now Live — EventSphere Web Platform
          </div>

          <h1 className="hero-title animate-fade-up" style={{ animationDelay: '0.1s' }}>
            Discover &amp; Book<br />
            <span className="gradient-text">Amazing Events</span>
          </h1>

          <p className="hero-subtitle animate-fade-up" style={{ animationDelay: '0.2s' }}>
            The premier event management platform for Addis Ababa. Browse tech conferences,
            music festivals, sports championships, art exhibitions, and more — all in one place.
          </p>

          <div className="hero-actions animate-fade-up" style={{ animationDelay: '0.3s' }}>
            <Link to="/events" className="hero-btn-primary">
              Explore Events →
            </Link>
            {!user ? (
              <Link to="/auth" className="hero-btn-secondary">
                Create Free Account
              </Link>
            ) : (
              <Link to="/tickets" className="hero-btn-secondary">
                My Tickets 🎟️
              </Link>
            )}
          </div>

          <div className="hero-stats animate-fade-up" style={{ animationDelay: '0.4s' }}>
            {stats.map((s, i) => (
              <div key={i} className="stat-item">
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED EVENT ── */}
      {!loading && featured && (
        <section className="section featured-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">🔥 Featured Event</h2>
              <span className="featured-badge">Happening Soon</span>
            </div>
            <div className="featured-card" onClick={() => navigate(`/events/${featured.eventId}`)}>
              <div className="featured-emoji-col">
                <span className="featured-emoji">{featured.emoji}</span>
              </div>
              <div className="featured-info">
                <div className="featured-category" style={{
                  background: 'rgba(99,102,241,0.12)',
                  color: 'var(--primary-light)'
                }}>
                  {CATEGORIES.find(c => c.key === featured.category)?.label || '🎉 Event'}
                </div>
                <h3 className="featured-title">{featured.title}</h3>
                <p className="featured-desc">{featured.description}</p>
                <div className="featured-meta-row">
                  <span className="featured-meta-item">📅 {new Date(featured.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
                  <span className="featured-meta-item">📍 {featured.location}</span>
                  <span className="featured-meta-item">👥 {featured.currentBookings}/{featured.capacity} booked</span>
                </div>
                <div className="featured-footer">
                  <span className="featured-price" style={{ color: featured.price === 0 ? '#10b981' : '#f1f5f9' }}>
                    {featured.price === 0 ? 'FREE' : `ETB ${featured.price.toLocaleString()}`}
                  </span>
                  <button className="featured-btn">View Event →</button>
                </div>
              </div>
              <div className="featured-countdown-col">
                <CountdownWidget date={featured.date} />
                <div className="featured-spots">
                  <div className="spots-bar-bg">
                    <div
                      className="spots-bar-fill"
                      style={{ width: `${Math.min(100, Math.round((featured.currentBookings / featured.capacity) * 100))}%` }}
                    />
                  </div>
                  <span className="spots-text">
                    {featured.capacity - featured.currentBookings} spots remaining
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── CATEGORIES ── */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Browse by Category</h2>
          </div>
          <div className="categories-grid">
            {CATEGORIES.map(cat => (
              <Link key={cat.key} to={`/events?category=${cat.key}`} className="category-card" style={{ '--cat-color': cat.color }}>
                <span className="category-card-label">{cat.label}</span>
                <span className="category-card-arrow">→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── UPCOMING EVENTS ── */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Upcoming Events</h2>
            <Link to="/events" className="see-all">View all events →</Link>
          </div>

          {loading ? (
            <div className="events-grid">
              {[...Array(6)].map((_, i) => <div key={i} className="skeleton" style={{ height: '360px' }} />)}
            </div>
          ) : rest.length === 0 && !featured ? (
            <div className="empty-state">
              <div style={{ fontSize: 56 }}>🎉</div>
              <h3>No events yet</h3>
              <p>Check back soon — new events are added regularly!</p>
            </div>
          ) : (
            <div className="events-grid">
              {(rest.length > 0 ? rest : upcoming).map(event => (
                <EventCard key={event.eventId} event={event} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="section how-section">
        <div className="container">
          <div className="section-header centered">
            <h2 className="section-title">How It Works</h2>
            <p className="section-subtitle">Get started in 3 simple steps</p>
          </div>
          <div className="how-grid">
            {HOW_IT_WORKS.map((step, i) => (
              <div key={i} className="how-card">
                <div className="how-step-num">{step.step}</div>
                <div className="how-icon">{step.icon}</div>
                <h3 className="how-title">{step.title}</h3>
                <p className="how-desc">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA / NEWSLETTER ── */}
      {!user && (
        <section className="section">
          <div className="container">
            <div className="cta-banner">
              <div className="cta-orb" />
              <div className="cta-content">
                <h2 className="cta-title">Ready to join EventSphere?</h2>
                <p className="cta-subtitle">
                  Create a free account to book tickets, track your events, and get real-time updates straight to your inbox.
                </p>
                {newsletterDone ? (
                  <div className="newsletter-success">
                    ✅ You&apos;re subscribed! We&apos;ll keep you updated.
                  </div>
                ) : (
                  <form className="cta-form" onSubmit={handleNewsletter}>
                    <input
                      type="email"
                      className="cta-input"
                      placeholder="Enter your email address"
                      value={newsletterEmail}
                      onChange={e => setNewsletterEmail(e.target.value)}
                    />
                    <button type="submit" className="cta-submit">Get Started Free →</button>
                  </form>
                )}
                <Link to="/auth" className="cta-link">Or sign up now →</Link>
              </div>
              <div className="cta-deco">🌐</div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

function CountdownWidget({ date }) {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(date));

  useState(() => {
    const timer = setInterval(() => setTimeLeft(getTimeLeft(date)), 1000);
    return () => clearInterval(timer);
  }, [date]);

  function getTimeLeft(date) {
    const diff = new Date(date) - Date.now();
    if (diff <= 0) return null;
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    return { d, h, m, s };
  }

  if (!timeLeft) return null;

  return (
    <div className="countdown">
      <p className="countdown-label">Event starts in</p>
      <div className="countdown-grid">
        {[['d', 'Days'], ['h', 'Hrs'], ['m', 'Min'], ['s', 'Sec']].map(([k, lbl]) => (
          <div key={k} className="countdown-unit">
            <span className="countdown-num">{String(timeLeft[k]).padStart(2, '0')}</span>
            <span className="countdown-lbl">{lbl}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
