import { useEffect, useState } from 'react';
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
    getCurrentProjectRegionsByMap,
    getIsUploadMapDialogOpen,
    getUploadMapDialogType,
    openAlertDialog,
    saveImage,
    setActiveMapId,
} from '../../state';
import { DropzoneWithPreview } from '../DropzoneWithPreview';
import { UploadMapDialogDropzoneContainer } from './style';

const connectUploadMapDialog = connect(
    createStructuredSelector({
        isUploadMapDialogOpen: getIsUploadMapDialogOpen,
        uploadMapDialogType: getUploadMapDialogType,
        maps: getCurrentProjectMaps,
        allRegions: getCurrentProjectAllRegions,
        regionsByMap: getCurrentProjectRegionsByMap,
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

const ROOT_MAP_DESCRIPTION =
    'A root map is a map of the highest order - for example, a map of the contry/continent/planet. If this map is a sub-region of another map, you should rather upload is by defining a region on the parent map.';
const CHILD_MAP_DESCRIPTION =
    'Child maps should be used for regions that have their own maps provided. For example, a region representing a house on a city map can have one or several child maps for its floor plan.';

const UploadMapDialogBase: React.FC<UploadMapDialogProps> = ({
    isUploadMapDialogOpen,
    uploadMapDialogType,
    maps,
    allRegions,
    regionsByMap,
    closeUploadMapDialog,
    saveImage,
    addMap,
    setActiveMapId,
    openAlertDialog,
}) => {
    const { setMap, getUrlParts } = useUrlNavigation();
    const { regionId, activeMapId } = getUrlParts();

    const [newMapId, setNewMapId] = useState('');
    const [newMapName, setNewMapName] = useState('');
    const [newMapFloor, setNewMapFloor] = useState('');

    const [uploadedImage, setUploadedImage] = useState<File | null>(null);

    useEffect(() => {
        if (!isUploadMapDialogOpen) {
            return;
        }

        let computedMapId = '';
        let computedMapName = '';

        if (regionId) {
            computedMapId = regionId;
        }

        const region = activeMapId && regionId ? regionsByMap[activeMapId][regionId] : null;
        if (region) {
            computedMapId = region.id;
            computedMapName = region.name;
        }

        setNewMapId(uploadMapDialogType === 'child' ? computedMapId : '');
        setNewMapName(uploadMapDialogType === 'child' ? computedMapName : '');
        setNewMapFloor('');
        setUploadedImage(null);
    }, [isUploadMapDialogOpen, uploadMapDialogType, activeMapId, regionId, regionsByMap]);

    const handleCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewMapId(event.target.value);
    };
    const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewMapName(event.target.value);
    };
    const handleFloorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewMapFloor(event.target.value);
    };

    const handleConfirmClick = () => {
        const existingMap = maps[newMapId];
        const existingRegion = allRegions.find((region) => region.id === newMapId);

        if (existingMap) {
            openAlertDialog(`Map with code "${newMapId}" (${existingMap.name}) already exists.`);
            return;
        }

        if (existingRegion && uploadMapDialogType === 'root') {
            openAlertDialog(
                `Region with code "${newMapId}" (${existingRegion.name}) already exists.`
            );
            return;
        }

        if (
            uploadMapDialogType === 'child' &&
            Object.values(maps).find((map) => map.parent === regionId) &&
            !newMapFloor
        ) {
            openAlertDialog(
                'All child maps of a region with multiple maps must have a floor number.'
            );
            return;
        }

        if (!uploadedImage) {
            openAlertDialog('Error while reading uploaded image.');
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            const id = newMapId || newMapName.toLowerCase().replaceAll(' ', '-');
            const imageDataUrl = reader.result as string;

            if (!imageDataUrl) {
                openAlertDialog('Error while reading uploaded image.');
                return;
            }

            addMap({
                id,
                name: newMapName,
                floorNumber: newMapFloor || null,
                parent: uploadMapDialogType === 'child' ? regionId : null,
            });

            saveImage({ id, imageDataUrl });
            setActiveMapId(id);

            setMap(id);
            closeUploadMapDialog();
        };
        reader.readAsDataURL(uploadedImage);
    };

    const handleFileDrop = (file: File) => setUploadedImage(file);

    const isConfirmDisabled = !newMapName || !uploadedImage;

    const title = uploadMapDialogType === 'root' ? 'Upload root map' : 'Upload child map';
    const description =
        uploadMapDialogType === 'root' ? ROOT_MAP_DESCRIPTION : CHILD_MAP_DESCRIPTION;

    return (
        <Dialog onClose={closeUploadMapDialog} open={isUploadMapDialogOpen}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent sx={{ width: '575px', maxWidth: '100%' }}>
                <DialogContentText>{description}</DialogContentText>
                <Box pt={1} pb={2} width="100%" display="flex" justifyContent="space-between">
                    <TextField
                        variant="filled"
                        size="small"
                        sx={{ width: uploadMapDialogType === 'root' ? '23%' : '22%' }}
                        label="Code"
                        value={newMapId}
                        onChange={handleCodeChange}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <Tooltip
                                        title={
                                            uploadMapDialogType === 'root'
                                                ? 'A unique short identifier of the map'
                                                : 'A short identifier of the map, usually the same as the code of its parent region.'
                                        }
                                    >
                                        <Info fontSize="small" />
                                    </Tooltip>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <TextField
                        variant="filled"
                        size="small"
                        sx={{ width: uploadMapDialogType === 'root' ? '73%' : '52%' }}
                        label="Title"
                        required
                        value={newMapName}
                        onChange={handleTitleChange}
                    />
                    {uploadMapDialogType === 'child' && (
                        <TextField
                            variant="filled"
                            size="small"
                            sx={{ width: '22%' }}
                            label="Floor"
                            value={newMapFloor}
                            onChange={handleFloorChange}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <Tooltip title="One region can have multiple maps, usually distinguished by their floor number.">
                                            <Info fontSize="small" />
                                        </Tooltip>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    )}
                </Box>
                <UploadMapDialogDropzoneContainer>
                    <DropzoneWithPreview onDrop={handleFileDrop} />
                </UploadMapDialogDropzoneContainer>
            </DialogContent>
            <DialogActions>
                <Button color="inherit" onClick={closeUploadMapDialog}>
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
