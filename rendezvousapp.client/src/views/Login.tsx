import { Box, Container, Typography } from "@mui/material";
import logo from '../assets/logo.png';
import DefaultTextField from "../components/DefaultTextfield";
import OpaqueButton from "../components/OpaqueButton";
import { useNavigate } from "react-router-dom";
import { Widgets } from "@mui/icons-material";

function Login() {
    const navigate = useNavigate();

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
                        width: '50vh',
                        bgcolor: 'black'
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
                    />

                    <DefaultTextField 
                        placeholder="Password"
                        style = {{ mt: 4, alignSelf: 'center' }}
                    />

                    <OpaqueButton 
                        handleClick={() => navigate("/")}
                        text="Login"
                        style={{ alignSelf: 'center', mt: 4 }}
                    />
                </Container>

            </Container>
        </Container>
    );
}

export default Login;