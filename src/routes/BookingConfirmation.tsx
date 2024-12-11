import React from 'react';
import { Container, Paper, Title, Text, Button } from '@mantine/core';
import { useNavigate, useLocation } from 'react-router-dom';
import dayjs from 'dayjs';
import 'dayjs/locale/da';
import supabase from '../supabase/getSupabaseClient';
import logo from '../images/logo.svg';
import background from '../images/Background.svg';
import kvittering from '../images/kvittering-2.svg';

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
            <Title
              order={2}
              style={{
                marginBottom: '1rem',
                fontWeight: 300,
                fontSize: '2rem',
                lineHeight: '1.5',
                letterSpacing: '0.05rem',
                wordSpacing: '0.2rem',
                textAlign: 'center',
                marginTop: '-3rem',
              }}
            >
              DINE BOOKING-
              <br />
              OPLYSNINGER
            </Title>
            <Text
              style={{
                marginBottom: '0.5rem',
                color: 'gray',
              }}
            >
              Lokale booket i Cphbusiness Lyngby
            </Text>
            <Text
              style={{
                marginBottom: '2rem',
                color: 'gray',
                borderBottom: '1px solid gray',
                paddingBottom: '0.5rem',
              }}
            >
              Adresse: Firskovvej 18, 2800 Kongens Lyngby
            </Text>
            <Title
              order={5}
              style={{
                marginBottom: '1rem',
                color: 'gray',
                fontWeight: 400,
                fontSize: '1rem',
                borderBottom: '1px solid gray',
                paddingBottom: '0.5rem',
                width: '80%',
                textAlign: 'center',
                margin: '0 auto',
              }}
            >
              Lokale booket til:
            </Title>
            <Text>
              {date && dayjs(date).isValid()
                ? dayjs(date)
                    .format('dddd [d.] D MMMM')
                    .charAt(0)
                    .toUpperCase() +
                  dayjs(date).format('dddd [d.] D MMMM').slice(1)
                : 'Ingen valgt'}
            </Text>
            <Text>
              {time ? `Klokken ${Array.isArray(time) ? time.join(' + ') : time}` : 'Ingen valgt'}
            </Text>
            <Title
              order={5}
              style={{
                color: 'gray',
                fontWeight: 400,
                fontSize: '1rem',
                borderBottom: '1px solid gray',
                paddingBottom: '0.5rem',
                width: '80%',
                textAlign: 'center',
                margin: '2rem auto 1rem',
              }}
            >
              Information om lokale:
            </Title>
            <Text
              style={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <span>Etage:</span>
              <span
                style={{
                  flex: 1,
                  borderBottom: '1px dotted gray',
                  margin: '0 0.5rem',
                }}
              ></span>
              <span>{plan || 'Ingen valgt'}</span>
            </Text>
            <Text
              style={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <span>Lokale:</span>
              <span
                style={{
                  flex: 1,
                  borderBottom: '1px dotted gray',
                  margin: '0 0.5rem',
                }}
              ></span>
              <span>{room || 'Ingen valgt'}</span>
            </Text>
            <Text
              style={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <span>Størrelse:</span>
              <span
                style={{
                  flex: 1,
                  borderBottom: '1px dotted gray',
                  margin: '0 0.5rem',
                }}
              ></span>
              <span>{capacity || 'Ingen valgt'} personer</span>
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
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1rem',
              }}
            >
              <Button
                variant="filled"
                color="violet"
                size="lg"
                radius="xs"
                onClick={() => navigate('/BookingSuccess')}
              >
                BOOK NU
              </Button>
              <button
                onClick={() => navigate(-1)}
                style={{
                  all: 'unset',
                  display: 'block',
                  width: '130px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  marginTop: '1rem',
                }}
              >
                <span
                  style={{
                    color: 'gray',
                    fontSize: '1rem',
                    position: 'relative',
                    top: '-1px',
                  }}
                >
                  Tilbage
                </span>
                <div
                  style={{
                    width: '100%',
                    height: '1px',
                    backgroundColor: 'gray',
                    marginTop: '4px',
                  }}
                ></div>
              </button>
            </div>
          </Paper>
        </div>
      </Container>
    </div>
  );
};

export default BookingConfirmation;
