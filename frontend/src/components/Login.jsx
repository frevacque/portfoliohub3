import React, { useState } from 'react';
import { TrendingUp } from 'lucide-react';
import { authAPI, storage } from '../api';

const Login = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let userData;
      if (isLogin) {
        userData = await authAPI.login({
          email: formData.email,
          password: formData.password
        });
      } else {
        userData = await authAPI.register({
          name: formData.name,
          email: formData.email,
          password: formData.password
        });
      }
      
      // Store user data
      storage.setUserId(userData.id);
      storage.setUser(userData);
      onLogin(userData);
    } catch (err) {
      setError(err.response?.data?.detail || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-primary)',
      padding: '24px'
    }}>
      <div className="card" style={{
        maxWidth: '450px',
        width: '100%',
        padding: '48px 32px'
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            marginBottom: '16px'
          }}>
            <TrendingUp size={40} color="var(--accent-primary)" />
            <span style={{ fontSize: '32px', fontWeight: '700', color: 'var(--text-primary)' }}>
              PortfolioHub
            </span>
          </div>
          <p className="body-md" style={{ color: 'var(--text-muted)' }}>
            Gérez votre portefeuille avec intelligence
          </p>
        </div>

        {error && (
          <div style={{
            padding: '12px',
            background: 'var(--danger-bg)',
            border: '1px solid var(--danger)',
            borderRadius: '8px',
            marginBottom: '24px',
            color: 'var(--danger)',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        {/* Toggle */}
        <div style={{
          display: 'flex',
          background: 'var(--bg-tertiary)',
          borderRadius: '12px',
          padding: '4px',
          marginBottom: '32px'
        }}>
          <button
            onClick={() => setIsLogin(true)}
            style={{
              flex: 1,
              padding: '12px',
              border: 'none',
              borderRadius: '8px',
              background: isLogin ? 'var(--accent-primary)' : 'transparent',
              color: isLogin ? 'var(--bg-primary)' : 'var(--text-secondary)',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              fontSize: '15px'
            }}
          >
            Connexion
          </button>
          <button
            onClick={() => setIsLogin(false)}
            style={{
              flex: 1,
              padding: '12px',
              border: 'none',
              borderRadius: '8px',
              background: !isLogin ? 'var(--accent-primary)' : 'transparent',
              color: !isLogin ? 'var(--bg-primary)' : 'var(--text-secondary)',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              fontSize: '15px'
            }}
          >
            Inscription
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {!isLogin && (
            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '500',
                color: 'var(--text-secondary)'
              }}>
                Nom complet
              </label>
              <input
                type="text"
                placeholder="Jean Dupont"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input-field"
                required={!isLogin}
              />
            </div>
          )}

          <div>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: '500',
              color: 'var(--text-secondary)'
            }}>
              Email
            </label>
            <input
              type="email"
              placeholder="jean.dupont@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="input-field"
              required
            />
          </div>

          <div>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: '500',
              color: 'var(--text-secondary)'
            }}>
              Mot de passe
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="input-field"
              required
            />
          </div>

          <button 
            type="submit" 
            className="btn-primary" 
            style={{ width: '100%', marginTop: '8px' }}
            disabled={loading}
          >
            {loading ? 'Chargement...' : (isLogin ? 'Se connecter' : 'Créer un compte')}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: 'var(--text-muted)' }}>
          {isLogin ? "Pas encore de compte ?" : "Déjà un compte ?"}
          {' '}
          <button
            onClick={() => setIsLogin(!isLogin)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--accent-primary)',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '14px'
            }}
          >
            {isLogin ? 'Inscrivez-vous' : 'Connectez-vous'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
