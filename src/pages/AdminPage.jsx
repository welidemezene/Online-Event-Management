import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEvents } from '../context/EventContext';
import { useAuth } from '../context/AuthContext';
import './AdminPage.css';

const CATEGORIES = ['tech', 'music', 'sports', 'art', 'business', 'food'];
const EMOJIS = { tech: '💻', music: '🎵', sports: '🏆', art: '🎨', business: '💼', food: '🍽️' };

const EMPTY_FORM = { title: '', category: 'tech', description: '', date: '', location: '', price: '', capacity: '', organizer: '' };

export default function AdminPage() {
  const { events, bookings, addEvent, deleteEvent } = useEvents();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);
  const [activeTab, setActiveTab] = useState('events');
  const [deletingId, setDeletingId] = useState(null);

  const isAdmin = user?.role === 'admin' || user?.email?.toLowerCase() === 'admin@eventsphere.com';

  if (!user || !isAdmin) {
    return (
      <div className="admin-page">
        <div className="container">
          <div className="admin-denied">
            <div>🔒</div>
            <h2>Access Denied</h2>
            <p>This page is only for administrators.</p>
            <button onClick={() => navigate('/')}>Go Home</button>
          </div>
        </div>
      </div>
    );
  }

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.date || !form.location || !form.capacity) {
      setMsg({ type: 'error', text: 'Please fill in all required fields.' });
      return;
    }
    setSaving(true);
    setMsg(null);
    try {
      await addEvent({
        ...form,
        price: Number(form.price) || 0,
        capacity: Number(form.capacity),
        emoji: EMOJIS[form.category] || '🎉',
      });
      setForm(EMPTY_FORM);
      setMsg({ type: 'success', text: '✅ Event created successfully!' });
      setActiveTab('events');
    } catch (err) {
      setMsg({ type: 'error', text: err.message });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (eventId) => {
    if (!window.confirm('Delete this event? This cannot be undone.')) return;
    setDeletingId(eventId);
    await deleteEvent(eventId);
    setDeletingId(null);
  };

  // Stats
  const totalRevenue = bookings.reduce((sum, b) => {
    const ev = events.find(e => e.eventId === b.eventId);
    return sum + (ev?.price || 0);
  }, 0);

  const stats = [
    { label: 'Total Events', value: events.length, icon: '📅' },
    { label: 'Total Bookings', value: bookings.length, icon: '🎟️' },
    { label: 'Revenue (ETB)', value: totalRevenue.toLocaleString(), icon: '💰' },
    { label: 'Capacity Used', value: `${events.reduce((s, e) => s + e.currentBookings, 0)} / ${events.reduce((s, e) => s + e.capacity, 0)}`, icon: '👥' },
  ];

  return (
    <div className="admin-page">
      <div className="container">
        <div className="admin-header">
          <div>
            <h1 className="admin-title">Admin Dashboard</h1>
            <p className="admin-subtitle">Welcome back, {user.name} ⚙️</p>
          </div>
        </div>

        {/* Stats */}
        <div className="admin-stats">
          {stats.map((s, i) => (
            <div key={i} className="admin-stat-card">
              <div className="stat-icon">{s.icon}</div>
              <div className="stat-val">{s.value}</div>
              <div className="stat-lbl">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="admin-tabs">
          <button className={`admin-tab ${activeTab === 'events' ? 'active' : ''}`} onClick={() => setActiveTab('events')}>
            📅 Manage Events
          </button>
          <button className={`admin-tab ${activeTab === 'add' ? 'active' : ''}`} onClick={() => setActiveTab('add')}>
            ➕ Add New Event
          </button>
          <button className={`admin-tab ${activeTab === 'bookings' ? 'active' : ''}`} onClick={() => setActiveTab('bookings')}>
            🎟️ Bookings
          </button>
        </div>

        {msg && (
          <div className={`admin-msg ${msg.type}`}>{msg.text}</div>
        )}

        {/* Manage Events */}
        {activeTab === 'events' && (
          <div className="events-table-wrapper">
            <table className="events-table">
              <thead>
                <tr>
                  <th>Event</th>
                  <th>Date</th>
                  <th>Price</th>
                  <th>Bookings</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.length === 0 ? (
                  <tr><td colSpan={6} className="table-empty">No events yet. Add your first event!</td></tr>
                ) : events.map(event => {
                  const isPast = new Date(event.date) < new Date();
                  const isFull = event.currentBookings >= event.capacity;
                  return (
                    <tr key={event.eventId}>
                      <td className="event-name-cell">
                        <span className="event-emoji-sm">{event.emoji}</span>
                        <div>
                          <div className="event-name">{event.title}</div>
                          <div className="event-location">{event.location}</div>
                        </div>
                      </td>
                      <td className="date-cell">{new Date(event.date).toLocaleDateString()}</td>
                      <td>{event.price === 0 ? <span className="free-label">FREE</span> : `ETB ${event.price}`}</td>
                      <td>{event.currentBookings} / {event.capacity}</td>
                      <td>
                        {isPast
                          ? <span className="status-pill past">Past</span>
                          : isFull
                          ? <span className="status-pill full">Full</span>
                          : <span className="status-pill live">Live</span>
                        }
                      </td>
                      <td>
                        <button
                          className="delete-btn"
                          onClick={() => handleDelete(event.eventId)}
                          disabled={deletingId === event.eventId}
                        >
                          {deletingId === event.eventId ? '...' : 'Delete'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Add Event Form */}
        {activeTab === 'add' && (
          <form className="add-event-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Event Title *</label>
                <input name="title" placeholder="e.g. Tech Conference 2026" value={form.title} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select name="category" value={form.category} onChange={handleChange}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{EMOJIS[c]} {c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea name="description" placeholder="Describe your event..." rows={4} value={form.description} onChange={handleChange} />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Date & Time *</label>
                <input name="date" type="datetime-local" value={form.date} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Location *</label>
                <input name="location" placeholder="e.g. Silicon Hall, Addis Ababa" value={form.location} onChange={handleChange} />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Price (ETB) — leave 0 for FREE</label>
                <input name="price" type="number" min="0" placeholder="0" value={form.price} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Capacity *</label>
                <input name="capacity" type="number" min="1" placeholder="e.g. 200" value={form.capacity} onChange={handleChange} />
              </div>
            </div>

            <div className="form-group">
              <label>Organizer Name</label>
              <input name="organizer" placeholder="e.g. TechEthiopia" value={form.organizer} onChange={handleChange} />
            </div>

            <button type="submit" className="submit-event-btn" disabled={saving}>
              {saving ? 'Creating Event...' : '🚀 Create Event'}
            </button>
          </form>
        )}

        {/* Bookings */}
        {activeTab === 'bookings' && (
          <div className="events-table-wrapper">
            <table className="events-table">
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Event</th>
                  <th>User ID</th>
                  <th>Date</th>
                  <th>Price Paid</th>
                  <th>Attended</th>
                </tr>
              </thead>
              <tbody>
                {bookings.length === 0 ? (
                  <tr><td colSpan={6} className="table-empty">No bookings yet.</td></tr>
                ) : bookings.map(b => {
                  const event = events.find(e => e.eventId === b.eventId);
                  return (
                    <tr key={b.bookingId}>
                      <td className="td-mono">{b.bookingId?.slice(-8).toUpperCase()}</td>
                      <td>{event ? `${event.emoji} ${event.title}` : 'Unknown Event'}</td>
                      <td className="td-mono" style={{ fontSize: 11 }}>{b.userId?.slice(0, 12)}...</td>
                      <td>{new Date(b.timestamp).toLocaleDateString()}</td>
                      <td>{event?.price === 0 ? <span className="free-label">FREE</span> : `ETB ${event?.price || 0}`}</td>
                      <td>
                        <span className={`status-pill ${b.attended ? 'live' : 'past'}`}>{b.attended ? 'Yes' : 'No'}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
