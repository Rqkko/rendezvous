import React, { useEffect, useState } from 'react';
import { Container, Typography, Paper, Box } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

import { User, getUser } from '../utils/apiUtils';
import LocationCard from '../components/LocationCard';
import SearchBar from '../components/SearchBar';

interface Location {
    locationId: number;
    locationName: string;
    province: string;
    locationImage: string;
}

function Home(): JSX.Element {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [user, setUser] = useState<User | null>(null);
    const location = useLocation(); // For path url
    const navigate = useNavigate();
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

    function handleSeeMoreClick(locationId: number): void {
        navigate(`/location/${locationId}`)
    }

    const filteredLocations = locations.filter(location =>
        location.locationName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    useEffect(() => {
        getUser().then((result) => setUser(result));
        fetchLocations();
    }, [location.pathname]);

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
            <Typography variant="h2" sx={{ mb: 4}}>Locations</Typography>

            <SearchBar
                value={searchTerm}
                onChange={handleInputChange}
                onSearch={handleSearchChange}
                onClear={() => {
                    setSearchTerm('');
                    setSearchQuery('');
                }}
            />

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
                            <LocationCard
                                key={location.locationName}
                                name={location.locationName}
                                province={location.province}
                                image={location.locationImage}
                                handleSeeMoreClick={() => handleSeeMoreClick(location.locationId)}
                            />
                        ))
                    )}
                </Box>
            </Paper>
        </Container>
    );
};

export default Home;