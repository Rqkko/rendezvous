import { Box, Button, Container, Divider, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom';

import SquareTextfield from '../components/SquareTextfield'
import OpaqueButton from '../components/OpaqueButton'
import { useState } from 'react';
import logo from '../assets/logo.png';

interface UserDTO {
    firstname: string;
    lastname: string;
    phone: string;
    email: string;
    password: string;
}

function CreateAccount() {
    const navigate = useNavigate();
    const [firstname, setFirstname] = useState<string>("");
    const [lastname, setLastname] = useState<string>("");
    const [phone, setPhone] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");

    function handleKeyPress(event: React.KeyboardEvent<HTMLInputElement>): void {
        if (event.key === 'Enter') {
            handleRegister();
        }
    };

    function handleRegister(): void {
        // Add validation for the fields
        if (firstname === "" || lastname === "" || phone === "" || email === "" || password === "" || confirmPassword === "") {
            alert("Please fill in all fields");
            return;
        }
    
        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        const payload: UserDTO = {
            firstname: firstname,
            lastname: lastname,
            phone: phone,
            email: email,
            password: password
        };

        fetch('/api/user/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        }).then(response => {
            if (response.ok) {
                alert("Account created successfully");
                navigate('/login');
            } else {
                alert("An error occurred. Please try again later.");
            }
        }).catch(error => {
            console.error('Error:', error);
            alert("An error occurred. Please try again later.");
        });
    }

    return (
        <Container sx= {{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            mb: 4,
        }}>
                <Box
                    component="img"
                    alt="Rendezvous Logo"
                    src={logo}
                    sx={{ width: '50%', maxWidth: '400px' }}
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
                        Please Enter Your Details
                    </Typography>

                    <SquareTextfield 
                        placeholder="Firstname"
                        style={{ mt: 2, width: '100%' }}
                        value={firstname}
                        handleChange={(event) => setFirstname(event.target.value)}
                        handleKeyDown={(event) => handleKeyPress(event)}
                    />

                    <SquareTextfield 
                        placeholder="Lastname"
                        style={{ mt: 2, width: '100%' }}
                        value={lastname}
                        handleChange={(event) => setLastname(event.target.value)}
                        handleKeyDown={(event) => handleKeyPress(event)}
                    />

                    <SquareTextfield 
                        placeholder="Phone Number"
                        style={{ mt: 2, width: '100%' }}
                        value={phone}
                        handleChange={(event) => setPhone(event.target.value)}
                        handleKeyDown={(event) => handleKeyPress(event)}
                    />

                    <SquareTextfield 
                        placeholder="Email"
                        style={{ mt: 2, width: '100%' }}
                        value={email}
                        handleChange={(event) => setEmail(event.target.value)}
                        handleKeyDown={(event) => handleKeyPress(event)}
                    />

                    <SquareTextfield 
                        placeholder="Password"
                        style={{ mt: 2, width: '100%' }}
                        value={password}
                        handleChange={(event) => setPassword(event.target.value)}
                        handleKeyDown={(event) => handleKeyPress(event)}
                        type="password"
                    />

                    <SquareTextfield 
                        placeholder="Confirm Password"
                        style={{ mt: 2, width: '100%' }}
                        value={confirmPassword}
                        handleChange={(event) => setConfirmPassword(event.target.value)}
                        handleKeyDown={(event) => handleKeyPress(event)}
                        type="password"
                    />

                    <OpaqueButton 
                        handleClick={handleRegister}
                        text="Create Account"
                        style={{ mt: 3, width: '50%', alignSelf: 'center' }}
                    />

                    <Divider sx={{ mt: 3, width: '100%', borderWidth: 1, borderColor: 'black' }} />
                    <Typography color="black" sx={{ mt: 2 }}>
                        Already have an account?
                        <Button 
                            variant="text" 
                            sx={{ 
                                color: 'black', 
                                textTransform: 'none', 
                                textDecoration: 'underline',
                                ml: 1
                            }}
                            onClick={() => navigate('/login')}
                        >
                            Login Here
                        </Button>
                    </Typography>
                </Box>
        </Container>
    )
}

export default CreateAccount