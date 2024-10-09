import { SxProps } from "@mui/material";
import Button from "@mui/material/Button";

interface OpaqueButtonProps {
    handleClick: () => void;
    style?: SxProps;
}

function OpaqueButton({ handleClick, style }: OpaqueButtonProps) {
    return (
        <Button
        variant="contained"
        color="primary"
        sx={{ mt: 2, ...style }}
        onClick={() => {
            handleClick();
        }}
        >
        Go to Login Page
        </Button>
    )
}

export default OpaqueButton;