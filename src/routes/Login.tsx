import React, { useState } from 'react';
import {
  Container,
  TextInput,
  PasswordInput,
  Button,
  Title,
  Paper,
  Stack,
  Checkbox,
  Input,
} from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import supabase from '../supabase/getSupabaseClient';
import logo from '../images/logo.svg';
import pic from '../images/pic-1.svg';

function Login() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const navigate = useNavigate();

  // Håndterer login-processen
  const handleLogin = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        console.error('Error logging in:', error);
        alert('Forkert email eller adgangskode');
      } else {
        // Henter "Husk mig"-checkbox værdien
        const rememberMe = (document.querySelector('input[type="checkbox"]') as HTMLInputElement)?.checked;

        if (!rememberMe) {
          // Hvis "Husk mig" ikke er markeret, fjernes sessionen
          supabase.auth.setSession(null);
        }

        alert('Login successful!');
        navigate('/LokaleOversigt');
      }
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  return (
    <Container
      fluid
      style={{
        display: 'flex',
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#212529',
        padding: '0 50px',
      }}
    >
      {/* Venstre sektion: Billede */}
      <div
        style={{
          flex: 1,
          backgroundImage: `url(${pic})`,
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          height: '100vh',
          marginTop: '40px',
          marginBottom: '40px',
          marginLeft: '-150px',
        }}
      />

      {/* Højre sektion: Login-formular */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center',
          marginLeft: '-60px',
          marginBottom: '100px',
        }}
      >
        <Stack align="center" style={{ gap: '1rem', maxWidth: 400, width: '100%' }}>
          {logo ? (
            <img
              src={logo}
              alt="Logo"
              style={{
                width: '1000px',
                height: '200px',
                marginBottom: '20px',
                marginTop: '50px',
                marginLeft: '160px',
              }}
            />
          ) : (
            <Title order={3} style={{ color: '#fff' }}>
              Booking System
            </Title>
          )}

          <Paper
            p={30}
            radius="md"
            style={{
              backgroundColor: 'transparent',
              color: '#ffffff',
              width: '100%',
            }}
          >
            <Title
              style={{
                color: '#ffffff',
                textAlign: 'left',
                marginBottom: '16px',
                fontWeight: 200,
              }}
            >
              Book et lokale på Cphbusiness i Lyngby
            </Title>

            {/* Email input */}
            <Input.Wrapper
              label={
                <span style={{ color: '#ffffff' }}>
                  Brugernavn <span style={{ color: 'red' }}>*</span>
                </span>
              }
            >
              <TextInput
                placeholder="Indtast din email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                styles={{
                  input: {
                    backgroundColor: '#343A40',
                    color: '#ffffff',
                    borderColor: '#444',
                  },
                }}
              />
            </Input.Wrapper>

            {/* Password input */}
            <Input.Wrapper
              label={
                <span style={{ color: '#ffffff' }}>
                  Adgangskode <span style={{ color: 'red' }}>*</span>
                </span>
              }
              mt="md"
            >
              <PasswordInput
                placeholder="Indtast din adgangskode"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                styles={{
                  input: {
                    backgroundColor: '#343A40',
                    color: '#ffffff',
                    borderColor: '#444',
                  },
                }}
              />
            </Input.Wrapper>

            {/* Checkbox til "Husk mig" */}
            <Checkbox
              label="Husk mig til næste gang"
              mt="md"
              styles={{
                root: {
                  color: '#ffffff',
                  backgroundColor: 'transparent',
                },
                input: {
                  borderColor: '#444',
                  '&:checked': {
                    backgroundColor: '#845EF7',
                  },
                },
              }}
            />

            {/* Login-knap */}
            <Button
              mt="xl"
              onClick={handleLogin}
              styles={{
                root: {
                  backgroundColor: '#845EF7',
                  borderRadius: 0,
                  width: '100px',
                  height: '50px',
                  margin: '0 auto',
                  '&:hover': {
                    backgroundColor: '#5E42A6',
                  },
                },
              }}
            >
              Log på
            </Button>
          </Paper>
        </Stack>
      </div>
    </Container>
  );
}

export default Login;
