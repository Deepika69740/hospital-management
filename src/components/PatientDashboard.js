import React, { useState, useEffect } from 'react';
import { getAppointments, getHospitals, getDoctors, getPatients } from '../api/api';

const PatientDashboard = () => {
  const [history, setHistory] = useState([]);
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const patientId = "1"; // Should come from auth in real app

  useEffect(() => {
    const fetchPatientData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch all data in parallel
        const [appointmentsRes, patientsRes, hospitalsRes, doctorsRes] = await Promise.all([
          getAppointments(patientId, 'patient'),
          getPatients(),
          getHospitals(),
          getDoctors()
        ]);

        // Find the current patient from appointments if not found in patients list
        let currentPatient = patientsRes.data.find(p => p.id === patientId);
        
        // If patient not found in patients list, try to get from appointments
        if (!currentPatient && appointmentsRes.data.length > 0) {
          const latestAppointment = appointmentsRes.data[0];
          currentPatient = {
            id: patientId,
            name: latestAppointment.patientName || 'Patient ' + patientId,
            gender: latestAppointment.patientGender || 'Not specified',
            dob: latestAppointment.patientDob || 'Not specified',
            idNumber: latestAppointment.patientIdNumber || 'Not specified'
          };
        }

        setPatient(currentPatient || {
          id: patientId,
          name: 'Patient ' + patientId,
          gender: 'Not specified',
          dob: 'Not specified',
          idNumber: 'Not specified'
        });

        // Enrich appointment data
        const enrichedData = appointmentsRes.data.map(appt => ({
          ...appt,
          hospital: hospitalsRes.data.find(h => h.id === appt.hospitalId) || { name: 'Unknown Hospital' },
          doctor: doctorsRes.data.find(d => d.id === appt.doctorId) || { name: 'Unknown Doctor' },
          // Use patient details from appointment if available
          patientName: appt.patientName || currentPatient?.name || 'Patient',
          patientGender: appt.patientGender || currentPatient?.gender,
          patientDob: appt.patientDob || currentPatient?.dob
        }));

        setHistory(enrichedData);
      } catch (err) {
        setError('Failed to load patient data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPatientData();
  }, [patientId]);

  return (
    <div className="dashboard">
      <h2>Patient Consultation History</h2>
      
      {error && <div className="error">{error}</div>}
      {loading && <p>Loading history...</p>}

      {patient && (
        <div className="patient-info">
          <h3>{patient.name}</h3>
          <div className="patient-details">
            <p><strong>Gender:</strong> {patient.gender}</p>
            <p><strong>Date of Birth:</strong> {patient.dob}</p>
            <p><strong>ID:</strong> {patient.idNumber}</p>
          </div>
        </div>
      )}

      {history.length > 0 ? (
        <div className="history-section">
          <h4>Consultation Records</h4>
          <table className="history-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Hospital</th>
                <th>Doctor</th>
                <th>Department</th>
                <th>Fee</th>
              </tr>
            </thead>
            <tbody>
              {history.map((appt, i) => (
                <tr key={i}>
                  <td>{appt.date} {appt.time && `at ${appt.time}`}</td>
                  <td>{appt.hospital.name}</td>
                  <td>{appt.doctor.name}</td>
                  <td>{appt.doctor.specializations?.[0] || 'General'}</td>
                  <td>${appt.fee?.toFixed(2) || '0.00'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        !loading && <p>No consultation history found</p>
      )}
    </div>
  );
};

export default PatientDashboard;