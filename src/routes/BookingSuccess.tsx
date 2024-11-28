import React from 'react';
import { Button, Title } from '@mantine/core';
import { useNavigate } from 'react-router-dom';

const BookingSuccess = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#121212',
        color: '#fff',
      }}
    >
      <Title order={2} style={{ marginBottom: '1rem', color: '#fff' }}>
        Dit lokale er nu booket
      </Title>
      <div style={{ backgroundColor: '#845EF7', borderRadius: '50%', padding: '2rem', marginBottom: '2rem' }}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          fill="white"
          viewBox="0 0 24 24"
        >
          <path d="M10 15.172l10-10 1.414 1.414L10 18 2.586 10.586 4 9.172z" />
        </svg>
      </div>
      <Button
        onClick={() => window.open('https://mail.google.com', '_blank')}
        style={{
          backgroundColor: '#845EF7',
          color: '#fff',
          marginBottom: '1rem',
        }}
      >
        Før mig til min mail
      </Button>
      <Button
        onClick={() => navigate('/')}
        variant="outline"
        style={{
          color: '#fff',
          borderColor: '#fff',
        }}
      >
        Log mig af
      </Button>
    </div>
  );
};

export default BookingSuccess;
