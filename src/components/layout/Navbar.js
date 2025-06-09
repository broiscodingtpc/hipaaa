import React from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/localStorage';

function Navbar() {
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  if (!currentUser) return null;

  return (
    <nav className="navbar">
      <div className="nav-content">
        <div className="nav-brand">
          <h1>HIPAA Call Center</h1>
        </div>
        <div className="nav-links">
          <a href="/dashboard" className="nav-link">Dashboard</a>
          
          {/* Show New Call link for admin and nurse roles */}
          {(currentUser.role === 'admin' || currentUser.role === 'nurse') && (
            <a href="/call-entry" className="nav-link">New Call</a>
          )}
          
          {/* Show Reports link for all roles */}
          <a href="/reports" className="nav-link">Reports</a>
          
          {/* Show Admin link only for admin role */}
          {currentUser.role === 'admin' && (
            <a href="/admin" className="nav-link">Admin</a>
          )}
          
          <button onClick={handleLogout} className="nav-link">Logout</button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar; 