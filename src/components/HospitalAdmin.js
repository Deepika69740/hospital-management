// import React, { useState, useEffect } from 'react';
// import { getHospitals, getAppointments, getDoctors } from '../api/api';

// const HospitalAdmin = () => {
//   const [hospitals, setHospitals] = useState([]);
//   const [selectedHospital, setSelectedHospital] = useState(null);
//   const [reports, setReports] = useState(null);
//   const [doctors, setDoctors] = useState([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         const [hospitalsRes, doctorsRes] = await Promise.all([
//           getHospitals(),
//           getDoctors()
//         ]);
//         setHospitals(hospitalsRes.data);
//         setDoctors(doctorsRes.data);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

//   const fetchHospitalReports = async (hospitalId) => {
//     setLoading(true);
//     try {
//       const response = await getAppointments(hospitalId, 'hospital');
//       const data = response.data || [];
      
//       // Calculate totals
//       const totalConsultations = data.length;
//       const totalRevenue = data.reduce((sum, appt) => sum + (appt.fee || 0), 0);
      
//       // Revenue by doctor
//       const revenueByDoctor = doctors.reduce((acc, doctor) => {
//         const doctorAppointments = data.filter(a => a.doctorId == doctor.id);
//         const revenue = doctorAppointments.reduce((sum, a) => sum + (a.fee || 0), 0);
//         if (revenue > 0) {
//           acc.push({
//             doctorId: doctor.id,
//             name: doctor.name,
//             revenue,
//             consultations: doctorAppointments.length
//           });
//         }
//         return acc;
//       }, []);
      
//       // Revenue by department (simplified - assumes doctor's first specialization is their department)
//       const revenueByDepartment = doctors.reduce((acc, doctor) => {
//         const department = doctor.specializations?.[0] || 'General';
//         const doctorAppointments = data.filter(a => a.doctorId == doctor.id);
//         const revenue = doctorAppointments.reduce((sum, a) => sum + (a.fee || 0), 0);
        
//         if (!acc[department]) acc[department] = 0;
//         acc[department] += revenue;
//         return acc;
//       }, {});

//       setReports({
//         totalConsultations,
//         totalRevenue,
//         revenueByDoctor,
//         revenueByDepartment: Object.entries(revenueByDepartment).map(([dept, rev]) => ({
//           department: dept,
//           revenue: rev
//         })),
//         appointments: data
//       });
//       setSelectedHospital(hospitalId);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="dashboard">
//       <h2>Hospital Admin Dashboard</h2>
      
//       <div className="hospital-selector">
//         <select 
//           onChange={(e) => fetchHospitalReports(e.target.value)}
//           value={selectedHospital || ''}
//           disabled={loading}
//         >
//           <option value="">Select a hospital</option>
//           {hospitals.map(h => (
//             <option key={h.id} value={h.id}>{h.name} - {h.location}</option>
//           ))}
//         </select>
//       </div>

//       {loading && <p>Loading data...</p>}

//       {selectedHospital && reports && (
//         <div className="hospital-report">
//           <div className="summary-cards">
//             <div className="card">
//               <h3>Total Consultations</h3>
//               <p>{reports.totalConsultations}</p>
//             </div>
//             <div className="card">
//               <h3>Total Revenue</h3>
//               <p>${reports.totalRevenue.toFixed(2)}</p>
//             </div>
//           </div>

//           <div className="section">
//             <h3>Associated Doctors</h3>
//             <table>
//               <thead>
//                 <tr>
//                   <th>Doctor</th>
//                   <th>Consultations</th>
//                   <th>Revenue Generated</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {reports.revenueByDoctor.map(doc => (
//                   <tr key={doc.doctorId}>
//                     <td>{doc.name}</td>
//                     <td>{doc.consultations}</td>
//                     <td>${doc.revenue.toFixed(2)}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           <div className="section">
//             <h3>Revenue by Department</h3>
//             <table>
//               <thead>
//                 <tr>
//                   <th>Department</th>
//                   <th>Revenue</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {reports.revenueByDepartment.map(dept => (
//                   <tr key={dept.department}>
//                     <td>{dept.department}</td>
//                     <td>${dept.revenue.toFixed(2)}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default HospitalAdmin;

import React, { useState, useEffect } from 'react';
import { getHospitals, getAppointments, getDoctors } from '../api/api';

