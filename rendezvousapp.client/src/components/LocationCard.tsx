import React from 'react';
import { Card, CardContent, Typography, Button, Box } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';

interface LocationCardProps {
    title: string;
    location: string;
    image: string;
}

function LocationCard({ title, location, image }: LocationCardProps): JSX.Element {
    return (
        <Card sx={{ 
            display: 'flex', 
            borderRadius: '10px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            mb: 4
        }}>
            <Box sx={{ 
                width: '30%', 
                backgroundImage: `url(${image})`, 
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
                <Box>
                    <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', color: '#2e5d4b' }}>
                        {title}
                    </Typography>
                    <Typography variant="body2" sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        color: '#666',
                        mt: 0.5
                    }}>
                        <LocationOnIcon fontSize="small" sx={{ mr: 0.5, color: '#d32f2f' }} />
                        {location}
                    </Typography>
                </Box>
                <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    mt: 2
                }}>
                    <Button 
                        variant="outlined" 
                        size="small" 
                        sx={{ 
                            textTransform: 'lowercase', 
                            borderRadius: '20px',
                            color: '#2e5d4b',
                            borderColor: '#2e5d4b',
                            '&:hover': {
                                backgroundColor: '#e8f5e9',
                                borderColor: '#2e5d4b',
                            }
                        }}
                    >
                        description
                    </Button>
                    <Typography 
                        variant="body2" 
                        sx={{ 
                            cursor: 'pointer',
                            color: '#2e5d4b',
                            fontStyle: 'italic'
                        }}
                    >
                        See more
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
};

export default LocationCard;