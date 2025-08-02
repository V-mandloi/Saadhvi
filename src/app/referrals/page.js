"use client";

import { useState, useEffect, useCallback } from 'react';
import { Container, Button, Alert, Table, Row, Col, Modal, Badge, Form, Spinner, InputGroup, ButtonGroup } from 'react-bootstrap';
import ReferralForm from '@/components/ReferralForm';
import TableSkeleton from '@/components/TableSkeleton';
import withAuth from '@/components/withAuth';
import { useRouter } from 'next/navigation';

function ReferralsPage() {
  const [referrals, setReferrals] = useState([]);
  const [filteredReferrals, setFilteredReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const router = useRouter();

  const fetchReferrals = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/referral');
      if (!res.ok) throw new Error('Failed to fetch referrals');
      const data = await res.json();
      setReferrals(data);
      setFilteredReferrals(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReferrals();
  }, [fetchReferrals]);

  useEffect(() => {
    let result = referrals;
    if (statusFilter !== 'All') {
      result = result.filter(ref => ref.status === statusFilter);
    }
    if (searchTerm) {
      result = result.filter(ref => 
        ref.patient?.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredReferrals(result);
  }, [searchTerm, statusFilter, referrals]);


  const handleSuccess = () => {
    setShowModal(false);
    fetchReferrals();
  };

  const handleStatusChange = async (referralId, newStatus) => {
    setUpdatingId(referralId);
    try {
        const res = await fetch(`/api/referral/${referralId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
        });
        if (!res.ok) throw new Error("Failed to update status");
        fetchReferrals();
    } catch (err) {
        alert(err.message);
    } finally {
        setUpdatingId(null);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('user');
    router.push('/login');
  };
  
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending': return 'secondary';
      case 'Admitted': return 'primary';
      case 'Completed': return 'success';
      case 'Cancelled': return 'danger';
      default: return 'light';
    }
  }

  return (
    <Container fluid className="mt-4">
      <Row className="align-items-center mb-4">
        <Col>
          <h1>Referral Dashboard</h1>
        </Col>
        <Col className="text-end">
          <Button variant="outline-danger" className="me-2" onClick={handleLogout}>Logout</Button>
          <Button onClick={() => setShowModal(true)}>+ New Referral</Button>
        </Col>
      </Row>
      
      <Row className="mb-4">
        <Col md={8}>
            <ButtonGroup>
                <Button variant={statusFilter === 'All' ? 'primary' : 'outline-primary'} onClick={() => setStatusFilter('All')}>All</Button>
                <Button variant={statusFilter === 'Pending' ? 'primary' : 'outline-primary'} onClick={() => setStatusFilter('Pending')}>Pending</Button>
                <Button variant={statusFilter === 'Admitted' ? 'primary' : 'outline-primary'} onClick={() => setStatusFilter('Admitted')}>Admitted</Button>
                <Button variant={statusFilter === 'Completed' ? 'primary' : 'outline-primary'} onClick={() => setStatusFilter('Completed')}>Completed</Button>
            </ButtonGroup>
        </Col>
        <Col md={4}>
            <InputGroup>
                <Form.Control 
                    type="text"
                    placeholder="Search by patient name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </InputGroup>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}
      
      {loading ? (
        <TableSkeleton />
      ) : (
        <div className="card shadow-sm">
          <Table striped bordered hover responsive className="mb-0">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Patient</th>
                <th>Referred To</th>
                <th>Package</th>
                <th>Status</th>
                <th>Referred On</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReferrals.length > 0 ? filteredReferrals.map((ref, index) => (
                <tr key={ref._id}>
                  <td>{index + 1}</td>
                  <td>{ref.patient?.name || 'N/A'}</td>
                  <td>{ref.hospital?.name || 'N/A'}</td>
                  <td>{ref.package?.name || 'N/A'}</td>
                  <td><Badge bg={getStatusBadge(ref.status)}>{ref.status}</Badge></td>
                  <td>{new Date(ref.createdAt).toLocaleDateString()}</td>
                  <td className="d-flex align-items-center gap-2">
                    {/* NEW: View Details Button */}
                    <Button variant="outline-primary" size="sm" onClick={() => router.push(`/referrals/${ref._id}`)}>
                        View
                    </Button>
                    {updatingId === ref._id ? (
                        <Spinner animation="border" size="sm" />
                    ) : (
                        <Form.Select 
                            size="sm" 
                            style={{width: '120px'}}
                            value={ref.status}
                            onChange={(e) => handleStatusChange(ref._id, e.target.value)}
                        >
                            <option value="Pending">Pending</option>
                            <option value="Admitted">Admitted</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                        </Form.Select>
                    )}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="7" className="text-center">No referrals match your criteria.</td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
            <Modal.Title>Create New Referral</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <ReferralForm onSuccess={handleSuccess} />
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default withAuth(ReferralsPage);