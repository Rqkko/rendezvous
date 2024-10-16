import React, { useEffect, useState } from 'react';
import { Container, Typography, Paper, IconButton, InputBase, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useLocation } from 'react-router-dom';
import { User, getUser } from '../utils/apiUtils';
import LocationCard from '../components/LocationCard';

interface Location {
    name: string;
    address: string;
    image: string;
}

function Home(): JSX.Element {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState<string>('');
    // const [tabValue, setTabValue] = useState(0);
    const [user, setUser] = useState<User | null>(null);
    const location = useLocation();

    // Example Locations
    const locations: Location[] = [
        { name: "Anyamanee Cafe and Roastery", address: "163, Bang Sao Thong, Bang Sao Thong, Samut Prakan", image: "https://images.unsplash.com/photo-1493857671505-72967e2e2760?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
        { name: "Mystic Falls", address: "123, Enchanted Forest, Fairyland", image: "https://images.unsplash.com/photo-1493857671505-72967e2e2760?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
        { name: "Dragon's Den", address: "456, Dragon Mountain, Mythica", image: "https://via.placeholder.com/150" },
        { name: "Atlantis", address: "789, Underwater City, Ocean", image: "https://via.placeholder.com/150" },
        { name: "Sky Castle", address: "101, Floating Island, Sky Realm", image: "https://via.placeholder.com/150" },
        { name: "Elven Grove", address: "202, Ancient Woods, Elvenland", image: "https://via.placeholder.com/150" },
        { name: "Wizard's Tower", address: "303, Mystic Hills, Magica", image: "https://via.placeholder.com/150" }
    ];

    function handleInputChange(event: React.ChangeEvent<HTMLInputElement>): void {
        setSearchTerm(event.target.value);
    };

    function handleSearchChange(): void {
        setSearchQuery(searchTerm);
    };

    // const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    //     setTabValue(newValue);
    // };

    const filteredLocations = locations.filter(location =>
        location.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    useEffect(() => {
        getUser().then((result) => setUser(result));
    }, [location.pathname]);

    return (
        <Container sx={{ overflow: 'hidden', width: '100vw' }}>
            <Typography variant="h2" sx={{ mb: 4}}>Locations</Typography>

            {/* <TextField
                fullWidth
                placeholder="Search"
                variant="outlined"
                value={searchQuery}
                onChange={handleSearchChange}
                sx={{ maxWidth: '600px', bgcolor: 'white', borderRadius: '20px', mb: 4 }}
            /> */}

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

            {/* <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 2 }}>
                <Tab label="Locations" />
                <Tab label="My Reservations" />
            </Tabs> */}

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
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {filteredLocations.map((location) => (
                        <LocationCard key={location.name} name={location.name} address={location.address} image={location.image} />
                    ))}
                </Box>
            </Paper>
        </Container>
    );
};

export default Home;