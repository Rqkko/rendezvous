import { SxProps, TextField } from "@mui/material";

interface DefaultTextFieldProps {
    placeholder?: string;
    style?: SxProps;
}

function DefaultTextField({ placeholder, style }: DefaultTextFieldProps) {
    return (
        <TextField
            placeholder={placeholder}
            sx = {{ 
                bgcolor: 'white',
                ...style
            }}
            variant = "filled"
        />
    )
}

export default DefaultTextField;