import React, { useEffect } from 'react'

interface LocationProps {
    locationId: string | undefined;
}


function Location({ locationId }: LocationProps): JSX.Element {
    function fetchLocationDetail(locationId: string): void {
        console.log("fetchLocationDetail is called")
    }
    
    
    useEffect(() => {
        if (locationId !== undefined) {
            fetchLocationDetail(locationId);
        }
    })
    
    
    if (locationId === undefined) {
        return (
            <>
                <div>Location Not Found</div>
            </>
        )
    }

    return (
        <>
            <div>Location</div>

            <div>{locationId}</div>
        </>
    )
}

export default Location