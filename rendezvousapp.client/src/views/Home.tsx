import React, { useState } from 'react';
import { Container, TextField, Card, CardContent, Typography, Button, Box, Tab, Tabs, InputAdornment, Grid2 } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';

interface Location {
    id: number;
    name: string;
    address: string;
    image: string;
}

function Home(): JSX.Element {
    const [searchQuery, setSearchQuery] = useState('');
    const [tabValue, setTabValue] = useState(0);
    
    const locations: Location[] = [
        { id: 1, name: 'Anyamanee Cafe and Roastery', address: '163, Bang Sao Thong, Bang Sao Thong, Samut Prakan', image: 'path/to/anyamanee.jpg' },
        { id: 2, name: 'Babyccino Ekkamai', address: '53 Ekkamai 12 Alley, Khlong Tan Nuea, Watthana, Bangkok', image: 'path/to/babyccino.jpg' },
        { id: 3, name: 'CURVE CAF', address: 'Khlong Nueng, Khlong Luang District, Pathum Thani', image: 'path/to/curve.jpg' },
    ];

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const filteredLocations = locations.filter(location =>
        location.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Container>
            <Box sx={{ backgroundImage: 'url(path/to/background-image.jpg)', backgroundSize: 'cover', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                <TextField
                    fullWidth
                    placeholder="Search"
                    variant="outlined"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    sx={{ maxWidth: '600px', bgcolor: 'white', borderRadius: '20px' }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />
            </Box>
            
            <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 2 }}>
                <Tab label="Locations" />
                <Tab label="My Reservations" />
            </Tabs>
            
            <Grid2 container spacing={2}>
                {filteredLocations.map((location) => (
                <Grid2 xs={12} key={location.id}>
                    <Card sx={{ display: 'flex', height: '150px' }}>
                        <Box sx={{ width: '30%', backgroundImage: `url(${location.image})`, backgroundSize: 'cover' }} />
                        <CardContent sx={{ width: '70%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <Box>
                                <Typography variant="h6" component="div">{location.name}</Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                                    <LocationOnIcon fontSize="small" sx={{ mr: 0.5 }} />
                                    {location.address}
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Button variant="outlined" size="small">description</Button>
                                <Typography variant="body2" color="primary" sx={{ cursor: 'pointer' }}>
                                    See more 
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid2>
                ))}
            </Grid2>

            <Grid2 container spacing={2}>
                {filteredLocations.map((location) => (
                <Grid2 xs={12} key={location.id}>
                    <Card sx={{ display: 'flex', height: '150px' }}>
                        <Box sx={{ width: '30%', backgroundImage: `url(${location.image})`, backgroundSize: 'cover' }} />
                        <CardContent sx={{ width: '70%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <Box>
                                <Typography variant="h6" component="div">{location.name}</Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                                    <LocationOnIcon fontSize="small" sx={{ mr: 0.5 }} />
                                    {location.address}
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Button variant="outlined" size="small">description</Button>
                                <Typography variant="body2" color="primary" sx={{ cursor: 'pointer' }}>
                                    See more 
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid2>
                ))}
            </Grid2>
            <Grid2 container spacing={2}>
                {filteredLocations.map((location) => (
                <Grid2 xs={12} key={location.id}>
                    <Card sx={{ display: 'flex', height: '150px' }}>
                        <Box sx={{ width: '30%', backgroundImage: `url(${location.image})`, backgroundSize: 'cover' }} />
                        <CardContent sx={{ width: '70%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <Box>
                                <Typography variant="h6" component="div">{location.name}</Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                                    <LocationOnIcon fontSize="small" sx={{ mr: 0.5 }} />
                                    {location.address}
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Button variant="outlined" size="small">description</Button>
                                <Typography variant="body2" color="primary" sx={{ cursor: 'pointer' }}>
                                    See more 
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid2>
                ))}
            </Grid2>
        </Container>
    );
};

export default Home;