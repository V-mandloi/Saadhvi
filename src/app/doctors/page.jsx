"use client";

import { useEffect, useState } from "react";
import { Container, Alert, Spinner, Button, Modal, Form } from "react-bootstrap";
import Link from "next/link";
import DoctorsTable from "@/components/DoctorsTable";

export default function DoctorsListPage() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchDoctors = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/doctor");
      if (!res.ok) throw new Error("Failed to fetch doctors.");
      const data = await res.json();
      setDoctors(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this doctor?")) return;
    try {
      const res = await fetch(`/api/doctor/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed.");
      await fetchDoctors();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEditClick = (doctor) => {
    setEditingDoctor(doctor);
    setShowModal(true);
  };

  const handleUpdate = async () => {
    try {
      const res = await fetch(`/api/doctor/${editingDoctor._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingDoctor),
      });
      if (!res.ok) throw new Error("Update failed.");
      setShowModal(false);
      await fetchDoctors();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleChange = (e) => {
    setEditingDoctor({ ...editingDoctor, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  return (
    <div style={{ background: "#f4f7f6", minHeight: "100vh", padding: "2rem" }}>
      <Container fluid>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>Doctors List</h1>
          <Link href="/doctor" passHref>
            <Button variant="primary">+ Add New Doctor</Button>
          </Link>
        </div>

        {error && <Alert variant="danger">{error}</Alert>}

        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2">Loading Doctors...</p>
          </div>
        ) : (
          <DoctorsTable
            doctors={doctors}
            onDelete={handleDelete}
            onEdit={handleEditClick}
          />
        )}

        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Doctor</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {editingDoctor && (
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={editingDoctor.name}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Specialization</Form.Label>
                  <Form.Control
                    type="text"
                    name="specialization"
                    value={editingDoctor.specialization}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Experience</Form.Label>
                  <Form.Control
                    type="number"
                    name="experience"
                    value={editingDoctor.experience}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Contact</Form.Label>
                  <Form.Control
                    type="text"
                    name="contact"
                    value={editingDoctor.contact}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={editingDoctor.email}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Hospital</Form.Label>
                  <Form.Control
                    type="text"
                    name="hospital"
                    value={editingDoctor.hospital}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Form>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleUpdate}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
}
