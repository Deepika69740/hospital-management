// import React from 'react';
// import { Routes, Route } from 'react-router-dom';
// import Layout from './components/Layout';
// import HospitalAdmin from './components/HospitalAdmin';
// import DoctorDashboard from './components/DoctorDashboard';
// import PatientDashboard from './components/PatientDashboard';
// import HospitalRegistration from './components/HospitalRegistration';
// import DoctorRegistration from './components/DoctorRegistration';
// import PatientRegistration from './components/PatientRegistration';
// import AppointmentBooking from './components/AppointmentBooking';
// import { AuthProvider } from './contexts/AuthContext';

// function App() {
//   return (
//     <AuthProvider>
//       <Routes>
//         <Route path="/" element={<Layout />}>
//           <Route path="hospital-admin" element={<HospitalAdmin />} />
//           <Route path="doctor-dashboard" element={<DoctorDashboard />} />
//           <Route path="patient-dashboard" element={<PatientDashboard />} />
//           <Route path="register-hospital" element={<HospitalRegistration />} />
//           <Route path="register-doctor" element={<DoctorRegistration />} />
//           <Route path="register-patient" element={<PatientRegistration />} />
//           <Route path="book-appointment" element={<AppointmentBooking />} />
//         </Route>
//       </Routes>
//     </AuthProvider>
//   );
// }

// export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HospitalAdmin from './components/HospitalAdmin';
import DoctorDashboard from './components/DoctorDashboard';
import PatientDashboard from './components/PatientDashboard';
import HospitalRegistration from './components/HospitalRegistration';
import DoctorRegistration from './components/DoctorRegistration';
import PatientRegistration from './components/PatientRegistration';
import AppointmentBooking from './components/AppointmentBooking';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="hospital-admin" element={<HospitalAdmin />} />
          <Route path="doctor-dashboard" element={<DoctorDashboard />} />
          <Route path="patient-dashboard" element={<PatientDashboard />} />
          <Route path="register-hospital" element={<HospitalRegistration />} />
          <Route path="register-doctor" element={<DoctorRegistration />} />
          <Route path="register-patient" element={<PatientRegistration />} />
          <Route path="book-appointment" element={<AppointmentBooking />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;