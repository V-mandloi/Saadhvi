"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function HospitalLogin() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("danger");

  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    try {
      const res = await fetch("/api/hospital/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok && data.hospitalExists !== false) {
        setMessage(" Login successful!");
        setMessageType("success");
        // Redirect or store session here
      } else {
        setMessage(data.error || " Login failed");
        setMessageType("danger");
      }
    } catch (err) {
      console.error("Login error:", err);
      setMessage("Something went wrong.");
      setMessageType("danger");
    }
  };

  const goToAddHospital = () => {
    router.push("/hospital");
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <div className="card shadow-lg p-4" style={{ width: "100%", maxWidth: "400px" }}>
        <h3 className="text-center text-primary mb-4">🏥 Hospital Login</h3>

        <form onSubmit={handleLogin}>
          <div className="form-group mb-3">
            <label className="form-label fw-semibold">Email address</label>
            <input
              type="email"
              ref={emailRef}
              className="form-control"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group mb-3">
            <label className="form-label fw-semibold">Password</label>
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                ref={passwordRef}
                className="form-control"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-100 mt-2">
            🔐 Login
          </button>
        </form>

        {message && (
          <div className={`alert alert-${messageType} mt-3 text-center`} role="alert">
            {message}
          </div>
        )}

        {/* ✅ Add Hospital Button BEFORE login */}
        <hr />
        <button
          className="btn btn-success w-100"
          onClick={goToAddHospital}
        >
          ➕ Add Hospital
        </button>
      </div>
    </div>
  );
}
