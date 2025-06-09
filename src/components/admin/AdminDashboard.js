import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService, userService, clientService } from '../../services/localStorage';

function AdminDashboard() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [clients, setClients] = useState([]);
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    name: '',
    role: 'user',
    assignedClients: []
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      navigate('/dashboard');
      return;
    }

    const loadData = () => {
      try {
        const allUsers = userService.getUsers();
        const allClients = clientService.getClients();
        setUsers(allUsers);
        setClients(allClients);
      } catch (error) {
        console.error('Error loading data:', error);
        setError('Failed to load users and clients');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (!newUser.email || !newUser.password || !newUser.name) {
        throw new Error('Please fill in all required fields');
      }

      userService.addUser(newUser);
      setUsers(userService.getUsers());
      setSuccess('User added successfully');
      setNewUser({
        email: '',
        password: '',
        name: '',
        role: 'user',
        assignedClients: []
      });
    } catch (error) {
      console.error('Error adding user:', error);
      setError(error.message || 'Failed to add user');
    }
  };

  const handleDeleteUser = (userId) => {
    try {
      userService.deleteUser(userId);
      setUsers(userService.getUsers());
      setSuccess('User deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
      setError(error.message || 'Failed to delete user');
    }
  };

  const handleClientAssignment = (userId, clientId) => {
    try {
      const user = users.find(u => u.id === userId);
      if (!user) throw new Error('User not found');

      const updatedAssignedClients = user.assignedClients.includes(clientId)
        ? user.assignedClients.filter(id => id !== clientId)
        : [...user.assignedClients, clientId];

      userService.updateUser(userId, { ...user, assignedClients: updatedAssignedClients });
      setUsers(userService.getUsers());
      setSuccess('User updated successfully');
    } catch (error) {
      console.error('Error updating user:', error);
      setError(error.message || 'Failed to update user');
    }
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
          <h2>Admin Dashboard</h2>
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

          <div className="card">
            <div className="card-header">
              <h3>Add New User</h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-2">
                  <div className="form-group">
                    <label className="form-label">Name</label>
                    <input
                      type="text"
                      value={newUser.name}
                      onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                      className="form-input"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                      className="form-input"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Password</label>
                    <input
                      type="password"
                      value={newUser.password}
                      onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                      className="form-input"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Role</label>
                    <select
                      value={newUser.role}
                      onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                      className="form-select"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                  <button type="submit" className="btn btn-primary">
                    Add User
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="card" style={{ marginTop: '2rem' }}>
            <div className="card-header">
              <h3>User Management</h3>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Assigned Clients</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user.id}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>
                          <span className={`badge ${user.role === 'admin' ? 'badge-primary' : 'badge-secondary'}`}>
                            {user.role}
                          </span>
                        </td>
                        <td>
                          <div className="badge-group">
                            {user.assignedClients.map(clientId => {
                              const client = clients.find(c => c.id === clientId);
                              return client ? (
                                <span key={clientId} className="badge badge-info">
                                  {client.name}
                                </span>
                              ) : null;
                            })}
                          </div>
                        </td>
                        <td>
                          <div className="btn-group">
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="btn btn-danger"
                              disabled={user.role === 'admin'}
                            >
                              Delete
                            </button>
                            <select
                              value=""
                              onChange={(e) => handleClientAssignment(user.id, e.target.value)}
                              className="form-select"
                              style={{ marginLeft: '0.5rem' }}
                            >
                              <option value="">Assign Client</option>
                              {clients.map(client => (
                                <option key={client.id} value={client.id}>
                                  {client.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard; 