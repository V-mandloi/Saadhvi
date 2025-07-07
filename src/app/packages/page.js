"use client";

import { useState, useEffect } from 'react';
import { Container, Button, Alert, Spinner, Table, Row, Col, Card } from 'react-bootstrap';
import PackageForm from '@/components/PackageForm';

export default function PackagesPage() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchPackages = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/package');
      if (!res.ok) throw new Error('Failed to fetch packages');
      const data = await res.json();
      setPackages(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleDelete = async (packageId) => {
    if (!confirm('Are you sure you want to delete this package?')) return;

    try {
      const res = await fetch(`/api/package/${packageId}`, { method: 'DELETE' });
      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.error || "Failed to delete package");
      }
      alert("Package deleted successfully!");
      fetchPackages();
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  return (
    <Container fluid className="py-4" style={{ backgroundColor: "#f4f7f6", minHeight: "100vh" }}>
      <Row className="align-items-center mb-4">
        <Col>
          <h2 className="fw-bold text-primary">Health Package Management</h2>
        </Col>
        <Col className="text-end">
          <Button onClick={() => setShowForm(!showForm)} variant="primary" className="rounded-pill">
            {showForm ? 'Cancel' : '+ Add New Package'}
          </Button>
        </Col>
      </Row>

      {showForm && (
        <PackageForm
          onSuccess={() => {
            setShowForm(false);
            fetchPackages();
          }}
        />
      )}

      <hr className="my-4" />

      <h4 className="mb-3">Existing Packages</h4>
      {error && <Alert variant="danger">{error}</Alert>}
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Loading packages...</p>
        </div>
      ) : (
        <Card className="shadow-sm border-0 rounded-4 p-3">
          <Table striped bordered hover responsive className="mb-0">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Package Name</th>
                <th>Associated Hospital</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {packages.length > 0 ? (
                packages.map((pkg, index) => (
                  <tr key={pkg._id}>
                    <td>{index + 1}</td>
                    <td>{pkg.name}</td>
                    <td>{pkg.hospital?.name || 'N/A'}</td>
                    <td>₹{pkg.price}</td>
                    <td>
                      <Button variant="outline-primary" size="sm" className="me-2 rounded-pill">
                        Edit
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        className="rounded-pill"
                        onClick={() => handleDelete(pkg._id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-3">
                    No packages found. Start by adding one.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card>
      )}
    </Container>
  );
}
