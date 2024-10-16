import { Box, Container, Typography, Divider, Button } from "@mui/material";
import logo from '../assets/logo.png';
import DefaultTextField from "../components/CustomTextfield";
import OpaqueButton from "../components/OpaqueButton";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Login() {
    const navigate = useNavigate();

    const [contact, setContact] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    
    function handleContact(event: React.ChangeEvent<HTMLInputElement>): void {
        setContact(event.target.value);
    };
    function handlePassword(event: React.ChangeEvent<HTMLInputElement>): void {
        setPassword(event.target.value);
    };
    function handleLogin(): void {
        if (contact === "" || password === "") {
            alert("Please fill in all fields");
            return;
        }

        // Check for user in database
        fetch(`/api/user/login/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ contact, password }),
        })
        .then((response) => {
            if (!response.ok) {
                return response.json().then((data) => {
                    throw new Error(data.message);
                });
            }
            return response.json();
        })
        .then(() => {
            navigate('/');
        })
        .catch((error) => {
            alert(error.message);
        });
    }

    return (
        <Container
            sx={{ 
                overflow: 'hidden', 
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    maxWidth: '1200px',
                }}
            >
                <Box
                    component="img"
                    alt="Rendezvous Logo"
                    src={logo}
                    sx={{ width: '50%', maxWidth: '400px', mr: 4 }}
                />

                <Box 
                    sx={{ 
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        width: '50%',
                    }}
                >
                    <Typography 
                        variant="h2"
                        color="black"
                    >
                        WELCOME!
                    </Typography>

                    <Typography 
                        variant="h4"
                        color="black"
                        sx={{ mt: 2, mb: 4 }}
                    >
                        Please log in
                    </Typography>

                    <DefaultTextField 
                        placeholder="Email / phone no."
                        style={{ mt: 2, width: '100%' }}
                        value={contact}
                        handleChange={handleContact}
                    />

                    <DefaultTextField 
                        placeholder="Password"
                        style={{ mt: 2, width: '100%' }}
                        value={password}
                        handleChange={handlePassword}
                        type="password"
                    />

                    <OpaqueButton 
                        handleClick={handleLogin}
                        text="Login"
                        style={{ mt: 3, width: '50%', alignSelf: 'center' }}
                    />

                    <Divider sx={{ mt: 3, width: '100%', borderWidth: 1, borderColor: 'black' }} />
                    <Typography color="black" sx={{ mt: 2 }}>
                        Don't have an account? 
                        <Button 
                            variant="text" 
                            sx={{ 
                                color: 'black', 
                                textTransform: 'none', 
                                textDecoration: 'underline',
                                ml: 1
                            }}
                        >
                            Create One
                        </Button>
                    </Typography>
                </Box>
            </Box>
        </Container>
    );
}

export default Login;