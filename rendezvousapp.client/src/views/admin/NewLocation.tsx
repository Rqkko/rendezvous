import { Box, Container, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { useEffect, useState } from 'react'
import Unauthorized from '../../components/Unauthorized';
import ImageUploadBox from '../../components/ImageUploadBox';
import RoundedCornerTextfield from '../../components/RoundedCornerTextfield';
import OpaqueButton from '../../components/OpaqueButton';
import { useNavigate } from 'react-router-dom';

interface LocationPayload {
    locationName: string;
    locationDescription: string;
    area: number;
    capacity: number;
    cost: number;
    locationImage: string | null;
    province: string;
    postalCode: string;
    additional: string;
}

function NewLocation(): JSX.Element {
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [canCreate, setCanCreate] = useState<boolean>(false);
    const [locationImage, setLocationImage] = useState<string | null>(null);
    const [locationName, setLocationName] = useState<string>('');
    const [locationDescription, setLocationDescription] = useState<string>('');
    const [locationArea, setLocationArea] = useState<string>('0');
    const [locationCapacity, setLocationCapacity] = useState<string>('0');
    const [locationCost, setLocationCost] = useState<string>('0');
    const [locationProvince, setLocationProvince] = useState<string>('');
    const [locationPostalCode, setLocationPostalCode] = useState<string>('');
    const [locationAdditional, setLocationAdditional] = useState<string>('');
    const navigate = useNavigate();

    function checkCreatePermission(): void {
        fetch('/api/user/checkPermission?permission=create')
        .then((response) => {
            if (!response.ok) {
                setCanCreate(false);
            } else {
                setCanCreate(true);
            }
        });
    }

    function handlePostalCodeChange(event: React.ChangeEvent<HTMLInputElement>): void {
        if (event.target.value.length > 5) {
            setLocationPostalCode(event.target.value.slice(0, 5));
        } else {
            setLocationPostalCode(event.target.value);
        }
    }

    function handleSubmitClick(): void {
        const payload: LocationPayload = {
            locationName: locationName,
            locationDescription: locationDescription,
            area: parseInt(locationArea),
            capacity: parseInt(locationCapacity),
            cost: parseInt(locationCost),
            locationImage: locationImage,
            province: locationProvince,
            postalCode: locationPostalCode,
            additional: locationAdditional,
        };

        fetch('/api/event/addLocation', {
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
            alert('Location created successfully!');
            navigate('/admin');
        })
        .catch((error) => {
            alert(error.message);
        });
    }

    useEffect(() => {
        fetch('/api/user/checkAdmin')
        .then((response) => {
            if (!response.ok) {
                setIsAdmin(false);
            } else {
                setIsAdmin(true);
            }
        })
        .then(() => {
            if (isAdmin) {
                checkCreatePermission();
            }
        });
    });

    if (!isAdmin || !canCreate) {
        return (
            <Unauthorized />
        )
    }

    return (
        <Container 
            maxWidth="lg"
            sx={{
                px:1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}       
        >
            <ImageUploadBox onUpload={(image) => setLocationImage(image)} />
            
            {/* <Box sx={{ backgroundImage: `url(${locationImage})`, backgroundSize: 'cover', width: 200, height: 200 }} /> */}

            <RoundedCornerTextfield
                label="Location Name"
                value={locationName}
                handleChange={(e) => setLocationName(e.target.value)}
                style={{ width: '50%', my: 2 }}
            />

            <RoundedCornerTextfield
                label="Location Description"
                value={locationDescription}
                handleChange={(e) => setLocationDescription(e.target.value)}
                style={{ width: '50%', my: 2 }}
                rows={3}
            />

            <RoundedCornerTextfield
                label="Location Area (Sq.m)"
                value={locationArea}
                handleChange={(e) => setLocationArea(e.target.value)}
                style={{ width: '50%', my: 2 }}
                type="number"
            />

            <RoundedCornerTextfield
                label="Location Capacity (People)"
                value={locationCapacity}
                handleChange={(e) => setLocationCapacity(e.target.value)}
                style={{ width: '50%', my: 2 }}
                type="number"
            />

            <RoundedCornerTextfield
                label="Location Cost (Baht)"
                value={locationCost}
                handleChange={(e) => setLocationCost(e.target.value)}
                style={{ width: '50%', my: 2 }}
                type="number"
            />

            <RoundedCornerTextfield
                label="Province"
                value={locationProvince}
                handleChange={(e) => setLocationProvince(e.target.value)}
                style={{ width: '50%', my: 2 }}
            />

            <RoundedCornerTextfield
                label="Postal Code"
                value={locationPostalCode}
                handleChange={handlePostalCodeChange}
                style={{ width: '50%', my: 2 }}
                type="number"
            />

            <RoundedCornerTextfield
                label="Additional Address Information"
                value={locationAdditional}
                handleChange={(e) => setLocationAdditional(e.target.value)}
                style={{ width: '50%', my: 2 }}
                rows={3}
            />

            <OpaqueButton handleClick={handleSubmitClick} text="Submit" />
        </Container>
    );
}

export default NewLocation