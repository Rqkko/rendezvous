import { Box, Button, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, InputBase, Paper, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';

import { getUser, User } from '../../utils/apiUtils';
import Unauthorized from '../../components/Unauthorized';
import AdminLocationCard from '../../components/AdminLocationCard';

interface Location {
    locationId: number;
    locationName: string;
    province: string;
    locationImage: string;
}

function Admin(): JSX.Element {
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [user, setUser] = useState<User | null>(null);
    const location = useLocation(); // For path url
    const navigate = useNavigate();
    const [locations, setLocations] = useState<Location[]>([]);
    const [popupOpen, setPopupOpen] = useState<boolean>(false);

    function handleInputChange(event: React.ChangeEvent<HTMLInputElement>): void {
        setSearchTerm(event.target.value);
    };

    function handleSearchChange(): void {
        setSearchQuery(searchTerm);
    };

    function fetchLocations(): void {
        fetch('/api/event/getAllLocations')
            .then((response) => response.json())
            .then((data) => {
                setLocations(data);
            })
            .catch((error) => {
                alert(error.message);
            });
    };

    function handleNewLocationClick(): void {
        navigate('/admin/location/new');
    }

    function handleSeeMoreClick(locationId: number): void {
        navigate(`/location/${locationId}`)
    }

    const handleClose = () => {
        setPopupOpen(false);
    };

    function handleEditClick(locationId: number): void {
        // TODO: Check edit permission
        
    }

    function handleDeleteClick(locationId: number): void {
        // TODO: Check delete permission
        setPopupOpen(true);
    }

    const filteredLocations = locations.filter(location =>
        location.locationName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    useEffect(() => {
        fetch('/api/user/checkAdmin')
        .then((response) => {
            if (!response.ok) {
                setIsAdmin(false);
            } else {
                setIsAdmin(true);
            }
        })
        .then(() => {
            getUser().then((result) => setUser(result));
            fetchLocations();
        })
    }, [location.pathname]);

    if (!isAdmin) {
        return (
            <>
            <Unauthorized />
            </>
        )
    }

    return (
        <Container 
        sx={{
            overflow: 'hidden',
            width: '100vw',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        }}
        >
            <Typography variant="h2" sx={{ mb: 2}}>Locations (Admin)</Typography>

            {/* Search & New locaiton Button Group */}
            <Container 
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '60vw',
                    py: 2,
                    mb: 4
                }}
            >
                <Paper
                    component="form"
                    sx={{
                        pr: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        width: '60%',
                        height: '70px',
                        mx: 'auto',
                        borderRadius: '20px',
                    }}
                >
                    <InputBase
                    sx={{ ml: 1, flex: 1, alignItems: 'center' }}
                    placeholder="Search Locations"
                    inputProps={{ 'aria-label': 'search locations' }}
                    value={searchTerm}
                    onChange={handleInputChange}
                    />
                    <IconButton 
                        type="button"
                        sx={{ p: '10px' }}
                        aria-label="search"
                        onClick={handleSearchChange}
                    >
                        <SearchIcon />
                    </IconButton>
                </Paper>

                <Button
                    startIcon={<AddIcon />}
                    variant="contained"
                    color="secondary"
                    onClick={handleNewLocationClick}
                    sx={{ textTransform: 'none'}}
                >
                    New Location
                </Button>
            </Container>

            <Paper sx={{ 
                height: '50vh',
                width: '60vw',
                overflow: 'auto',
                bgcolor: 'transparent',
                p: 4,
                borderRadius: 6,
                borderStyle: 'none',
                boxShadow: 5,
                borderColor: 'black',
                mb: 2,
                }}
            >
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, }}>
                    {filteredLocations.map((location) => (
                        <AdminLocationCard
                            key={location.locationName}
                            name={location.locationName}
                            province={location.province}
                            image={location.locationImage}
                            handleSeeMoreClick={() => handleSeeMoreClick(location.locationId)}
                            handleEditClick={() => handleEditClick(location.locationId)}
                            handleDeleteClick={() => handleDeleteClick(location.locationId)}
                        />
                    ))}
                </Box>
            </Paper>

            {/* Overlay */}
            <Dialog
                open={popupOpen}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                {"Use Google's location service?"}
                </DialogTitle>
                <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Let Google help apps determine location. This means sending anonymous
                    location data to Google, even when no apps are running.
                </DialogContentText>
                </DialogContent>
                <DialogActions>
                <Button onClick={handleClose}>Disagree</Button>
                <Button onClick={handleClose} autoFocus>
                    Agree
                </Button>
                </DialogActions>
            </Dialog>
        </Container>
    )
}

export default Admin