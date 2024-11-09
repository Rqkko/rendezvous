import { useEffect, useState } from 'react'
import Unauthorized from '../../components/Unauthorized';

interface EditLocationProps {
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

function EditLocation({ locationId }: EditLocationProps): JSX.Element {
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [canUpdate, setCanUpdate] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [location, setLocation] = useState<Location | undefined>(undefined);

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
                        setLocation(location);
                        // console.log(location?.postalCode);
                        setLoading(false);
                    });
                } else {
                    setLoading(false);
                    throw new Error('No update permission');
                }
            })
        });
    })

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

    if (location === undefined) {
        return (
            <>
                <div>Location Not Found</div>
            </>
        )
    }

    return (
        <>
            <div>EditLocation</div>
            <div>{location.locationName}</div>
        </>
    )
}

export default EditLocation