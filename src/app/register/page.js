"use client";

import { Container, Card, Button, Row, Col } from 'react-bootstrap';
import { useRouter } from 'next/navigation';

export default function RegisterSelectionPage() {
    const router = useRouter();

    return (
        <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
            <Card className="shadow-lg text-center" style={{ width: '35rem' }}>
                <Card.Body className="p-5">
                    <h2 className="fw-bold mb-4">Choose Your Role to Register</h2>
                    <p className="mb-4">Select the account type you want to create.</p>
                    <Row>
                        <Col md={4} className="d-grid">
                            <Button variant="primary" size="lg" onClick={() => router.push('/register/pro')}>
                                PRO
                            </Button>
                            <small className="text-muted mt-2">Patient Referral Officer</small>
                        </Col>
                        <Col md={4} className="d-grid">
                            <Button variant="success" size="lg" onClick={() => router.push('/register/doctor')}>
                                Doctor
                            </Button>
                             <small className="text-muted mt-2">Medical Professional</small>
                        </Col>
                        <Col md={4} className="d-grid">
                            <Button variant="info" size="lg" onClick={() => router.push('/register/hospital')}>
                                Hospital
                            </Button>
                            <small className="text-muted mt-2">Healthcare Facility</small>
                        </Col>
                    </Row>
                     <div className="mt-4">
                        <p>Already have an account? <a href="/login">Login Here</a></p>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
}