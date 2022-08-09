import { useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    InputAdornment,
    TextField,
    Tooltip,
    Typography,
} from '@mui/material';
import { Info } from '@mui/icons-material';
import { RouteName } from '../../enums';
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
import { Dropzone } from '../Dropzone';
import { UploadMapDialogImagePreview } from './style';

interface StateProps {
    isUploadMapDialogOpen: boolean;
    currentProjectMaps: ReturnType<typeof getCurrentProjectMaps>;
    currentProjectAllRegions: ReturnType<typeof getCurrentProjectAllRegions>;
}

interface DispatchProps {
    closeUploadMapDialog: () => void;
    saveImage: typeof saveImage;
    addMap: typeof addMap;
    setActiveMapId: typeof setActiveMapId;
    openAlertDialog: typeof openAlertDialog;
}

type UploadMapDialogProps = StateProps & DispatchProps;

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
    const navigate = useNavigate();

    const [mapId, setMapId] = useState('');
    const [mapName, setMapName] = useState('');

    const [uploadedImage, setUploadedImage] = useState<File | null>(null);
    const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);

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

    const handleFileDrop = (files: File[]) => {
        if (files.length === 1) {
            setUploadedImage(files[0]);
            setUploadedImageUrl(URL.createObjectURL(files[0]));
        }
    };

    const isConfirmDisabled = !mapName || !uploadedImageUrl;

    return (
        <Dialog onClose={clearAndCloseDialog} open={isUploadMapDialogOpen}>
            <DialogTitle>Upload Root Map</DialogTitle>
            <DialogContent sx={{ width: '600px', maxWidth: '100%' }}>
                <Typography variant="body1">Enter the details of the root map.</Typography>
                <Typography variant="body2">
                    <i>
                        Note: if this map is a sub-region of another map, you should rather upload
                        is by defining a region on the parent map. A root map is a map of the
                        highest order - for example, a map of the contry/continent/planet.
                    </i>
                </Typography>
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
        </Dialog>
    );
};

export const UploadMapDialog = connect(
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
)(UploadMapDialogBase);
