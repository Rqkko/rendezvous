import { Box, Button, Container, Divider, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom';

import SquareTextfield from '../components/SquareTextfield'
import OpaqueButton from '../components/OpaqueButton'
import { useState } from 'react';
import logo from '../assets/logo.png';

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
        // TODO

    }

    return (
        <Container sx= {{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
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
                        type="password"
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