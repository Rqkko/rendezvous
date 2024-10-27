import { Box, Button, Container, MenuItem, Select, TextField, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import React, { useEffect, useState } from 'react'

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

function Location({ locationId }: LocationProps): JSX.Element {
    const [loading, setLoading] = useState<boolean>(true);
    const [location, setLocation] = useState<Location | undefined>(undefined);
    const [eventName, setEventName] = useState<string>('');
    const [eventDate, setEventDate] = useState<Dayjs | null>(null);

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
            console.error('Error fetching location details:', error);
            setLoading(false);
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

                            <TextField
                                fullWidth
                                label="Theme"
                                variant="outlined"
                                margin="normal"
                                // value={eventTheme}
                                // onChange={(e) => setEventTheme(e.target.value)}
                            />
                            <Select
                                fullWidth
                                // value={guestCount}
                                // onChange={(e) => setGuestCount(Number(e.target.value))}
                                margin="dense"
                            >
                                {[80, 90, 100].map((num) => (
                                    <MenuItem key={num} value={num}>{num}</MenuItem>
                                ))}
                            </Select>
                            <TextField
                                fullWidth
                                label="Event Description"
                                variant="outlined"
                                margin="normal"
                                multiline
                                rows={4}
                                // value={eventDescription}
                                // onChange={(e) => setEventDescription(e.target.value)}
                            />
                            <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
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