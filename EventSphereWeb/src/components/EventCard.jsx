import { Link } from 'react-router-dom';
import './EventCard.css';

const CATEGORY_CONFIG = {
  tech: { color: '#818cf8', bg: 'rgba(129,140,248,0.12)', label: '💻 Tech' },
  music: { color: '#f472b6', bg: 'rgba(244,114,182,0.12)', label: '🎵 Music' },
  sports: { color: '#34d399', bg: 'rgba(52,211,153,0.12)', label: '🏆 Sports' },
  art: { color: '#fb923c', bg: 'rgba(251,146,60,0.12)', label: '🎨 Art' },
  business: { color: '#facc15', bg: 'rgba(250,204,21,0.12)', label: '💼 Business' },
  food: { color: '#a78bfa', bg: 'rgba(167,139,250,0.12)', label: '🍽️ Food' },
};

export default function EventCard({ event }) {
  const cat = CATEGORY_CONFIG[event.category] || CATEGORY_CONFIG.tech;
  const percentFull = Math.min(100, Math.round((event.currentBookings / event.capacity) * 100));
  const isFull = percentFull >= 100;
  const daysLeft = Math.ceil((new Date(event.date) - Date.now()) / 86400000);

  return (
    <Link to={`/events/${event.eventId}`} className="event-card" style={{ textDecoration: 'none' }}>
      <div className="event-card-header" style={{ background: cat.bg }}>
        <span className="event-emoji">{event.emoji}</span>
        <span className="event-badge" style={{ color: cat.color, background: cat.bg }}>
          {cat.label}
        </span>
        {isFull && <span className="sold-out-badge">SOLD OUT</span>}
        {daysLeft <= 7 && !isFull && (
          <span className="soon-badge">🔥 {daysLeft}d left</span>
        )}
      </div>

      <div className="event-card-body">
        <h3 className="event-title">{event.title}</h3>

        <div className="event-meta">
          <span className="meta-item">
            📅 {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
          <span className="meta-item">
            📍 {event.location}
          </span>
        </div>

        <div className="event-capacity">
          <div className="capacity-bar-bg">
            <div
              className="capacity-bar-fill"
              style={{
                width: `${percentFull}%`,
                background: isFull ? '#ef4444' : percentFull > 80 ? '#f59e0b' : 'linear-gradient(90deg, #6366f1, #a855f7)'
              }}
            />
          </div>
          <span className="capacity-text">{event.currentBookings}/{event.capacity} registered</span>
        </div>

        <div className="event-footer">
          <span className="event-price" style={{ color: event.price === 0 ? '#10b981' : '#f9fafb' }}>
            {event.price === 0 ? 'FREE' : `ETB ${event.price.toLocaleString()}`}
          </span>
          <span className="event-cta">View Details →</span>
        </div>
      </div>
    </Link>
  );
}
