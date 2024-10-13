import { Container, Typography } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import OpaqueButton from "../components/OpaqueButton";
import { useEffect, useState } from "react";

interface User {
    userId: string;
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
}

function Home() {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState<User | null>(null);

    async function getUser(): Promise<User | null> {
        return fetch('/api/user/getUser')
            .then((response) => {
                if (!response.ok) {
                    return response.json().then((data) => {
                        throw new Error(data.message);
                    });
                }
                return response.json();
            })
            .then((data) => {
                return {
                    userId: data.userId,
                    firstname: data.firstname,
                    lastname: data.lastname,
                    email: data.email,
                    phone: data.phone
                };
            })
            .catch(() => {
                return null;
            });
    }

    useEffect(() => {
        getUser().then((result) => setUser(result));
    }, [location]);

    return (
        <Container>
            {user !== null ? (
                <>
                    <Typography variant="h1">Welcome to Home Page, {user.firstname}!</Typography>
                    <Typography variant="h2">User Id: {user.userId}</Typography>
                    <Typography variant="h2">Name: {user.firstname} {user.lastname}</Typography>
                    <Typography variant="h2">Phone: {user.phone}</Typography>
                    <Typography variant="h2">Email: {user.email}</Typography>
                </>
            ) : (                 
                <>
                    <Typography variant="h1">User Not Logged In</Typography>
                    <OpaqueButton 
                        handleClick={() => navigate("/login")} 
                        text="Go to Login Page"
                    />
                </>
            )}
        </Container>
    );
}

export default Home;