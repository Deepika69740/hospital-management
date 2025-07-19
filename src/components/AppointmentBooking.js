// import React, { useState, useEffect } from 'react';
// import { getDoctors, getHospitals, bookAppointment } from '../api/api';
// import { format, parseISO } from 'date-fns';

// const AppointmentBooking = () => {
//   const [doctors, setDoctors] = useState([]);
//   const [hospitals, setHospitals] = useState([]);
//   const [selectedDoctor, setSelectedDoctor] = useState('');
//   const [selectedHospital, setSelectedHospital] = useState('');
//   const [availableSlots, setAvailableSlots] = useState([]);
//   const [selectedSlot, setSelectedSlot] = useState('');
//   const [bookingSuccess, setBookingSuccess] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         const [doctorsRes, hospitalsRes] = await Promise.all([
//           getDoctors(),
//           getHospitals()
//         ]);
//         setDoctors(doctorsRes.data);
//         setHospitals(hospitalsRes.data);
//       } catch (err) {
//         setError('Failed to load data');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

//   useEffect(() => {
//     if (selectedDoctor && selectedHospital) {
//       const doctor = doctors.find(d => d.id === selectedDoctor);
//       if (doctor && doctor.availability) {
//         const hospitalSlots = doctor.availability
//           .filter(slot => slot.hospitalId === selectedHospital && !slot.booked)
//           .map(slot => ({
//             ...slot,
//             formattedTime: `${format(parseISO(slot.date), 'MMM d, yyyy')} ${slot.startTime} - ${slot.endTime}`
//           }));
//         setAvailableSlots(hospitalSlots);
//       } else {
//         setAvailableSlots([]);
//       }
//     } else {
//       setAvailableSlots([]);
//     }
//   }, [selectedDoctor, selectedHospital, doctors]);

//   const handleBooking = async () => {
//     if (!selectedDoctor || !selectedHospital || !selectedSlot) {
//       setError('Please select all required fields');
//       return;
//     }

//     setLoading(true);
//     setError(null);
//     try {
//       const slot = availableSlots.find(s => s.id === selectedSlot);
//       await bookAppointment({
//         doctorId: selectedDoctor,
//         patientId: "1", // Should come from auth in real app
//         hospitalId: selectedHospital,
//         slotId: selectedSlot,
//         date: slot.date,
//         startTime: slot.startTime,
//         endTime: slot.endTime,
//         fee: slot.fee || 0,
//         status: 'confirmed'
//       });
//       setBookingSuccess(true);
      
//       // Update local doctor data to mark slot as booked
//       const updatedDoctors = doctors.map(doctor => {
//         if (doctor.id === selectedDoctor) {
//           return {
//             ...doctor,
//             availability: doctor.availability.map(slot => 
//               slot.id === selectedSlot ? { ...slot, booked: true } : slot
//             )
//           };
//         }
//         return doctor;
//       });
//       setDoctors(updatedDoctors);
      
//       // Reset form
//       setSelectedSlot('');
//       setAvailableSlots(availableSlots.filter(s => s.id !== selectedSlot));
//     } catch (err) {
//       setError('Failed to book appointment');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Get hospitals where the selected doctor works
//   const getDoctorHospitals = () => {
//     if (!selectedDoctor) return [];
//     const doctor = doctors.find(d => d.id === selectedDoctor);
//     if (!doctor || !doctor.hospitalIds) return [];
//     return hospitals.filter(hospital => 
//       doctor.hospitalIds.includes(hospital.id)
//     );
//   };

//   return (
//     <div className="card">
//       <h2>Book Appointment</h2>
//       {error && <div className="error">{error}</div>}
//       {bookingSuccess && (
//         <div className="success">
//           Appointment booked successfully!
//           <button onClick={() => setBookingSuccess(false)}>Book Another</button>
//         </div>
//       )}