const HospitalAdminDashboard = () => {
  const [hospitals, setHospitals] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [revenueData, setRevenueData] = useState({
    byDoctor: [],
    byDepartment: []
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchHospitals = async () => {
      const res = await getHospitals();
      setHospitals(res.data);
    };
    fetchHospitals();
  }, []);

  const generateRevenueReports = async (hospitalId) => {
    setLoading(true);
    try {
      const [appointmentsRes, doctorsRes] = await Promise.all([
        getAppointments(hospitalId, 'hospital'),
        getDoctors()
      ]);

      const appointments = appointmentsRes.data || [];
      const doctors = doctorsRes.data || [];

      // Revenue by Doctor
      const byDoctor = doctors
        .filter(doctor => doctor.hospitalIds?.includes(hospitalId))
        .map(doctor => {
          const doctorAppointments = appointments.filter(a => a.doctorId === doctor.id);
          const revenue = doctorAppointments.reduce((sum, a) => sum + (a.fee || 0), 0);
          return {
            doctorId: doctor.id,
            name: doctor.name,
            specializations: doctor.specializations?.join(', ') || 'General',
            consultations: doctorAppointments.length,
            revenue
          };
        })
        .filter(doctor => doctor.revenue > 0)
        .sort((a, b) => b.revenue - a.revenue);

      // Revenue by Department
      const byDepartment = doctors.reduce((acc, doctor) => {
        const department = doctor.specializations?.[0] || 'General';
        const doctorAppointments = appointments.filter(a => a.doctorId === doctor.id);
        const revenue = doctorAppointments.reduce((sum, a) => sum + (a.fee || 0), 0);
        
        if (!acc[department]) acc[department] = 0;
        acc[department] += revenue;
        return acc;
      }, {});

      setRevenueData({
        byDoctor,
        byDepartment: Object.entries(byDepartment)
          .map(([department, revenue]) => ({ department, revenue }))
          .sort((a, b) => b.revenue - a.revenue)
      });
      setSelectedHospital(hospitalId);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="hospital-revenue-dashboard">
      <h2>Hospital Revenue Reports</h2>
      
      <div className="hospital-selector">
        <label>Select Hospital:</label>
        <select
          onChange={(e) => generateRevenueReports(e.target.value)}
          value={selectedHospital || ''}
          disabled={loading}
        >
          <option value="">-- Select Hospital --</option>
          {hospitals.map(hospital => (
            <option key={hospital.id} value={hospital.id}>
              {hospital.name} ({hospital.location})
            </option>
          ))}
        </select>
      </div>

      {loading && <div className="loading">Generating reports...</div>}

      {selectedHospital && (
        <div className="revenue-reports">
          {/* Revenue by Doctor */}
          <div className="revenue-section">
            <h3>Revenue by Doctor</h3>
            <table>
              <thead>
                <tr>
                  <th>Doctor</th>
                  <th>Specialization</th>
                  <th>Consultations</th>
                  <th>Revenue Generated</th>
                  <th>Hospital Share (40%)</th>
                </tr>
              </thead>
              <tbody>
                {revenueData.byDoctor.map((doctor, index) => (
                  <tr key={doctor.doctorId}>
                    <td>{doctor.name}</td>
                    <td>{doctor.specializations}</td>
                    <td>{doctor.consultations}</td>
                    <td>${doctor.revenue.toFixed(2)}</td>
                    <td>${(doctor.revenue * 0.4).toFixed(2)}</td>
                  </tr>
                ))}
                {revenueData.byDoctor.length === 0 && (
                  <tr>
                    <td colSpan="5">No revenue data available for doctors</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Revenue by Department */}
          <div className="revenue-section">
            <h3>Revenue by Department</h3>
            <table>
              <thead>
                <tr>
                  <th>Department</th>
                  <th>Total Revenue</th>
                  <th>Percentage</th>
                  <th>Hospital Share (40%)</th>
                </tr>
              </thead>
              <tbody>
                {revenueData.byDepartment.map((dept, index) => {
                  const totalRevenue = revenueData.byDoctor.reduce((sum, d) => sum + d.revenue, 0);
                  const percentage = totalRevenue > 0 
                    ? (dept.revenue / totalRevenue) * 100 
                    : 0;
                  return (
                    <tr key={dept.department}>
                      <td>{dept.department}</td>
                      <td>${dept.revenue.toFixed(2)}</td>
                      <td>{percentage.toFixed(1)}%</td>
                      <td>${(dept.revenue * 0.4).toFixed(2)}</td>
                    </tr>
                  );
                })}
                {revenueData.byDepartment.length === 0 && (
                  <tr>
                    <td colSpan="4">No revenue data available by department</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Summary */}
          {revenueData.byDoctor.length > 0 && (
            <div className="summary">
              <h3>Financial Summary</h3>
              <div className="summary-cards">
                <div className="summary-card">
                  <h4>Total Revenue</h4>
                  <p>${revenueData.byDoctor.reduce((sum, d) => sum + d.revenue, 0).toFixed(2)}</p>
                </div>
                <div className="summary-card">
                  <h4>Hospital's Total Share (40%)</h4>
                  <p>${(revenueData.byDoctor.reduce((sum, d) => sum + d.revenue, 0) * 0.4).toFixed(2)}</p>
                </div>
                <div className="summary-card">
                  <h4>Total Consultations</h4>
                  <p>{revenueData.byDoctor.reduce((sum, d) => sum + d.consultations, 0)}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HospitalAdminDashboard;