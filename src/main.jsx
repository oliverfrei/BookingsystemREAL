import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';

// Mantine CSS Imports
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/dropzone/styles.css';
import '@mantine/carousel/styles.css';
import '@mantine/spotlight/styles.css';
import App from './App';

// Import dayjs and set Danish locale
import dayjs from 'dayjs';
import 'dayjs/locale/da';

dayjs.locale('da'); // Set Danish locale globally

// Render the app
ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);