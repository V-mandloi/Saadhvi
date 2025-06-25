"use client";
import React, { useState } from "react";

const initialDoctor = {
  firstName: "",
  lastName: "",
  degreeRegNumber: "",
  email: "",
  phone: "",
  address: "",
};

const initialHospital = {
  hospitalName: "",
  hospitalRegNumber: "",
  email: "",
  contact: "",
  address: "",
};

export default function Register() {
  const [role, setRole] = useState("doctor");
  const [form, setForm] = useState(initialDoctor);
  const [message, setMessage] = useState("");

  const handleRoleChange = (e) => {
    const newRole = e.target.value;
    setRole(newRole);
    setForm(newRole === "doctor" ? initialDoctor : initialHospital);
    setMessage("");
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const endpoint = `/api/register/${role}`;
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Registration successful!");
        setForm(role === "doctor" ? initialDoctor : initialHospital);
      } else {
        setMessage(data.message || "Registration failed.");
      }
    } catch (err) {
      setMessage("Error connecting to server.");
    }
  };

  return (
    <div
      style={{
        maxWidth: 500,
        margin: "40px auto",
        padding: 24,
        border: "1px solid #eee",
        borderRadius: 8,
      }}>
      <h2>Register as</h2>
      <select
        value={role}
        onChange={handleRoleChange}
        style={{ marginBottom: 16 }}>
        <option value="doctor">Doctor</option>
        <option value="hospital">Hospital</option>
      </select>
      <form onSubmit={handleSubmit}>
        {role === "doctor" ? (
          <>
            <input
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              placeholder="First Name"
              required
              className="input"
            />
            <input
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              placeholder="Last Name"
              required
              className="input"
            />
            <input
              name="degreeRegNumber"
              value={form.degreeRegNumber}
              onChange={handleChange}
              placeholder="Degree Registration Number"
              required
              className="input"
            />
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              required
              className="input"
            />
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Phone Number"
              required
              className="input"
            />
            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Address"
              required
              className="input"
            />
          </>
        ) : (
          <>
            <input
              name="hospitalName"
              value={form.hospitalName}
              onChange={handleChange}
              placeholder="Hospital Name"
              required
              className="input"
            />
            <input
              name="hospitalRegNumber"
              value={form.hospitalRegNumber}
              onChange={handleChange}
              placeholder="Hospital Registration Number"
              required
              className="input"
            />
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              required
              className="input"
            />
            <input
              name="contact"
              value={form.contact}
              onChange={handleChange}
              placeholder="Contact Number"
              required
              className="input"
            />
            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Address"
              required
              className="input"
            />
          </>
        )}
        <button type="submit" style={{ marginTop: 16, width: "100%" }}>
          Register
        </button>
      </form>
      {message && (
        <div
          style={{
            marginTop: 16,
            color: message.includes("success") ? "green" : "red",
          }}>
          {message}
        </div>
      )}
      <style jsx>{`
        .input {
          display: block;
          width: 100%;
          margin-bottom: 12px;
          padding: 8px 12px;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
}
