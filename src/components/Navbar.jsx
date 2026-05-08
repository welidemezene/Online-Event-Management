import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isAdmin = user?.role === 'admin' || user?.email?.toLowerCase() === 'admin@eventsphere.com';

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setMenuOpen(false);
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/events', label: 'Events' },
    ...(user ? [{ to: '/tickets', label: 'My Tickets' }] : []),
    ...(isAdmin ? [{ to: '/admin', label: 'Admin' }] : []),
  ];

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">🌐</span>
          <span className="logo-text">Event<span className="gradient-text">Sphere</span></span>
        </Link>

        <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`nav-link ${location.pathname === link.to ? 'active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="navbar-actions">
          {user ? (
            <div className="user-menu">
              <div className="user-avatar">{user.name?.charAt(0).toUpperCase() || 'U'}</div>
              <div className="user-dropdown">
                <p className="user-name">{user.name}</p>
                <p className="user-email">{user.email}</p>
                {isAdmin && (
                  <Link to="/admin" className="dropdown-item admin-item" onClick={() => setMenuOpen(false)}>
                    ⚙️ Admin Dashboard
                  </Link>
                )}
                <button onClick={handleLogout} className="dropdown-item logout-item">
                  🚪 Logout
                </button>
              </div>
            </div>
          ) : (
            <Link to="/auth" className="btn-primary">
              Sign In
            </Link>
          )}

          <button className="hamburger" onClick={() => setMenuOpen(m => !m)}>
            <span /><span /><span />
          </button>
        </div>
      </div>
    </nav>
  );
}
