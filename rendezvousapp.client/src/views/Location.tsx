import { Box, Button, Container, MenuItem, Paper, Select, TextField, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import React, { useEffect, useState } from 'react'
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';

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

    function fetchLocationDetail(locationId: string): void {
        fetch(`/api/event/getlocation/${locationId}`)
            .then(response => response.json())
            .then(data => {
                setLocation(data)
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

                    <Grid size={{ xs: 12, md: 7 }}>
                        <Box>
                            <Typography variant="h4" gutterBottom>{location.locationName}</Typography>
                            <Typography variant="body1" paragraph>Location: {location.postalCode}, {location.province}</Typography>
                            <Typography variant="body1" paragraph>Description: {location.locationDescription}</Typography>
                            <Typography variant="body1">Area: {location.area} square meters</Typography>
                            <Typography variant="body1">Capacity: {location.capacity} people</Typography>
                            <Typography variant="body1">Cost: {location.cost} Baht/Event</Typography>
                            <Typography variant="body1" paragraph>Additional: {location.additional}</Typography>
                        </Box>
                    </Grid>

                    <Grid size={{ xs: 12, md: 5}}>
                        <Paper elevation={3} sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom>Reservation</Typography>
                            <TextField
                                fullWidth
                                label="Event Name"
                                variant="outlined"
                                margin="normal"
                                // value={eventName}
                                // onChange={(e) => setEventName(e.target.value)}
                            />
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <StaticDatePicker 
                                    defaultValue={dayjs('2022-04-17')}
                                />
                            </LocalizationProvider>
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
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
}

export default Location