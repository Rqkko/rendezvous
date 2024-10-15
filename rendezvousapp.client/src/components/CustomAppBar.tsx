import { useEffect, useState } from 'react';
import { AppBar, Toolbar, IconButton, Button, Box, Menu, MenuItem, Typography } from '@mui/material';
import { useLocation } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { getUser, User } from '../utils/apiUtils';

import logoSmall from '../assets/logo_small.png';

function CustomAppBar(): JSX.Element | null {
    const location = useLocation();
    const [user, setUser] = useState<User | null>(null);
    
    // ----- Try Nav Stuff -----
    const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };
    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };
    // ----- End Nav Stuff -----

    function handleLogin(): void {
        window.location.pathname = '/login';
    }

    useEffect(() => {
        getUser().then((result) => setUser(result));
    }, [location.pathname]);

    // No AppBar when on login page
    if (location.pathname === '/login') {
        return null;
    }

    return (
        <>
            <AppBar
                color="info"
                position="sticky"
                sx={{ minWidth: '100vw', mb: 4, ml: 0, p: 0, boxSizing: 'border-box' }}
            >
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

                    {/* To occupy the remaining space */}
                    <Box sx={{ flexGrow: 1 }} />

                    {user 
                        ? (
                            <IconButton
                                color="inherit"
                                aria-label="profile"
                                sx={{ mr: 2 }}
                            >
                                <AccountCircle />
                            </IconButton>
                        )
                        : (
                            <Button
                                sx={{ mr: 2 }}
                                onClick={handleLogin}
                            >
                                Login
                            </Button>
                        )
                    }

                    <IconButton
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                        onClick={handleOpenUserMenu}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Menu
                        sx={{ mt: '80px' }}
                        id="menu-appbar"
                        anchorEl={anchorElUser}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'center',
                        }}
                        open={Boolean(anchorElUser)}
                        onClose={handleCloseUserMenu}
                        >
                        {settings.map((setting) => (
                            <MenuItem key={setting} onClick={handleCloseUserMenu}>
                            <Typography sx={{ textAlign: 'center' }}>{setting}</Typography>
                            </MenuItem>
                        ))}
                    </Menu>
                </Toolbar>
            </AppBar>
        </>
    );
}

export default CustomAppBar;