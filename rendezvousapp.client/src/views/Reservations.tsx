import { Box, Container, IconButton, InputBase, Paper, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import SearchIcon from '@mui/icons-material/Search';
import ReservationCard from '../components/ReservationCard';

interface EventReservation {
    locationName: string;
    locationImage: string;
    eventName: string;
    theme: string;
    guestCount: number;
    date: Date;
    province: string;
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
                const reservations = data.map((reservation: EventReservation) => ({
                    ...reservation,
                    date: new Date(reservation.date) // Convert DateOnly to Date
                }));
                setReservations(reservations);
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
            {/* {filteredReservations.toString()} */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, }}>
                    {filteredReservations.map((reservation) => (
                        <ReservationCard
                            locationName={reservation.locationName}
                            eventName={reservation.eventName}
                            date={reservation.date}
                            theme={reservation.theme}
                            guestCount={reservation.guestCount}
                            province={reservation.province}
                            eventDescription={reservation.eventDescription}
                            image={reservation.locationImage}
                            // key={location.locationName}
                            // name={location.locationName}
                            // province={location.province}
                            // image={location.locationImage}
                            // handleSeeMoreClick={() => handleSeeMoreClick(location.locationId)}
                        />
                    ))}
                </Box>
        </Paper>
    </Container>
    );
}

export default Reservations;