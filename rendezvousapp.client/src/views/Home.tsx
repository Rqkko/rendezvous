import { Container, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import OpaqueButton from "../components/OpaqueButton";

function Home() {
    const navigate = useNavigate();

    return (
        <Container>
            <Typography variant="h1">Welcome to Home Page!</Typography>

            <OpaqueButton 
                handleClick={() => navigate("/login")} 
                text="Go to Login Page"
            />
        </Container>
    );
}

export default Home;