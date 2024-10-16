import React, { useEffect, useState } from 'react';
import { Container, TextField, Card, CardContent, Typography, Button, Box, Tab, Tabs, InputAdornment, Grid2 } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useLocation } from 'react-router-dom';
import { User, getUser } from '../utils/apiUtils';
import LocationCard from '../components/LocationCard';

interface Location {
    id: number;
    name: string;
    address: string;
    image: string;
}

function Home(): JSX.Element {
    const [searchQuery, setSearchQuery] = useState('');
    const [tabValue, setTabValue] = useState(0);
    const [user, setUser] = useState<User | null>(null);
    const location = useLocation();
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

    useEffect(() => {
        getUser().then((result) => setUser(result));
    }, [location.pathname]);

    return (
        <Container>
            <Typography variant="h2" sx={{ mb: 4}}>Locations</Typography>

            <TextField
                fullWidth
                placeholder="Search"
                variant="outlined"
                value={searchQuery}
                onChange={handleSearchChange}
                sx={{ maxWidth: '600px', bgcolor: 'white', borderRadius: '20px', mb: 4 }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon />
                        </InputAdornment>
                    ),
                }}
            />

            {/* <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 2 }}>
                <Tab label="Locations" />
                <Tab label="My Reservations" />
            </Tabs> */}

            <LocationCard title="Anyamanee Cafe and Roastery" location="163, Bang Sao Thong, Bang Sao Thong, Samut Prakan" image="https://images.unsplash.com/photo-1493857671505-72967e2e2760?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" />
            <LocationCard title="Mystic Falls" location="123, Enchanted Forest, Fairyland" image="https://via.placeholder.com/150" />
            <LocationCard title="Dragon's Den" location="456, Dragon Mountain, Mythica" image="https://via.placeholder.com/150" />
            <LocationCard title="Atlantis" location="789, Underwater City, Ocean" image="https://via.placeholder.com/150" />
            <LocationCard title="Sky Castle" location="101, Floating Island, Sky Realm" image="https://via.placeholder.com/150" />
            <LocationCard title="Elven Grove" location="202, Ancient Woods, Elvenland" image="https://via.placeholder.com/150" />
            <LocationCard title="Wizard's Tower" location="303, Mystic Hills, Magica" image="https://via.placeholder.com/150" />

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