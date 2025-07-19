import axios from 'axios';
const API = axios.create({
  baseURL: 'http://localhost:3001' // json-server port
});
export const getHospitals = () => API.get('/hospitals');
export const registerHospital = (data) => API.post('/hospitals', data);
export const getDoctors = () => API.get('/doctors?_embed=availability');
export const registerDoctor = (data) => API.post('/doctors', data);
export const setDoctorAvailability = (doctorId, availability) => 
  API.post(`/availability`, {...availability, doctorId});

// Patient endpoints
export const getPatients = () => API.get('/patients');
export const registerPatient = (data) => API.post('/patients', data);

// Appointment endpoints
export const bookAppointment = (data) => API.post('/appointments', data);
export const getAppointments = (userId, role) => {
  const key = role === 'doctor' ? 'doctorId' : 
             role === 'patient' ? 'patientId' : 
             'hospitalId';
  return API.get(`/appointments?${key}=${userId}&_expand=doctor&_expand=patient&_expand=hospital`);
};