//       {!bookingSuccess && (
//         <>
//           <div className="form-group">
//             <label>Select Doctor:</label>
//             <select 
//               onChange={(e) => {
//                 setSelectedDoctor(e.target.value);
//                 setSelectedHospital('');
//                 setSelectedSlot('');
//               }}
//               value={selectedDoctor}
//               disabled={loading}
//             >
//               <option value="">Select a doctor</option>
//               {doctors.map(doctor => (
//                 <option key={doctor.id} value={doctor.id}>
//                   {doctor.name} ({doctor.specializations?.join(', ') || 'General'})
//                 </option>
//               ))}
//             </select>
//           </div>

//           {selectedDoctor && (
//             <div className="form-group">
//               <label>Select Hospital:</label>
//               <select 
//                 onChange={(e) => {
//                   setSelectedHospital(e.target.value);
//                   setSelectedSlot('');
//                 }}
//                 value={selectedHospital}
//                 disabled={loading}
//               >
//                 <option value="">Select a hospital</option>
//                 {getDoctorHospitals().map(hospital => (
//                   <option key={hospital.id} value={hospital.id}>
//                     {hospital.name} - {hospital.location}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           )}

//           {selectedHospital && (
//             <div className="form-group">
//               <label>Available Time Slots:</label>
//               {availableSlots.length > 0 ? (
//                 <select
//                   onChange={(e) => setSelectedSlot(e.target.value)}
//                   value={selectedSlot}
//                   disabled={loading}
//                 >
//                   <option value="">Select a time slot</option>
//                   {availableSlots.map(slot => (
//                     <option key={slot.id} value={slot.id}>
//                       {slot.formattedTime} (Fee: ${slot.fee || 0})
//                     </option>
//                   ))}
//                 </select>
//               ) : (
//                 <p>No available slots for this doctor at selected hospital</p>
//               )}
//             </div>
//           )}

//           {selectedSlot && (
//             <div className="form-group">
//               <button 
//                 onClick={handleBooking}
//                 disabled={loading}
//                 className="primary-button"
//               >
//                 {loading ? 'Booking...' : 'Confirm Appointment'}
//               </button>
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// export default AppointmentBooking;

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getDoctors, getHospitals, bookAppointment, getPatients } from '../api/api';
import { format, parseISO } from 'date-fns';

