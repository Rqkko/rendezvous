import React, { useEffect, useState } from 'react';
import { Container, Typography, Paper, IconButton, InputBase, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useLocation } from 'react-router-dom';
import { User, getUser } from '../utils/apiUtils';
import LocationCard from '../components/LocationCard';

interface Location {
    locationName: string;
    address: string;
    locationImage: string;
}

function Home(): JSX.Element {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [user, setUser] = useState<User | null>(null);
    const location = useLocation(); // For path url
    const [locations, setLocations] = useState<Location[]>([]);

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

    const filteredLocations = locations.filter(location =>
        location.locationName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    useEffect(() => {
        getUser().then((result) => setUser(result));
        fetchLocations();
    }, [location.pathname]);

    return (
        <Container sx={{ overflow: 'hidden', width: '100vw' }}>
            <Typography variant="h2" sx={{ mb: 4}}>Locations</Typography>

            <Paper
                component="form"
                sx={{ 
                    p: '2px 4px',
                    display: 'flex',
                    alignItems: 'center',
                    width: '600px',
                    height: '70px',
                    mx: 'auto',
                    mb: 4,
                    borderRadius: '20px'
                }}
            >
                <InputBase
                sx={{ ml: 1, flex: 1 }}
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

            <Paper sx={{ 
                height: '60vh',
                width: '60vw',
                overflow: 'auto',
                bgcolor: 'transparent',
                p: 4,
                borderRadius: 6,
                borderStyle: 'none',
                boxShadow: 5,
                borderColor: 'black',
                mb: 2
                }}
            >
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, }}>
                    {filteredLocations.map((location) => (
                        <LocationCard key={location.locationName} name={location.locationName} address={location.address} image={location.locationImage} />
                    ))}
                    {filteredLocations.map((location) => (
                        <LocationCard key={location.locationName} name={location.locationName} address={location.address} image={location.locationImage} />
                    ))}
                </Box>
            </Paper>
        </Container>
    );
};

export default Home;