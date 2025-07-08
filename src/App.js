
import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';
import EditProfile from './components/Edit';
import Admin from './components/Admin';
import AdminSessions from './components/AdminSessions';
import AdminAddUser from './components/AdminAddUser';




function AppWrapper() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (token) {
        try {
          const res = await axios.get('https://mentoapp-backend.onrender.com/api/profile', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUserRole(res.data.user.role);
        } catch (err) {
          console.error('Role fetch failed:', err.message);
        }
      }
    };

    fetchUserRole();
  }, [token]);

  const handleLogin = async () => {
    const newToken = localStorage.getItem('token');
    setToken(newToken);

    try {
      const res = await axios.get('https://mentoapp-backend.onrender.com/api/profile', {
        headers: { Authorization: `Bearer ${newToken}` },
      });
      setUserRole(res.data.user.role);
    } catch (err) {
      console.error('Failed to fetch role:', err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUserRole(null);
  };

  return (
    <Router>
      <ToastContainer position="top-center" autoClose={3000} />
      <AppRoutes
        token={token}
        userRole={userRole}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />
    </Router>
  );
}

function AppRoutes({ token, userRole, onLogin, onLogout }) {
  const navigate = useNavigate();

  return (
    <Routes>
      <Route
        path="/"
        element={
          token ? (
            <Profile userRole={userRole} onLogout={onLogout} />
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route path="/login" element={<Login onLogin={onLogin} />} />
      <Route
        path="/register"
        element={<Register onSwitchToLogin={() => navigate('/login')} />}
      />
      <Route
        path="/edit"
        element={
          token ? (
            <EditProfile
              userRole={userRole}
              onSave={() => navigate('/')}
              onLogout={onLogout}
            />
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route
        path="/admin"
        element={
          token && userRole === 'admin' ? (
            <Admin userRole={userRole} onLogout={onLogout} />
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route
        path="/admin-sessions"
        element={
          token && userRole === 'admin' ? (
            <AdminSessions userRole={userRole} onLogout={onLogout} />
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route
        path="/admin-add-user"
        element={
          token && userRole === 'admin' ? (
            <AdminAddUser userRole={userRole} onLogout={onLogout} />
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      {/* <Route
        path="/mentee"
        element={
          token && userRole === 'mentee' ? (
            <MenteeDashboard userRole={userRole} onLogout={onLogout} />
          ) : (
            <Navigate to="/login" />
          )
        }
      /> */}
    </Routes>
  );
}

export default AppWrapper;
