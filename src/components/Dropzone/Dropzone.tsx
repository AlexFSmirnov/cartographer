import { useDropzone } from 'react-dropzone';
import { Divider, Typography, useMediaQuery, useTheme } from '@mui/material';
import { FlexBox } from '../FlexBox';
import { DropzoneContainer } from './style';

interface DropzoneProps {
    onDrop: (files: File[]) => void;
}

export const Dropzone: React.FC<DropzoneProps> = ({ onDrop }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/png': ['.png'],
            'image/jpeg': ['.jpeg'],
        },
        multiple: false,
    });

    const borderColor = isDragActive ? theme.palette.primary.main : theme.palette.text.secondary;

    return (
        <DropzoneContainer {...getRootProps()} borderColor={borderColor}>
            <input {...getInputProps()} />
            {!isMobile && (
                <>
                    <Typography>Drag&Drop a file into this area</Typography>
                    <FlexBox width="30%" alignX="space-between" alignY="center">
                        <Divider sx={{ width: '35%' }} />
                        <Typography>or</Typography>
                        <Divider sx={{ width: '35%' }} />
                    </FlexBox>
                </>
            )}
            <Typography>Click to select a file</Typography>
        </DropzoneContainer>
    );
};
