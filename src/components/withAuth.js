"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Spinner, Container } from 'react-bootstrap';

const withAuth = (WrappedComponent) => {
  const AuthComponent = (props) => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      // This code runs only on the client side after the component mounts.
      const user = sessionStorage.getItem('user');
      
      if (!user) {
        // If no user is found in session storage, redirect to login page.
        router.replace('/login');
      } else {
        // If user is found, stop loading and show the page.
        setLoading(false);
      }
    }, [router]);

    if (loading) {
      // While checking, show a full-screen loading spinner.
      return (
        <Container fluid className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
            <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        </Container>
      );
    }

    // If user is logged in, render the actual component.
    return <WrappedComponent {...props} />;
  };

  return AuthComponent;
};

export default withAuth;