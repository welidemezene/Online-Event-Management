import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEvents } from '../context/EventContext';
import { useAuth } from '../context/AuthContext';
import './EventDetailPage.css';

const CATEGORY_CONFIG = {
  tech: { color: '#818cf8', bg: 'rgba(129,140,248,0.12)', label: '💻 Tech' },
  music: { color: '#f472b6', bg: 'rgba(244,114,182,0.12)', label: '🎵 Music' },
  sports: { color: '#34d399', bg: 'rgba(52,211,153,0.12)', label: '🏆 Sports' },
  art: { color: '#fb923c', bg: 'rgba(251,146,60,0.12)', label: '🎨 Art' },
  business: { color: '#facc15', bg: 'rgba(250,204,21,0.12)', label: '💼 Business' },
};

export default function EventDetailPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { events, bookings, bookEvent, comments, addComment } = useEvents();
  const { user } = useAuth();

  const [booking, setBooking] = useState(false);
  const [bookMsg, setBookMsg] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [posting, setPosting] = useState(false);

  const event = events.find(e => e.eventId === eventId);
  const myBooking = bookings.find(b => b.eventId === eventId && b.userId === user?.uid);
  const eventComments = comments[eventId] ? Object.values(comments[eventId]).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)) : [];

  if (!event) {
    return (
      <div className="detail-not-found">
        <div>Event not found. <button onClick={() => navigate('/events')}>Back to Events</button></div>
      </div>
    );
  }

  const cat = CATEGORY_CONFIG[event.category] || CATEGORY_CONFIG.tech;
  const percentFull = Math.min(100, Math.round((event.currentBookings / event.capacity) * 100));
  const isFull = percentFull >= 100;
  const daysLeft = Math.ceil((new Date(event.date) - Date.now()) / 86400000);

  const handleBook = async () => {
    if (!user) { navigate('/auth'); return; }
    setBooking(true);
    setBookMsg(null);
    try {
      await bookEvent(user.uid, eventId);
      setBookMsg({ type: 'success', text: '🎉 Booking confirmed! Check My Tickets.' });
    } catch (err) {
      setBookMsg({ type: 'error', text: err.message });
    } finally {
      setBooking(false);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;
    setPosting(true);
    try {
      await addComment(eventId, user.uid, user.name, newComment.trim());
      setNewComment('');
    } catch {
      // ignore
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="detail-page">
      <div className="container">
        <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>

        <div className="detail-layout">
          {/* Main Content */}
          <div className="detail-main">
            {/* Hero */}
            <div className="detail-hero" style={{ background: cat.bg }}>
              <span className="detail-emoji">{event.emoji}</span>
            </div>

            {/* Info */}
            <div className="detail-body">
              <div className="detail-meta-row">
                <span className="detail-badge" style={{ color: cat.color, background: cat.bg }}>{cat.label}</span>
                {isFull && <span className="detail-sold-out">🔴 SOLD OUT</span>}
                {daysLeft > 0 && daysLeft <= 7 && (
                  <span className="detail-soon">🔥 Only {daysLeft} days left!</span>
                )}
              </div>

              <h1 className="detail-title">{event.title}</h1>

              <div className="detail-info-grid">
                <div className="info-box">
                  <div className="info-icon">📅</div>
                  <div>
                    <div className="info-label">Date</div>
                    <div className="info-value">{new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
                  </div>
                </div>
                <div className="info-box">
                  <div className="info-icon">📍</div>
                  <div>
                    <div className="info-label">Location</div>
                    <div className="info-value">{event.location}</div>
                  </div>
                </div>
                <div className="info-box">
                  <div className="info-icon">👤</div>
                  <div>
                    <div className="info-label">Organizer</div>
                    <div className="info-value">{event.organizer || 'EventSphere'}</div>
                  </div>
                </div>
                <div className="info-box">
                  <div className="info-icon">💰</div>
                  <div>
                    <div className="info-label">Price</div>
                    <div className="info-value" style={{ color: event.price === 0 ? '#10b981' : '#f9fafb', fontWeight: 700 }}>
                      {event.price === 0 ? 'FREE' : `ETB ${event.price.toLocaleString()}`}
                    </div>
                  </div>
                </div>
              </div>

              {/* Capacity */}
              <div className="detail-section">
                <h2 className="section-h2">Capacity</h2>
                <div className="capacity-card">
                  <div className="capacity-row">
                    <span>{event.currentBookings} / {event.capacity} registered</span>
                    <span className="capacity-percent">{percentFull}%</span>
                  </div>
                  <div className="capacity-bar-bg">
                    <div className="capacity-bar-fill" style={{
                      width: `${percentFull}%`,
                      background: isFull ? '#ef4444' : percentFull > 80 ? '#f59e0b' : 'linear-gradient(90deg, #6366f1, #a855f7)'
                    }} />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="detail-section">
                <h2 className="section-h2">About This Event</h2>
                <p className="detail-description">{event.description}</p>
              </div>

              {/* Discussion */}
              <div className="detail-section">
                <h2 className="section-h2">Discussion ({eventComments.length})</h2>

                {user ? (
                  <form onSubmit={handleComment} className="comment-form">
                    <div className="comment-input-row">
                      <div className="comment-avatar">{user.name?.charAt(0).toUpperCase()}</div>
                      <input
                        className="comment-input"
                        placeholder="Ask a question or share your thoughts..."
                        value={newComment}
                        onChange={e => setNewComment(e.target.value)}
                      />
                      <button type="submit" className="comment-post-btn" disabled={posting || !newComment.trim()}>
                        {posting ? '...' : '→'}
                      </button>
                    </div>
                  </form>
                ) : (
                  <p className="login-to-comment">
                    <a href="/auth" style={{ color: 'var(--primary-light)' }}>Log in</a> to join the discussion.
                  </p>
                )}

                <div className="comments-list">
                  {eventComments.length === 0 ? (
                    <p className="no-comments">No comments yet. Be the first!</p>
                  ) : (
                    eventComments.map(c => (
                      <div key={c.id} className="comment-item">
                        <div className="comment-header">
                          <div className="comment-avatar-sm">{c.userName?.charAt(0).toUpperCase()}</div>
                          <span className="comment-author">{c.userName}</span>
                          <span className="comment-time">{new Date(c.timestamp).toLocaleDateString()}</span>
                        </div>
                        <p className="comment-text">{c.text}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Booking Card */}
          <div className="detail-sidebar">
            <div className="booking-card">
              <div className="booking-price">
                <span className="price-label">Price</span>
                <span className="price-value" style={{ color: event.price === 0 ? '#10b981' : '#f9fafb' }}>
                  {event.price === 0 ? 'FREE' : `ETB ${event.price.toLocaleString()}`}
                </span>
              </div>

              {bookMsg && (
                <div className={`book-msg ${bookMsg.type}`}>{bookMsg.text}</div>
              )}

              {myBooking ? (
                <button className="book-btn booked" onClick={() => navigate('/tickets')}>
                  ✓ View My Ticket
                </button>
              ) : isFull ? (
                <button className="book-btn disabled" disabled>Fully Booked</button>
              ) : (
                <button className="book-btn" onClick={handleBook} disabled={booking}>
                  {booking ? 'Booking...' : user ? '🎟️ Book Now' : '🔐 Login to Book'}
                </button>
              )}

              <div className="booking-meta">
                <div className="bm-item">📅 {new Date(event.date).toLocaleDateString()}</div>
                <div className="bm-item">📍 {event.location}</div>
                <div className="bm-item">👥 {event.capacity - event.currentBookings} spots left</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
