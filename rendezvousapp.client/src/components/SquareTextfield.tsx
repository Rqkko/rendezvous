import { SxProps, TextField } from "@mui/material";

interface DefaultTextFieldProps {
    placeholder?: string;
    style?: SxProps;
    value: string;
    handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string;
}

function SquareTextfield({ placeholder, style, value, handleChange, type }: DefaultTextFieldProps): JSX.Element {

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
            {...(type && { type: type })} // Apply type only if it exists
        />
    )
}

export default SquareTextfield;