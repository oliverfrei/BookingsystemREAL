import React, { useState } from 'react';
import {
  Grid,
  Paper,
  Title,
  Button,
  Select,
  Checkbox,
} from '@mantine/core';
import { Calendar } from '@mantine/dates'; // Mantine Calendar komponent
import dayjs from 'dayjs'; // Til datoformatering

// Import SVG-filer
import { ReactComponent as Plan1 } from '../images/Lokaleoversigt_plan1.svg';
import { ReactComponent as Plan2 } from '../images/lokaleoversigt_plan2.svg';




const LokaleOversigt = () => {
  // States
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);

  const timeOptions = ['09:00-11:00', '11:00-13:00', '13:00-15:00', '15:00-17:00'];

  // Handlers
  const handleRoomClick = (roomId: string) => {
    setSelectedRoom(roomId);
    alert(`Du har valgt lokale ${roomId}`);
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const handleSubmit = () => {
    if (selectedRoom && selectedDate && selectedTime) {
      alert(
        `Booking bekræftet for lokale ${selectedRoom} den ${dayjs(selectedDate).format(
          'DD/MM/YYYY'
        )} fra ${selectedTime}`
      );
    } else {
      alert('Udfyld venligst alle felter for at booke et lokale.');
    }
  };

  return (
    <Grid>
      {/* Venstre side - Lokale oversigt */}
      <Grid.Col span={6}>
        <Title mb="lg" style={{ textAlign: 'center' }}>
          Lokale Oversigt
        </Title>
        <Paper shadow="md" radius="md" p="md">
          {/* Plan 1 */}




        </Paper>
      </Grid.Col>

      {/* Højre side - Kalender og booking info */}
      <Grid.Col span={6}>
        <Title order={5} mb="md" style={{ fontWeight: 'bold' }}>
          Jeg skal bruge et lokale den:
        </Title>
        <Calendar
          getDayProps={(date) => ({
            onClick: () => handleDateSelect(date), // Brug getDayProps til at håndtere klik
            selected: dayjs(date).isSame(selectedDate, 'date'),
          })}
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
          label="Jeg er indforstået med vilkår og betingelser"
          mb="md"
        />

        <Button fullWidth onClick={handleSubmit}>
          VÆLG
        </Button>
      </Grid.Col>
    </Grid>
  );
};

export default LokaleOversigt;
