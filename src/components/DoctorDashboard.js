// import React, { useState, useEffect } from 'react';
// import { getAppointments } from '../api/api';

// const DoctorDashboard = () => {
//   const [reports, setReports] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const doctorId = "1"; // Using the doctor ID from your db.json

//   useEffect(() => {
//     fetchDoctorReports();
//   }, []);

//   const fetchDoctorReports = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await getAppointments(doctorId, 'doctor');
//       const data = Array.isArray(response?.data) ? response.data : [];
      
//       // Calculate doctor's share (60% of fee)
//       const calculateDoctorEarnings = (fee) => (fee || 0) * 0.6;

//       // Process data with fee calculations
//       const totalEarnings = data.reduce((sum, appt) => 
//         sum + calculateDoctorEarnings(appt.fee), 0);
      
//       const totalFees = data.reduce((sum, appt) => sum + (appt.fee || 0), 0);
      
//       // Group by hospital with fee breakdown
//       const earningsByHospital = data.reduce((acc, appt) => {
//         const hospitalId = appt.hospitalId || 'unknown';
//         const hospital = hospitals.find(h => h.id === hospitalId.toString()) || {};
//         const hospitalName = hospital.name || 'Unknown Hospital';
        
//         if (!acc[hospitalId]) {
//           acc[hospitalId] = {
//             name: hospitalName,
//             totalFees: 0,
//             doctorEarnings: 0,
//             hospitalShare: 0
//           };
//         }
        
//         acc[hospitalId].totalFees += appt.fee || 0;
//         acc[hospitalId].doctorEarnings += calculateDoctorEarnings(appt.fee);
//         acc[hospitalId].hospitalShare += (appt.fee || 0) * 0.4;
        
//         return acc;
//       }, {});

//       setReports({
//         totalEarnings,
//         totalFees,
//         totalConsultations: data.length,
//         earningsByHospital: Object.values(earningsByHospital),
//         appointments: data.map(appt => {
//           const patient = patients.find(p => p.id === appt.patientId?.toString()) || {};
//           const hospital = hospitals.find(h => h.id === appt.hospitalId?.toString()) || {};
          
//           return {
//             ...appt,
//             patientName: patient.name || 'Unknown Patient',
//             hospitalName: hospital.name || 'Unknown Hospital',
//             date: appt.date || 'Unknown Date',
//             doctorEarning: calculateDoctorEarnings(appt.fee),
//             hospitalShare: (appt.fee || 0) * 0.4
//           };
//         })
//       });
//     } catch (err) {
//       setError('Failed to load doctor reports');
//       console.error('Error:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Mock data - in real app, fetch these from API
//   const hospitals = [
//     { id: "1", name: "City General Hospital", location: "New York" },
//     { id: "2", name: "Metro Health Center", location: "Chicago" }
//   ];

//   const patients = [
//     { id: "1", name: "John Doe" },
//     { id: "5bca", name: "venkata sai deepika" }
//   ];

//   return (
//     <div className="card">
//       <h2>Doctor Dashboard</h2>
//       {error && <div className="error">{error}</div>}
//       {loading && <p>Loading reports...</p>}

//       {reports ? (
//         <div>
//           <h3>Financial Summary</h3>
//           <div className="summary-grid">
//             <div className="summary-item">
//               <h4>Total Consultation Fees</h4>
//               <p>${reports.totalFees.toFixed(2)}</p>
//             </div>
//             <div className="summary-item">
//               <h4>Your Earnings (60%)</h4>
//               <p>${reports.totalEarnings.toFixed(2)}</p>
//             </div>
//             <div className="summary-item">
//               <h4>Hospital Share (40%)</h4>
//               <p>${(reports.totalFees - reports.totalEarnings).toFixed(2)}</p>
//             </div>
//             <div className="summary-item">
//               <h4>Total Consultations</h4>
//               <p>{reports.totalConsultations}</p>
//             </div>
//           </div>
          
//           <h3>Earnings by Hospital</h3>
//           {reports.earningsByHospital.length > 0 ? (
//             <table className="earnings-table">
//               <thead>
//                 <tr>
//                   <th>Hospital</th>
//                   <th>Total Fees</th>
//                   <th>Your Earnings</th>
//                   <th>Hospital Share</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {reports.earningsByHospital.map((item, index) => (
//                   <tr key={index}>
//                     <td>{item.name}</td>
//                     <td>${item.totalFees.toFixed(2)}</td>
//                     <td>${item.doctorEarnings.toFixed(2)}</td>
//                     <td>${item.hospitalShare.toFixed(2)}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           ) : (
//             <p>No hospital earnings data available</p>
//           )}
          
