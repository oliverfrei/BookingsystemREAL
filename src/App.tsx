import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import Login from './routes/Login';
import LokaleOversigt from './routes/LokaleOversigt';
import BookingConfirmation from './routes/BookingConfirmation';
import BookingSuccess from './routes/BookingSuccess';

function App() {
  return (
    <MantineProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/LokaleOversigt" element={<LokaleOversigt />} />
          <Route path="/BookingConfirmation" element={<BookingConfirmation />} />
          <Route path="/BookingSuccess" element={<BookingSuccess />} />
        </Routes>
      </Router>
    </MantineProvider>
  );
}

export default App;
