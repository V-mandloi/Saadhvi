"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Container, Alert, Spinner, Button, Modal, Form } from 'react-bootstrap';
import HospitalsTable from '@/components/HospitalsTable';

export default function HospitalsListPage() {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editHospital, setEditHospital] = useState(null);

  const fetchHospitals = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/hospital');
      const data = await res.json();
      setHospitals(data);
    } catch (err) {
      setError(err.message || "Failed to fetch hospitals");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure to delete this hospital?")) {
      await fetch(`/api/hospital/${id}`, { method: 'DELETE' });
      fetchHospitals();
    }
  };

  const handleEdit = (hospital) => {
    setEditHospital(hospital);
  };

  const handleUpdate = async () => {
    await fetch(`/api/hospital/${editHospital._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editHospital),
    });
    setEditHospital(null);
    fetchHospitals();
  };

  useEffect(() => {
    fetchHospitals();
  }, []);

  return (
    <div style={{ background: '#f4f7f6', minHeight: '100vh', padding: '2rem' }}>
      <Container fluid>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>Hospitals List</h1>
          <Link href="/hospital" passHref>
            <Button variant="primary">+ Add New Hospital</Button>
          </Link>
        </div>

        {error && <Alert variant="danger">{error}</Alert>}

        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2">Loading Hospitals...</p>
          </div>
        ) : (
          <HospitalsTable
            hospitals={hospitals}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}

        {/* Edit Modal */}
        <Modal show={!!editHospital} onHide={() => setEditHospital(null)}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Hospital</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-2">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  value={editHospital?.name || ''}
                  onChange={(e) => setEditHospital({ ...editHospital, name: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Specialization</Form.Label>
                <Form.Control
                  value={editHospital?.specialization || ''}
                  onChange={(e) => setEditHospital({ ...editHospital, specialization: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Registration No.</Form.Label>
                <Form.Control
                  value={editHospital?.registrationNumber || ''}
                  onChange={(e) => setEditHospital({ ...editHospital, registrationNumber: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Contact</Form.Label>
                <Form.Control
                  value={editHospital?.contact || ''}
                  onChange={(e) => setEditHospital({ ...editHospital, contact: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  value={editHospital?.email || ''}
                  onChange={(e) => setEditHospital({ ...editHospital, email: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  value={editHospital?.address || ''}
                  onChange={(e) => setEditHospital({ ...editHospital, address: e.target.value })}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setEditHospital(null)}>
              Cancel
            </Button>
            <Button variant="success" onClick={handleUpdate}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
}
