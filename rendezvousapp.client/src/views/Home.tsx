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
    const [filteredLocations, setFilteredLocations] = useState<Location[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    function handleInputChange(event: React.ChangeEvent<HTMLInputElement>): void {
        setSearchTerm(event.target.value);
    };

    function handleSearchChange(): void {
        setSearchQuery(searchTerm);
    };

    function filterLocations(): void {
        setFilteredLocations(locations.filter(location =>
            location.locationName.toLowerCase().includes(searchTerm.toLowerCase())
        ));
    }

    function fetchLocations(): void {
        Promise.all([
            fetch('/api/event/getAllLocations'),
            new Promise(resolve => setTimeout(resolve, 1000))
        ])
        .then(([response]) => {
            if (!response.ok) {
                setLocations([]);
                setFilteredLocations([]);
                setLoading(false);
                throw new Error('Failed to fetch locations');
            }
            return response.json();
        })
        .then((data) => {
            setLocations(data);
            setFilteredLocations(data);
            setLoading(false);
        })
        .catch((error) => {
            console.log(error.message);
        });
    };

    function handleSeeMoreClick(locationId: number): void {
        navigate(`/location/${locationId}`)
    }

    useEffect(() => {
        getUser().then((result) => setUser(result));
        fetchLocations();
    }, [location.pathname]);

    useEffect(() => {
        filterLocations();
    }, [searchQuery]);

    if (loading) {
        return (
            // Loading...
            <div className="loader" style={{marginTop: '100px'}}></div>
        );
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
            <Typography variant="h2" sx={{ mb: 4}}>Locations</Typography>

            <SearchBar
                value={searchTerm}
                onChange={handleInputChange}
                onSearch={handleSearchChange}
                onClear={() => {
                    setSearchTerm('')
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