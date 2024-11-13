import React from 'react';
import { Card, CardContent, Typography, Button, Box } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

interface ReservationCardProps {
    locationName: string;
    eventName: string;
    date: Date;
    theme: string;
    guestCount: number;
    province: string;
    eventDescription: string;
    image: string;
}

function ReservationCard({ locationName, eventName, date, theme, guestCount, province, eventDescription, image }: ReservationCardProps): JSX.Element {
    const formattedDate = date instanceof Date ? date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }) : 'Invalid Date';

    return (
        <Card sx={{ 
            display: 'flex', 
            borderRadius: '10px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            mb: 4,
            minHeight: '250px',
            width: '100%',
        }}>
            <Box sx={{ 
                width: '30%', 
                backgroundImage: image ? `url(data:image/jpeg;base64,${image})` : 'none', 
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }} />

            <CardContent sx={{ 
                width: '70%', 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'space-between',
                p: 2
            }}>
                <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', color: '#2e5d4b' }}>
                    {eventName}
                </Typography>

                <Typography variant="body1" align="left" sx={{ color: '#2e5d4b' }}><strong>Location:</strong> {locationName}</Typography>

                <Typography variant="body2" sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    color: '#666',
                    mt: 0.5
                }}>
                    <LocationOnIcon fontSize="small" sx={{ mr: 0.5, color: '#d32f2f' }} />
                    {province}
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Typography variant="body2" sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        color: '#666',
                        mt: 0.5
                    }}>
                        <CalendarTodayIcon fontSize="small" sx={{ mr: 0.5, color: '#d32f2f' }} />
                        {formattedDate}
                    </Typography>

                    {/* TODO: Add See More function */}
                    {/* <Button
                        sx={{
                            color: '#2e5d4b',
                            textDecoration: 'underline',
                            fontSize: '0.8rem',
                            alignSelf: 'center',
                        }}
                        onClick={() => alert(eventDescription)}
                    >
                        See more (***)
                    </Button> */}
                </Box>
            </CardContent>
        </Card>
    );
};

export default ReservationCard;