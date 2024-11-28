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
  const [isModalOpen, setIsModalOpen] = useState(false); // Tilføjet for "Mine bookinger"
  const [modalBookings, setModalBookings] = useState<any[]>([]); // Tilføjet til at gemme bookinger
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

  // Henter brugerens session ved initial load
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };

    fetchUser();
  }, []);

  // Henter bookings, når brugeren er logget ind
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
    setModalOpen(true);
  };

  const handleSubmit = () => {
    if (!selectedDate || !selectedTime || !selectedRoom) {
      alert('Udfyld venligst alle felter for at booke et lokale.');
      return;
    }
  
    const selectedPlan = rooms.find((room) => room.id === selectedRoom)?.plan;
  
    if (!selectedPlan) {
      alert('Ugyldigt lokale eller etage.');
      return;
    }
  
    const formattedDate = dayjs(selectedDate).format('DD/MM/YYYY');
  
    // Check for korrekt dato
    if (!dayjs(selectedDate).isValid()) {
      alert('Ugyldig dato.');
      return;
    }
  
    navigate('/BookingConfirmation', {
      state: {
        room: selectedRoom,
        date: formattedDate,
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
    <Grid>
      {/* Modal til valg af lokale */}
      <Modal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalRoom ? `Lokale ${modalRoom.id}` : 'Vælg et lokale'}
      >
        {modalRoom ? (
          <div>
            <img
              src={getPlanImage(modalRoom.plan)}
              alt={`Plan for lokale ${modalRoom.id}`}
              style={{ width: '100%', marginBottom: '1rem' }}
            />
            <Button
              fullWidth
              onClick={() => {
                setSelectedRoom(modalRoom.id);
                setModalOpen(false);
              }}
            >
              Vælg Lokale {modalRoom.id}
            </Button>
          </div>
        ) : (
          <p>Ingen lokale valgt.</p>
        )}
      </Modal>

      {/* Modal til visning af bookinger */}
      <Modal
        opened={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Mine bookinger"
      >
        {modalBookings.length > 0 ? (
          <ul>
            {modalBookings.map((b, index) => (
              <li key={index}>
                Lokale: {b.lokale_id}, Start: {dayjs(b.start_time).format('DD/MM/YYYY HH:mm')}, Slut: {dayjs(b.end_time).format('HH:mm')}
              </li>
            ))}
          </ul>
        ) : (
          <p>Du har ingen bookinger endnu.</p>
        )}
      </Modal>

      {/* Menu til brugerens profil */}
      {user && (
        <div style={{ position: 'absolute', top: 20, right: 20 }}>
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
                    setModalBookings(bookings); // Gem bookinger i state
                    setIsModalOpen(true); // Åbn modal
                  } else {
                    setModalBookings([]);
                    setIsModalOpen(true); // Åbn modal selv uden bookinger
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
        </div>
      )}

      {/* Liste over lokaler */}
      <Grid.Col span={6}>
        <Title mb="lg" style={{ textAlign: 'center' }}>
          Lokale Oversigt
        </Title>
        <p style={{ textAlign: 'center' }}>Vælg venligst et lokale fra listen under:</p>
        {['2', '3', '4'].map((plan) => (
          <Paper shadow="md" radius="md" p="md" mb="md" key={plan}>
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

      {/* Form til valg af tid og dato */}
      <Grid.Col span={6}>
        <Title order={5} mb="md" style={{ fontWeight: 'bold' }}>
          Jeg skal bruge et lokale den:
        </Title>
        <DatePicker value={selectedDate} onChange={setSelectedDate} mb="md" />
        <Select
          label="Tidspunkt"
          placeholder="Vælg tidspunkt"
          data={timeOptions}
          value={selectedTime}
          onChange={(value: string | null) => setSelectedTime(value || null)}
          mb="md"
        />
        {selectedRoom && (
          <Title order={6} mb="md" style={{ color: 'blue' }}>
            Valgt Lokale: {selectedRoom}
          </Title>
        )}
        <Checkbox
          label="Jeg er indforstået med vilkår og betingelser"
          style={{ marginBottom: '1rem' }}
        />
        <Button fullWidth onClick={handleSubmit}>
          VÆLG
        </Button>
      </Grid.Col>
    </Grid>
  );
};

export default LokaleOversigt;
