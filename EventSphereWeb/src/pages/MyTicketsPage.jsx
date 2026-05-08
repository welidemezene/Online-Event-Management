import { useNavigate } from 'react-router-dom';
import { useEvents } from '../context/EventContext';
import { useAuth } from '../context/AuthContext';
import './MyTicketsPage.css';

export default function MyTicketsPage() {
  const { events, bookings, cancelBooking } = useEvents();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="tickets-page">
        <div className="container">
          <div className="tickets-empty">
            <div className="empty-icon">🎟️</div>
            <h2>You&apos;re not logged in</h2>
            <p>Sign in to view your booked tickets.</p>
            <button onClick={() => navigate('/auth')} className="btn-go">Sign In →</button>
          </div>
        </div>
      </div>
    );
  }

  const myBookings = bookings.filter(b => b.userId === user.uid);

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    await cancelBooking(bookingId);
  };

  return (
    <div className="tickets-page">
      <div className="container">
        <div className="tickets-header">
          <h1 className="tickets-title">My Tickets</h1>
          <p className="tickets-subtitle">{myBookings.length} ticket{myBookings.length !== 1 ? 's' : ''} booked</p>
        </div>

        {myBookings.length === 0 ? (
          <div className="tickets-empty">
            <div className="empty-icon">🎟️</div>
            <h2>No tickets yet</h2>
            <p>Browse events and book your first ticket!</p>
            <button onClick={() => navigate('/events')} className="btn-go">Explore Events →</button>
          </div>
        ) : (
          <div className="tickets-grid">
            {myBookings.map(booking => {
              const event = events.find(e => e.eventId === booking.eventId);
              if (!event) return null;
              const isPast = new Date(event.date) < new Date();

              return (
                <div key={booking.bookingId} className={`ticket-card ${isPast ? 'past' : ''}`}>
                  {/* Ticket Header */}
                  <div className="ticket-header">
                    <span className="ticket-emoji">{event.emoji}</span>
                    <div className="ticket-status">
                      {booking.attended
                        ? <span className="status-badge attended">✓ Attended</span>
                        : isPast
                        ? <span className="status-badge past-badge">Past</span>
                        : <span className="status-badge upcoming">● Upcoming</span>
                      }
                    </div>
                  </div>

                  {/* Ticket Body */}
                  <div className="ticket-body">
                    <h3 className="ticket-event-title">{event.title}</h3>
                    <div className="ticket-details">
                      <div className="ticket-detail">
                        <span className="td-label">📅 Date</span>
                        <span className="td-value">{new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                      <div className="ticket-detail">
                        <span className="td-label">📍 Location</span>
                        <span className="td-value">{event.location}</span>
                      </div>
                      <div className="ticket-detail">
                        <span className="td-label">💰 Price Paid</span>
                        <span className="td-value" style={{ color: event.price === 0 ? '#10b981' : '#f9fafb', fontWeight: 700 }}>
                          {event.price === 0 ? 'FREE' : `ETB ${event.price}`}
                        </span>
                      </div>
                      <div className="ticket-detail">
                        <span className="td-label">🎫 Booking ID</span>
                        <span className="td-value td-mono">{booking.bookingId?.slice(-8).toUpperCase()}</span>
                      </div>
                    </div>
                  </div>

                  {/* QR Code Placeholder */}
                  <div className="ticket-qr-section">
                    <div className="qr-placeholder">
                      <div className="qr-grid">
                        {Array.from({ length: 25 }).map((_, i) => (
                          <div key={i} className="qr-cell" style={{ opacity: Math.random() > 0.5 ? 1 : 0 }} />
                        ))}
                      </div>
                    </div>
                    <div className="qr-info">
                      <p className="qr-label">Scan at entrance</p>
                      <p className="qr-id">{booking.bookingId?.slice(-8).toUpperCase()}</p>
                    </div>
                  </div>

                  {/* Ticket Footer */}
                  {!isPast && (
                    <div className="ticket-footer">
                      <button
                        className="ticket-view-btn"
                        onClick={() => navigate(`/events/${event.eventId}`)}
                      >
                        View Event
                      </button>
                      <button
                        className="ticket-cancel-btn"
                        onClick={() => handleCancel(booking.bookingId)}
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
