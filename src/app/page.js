"use client";

import { Container, Row, Col, Button, Card, Navbar, Nav } from 'react-bootstrap';
import { useRouter } from 'next/navigation';

// New, sleeker line-art icons
const IconFlow = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"></path><path d="M2 17l10 5 10-5"></path><path d="M2 12l10 5 10-5"></path></svg>
);
const IconShield = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
);
const IconZap = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
);


export default function HomePage() {
  const router = useRouter();

  return (
    <div className="homepage-glass">
      {/* Custom styles for the new design */}
      <style jsx>{`
        @keyframes gradient-animation {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
        .homepage-glass {
          color: #FFFFFF;
          font-family: 'Sora', sans-serif;
          background: linear-gradient(-45deg, #0f0c29, #302b63, #24243e, #1c1c3c);
          background-size: 400% 400%;
          animation: gradient-animation 15s ease infinite;
        }
        .navbar-custom {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          padding: 1rem 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        .hero-section {
          padding: 8rem 0;
          text-align: center;
        }
        .hero-section .display-3 {
          font-weight: 700;
          letter-spacing: -1px;
        }
        .hero-section .lead {
          max-width: 600px;
          margin: 1.5rem auto 2.5rem auto;
          color: #E0E0E0;
          font-size: 1.1rem;
          line-height: 1.7;
        }
        .btn-primary-custom {
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            padding: 0.8rem 2.5rem;
            font-weight: 600;
            transition: all 0.3s ease;
            color: #fff;
        }
        .btn-primary-custom:hover {
            background: rgba(255, 255, 255, 0.2);
            border-color: rgba(255, 255, 255, 0.3);
            transform: translateY(-3px);
        }
        .content-section {
            padding: 6rem 0;
        }
        .glass-card {
            background: rgba(255, 255, 255, 0.08);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border-radius: 16px;
            border: 1px solid rgba(255, 255, 255, 0.15);
            padding: 2.5rem;
            transition: all 0.3s ease;
        }
        .glass-card:hover {
            background: rgba(255, 255, 255, 0.12);
            transform: scale(1.02);
        }
        .feature-icon {
            color: #fff;
            background: rgba(255, 255, 255, 0.1);
            width: 56px;
            height: 56px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 1.5rem;
        }
        .footer {
            background-color: transparent;
            padding: 3rem 0;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
      `}</style>
      
      {/* Add Google Font */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&display=swap" rel="stylesheet" />

      {/* Navigation Bar */}
      <Navbar expand="lg" className="navbar-custom sticky-top" variant="dark">
        <Container>
          <Navbar.Brand href="#" className="fw-bold fs-4">Saadhvi</Navbar.Brand>
          <Nav className="ms-auto">
            <Button variant="primary" className="btn-primary-custom" onClick={() => router.push('/login')}>Dashboard Login</Button>
          </Nav>
        </Container>
      </Navbar>

      {/* Hero Section */}
      <div className="hero-section">
        <Container>
          <h1 className="display-3">Your Referral Workflow, Reimagined.</h1>
          <p className="lead">
            Saadhvi is the intelligent platform that transforms your complex referral process into a simple, automated, and transparent workflow.
          </p>
          <Button variant="primary" size="lg" className="btn-primary-custom" onClick={() => router.push('/login')}>
            Enter the Dashboard
          </Button>
        </Container>
      </div>

      {/* Features Section */}
      <div className="content-section">
        <Container>
            <Row>
              <Col md={4} className="mb-4">
                <div className="glass-card h-100">
                    <div className="feature-icon"><IconZap /></div>
                    <h4 className="fw-bold">Instant Creation</h4>
                    <p className="text-white-50">
                      Create and assign complex referrals in seconds with our intelligent, pre-populated forms.
                    </p>
                </div>
              </Col>
              <Col md={4} className="mb-4">
                <div className="glass-card h-100">
                    <div className="feature-icon"><IconFlow /></div>
                    <h4 className="fw-bold">Total Visibility</h4>
                    <p className="text-white-50">
                      Track every referral's journey in real-time on a centralized dashboard. No more guessing games.
                    </p>
                </div>
              </Col>
              <Col md={4} className="mb-4">
                <div className="glass-card h-100">
                    <div className="feature-icon"><IconShield /></div>
                    <h4 className="fw-bold">Secure & Centralized</h4>
                    <p className="text-white-50">
                      Manage all your patient, hospital, and package data in one secure, unified system.
                    </p>
                </div>
              </Col>
            </Row>
        </Container>
      </div>
      
      {/* Testimonial Section */}
      <div className="content-section pt-0">
          <Container>
            <Row className="justify-content-center">
                <Col md={8} className="text-center">
                    <div className="glass-card">
                        <p className="fs-4 mb-4">
                            "This platform didn't just improve our workflow—it completely revolutionized it. Our efficiency has doubled."
                        </p>
                        <div>
                            <h5 className="mb-0">Anjali  Varma</h5>
                            <span className="text-white-50">Head PRO, City Hospital</span>
                        </div>
                    </div>
                </Col>
            </Row>
          </Container>
      </div>

      {/* Footer */}
      <footer className="footer">
        <Container className="text-center">
          <p className="text-white-50 mb-0">&copy; {new Date().getFullYear()} Saadhvi Referral System. All Rights Reserved.</p>
        </Container>
      </footer>
    </div>
  );
}