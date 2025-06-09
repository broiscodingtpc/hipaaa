import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/localStorage';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (authService.isAuthenticated()) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await authService.login(formData.email, formData.password);
      if (user) {
        navigate('/dashboard');
      }
    } catch (error) {
      setError(error.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: '400px', margin: '2rem auto' }}>
        <div className="card-header">
          <h2>Login</h2>
        </div>
        <div className="card-body">
          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="form-input"
                required
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </div>
          </form>

          <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '0.5rem' }}>
            <h3 style={{ marginBottom: '1rem', color: '#2c3e50' }}>Test Accounts</h3>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ color: '#3498db', marginBottom: '0.5rem' }}>Admin Access</h4>
              <p style={{ margin: '0.25rem 0' }}><strong>Email:</strong> admin@example.com</p>
              <p style={{ margin: '0.25rem 0' }}><strong>Password:</strong> test123</p>
              <p style={{ margin: '0.25rem 0', color: '#666' }}>Full system access and user management</p>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ color: '#2ecc71', marginBottom: '0.5rem' }}>Nurse Access</h4>
              <p style={{ margin: '0.25rem 0' }}><strong>Email:</strong> nurse@example.com</p>
              <p style={{ margin: '0.25rem 0' }}><strong>Password:</strong> test123</p>
              <p style={{ margin: '0.25rem 0', color: '#666' }}>Clinical features and call management</p>
            </div>

            <div>
              <h4 style={{ color: '#e74c3c', marginBottom: '0.5rem' }}>Client Access</h4>
              <p style={{ margin: '0.25rem 0' }}><strong>Email:</strong> client@example.com</p>
              <p style={{ margin: '0.25rem 0' }}><strong>Password:</strong> test123</p>
              <p style={{ margin: '0.25rem 0', color: '#666' }}>View reports and client dashboard</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login; 