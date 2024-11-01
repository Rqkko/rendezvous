import { Box, Button, Container, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import React, { useEffect, useState } from 'react'
import { Dayjs } from 'dayjs';

import RoundedCornerTextfield from '../components/RoundedCornerTextfield';
import CustomDatePicker from '../components/CustomDatePicker';

interface LocationProps {
    locationId: string | undefined;
}

interface Location {
    locationId: number,
    locationName: string,
    locationDescription: string,
    area: number,
    capacity: number,
    cost: number,
    locationImage: string,
    province: string,
    postalCode: string,
    additional: string,
    adminId: string
}

interface ReservationDTO {
    locationId: number,
    event: {
        eventName: string,
        eventDescription: string,
        date: string,
        theme: string,
        guestCount: number
    },
    reservation: {
        reservationDateTime: string
    },
    payment: {
        paymentAmount: number,
        paymentDateTime: string
    }
}

function Location({ locationId }: LocationProps): JSX.Element {
    const [loading, setLoading] = useState<boolean>(true);
    const [location, setLocation] = useState<Location | undefined>(undefined);
    const [eventName, setEventName] = useState<string>('');
    const [eventDate, setEventDate] = useState<Dayjs | null>(null);
    const [theme, setTheme] = useState<string>('');
    const [guest, setGuest] = useState<string>('');
    const [eventDescription, setEventDescription] = useState<string>('');

    function fetchLocationDetail(locationId: string): void {
        Promise.all([
            fetch(`/api/event/getlocation/${locationId}`).then(response => response.json()),
            new Promise(resolve => setTimeout(resolve, 1000)) // Wait 1 second on loading screen (Just because it looks cooler)
        ])
        .then(([data]) => {
            setLocation(data);
            setLoading(false);
        })
        .catch(error => {
            alert('Error fetching location details: ' + error.message);
            setLoading(false);
        });
    }

    function handleConfirmClick(): void {
        const payload: ReservationDTO = {
            locationId: location?.locationId || 0,
            event: {
                eventName: eventName,
                eventDescription: eventDescription,
                date: eventDate?.format('YYYY-MM-DD') || '',
                theme: theme,
                guestCount: parseInt(guest)
            },
            reservation: {
                reservationDateTime: new Date().toISOString()
            },
            payment: {
                paymentAmount: location?.cost || 0,
                paymentDateTime: new Date().toISOString()
            }
        };

        fetch(`/api/event/addReservation`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        })
        .then((response) => {
            if (!response.ok) {
                return response.json().then((data) => {
                    throw new Error(data.message);
                });
            }
            alert("Reservation Successful");
        })
        .catch((error) => {
            alert(error.message);
        });
    }
    
    useEffect(() => {
        if (locationId !== undefined) {
            fetchLocationDetail(locationId);
        }
    })
    
    if (loading) {
        return (
            // Loading...
            <div className="loader" style={{marginTop: '100px'}}></div>
        );
    }

    if (location === undefined) {
        return (
            <>
                <div>Location Not Found</div>
            </>
        )
    }

    return (
        <Container 
            maxWidth="xl"
            sx={{ px:1}}       
        >
            <Box sx={{ my: 4 }}>
                <Grid container spacing={4}>
                    {/* Location Image */}
                    <Grid size={12}>
                        <Box
                            sx={{
                                height: '300px',
                                width: '100%',
                                backgroundImage: location.locationImage ? `url(data:image/jpeg;base64,${location.locationImage})` : 'none',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                borderRadius: 2,
                            }}
                        />
                    </Grid>

                    {/* Location Details */}
                    <Grid size={{ xs: 12, md: 7 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start', gap: 2 }}>
                            <Typography variant="h2" align="left">{location.locationName}</Typography>
                            <Typography variant="body1" align="left"><strong>Location:</strong> {location.additional}, {location.province}, {location.postalCode}</Typography>
                            <Typography variant="body1" align="left"><strong>Description:</strong> {location.locationDescription}</Typography>
                            <Typography variant="body1" align="left"><strong>Area:</strong> {location.area} square meters</Typography>
                            <Typography variant="body1" align="left"><strong>Capacity:</strong> {location.capacity} people</Typography>
                            <Typography variant="body1" align="left"><strong>Cost:</strong> {location.cost} Baht/Event</Typography>
                        </Box>
                    </Grid>

                    {/* Reservation Form */}
                    <Grid size={{ xs: 12, md: 5}}>
                        <Container 
                            sx={{ 
                                px: 3,
                                bgcolor: 'info.main',
                                boxShadow: 5,
                                borderRadius: '24px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                            }}>
                            <Typography 
                                color='white' 
                                sx={{ 
                                    bgcolor: 'secondary.main', 
                                    width: '50%', 
                                    height: '50px', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    borderBottomLeftRadius: '24px',
                                    borderBottomRightRadius: '24px',
                                }} 
                                variant="h3"
                            >
                                Reservation
                            </Typography>

                            <RoundedCornerTextfield
                                label="Event Name"
                                value={eventName}
                                handleChange={(e) => setEventName(e.target.value)}
                                style={{ width: '100%', my: 2 }}
                            />

                            <CustomDatePicker 
                                label="Event Date"
                                value={eventDate}
                                onChange={(newValue) => setEventDate(newValue)}
                                disablePast
                            />

                            <RoundedCornerTextfield
                                label="Theme"
                                value={theme}
                                handleChange={(e) => setTheme(e.target.value)}
                                style={{ width: '100%', my:2 }}
                            />

                            <RoundedCornerTextfield
                                label="No. of Guests"
                                value={guest}
                                handleChange={(e) => setGuest(e.target.value)}
                                style={{ width: '100%', my:2 }}
                            />

                            <RoundedCornerTextfield
                                label="Event Description"
                                value={eventDescription}
                                handleChange={(e) => setEventDescription(e.target.value)}
                                style={{ width: '100%', my:2 }}
                            />

                            <Button 
                                variant="contained"
                                color="primary"
                                fullWidth
                                sx={{ mt: 2 }}
                                onClick={handleConfirmClick}
                            >
                                Confirm
                            </Button>
                        </Container>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
}

export default Location