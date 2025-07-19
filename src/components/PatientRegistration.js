// import React, { useState } from 'react';
// import { registerPatient } from '../api/api';

// const PatientRegistration = () => {
//   const [formData, setFormData] = useState({
//     name: '',
//     gender: '',
//     dob: '',
//     idNumber: ''
//   });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await registerPatient(formData);
//       alert('Patient registered successfully!');
//       setFormData({ name: '', gender: '', dob: '', idNumber: '' });
//     } catch (error) {
//       console.error('Registration failed:', error);
//     }
//   };

//   return (
//     <div className="card">
//       <h2>Register Patient</h2>
//       <form onSubmit={handleSubmit}>
//         <input
//           type="text"
//           placeholder="Full Name"
//           value={formData.name}
//           onChange={(e) => setFormData({...formData, name: e.target.value})}
//           required
//         />
//         <select
//           value={formData.gender}
//           onChange={(e) => setFormData({...formData, gender: e.target.value})}
//           required
//         >
//           <option value="">Select Gender</option>
//           <option value="Male">Male</option>
//           <option value="Female">Female</option>
//           <option value="Other">Other</option>
//         </select>
//         <input
//           type="date"
//           placeholder="Date of Birth"
//           value={formData.dob}
//           onChange={(e) => setFormData({...formData, dob: e.target.value})}
//           required
//         />
//         <input
//           type="text"
//           placeholder="ID Number (Aadhar/Passport)"
//           value={formData.idNumber}
//           onChange={(e) => setFormData({...formData, idNumber: e.target.value})}
//           required
//         />
//         <button type="submit">Register Patient</button>
//       </form>
//     </div>
//   );
// };

// export default PatientRegistration;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerPatient } from '../api/api';

const PatientRegistration = () => {
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    dob: '',
    idNumber: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await registerPatient(formData);
      alert('Patient registered successfully!');
      // Navigate to booking page with patient ID
      navigate(`/book-appointment?patientId=${response.data.id}`);
    } catch (error) {
      setError('Registration failed. Please try again.');
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>Register Patient</h2>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Full Name:</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
        </div>

        <div className="form-group">
          <label>Gender:</label>
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
        </div>

        <div className="form-group">
          <label>Date of Birth:</label>
          <input
            type="date"
            value={formData.dob}
            onChange={(e) => setFormData({...formData, dob: e.target.value})}
            required
          />
        </div>

        <div className="form-group">
          <label>ID Number:</label>
          <input
            type="text"
            value={formData.idNumber}
            onChange={(e) => setFormData({...formData, idNumber: e.target.value})}
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Registering...' : 'Register Patient'}
        </button>
      </form>
    </div>
  );
};

export default PatientRegistration;