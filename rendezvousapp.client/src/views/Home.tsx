import { Container, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import OpaqueButton from "../components/OpaqueButton";
import { useEffect, useState } from "react";

function Home() {
    const navigate = useNavigate();
    const [firstname, setFirstname] = useState<string>("");

    async function getUser(): Promise<string> {
        return fetch('/api/user/getUser')
            .then((response) => (response.json()))
            .then((data) => (data.firstname));
    }

    useEffect(() => {
        getUser().then((result) => setFirstname(result));
    }, []);

    return (
        <Container>
            <Typography variant="h1">Welcome to Home Page, {firstname}!</Typography>

            <OpaqueButton 
                handleClick={() => navigate("/login")} 
                text="Go to Login Page"
            />
        </Container>
    );
}

export default Home;