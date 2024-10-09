import { SxProps } from "@mui/material";
import Button from "@mui/material/Button";

interface OpaqueButtonProps {
    handleClick: () => void;
    style?: SxProps;
    text: string;
}

function OpaqueButton({ handleClick, style, text }: OpaqueButtonProps) {
    return (
        <Button
        variant="contained"
        color="secondary"
        sx={{ mt: 2, ...style }}
        onClick={() => {
            handleClick();
        }}
        >
        {text}
        </Button>
    )
}

export default OpaqueButton;