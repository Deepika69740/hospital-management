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