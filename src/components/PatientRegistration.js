import React, { useState } from 'react';
import { registerPatient } from '../api/api';

const PatientRegistration = () => {
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    dob: '',
    idNumber: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerPatient(formData);
      alert('Patient registered successfully!');
      setFormData({ name: '', gender: '', dob: '', idNumber: '' });
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <div className="card">
      <h2>Register Patient</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Full Name"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          required
        />
        <select
          value={formData.gender}
          onChange={(e) => setFormData({...formData, gender: e.target.value})}
          required
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        <input
          type="date"
          placeholder="Date of Birth"
          value={formData.dob}
          onChange={(e) => setFormData({...formData, dob: e.target.value})}
          required
        />
        <input
          type="text"
          placeholder="ID Number (Aadhar/Passport)"
          value={formData.idNumber}
          onChange={(e) => setFormData({...formData, idNumber: e.target.value})}
          required
        />
        <button type="submit">Register Patient</button>
      </form>
    </div>
  );
};

export default PatientRegistration;

