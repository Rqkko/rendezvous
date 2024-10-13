import { SxProps, TextField } from "@mui/material";

interface DefaultTextFieldProps {
    placeholder?: string;
    style?: SxProps;
    value: string;
    handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

function DefaultTextField({ placeholder, style, value, handleChange }: DefaultTextFieldProps) {

    return (
        <TextField
            placeholder={placeholder}
            sx = {{ 
                bgcolor: 'white',
                ...style
            }}
            variant = "filled"
            value={value}
            onChange={handleChange}
        />
    )
}

export default DefaultTextField;