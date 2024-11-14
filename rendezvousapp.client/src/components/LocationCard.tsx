import React from 'react';
import { Card, CardContent, Typography, Button, Box } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';

interface LocationCardProps {
    name: string;
    province: string;
    image: string | null;
    handleSeeMoreClick: () => void;
    disabled?: boolean;
}

function LocationCard({ name, province, image, handleSeeMoreClick, disabled }: LocationCardProps): JSX.Element {
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
                    {name}
                </Typography>
                
                <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    mt: 2
                }}>
                    <Typography variant="body2" sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        color: '#666',
                        mt: 0.5
                    }}>
                        <LocationOnIcon fontSize="small" sx={{ mr: 0.5, color: '#d32f2f' }} />
                        {province}
                    </Typography>

                    <Button
                        sx={{ 
                            cursor: 'pointer',
                            color: '#2e5d4b',
                            textDecoration: 'underline',
                            fontSize: '0.8rem'
                        }}
                        onClick={handleSeeMoreClick}
                        disabled={disabled}
                    >
                        See more
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
};

export default LocationCard;