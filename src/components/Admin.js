import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import './AuthWrapper.css';
import { toast } from 'react-toastify';

const Admin = ({ userRole, onLogout }) => {
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get('https://mentoapp-backend.onrender.com/api/admin/users', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data.users || []);
      } catch (err) {
        console.error('❌ Error fetching users:', err.response?.data || err.message);
        toast.error('Failed to load user list.');
      }
    };

    if (token) fetchUsers();
  }, [token]);

  const handleRoleChange = async (id, newRole) => {
    try {
      await axios.put(
        `http://localhost:8000/api/admin/users/${id}/role`,
        { role: newRole },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUsers(users.map(user => (user.id === id ? { ...user, role: newRole } : user)));
      toast.success('✅ Role updated');
    } catch (err) {
      console.error('❌ Error updating role:', err);
      toast.error('Role update failed');
    }
  };

  const handleDelete = async id => {
    try {
      await axios.delete(`https://mentoapp-backend.onrender.com/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter(user => user.id !== id));
      toast.success('🗑️ User deleted');
    } catch (err) {
      console.error('❌ Error deleting user:', err);
      toast.error('Delete failed');
    }
  };

  return (
    <>
      <Navbar userRole={userRole} onLogout={onLogout} />
      <div className="auth-container">
        <h2>👑 Admin Panel</h2>
        {users.length > 0 ? (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left' }}>Email</th>
                <th>Current Role</th>
                <th>Change Role</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.email}</td>
                  <td><em>{user.role}</em></td>
                  <td>
                    <select
                      value={user.role}
                      onChange={e => handleRoleChange(user.id, e.target.value)}
                    >
                      <option value="mentee">mentee</option>
                      <option value="mentor">mentor</option>
                      <option value="admin">admin</option>
                    </select>
                  </td>
                  <td>
                    <button onClick={() => handleDelete(user.id)} className="logout">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No users found or access denied.</p>
        )}
      </div>
    </>
  );
};

export default Admin;
