import { Box, Button, Container, Dialog, DialogActions, DialogTitle, IconButton, InputBase, Paper, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';

import { getUser, User } from '../../utils/apiUtils';
import Unauthorized from '../../components/Unauthorized';
import AdminLocationCard from '../../components/AdminLocationCard';
import SearchBar from '../../components/SearchBar';

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
    const [locationToDelete, setLocationToDelete] = useState<Location | null>(null);

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
                console.log(error.message);
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
        navigate(`/admin/location/edit/${locationId}`);
    }

    async function handleDeleteClick(location: Location): Promise<void> {
        const canDelete = await checkDeletePermission();

        if (!canDelete) {
            alert('You do not have permission to delete locations');
            return;
        }

        setLocationToDelete(location)
        setPopupOpen(true);
    }

    async function checkDeletePermission(): Promise<boolean> {
        const response = await fetch('/api/user/checkPermission?permission=delete');
        if (!response.ok) {
            return false;
        }
        return true;
    }

    function handlePopupNoClick(): void {
        setPopupOpen(false);
    }

    function handlePopupYesClick(): void {
        fetch(`/api/event/deleteLocation/${locationToDelete?.locationId}`, {
            method: 'DELETE',
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Failed to delete location');
            }
            alert('Location deleted successfully');
            setPopupOpen(false);
            fetchLocations();
        })
        .catch((error) => {
            alert(error.message);
            setPopupOpen(false);
        });
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
            <Unauthorized />
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

            {/* Search & New loction Button Group */}
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
                <SearchBar
                    value={searchTerm}
                    onChange={handleInputChange}
                    onSearch={handleSearchChange}
                    onClear={() => {
                        setSearchTerm('');
                        setSearchQuery('');
                    }}
                    style={{
                        pr: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        width: '60%',
                        height: '70px',
                        mx: 'auto',
                        borderRadius: '20px',
                    }}
                />

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
                    {filteredLocations.length === 0 ? (
                        <Typography variant="h4">No locations found</Typography>
                    ) : (
                        filteredLocations.map((location) => (
                            <AdminLocationCard
                                key={location.locationName}
                                name={location.locationName}
                                province={location.province}
                                image={location.locationImage}
                                handleSeeMoreClick={() => handleSeeMoreClick(location.locationId)}
                                handleEditClick={() => handleEditClick(location.locationId)}
                                handleDeleteClick={() => handleDeleteClick(location)}
                            />
                        ))
                    )}
                    
                </Box>
            </Paper>

            {/* Overlay */}
            <Dialog
                open={popupOpen}
                onClose={handleClose}
            >
                <DialogTitle id="alert-dialog-title">
                    Delete {locationToDelete?.locationName}?
                </DialogTitle>

                <DialogActions>
                    <Button onClick={handlePopupNoClick}>
                        No
                    </Button>
                    <Button onClick={handlePopupYesClick} autoFocus>
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    )
}

export default Admin