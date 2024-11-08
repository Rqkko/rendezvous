import React, { useRef, useState } from 'react';
import { styled } from '@mui/material/styles';
import ButtonBase from '@mui/material/ButtonBase';
import AddIcon from '@mui/icons-material/Add';
import imageUploadPlaceholder from '../assets/imageUpload_placeholder.png';

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
            opacity: 0.1, // Adjust the opacity for hover effect
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

const ImageBackdrop = styled('span')(({ theme }) => ({
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: theme.palette.common.black,
    opacity: 0,
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
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [image, setImage] = useState<string>(imageUploadPlaceholder);
    const [hover, setHover] = useState<boolean>(false);
    const [dragging, setDragging] = useState<boolean>(false);

    function handleUploadClick(): void {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    }

    function handleFileUpload(event: React.ChangeEvent<HTMLInputElement> | React.DragEvent<HTMLButtonElement>): void {
        const files = 'dataTransfer' in event ? event.dataTransfer?.files : event.target.files;
        const file = files?.[0];
        console.log(file);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                const imageString = base64String.split(',')[1]; // Remove the data URL prefix
                setImage(base64String);
                onUpload(imageString);
            };
            reader.readAsDataURL(file);
        }
    }

    function handleDragOver(event: React.DragEvent<HTMLButtonElement>): void {
        event.preventDefault();
        setDragging(true);
    }

    function handleDragLeave(): void {
        setDragging(false);
    }

    function handleDrop(event: React.DragEvent<HTMLButtonElement>): void {
        event.preventDefault();
        setDragging(false);
        handleFileUpload(event);
    }

    return (
        <ImageButton
            focusRipple
            style={{
                height: 400,
                width: 500,
                marginBottom: 20,
                border: dragging ? '2px dashed #000' : 'none', // Add dashed border when dragging
            }}
            onClick={handleUploadClick}
            onPointerEnter={() => setHover(true)}
            onPointerLeave={() => setHover(false)}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <ImageSrc 
                style={{
                    backgroundImage: `url(${image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: image === imageUploadPlaceholder ? 'brightness(80%)' : 'none', // Darken the placeholder image
                }} 
            />

            <ImageBackdrop className="MuiImageBackdrop-root" />

            {(image === imageUploadPlaceholder || hover) && (
                <Image>
                    <AddIcon style={{ fontSize: 100 }} />
                </Image>
            )}

            <VisuallyHiddenInput
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*"
                multiple
            />
        </ImageButton>
    );
}

export default ImageUploadBox;