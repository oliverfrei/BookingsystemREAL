import React from 'react';
import { Container, Paper, Title, Text, Button } from '@mantine/core';
import { useNavigate, useLocation } from 'react-router-dom';
import dayjs from 'dayjs';
import supabase from '../supabase/getSupabaseClient';
import logo from '../images/logo.svg'; // Import the logo
import background from '../images/Background.svg'; // Page-wide background image
import kvittering from '../images/kvittering-2.svg'; // Receipt image

const BookingConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { room, date, time, plan, capacity } = location.state || {};

  const handleConfirmBooking = async () => {
    try {
      if (!date || !time || !room) {
        console.error('Missing required fields:', { date, time, room });
        throw new Error('Alle felter skal udfyldes.');
      }

      const [startTimeStr, endTimeStr] = time.split('-');
      if (!startTimeStr || !endTimeStr) {
        console.error('Invalid time format:', time);
        throw new Error('Tidspunktet er ikke korrekt formateret. Forventet format: HH:MM-HH:MM');
      }

      const parsedDate = dayjs(date, 'YYYY-MM-DD');
      if (!parsedDate.isValid()) {
        console.error('Invalid date:', date);
        throw new Error('Datoen er ugyldig. Sørg for at vælge en gyldig dato.');
      }

      const startTime = parsedDate
        .hour(Number(startTimeStr.split(':')[0]))
        .minute(Number(startTimeStr.split(':')[1]))
        .second(0);

      const endTime = parsedDate
        .hour(Number(endTimeStr.split(':')[0]))
        .minute(Number(endTimeStr.split(':')[1]))
        .second(0);

      if (!startTime.isValid() || !endTime.isValid()) {
        console.error('Invalid start or end time:', { startTime, endTime });
        throw new Error('Ugyldige dato- eller tidsværdier.');
      }

      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        console.error('Session error:', sessionError);
        throw new Error('Kunne ikke hente brugerens session. Log venligst ind igen.');
      }

      const userId = sessionData?.session?.user?.id;
      if (!userId) {
        console.error('User ID not found in session.');
        throw new Error('Bruger ikke fundet. Log venligst ind igen.');
      }

      const { error: insertError } = await supabase.from('bookings').insert([
        {
          lokale_id: room,
          user_id: userId,
          start_time: startTime.toISOString(),
          end_time: endTime.toISOString(),
        },
      ]);

      if (insertError) {
        console.error('Error inserting booking:', insertError);
        throw new Error('Der opstod en fejl ved oprettelse af bookingen.');
      }

      alert('Booking bekræftet!');
      navigate('/BookingSuccess');
    } catch (error: any) {
      console.error('Error in handleConfirmBooking:', error.message);
      alert(error.message || 'Der opstod en fejl.');
    }
  };

  return (
    <div
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        minHeight: '110vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#343a40',
          padding: '0.5rem 1rem',
          borderBottom: '1px solid #495057',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img
            src={logo}
            alt="Logo"
            style={{
              width: '150px',
              height: '60px',
              objectFit: 'contain',
            }}
          />
        </div>
      </header>

      {/* Booking Confirmation Content */}
      <Container
        size="sm"
        style={{
          marginTop: '80px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            backgroundImage: `url(${kvittering})`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            width: '100%',
            maxWidth: '500px',
            padding: '4rem 2rem',
            position: 'relative',
          }}
        >
          <Paper
            style={{
              padding: '1rem',
              textAlign: 'center',
              backgroundColor: 'transparent',
              boxShadow: 'none',
            }}
          >
            <Title order={2} style={{ marginBottom: '1rem' }}>
              DINE BOOKING-OPLYSNINGER
            </Title>
            <Text style={{ marginBottom: '1rem' }}>
              Lokale booket i Cphbusiness Lyngby
            </Text>
            <Text style={{ marginBottom: '2rem', color: 'gray' }}>
              Adresse: Firskovvej 18, 2800 Kongens Lyngby
            </Text>

            <Title order={5} style={{ marginBottom: '1rem' }}>
              Lokale booket til:
            </Title>
            <Text>
              <b>Dato:</b> {dayjs(date).isValid() ? dayjs(date).format('DD/MM/YYYY') : 'Ingen valgt'}
            </Text>
            <Text>
              <b>Tid:</b> {time || 'Ingen valgt'}
            </Text>

            <Title order={5} style={{ margin: '2rem 0 1rem' }}>
              Information om lokale:
            </Title>
            <Text>
              <b>Etage:</b> {plan || 'Ingen valgt'}
            </Text>
            <Text>
              <b>Lokale:</b> {room || 'Ingen valgt'}
            </Text>
            <Text>
              <b>Størrelse:</b> {capacity || 'Ingen valgt'} personer
            </Text>

            <Text
              style={{
                marginTop: '1.5rem',
                marginBottom: '2rem',
                fontSize: '0.875rem',
                color: 'gray',
              }}
            >
              Der bliver sendt en bekræftelsesmail til din studie mail. Hvis der
              ønskes at annullere bookingen, gør du det via mailen.
            </Text>

            <Button
              fullWidth
              onClick={handleConfirmBooking}
              variant="filled"
              color="violet"
              size="md"
              radius="xs"
            >
              Bekræft booking
            </Button>
          </Paper>
        </div>
      </Container>
    </div>
  );
};

export default BookingConfirmation;
