import { Container, IconButton, InputBase, Paper, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import SearchIcon from '@mui/icons-material/Search';

interface EventReservation {
    locationName: string;
    locationImage: string;
    eventName: string;
    theme: string;
    guestCount: number;
    date: Date;
    eventDescription: string;
}

function Reservations(): JSX.Element {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [reservations, setReservations] = useState<EventReservation[]>([]);
    const filteredReservations = reservations.filter(reservation =>
        reservation.locationName.toLowerCase().includes(searchQuery.toLowerCase()) || reservation.eventName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    function handleInputChange(event: React.ChangeEvent<HTMLInputElement>): void {
        setSearchTerm(event.target.value);
    };

    function handleSearchChange(): void {
        setSearchQuery(searchTerm);
    };

    function fetchReservations(): void {
        fetch('/api/event/getUserReservations')
            .then(response => response.json())
            .then(data => {
                setReservations(data);
            })
            .catch(error => {  
                alert(error.message);
            });
    }

    useEffect(() => {
        fetchReservations();
    }, []);

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
        <Typography variant="h2" sx={{ mb: 4}}>My Reservations</Typography>

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
                placeholder="Search Reservations"
                inputProps={{ 'aria-label': 'search reservations' }}
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

        <Paper>
            {filteredReservations.toString()}
        </Paper>
    </Container>
    );
}

export default Reservations;