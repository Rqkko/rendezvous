import { Box, Container } from '@mui/material';
import React, { useEffect, useState } from 'react'

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
    const [location, setLocation] = useState<Location | undefined>(undefined);

    function fetchLocationDetail(locationId: string): void {
        fetch(`/api/event/getlocation/${locationId}`)
            .then(response => response.json())
            .then(data => {
                setLocation(data)
            })
            .catch(error => {
                console.error('Error fetching location details:', error);
            });
    }
    
    useEffect(() => {
        if (locationId !== undefined) {
            fetchLocationDetail(locationId);
        }
    })
    
    
    if (location === undefined) {
        return (
            <>
                <div>Location Not Found</div>
            </>
        )
    }

    return (
        <Container>
            <div>Location</div>

            <div>{location.locationName}</div>
            <div>{location.locationDescription}</div>
            <div>{location.area}</div>
            <div>{location.capacity}</div>
            <div>{location.cost}</div>
            <div>{location.province}</div>
            <div>{location.postalCode}</div>
            <div>{location.additional}</div>
            <div>{location.adminId}</div>

            <Box sx={{ 
            height: '300px',
            width: '300px',
            backgroundImage: location.locationImage ? `url(data:image/jpeg;base64,${location.locationImage})` : 'none', 
            backgroundSize: 'cover',
            backgroundPosition: 'center'
            }} />
        </Container>
    )
}

export default Location