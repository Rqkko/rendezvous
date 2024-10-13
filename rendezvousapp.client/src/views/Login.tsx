import { Box, Container, Typography, Divider, Button } from "@mui/material";
import logo from '../assets/logo.png';
import DefaultTextField from "../components/DefaultTextfield";
import OpaqueButton from "../components/OpaqueButton";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Login() {
    const navigate = useNavigate();

    const [contact, setContact] = useState("");
    const [password, setPassword] = useState("");
    
    const handleContact = (event: React.ChangeEvent<HTMLInputElement>) => {
        setContact(event.target.value);
    };
    const handlePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    }

    return (
        <Container
            sx = {{ 
                overflow: 'hidden', 
                height: '100vh',
            }}
        >
            <Container
                sx = {{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    height: '100%',
                }}
            >
                <Box
                    component="img"
                    alt = "Rendezvous Logo"
                    src = {logo}
                    sx = {{ width: '50vh', height: '50vh', mr: 2 }}
                />

                <Container 
                    sx = {{ 
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'start',
                        minWidth: '32vw',
                    }}
                >
                    <Typography 
                        variant="h1"
                        color="black"
                    >
                        WELCOME!
                    </Typography>

                    <Typography 
                        variant="h2"
                        color="black"
                        sx={{ pl: 2, mt:2 }}
                    >
                        Please log in
                    </Typography>

                    <DefaultTextField 
                        placeholder="Email / phone no."
                        style = {{ mt: 6, alignSelf: 'center' }}
                        value = {contact}
                        handleChange={handleContact}
                    />

                    <DefaultTextField 
                        placeholder="Password"
                        style = {{ mt: 4, alignSelf: 'center' }}
                        value = {password}
                        handleChange={handlePassword}
                    />

                    <OpaqueButton 
                        handleClick={() => navigate("/")}
                        text="Login"
                        style={{ alignSelf: 'center', mt: 4 }}
                    />

                    <Divider sx={{ mt: 2, width: '100%', borderWidth: 1, borderColor: 'black' }} />
                    <Typography color="black">
                        Don't have an account? 
                        <Button variant="text" sx={{ color: 'black', textTransform: 'none', textDecoration: 'underline' }}
                        >
                            Create One
                        </Button>
                    </Typography>
                </Container>

            </Container>
        </Container>
    );
}

export default Login;