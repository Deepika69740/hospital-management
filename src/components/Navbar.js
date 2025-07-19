import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav>
      <Link to="/hospital-admin">Hospital Admin</Link>
      <Link to="/doctor-dashboard">Doctor Dashboard</Link>
      <Link to="/patient-dashboard">Patient Dashboard</Link>
      <Link to="/register-hospital">Register Hospital</Link>
      <Link to="/register-doctor">Register Doctor</Link>
      <Link to="/register-patient">Register Patient</Link>
      <Link to="/book-appointment">Book Appointment</Link>
    </nav>
  );
};

export default Navbar;