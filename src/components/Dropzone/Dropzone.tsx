import { useDropzone } from 'react-dropzone';
import { Box, Divider, Typography, useMediaQuery, useTheme } from '@mui/material';
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
                    <Box
                        display="flex"
                        width="30%"
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        <Divider sx={{ width: '35%' }} />
                        <Typography>or</Typography>
                        <Divider sx={{ width: '35%' }} />
                    </Box>
                </>
            )}
            <Typography>Click to select a file</Typography>
        </DropzoneContainer>
    );
};
