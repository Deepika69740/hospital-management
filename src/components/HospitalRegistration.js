import React, { useState } from 'react';
import { registerHospital } from '../api/api';

const HospitalRegistration = () => {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    departments: []
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerHospital(formData);
      alert('Hospital registered successfully!');
      setFormData({ name: '', location: '', departments: [] });
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <div className="card">
      <h2>Register Hospital</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Hospital Name"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          required
        />
        <input
          type="text"
          placeholder="Location"
          value={formData.location}
          onChange={(e) => setFormData({...formData, location: e.target.value})}
          required
        />
        <button type="submit">Register Hospital</button>
      </form>
    </div>
  );
};

export default HospitalRegistration;