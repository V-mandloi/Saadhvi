"use client";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';

export default function AddHospital() {
  const [formData, setFormData] = useState({
    name: '',
    specialization: '',
    registrationNumber: '',
    contact: '',
    email: '',
    address: '',
    password: '',
  });

  const [confirmPassword, setConfirmPassword] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    if (formData.password.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }

    try {
      const res = await fetch('/api/hospital', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Something went wrong");

      alert("Hospital registered successfully!");
      setFormData({
        name: '',
        specialization: '',
        registrationNumber: '',
        contact: '',
        email: '',
        address: '',
        password: '',
      });
      setConfirmPassword('');
      console.log(formData);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center" style={{ minHeight: '100vh', background: 'linear-gradient(to right, #e3f2fd, #f1f8ff)' }}>
      <div className="card shadow-lg p-4 p-md-5" style={{ maxWidth: '650px', width: '100%', borderRadius: '20px', backgroundColor: '#ffffff' }}>
        <h2 className="text-center mb-4 text-primary fw-bold">Hospital Registration</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Hospital Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required className="form-control rounded-3 p-2" placeholder="e.g., City Care Hospital" />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Specialization</label>
            <input type="text" name="specialization" value={formData.specialization} onChange={handleChange} required className="form-control rounded-3 p-2" placeholder="e.g., Cardiology, Orthopedic" />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Registration Number</label>
            <input type="text" name="registrationNumber" value={formData.registrationNumber} onChange={handleChange} required className="form-control rounded-3 p-2" placeholder="Hospital Reg. No." />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Contact Number</label>
            <input type="tel" name="contact" value={formData.contact} onChange={handleChange} required className="form-control rounded-3 p-2" placeholder="e.g., 9876543210" />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required className="form-control rounded-3 p-2" placeholder="e.g., contact@hospital.com" />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Address</label>
            <textarea name="address" value={formData.address} onChange={handleChange} rows={2} required className="form-control rounded-3 p-2" placeholder="Full Address"></textarea>
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required className="form-control rounded-3 p-2" placeholder="Min. 6 characters" />
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold">Confirm Password</label>
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="form-control rounded-3 p-2" placeholder="Re-enter password" />
          </div>

          <button type="submit" className="btn btn-primary w-100 mb-2 rounded-pill">Register Hospital</button>
        </form>
      </div>
    </div>
  );
}
