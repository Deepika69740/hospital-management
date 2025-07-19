import React, { useState } from 'react';
import { registerDoctor } from '../api/api';

const DoctorRegistration = () => {
  const [formData, setFormData] = useState({
    name: '',
    qualifications: '',
    specializations: '',
    experience: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerDoctor({
        ...formData,
        specializations: formData.specializations.split(',').map(s => s.trim())
      });
      alert('Doctor registered successfully!');
      setFormData({ name: '', qualifications: '', specializations: '', experience: '' });
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <div className="card">
      <h2>Register Doctor</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Full Name"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          required
        />
        <input
          type="text"
          placeholder="Qualifications"
          value={formData.qualifications}
          onChange={(e) => setFormData({...formData, qualifications: e.target.value})}
          required
        />
        <input
          type="text"
          placeholder="Specializations (comma separated)"
          value={formData.specializations}
          onChange={(e) => setFormData({...formData, specializations: e.target.value})}
          required
        />
        <input
          type="number"
          placeholder="Years of Experience"
          value={formData.experience}
          onChange={(e) => setFormData({...formData, experience: e.target.value})}
          required
        />
        <button type="submit">Register Doctor</button>
      </form>
    </div>
  );
};

export default DoctorRegistration;