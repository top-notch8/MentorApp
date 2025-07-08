import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import './AuthWrapper.css';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom'; // removed useNavigate

const Profile = ({ onLogout }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const token = localStorage.getItem('token');

  let userRole = 'mentee'; // default fallback
  if (token) {
    try {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      userRole = decoded.role || 'mentee';
    } catch (err) {
      console.error('⚠️ Failed to decode token:', err);
    }
  }

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('https://mentoapp-backend.onrender.com/api/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfile(res.data.profile || res.data);
      } catch (err) {
        console.error('❌ Error fetching profile:', err.response?.data || err.message);
        toast.error('Session expired or profile fetch failed.');
        onLogout?.();
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchProfile();
  }, [token, onLogout]);

  const handleDelete = async () => {
    try {
      await axios.delete('https://mentoapp-backend.onrender.com/api/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('🗑️ Profile deleted successfully!');
      onLogout?.();
    } catch (err) {
      console.error('❌ Error deleting profile:', err.response?.data || err.message);
      toast.error('Failed to delete profile.');
    }
  };

  if (loading) return <p>Loading profile...</p>;
  if (!profile) return <p>No profile data available.</p>;

  return (
    <>
      <Navbar onLogout={onLogout} />
      <div className="auth-container">
        {profile.image && (
          <img
            src={`https://mentoapp-backend.onrender.com${profile.image}`}
            alt="Profile"
            style={{ width: '100%', borderRadius: '8px', marginBottom: '1rem' }}
          />
        )}

        {/* Tab Buttons */}
        <div className="tab-buttons">
          <button onClick={() => setActiveTab('overview')} className={activeTab === 'overview' ? 'active' : ''}>📝 Overview</button>

          {userRole === 'mentor' && (
            <button onClick={() => setActiveTab('skills')} className={activeTab === 'skills' ? 'active' : ''}>🧠 Skills</button>
          )}

          {userRole === 'mentee' && (
            <button onClick={() => setActiveTab('goals')} className={activeTab === 'goals' ? 'active' : ''}>🎯 Goals</button>
          )}

          <button onClick={() => setActiveTab('settings')} className={activeTab === 'settings' ? 'active' : ''}>⚙️ Settings</button>

          {userRole === 'admin' && (
            <button onClick={() => setActiveTab('admin')} className={activeTab === 'admin' ? 'active' : ''}>📊 Admin</button>
          )}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <>
            <h2>{profile.name || 'Unnamed User'}</h2>
            <p><strong>Bio:</strong> {profile.bio || 'No bio provided.'}</p>
          </>
        )}

        {activeTab === 'skills' && userRole === 'mentor' && (
          <p><strong>Skills:</strong> {Array.isArray(profile.skills) ? profile.skills.join(', ') : 'No skills listed.'}</p>
        )}

        {activeTab === 'goals' && userRole === 'mentee' && (
          <p><strong>Goals:</strong> {profile.goals || 'No goals set.'}</p>
        )}

        {activeTab === 'settings' && (
          <>
            <button onClick={handleDelete} style={{ backgroundColor: '#f44336' }}>
              Delete Profile
            </button>
            <button onClick={onLogout} style={{ marginTop: '1rem' }}>
              Logout
            </button>
          </>
        )}

        {activeTab === 'admin' && userRole === 'admin' && (
          <>
            <h3>👑 Admin Dashboard</h3>
            <p>This is a preview — you’ll be able to list users, assign roles, and add analytics soon!</p>
            <Link to="/admin" className="nav-btn" style={{ marginTop: '1rem' }}>
              Go to Admin Panel
            </Link>
          </>
        )}
      </div>
    </>
  );
};

export default Profile;
