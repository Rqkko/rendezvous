import { Box, Container, IconButton, InputBase, Paper, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import SearchIcon from '@mui/icons-material/Search';
import AdminReservationCard from '../../components/AdminReservationCard';
import Unauthorized from '../../components/Unauthorized';
import { set } from 'date-fns';
import SearchBar from '../../components/SearchBar';

interface EventReservation {
    firstname: string;
    lastname: string;
    locationName: string;
    locationImage: string;
    eventName: string;
    date: Date;
}

function Reservations(): JSX.Element {
    const [loading, setLoading] = useState<boolean>(true);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [canRead, setCanRead] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [reservations, setReservations] = useState<EventReservation[]>([]);
    const [filteredReservations, setFilteredReservations] = useState<EventReservation[]>([]);

    async function checkIsAdmin(): Promise<boolean> {
        return fetch('/api/user/checkAdmin')
        .then((response) => {
            if (!response.ok) {
                return false
            } else {
                return true
            }
        });
    }

    async function checkReadPermission(): Promise<boolean> {
        return fetch('/api/user/checkPermission?permission=read')
        .then((response) => {
            if (!response.ok) {
                return false;
            } else {
                return true;
            }
        });
    }

    async function fetchReservations(): Promise<EventReservation[] | null> {
        return fetch('/api/event/getAllReservations')
            .then(response => response.json())
            .then(data => {
                const reservations = data.map((reservation: EventReservation) => ({
                    ...reservation,
                    date: new Date(reservation.date), // Convert DateOnly to Date
                }));
                return reservations;
            })
            .catch(error => {  
                console.log(error.message);
                return null;
            });
    }

    function handleInputChange(event: React.ChangeEvent<HTMLInputElement>): void {
        setSearchTerm(event.target.value);
    };

    function handleSearchChange(): void {
        setSearchQuery(searchTerm);
    };

    function filterReservations(): void {
        setFilteredReservations(reservations.filter(reservation =>
            reservation.locationName.toLowerCase().includes(searchQuery.toLowerCase()) || reservation.eventName.toLowerCase().includes(searchQuery.toLowerCase())
        ));
    }

    useEffect(() => {
        // FIXME: redundant useEffect called (called two times)
        console.log("useEffect called");
        Promise.all([
            checkIsAdmin(),
            new Promise(resolve => setTimeout(resolve, 1000))
        ])
        .then(([isAdmin]) => {
            if (isAdmin) {
                setIsAdmin(true);
                return checkReadPermission();
            }
            throw new Error('Not Admin');
        })
        .then((canRead) => {
            if (canRead) {
                setCanRead(true);
                return fetchReservations();
            }
            throw new Error('Not Enough Permissions');
        })
        .then((reservations) => {
            if (reservations != null) {
                setReservations(reservations);
            } else {
                console.log("No reservations found");
            }
            setLoading(false);
        })
        .catch((error) => {
            console.log(error.message);
            setLoading(false);
        })
    }, []);

    useEffect(() => {
        filterReservations();
    }, [searchQuery]);

    if (loading) {
        return (
            // Loading...
            <div className="loader" style={{marginTop: '100px'}}></div>
        );
    }

    if (!isAdmin || !canRead) {
        return (
            <Unauthorized />
        )
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
                        <AdminReservationCard
                            // TODO: Add other props (See more?)
                            firstname={reservation.firstname}
                            lastname={reservation.lastname}
                            locationName={reservation.locationName}
                            eventName={reservation.eventName}
                            date={reservation.date}
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