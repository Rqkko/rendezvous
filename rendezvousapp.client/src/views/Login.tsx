import { Box, Container, Typography } from "@mui/material";
import logo from '../assets/logo.png';

function Login() {
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
                    flex: 'row', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    height: '100%',
                }}
            >
                <Box
                    component="img"
                    alt = "Rendezvous Logo"
                    src = {logo}
                    sx={{ width: 500, height: 500, mr: 2 }}
                />

                <Typography>Login Form</Typography>

            </Container>
        </Container>
    );
}

export default Login;