import React from 'react';
import { AppBar, Toolbar, IconButton, Typography, Button, Box } from '@mui/material';
import { useLocation } from 'react-router-dom';
import logoSmall from '../assets/logo_small.png';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';

function CustomAppBar(): JSX.Element | null {
    const location = useLocation();

    function handleLogin() {
        window.location.pathname = '/login';
    }

    // No AppBar when on login page
    if (location.pathname === '/login') {
        return null;
    }

    return (
        <>
            <AppBar color="info" position="sticky" sx={{ minWidth: '100vw', mb: 4, ml: 0, p: 0, boxSizing: 'border-box' }}>
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
                            alt="Rendezvous Logo"
                            src={logoSmall}
                        />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        News
                    </Typography>
                    <Button color="inherit" onClick={handleLogin}>Login</Button>
                </Toolbar>
            </AppBar>
            {/*  */}
            {/* <Box sx={{ width:'100vw',height:'97px' }}></Box> */}
        </>
    );
}

export default CustomAppBar;