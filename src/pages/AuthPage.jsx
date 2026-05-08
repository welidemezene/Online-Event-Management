import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AuthPage.css';

const PERKS = [
  { icon: '🎟️', text: 'Book tickets in seconds' },
  { icon: '📍', text: 'Discover local events near you' },
  { icon: '🔔', text: 'Real-time updates & reminders' },
  { icon: '📱', text: 'Synced with the EventSphere mobile app' },
];

export default function AuthPage() {
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password || (!isLogin && !name)) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
      navigate('/');
    } catch (err) {
      setError(err.message?.replace('Firebase: ', '').replace(/ \(auth\/.*\)\.?/, '') || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => { setIsLogin(v => !v); setError(''); };

  return (
    <div className="auth-page">
      {/* ── LEFT PANEL ── */}
      <div className="auth-left">
        <div className="auth-left-inner">

          {/* Logo — top */}
          <Link to="/" className="auth-logo">
            <span className="auth-logo-icon">🌐</span>
            <span className="auth-logo-text">Event<span className="gradient-text">Sphere</span></span>
          </Link>

          {/* Centre content */}
          <div className="auth-left-content">
            <h1 className="auth-left-title">
              Your next great<br />
              experience <span className="gradient-text">awaits</span>
            </h1>
            <p className="auth-left-subtitle">
              Join EventSphere — Addis Ababa&apos;s premier event platform for discovering,
              booking, and attending unforgettable experiences.
            </p>

            <ul className="auth-perks">
              {PERKS.map((perk, i) => (
                <li key={i} className="auth-perk">
                  <span className="perk-icon">{perk.icon}</span>
                  <span className="perk-text">{perk.text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Footer — bottom */}
          <div className="auth-left-footer">
            <p>© {new Date().getFullYear()} EventSphere · Addis Ababa</p>
          </div>

        </div>

        {/* Decorative orbs */}
        <div className="auth-orb auth-orb-1" />
        <div className="auth-orb auth-orb-2" />
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="auth-right">
        <div className="auth-form-wrapper">
          {/* Tab switcher */}
          <div className="auth-tabs">
            <button
              className={`auth-tab ${isLogin ? 'active' : ''}`}
              onClick={() => { setIsLogin(true); setError(''); }}
            >
              Sign In
            </button>
            <button
              className={`auth-tab ${!isLogin ? 'active' : ''}`}
              onClick={() => { setIsLogin(false); setError(''); }}
            >
              Create Account
            </button>
          </div>

          {/* Heading */}
          <div className="auth-heading">
            <h2 className="auth-title">
              {isLogin ? 'Welcome back 👋' : 'Join EventSphere'}
            </h2>
            <p className="auth-subtitle">
              {isLogin
                ? 'Sign in to access your tickets and upcoming events.'
                : 'Create your free account and start exploring events today.'}
            </p>
          </div>

          {error && (
            <div className="auth-error">
              <span>⚠️</span> {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="auth-form">
            {!isLogin && (
              <div className="form-group">
                <label htmlFor="auth-name">Full Name</label>
                <input
                  id="auth-name"
                  type="text"
                  placeholder="e.g. Mekdes Alemu"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  autoComplete="name"
                />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="auth-email">Email Address</label>
              <input
                id="auth-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <div className="form-label-row">
                <label htmlFor="auth-password">Password</label>
                {isLogin && <button type="button" className="forgot-link">Forgot password?</button>}
              </div>
              <input
                id="auth-password"
                type="password"
                placeholder={isLogin ? '••••••••' : 'Minimum 6 characters'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete={isLogin ? 'current-password' : 'new-password'}
              />
            </div>

            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? (
                <span className="auth-spinner">⟳ Please wait...</span>
              ) : isLogin ? 'Sign In →' : 'Create Account →'}
            </button>
          </form>

          <p className="auth-switch">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}
            {' '}
            <button onClick={switchMode} className="auth-switch-btn">
              {isLogin ? 'Sign up for free' : 'Sign in instead'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
