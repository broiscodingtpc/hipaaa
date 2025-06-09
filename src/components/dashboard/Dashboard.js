import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService, clientService, callService } from '../../services/localStorage';

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [clients, setClients] = useState([]);
  const [recentCalls, setRecentCalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      navigate('/login');
      return;
    }
    setUser(currentUser);

    const loadData = () => {
      try {
        const allClients = clientService.getClients();
        const allCalls = callService.getCalls();

        // Filter clients based on user's assigned clients
        const userClients = allClients.filter(client => 
          currentUser.assignedClients.includes(client.id)
        );

        // Get recent calls for user's clients
        const userCalls = allCalls
          .filter(call => userClients.some(client => client.id === call.clientId))
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
          .slice(0, 5);

        setClients(userClients);
        setRecentCalls(userCalls);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [navigate]);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
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
          <h2>Dashboard</h2>
        </div>
        <div className="card-body">
          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}

          <div className="grid grid-2">
            {/* Quick Actions */}
            <div className="card">
              <div className="card-header">
                <h3>Quick Actions</h3>
              </div>
              <div className="card-body">
                <div className="space-y-4">
                  <button
                    onClick={() => navigate('/call-entry')}
                    className="btn btn-primary"
                  >
                    New Call Entry
                  </button>
                  <button
                    onClick={() => navigate('/reports')}
                    className="btn btn-secondary"
                  >
                    View Reports
                  </button>
                  {user?.role === 'admin' && (
                    <button
                      onClick={() => navigate('/admin')}
                      className="btn btn-success"
                    >
                      Admin Dashboard
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Assigned Clients */}
            <div className="card">
              <div className="card-header">
                <h3>Your Clients</h3>
              </div>
              <div className="card-body">
                {clients.length === 0 ? (
                  <p>No clients assigned.</p>
                ) : (
                  <div className="grid grid-2">
                    {clients.map(client => (
                      <div key={client.id} className="card">
                        <div className="card-body">
                          <h4>{client.name}</h4>
                          <button
                            onClick={() => navigate('/call-entry')}
                            className="btn btn-primary"
                            style={{ marginTop: '10px' }}
                          >
                            New Call
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Recent Calls */}
            <div className="card">
              <div className="card-header">
                <h3>Recent Calls</h3>
              </div>
              <div className="card-body">
                {recentCalls.length === 0 ? (
                  <p>No calls found.</p>
                ) : (
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Client</th>
                        <th>Type</th>
                        <th>Patient ID</th>
                        <th>Timestamp</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentCalls.slice(0, 5).map(call => (
                        <tr key={call.id}>
                          <td>{clients.find(c => c.id === call.clientId)?.name || 'Unknown'}</td>
                          <td>
                            <span className={`badge ${call.type === 'inbound' ? 'badge-primary' : 'badge-success'}`}>
                              {call.type}
                            </span>
                          </td>
                          <td>{call.patientId}</td>
                          <td>{new Date(call.timestamp).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard; 