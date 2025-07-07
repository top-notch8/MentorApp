import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Navbar from './Navbar';
import './AuthWrapper.css';

const AdminAddUser = ({ userRole, onLogout }) => {
  const [form, setForm] = useState({
    email: '',
    password: '',
    role: '',
  });
  const [createdUser, setCreatedUser] = useState(null);
  const token = localStorage.getItem('token');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.role) {
      toast.error('⚠️ Please select a role before submitting');
      return;
    }

    try {
      await axios.post('http://localhost:8000/api/admin/users', form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(`✅ ${form.email} added as ${form.role}`);
      setCreatedUser(form.email);
      setForm({ email: '', password: '', role: '' });
    } catch (err) {
      console.error('User creation error:', err.message);
      toast.error('❌ Failed to create user');
    }
  };

  return (
    <>
      <Navbar userRole={userRole} onLogout={onLogout} />
      <div className="auth-container">
        <h2>🆕 Add New User</h2>
        <form onSubmit={handleSubmit}>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            placeholder="User Email"
            onChange={handleChange}
            required
          />

          <label>Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            placeholder="Temporary Password"
            onChange={handleChange}
            required
          />

          <label>Role</label>
<select
  name="role"
  value={form.role}
  onChange={handleChange}
  required
  style={{ pointerEvents: 'auto' }} // 🛠️ Ensures interaction
>
  <option value="" disabled>Select Role</option>
  <option value="mentee">Mentee</option>
  <option value="mentor">Mentor</option>
  <option value="admin">Admin</option>
</select>


          <button type="submit" className="logout">
            Create User
          </button>
        </form>

        {/* Optional success message */}
        {createdUser && (
          <div style={{ marginTop: '1rem', color: 'green' }}>
            ✅ <strong>{createdUser}</strong> added successfully!
          </div>
        )}
      </div>
    </>
  );
};

export default AdminAddUser;
