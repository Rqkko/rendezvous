import { useEffect, useState } from 'react'
import Unauthorized from '../../components/Unauthorized';
import { Container } from '@mui/material';
import RoundedCornerTextfield from '../../components/RoundedCornerTextfield';
import OpaqueButton from '../../components/OpaqueButton';
import { useNavigate } from 'react-router-dom';
import ImageUploadBox from '../../components/ImageUploadBox';

interface EditLocationProps {
    locationId: string | undefined;
}

interface Location {
    locationName: string,
    locationDescription: string,
    area: number,
    capacity: number,
    cost: number,
    locationImage: string,
    province: string,
    postalCode: string,
    additional: string,
}

function EditLocation({ locationId }: EditLocationProps): JSX.Element {
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [canUpdate, setCanUpdate] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [locationFound, setLocationFound] = useState<boolean | undefined>(undefined);
    const [locationImage, setLocationImage] = useState<string | undefined>(undefined);
    const [locationName, setLocationName] = useState<string>('');
    const [locationDescription, setLocationDescription] = useState<string>('');
    const [locationArea, setLocationArea] = useState<string>('0');
    const [locationCapacity, setLocationCapacity] = useState<string>('0');
    const [locationCost, setLocationCost] = useState<string>('0');
    const [locationProvince, setLocationProvince] = useState<string>('');
    const [locationPostalCode, setLocationPostalCode] = useState<string>('');
    const [locationAdditional, setLocationAdditional] = useState<string>('');
    const navigate = useNavigate();

    async function checkUpdatePermission(): Promise<boolean> {
        return fetch('/api/user/checkPermission?permission=create')
        .then((response) => {
            if (!response.ok) {
                return false;
            } else {
                return true;
            }
        });
    }
    

    async function fetchLocationDetail(locationId: string): Promise<Location | undefined> {
        return fetch(`/api/event/getlocation/${locationId}`)
        .then((response) => {
            if (!response.ok) {
                throw new Error('Location not found');
            }
            return response.json()
        })
        .then((data) => {
            return data;
        })
        .catch(error => {
            console.log("Error fetching location: " + error);
            return undefined
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
        const payload: Location = {
            locationName: locationName,
            locationDescription: locationDescription,
            area: parseInt(locationArea),
            capacity: parseInt(locationCapacity),
            cost: parseInt(locationCost),
            locationImage: locationImage || '',
            province: locationProvince,
            postalCode: locationPostalCode,
            additional: locationAdditional,
        };

        fetch(`/api/event/updateLocation/${locationId}`, {
            method: 'PUT',
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
            alert('Location Updated!');
            navigate('/admin');
        })
        .catch((error) => {
            console.log(error.message);
        });
    }

    // TODO: fix repeated fetch
    useEffect(() => {
        fetch('/api/user/checkAdmin')
        .then((response) => {
            console.log(response)
            if (!response.ok) {
                setIsAdmin(false);
                setLoading(false);
                throw new Error('Not an admin'); // Exit early
            } else {
                setIsAdmin(true);
                return
            }
        })
        .then(() => {
            checkUpdatePermission().then((canUpdate) => {
                setCanUpdate(canUpdate);
                // console.log("CanUpdate: " + canUpdate);
                if (canUpdate && locationId !== undefined) {
                    fetchLocationDetail(locationId).then((location) => {
                        if (location === undefined) {
                            throw new Error('Location not found');
                        }
                        
                        setLocationFound(true);

                        setLocationName(location.locationName);
                        setLocationDescription(location.locationDescription);
                        setLocationArea(location.area.toString());
                        setLocationCapacity(location.capacity.toString());
                        setLocationCost(location.cost.toString());
                        setLocationImage(location.locationImage);
                        setLocationProvince(location.province);
                        setLocationPostalCode(location.postalCode);
                        setLocationAdditional(location.additional);
                        setLoading(false);
                    });
                } else {
                    setLoading(false);
                    throw new Error('No update permission');
                }
            })
        });
    }, [])

    if (loading) {
        return (
            // Loading...
            <div className="loader" style={{marginTop: '100px'}}></div>
        );
    }

    if (!isAdmin || !canUpdate) {
        return (
            <Unauthorized />
        )
    }

    if (!locationFound) {
        return (
            <>
                <div>Location Not Found</div>
            </>
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
            <ImageUploadBox onUpload={(image) => setLocationImage(image)} locationImage={locationImage} />

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
    )
}

export default EditLocation