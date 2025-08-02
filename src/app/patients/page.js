"use client";

import { useState, useEffect, useCallback } from 'react';
import { Container, Button, Alert, Table, Row, Col, Modal } from 'react-bootstrap';
import PatientForm from '@/components/PatientForm';
import TableSkeleton from '@/components/TableSkeleton'; // Assuming you have this from previous steps

export default function PatientsPage() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for the form modal
  const [showModal, setShowModal] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);

  const fetchPatients = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/patient');
      if (!res.ok) throw new Error('Failed to fetch patients');
      const data = await res.json();
      setPatients(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);
  
  const handleShowAddModal = () => {
    setEditingPatient(null);
    setShowModal(true);
  };

  const handleShowEditModal = (patient) => {
    setEditingPatient(patient);
    setShowModal(true);
  }

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingPatient(null);
  };
  
  const handleSuccess = () => {
    handleCloseModal();
    fetchPatients();
  }

  const handleDelete = async (patientId) => {
    if(!confirm('Are you sure you want to delete this patient record? This action cannot be undone.')) return;

    try {
      const res = await fetch(`/api/patient/${patientId}`, { method: 'DELETE' });
      if(!res.ok) {
        const result = await res.json();
        throw new Error(result.error || "Failed to delete patient");
      }
      alert("Patient deleted successfully!");
      fetchPatients();
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  return (
    <Container fluid className="mt-4">
      <Row className="align-items-center mb-4">
        <Col>
          <h1>Patient Management</h1>
        </Col>
        <Col className="text-end">
          <Button onClick={handleShowAddModal}>
            + Add New Patient
          </Button>
        </Col>
      </Row>
      
      <hr className="my-4" />
      <h3 className="mb-3">Registered Patients</h3>
      {error && <Alert variant="danger">{error}</Alert>}
      
      {loading ? (
        <TableSkeleton />
      ) : (
        <div className="card shadow-sm">
          <Table striped bordered hover responsive className="mb-0">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Patient Name</th>
                <th>Age</th>
                <th>Gender</th>
                <th>Contact No.</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {patients.length > 0 ? patients.map((patient, index) => (
                <tr key={patient._id}>
                  <td>{index + 1}</td>
                  <td>{patient.name}</td>
                  <td>{patient.age}</td>
                  <td>{patient.gender}</td>
                  <td>{patient.contact.phone}</td>
                  <td>
                    <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleShowEditModal(patient)}>Edit</Button>
                    <Button variant="outline-danger" size="sm" onClick={() => handleDelete(patient._id)}>Delete</Button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="6" className="text-center">No patients found. Start by adding one.</td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      )}

      {/* Add/Edit Patient Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
            <Modal.Title>{editingPatient ? 'Edit Patient' : 'Add New Patient'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <PatientForm onSuccess={handleSuccess} existingPatient={editingPatient} />
        </Modal.Body>
      </Modal>

    </Container>
  );
}