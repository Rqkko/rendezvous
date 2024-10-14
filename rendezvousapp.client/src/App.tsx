import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AppBar, Toolbar, IconButton, Typography, Button, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';

import './App.css';
import logoSmall from './assets/logo_small.png';
import Home from './views/Home';
import Login from './views/Login';

function App(): JSX.Element {

    function handleLogin() {
        window.location.pathname = '/login';
    }

    return (
        <Router>
            {window.location.pathname !== '/login' && (
                <AppBar color="secondary.light" position="fixed" sx={{ minWidth: '100vw', mb: 4, ml:0, p:0, boxSizing: 'border-box' }}>
                    <Toolbar>
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            sx={{ mr: 2 }}
                        >
                            <Box
                                component="img"
                                alt = "Rendezvous Logo"
                                src = {logoSmall}
                                // sx = {{ width: '50vh', height: '50vh', mr: 2 }}
                            />
                        </IconButton>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            News
                        </Typography>
                        <Button color="inherit" onClick={handleLogin}>Login</Button>
                    </Toolbar>
                </AppBar>
            )}
            <Box sx={{ mt: window.location.pathname !== '/login' ? '98px' : 0, width:'100vw'  }}>
            <Routes>
                <Route path="/" element={<Home/>} />
                <Route path="/login" element={<Login/>} />
            </Routes>
            </Box>
        </Router>
    );
}

export default App;