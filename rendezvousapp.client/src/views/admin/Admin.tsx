import React, { useEffect, useState } from 'react'

function Admin() {
    const [isAdmin, setIsAdmin] = useState<boolean>(false);

    useEffect(() => {
        fetch('/api/user/checkAdmin')
        .then((response) => {
            if (!response.ok) {
                setIsAdmin(false);
            } else {
                setIsAdmin(true);
            }
        })
    }, []);

    console.log(isAdmin);

    if (!isAdmin) {
        return (
            <div>Unauthorized</div>
        )
    }

    return (
        <div>Admin</div>
    )
}

export default Admin