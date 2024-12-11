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
        backgroundColor: '#212529',
        color: '#fff',
      }}
    >
      {/* Ikon for succes */}
      <div
        style={{
          backgroundColor: '#845EF7',
          borderRadius: '50%',
          width: '6rem',
          height: '6rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1rem',
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          fill="white"
          viewBox="0 0 24 24"
        >
          <path d="M20.285 6.708l-11.813 11.793-5.261-5.232 1.418-1.414 3.843 3.822 10.395-10.374 1.418 1.405z" />
        </svg>
      </div>

      {/* Bekræftelses tekst */}
      <Title
        order={2}
        style={{
          fontSize: '2rem',
          fontWeight: 300,
          marginBottom: '3rem',
        }}
      >
        Dit lokale er nu booket
      </Title>

      {/* Navigationsmuligheder */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
          marginTop: '2rem',
        }}
      >
        {/* Knappen til email */}
        <Button
          variant="filled"
          color="violet"
          radius="xs"
          onClick={() => window.open('https://mail.google.com', '_blank')}
        >
          Før mig til min mail
        </Button>

        {/* Knappen til at logge af */}
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

        {/* Link til LokaleOversigt */}
        <button
          onClick={() => navigate('/LokaleOversigt')}
          style={{
            all: 'unset',
            color: 'gray',
            textDecoration: 'underline',
            fontSize: '1rem',
            cursor: 'pointer',
          }}
        >
          Til Lokaleoversigt
        </button>
      </div>
    </div>
  );
};

export default BookingSuccess;
