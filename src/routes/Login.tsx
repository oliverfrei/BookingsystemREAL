import React, { useState } from 'react';
import { Container, TextInput, PasswordInput, Button, Title, Paper } from '@mantine/core';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import supabase from '../supabase/getSupabaseClient';



function Login() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const navigate = useNavigate(); // Initialize navigate

  const handleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
  
      if (error) {
        console.error('Error logging in:', error);
        alert('Forkert email eller adgangskode');
      } else {
        alert('Login successful!');
        navigate('/LokaleOversigt');
      }
    } catch (error) {
      console.error('Error logging in:', error);
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
