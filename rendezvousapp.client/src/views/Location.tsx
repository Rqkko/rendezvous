import React from 'react'

interface LocationProps {
    locationId: string;
}

function Location({ locationId }: LocationProps): JSX.Element {
  return (
    <>
        <div>Location</div>
        <div>{locationId}</div>
    </>
  )
}

export default Location