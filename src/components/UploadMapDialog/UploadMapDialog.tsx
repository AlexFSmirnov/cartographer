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
    InputAdornment,
    TextField,
    Tooltip,
} from '@mui/material';
import { Info } from '@mui/icons-material';
import { StoreProps } from '../../types';
import { RouteName } from '../../enums';
import { useUrlNavigation } from '../../hooks';
import {
    addMap,
    closeUploadMapDialog,
    getCurrentProjectAllRegions,
    getCurrentProjectMaps,
    getIsUploadMapDialogOpen,
    openAlertDialog,
    saveImage,
    setActiveMapId,
} from '../../state';
import { DropzoneWithPreview } from '../DropzoneWithPreview';
import { UploadMapDialogDropzoneContainer } from './style';

const connectUploadMapDialog = connect(
    createStructuredSelector({
        isUploadMapDialogOpen: getIsUploadMapDialogOpen,
        currentProjectMaps: getCurrentProjectMaps,
        currentProjectAllRegions: getCurrentProjectAllRegions,
    }),
    {
        openAlertDialog,
        closeUploadMapDialog,
        saveImage,
        addMap,
        setActiveMapId,
    }
);

type UploadMapDialogProps = StoreProps<typeof connectUploadMapDialog>;

const UploadMapDialogBase: React.FC<UploadMapDialogProps> = ({
    isUploadMapDialogOpen,
    currentProjectMaps,
    currentProjectAllRegions,
    closeUploadMapDialog,
    saveImage,
    addMap,
    setActiveMapId,
    openAlertDialog,
}) => {
    const { navigate } = useUrlNavigation();

    const [mapId, setMapId] = useState('');
    const [mapName, setMapName] = useState('');

    const [uploadedImage, setUploadedImage] = useState<File | null>(null);

    const handleCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setMapId(event.target.value);
    };
    const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setMapName(event.target.value);
    };

    const clearFields = () => {
        setMapId('');
        setMapName('');
        setUploadedImage(null);
    };

    const clearAndCloseDialog = () => {
        closeUploadMapDialog();
        window.setTimeout(clearFields, 300);
    };

    const handleCancelClick = () => {
        clearAndCloseDialog();
    };

    const handleConfirmClick = () => {
        const existingRegion =
            currentProjectMaps[mapId] ||
            currentProjectAllRegions.find((region) => region.id === mapId);

        if (existingRegion) {
            openAlertDialog(`Region with code "${mapId}" (${existingRegion.name}) already exists.`);
            return;
        }

        if (!uploadedImage) {
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            const id = mapId || mapName.toLowerCase().replaceAll(' ', '-');
            const imageDataUrl = reader.result as string;

            if (!imageDataUrl) {
                openAlertDialog('Unable to upload image.');
                return;
            }

            saveImage({ id, imageDataUrl });
            addMap({ id, name: mapName, floorNumber: null, parent: null });
            setActiveMapId(id);

            navigate(`/${RouteName.Map}/${id}`);
            clearAndCloseDialog();
        };
        reader.readAsDataURL(uploadedImage);
    };

    const handleFileDrop = (file: File) => setUploadedImage(file);

    const isConfirmDisabled = !mapName || !uploadedImage;

    return (
        <Dialog onClose={clearAndCloseDialog} open={isUploadMapDialogOpen}>
            <DialogTitle>Upload root map</DialogTitle>
            <DialogContent sx={{ width: '600px', maxWidth: '100%' }}>
                <DialogContentText>
                    A root map is a map of the highest order - for example, a map of the
                    contry/continent/planet. If this map is a sub-region of another map, you should
                    rather upload is by defining a region on the parent map.
                </DialogContentText>
                <Box pt={1} pb={2} width="100%" display="flex" justifyContent="space-between">
                    <TextField
                        variant="filled"
                        size="small"
                        sx={{ width: '23%' }}
                        label="Code"
                        value={mapId}
                        onChange={handleCodeChange}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <Tooltip title="A unique short identifier of the map">
                                        <Info fontSize="small" />
                                    </Tooltip>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <TextField
                        variant="filled"
                        size="small"
                        sx={{ width: '73%' }}
                        label="Title"
                        required
                        value={mapName}
                        onChange={handleTitleChange}
                    />
                </Box>
                <UploadMapDialogDropzoneContainer>
                    <DropzoneWithPreview onDrop={handleFileDrop} />
                </UploadMapDialogDropzoneContainer>
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
        </Dialog>
    );
};

export const UploadMapDialog = connectUploadMapDialog(UploadMapDialogBase);
