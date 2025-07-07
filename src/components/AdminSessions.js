import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import './AuthWrapper.css';
import { toast } from 'react-toastify';

const AdminSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    title: '',
    description: '',
    mentee_id: '',
    mentor_id: '',
    scheduled_at: ''
  });
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchUsersAndSessions = async () => {
      try {
        const resUsers = await axios.get('http://localhost:8000/api/admin/users', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(resUsers.data.users || []);

        const resSessions = await axios.get('http://localhost:8000/api/admin/sessions', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSessions(resSessions.data.sessions || []);
      } catch (err) {
        console.error('Load error:', err.message);
        toast.error('Could not load data');
      }
    };

    if (token) fetchUsersAndSessions();
  }, [token]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/api/admin/sessions', form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('✅ Session created!');
      setForm({ title: '', description: '', mentee_id: '', mentor_id: '', scheduled_at: '' });

      // Refresh sessions list
      const resSessions = await axios.get('http://localhost:8000/api/admin/sessions', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSessions(resSessions.data.sessions || []);
    } catch (err) {
      console.error('Create error:', err.message);
      toast.error('Failed to create session');
    }
  };

  return (
    <>
      <Navbar />
      <div className="auth-container">
        <h2>📚 Session Management</h2>

        <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
          <input
            type="text"
            name="title"
            placeholder="Session Title"
            value={form.title}
            onChange={handleChange}
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
          />
          <select name="mentee_id" value={form.mentee_id} onChange={handleChange} required>
            <option value="">Select Mentee</option>
            {users.filter(u => u.role === 'mentee').map(u => (
              <option key={u.id} value={u.id}>{u.email}</option>
            ))}
          </select>
          <select name="mentor_id" value={form.mentor_id} onChange={handleChange} required>
            <option value="">Select Mentor</option>
            {users.filter(u => u.role === 'mentor').map(u => (
              <option key={u.id} value={u.id}>{u.email}</option>
            ))}
          </select>
          <input
            type="datetime-local"
            name="scheduled_at"
            value={form.scheduled_at}
            onChange={handleChange}
            required
          />
          <button type="submit" className="logout">Create Session</button>
        </form>

        <h3>🗂️ Scheduled Sessions</h3>
        {sessions.length > 0 ? (
          <ul>
            {sessions.map(s => (
              <li key={s.id}>
                <strong>{s.title}</strong> — {s.description}<br />
                Mentor: <em>{s.mentor_email || 'Unassigned'}</em>, Mentee: <em>{s.mentee_email}</em><br />
                Scheduled for: {new Date(s.scheduled_at).toLocaleString()}
              </li>
            ))}
          </ul>
        ) : (
          <p>No sessions yet</p>
        )}
      </div>
    </>
  );
};

export default AdminSessions;
