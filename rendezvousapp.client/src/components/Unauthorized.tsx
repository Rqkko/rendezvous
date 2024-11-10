import error401 from '../assets/error_401.png'
import { Box, Container, Typography } from '@mui/material'

function Unauthorized() {
    return (
        <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <Typography variant="h2" sx={{ mt: 4, mb: 2 }}>Unauthorized</Typography>
            
            <Box sx={{ 
                width: '40%',
                paddingBottom: '30%',
                backgroundImage: `url(${error401})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }} />
        </Container>
    )
}

export default Unauthorized