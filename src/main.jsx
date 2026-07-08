import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import AppProviders from './plugins/AppProviders.jsx'

// Mantine
import { MantineProvider } from '@mantine/core'
import '@mantine/core/styles.css';

// Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MantineProvider>
      <AppProviders>
        <App />
      </AppProviders>
    </MantineProvider>
  </StrictMode>,
)
