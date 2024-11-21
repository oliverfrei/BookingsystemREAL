import React, { useState } from 'react';
import { Container, TextInput, PasswordInput, Button, Title, Paper } from '@mantine/core';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Initialize navigate

  const handleLogin = () => {
    // Dummy login validation
    if (email === 'test@test.com' && password === 'password') {
      alert('Login successful!');
      navigate('/LokaleOversigt'); // Navigate to LokaleOversigt page
    } else {
      alert('Invalid email or password');
    }
  };

  return (
    <Container size={420} my={40}>
      <Title style={{ textAlign: 'center' }}>Log ind på Booking System</Title>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <TextInput
          label="Email"
          placeholder="Indtast din email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <PasswordInput
          label="Adgangskode"
          placeholder="Indtast din adgangskode"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          mt="md"
        />
        <Button fullWidth mt="xl" onClick={handleLogin}>
          Log på
        </Button>
      </Paper>
    </Container>
  );
}

export default Login;
