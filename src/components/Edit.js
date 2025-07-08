import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import './AuthWrapper.css';
import { toast } from 'react-toastify';

const EditProfile = ({ onSave, onLogout }) => {
  const [form, setForm] = useState({ name: '', bio: '', skills: '', goals: '' });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    axios
      .get('https://mentoapp-backend.onrender.com/api/profile', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const { name, bio, skills, goals, image } = res.data.profile;
        setForm({ name, bio, skills: skills.join(', '), goals });
        if (image) setPreview(`https://mentoapp-backend.onrender.com${image}`);
      });
  }, [token]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('bio', form.bio);
      formData.append('skills', form.skills);
      formData.append('goals', form.goals);
      if (imageFile) formData.append('image', imageFile);

      await axios.put('https://mentoapp-backend.onrender.com/api/profile', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('✅ Profile updated!');
      onSave?.();
    } catch (err) {
      console.error('Update error:', err);
      toast.error('❌ Failed to update profile.');
    }
  };

  return (
    <>
      <Navbar onLogout={onLogout} />
      <div className="auth-container">
        <h2>Edit Profile</h2>
        <form onSubmit={handleSubmit}>
          {preview && (
            <img
              src={preview}
              alt="Preview"
              style={{ width: '100%', borderRadius: '8px', marginBottom: '1rem' }}
            />
          )}
          <input type="file" accept="image/*" onChange={handleImageChange} />
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Name"
            required
          />
          <textarea
            name="bio"
            value={form.bio}
            onChange={handleChange}
            placeholder="Bio"
            required
          />
          <input
            name="skills"
            value={form.skills}
            onChange={handleChange}
            placeholder="Skills (comma-separated)"
          />
          <textarea
            name="goals"
            value={form.goals}
            onChange={handleChange}
            placeholder="Goals"
          />
          <button type="submit">Save Changes</button>
        </form>
      </div>
    </>
  );
};

export default EditProfile;
