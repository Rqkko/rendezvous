import { useEffect, useState } from 'react';
import { AppBar, Toolbar, IconButton, Button, Box, Menu, MenuItem, Typography } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { getUser, User } from '../utils/apiUtils';

import logoSmall from '../assets/logo_small.png';

function CustomAppBar(): JSX.Element | null {
    const location = useLocation();
    const [user, setUser] = useState<User | null>(null);
    const navigate = useNavigate();
    const settings = ['Home', 'Reservations', 'Account', 'Logout']; // For Menu
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
    const [anchorElAccount, setAnchorElAccount] = useState<null | HTMLElement>(null);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);

    function handleLogoClick(): void {
        navigate('/');
    }

    function handleOpenUserMenu(event: React.MouseEvent<HTMLElement>): void {
        setAnchorElUser(event.currentTarget);
    };
    function handleCloseUserMenu(): void {
        setAnchorElUser(null);
    };
    function handleMenuItemClick(setting: string): void {
        if (setting === "Home") {
            navigate('');
        }
        else if (setting === "Reservations") {
            navigate('/reservations')
        }
        else if (setting === "Account") {
            navigate("/account")
        }
        else if (setting === "Logout") {
            fetch('api/user/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Logout failed');
                    }
                    return response.json();
                })
                .catch(error => {
                    console.error('Error:', error);
                });
            setUser(null);
            navigate('/login');
        }
        handleCloseUserMenu();
    };

    function handleOpenAccount(event: React.MouseEvent<HTMLElement>): void {
        setAnchorElAccount(event.currentTarget);
    }
    function handleCloseAccount(): void {
        setAnchorElAccount(null);
    }

    function handleLogin(): void {
        window.location.pathname = '/login';
    }

    useEffect(() => {
        getUser().then((result) => setUser(result));

        fetch('/api/user/checkAdmin')
        .then((response) => {
            if (!response.ok) {
                setIsAdmin(false);
            } else {
                setIsAdmin(true);
            }
        })
    }, [location.pathname]);

    // No AppBar when on login page
    if (location.pathname === '/login') {
        return null;
    }

    return (
        <>
            <AppBar
                color="main"
                position="sticky"
                sx={{ minWidth: '100vw', mb: 4, ml: 0, p: 0, boxSizing: 'border-box', bgcolor: 'background.default' }}
            >
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                        onClick={handleLogoClick}
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
                            <>
                                <IconButton
                                    color="inherit"
                                    aria-label="profile"
                                    sx={{ mr: 2 }}
                                    onClick={handleOpenAccount}
                                >
                                    <AccountCircle />
                                </IconButton>
                                <Menu
                                    anchorEl={anchorElAccount}
                                    open={Boolean(anchorElAccount)}
                                    onClose={handleCloseAccount}
                                    anchorOrigin={{
                                        vertical: 'center',
                                        horizontal: 'left',
                                    }}
                                    transformOrigin={{
                                        vertical: 'center',
                                        horizontal: 'right',
                                    }}
                                >
                                    <Typography>{user.firstname + " " + user.lastname + (isAdmin ? " (Admin)" : "")}</Typography>
                                </Menu>
                            </>
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
                            <MenuItem key={setting} onClick={() => handleMenuItemClick(setting)}>
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