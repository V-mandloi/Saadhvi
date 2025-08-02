"use client";

import { useState } from 'react';
import { Form, Button, Spinner, Alert, Row, Col, Card } from 'react-bootstrap';

export default function PatientForm({ onSuccess, existingPatient }) {
  const [formData, setFormData] = useState({
    name: existingPatient?.name || '',
    age: existingPatient?.age || '',
    gender: existingPatient?.gender || '',
    phone: existingPatient?.contact?.phone || '',
    email: existingPatient?.contact?.email || '',
    medicalHistory: existingPatient?.medicalHistory || ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const dataToSend = {
      name: formData.name,
      age: Number(formData.age),
      gender: formData.gender,
      contact: {
        phone: formData.phone,
        email: formData.email
      },
      medicalHistory: formData.medicalHistory
    };

    try {
      const url = existingPatient ? `/api/patient/${existingPatient._id}` : '/api/patient';
      const method = existingPatient ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend)
      });
      
      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.error || `Failed to ${existingPatient ? 'update' : 'create'} patient`);
      }

      alert(`Patient ${existingPatient ? 'updated' : 'created'} successfully!`);
      if (onSuccess) onSuccess();

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-sm border-0 rounded-lg p-4 mt-4">
      <Card.Body>
        <h4 className="mb-4 fw-semibold text-primary">{existingPatient ? 'Edit Patient Details' : 'Add New Patient'}</h4>
        <Form onSubmit={handleSubmit}>
          {error && <Alert variant="danger">{error}</Alert>}
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Full Name</Form.Label>
                <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} required />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Age</Form.Label>
                <Form.Control type="number" name="age" value={formData.age} onChange={handleChange} required />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Gender</Form.Label>
                <Form.Select name="gender" value={formData.gender} onChange={handleChange} required>
                  <option value="">-- Select --</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
                <Form.Group className="mb-3">
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
                </Form.Group>
            </Col>
            <Col md={6}>
                <Form.Group className="mb-3">
                    <Form.Label>Email Address <small className="text-muted">(Optional)</small></Form.Label>
                    <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} />
                </Form.Group>
            </Col>
          </Row>
          <Form.Group className="mb-4">
            <Form.Label>Brief Medical History <small className="text-muted">(Optional)</small></Form.Label>
            <Form.Control as="textarea" rows={3} name="medicalHistory" placeholder="e.g., Allergic to Penicillin, History of hypertension..." value={formData.medicalHistory} onChange={handleChange} />
          </Form.Group>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? <><Spinner as="span" size="sm" /> Saving...</> : (existingPatient ? 'Save Changes' : 'Create Patient')}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
}