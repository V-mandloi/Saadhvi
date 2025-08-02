"use client";

import { useState, useEffect } from 'react';
import { Form, Button, Spinner, Alert, Card } from 'react-bootstrap';

export default function ReferralForm({ onSuccess }) {
  const [formData, setFormData] = useState({ patientId: '', hospitalId: '', packageId: '', notes: '' });
  const [collections, setCollections] = useState({ patients: [], hospitals: [], packages: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [patientsRes, hospitalsRes, packagesRes] = await Promise.all([
          fetch('/api/patient'),
          fetch('/api/hospital'),
          fetch('/api/package')
        ]);
        if (!patientsRes.ok || !hospitalsRes.ok || !packagesRes.ok) throw new Error("Failed to fetch initial data");
        
        const patients = await patientsRes.json();
        const hospitals = await hospitalsRes.json();
        const packages = await packagesRes.json();
        
        setCollections({ patients, hospitals, packages });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/referral', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.error || "Failed to create referral");
      }
      alert("Referral created successfully!");
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-sm border-0">
      <Card.Body>
        <h4 className="mb-4 fw-semibold text-primary">Create New Referral</h4>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Select Patient</Form.Label>
            <Form.Select name="patientId" value={formData.patientId} onChange={handleChange} required>
              <option value="">-- Select a Patient --</option>
              {collections.patients.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Select Hospital</Form.Label>
            <Form.Select name="hospitalId" value={formData.hospitalId} onChange={handleChange} required>
              <option value="">-- Select a Hospital --</option>
              {collections.hospitals.map(h => <option key={h._id} value={h._id}>{h.name}</option>)}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Select Package</Form.Label>
            <Form.Select name="packageId" value={formData.packageId} onChange={handleChange} required>
              <option value="">-- Select a Package --</option>
              {collections.packages.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-4">
            <Form.Label>Notes <small className="text-muted">(Optional)</small></Form.Label>
            <Form.Control as="textarea" rows={3} name="notes" value={formData.notes} onChange={handleChange} />
          </Form.Group>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? <><Spinner as="span" size="sm" /> Creating...</> : 'Create Referral'}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
}