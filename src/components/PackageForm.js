"use client";

import { useState, useEffect } from 'react';
import { Form, Button, Spinner, Alert, Row, Col, Card } from 'react-bootstrap';

export default function PackageForm({ onSuccess }) {
  const [hospitals, setHospitals] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    services: '',
    hospital: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchHospitals() {
      try {
        const res = await fetch('/api/hospital');
        if (!res.ok) throw new Error('Failed to fetch hospitals');
        const data = await res.json();
        setHospitals(data);
      } catch (err) {
        setError("Could not load hospitals. " + err.message);
      }
    }
    fetchHospitals();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.hospital) {
      setError("Please select a hospital.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const dataToSend = {
        ...formData,
        services: formData.services.split(',').map(s => s.trim())
      };
      
      console.log("Submitting this data to /api/package:", dataToSend);

      const res = await fetch('/api/package', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend)
      });
      
      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.error || 'Something went wrong');
      }

      alert('Package created successfully!');
      setFormData({ name: '', description: '', price: '', services: '', hospital: '' });
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
        <h4 className="mb-4 fw-semibold text-primary">Add New Health Package</h4>
        <Form onSubmit={handleSubmit}>
          {error && <Alert variant="danger">{error}</Alert>}
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Package Name</Form.Label>
                <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} required />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Price (₹)</Form.Label>
                <Form.Control type="number" name="price" value={formData.price} onChange={handleChange} required />
              </Form.Group>
            </Col>
          </Row>
          <Form.Group className="mb-3">
            <Form.Label>Select Hospital</Form.Label>
            <Form.Select name="hospital" value={formData.hospital} onChange={handleChange} required>
              <option value="">-- Select a hospital --</option>
              {hospitals.map(hospital => (
                <option key={hospital._id} value={hospital._id}>{hospital.name}</option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control as="textarea" rows={3} name="description" value={formData.description} onChange={handleChange} required />
          </Form.Group>
          <Form.Group className="mb-4">
            <Form.Label>Services Included <small className="text-muted">(comma-separated)</small></Form.Label>
            <Form.Control as="textarea" rows={2} name="services" placeholder="e.g., 5-day Stay, Surgery, Medicines" value={formData.services} onChange={handleChange} required />
          </Form.Group>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? <><Spinner as="span" size="sm" /> Creating...</> : 'Create Package'}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
}