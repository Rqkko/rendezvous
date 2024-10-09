import { Button, Container, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import OpaqueButton from "../components/OpaqueButton";

function Home() {
    const navigate = useNavigate();

    return (
        <Container>
            <Typography variant="h1">Welcome to Home Page!</Typography>

            <Button
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
                onClick={() => {
                    navigate("/login");
                }}
            >
                Go to Login Page
            </Button>

            <OpaqueButton handleClick={() => navigate("/login")} />
        </Container>
    );
}

export default Home;