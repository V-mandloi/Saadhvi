"use client";

import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner, Alert, Badge, Button } from 'react-bootstrap';
import { useParams, useRouter } from 'next/navigation';
import withAuth from '@/components/withAuth'; // Assuming you have withAuth for security

function ReferralDetailPage() {
  const [referral, setReferral] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  useEffect(() => {
    if (id) {
      const fetchReferralDetails = async () => {
        try {
          const res = await fetch(`/api/referral/${id}`);
          if (!res.ok) {
            throw new Error('Failed to fetch referral details');
          }
          const data = await res.json();
          setReferral(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchReferralDetails();
    }
  }, [id]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending': return 'secondary';
      case 'Admitted': return 'primary';
      case 'Completed': return 'success';
      case 'Cancelled': return 'danger';
      default: return 'light';
    }
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
        <Spinner animation="border" />
      </Container>
    );
  }

  if (error) {
    return <Container className="mt-4"><Alert variant="danger">{error}</Alert></Container>;
  }

  if (!referral) {
    return <Container className="mt-4"><Alert variant="warning">No referral data found.</Alert></Container>;
  }

  return (
    <Container fluid className="mt-4">
      <Row className="mb-4">
        <Col>
            <Button variant="outline-secondary" onClick={() => router.back()}>
                &larr; Back to Dashboard
            </Button>
        </Col>
      </Row>
      <Row>
        <Col md={8}>
          <Card className="shadow-sm mb-4">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h4 className="mb-0">Referral Details</h4>
              <Badge bg={getStatusBadge(referral.status)} pill className="p-2 fs-6">{referral.status}</Badge>
            </Card.Header>
            <Card.Body>
                <Row>
                    {/* Patient Details */}
                    <Col md={6}>
                        <h5>Patient Information</h5>
                        <p><strong>Name:</strong> {referral.patient?.name}</p>
                        <p><strong>Age:</strong> {referral.patient?.age}</p>
                        <p><strong>Gender:</strong> {referral.patient?.gender}</p>
                        <p><strong>Contact:</strong> {referral.patient?.contact?.phone}</p>
                        <p><strong>Email:</strong> {referral.patient?.contact?.email || 'N/A'}</p>
                    </Col>
                    {/* Hospital Details */}
                    <Col md={6}>
                        <h5>Hospital & Package</h5>
                        <p><strong>Hospital:</strong> {referral.hospital?.name}</p>
                        <p><strong>Registration No:</strong> {referral.hospital?.registrationNumber}</p>
                        <hr/>
                        <p><strong>Package:</strong> {referral.package?.name}</p>
                        <p><strong>Price:</strong> ₹{referral.package?.price}</p>
                    </Col>
                </Row>
                <hr/>
                <h5>Notes</h5>
                <p>{referral.notes || 'No notes provided.'}</p>
            </Card.Body>
            <Card.Footer className="text-muted">
              Referred on: {new Date(referral.createdAt).toLocaleString()}
            </Card.Footer>
          </Card>
        </Col>
        <Col md={4}>
            <Card className="shadow-sm">
                <Card.Body>
                    <h5>Medical History</h5>
                    <p>{referral.patient?.medicalHistory || 'No medical history provided.'}</p>
                </Card.Body>
            </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default withAuth(ReferralDetailPage);