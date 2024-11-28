import React from 'react';
import { Container, Paper, Title, Text, Button } from '@mantine/core';
import { useNavigate, useLocation } from 'react-router-dom';
import dayjs from 'dayjs';
import supabase from '../supabase/getSupabaseClient';

const BookingConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { room, date, time, plan, capacity } = location.state || {};

  const handleConfirmBooking = async () => {
    try {
      // Validate if `date`, `time`, and `room` are present
      if (!date || !time || !room) {
        console.error('Missing required fields:', { date, time, room });
        throw new Error('Alle felter skal udfyldes.');
      }
  
      // Split time string into start and end times
      const [startTimeStr, endTimeStr] = time.split('-');
      if (!startTimeStr || !endTimeStr) {
        console.error('Invalid time format:', time);
        throw new Error('Tidspunktet er ikke korrekt formateret. Forventet format: HH:MM-HH:MM');
      }
  
      // Parse the date and time using dayjs
      const parsedDate = dayjs(date, 'DD/MM/YYYY'); // Ensure this matches the format you're sending
      if (!parsedDate.isValid()) {
        console.error('Invalid date:', date);
        throw new Error('Datoen er ugyldig. Sørg for at vælge en gyldig dato.');
      }
  
      // Combine the parsed date with start and end times
      const startTime = parsedDate
        .hour(Number(startTimeStr.split(':')[0]))
        .minute(Number(startTimeStr.split(':')[1]))
        .second(0);
  
      const endTime = parsedDate
        .hour(Number(endTimeStr.split(':')[0]))
        .minute(Number(endTimeStr.split(':')[1]))
        .second(0);
  
      // Check validity of start and end times
      if (!startTime.isValid() || !endTime.isValid()) {
        console.error('Invalid start or end time:', { startTime, endTime });
        throw new Error('Ugyldige dato- eller tidsværdier.');
      }
  
      // Log start and end times for debugging
      console.log('Start Time:', startTime.toISOString());
      console.log('End Time:', endTime.toISOString());
  
      // Fetch user session
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
  
      // Insert booking into Supabase
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
    <Container size="sm" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Paper
        style={{
          padding: '2rem',
          textAlign: 'center',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          borderRadius: '12px',
        }}
      >
        <Title order={2} style={{ marginBottom: '1rem' }}>
          DINE BOOKING-OPLYSNINGER
        </Title>
        <Text style={{ marginBottom: '1rem' }}>Lokale booket i Cphbusiness Lyngby</Text>
        <Text style={{ marginBottom: '2rem', color: 'gray' }}>Adresse: Firskovvej 18, 2800 Kongens Lyngby</Text>

        <Title order={5} style={{ marginBottom: '1rem' }}>
          Lokale booket til:
        </Title>
        <Text>
          <b>Dato:</b> {date || 'Ingen valgt'}
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

        <Text style={{ marginTop: '1.5rem', marginBottom: '2rem', fontSize: '0.875rem', color: 'gray' }}>
          Der bliver sendt en bekræftelsesmail til din studie mail. Hvis der ønskes at annullere bookingen, gør du det via
          mailen.
        </Text>

        <Button
          fullWidth
          onClick={handleConfirmBooking}
          style={{ backgroundColor: '#845EF7', color: '#fff' }}
        >
          Bekræft booking
        </Button>
      </Paper>
    </Container>
  );
};

export default BookingConfirmation;
