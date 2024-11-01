import { Container, IconButton, InputBase, Paper, Typography } from '@mui/material';
import React from 'react'
import SearchIcon from '@mui/icons-material/Search';

function Reservations(): JSX.Element {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState<string>('');

    function handleInputChange(event: React.ChangeEvent<HTMLInputElement>): void {
        setSearchTerm(event.target.value);
    };

    function handleSearchChange(): void {
        setSearchQuery(searchTerm);
    };

    // TODO
    // const filteredReservations = reservations.filter(reservation =>
    //     reservation.locationName.toLowerCase().includes(searchQuery.toLowerCase())
    // );

    return (
        <Container 
            sx={{
                overflow: 'hidden',
                width: '100vw',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
        }}
    >
        <Typography variant="h2" sx={{ mb: 4}}>My Reservations</Typography>

        <Paper
            component="form"
            sx={{ 
                p: '2px 4px',
                display: 'flex',
                alignItems: 'center',
                width: '600px',
                height: '70px',
                mx: 'auto',
                mb: 4,
                borderRadius: '20px'
            }}
        >
            <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder="Search Reservations"
                inputProps={{ 'aria-label': 'search reservations' }}
                value={searchTerm}
                onChange={handleInputChange}
            />
            <IconButton 
                type="button"
                sx={{ p: '10px' }}
                aria-label="search"
                onClick={handleSearchChange}
            >
                <SearchIcon />
            </IconButton>
        </Paper>
    </Container>
    );
}

export default Reservations;