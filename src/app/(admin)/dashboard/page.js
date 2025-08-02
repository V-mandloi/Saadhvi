"use client";

import { Container, Row, Col, Card, Button, Table, Badge, Spinner } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

// Sleeker icons to match the new design
const IconNewReferral = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><line x1="9" y1="15" x2="15" y2="15"></line></svg>;
const IconActiveCase = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>;
const IconCompleted = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>;
const IconTotal = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="17" y1="10" x2="3" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="17" y1="18" x2="3" y2="18"></line></svg>;


export default function DashboardPage() {
  const router = useRouter();
  const [userName, setUserName] = useState('PRO');
  const [loading, setLoading] = useState(true);

  // State to hold real data from APIs
  const [stats, setStats] = useState({
    newReferrals: 0,
    activeCases: 0,
    completedThisMonth: 0,
    totalAssigned: 0,
  });
  const [recentReferrals, setRecentReferrals] = useState([]);
  
  useEffect(() => {
    // Get user's name from session storage
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (user && user.name) {
      setUserName(user.name);
    }

    // Fetch all data from APIs
    const fetchData = async () => {
        try {
            const [statsRes, referralsRes] = await Promise.all([
                fetch('/api/dashboard/stats'),
                fetch('/api/referral')
            ]);

            if (!statsRes.ok || !referralsRes.ok) {
                throw new Error("Failed to fetch dashboard data");
            }

            const statsData = await statsRes.json();
            const referralsData = await referralsRes.json();

            setStats(statsData);
            setRecentReferrals(referralsData.slice(0, 5)); // Get the 5 most recent referrals
        } catch (error) {
            console.error("Dashboard fetch error:", error);
        } finally {
            setLoading(false);
        }
    };

    fetchData();
  }, []);

  const getStatusBadge = (status) => {
    const statusMap = {
      'Pending': 'warning',
      'Admitted': 'primary',
      'Completed': 'success',
    };
    return statusMap[status] || 'secondary';
  };

  if (loading) {
      return (
          <Container className="d-flex justify-content-center align-items-center" style={{height: '80vh'}}>
              <Spinner animation="border" style={{color: '#fff'}} />
          </Container>
      )
  }

  return (
    <>
      <style jsx>{`
        .dashboard-container {
          color: #E0E0E0;
          font-family: 'Sora', sans-serif;
        }
        .glass-card {
            background: rgba(255, 255, 255, 0.08);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border-radius: 16px;
            border: 1px solid rgba(255, 255, 255, 0.15);
            padding: 1.5rem;
            color: #fff;
        }
        .stat-card .card-body {
            display: flex;
            align-items: center;
            gap: 1rem;
        }
        .stat-icon {
            background: rgba(255, 255, 255, 0.1);
            padding: 0.75rem;
            border-radius: 12px;
        }
        .stat-value {
            font-size: 2rem;
            font-weight: 700;
        }
        .stat-label {
            color: #A0AEC0;
        }
        .table-glass {
            --bs-table-bg: transparent;
            --bs-table-color: #E0E0E0;
            --bs-table-border-color: rgba(255, 255, 255, 0.15);
            --bs-table-hover-bg: rgba(255, 255, 255, 0.1);
            --bs-table-hover-color: #fff;
        }
        .btn-glass {
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            color: #fff;
            transition: all 0.2s ease;
        }
        .btn-glass:hover {
            background: rgba(255, 255, 255, 0.2);
            border-color: rgba(255, 255, 255, 0.3);
        }
      `}</style>
      <Container fluid className="dashboard-container">
        <Row className="mb-4 align-items-center">
          <Col>
            <h1 className="h2">Welcome back, {userName}!</h1>
            <p style={{color: '#A0AEC0'}}>Here's a summary of your referral activity.</p>
          </Col>
        </Row>

        {/* Stats Cards */}
        <Row>
          <Col md={3} className="mb-4">
              <Card className="glass-card stat-card h-100">
                  <Card.Body>
                      <div className="stat-icon"><IconNewReferral /></div>
                      <div>
                          <div className="stat-value">{stats.newReferrals}</div>
                          <div className="stat-label">New Referrals</div>
                      </div>
                  </Card.Body>
              </Card>
          </Col>
          <Col md={3} className="mb-4">
              <Card className="glass-card stat-card h-100">
                  <Card.Body>
                      <div className="stat-icon"><IconActiveCase /></div>
                      <div>
                          <div className="stat-value">{stats.activeCases}</div>
                          <div className="stat-label">Active Cases</div>
                      </div>
                  </Card.Body>
              </Card>
          </Col>
          <Col md={3} className="mb-4">
              <Card className="glass-card stat-card h-100">
                  <Card.Body>
                      <div className="stat-icon"><IconCompleted /></div>
                      <div>
                          <div className="stat-value">{stats.completedThisMonth}</div>
                          <div className="stat-label">Completed This Month</div>
                      </div>
                  </Card.Body>
              </Card>
          </Col>
          <Col md={3} className="mb-4">
              <Card className="glass-card stat-card h-100">
                  <Card.Body>
                      <div className="stat-icon"><IconTotal /></div>
                      <div>
                          <div className="stat-value">{stats.totalAssigned}</div>
                          <div className="stat-label">Total Assigned</div>
                      </div>
                  </Card.Body>
              </Card>
          </Col>
        </Row>

        {/* Quick Actions & Recent Activity */}
        <Row>
          <Col lg={4} className="mb-4">
              <Card className="glass-card h-100">
                  <Card.Body>
                      <h5 className="card-title mb-3">Quick Actions</h5>
                      <div className="d-grid gap-2">
                          <Button className="btn-glass" onClick={() => router.push('/referrals')}>+ Create New Referral</Button>
                          <Button className="btn-glass" onClick={() => router.push('/patients')}>+ Register New Patient</Button>
                      </div>
                  </Card.Body>
              </Card>
          </Col>
          <Col lg={8} className="mb-4">
              <Card className="glass-card h-100">
                  <Card.Body>
                      <h5 className="card-title mb-3">Recent Activity</h5>
                      <Table responsive hover className="table-glass">
                          <thead>
                              <tr>
                                  <th>Patient</th>
                                  <th>Hospital</th>
                                  <th>Status</th>
                              </tr>
                          </thead>
                          <tbody>
                              {recentReferrals.length > 0 ? recentReferrals.map(ref => (
                                  <tr key={ref._id} style={{cursor: 'pointer'}} onClick={() => router.push(`/referrals/${ref._id}`)}>
                                      <td>{ref.patient?.name || 'N/A'}</td>
                                      <td>{ref.hospital?.name || 'N/A'}</td>
                                      <td><Badge bg={getStatusBadge(ref.status)}>{ref.status}</Badge></td>
                                  </tr>
                              )) : (
                                <tr>
                                    <td colSpan="3" className="text-center">No recent activity.</td>
                                </tr>
                              )}
                          </tbody>
                      </Table>
                  </Card.Body>
              </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}