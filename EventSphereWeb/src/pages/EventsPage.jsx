import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useEvents } from '../context/EventContext';
import EventCard from '../components/EventCard';
import './EventsPage.css';

const CATEGORIES = [
  { key: '', label: 'All Events' },
  { key: 'tech', label: '💻 Tech' },
  { key: 'music', label: '🎵 Music' },
  { key: 'sports', label: '🏆 Sports' },
  { key: 'art', label: '🎨 Art' },
  { key: 'business', label: '💼 Business' },
];

const SORT_OPTIONS = [
  { value: 'date-asc', label: 'Date (Soonest)' },
  { value: 'date-desc', label: 'Date (Latest)' },
  { value: 'price-asc', label: 'Price (Low to High)' },
  { value: 'price-desc', label: 'Price (High to Low)' },
];

export default function EventsPage() {
  const { events, loading } = useEvents();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('date-asc');

  const activeCategory = searchParams.get('category') || '';

  const setCategory = (cat) => {
    if (cat) setSearchParams({ category: cat });
    else setSearchParams({});
  };

  const filtered = useMemo(() => {
    let result = [...events];

    if (activeCategory) result = result.filter(e => e.category === activeCategory);
    if (search.trim()) result = result.filter(e =>
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.location.toLowerCase().includes(search.toLowerCase())
    );

    switch (sort) {
      case 'date-asc': return result.sort((a, b) => new Date(a.date) - new Date(b.date));
      case 'date-desc': return result.sort((a, b) => new Date(b.date) - new Date(a.date));
      case 'price-asc': return result.sort((a, b) => a.price - b.price);
      case 'price-desc': return result.sort((a, b) => b.price - a.price);
      default: return result;
    }
  }, [events, activeCategory, search, sort]);

  return (
    <div className="events-page">
      <div className="container">
        <div className="events-header">
          <h1 className="events-title">Explore Events</h1>
          <p className="events-subtitle">{filtered.length} event{filtered.length !== 1 ? 's' : ''} found</p>
        </div>

        {/* Search & Sort Bar */}
        <div className="filter-bar">
          <div className="search-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-input"
              placeholder="Search events or locations..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button className="search-clear" onClick={() => setSearch('')}>✕</button>
            )}
          </div>
          <select
            className="sort-select"
            value={sort}
            onChange={e => setSort(e.target.value)}
          >
            {SORT_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {/* Category Tabs */}
        <div className="category-tabs">
          {CATEGORIES.map(cat => (
            <button
              key={cat.key}
              className={`category-tab ${activeCategory === cat.key ? 'active' : ''}`}
              onClick={() => setCategory(cat.key)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Events Grid */}
        {loading ? (
          <div className="events-grid">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="skeleton" style={{ height: '320px' }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <h3>No events found</h3>
            <p>Try a different search term or category.</p>
            <button onClick={() => { setSearch(''); setCategory(''); }} className="reset-btn">
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="events-grid">
            {filtered.map(event => (
              <EventCard key={event.eventId} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
