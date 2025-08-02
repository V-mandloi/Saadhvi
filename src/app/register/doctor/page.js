"use client";

import { useState } from 'react';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import { useRouter } from 'next/navigation';

export default function RegisterDoctorPage() {
  const [formData, setFormData] = useState({ role: 'Doctor' });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');
      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => router.push('/login'), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
      <Card className="shadow-lg" style={{ width: '28rem' }}>
        <Card.Body className="p-5">
          <h2 className="fw-bold mb-4 text-center">Register as a Doctor</h2>
          <Form onSubmit={handleSubmit}>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            <Form.Group className="mb-3">
              <Form.Label>Full Name</Form.Label>
              <Form.Control type="text" name="name" onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Specialization</Form.Label>
              <Form.Control type="text" name="specialization" onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Experience (Years)</Form.Label>
              <Form.Control type="number" name="experience" onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Contact</Form.Label>
                <Form.Control type="text" name="contact" onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Hospital</Form.Label>
                <Form.Control type="text" name="hospital" onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" name="email" onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" name="password" onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control type="password" name="confirmPassword" onChange={handleChange} required />
            </Form.Group>

            <div className="d-grid">
              <Button variant="success" type="submit" disabled={loading}>
                {loading ? 'Registering...' : 'Register'}
              </Button>
            </div>
             <div className="mt-3 text-center">
                <p>Already have an account? <a href="/login">Login</a></p>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}