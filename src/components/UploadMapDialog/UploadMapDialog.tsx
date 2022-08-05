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
    Typography,
} from '@mui/material';
import {
    addRootRegion,
    closeUploadMapDialog,
    getCurrentProjectRegions,
    getIsUploadMapDialogOpen,
    saveImage,
} from '../../state';
import { Dropzone } from '../Dropzone';
import { UploadMapDialogImagePreview } from './style';

interface StateProps {
    isUploadMapDialogOpen: boolean;
    currentProjectRegions: ReturnType<typeof getCurrentProjectRegions>;
}

interface DispatchProps {
    closeUploadMapDialog: () => void;
    saveImage: typeof saveImage;
    addRootRegion: typeof addRootRegion;
}

type UploadMapDialogProps = StateProps & DispatchProps;

const UploadMapDialogBase: React.FC<UploadMapDialogProps> = ({
    isUploadMapDialogOpen,
    currentProjectRegions,
    closeUploadMapDialog,
    saveImage,
    addRootRegion,
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
        const existingRegion = currentProjectRegions[regionId];
        if (existingRegion) {
            setIsAlertDialogOpen(true);
            setAlertDialogMessage(
                `Region with code "${regionId}" (${existingRegion.name}) already exists.`
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

            saveImage({ id, imageDataUrl });
            addRootRegion({ id, name: regionName });

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
            <DialogTitle>Upload Root Map</DialogTitle>
            <DialogContent sx={{ width: '600px', maxWidth: '100%' }}>
                <Typography variant="body1">Enter the details of the root map.</Typography>
                <Typography variant="body2">
                    <i>
                        Note: if this map is a sub-region of another map, you should rather upload
                        is by defining a region on the parent map. A root map doesn't have a parent
                        and won't have any description or notes.
                    </i>
                </Typography>
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
        currentProjectRegions: getCurrentProjectRegions,
    }),
    {
        closeUploadMapDialog,
        saveImage,
        addRootRegion,
    }
)(UploadMapDialogBase);
