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

    function checkUpdatePermission(): void {
        fetch('/api/user/checkPermission?permission=create')
        .then((response) => {
            if (!response.ok) {
                setCanUpdate(false);
            } else {
                setCanUpdate(true);
            }
        });
    }

    function fetchLocationDetail(locationId: string): void {
        fetch(`/api/event/getlocation/${locationId}`)
        .then((response) => {
            if (!response.ok) {
                throw new Error('Location not found');
            }
            return response.json()
        })
        .then((data) => {
            setLocation(data);
            setLoading(false);
        })
        .catch(error => {
            console.log(error);
            setLoading(false);
        });
    }

    useEffect(() => {
        fetch('/api/user/checkAdmin')
        .then((response) => {
            if (!response.ok) {
                setIsAdmin(false);
                setLoading(false);
            } else {
                setIsAdmin(true);
            }
        })
        .then(() => {
            if (isAdmin) {
                checkUpdatePermission();
            }
        });

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

    if ((!isAdmin || !canUpdate) && location !== undefined) {
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