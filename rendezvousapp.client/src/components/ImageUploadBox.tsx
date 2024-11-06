import React from 'react';
import { styled, ButtonBase } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import imageUploadPlaceholder from '../assets/imageUpload_placeholder.png';

const placeholderImage = '../assets/imageUpload_placeholder.png';

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


function ImageUploadBox(): JSX.Element {
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const [image, setImage] = React.useState<string>(placeholderImage);

    function handleUploadClick(): void {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    }

    return (
        <ImageButton
            focusRipple
            style={{
                height: 400,
                width: 500,
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
                onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                            setImage(reader.result as string);
                        };
                        reader.readAsDataURL(file);
                    }
                }}
                accept="image/*"
                multiple
            />
        </ImageButton>
    )
}

export default ImageUploadBox