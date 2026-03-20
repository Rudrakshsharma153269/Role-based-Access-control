import React, { useState, useEffect } from 'react';
import { tasks as tasksApi } from '../api';

function Tasks({ userRole }) {
  const [taskList, setTaskList] = useState([]);
  const [form, setForm] = useState({ title: '', description: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    tasksApi.getAll().then(res => setTaskList(res.data)).catch(() => setError('Failed to load tasks'));
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await tasksApi.create(form);
      setTaskList([res.data, ...taskList]);
      setForm({ title: '', description: '' });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create task');
    }
  };

  const handleToggle = async (task) => {
    try {
      const res = await tasksApi.update(task._id, {
        status: task.status === 'pending' ? 'completed' : 'pending'
      });
      setTaskList(taskList.map(t => t._id === task._id ? res.data : t));
    } catch {
      setError('Failed to update task');
    }
  };

  const handleDelete = async (id) => {
    try {
      await tasksApi.delete(id);
      setTaskList(taskList.filter(t => t._id !== id));
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete task');
    }
  };

  return (
    <div>
      <div className="create-card">
        <h3>✨ New Task</h3>
        <form onSubmit={handleCreate}>
          <div className="create-form-row">
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Title</label>
              <input
                type="text"
                placeholder="Task title..."
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                required
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Description</label>
              <input
                type="text"
                placeholder="Optional description..."
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
              />
            </div>
          </div>
          <div style={{ marginTop: '1rem' }}>
            <button type="submit" className="btn-sm">+ Add Task</button>
          </div>
        </form>
      </div>

      {error && <p className="error">{error}</p>}

      <div className="section-header">
        <h2>All Tasks</h2>
        <span className="count-badge">{taskList.length} tasks</span>
      </div>

      {taskList.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <p>No tasks yet. Create your first task above!</p>
        </div>
      ) : (
        taskList.map(task => (
          <div className="card" key={task._id}>
            <div className="card-header">
              <h3>{task.title}</h3>
              <span className={`status-pill ${task.status}`}>{task.status}</span>
            </div>
            {task.description && (
              <p className="card-meta">{task.description}</p>
            )}
            <p className="card-meta">By {task.createdBy?.username || 'Unknown'}</p>
            <div className="card-actions">
              <button className="btn-toggle" onClick={() => handleToggle(task)}>
                {task.status === 'pending' ? '✓ Mark Done' : '↩ Mark Pending'}
              </button>
              {userRole === 'admin' && (
                <button className="btn-delete" onClick={() => handleDelete(task._id)}>🗑 Delete</button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Tasks;
