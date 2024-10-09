import Button from "@mui/material/Button";

interface OpaqueButtonProps {
    handleClick: () => void;
}

function OpaqueButton({ handleClick }: OpaqueButtonProps) {
    return (
        <Button
        variant="contained"
        color="primary"
        sx={{ mt: 2 }}
        onClick={() => {
            handleClick();
        }}
        >
        Go to Login Page
        </Button>
    )
}

export default OpaqueButton;