"use client";

import 'bootstrap/dist/css/bootstrap.min.css';
import { useRef } from 'react';
function DoctorRegistration() {
  const nameref = useRef();
  const specializationref=useRef();
  const experienceref =useRef();
  const contactref =useRef();
  const emailref =useRef();
  const hospitalref =useRef();
  const handlesubmint = (e) => {
  e.preventDefault();
  console.log("Submit clicked — logic will be added soon");
};

const handleDoctor = () => {
  console.log("Show doctors — logic will be added later");
};

 
  return (
    <div className="container mt-5 d-flex justify-content-center">
      <div className="card shadow-lg p-4" style={{ maxWidth: '500px', backgroundColor: '#f4f8fb', borderRadius: '10px' }}>
        <h2 className="text-center mb-4 text-primary">Doctor Registration</h2>
        <form onSubmit={handlesubmint}>
          <div className="mb-3">
            <label className="form-label">Full Name</label>
            <input type="text" ref={nameref} placeholder="Enter full name" required className="form-control" />
          </div>
          <div className="mb-3">
            <label className="form-label">Specialization</label>
            <input type="text" ref={specializationref} placeholder="Enter specialization" required className="form-control" />
          </div>
          <div className="mb-3">
            <label className="form-label">Years of Experience</label>
            <input type="number" ref={experienceref} placeholder="Enter experience" required className="form-control" />
          </div>
          <div className="mb-3">
            <label className="form-label">Contact Number</label>
            <input type="text" ref={contactref} placeholder="Enter contact number" required className="form-control" />
          </div>
          <div className="mb-3">
            <label className="form-label">Email Address</label>
            <input type="email" ref={emailref} placeholder="Enter email" required className="form-control" />
          </div>
          <div className="mb-3">
            <label className="form-label">Hospital Name</label>
            <input type="text" ref={hospitalref} placeholder="Enter hospital name" required className="form-control" />
          </div>
          <button type="submit" className="btn btn-primary w-100 mb-3">Register</button>
          
        </form>
        <button className="btn btn-info w-100" onClick={handleDoctor}>Show-Doctors</button>
      </div>
    

    </div>
  );
}

export default DoctorRegistration;