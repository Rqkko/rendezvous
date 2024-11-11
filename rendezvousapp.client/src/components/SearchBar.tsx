import { IconButton, InputBase, Paper, SxProps } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search';

interface SearchBarProps {
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onSearch: () => void;
    style?: SxProps;
}

function SearchBar({ value, onChange, onSearch, style }: SearchBarProps): JSX.Element {
    function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>): void {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent from submitting form
            onSearch();
        }
    }

    return (
        <Paper
            component="form"
            // Replace predefined sx if style is provided
            sx={
                style
                    ? style
                    : {
                        p: '2px 4px',
                        display: 'flex',
                        alignItems: 'center',
                        width: '600px',
                        height: '70px',
                        mx: 'auto',
                        mb: 4,
                        borderRadius: '20px',
                    }
            }
        >
            <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Search Locations"
            inputProps={{ 'aria-label': 'search locations' }}
            value={value}
            onChange={onChange}
            onKeyDown={handleKeyDown}
            />
            <IconButton
            type="button"
            sx={{ p: '10px' }}
            aria-label="search"
            onClick={onSearch}
            >
            <SearchIcon />
            </IconButton>
        </Paper>
    )
}

export default SearchBar    