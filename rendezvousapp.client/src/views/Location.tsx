import { Box, Button, CircularProgress, Container, Dialog, DialogTitle, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useEffect, useState } from 'react'
import { Dayjs } from 'dayjs';
import { useNavigate } from 'react-router-dom';

import RoundedCornerTextfield from '../components/RoundedCornerTextfield';
import CustomDatePicker from '../components/CustomDatePicker';
import paymentQR from '../assets/paymentQR.png';

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
    const [openPayment, setOpenPayment] = useState<boolean>(false);
    const [showLoading, setShowLoading] = useState<boolean>(false);
    const [showCheckmark, setShowCheckmark] = useState<boolean>(false);
    
    const navigate = useNavigate();

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

    function handleGuestChange(e: React.ChangeEvent<HTMLInputElement>): void {
        if (e.target.value.includes('-')) {
            return;
        }

        if (e.target.value === '') {
            setGuest('');
            return;
        }

        if (parseInt(e.target.value) >= 0) {
            setGuest(e.target.value);
        }
    }

    function handleGuestKeyDown(e: React.KeyboardEvent<HTMLInputElement>): void {
        if (e.key === '-') {
            e.preventDefault();
        }
    }

    function handleConfirmClick(): void {
        // Validate input
        if (eventName === '' || eventDate === null || theme === '' || guest === '' || eventDescription === '') {
            alert('Please fill in all fields');
            return;
        }

        // Handle past date
        if (eventDate?.isBefore(new Date(), 'day')) {
            alert('Please reserve a future date');
            return;
        }

        // Check Guest Count is a non-zero number
        if (parseInt(guest) <= 0) {
            alert('Please enter a valid number of guests');
            return;
        }

        // Handle guest count
        if (location && parseInt(guest) > location.capacity) {
            alert('Number of guests exceeds capacity');
            return;
        }

        // Check availability of the selected date
        fetch(`/api/event/checkDateIsAvailable/${location?.locationId}/${eventDate?.format('YYYY-MM-DD')}`)
        .then((response) => {
            if (!response.ok) {
                return response.json().then((data) => {
                    throw new Error(data.message);
                });
            }
            return response.json();
        })
        .then((data) => {
            if (data.isAvailable) {
                setOpenPayment(true);
            } else {
                alert("Location is already reserved for the date: " + eventDate?.format('DD-MM-YYYY'));
            }
        })
        .catch((error) => {
            alert('Error checking date availability: ' + error.message);
        });
    }

    function handleClosePayment(): void {
        setOpenPayment(false);
    }

    function handlePayConfirmClick(): void {
        setShowLoading(true);

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


        Promise.all([
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
            })
            .catch((error) => {
                throw new Error(error.message);
            }),

            new Promise(resolve => setTimeout(resolve, 1000)) // Wait 1 seconds for payment
        ])
        .then(() => {
            setShowLoading(false);
            setShowCheckmark(true);
            setTimeout(() => {
                navigate('/reservations')
            }, 1000);
        })
        .catch((error) => {
            if (error.message.includes('Location is already reserved')) {
                alert("Location is already reserved for the date: " + eventDate?.format('DD-MM-YYYY'));
                setShowLoading(false);
            } else {
                alert('Error making reservation: ' + error.message);
                setShowLoading(false);
            }
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
                                pb: 2,
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
                                // handleChange={(e) => setGuest(e.target.value)}
                                handleChange={handleGuestChange}
                                handleKeyDown={handleGuestKeyDown}
                                style={{ width: '100%', my:2 }}
                                type="number"
                            />

                            <RoundedCornerTextfield
                                label="Event Description"
                                value={eventDescription}
                                handleChange={(e) => setEventDescription(e.target.value)}
                                style={{ width: '100%', my:2 }}
                                rows={3}
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

            {/* Popup */}
            <Dialog
                onClose={handleClosePayment}
                open={openPayment}
            >
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 2,
                    p: 2,
                    height: '500px',
                    width: '420px'
                }}>
                    <DialogTitle 
                        variant="h2"
                        color="primary"
                        sx={{ textAlign: 'center' }}
                    >
                        Scan To Pay
                    </DialogTitle>

                    {showLoading ? (
                        <CircularProgress size={100} color="secondary" />
                    ) : (
                        showCheckmark ? (
                                <label className="container">
                                    <input checked={true} type="checkbox"/>
                                    <div className="checkmark"></div>
                                </label>
                        ) : (
                            <>
                            <Typography variant="body1">Total Amount: {location.cost} Baht</Typography>

                            <img src={paymentQR} alt="QR Code" style={{ width: '200px', height: '200px' }} />

                            <Typography variant="body2">Please scan the QR code to pay</Typography>
                            </>
                        )
                    )}
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={handlePayConfirmClick}
                            sx = {{ justifySelf: 'end' }}
                            disabled={showLoading || showCheckmark}
                        >
                            Confirm
                        </Button>
                </Box>
            </Dialog>
        </Container>
    );
}

export default Location