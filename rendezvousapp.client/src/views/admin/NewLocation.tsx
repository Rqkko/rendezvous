import { Box, Container, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import React from 'react'

function NewLocation() {
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
                                // backgroundImage: location.locationImage ? `url(data:image/jpeg;base64,${location.locationImage})` : 'none',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                borderRadius: 2,
                            }}
                        />
                    </Grid>

                    {/* Location Details */}
                    <Grid size={{ xs: 12, md: 7 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start', gap: 2 }}>
                            <Typography variant="h2" align="left">location.locationName</Typography>
                            <Typography variant="body1" align="left"><strong>Location:</strong> {"location.additional}, {location.province}, {location.postalCode"}</Typography>
                            <Typography variant="body1" align="left"><strong>Description:</strong>location.locationDescription</Typography>
                            <Typography variant="body1" align="left"><strong>Area:</strong>location.area square meters</Typography>
                            <Typography variant="body1" align="left"><strong>Capacity:</strong>location.capacity people</Typography>
                            <Typography variant="body1" align="left"><strong>Cost:</strong>location.cost Baht/Event</Typography>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
}

export default NewLocation