// src/components/HomePage.tsx
import React, { useState } from 'react';
import { Container, TextField, Grid, Card, CardContent, Typography, Button } from '@mui/material';

// Location data structure
interface Location {
    id: number;
    name: string;
    address: string;
}

function Home() {
    const [searchQuery, setSearchQuery] = useState('');
    
    // Sample location data
    const locations: Location[] = [
        { id: 1, name: 'Banquet Hall A', address: '123 Main St' },
        { id: 2, name: 'Garden View Center', address: '456 Park Ave' },
        { id: 3, name: 'Oceanfront Venue', address: '789 Coast Rd' },
    ];

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };

    const filteredLocations = locations.filter(location =>
        location.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Container>
        {/* Search Bar */}
        <TextField
            fullWidth
            label="Search Locations"
            variant="outlined"
            value={searchQuery}
            onChange={handleSearchChange}
            style={{ margin: '20px 0' }}
        />
        
        {/* Locations List */}
        <Grid container spacing={3}>
            {filteredLocations.map((location) => (
            <Grid item xs={12} sm={6} md={4} key={location.id}>
                <Card>
                <CardContent>
                    <Typography variant="h6">{location.name}</Typography>
                    <Typography variant="body2" color="textSecondary">
                    {location.address}
                    </Typography>
                    {/* Add button for reservation, admin can have edit, delete */}
                    <Button variant="contained" color="primary" style={{ marginTop: '10px' }}>
                    Reserve
                    </Button>
                </CardContent>
                </Card>
            </Grid>
            ))}
        </Grid>
        </Container>
    );
};

export default Home;