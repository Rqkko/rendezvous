import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AppBar, Toolbar, IconButton, Typography, Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

import './App.css';
import Home from './views/Home';
import Login from './views/Login';

function App(): JSX.Element {

    function handleLogin() {
        window.location.pathname = '/login';
    }

    return (
        <Router>
            {window.location.pathname !== '/login' && (
                <AppBar position="fixed" sx={{ minWidth: '100vw' }}>
                    <Toolbar>
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            sx={{ mr: 2 }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            News
                        </Typography>
                        <Button color="inherit" onClick={handleLogin}>Login</Button>
                    </Toolbar>
                </AppBar>
            )}
            <Routes>
                <Route path="/" element={<Home/>} />
                <Route path="/login" element={<Login/>} />
            </Routes>
         </Router>
    );
}

export default App;