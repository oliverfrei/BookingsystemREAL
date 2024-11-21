import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import Login from './routes/Login';
import LokaleOversigt from './routes/LokaleOversigt';

function App() {
  return (
    <MantineProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/LokaleOversigt" element={<LokaleOversigt />} />
        </Routes>
      </Router>
    </MantineProvider>
  );
}

export default App;