const AppointmentBooking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const patientId = queryParams.get('patientId');

  const [doctors, setDoctors] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(patientId || '');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedHospital, setSelectedHospital] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [loading, setLoading] = useState({
    doctors: false,
    hospitals: false,
    patients: false,
    booking: false
  });
  const [error, setError] = useState(null);

  // Fetch all necessary data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(prev => ({ ...prev, doctors: true, hospitals: true, patients: true }));
        
        const [doctorsRes, hospitalsRes, patientsRes] = await Promise.all([
          getDoctors(),
          getHospitals(),
          getPatients()
        ]);

        setDoctors(doctorsRes.data);
        setHospitals(hospitalsRes.data);
        setPatients(patientsRes.data);
      } catch (err) {
        setError('Failed to load initial data');
      } finally {
        setLoading(prev => ({ ...prev, doctors: false, hospitals: false, patients: false }));
      }
    };

    fetchData();
  }, []);

  // Filter hospitals based on selected doctor
  const getDoctorHospitals = () => {
    if (!selectedDoctor) return [];
    const doctor = doctors.find(d => d.id === selectedDoctor);
    if (!doctor || !doctor.hospitalIds) return [];
    return hospitals.filter(hospital => 
      doctor.hospitalIds.includes(hospital.id)
    );
  };

  // Get available slots when doctor and hospital are selected
  useEffect(() => {
    if (selectedDoctor && selectedHospital) {
      const doctor = doctors.find(d => d.id === selectedDoctor);
      if (doctor && doctor.availability) {
        const slots = doctor.availability
          .filter(slot => 
            slot.hospitalId === selectedHospital && 
            !slot.booked
          )
          .map(slot => ({
            ...slot,
            formattedTime: `${format(parseISO(slot.date), 'MMM d, yyyy')} | ${slot.startTime} - ${slot.endTime} | Fee: $${slot.fee || 0}`
          }));
        setAvailableSlots(slots);
      } else {
        setAvailableSlots([]);
      }
    } else {
      setAvailableSlots([]);
    }
  }, [selectedDoctor, selectedHospital, doctors]);

  const handleBooking = async () => {
    if (!selectedPatient || !selectedDoctor || !selectedHospital || !selectedSlot) {
      setError('Please fill all required fields');
      return;
    }

    setLoading(prev => ({ ...prev, booking: true }));
    setError(null);

    try {
      const slot = availableSlots.find(s => s.id === selectedSlot);
      await bookAppointment({
        doctorId: selectedDoctor,
        patientId: selectedPatient,
        hospitalId: selectedHospital,
        slotId: selectedSlot,
        date: slot.date,
        startTime: slot.startTime,
        endTime: slot.endTime,
        fee: slot.fee || 0,
        status: 'confirmed'
      });

      setBookingSuccess(true);
      
      // Redirect to patient dashboard after 2 seconds
      setTimeout(() => {
        navigate(`/patient-dashboard?patientId=${selectedPatient}`);
      }, 2000);
    } catch (err) {
      setError('Booking failed. Please try again.');
    } finally {
      setLoading(prev => ({ ...prev, booking: false }));
    }
  };

  return (
    <div className="appointment-booking">
      <h2>Book Appointment</h2>
      
      {error && <div className="error-message">{error}</div>}
      {bookingSuccess && (
        <div className="success-message">
          Appointment booked successfully! Redirecting to dashboard...
        </div>
      )}

      {!bookingSuccess && (
        <>
          {/* Patient Selection (only shown if no patientId in URL) */}
          {!patientId && (
            <div className="form-section">
              <label>Select Patient:</label>
              <select
                value={selectedPatient}
                onChange={(e) => setSelectedPatient(e.target.value)}
                disabled={loading.patients}
              >
                <option value="">Select a patient</option>
                {patients.map(patient => (
                  <option key={patient.id} value={patient.id}>
                    {patient.name} (ID: {patient.idNumber})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Doctor Selection */}
          <div className="form-section">
            <label>Select Doctor:</label>
            <select
              value={selectedDoctor}
              onChange={(e) => {
                setSelectedDoctor(e.target.value);
                setSelectedHospital('');
                setSelectedSlot('');
              }}
              disabled={loading.doctors}
            >
              <option value="">Select a doctor</option>
              {doctors.map(doctor => (
                <option key={doctor.id} value={doctor.id}>
                  Dr. {doctor.name} ({doctor.specializations?.join(', ') || 'General'})
                </option>
              ))}
            </select>
          </div>

          {/* Hospital Selection */}
          {selectedDoctor && (
            <div className="form-section">
              <label>Select Hospital:</label>
              <select
                value={selectedHospital}
                onChange={(e) => {
                  setSelectedHospital(e.target.value);
                  setSelectedSlot('');
                }}
                disabled={loading.hospitals}
              >
                <option value="">Select a hospital</option>
                {getDoctorHospitals().map(hospital => (
                  <option key={hospital.id} value={hospital.id}>
                    {hospital.name} ({hospital.location})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Time Slot Selection */}
          {selectedHospital && (
            <div className="form-section">
              <label>Available Time Slots:</label>
              {availableSlots.length > 0 ? (
                <select
                  value={selectedSlot}
                  onChange={(e) => setSelectedSlot(e.target.value)}
                  disabled={loading.booking}
                >
                  <option value="">Select a time slot</option>
                  {availableSlots.map(slot => (
                    <option key={slot.id} value={slot.id}>
                      {slot.formattedTime}
                    </option>
                  ))}
                </select>
              ) : (
                <p className="no-slots">No available slots for this doctor at selected hospital</p>
              )}
            </div>
          )}

          {/* Booking Button */}
          {selectedSlot && (
            <button
              onClick={handleBooking}
              disabled={loading.booking}
              className="book-button"
            >
              {loading.booking ? 'Processing...' : 'Confirm Appointment'}
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default AppointmentBooking;