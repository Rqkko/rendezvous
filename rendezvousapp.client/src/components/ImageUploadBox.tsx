import React from 'react';
import { styled, ButtonBase } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import placeholder from '../assets/imageUpload_placeholder.png';

const ImageButton = styled(ButtonBase)(({ theme }) => ({
    position: 'relative',
    height: 200,
    [theme.breakpoints.down('sm')]: {
        width: '100% !important', // Overrides inline-style
        height: 100,
    },
    '&:hover, &.Mui-focusVisible': {
        zIndex: 1,
        '& .MuiImageBackdrop-root': {
        opacity: 0.1,
        },
    },
}));

const ImageSrc = styled('span')({
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundSize: 'cover',
    backgroundPosition: 'center 40%',
});

const Image = styled('span')(({ theme }) => ({
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.palette.common.white,
}));

// The black color that is in front of the image
const ImageBackdrop = styled('span')(({ theme }) => ({
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: theme.palette.common.black,
    opacity: 0.4,
    transition: theme.transitions.create('opacity'),
}));

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

interface ImageUploadBoxProps {
    onUpload: (image: string) => void;
}

function ImageUploadBox({ onUpload }: ImageUploadBoxProps): JSX.Element {
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const [image, setImage] = React.useState<string>(placeholder);

    function handleUploadClick(): void {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    }

    function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>): void {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                const imageString = base64String.split(',')[1]; // Remove the data URL prefix
                setImage(base64String);
                onUpload(imageString);
                console.log("UPLOADING")
            };
            reader.readAsDataURL(file);
        }
    }

    return (
        <ImageButton
            focusRipple
            style={{
                height: 400,
                width: 500,
                marginBottom: 20,
            }}
            onClick={handleUploadClick}
        >
            
            <ImageSrc 
                style={{
                    backgroundImage: `url(${image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }} 
            />

            <ImageBackdrop className="MuiImageBackdrop-root" />

            <Image>
                <AddIcon style={{ fontSize: 100 }} />
            </Image>

            <VisuallyHiddenInput
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*"
                multiple
            />
        </ImageButton>
    )
}

export default ImageUploadBox