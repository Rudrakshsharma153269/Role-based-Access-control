import React, { useState } from 'react';
import Tasks from './Tasks';
import Users from './Users';

function Dashboard({ user, onLogout }) {
  const [tab, setTab] = useState('tasks');

  return (
    <div>
      <nav className="navbar">
        <div className="navbar-brand">
          <div className="brand-icon">🛡️</div>
          <h1>Role-Based Access Control App</h1>
        </div>
        <div className="navbar-right">
          <div className="user-info">
            <div className="user-avatar">{user.username[0]}</div>
            <span>{user.username}</span>
            <span className={`badge ${user.role}`}>{user.role}</span>
          </div>
          <button className="logout-btn" onClick={onLogout}>Sign Out</button>
        </div>
      </nav>

      <div className="container">
        <div className="tabs">
          <button className={`tab ${tab === 'tasks' ? 'active' : ''}`} onClick={() => setTab('tasks')}>
            📋 Tasks
          </button>
          <button className={`tab ${tab === 'users' ? 'active' : ''}`} onClick={() => setTab('users')}>
            👥 Users
          </button>
        </div>
        {tab === 'tasks'
          ? <Tasks userRole={user.role} />
          : <Users userRole={user.role} currentUserId={user.id} />
        }
      </div>
    </div>
  );
}

export default Dashboard;
