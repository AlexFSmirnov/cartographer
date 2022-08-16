import { useTheme } from '@mui/material';
import { useState } from 'react';
import { Dropzone } from '../Dropzone';
import { DropzonePreview } from './style';

interface DropzoneWithPreviewProps {
    onDrop: (file: File) => void;
}

export const DropzoneWithPreview: React.FC<DropzoneWithPreviewProps> = ({ onDrop }) => {
    const theme = useTheme();

    const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);

    const handleFileDrop = (files: File[]) => {
        if (files.length === 1) {
            setUploadedImageUrl(URL.createObjectURL(files[0]));
            onDrop(files[0]);
        }
    };

    if (uploadedImageUrl) {
        return <DropzonePreview src={uploadedImageUrl} shadow={theme.shadows[2]} />;
    }

    return <Dropzone onDrop={handleFileDrop} />;
};