//           <h3>Appointment Details</h3>
//           {reports.appointments.length > 0 ? (
//             <table className="appointments-table">
//               <thead>
//                 <tr>
//                   <th>Date</th>
//                   <th>Patient</th>
//                   <th>Hospital</th>
//                   <th>Fee</th>
//                   <th>Your Share</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {reports.appointments.map(appt => (
//                   <tr key={appt.id}>
//                     <td>{appt.date} {appt.time && `at ${appt.time}`}</td>
//                     <td>{appt.patientName}</td>
//                     <td>{appt.hospitalName}</td>
//                     <td>${appt.fee?.toFixed(2) || '0.00'}</td>
//                     <td>${appt.doctorEarning?.toFixed(2) || '0.00'}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           ) : (
//             <p>No appointments found</p>
//           )}
//         </div>
//       ) : (
//         !loading && <p>No reports available</p>
//       )}
//     </div>
//   );
// };

// export default DoctorDashboard;

import React, { useState, useEffect } from 'react';
import { getAppointments, getHospitals } from '../api/api';

const DoctorDashboard = () => {
  const [doctorData, setDoctorData] = useState({
    totalEarnings: 0,
    totalConsultations: 0,
    earningsByHospital: []
  });
  const [loading, setLoading] = useState(false);
  const doctorId = "1"; // In real app, get from auth context

  useEffect(() => {
    const fetchDoctorData = async () => {
      setLoading(true);
      try {
        const [appointmentsRes, hospitalsRes] = await Promise.all([
          getAppointments(doctorId, 'doctor'),
          getHospitals()
        ]);

        const appointments = appointmentsRes.data || [];
        const hospitals = hospitalsRes.data || [];

        // Calculate earnings (60% of consultation fee)
        const calculateEarnings = (fee) => (fee || 0) * 0.6;

        // Group by hospital
        const byHospital = appointments.reduce((acc, appointment) => {
          const hospitalId = appointment.hospitalId;
          if (!acc[hospitalId]) {
            acc[hospitalId] = {
              hospital: hospitals.find(h => h.id === hospitalId) || { name: 'Unknown Hospital' },
              consultations: 0,
              totalFees: 0,
              doctorEarnings: 0
            };
          }
          acc[hospitalId].consultations++;
          acc[hospitalId].totalFees += appointment.fee || 0;
          acc[hospitalId].doctorEarnings += calculateEarnings(appointment.fee);
          return acc;
        }, {});

        setDoctorData({
          totalEarnings: appointments.reduce((sum, a) => sum + calculateEarnings(a.fee), 0),
          totalConsultations: appointments.length,
          earningsByHospital: Object.values(byHospital)
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorData();
  }, [doctorId]);

  return (
    <div className="doctor-dashboard">
      <h2>Doctor Dashboard</h2>
      
      {loading ? (
        <div className="loading">Loading your data...</div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="summary-cards">
            <div className="summary-card">
              <h3>Total Consultations</h3>
              <p>{doctorData.totalConsultations}</p>
            </div>
            <div className="summary-card">
              <h3>Total Earnings (60%)</h3>
              <p>${doctorData.totalEarnings.toFixed(2)}</p>
            </div>
          </div>

          {/* Earnings by Hospital */}
          <div className="earnings-section">
            <h3>Earnings Breakdown by Hospital</h3>
            <table>
              <thead>
                <tr>
                  <th>Hospital</th>
                  <th>Consultations</th>
                  <th>Total Fees</th>
                  <th>Your Earnings (60%)</th>
                  <th>Hospital Share (40%)</th>
                </tr>
              </thead>
              <tbody>
                {doctorData.earningsByHospital.map((hospital, index) => (
                  <tr key={index}>
                    <td>{hospital.hospital.name}</td>
                    <td>{hospital.consultations}</td>
                    <td>${hospital.totalFees.toFixed(2)}</td>
                    <td>${hospital.doctorEarnings.toFixed(2)}</td>
                    <td>${(hospital.totalFees - hospital.doctorEarnings).toFixed(2)}</td>
                  </tr>
                ))}
                {doctorData.earningsByHospital.length === 0 && (
                  <tr>
                    <td colSpan="5">No consultation data available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Recent Activity */}
          {doctorData.totalConsultations > 0 && (
            <div className="recent-activity">
              <h3>Recent Consultations</h3>
              <p>Showing your last 5 appointments</p>
              {/* You would implement this by fetching recent appointments */}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DoctorDashboard;