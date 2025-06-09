import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService, clientService, categoryService, callService } from '../../services/localStorage';

function CallEntry() {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    clientId: '',
    type: 'inbound',
    patientId: '',
    summary: '',
    categories: [],
    timestamp: new Date().toISOString().slice(0, 16)
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      navigate('/login');
      return;
    }

    const loadData = () => {
      try {
        const allClients = clientService.getClients();
        const allCategories = categoryService.getCategories();

        const userClients = allClients.filter(client => 
          currentUser.assignedClients.includes(client.id)
        );

        setClients(userClients);
        setCategories(allCategories);
      } catch (error) {
        console.error('Error loading data:', error);
        setError('Failed to load clients and categories');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const currentUser = authService.getCurrentUser();
      if (!currentUser) {
        throw new Error('User not authenticated');
      }

      if (!formData.clientId || !formData.patientId || !formData.summary || formData.categories.length === 0) {
        throw new Error('Please fill in all required fields');
      }

      const callData = {
        ...formData,
        userId: currentUser.id,
        userName: currentUser.name,
        userRole: currentUser.role,
        timestamp: new Date(formData.timestamp).toISOString()
      };

      callService.addCall(callData);

      setSuccess('Call entry saved successfully');
      setFormData({
        clientId: '',
        type: 'inbound',
        patientId: '',
        summary: '',
        categories: [],
        timestamp: new Date().toISOString().slice(0, 16)
      });

      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      console.error('Error saving call:', error);
      setError(error.message || 'Failed to save call entry');
    }
  };

  const handleCategoryChange = (category) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-text">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card">
        <div className="card-header">
          <h2>New Call Entry</h2>
        </div>
        <div className="card-body">
          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}

          {success && (
            <div className="alert alert-success">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-2">
              <div className="form-group">
                <label className="form-label">Client</label>
                <select
                  value={formData.clientId}
                  onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                  className="form-select"
                  required
                >
                  <option value="">Select a client</option>
                  {clients.map(client => (
                    <option key={client.id} value={client.id}>
                      {client.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Call Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="form-select"
                >
                  <option value="inbound">Inbound</option>
                  <option value="outbound">Outbound</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Patient ID</label>
                <input
                  type="text"
                  value={formData.patientId}
                  onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                  className="form-input"
                  placeholder="Enter patient ID"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Timestamp</label>
                <input
                  type="datetime-local"
                  value={formData.timestamp}
                  onChange={(e) => setFormData({ ...formData, timestamp: e.target.value })}
                  className="form-input"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Call Summary</label>
              <textarea
                value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                rows="4"
                className="form-input"
                placeholder="Enter call summary"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Categories</label>
              <div className="grid grid-4">
                {categories.map(category => (
                  <label
                    key={category.id}
                    className={`card ${formData.categories.includes(category.label) ? 'selected' : ''}`}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="card-body">
                      <input
                        type="checkbox"
                        checked={formData.categories.includes(category.label)}
                        onChange={() => handleCategoryChange(category.label)}
                        style={{ marginRight: '8px' }}
                      />
                      {category.label}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
              >
                Save Call Entry
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CallEntry; 