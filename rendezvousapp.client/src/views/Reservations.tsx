import { Box, Container, IconButton, InputBase, Paper, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import SearchIcon from '@mui/icons-material/Search';
import ReservationCard from '../components/ReservationCard';
import SearchBar from '../components/SearchBar';

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
    const [loading, setLoading] = useState<boolean>(true);

    function handleInputChange(event: React.ChangeEvent<HTMLInputElement>): void {
        setSearchTerm(event.target.value);
    };

    function handleSearchChange(): void {
        setSearchQuery(searchTerm);
    };

    function fetchReservations(): void {
        Promise.all([
            fetch('/api/event/getUserReservations'),
            new Promise(resolve => setTimeout(resolve, 1000))
        ])
        .then(([response]) => response.json())
        .then(data => {
            const reservations = data.map((reservation: EventReservation) => ({
                ...reservation,
                date: new Date(reservation.date) // Convert DateOnly to Date
            }));
            setReservations(reservations);
            setLoading(false);
        })
        .catch(error => {  
            console.log(error.message);
        });
    }

    useEffect(() => {
        fetchReservations();
    }, []);

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
        <Typography variant="h2" sx={{ mb: 4}}>My Reservations</Typography>

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
                {filteredReservations.length === 0 ? (
                    <Typography variant="h4">No reservations found</Typography>
                ) : (
                    filteredReservations.map((reservation) => (
                        <ReservationCard
                            key={reservation.locationName}
                            locationName={reservation.locationName}
                            eventName={reservation.eventName}
                            date={reservation.date}
                            theme={reservation.theme}
                            guestCount={reservation.guestCount}
                            province={reservation.province}
                            eventDescription={reservation.eventDescription}
                            image={reservation.locationImage}
                        />
                    ))
                )}
            </Box>
        </Paper>
    </Container>
    );
}

export default Reservations;