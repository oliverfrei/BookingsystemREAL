import React, { useState, useEffect } from 'react';
import {
  Grid,
  Paper,
  Title,
  Button,
  Select,
  Checkbox,
  Menu,
  Avatar,
  Modal,
} from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import supabase from '../supabase/getSupabaseClient';
import logo from '../images/logo.svg';
import Plan1 from '../images/Plan1.png';
import Plan2 from '../images/Plan2.png';
import Plan3 from '../images/Plan3.png';
import Plan4 from '../images/Plan4.png';

const LokaleOversigt = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<number | undefined>(undefined);
  const [modalRoom, setModalRoom] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const timeOptions = ['09:00-11:00', '11:00-13:00', '13:00-15:00', '15:00-17:00'];

  const rooms = [
    { id: 28, plan: '2' },
    { id: 221, plan: '2' },
    { id: 310, plan: '3' },
    { id: 311, plan: '3' },
    { id: 312, plan: '3' },
    { id: 33, plan: '3' },
    { id: 39, plan: '3' },
    { id: 41, plan: '4' },
    { id: 42, plan: '4' },
    { id: 43, plan: '4' },
  ];

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (user) fetchBookings();
  }, [user]);

  const fetchBookings = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('user_id', user.id);

    if (error) {
      console.error('Fejl ved hentning af bookinger:', error.message);
    } else {
      setBookings(data || []);
    }
  };

  const handleRoomClick = (room: any) => {
    setSelectedRoom(room.id);
    setModalRoom(room);
    setModalOpen(true);
  };

  const handleNavigateToConfirmation = () => {
    if (!selectedDate || !selectedTime || !selectedRoom) {
      alert('Udfyld venligst alle felter før du fortsætter.');
      return;
    }

    const selectedPlan = rooms.find((room) => room.id === selectedRoom)?.plan;
    navigate('/BookingConfirmation', {
      state: {
        room: selectedRoom,
        date: dayjs(selectedDate).format('YYYY-MM-DD'),
        time: selectedTime,
        plan: selectedPlan,
        capacity: 4,
      },
    });
  };

  const handleDeleteBooking = async (bookingId: number) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', bookingId);

      if (error) {
        console.error('Error deleting booking:', error.message);
        alert('Kunne ikke slette bookingen. Prøv igen.');
      } else {
        setBookings((prevBookings) => prevBookings.filter((booking) => booking.id !== bookingId));
        alert('Booking slettet!');
      }
    } catch (error) {
      console.error('Error deleting booking:', error);
      alert('Der opstod en fejl.');
    }
  };

  const getPlanImage = (plan: string) => {
    switch (plan) {
      case '1':
        return Plan1;
      case '2':
        return Plan2;
      case '3':
        return Plan3;
      case '4':
        return Plan4;
      default:
        return '';
    }
  };

  return (
    <div
      style={{
        backgroundColor: '#212529',
        color: '#fff',
        minHeight: '100vh',
      }}
    >
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
        <img
          src={logo}
          alt="Logo"
          style={{ width: '150px', height: 'auto', objectFit: 'contain' }}
        />
        {user && (
          <Menu shadow="md" width={200}>
            <Menu.Target>
              <Avatar color="blue" radius="xl">
                {user.email.slice(0, 2).toUpperCase()}
              </Avatar>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Label>Min Profil</Menu.Label>
              <Menu.Item
                onClick={() => {
                  if (bookings.length > 0) {
                    setIsModalOpen(true);
                  } else {
                    alert('Ingen bookinger fundet.');
                  }
                }}
              >
                Mine bookinger
              </Menu.Item>
              <Menu.Item color="red" onClick={() => supabase.auth.signOut()}>
                Log ud
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        )}
      </header>

      <div style={{ paddingTop: '80px' }}>
        <Grid>
          <Grid.Col span={6}>
            <Title mb="lg" style={{ textAlign: 'center' }}>
              Lokale Oversigt
            </Title>
            {['2', '3', '4'].map((plan) => (
              <Paper
                radius="md"
                p="md"
                mb="md"
                key={plan}
                style={{ backgroundColor: '#2c2f33', color: '#fff' }}
              >
                <Title order={5} mb="sm">
                  Etage {plan}
                </Title>
                {rooms
                  .filter((room) => room.plan === plan)
                  .map((room) => (
                    <Button
                      key={room.id}
                      fullWidth
                      variant="light"
                      style={{
                        backgroundColor: selectedRoom === room.id ? '#845EF7' : '#51cf66',
                        color: '#fff',
                        marginBottom: '0.5rem',
                      }}
                      onClick={() => handleRoomClick(room)}
                    >
                      Lokale {room.id}
                    </Button>
                  ))}
              </Paper>
            ))}
          </Grid.Col>

          <Grid.Col span={6} style={{ textAlign: 'center' }}>
            <Title order={5} mb="md">
              Jeg skal bruge et lokale den:
            </Title>
            <DatePicker
              value={selectedDate}
              onChange={setSelectedDate}
              styles={{
                day: {
                  color: '#fff',
                  '&[data-selected]': {
                    backgroundColor: '#845EF7',
                    color: '#000',
                  },
                },
              }}
            />
            <Select
              label="Tidspunkt"
              placeholder="Vælg tidspunkt"
              data={timeOptions}
              value={selectedTime}
              onChange={setSelectedTime}
              mb="md"
            />
            <Checkbox
              label="Jeg accepterer vilkår og betingelser"
              style={{ marginBottom: '1rem' }}
            />
            <Button
              fullWidth
              onClick={handleNavigateToConfirmation}
              style={{ backgroundColor: '#845EF7', color: '#fff' }}
            >
              VÆLG
            </Button>
          </Grid.Col>
        </Grid>
        <Modal
          opened={modalOpen}
          onClose={() => setModalOpen(false)}
          title={modalRoom ? `Lokale ${modalRoom.id}` : 'Vælg et lokale'}
        >
          {modalRoom && (
            <div>
              <img
                src={getPlanImage(modalRoom.plan)}
                alt={`Plan for lokale ${modalRoom.id}`}
                style={{ width: '100%', marginBottom: '1rem' }}
              />
              <Button fullWidth onClick={() => setModalOpen(false)}>
                Luk
              </Button>
            </div>
          )}
        </Modal>
        <Modal
          opened={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Mine Bookinger"
        >
          {bookings.length > 0 ? (
            <ul>
              {bookings.map((booking) => (
                <li key={booking.id}>
                  Lokale: {booking.lokale_id}, 
                  Dato: {dayjs(booking.start_time).format('DD/MM/YYYY')}, 
                  Tid: {dayjs(booking.start_time).format('HH:mm')} -{' '}
                  {dayjs(booking.end_time).format('HH:mm')}
                  <Button
                    color="red"
                    onClick={() => handleDeleteBooking(booking.id)}
                    style={{ marginLeft: '1rem' }}
                  >
                    Slet
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <p>Ingen bookinger fundet.</p>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default LokaleOversigt;