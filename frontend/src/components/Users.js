import React, { useState, useEffect } from 'react';
import { users as usersApi } from '../api';

function Users({ userRole, currentUserId }) {
  const [userList, setUserList] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    usersApi.getAll().then(res => setUserList(res.data)).catch(() => setError('Failed to load users'));
  }, []);

  const handleDelete = async (id) => {
    try {
      await usersApi.delete(id);
      setUserList(userList.filter(u => u._id !== id));
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete user');
    }
  };

  return (
    <div>
      <div className="section-header">
        <h2>All Users</h2>
        <span className="count-badge">{userList.length} members</span>
      </div>

      {error && <p className="error">{error}</p>}

      {userRole !== 'admin' && (
        <p className="notice">👁 You have read-only access to the user list.</p>
      )}

      {userList.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">👤</div>
          <p>No users found.</p>
        </div>
      ) : (
        userList.map(u => (
          <div className="card" key={u._id}>
            <div className="user-card-row">
              <div className="user-card-avatar">{u.username[0]}</div>
              <div className="user-card-info">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <strong>{u.username}</strong>
                  <span className={`badge ${u.role}`}>{u.role}</span>
                  {u._id === currentUserId && (
                    <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>(you)</span>
                  )}
                </div>
                <p>{u.email}</p>
              </div>
              {userRole === 'admin' && u._id !== currentUserId && (
                <button className="btn-delete" onClick={() => handleDelete(u._id)}>🗑 Delete</button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Users;
