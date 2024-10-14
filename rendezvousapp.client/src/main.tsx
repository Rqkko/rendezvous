import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { createTheme, ThemeProvider } from '@mui/material'

const theme = createTheme({
  palette: {
    primary: {
      main: "#395536"
    },
    secondary: {
      main: "#988265",
    },
    info: {
      main: "#f3ede0",
    }
  },
  typography: {
    fontFamily: 'Montserrat',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
    },
    h2: {
      fontSize: '1.5rem',
      fontWeight: 510,
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
    },
    body2: {
      fontSize: '0.875rem',
      fontWeight: 400,
    }
  },
})

const rootElement = document.getElementById('root');

if (rootElement) {
  rootElement.style.margin = '0';
  rootElement.style.padding = '0';
  rootElement.style.width = '100%';
  rootElement.style.height = '100%';
}

createRoot(rootElement!).render(
  <StrictMode>
      <ThemeProvider theme={theme}>
          <App />
      </ThemeProvider>
  </StrictMode>,
);