import { Container } from '@mui/material'

function Header(): JSX.Element {
    return (
        <Container sx={{ bgcolor: 'black'}}>
            <h1>Rendezvous</h1>
        </Container>
    );
}

export default Header;