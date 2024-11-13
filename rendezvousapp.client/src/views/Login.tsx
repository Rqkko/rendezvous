import { Box, Container, Typography, Divider, Button } from "@mui/material";
import OpaqueButton from "../components/OpaqueButton";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import SquareTextfield from "../components/SquareTextfield";
import logo from '../assets/logo.png';

function Login() {
    const navigate = useNavigate();

    const [contact, setContact] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    function formatPhoneNumber(value: string): string {
        // Remove all non-numeric characters
        const cleaned = value.replace(/\D/g, '');

        // Format the cleaned number
        const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);

        if (match) {
            return [match[1], match[2], match[3]].filter(Boolean).join('-');
        }

        return value;
    }

    function cleanContact(contact: string): string {
        if (contact.startsWith("0")) {
            return contact.replace(/-/g, '');
        }
    
        return contact;
    }

    function handleContact(event: React.ChangeEvent<HTMLInputElement>): void {
        const value = event.target.value;

        // Phone number
        if (value.startsWith("0")) {
            if (value.length > 12) {
                return;
            }
    
            // Validate phone number (basic validation for demonstration purposes)
            const phoneRegex = /^[0-9\b-]+$/;
            if (value === '' || phoneRegex.test(value)) {
                setContact(formatPhoneNumber(value));
            }
        }

        // Email
        else {
            setContact(value);
        }
    };

    function handlePassword(event: React.ChangeEvent<HTMLInputElement>): void {
        setPassword(event.target.value);
    };

    function handleKeyPress(event: React.KeyboardEvent<HTMLInputElement>): void {
        if (event.key === 'Enter') {
            handleLogin();
        }
    };
    
    function handleLogin(): void {
        if (contact === "" || password === "") {
            alert("Please fill in all fields");
            return;
        }

        const cleanedContact = cleanContact(contact);

        // Check for user in database
        fetch(`/api/user/login/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ contact: cleanedContact, password }),
        })
        .then((response) => {
            if (!response.ok) {
                return response.json().then((data) => {
                    throw new Error(data.message);
                });
            }
            return response.json();
        })
        .then((data) => {
            if (data.isActive == "True") {
                navigate('/admin');
            } else {
                navigate('/');
            }
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

                    <SquareTextfield 
                        placeholder="Email / phone no."
                        style={{ mt: 2, width: '100%' }}
                        value={contact}
                        handleChange={handleContact}
                        handleKeyDown={(event) => handleKeyPress(event)}
                    />

                    <SquareTextfield 
                        placeholder="Password"
                        style={{ mt: 2, width: '100%' }}
                        value={password}
                        handleChange={handlePassword}
                        handleKeyDown={(event) => handleKeyPress(event)}
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
                            onClick={() => navigate('/register')}
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