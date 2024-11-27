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
import supabase from '../supabase/getSupabaseClient';

// Import PNG-filer
import Plan1 from '../images/Plan1.png';
import Plan2 from '../images/Plan2.png';
import Plan3 from '../images/Plan3.png';
import Plan4 from '../images/Plan4.png';

const LokaleOversigt = () => {
  // States
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined);
  const [selectedRoom, setSelectedRoom] = useState<number | undefined>(undefined);
  const [modalRoom, setModalRoom] = useState<any>(null); // Lokale for modal
  const [bookings, setBookings] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const timeOptions = ['09:00-11:00', '11:00-13:00', '13:00-15:00', '15:00-17:00'];

  // Dummy data for rooms
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

  // Fetch bookings and user from Supabase
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user || null;
      console.log('Fetched user:', user);
      setUser(user);
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user]);

  const fetchBookings = async () => {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('user_id', user?.id);

    if (error) {
      console.error('Error fetching bookings:', error);
    } else {
      setBookings(data);
      console.log('Fetched bookings:', data);
    }
  };

  // Handlers
  const handleRoomClick = (room: any) => {
    setModalRoom(room);
    setModalOpen(true); // Åbn modal
  };

  const handleRoomSelect = () => {
    setSelectedRoom(modalRoom.id); // Gem valgt lokale
    setModalOpen(false); // Luk modal
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

  const handleSubmit = async () => {
    if (selectedRoom && selectedDate && selectedTime) {
      const [startHour, endHour] = selectedTime.split('-').map((t) => Number(t.split(':')[0]));
      const startTime = dayjs(selectedDate).hour(startHour).minute(0).second(0).toISOString();
      const endTime = dayjs(selectedDate).hour(endHour).minute(0).second(0).toISOString();

      try {
        const { data: conflictingBookings, error: conflictError } = await supabase
          .from('bookings')
          .select('*')
          .eq('lokale_id', selectedRoom)
          .or(`start_time.lt.${endTime},end_time.gt.${startTime}`);

        if (conflictError) {
          console.error('Error checking for conflicts:', conflictError);
          alert('Der opstod en fejl ved kontrol af konflikter.');
          return;
        }

        if (conflictingBookings && conflictingBookings.length > 0) {
          alert('Lokalet er allerede booket på dette tidspunkt. Vælg venligst et andet lokale eller tidspunkt.');
          return;
        }

        const { error } = await supabase.from('bookings').insert([
          {
            lokale_id: selectedRoom,
            user_id: user.id,
            start_time: startTime,
            end_time: endTime,
          },
        ]);

        if (error) {
          console.error('Error saving booking:', error);
          alert('Der opstod en fejl ved oprettelse af bookingen.');
        } else {
          alert(
            `Booking bekræftet for lokale ${selectedRoom} den ${dayjs(selectedDate).format('DD/MM/YYYY')} fra ${selectedTime}`
          );
          fetchBookings();
        }
      } catch (error) {
        console.error('Unexpected error:', error);
        alert('Der opstod en uventet fejl. Prøv igen senere.');
      }
    } else {
      alert('Udfyld venligst alle felter for at booke et lokale.');
    }
  };

  return (
    <Grid>
      {/* Modal til lokales billede */}
      <Modal opened={modalOpen} onClose={() => setModalOpen(false)} title={`Lokale ${modalRoom?.id}`}>
        {modalRoom && (
          <div>
            <img
              src={getPlanImage(modalRoom.plan)}
              alt={`Plan for lokale ${modalRoom.id}`}
              style={{ width: '100%', marginBottom: '1rem' }}
            />
            <Button fullWidth onClick={handleRoomSelect}>
              Vælg Lokale {modalRoom.id}
            </Button>
          </div>
        )}
      </Modal>

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
                    const userBookings = bookings.map(
                      (b) =>
                        `Lokale: ${b.lokale_id}, Start: ${dayjs(b.start_time).format(
                          'DD/MM/YYYY HH:mm'
                        )}, Slut: ${dayjs(b.end_time).format('HH:mm')}`
                    );
                    alert(userBookings.join('\n'));
                  } else {
                    alert('Du har ingen bookinger endnu.');
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
          onChange={setSelectedTime}
          mb="md"
        />
        {selectedRoom && (
          <Title order={6} mb="md" style={{ color: 'blue' }}>
            Valgt Lokale: {selectedRoom}
          </Title>
        )}
        <Checkbox label="Jeg er indforstået med vilkår og betingelser" mb="md" />
        <Button fullWidth onClick={handleSubmit}>
          VÆLG
        </Button>
      </Grid.Col>
    </Grid>
  );
};

export default LokaleOversigt;
