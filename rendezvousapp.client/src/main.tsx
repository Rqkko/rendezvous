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
      main: "#988265"
    },
  },
  typography: {
    fontFamily: 'Montserrat',
    h1: {
      fontSize: '2rem',
      fontWeight: 600,
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </StrictMode>,
)
