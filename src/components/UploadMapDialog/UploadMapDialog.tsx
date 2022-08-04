import { useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
} from '@mui/material';
import { closeUploadMapDialog, getIsUploadMapDialogOpen, saveImage } from '../../state';
import { Dropzone } from '../Dropzone';
import { UploadMapDialogImagePreview } from './style';

interface StateProps {
    isUploadMapDialogOpen: boolean;
}

interface DispatchProps {
    closeUploadMapDialog: () => void;
    saveImage: typeof saveImage;
}

type UploadMapDialogProps = StateProps & DispatchProps;

const UploadMapDialogBase: React.FC<UploadMapDialogProps> = ({
    isUploadMapDialogOpen,
    closeUploadMapDialog,
    saveImage,
}) => {
    const [regionId, setRegionId] = useState('');
    const [regionName, setRegionName] = useState('');

    const [uploadedImage, setUploadedImage] = useState<File | null>(null);
    const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);

    const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
    const [alertDialogMessage, setAlertDialogMessage] = useState('');

    const closeAlertDialog = () => setIsAlertDialogOpen(false);

    const handleCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRegionId(event.target.value);
    };
    const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRegionName(event.target.value);
    };

    const clearFields = () => {
        setRegionId('');
        setRegionName('');
        setUploadedImage(null);
        setUploadedImageUrl(null);
    };

    const clearAndCloseDialog = () => {
        closeUploadMapDialog();
        window.setTimeout(clearFields, 300);
    };

    const handleCancelClick = () => {
        clearAndCloseDialog();
    };

    const handleConfirmClick = () => {
        const existingRegion = null;
        if (existingRegion) {
            setIsAlertDialogOpen(true);
            setAlertDialogMessage(
                `Region with code "${regionId}" (${existingRegion}) already exists.`
            );
            return;
        }

        if (!uploadedImage) {
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            const id = regionId || regionName.toLowerCase().replaceAll(' ', '-');
            const imageDataUrl = reader.result as string;

            if (!imageDataUrl) {
                setIsAlertDialogOpen(true);
                setAlertDialogMessage('Unable to upload image.');
                return;
            }

            // TODO: Save region info to regions
            saveImage({ id, imageDataUrl });

            clearAndCloseDialog();
        };
        reader.readAsDataURL(uploadedImage);
    };

    const handleFileDrop = (files: File[]) => {
        if (files.length === 1) {
            setUploadedImage(files[0]);
            setUploadedImageUrl(URL.createObjectURL(files[0]));
        }
    };

    const isConfirmDisabled = !regionName || !uploadedImageUrl;

    return (
        <Dialog onClose={closeUploadMapDialog} open={isUploadMapDialogOpen}>
            <DialogTitle>Upload New Map</DialogTitle>
            <DialogContent sx={{ width: '600px', maxWidth: '100%' }}>
                <DialogContentText>Enter the details of the new map.</DialogContentText>
                <Box pt={1} pb={2} width="100%" display="flex" justifyContent="space-between">
                    <TextField
                        variant="filled"
                        sx={{ width: '23%' }}
                        label="Code"
                        value={regionId}
                        onChange={handleCodeChange}
                    />
                    <TextField
                        variant="filled"
                        sx={{ width: '73%' }}
                        label="Title"
                        required
                        value={regionName}
                        onChange={handleTitleChange}
                    />
                </Box>
                <Box
                    width="100%"
                    height="256px"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                >
                    {uploadedImageUrl === null ? (
                        <Dropzone onDrop={handleFileDrop} />
                    ) : (
                        <UploadMapDialogImagePreview src={uploadedImageUrl} />
                    )}
                </Box>
            </DialogContent>
            <DialogActions>
                <Button color="inherit" onClick={handleCancelClick}>
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    disabled={isConfirmDisabled}
                    onClick={handleConfirmClick}
                >
                    Confirm
                </Button>
            </DialogActions>
            <Dialog open={isAlertDialogOpen} onClose={closeAlertDialog}>
                <DialogTitle>Error</DialogTitle>
                <DialogContent>
                    <DialogContentText>{alertDialogMessage}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeAlertDialog}>OK</Button>
                </DialogActions>
            </Dialog>
        </Dialog>
    );
};

export const UploadMapDialog = connect(
    createStructuredSelector({
        isUploadMapDialogOpen: getIsUploadMapDialogOpen,
    }),
    {
        closeUploadMapDialog,
        saveImage,
    }
)(UploadMapDialogBase);
