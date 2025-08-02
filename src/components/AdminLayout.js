"use client";

import { Nav } from 'react-bootstrap';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

// Icons for the sidebar
const IconDashboard = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>;
const IconPatient = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle></svg>;
const IconHospital = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>;
const IconPackage = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>;
const IconLogout = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>;


export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    sessionStorage.removeItem('user');
    router.push('/login');
  };

  const navLinks = [
    { href: '/dashboard', text: 'Dashboard', icon: <IconDashboard /> },
    { href: '/referrals', text: 'Referrals', icon: <IconPatient /> },
    { href: '/patients', text: 'Patients', icon: <IconPatient /> },
    { href: '/hospitals', text: 'Hospitals', icon: <IconHospital /> },
    { href: '/packages', text: 'Packages', icon: <IconPackage /> },
  ];

  return (
    <>
      <style jsx global>{`
        @keyframes gradient-animation {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
        body {
          font-family: 'Sora', sans-serif;
        }
        .admin-layout {
          display: flex;
          min-height: 100vh;
          background: linear-gradient(-45deg, #0f0c29, #302b63, #24243e, #1c1c3c);
          background-size: 400% 400%;
          animation: gradient-animation 15s ease infinite;
        }
        .sidebar {
          width: 260px;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-right: 1px solid rgba(255, 255, 255, 0.1);
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
        }
        .sidebar-header {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 2rem;
          color: #fff;
        }
        .sidebar .nav-link {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          border-radius: 0.5rem;
          color: #A0AEC0;
          font-weight: 500;
          transition: all 0.2s ease;
        }
        .sidebar .nav-link.active,
        .sidebar .nav-link:hover {
          background-color: rgba(255, 255, 255, 0.1);
          color: #fff;
        }
        .logout-button {
          margin-top: auto;
        }
        .main-content {
          flex-grow: 1;
          padding: 2rem;
          overflow-y: auto;
        }
      `}</style>
      <div className="admin-layout">
        <nav className="sidebar">
          <div className="sidebar-header">Saadhvi</div>
          <Nav className="flex-column">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} passHref legacyBehavior>
                <Nav.Link className={pathname.startsWith(link.href) ? 'active' : ''}>
                  {link.icon}
                  {link.text}
                </Nav.Link>
              </Link>
            ))}
          </Nav>
          <div className="logout-button">
             <Nav.Link onClick={handleLogout} className="nav-link">
                <IconLogout />
                Logout
             </Nav.Link>
          </div>
        </nav>
        <main className="main-content">
          {children}
        </main>
      </div>
    </>
  );
}
