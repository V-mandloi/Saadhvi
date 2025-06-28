"use client";

import 'bootstrap/dist/css/bootstrap.min.css';
import { useRef } from 'react';
function AddHospital() {
   const nameref = useRef();
  const specializationref=useRef();
  const registrationref =useRef();
  const contactref =useRef();
  const emailref =useRef();
  const addressref =useRef();
 const handlesubmint = async (e) => {
  e.preventDefault();

  const data = {
    name: nameref.current.value,
    specialization: specializationref.current.value,
    registrationNumber: registrationref.current.value,
    contact: contactref.current.value,
    email: emailref.current.value,
    address: addressref.current.value
  };
  console.log(data);
  try {
    const res = await fetch("/api/hospital", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const result = await res.json();

    if (res.ok) {
      alert("Hospital Registered Successfully!");
      console.log("Response:", result);
    } else {
      alert(result.error || "Something went wrong.");
      console.error("Error:", result);
    }
  } catch (err) {
    alert("Error occurred while submitting.");
    console.error("Submit Error:", err);
  }
};


const showHospitals = () => {
  console.log("Show doctors — logic will be added later");
};

 
  return (
    <div className="container mt-5 d-flex justify-content-center">
      <div className="card shadow-lg p-4" style={{ maxWidth: '500px', backgroundColor: '#f4f8fb', borderRadius: '10px' }}>
        <h2 className="text-center mb-4 text-primary">Hospital Registration</h2>
        <form onSubmit={handlesubmint}>
          <div className="mb-3">
            <label className="form-label">Hospital Name</label>
            <input type="text" ref={nameref} placeholder="Enter hospital name" required className="form-control" />
          </div>
          <div className="mb-3">
            <label className="form-label">Specialization</label>
            <input type="text" ref={specializationref} placeholder="Enter specialization" required className="form-control" />
          </div>
          <div className="mb-3">
            <label className="form-label">Registration - Number</label>
            <input type="text" ref={registrationref} placeholder="Enter hospital registration " required className="form-control" />
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
            <label className="form-label">Address</label>
            <input type="text" ref={addressref} placeholder="Enter hospital address" required className="form-control" />
          </div>
          <button type="submit" className="btn btn-primary w-100 mb-3">Register</button>
          
        </form>
        <button className="btn btn-info w-100" onClick={showHospitals}>Show-All-Hospitals</button>
      </div>
    

    </div>
  ); 
}
export default AddHospital;