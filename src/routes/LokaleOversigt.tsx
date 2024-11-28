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
import type { DatePickerStylesNames } from '@mantine/dates';

// Import PNG-filer
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
    setModalRoom(room);
    setSelectedRoom(room.id); // Gem det valgte lokale
    setModalOpen(true);
  };

  const handleSubmit = () => {
    if (!selectedDate || !selectedTime || !selectedRoom) {
      alert('Udfyld venligst alle felter for at booke et lokale.');
      return;
    }
  
    const formattedDate = dayjs(selectedDate).format('YYYY-MM-DD'); // Format for konsistens
    if (!dayjs(formattedDate).isValid()) {
      alert('Ugyldig dato.');
      return;
    }
  
    const selectedPlan = rooms.find((room) => room.id === selectedRoom)?.plan;
    if (!selectedPlan) {
      alert('Ugyldigt lokale eller etage.');
      return;
    }
  
    navigate('/BookingConfirmation', {
      state: {
        room: selectedRoom,
        date: formattedDate, // Overfør dato i konsistent format
        time: selectedTime,
        plan: selectedPlan,
        capacity: 4,
      },
    });
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
          {/* Modal for at vise bookinger */}
          <Modal
            opened={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title="Mine Bookinger"
          >
            {bookings.length > 0 ? (
              <ul>
                {bookings.map((booking) => (
                  <li key={booking.id}>
                    Lokale: {booking.lokale_id}, Dato: {dayjs(booking.date).format('DD/MM/YYYY')}, Tid: {booking.time}
                  </li>
                ))}
              </ul>
            ) : (
              <p>Ingen bookinger fundet.</p>
            )}
          </Modal>

          {/* Modal for at vælge lokale */}
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
                  Vælg Lokale {modalRoom.id}
                </Button>
              </div>
            )}
          </Modal>

          <Grid.Col span={6}>
            <Title mb="lg" style={{ textAlign: 'center' }}>
              Lokale Oversigt
            </Title>
            <p style={{ textAlign: 'center' }}>
              Vælg venligst et lokale fra listen under:
            </p>
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
                      color="blue"
                      onClick={() => handleRoomClick(room)}
                      mb="sm"
                    >
                      Lokale {room.id}
                    </Button>
                  ))}
              </Paper>
            ))}
          </Grid.Col>

          <Grid.Col span={6}>
            <div style={{ textAlign: 'center' }}>
              <Title order={5} mb="md">
                Jeg skal bruge et lokale den:
              </Title>
              <DatePicker
  value={selectedDate}
  onChange={setSelectedDate}
  mb="md"
  styles={{
    input: {
      backgroundColor: 'transparent',
      color: '#fff',
      border: '1px solid #845EF7',
      borderRadius: '4px',
    },
    dropdown: {
      backgroundColor: '#2c2f33',
      color: '#fff',
    },
  } as Partial<Record<DatePickerStylesNames, React.CSSProperties>>}
/>

              <Select
                label="Tidspunkt"
                placeholder="Vælg tidspunkt"
                data={timeOptions}
                value={selectedTime}
                onChange={setSelectedTime}
                mb="md"
                styles={{
                  input: {
                    backgroundColor: 'transparent',
                    color: '#fff',
                    border: '1px solid #845EF7',
                    borderRadius: '4px',
                  },
                }}
              />
              {selectedRoom && (
                <Title order={6} mb="md" style={{ color: 'blue' }}>
                  Valgt Lokale: {selectedRoom}
                </Title>
              )}
              <Checkbox
                label="Jeg accepterer vilkår og betingelser"
                style={{ marginBottom: '1rem', color: '#fff' }}
              />
              <Button
                fullWidth
                onClick={handleSubmit}
                style={{ backgroundColor: '#845EF7', color: '#fff' }}
              >
                VÆLG
              </Button>
            </div>
          </Grid.Col>
        </Grid>
      </div>
    </div>
  );
};

export default LokaleOversigt;
