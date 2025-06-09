import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService, callService, clientService } from '../../services/localStorage';

function Reports() {
  const navigate = useNavigate();
  const [calls, setCalls] = useState([]);
  const [clients, setClients] = useState([]);
  const [filters, setFilters] = useState({
    clientId: '',
    startDate: '',
    endDate: '',
    category: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      navigate('/login');
      return;
    }

    const loadData = () => {
      try {
        const allCalls = callService.getCalls();
        const allClients = clientService.getClients();

        // Filter calls based on user role
        const filteredCalls = allCalls.filter(call => {
          if (currentUser.role === 'admin') return true;
          return currentUser.assignedClients.includes(call.clientId);
        });

        setCalls(filteredCalls);
        setClients(allClients);
      } catch (error) {
        console.error('Error loading data:', error);
        setError('Failed to load reports data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [navigate]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleExportCSV = () => {
    const filteredCalls = filterCalls();
    const headers = ['Date', 'Client', 'Type', 'Patient ID', 'Summary', 'Categories', 'User'];
    const csvContent = [
      headers.join(','),
      ...filteredCalls.map(call => [
        new Date(call.timestamp).toLocaleString(),
        clients.find(c => c.id === call.clientId)?.name || 'Unknown',
        call.type,
        call.patientId,
        `"${call.summary.replace(/"/g, '""')}"`,
        call.categories.join(';'),
        call.userName
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `call-reports-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const filterCalls = () => {
    return calls.filter(call => {
      if (filters.clientId && call.clientId !== filters.clientId) return false;
      if (filters.startDate && new Date(call.timestamp) < new Date(filters.startDate)) return false;
      if (filters.endDate && new Date(call.timestamp) > new Date(filters.endDate)) return false;
      if (filters.category && !call.categories.includes(filters.category)) return false;
      return true;
    });
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-text">Loading...</div>
      </div>
    );
  }

  const filteredCalls = filterCalls();

  return (
    <div className="container">
      <div className="card">
        <div className="card-header">
          <h2>Call Reports</h2>
        </div>
        <div className="card-body">
          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}

          <div className="card">
            <div className="card-header">
              <h3>Filters</h3>
            </div>
            <div className="card-body">
              <div className="grid grid-4">
                <div className="form-group">
                  <label className="form-label">Client</label>
                  <select
                    name="clientId"
                    value={filters.clientId}
                    onChange={handleFilterChange}
                    className="form-select"
                  >
                    <option value="">All Clients</option>
                    {clients.map(client => (
                      <option key={client.id} value={client.id}>
                        {client.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    value={filters.startDate}
                    onChange={handleFilterChange}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">End Date</label>
                  <input
                    type="date"
                    name="endDate"
                    value={filters.endDate}
                    onChange={handleFilterChange}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    name="category"
                    value={filters.category}
                    onChange={handleFilterChange}
                    className="form-select"
                  >
                    <option value="">All Categories</option>
                    {Array.from(new Set(calls.flatMap(call => call.categories))).map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <button
                  onClick={handleExportCSV}
                  className="btn btn-primary"
                  disabled={filteredCalls.length === 0}
                >
                  Export to CSV
                </button>
              </div>
            </div>
          </div>

          <div className="card" style={{ marginTop: '2rem' }}>
            <div className="card-header">
              <h3>Results ({filteredCalls.length})</h3>
            </div>
            <div className="card-body">
              {filteredCalls.length === 0 ? (
                <div className="alert alert-info">
                  No calls found matching the selected filters.
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Client</th>
                        <th>Type</th>
                        <th>Patient ID</th>
                        <th>Summary</th>
                        <th>Categories</th>
                        <th>User</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCalls.map(call => (
                        <tr key={call.id}>
                          <td>{new Date(call.timestamp).toLocaleString()}</td>
                          <td>{clients.find(c => c.id === call.clientId)?.name || 'Unknown'}</td>
                          <td>
                            <span className={`badge ${call.type === 'inbound' ? 'badge-primary' : 'badge-secondary'}`}>
                              {call.type}
                            </span>
                          </td>
                          <td>{call.patientId}</td>
                          <td>{call.summary}</td>
                          <td>
                            <div className="badge-group">
                              {call.categories.map(category => (
                                <span key={category} className="badge badge-info">
                                  {category}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td>{call.userName}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reports; 